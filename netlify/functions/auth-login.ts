/**
 * POST /api/auth/login
 *
 * Login user (simple email-based login for MVP)
 *
 * Request body:
 * {
 *   email: string
 * }
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
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
      return createResponse(400, { error: 'Email is required' });
    }

    // Find user
    const result = await sql`
      SELECT
        u.id,
        u.email,
        u.name,
        u.created_at,
        u.last_login,
        u.total_exercises_completed,
        u.total_correct_answers,
        u.total_answers,
        u.current_streak,
        u.last_streak_date
      FROM users u
      WHERE u.email = ${email.toLowerCase()}
    `;

    if (result.length === 0) {
      return createResponse(404, { error: 'User not found' });
    }

    const user = result[0];

    // Update last login
    await sql`
      UPDATE users
      SET last_login = NOW()
      WHERE id = ${user.id}
    `;

    // Calculate accuracy
    const accuracy = user.total_answers > 0
      ? Math.round((user.total_correct_answers / user.total_answers) * 100)
      : 0;

    return createResponse(200, {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        last_login: user.last_login,
        stats: {
          total_exercises_completed: user.total_exercises_completed,
          total_correct_answers: user.total_correct_answers,
          total_answers: user.total_answers,
          accuracy,
          current_streak: user.current_streak,
          last_streak_date: user.last_streak_date,
        },
      },
    });

  } catch (error) {
    return handleError(error);
  }
};
