/**
 * POST /api/auth/register
 *
 * Register a new user with password authentication
 *
 * Request body:
 * {
 *   email: string,
 *   password: string,
 *   name: string (optional),
 *   session_id: string (optional) - the anonymous session (exercise_view_events.session_id) the
 *     account was created in, for the starter-exercises experiment (session_signups, migration 009)
 * }
 *
 * With a session_id, the anonymous progress of that session carries over: in each section it
 * practised, the learner continues after the unbroken run of exercises it submitted from the start
 * of the section (e.g. starters 1-10 done: continue at 11), so the starters aren't shown again.
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

    const { email, password, name, session_id } = JSON.parse(event.body);

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

    // Link the anonymous session the account was created in (never fails the registration)
    if (typeof session_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session_id)) {
      try {
        await sql`
          INSERT INTO session_signups (session_id, user_id) VALUES (${session_id}::uuid, ${user.id}::uuid)
          ON CONFLICT DO NOTHING
        `;
      } catch (linkError) {
        console.warn('session_signups not stored:', (linkError as { message?: string })?.message);
      }

      // Carry the anonymous progress over (never fails the registration). Per section: the highest
      // order_number p such that every active exercise up to p was submitted in the session. Later
      // exercises done out of order don't move the pointer, so nothing unseen is skipped.
      try {
        const carried = await sql`
          WITH done AS (
            SELECT exercise_id, max(correct_answers) AS correct
            FROM exercise_view_events
            WHERE session_id = ${session_id}::uuid AND user_id IS NULL AND event = 'submitted'
            GROUP BY exercise_id
          ), sections AS (
            SELECT x.grammar_section_id AS sid, count(*)::int AS n, sum(coalesce(d.correct, 0))::int AS correct
            FROM done d JOIN exercises x ON x.id = d.exercise_id
            GROUP BY x.grammar_section_id
          ), gaps AS (
            SELECT s.sid, min(x.order_number) AS first_gap
            FROM sections s
            JOIN exercises x ON x.grammar_section_id = s.sid AND x.is_active
            LEFT JOIN done d ON d.exercise_id = x.id
            WHERE d.exercise_id IS NULL
            GROUP BY s.sid
          ), ptr AS (
            SELECT s.sid, s.n, s.correct,
                   (SELECT max(x.order_number)
                    FROM exercises x JOIN done d ON d.exercise_id = x.id
                    WHERE x.grammar_section_id = s.sid AND x.is_active
                      AND (g.first_gap IS NULL OR x.order_number < g.first_gap)) AS p
            FROM sections s LEFT JOIN gaps g ON g.sid = s.sid
          )
          INSERT INTO user_progress
            (user_id, grammar_section_id, last_completed_exercise_order, total_completions, total_correct, last_completed_at)
          SELECT ${user.id}::uuid, sid, p, n, correct, NOW() FROM ptr WHERE p IS NOT NULL
          ON CONFLICT (user_id, grammar_section_id) DO UPDATE SET
            last_completed_exercise_order = GREATEST(
              COALESCE(user_progress.last_completed_exercise_order, 0),
              EXCLUDED.last_completed_exercise_order
            )
          RETURNING grammar_section_id, last_completed_exercise_order
        `;
        if (carried.length > 0) {
          console.log(`Carried anonymous progress of ${carried.length} section(s) to the new account`);
        }
      } catch (carryError) {
        console.warn('anonymous progress not carried over:', (carryError as { message?: string })?.message);
      }
    }

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
