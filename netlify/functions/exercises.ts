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
    const random = params.random === 'true';

    if (!level) {
      return createResponse(400, { error: 'Level parameter is required' });
    }

    // Build query based on filters
    let query = `
      SELECT
        e.id,
        e.grammar_section_id,
        e.level,
        e.order_number,
        e.text,
        e.content_topic,
        e.model,
        gs.name as grammar_section_name,
        json_agg(
          json_build_object(
            'id', eg.id,
            'gap_number', eg.gap_number,
            'correct_answer', eg.correct_answer,
            'distractors', eg.distractors,
            'explanation', eg.explanation
          ) ORDER BY eg.gap_number
        ) as gaps
      FROM exercises e
      LEFT JOIN exercise_gaps eg ON e.id = eg.exercise_id
      LEFT JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      WHERE e.level = $1
        AND e.is_active = true
    `;

    const queryParams: any[] = [level];
    let paramCount = 1;

    // Filter by grammar section if provided (takes priority)
    if (grammarSection) {
      paramCount++;
      query += ` AND e.grammar_section_id = $${paramCount}`;
      queryParams.push(grammarSection);
    }
    // Otherwise filter by topic
    else if (topic) {
      paramCount++;
      query += `
        AND EXISTS (
          SELECT 1 FROM grammar_ui_topics gut
          WHERE gut.grammar_section_id = e.grammar_section_id
          AND gut.topic = $${paramCount}
        )
      `;
      queryParams.push(topic);
    }

    query += `
      GROUP BY e.id, e.grammar_section_id, e.level, e.order_number,
               e.text, e.content_topic, e.model, gs.name
      ORDER BY ${random ? 'RANDOM()' : 'e.order_number'}
    `;

    // If random, limit to 1
    if (random) {
      query += ' LIMIT 1';
    }

    const result = await sql(query, queryParams);

    // Format the response
    const exercises = result.map((row: any) => ({
      id: row.id,
      level: row.level,
      grammar_section_id: row.grammar_section_id,
      grammar_section_name: row.grammar_section_name,
      content_topic: row.content_topic,
      model: row.model,
      text: row.text,
      gaps: row.gaps.filter((g: any) => g.id !== null), // Remove null gaps
    }));

    return createResponse(200, {
      exercises: random ? exercises[0] || null : exercises,
      count: exercises.length,
      filters: { level, topic, grammarSection, random },
    });

  } catch (error) {
    return handleError(error);
  }
};
