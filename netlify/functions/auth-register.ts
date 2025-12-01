/**
 * POST /api/auth/register
 *
 * Register a new user with password authentication
 *
 * Request body:
 * {
 *   email: string,
 *   password: string,
 *   name: string (optional)
 * }
 */

import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';
import { sendWelcomeEmail } from './_shared/email';

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

    const { email, password, name } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return createResponse(400, { error: 'Valid email is required' });
    }

    // Validate password
    if (!password || password.length < 8) {
      return createResponse(400, { error: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id, email, name FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (existingUser.length > 0) {
      return createResponse(409, {
        error: 'User already exists',
        user: {
          id: existingUser[0].id,
          email: existingUser[0].email,
          name: existingUser[0].name,
        },
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const result = await sql`
      INSERT INTO users (email, name, password_hash, created_at, last_login)
      VALUES (${email.toLowerCase()}, ${name || null}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email, name, created_at
    `;

    const user = result[0];

    // Send welcome email (don't fail registration if email fails)
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }

    // Calculate accuracy (will be 0 for new users)
    const accuracy = 0;

    return createResponse(201, {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        stats: {
          total_exercises_completed: 0,
          total_correct_answers: 0,
          total_answers: 0,
          accuracy,
          current_streak: 0,
          last_streak_date: null,
        },
      },
    });

  } catch (error) {
    return handleError(error);
  }
};
