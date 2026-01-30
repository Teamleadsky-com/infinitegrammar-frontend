/**
 * POST /api/report-exercise
 *
 * Report an exercise as having an issue and mark it as inactive
 * This immediately removes the exercise from circulation for all users
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { exerciseId, reportText } = body;

    if (!exerciseId) {
      return createResponse(400, { error: 'Exercise ID is required' });
    }

    // Mark exercise as inactive
    const result = await sql`
      UPDATE exercises
      SET is_active = false,
          updated_at = NOW()
      WHERE id = ${exerciseId}
      RETURNING id, is_active
    `;

    if (result.length === 0) {
      return createResponse(404, { error: 'Exercise not found' });
    }

    console.log(`Exercise ${exerciseId} marked as inactive. Report: ${reportText?.substring(0, 100)}`);

    return createResponse(200, {
      success: true,
      message: 'Exercise has been flagged and removed from circulation',
      exerciseId: result[0].id,
    });

  } catch (error) {
    return handleError(error);
  }
};
