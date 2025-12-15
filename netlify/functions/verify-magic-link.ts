/**
 * POST /api/verify-magic-link
 *
 * Verify a magic link token and authenticate the user
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
    const { token } = JSON.parse(event.body || '{}');

    if (!token) {
      return createResponse(400, { error: 'Token is required' });
    }

    // Look up the token
    const tokens = await sql`
      SELECT
        mlt.id,
        mlt.user_id,
        mlt.expires_at,
        mlt.used_at,
        u.id as user_id,
        u.email,
        u.name,
        u.created_at,
        u.last_login
      FROM magic_link_tokens mlt
      JOIN users u ON mlt.user_id = u.id
      WHERE mlt.token = ${token}
    `;

    if (tokens.length === 0) {
      return createResponse(401, { error: 'Invalid or expired magic link' });
    }

    const tokenData = tokens[0];

    // Check if token has already been used
    if (tokenData.used_at) {
      return createResponse(401, { error: 'This magic link has already been used' });
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      return createResponse(401, { error: 'This magic link has expired' });
    }

    // Mark token as used
    await sql`
      UPDATE magic_link_tokens
      SET used_at = NOW()
      WHERE id = ${tokenData.id}
    `;

    // Update user's last login
    await sql`
      UPDATE users
      SET last_login = NOW()
      WHERE id = ${tokenData.user_id}
    `;

    // Get user stats
    const userStats = await sql`
      SELECT
        total_exercises_completed,
        total_answers,
        total_correct_answers,
        accuracy,
        current_streak,
        longest_streak,
        last_practice_date
      FROM user_stats
      WHERE user_id = ${tokenData.user_id}
    `;

    const stats = userStats[0] || {
      total_exercises_completed: 0,
      total_answers: 0,
      total_correct_answers: 0,
      accuracy: 0,
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
    };

    // Return user data for authentication
    const user = {
      id: tokenData.user_id,
      email: tokenData.email,
      name: tokenData.name,
      created_at: tokenData.created_at,
      last_login: new Date().toISOString(),
      stats,
    };

    console.log(`✅ Magic link verified for user: ${tokenData.email}`);

    return createResponse(200, {
      message: 'Successfully authenticated',
      user,
    });

  } catch (error: any) {
    console.error('Error verifying magic link:', error);
    return handleError(error);
  }
};
