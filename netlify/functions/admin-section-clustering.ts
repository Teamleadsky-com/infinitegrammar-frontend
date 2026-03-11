/**
 * GET /api/admin-section-clustering
 *
 * Returns hierarchical clustering data (linkage matrix + exercise IDs) for a section.
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

    // Try exact run first, then fall back to latest clustering run for this section
    let rows = await sql`
      SELECT exercise_ids, linkage_matrix
      FROM section_clustering
      WHERE grammar_section_id = ${sectionId}
        AND run_id = ${runId}::uuid
      LIMIT 1
    `;

    if (rows.length === 0) {
      rows = await sql`
        SELECT exercise_ids, linkage_matrix
        FROM section_clustering
        WHERE grammar_section_id = ${sectionId}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    }

    if (rows.length === 0) {
      return createResponse(200, { linkageMatrix: null, exerciseIds: [], exerciseLabels: {} });
    }

    const { exercise_ids, linkage_matrix } = rows[0];

    // Fetch labels for exercises
    const exercises = await sql`
      SELECT id, order_number, text, created_at
      FROM exercises
      WHERE id = ANY(${exercise_ids})
    `;

    const exerciseLabels: Record<string, { orderNumber: number | null; textPreview: string | null; createdAt: string | null }> = {};
    for (const e of exercises) {
      exerciseLabels[e.id] = {
        orderNumber: e.order_number != null ? parseInt(e.order_number, 10) : null,
        textPreview: e.text ? e.text.substring(0, 60) + (e.text.length > 60 ? '...' : '') : null,
        createdAt: e.created_at || null,
      };
    }

    return createResponse(200, {
      linkageMatrix: linkage_matrix,
      exerciseIds: exercise_ids,
      exerciseLabels,
    });
  } catch (error) {
    return handleError(error);
  }
};
