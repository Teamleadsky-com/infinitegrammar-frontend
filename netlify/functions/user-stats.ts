/**
 * GET /api/user-stats
 *
 * Get detailed user statistics and recent activity
 *
 * Query parameters:
 * - user_id: string (UUID, required)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const params = event.queryStringParameters || {};
    const userId = params.user_id;

    if (!userId) {
      return createResponse(400, { error: 'user_id parameter is required' });
    }

    // Get user basic info
    const userResult = await sql`
      SELECT
        id,
        email,
        name,
        created_at,
        last_login,
        total_exercises_completed,
        total_correct_answers,
        total_answers,
        current_streak,
        last_streak_date
      FROM users
      WHERE id = ${userId}::uuid
    `;

    if (userResult.length === 0) {
      return createResponse(404, { error: 'User not found' });
    }

    const user = userResult[0];

    // Get recent completions
    const recentCompletions = await sql`
      SELECT
        ec.id,
        ec.exercise_id,
        ec.correct_answers,
        ec.total_answers,
        ec.time_spent_seconds,
        ec.completed_at,
        e.level,
        e.content_topic,
        gs.name as grammar_section_name
      FROM exercise_completions ec
      JOIN exercises e ON ec.exercise_id = e.id
      JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      WHERE ec.user_id = ${userId}::uuid
      ORDER BY ec.completed_at DESC
      LIMIT 10
    `;

    // Get progress by level
    const progressByLevel = await sql`
      SELECT
        e.level,
        COUNT(DISTINCT ec.exercise_id) as completed_exercises,
        SUM(ec.correct_answers) as total_correct,
        SUM(ec.total_answers) as total_answers
      FROM exercise_completions ec
      JOIN exercises e ON ec.exercise_id = e.id
      WHERE ec.user_id = ${userId}::uuid
      GROUP BY e.level
      ORDER BY e.level
    `;

    // Get activity by day (last 30 days)
    const activityByDay = await sql`
      SELECT
        DATE(completed_at) as date,
        COUNT(*) as completions,
        SUM(correct_answers) as correct,
        SUM(total_answers) as total
      FROM exercise_completions
      WHERE user_id = ${userId}::uuid
        AND completed_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
    `;

    // Calculate overall accuracy
    const accuracy = user.total_answers > 0
      ? Math.round((user.total_correct_answers / user.total_answers) * 100)
      : 0;

    return createResponse(200, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      stats: {
        total_exercises_completed: user.total_exercises_completed,
        total_correct_answers: user.total_correct_answers,
        total_answers: user.total_answers,
        accuracy,
        current_streak: user.current_streak,
        last_streak_date: user.last_streak_date,
      },
      recentCompletions: recentCompletions.map((c: any) => ({
        id: c.id,
        exercise_id: c.exercise_id,
        level: c.level,
        content_topic: c.content_topic,
        grammar_section_name: c.grammar_section_name,
        correct_answers: c.correct_answers,
        total_answers: c.total_answers,
        accuracy: Math.round((c.correct_answers / c.total_answers) * 100),
        time_spent_seconds: c.time_spent_seconds,
        completed_at: c.completed_at,
      })),
      progressByLevel: progressByLevel.map((p: any) => ({
        level: p.level,
        completed_exercises: parseInt(p.completed_exercises, 10),
        accuracy: p.total_answers > 0
          ? Math.round((p.total_correct / p.total_answers) * 100)
          : 0,
      })),
      activityByDay: activityByDay.map((a: any) => ({
        date: a.date,
        completions: parseInt(a.completions, 10),
        accuracy: a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0,
      })),
    });

  } catch (error) {
    return handleError(error);
  }
};
