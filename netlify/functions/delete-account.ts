/**
 * POST /api/delete-account
 *
 * Delete user account permanently
 *
 * Request body:
 * {
 *   userId: string,
 *   password: string  // Required for confirmation
 * }
 */

import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
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

    const { userId, password } = JSON.parse(event.body);

    if (!userId) {
      return createResponse(400, { error: 'User ID is required' });
    }

    if (!password) {
      return createResponse(400, { error: 'Password is required to delete account' });
    }

    // Fetch user data to verify password
    const userResult = await sql`
      SELECT id, email, name, password_hash
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return createResponse(404, { error: 'User not found' });
    }

    const user = userResult[0];

    // Verify password
    if (!user.password_hash) {
      return createResponse(401, { error: 'Cannot verify password for this account' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return createResponse(401, { error: 'Incorrect password' });
    }

    // Delete user's exercise completions first (foreign key constraint)
    await sql`
      DELETE FROM exercise_completions
      WHERE user_id = ${userId}
    `;

    // Delete user
    await sql`
      DELETE FROM users
      WHERE id = ${userId}
    `;

    console.log(`✅ Account deleted for user: ${user.email}`);

    return createResponse(200, {
      success: true,
      message: 'Account deleted successfully',
    });

  } catch (error) {
    return handleError(error);
  }
};
