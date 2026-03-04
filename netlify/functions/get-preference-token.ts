/**
 * POST /api/get-preference-token
 *
 * Get or create an email preference token for a logged-in user.
 * Used from the Profile page to navigate to email preferences.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';
import crypto from 'crypto';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { user_id } = JSON.parse(event.body || '{}');

    if (!user_id) {
      return createResponse(400, { error: 'user_id is required' });
    }

    // Check if token already exists
    const existing = await sql`
      SELECT token FROM email_preference_tokens WHERE user_id = ${user_id}::uuid
    `;

    if (existing.length > 0) {
      return createResponse(200, { token: existing[0].token });
    }

    // Create new token
    const token = crypto.randomBytes(32).toString('hex');
    await sql`
      INSERT INTO email_preference_tokens (user_id, token)
      VALUES (${user_id}::uuid, ${token})
    `;

    return createResponse(200, { token });

  } catch (error) {
    return handleError(error);
  }
};
