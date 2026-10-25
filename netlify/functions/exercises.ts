/**
 * GET or POST /api/exercises
 *
 * Get exercises filtered by level, topic, or grammar section.
 * Sections follow curriculum order (grammar_sections.order_in_level); logged-in users get
 * their exercises progressively by order number, after their progress in each section.
 *
 * Parameters (query string for GET, JSON body for POST):
 * - level: A1, A2, B1, B2, C1 (required with topic/grammarSection; without any
 *   filter, omitting it returns random exercises across all levels)
 * - topic: verben, artikel, adjektive, etc. (optional)
 * - grammarSection: grammar section ID (optional)
 * - afterSection: grammar section ID (optional) - for topic/level queries,
 *   sections after it in curriculum order come first, then the earlier ones
 * - userId: user UUID (optional) - for progressive delivery
 * - exclude: exercise IDs not to return, e.g. the ones already shown or queued in this
 *   session (POST: array; GET: comma-separated)
 * - restart: true to ignore the user's progress (starting the curriculum over)
 * - limit: number of exercises (optional)
 *
 * Within a section: logged-in users get the exercises in order (order_number), anonymous
 * visitors the section's starter exercises first (starter_exercises.position, migration 009),
 * then the others in random order.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

type Params = {
  level?: string;
  topic?: string;
  grammarSection?: string;
  afterSection?: string;
  userId?: string;
  exclude?: string[];
  restart?: boolean;
  limit?: number | null;
};

const parseParams = (event: Parameters<Handler>[0]): Params => {
  if (event.httpMethod === 'POST') {
    const b = JSON.parse(event.body || '{}');
    return {
      level: b.level || undefined,
      topic: b.topic || undefined,
      grammarSection: b.grammarSection || undefined,
      afterSection: b.afterSection || undefined,
      userId: b.userId || undefined,
      exclude: Array.isArray(b.exclude) ? b.exclude.filter((id: unknown) => typeof id === 'string') : [],
      restart: b.restart === true,
      limit: b.limit ? parseInt(String(b.limit), 10) : null,
    };
  }
  const q = event.queryStringParameters || {};
  return {
    level: q.level,
    topic: q.topic,
    grammarSection: q.grammarSection,
    afterSection: q.afterSection,
    userId: q.userId,
    exclude: q.exclude ? q.exclude.split(',').filter(Boolean) : [],
    restart: q.restart === 'true' || q.restart === '1',
    limit: q.limit ? parseInt(q.limit, 10) : null,
  };
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const params = parseParams(event);
    const level = params.level?.toUpperCase();
    const topic = params.topic?.toLowerCase();
    const { grammarSection, afterSection, userId, limit } = params;
    const exclude = params.exclude || [];

    if (!level && (grammarSection || topic)) {
      return createResponse(400, { error: 'Level parameter is required when filtering by topic or grammar section' });
    }

    // Sections after `afterSection` come first, then the earlier ones.
    let afterOrder = 0;
    if (afterSection && level) {
      const afterResult = await sql`
        SELECT order_in_level FROM grammar_sections
        WHERE id = ${afterSection} AND level = ${level}
      `;
      if (afterResult.length > 0 && afterResult[0].order_in_level) {
        afterOrder = afterResult[0].order_in_level;
      }
    }

    // Logged-in users get the exercises after their progress in each section, unless restarting.
    const progressive = !!userId && !params.restart;
    // Exercises in order within a section for logged-in users; for anonymous visitors the
    // section's starter exercises first, then random.
    const inOrder = !!userId;
    const anonymousOrder = sql`(se.position IS NULL), se.position, RANDOM()`;

    const result = await sql`
      SELECT
        e.id,
        e.grammar_section_id,
        e.level,
        e.order_number,
        e.text,
        e.content_topic,
        e.model,
        gs.name as grammar_section_name,
        COALESCE(
          (SELECT json_agg(gut.topic)
           FROM grammar_ui_topics gut
           WHERE gut.grammar_section_id = e.grammar_section_id),
          '[]'::json
        ) as grammar_ui_topics,
        json_agg(
          json_build_object(
            'no', eg.gap_number,
            'correct', eg.correct_answer,
            'distractors', eg.distractors,
            'explanation', eg.explanation
          ) ORDER BY eg.gap_number
        ) as gaps
      FROM exercises e
      LEFT JOIN exercise_gaps eg ON e.id = eg.exercise_id
      LEFT JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      ${progressive
        ? sql`LEFT JOIN user_progress up ON up.user_id = ${userId} AND up.grammar_section_id = e.grammar_section_id`
        : sql``}
      ${inOrder ? sql`` : sql`LEFT JOIN starter_exercises se ON se.exercise_id = e.id`}
      WHERE e.is_active = true
        ${level ? sql`AND e.level = ${level}` : sql``}
        ${grammarSection ? sql`AND e.grammar_section_id = ${grammarSection}` : sql``}
        ${topic && !grammarSection
          ? sql`AND EXISTS (
              SELECT 1 FROM grammar_ui_topics gut
              WHERE gut.grammar_section_id = e.grammar_section_id AND gut.topic = ${topic}
            )`
          : sql``}
        ${progressive ? sql`AND e.order_number > COALESCE(up.last_completed_exercise_order, 0)` : sql``}
        ${exclude.length ? sql`AND NOT (e.id = ANY(${exclude}::text[]))` : sql``}
      GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
               e.text, e.content_topic, e.model, gs.name, gs.order_in_level
               ${inOrder ? sql`` : sql`, se.position`}
      ORDER BY
        ${!level
          ? sql`RANDOM()`
          : grammarSection
            ? (inOrder ? sql`e.order_number ASC` : anonymousOrder)
            : sql`(gs.order_in_level <= ${afterOrder}) ASC NULLS LAST,
                  gs.order_in_level ASC NULLS LAST,
                  e.grammar_section_id ASC,
                  ${inOrder ? sql`e.order_number ASC` : anonymousOrder}`}
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;

    // Format the response
    const exercises = result.map((row: any) => ({
      id: row.id,
      level: row.level,
      grammar_section_id: row.grammar_section_id,
      grammar_section_name: row.grammar_section_name,
      grammar_ui_topics: row.grammar_ui_topics,
      content_topic: row.content_topic,
      model: row.model,
      order_number: row.order_number,
      text: row.text,
      gaps: row.gaps.filter((g: any) => g.no !== null), // Remove null gaps
    }));

    return createResponse(200, {
      exercises: exercises,
      count: exercises.length,
      filters: { level, topic, grammarSection, afterSection, limit, restart: !!params.restart, excluded: exclude.length },
    });

  } catch (error) {
    return handleError(error);
  }
};
