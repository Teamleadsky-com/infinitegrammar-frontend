/**
 * GET /api/exercises
 *
 * Get exercises filtered by level, topic, or grammar section
 *
 * Query parameters:
 * - level: A1, A2, B1, B2, C1 (required)
 * - topic: verben, artikel, adjektive, etc. (optional)
 * - grammarSection: grammar section ID (optional)
 * - random: true/false - return random exercise (default: false)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const params = event.queryStringParameters || {};
    const level = params.level?.toUpperCase();
    const topic = params.topic?.toLowerCase();
    const grammarSection = params.grammarSection;
    const limit = params.limit ? parseInt(params.limit, 10) : null;

    if (!level) {
      return createResponse(400, { error: 'Level parameter is required' });
    }

    // Build query with filters
    let result;

    if (grammarSection) {
      // Filter by grammar section (takes priority)
      result = await sql`
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
        WHERE e.level = ${level}
          AND e.is_active = true
          AND e.grammar_section_id = ${grammarSection}
        GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                 e.text, e.content_topic, e.model, gs.name
        ORDER BY RANDOM()
        ${limit ? sql`LIMIT ${limit}` : sql``}
      `;
    } else if (topic) {
      // Filter by topic
      result = await sql`
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
        WHERE e.level = ${level}
          AND e.is_active = true
          AND EXISTS (
            SELECT 1 FROM grammar_ui_topics gut
            WHERE gut.grammar_section_id = e.grammar_section_id
            AND gut.topic = ${topic}
          )
        GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                 e.text, e.content_topic, e.model, gs.name
        ORDER BY RANDOM()
        ${limit ? sql`LIMIT ${limit}` : sql``}
      `;
    } else {
      // No additional filters
      result = await sql`
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
        WHERE e.level = ${level}
          AND e.is_active = true
        GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                 e.text, e.content_topic, e.model, gs.name
        ORDER BY RANDOM()
        ${limit ? sql`LIMIT ${limit}` : sql``}
      `;
    }

    // Format the response
    const exercises = result.map((row: any) => ({
      id: row.id,
      level: row.level,
      grammar_section_id: row.grammar_section_id,
      grammar_section_name: row.grammar_section_name,
      grammar_ui_topics: row.grammar_ui_topics,
      content_topic: row.content_topic,
      model: row.model,
      text: row.text,
      gaps: row.gaps.filter((g: any) => g.no !== null), // Remove null gaps
    }));

    return createResponse(200, {
      exercises: exercises,
      count: exercises.length,
      filters: { level, topic, grammarSection, limit },
    });

  } catch (error) {
    return handleError(error);
  }
};
