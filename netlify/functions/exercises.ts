/**
 * GET /api/exercises
 *
 * Get exercises filtered by level, topic, or grammar section
 * Returns exercises progressively by order number based on user progress
 *
 * Query parameters:
 * - level: A1, A2, B1, B2, C1 (required)
 * - topic: verben, artikel, adjektive, etc. (optional)
 * - grammarSection: grammar section ID (optional)
 * - userId: user UUID (optional) - for progressive delivery
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
    const userId = params.userId;
    const limit = params.limit ? parseInt(params.limit, 10) : null;

    if (!level) {
      return createResponse(400, { error: 'Level parameter is required' });
    }

    // Get user progress to determine starting order number
    let lastCompletedOrder = 0;
    if (userId && grammarSection) {
      const progressResult = await sql`
        SELECT last_completed_exercise_order
        FROM user_progress
        WHERE user_id = ${userId}
          AND grammar_section_id = ${grammarSection}
      `;
      if (progressResult.length > 0 && progressResult[0].last_completed_exercise_order) {
        lastCompletedOrder = progressResult[0].last_completed_exercise_order;
      }
    }

    // Build query with filters
    let result;

    if (grammarSection) {
      // Filter by grammar section (takes priority)
      if (userId) {
        // Progressive delivery for authenticated users
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
            AND e.order_number > ${lastCompletedOrder}
          GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                   e.text, e.content_topic, e.model, gs.name
          ORDER BY e.order_number ASC
          ${limit ? sql`LIMIT ${limit}` : sql``}
        `;
      } else {
        // Random exercises for anonymous users
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
      }
    } else if (topic) {
      // Filter by topic - return exercises progressively from all sections matching the topic
      if (userId) {
        // With user progress tracking
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
            ) as gaps,
            COALESCE(up.last_completed_exercise_order, 0) as user_last_order
          FROM exercises e
          LEFT JOIN exercise_gaps eg ON e.id = eg.exercise_id
          LEFT JOIN grammar_sections gs ON e.grammar_section_id = gs.id
          LEFT JOIN user_progress up ON up.user_id = ${userId}
            AND up.grammar_section_id = e.grammar_section_id
          WHERE e.level = ${level}
            AND e.is_active = true
            AND EXISTS (
              SELECT 1 FROM grammar_ui_topics gut
              WHERE gut.grammar_section_id = e.grammar_section_id
              AND gut.topic = ${topic}
            )
            AND e.order_number > COALESCE(up.last_completed_exercise_order, 0)
          GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                   e.text, e.content_topic, e.model, gs.name, up.last_completed_exercise_order
          ORDER BY e.grammar_section_id ASC, e.order_number ASC
          ${limit ? sql`LIMIT ${limit}` : sql``}
        `;
      } else {
        // Without user tracking - return random exercises
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
      }
    } else {
      // No additional filters - return all exercises for level progressively
      if (userId) {
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
          LEFT JOIN user_progress up ON up.user_id = ${userId}
            AND up.grammar_section_id = e.grammar_section_id
          WHERE e.level = ${level}
            AND e.is_active = true
            AND e.order_number > COALESCE(up.last_completed_exercise_order, 0)
          GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
                   e.text, e.content_topic, e.model, gs.name
          ORDER BY e.grammar_section_id ASC, e.order_number ASC
          ${limit ? sql`LIMIT ${limit}` : sql``}
        `;
      } else {
        // Without user tracking - return random exercises
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
      order_number: row.order_number,
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
