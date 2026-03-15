/**
 * GET /api/admin-similarity-heatmap
 *
 * Returns pairwise similarity scores and exercise features for a specific section.
 * Query params: section_id (required), run_id (required)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const sectionId = event.queryStringParameters?.section_id;
    const runId = event.queryStringParameters?.run_id;

    if (!sectionId || !runId) {
      return createResponse(400, { error: 'section_id and run_id are required' });
    }

    // Get exercise IDs for this section/run from pairwise similarity data
    const exerciseIds = await sql`
      SELECT DISTINCT exercise_id FROM (
        SELECT exercise_a_id AS exercise_id
        FROM exercise_pairwise_similarity
        WHERE run_id = ${runId}::uuid
        UNION
        SELECT exercise_b_id
        FROM exercise_pairwise_similarity
        WHERE run_id = ${runId}::uuid
      ) all_ids
      JOIN exercises e ON e.id = all_ids.exercise_id::text
        AND e.grammar_section_id = ${sectionId}
      ORDER BY exercise_id
    `;

    const ids = exerciseIds.map((r: any) => r.exercise_id);

    if (ids.length === 0) {
      return createResponse(200, { pairs: [], features: [] });
    }

    // Get all pairwise scores where both exercises are in this section
    const pairs = await sql`
      SELECT exercise_a_id, exercise_b_id, cosine_similarity
      FROM exercise_pairwise_similarity
      WHERE run_id = ${runId}::uuid
        AND exercise_a_id = ANY(${ids}::uuid[])
        AND exercise_b_id = ANY(${ids}::uuid[])
      ORDER BY cosine_similarity DESC
    `;

    // Get labels with run-specific order_number (falls back to live value for legacy runs)
    const features = await sql`
      SELECT e.id AS exercise_id, e.grammar_section_id, e.level,
             e.text, COALESCE(ero.order_number, e.order_number) AS order_number
      FROM exercises e
      LEFT JOIN exercise_run_order ero
        ON ero.run_id = ${runId}::uuid
        AND ero.exercise_id::text = e.id
      WHERE e.grammar_section_id = ${sectionId}
        AND e.id = ANY(${ids.map(String)})
      ORDER BY e.id
    `;

    return createResponse(200, {
      pairs: pairs.map((row: any) => ({
        exerciseAId: row.exercise_a_id,
        exerciseBId: row.exercise_b_id,
        similarityScore: parseFloat(row.cosine_similarity),
      })),
      features: features.map((row: any) => ({
        exerciseId: row.exercise_id,
        level: row.level?.toUpperCase() || '',
        textPreview: row.text ? row.text.substring(0, 80) + (row.text.length > 80 ? '...' : '') : null,
        orderNumber: row.order_number,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
