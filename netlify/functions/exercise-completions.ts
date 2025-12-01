/**
 * POST /api/exercise-completions
 *
 * Submit an exercise completion and update user progress
 *
 * Request body:
 * {
 *   user_id: string (UUID),
 *   exercise_id: string,
 *   correct_answers: number,
 *   total_answers: number,
 *   time_spent_seconds: number (optional)
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

    const { user_id, exercise_id, correct_answers, total_answers, time_spent_seconds, practiced_level, practiced_topic } =
      JSON.parse(event.body);

    // Validate required fields
    if (!user_id || !exercise_id || correct_answers === undefined || total_answers === undefined) {
      return createResponse(400, {
        error: 'Missing required fields: user_id, exercise_id, correct_answers, total_answers',
      });
    }

    // Validate optional level/topic fields
    if (!practiced_level || !practiced_topic) {
      console.warn('⚠️  practiced_level or practiced_topic not provided - stats by level/topic will be incomplete');
    }

    // Start transaction
    await sql`BEGIN`;

    try {
      // 1. Insert exercise completion
      const completionResult = await sql`
        INSERT INTO exercise_completions
          (user_id, exercise_id, correct_answers, total_answers, time_spent_seconds, practiced_level, practiced_topic, completed_at)
        VALUES
          (${user_id}::uuid, ${exercise_id}, ${correct_answers}, ${total_answers},
           ${time_spent_seconds || null}, ${practiced_level || null}, ${practiced_topic || null}, NOW())
        RETURNING id, completed_at
      `;

      const completion = completionResult[0];

      // 2. Get exercise details to find grammar section
      const exerciseResult = await sql`
        SELECT grammar_section_id, level, order_number
        FROM exercises
        WHERE id = ${exercise_id}
      `;

      if (exerciseResult.length === 0) {
        // Exercise not found in database - this is OK for mock/local exercises
        // Just update user's overall stats without section-specific progress
        console.log(`⚠️  Exercise ${exercise_id} not found in database - updating user stats only`);

        await sql`
          UPDATE users
          SET
            total_exercises_completed = total_exercises_completed + 1,
            total_correct_answers = total_correct_answers + ${correct_answers},
            total_answers = total_answers + ${total_answers},
            last_login = NOW()
          WHERE id = ${user_id}::uuid
        `;

        // Update streak
        const streakResult = await sql`
          WITH user_data AS (
            SELECT
              last_streak_date,
              current_streak,
              CURRENT_DATE as today
            FROM users
            WHERE id = ${user_id}::uuid
          )
          SELECT
            CASE
              WHEN last_streak_date = CURRENT_DATE THEN current_streak
              WHEN last_streak_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
              ELSE 1
            END as new_streak,
            CASE
              WHEN last_streak_date = CURRENT_DATE THEN false
              ELSE true
            END as should_update
          FROM user_data
        `;

        if (streakResult.length > 0 && streakResult[0].should_update) {
          await sql`
            UPDATE users
            SET
              current_streak = ${streakResult[0].new_streak},
              last_streak_date = CURRENT_DATE
            WHERE id = ${user_id}::uuid
          `;
        }

        await sql`COMMIT`;

        return createResponse(200, {
          success: true,
          completion: {
            id: 'local_only',
            completed_at: new Date().toISOString(),
          },
          streak: streakResult[0]?.new_streak || 1,
          note: 'Exercise not in database - stats updated without exercise history',
        });
      }

      const exercise = exerciseResult[0];

      // 3. Update or create user progress for this grammar section
      await sql`
        INSERT INTO user_progress
          (user_id, grammar_section_id, last_completed_exercise_order, total_completions, total_correct, last_completed_at)
        VALUES
          (${user_id}::uuid, ${exercise.grammar_section_id}, ${exercise.order_number},
           1, ${correct_answers}, NOW())
        ON CONFLICT (user_id, grammar_section_id)
        DO UPDATE SET
          last_completed_exercise_order = GREATEST(
            user_progress.last_completed_exercise_order,
            ${exercise.order_number}
          ),
          total_completions = user_progress.total_completions + 1,
          total_correct = user_progress.total_correct + ${correct_answers},
          last_completed_at = NOW()
      `;

      // 4. Update user statistics
      await sql`
        UPDATE users
        SET
          total_exercises_completed = total_exercises_completed + 1,
          total_correct_answers = total_correct_answers + ${correct_answers},
          total_answers = total_answers + ${total_answers},
          last_login = NOW()
        WHERE id = ${user_id}::uuid
      `;

      // 5. Update streak (simplified version - just check if last activity was yesterday or today)
      const streakResult = await sql`
        WITH user_data AS (
          SELECT
            last_streak_date,
            current_streak,
            CURRENT_DATE as today
          FROM users
          WHERE id = ${user_id}::uuid
        )
        SELECT
          CASE
            WHEN last_streak_date = CURRENT_DATE THEN current_streak
            WHEN last_streak_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
            ELSE 1
          END as new_streak,
          CASE
            WHEN last_streak_date = CURRENT_DATE THEN false
            ELSE true
          END as should_update
        FROM user_data
      `;

      if (streakResult.length > 0 && streakResult[0].should_update) {
        await sql`
          UPDATE users
          SET
            current_streak = ${streakResult[0].new_streak},
            last_streak_date = CURRENT_DATE
          WHERE id = ${user_id}::uuid
        `;
      }

      await sql`COMMIT`;

      return createResponse(200, {
        success: true,
        completion: {
          id: completion.id,
          completed_at: completion.completed_at,
        },
        streak: streakResult[0]?.new_streak || 1,
      });

    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }

  } catch (error) {
    return handleError(error);
  }
};
