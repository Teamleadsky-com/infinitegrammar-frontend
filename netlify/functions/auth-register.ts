/**
 * POST /api/auth/register
 *
 * Register a new user (simple email-based registration for MVP)
 *
 * Request body:
 * {
 *   email: string,
 *   name: string (optional)
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

    const { email, name } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return createResponse(400, { error: 'Valid email is required' });
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

    // Create new user
    const result = await sql`
      INSERT INTO users (email, name, created_at, last_login)
      VALUES (${email.toLowerCase()}, ${name || null}, NOW(), NOW())
      RETURNING id, email, name, created_at
    `;

    const user = result[0];

    return createResponse(201, {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    return handleError(error);
  }
};
