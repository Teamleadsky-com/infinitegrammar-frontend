/**
 * POST /api/email-track-exercise
 *
 * Track exercise start and completion from email campaign links.
 * Called from the Exercise page when a tracking token is present in the URL.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { tracking_token, event: trackEvent } = JSON.parse(event.body || '{}');

    if (!tracking_token || !trackEvent) {
      return createResponse(400, { error: 'tracking_token and event are required' });
    }

    if (!['started', 'completed'].includes(trackEvent)) {
      return createResponse(400, { error: 'event must be "started" or "completed"' });
    }

    if (trackEvent === 'started') {
      await sql`
        UPDATE email_sends
        SET exercise_started_at = COALESCE(exercise_started_at, NOW())
        WHERE tracking_token = ${tracking_token}
      `;
    } else {
      await sql`
        UPDATE email_sends
        SET exercise_completed_at = COALESCE(exercise_completed_at, NOW())
        WHERE tracking_token = ${tracking_token}
      `;
    }

    return createResponse(200, { success: true });

  } catch (error) {
    return handleError(error);
  }
};
