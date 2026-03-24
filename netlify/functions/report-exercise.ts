/**
 * /api/report-exercise
 *
 * POST - Report an exercise as having an issue, save report text, mark inactive
 * GET  - List all flagged exercises (admin)
 * PATCH - Reactivate a flagged exercise (admin)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // POST: Flag an exercise
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { exerciseId, reportText } = body;

      if (!exerciseId) {
        return createResponse(400, { error: 'Exercise ID is required' });
      }

      const result = await sql`
        UPDATE exercises
        SET is_active = false,
            report_text = ${reportText || null},
            reported_at = NOW()
        WHERE id = ${exerciseId}
        RETURNING id, is_active
      `;

      if (result.length === 0) {
        return createResponse(404, { error: 'Exercise not found' });
      }

      console.log(`Exercise ${exerciseId} flagged. Report: ${reportText?.substring(0, 100)}`);

      return createResponse(200, {
        success: true,
        message: 'Exercise has been flagged and removed from circulation',
        exerciseId: result[0].id,
      });
    }

    // GET: List flagged exercises
    if (event.httpMethod === 'GET') {
      const flagged = await sql`
        SELECT e.id, e.level, e.text, e.report_text, e.reported_at,
               gs.name as section_name
        FROM exercises e
        JOIN grammar_sections gs ON e.grammar_section_id = gs.id
        WHERE e.is_active = false AND e.reported_at IS NOT NULL
        ORDER BY e.reported_at DESC
      `;

      return createResponse(200, { flagged });
    }

    // PATCH: Reactivate a flagged exercise
    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      const { exerciseId } = body;

      if (!exerciseId) {
        return createResponse(400, { error: 'Exercise ID is required' });
      }

      const result = await sql`
        UPDATE exercises
        SET is_active = true,
            report_text = NULL,
            reported_at = NULL
        WHERE id = ${exerciseId}
        RETURNING id, is_active
      `;

      if (result.length === 0) {
        return createResponse(404, { error: 'Exercise not found' });
      }

      return createResponse(200, {
        success: true,
        message: 'Exercise reactivated',
        exerciseId: result[0].id,
      });
    }

    return createResponse(405, { error: 'Method not allowed' });

  } catch (error) {
    return handleError(error);
  }
};
