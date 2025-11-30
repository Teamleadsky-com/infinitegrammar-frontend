/**
 * GET /api/user-progress
 *
 * Get user's progress across all grammar sections
 *
 * Query parameters:
 * - user_id: string (UUID, required)
 * - level: A1, A2, B1, B2, C1 (optional - filter by level)
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
    const level = params.level?.toUpperCase();

    if (!userId) {
      return createResponse(400, { error: 'user_id parameter is required' });
    }

    // Build query
    let query = `
      SELECT
        gs.id as section_id,
        gs.name as section_name,
        gs.level,
        gs.category,
        up.last_completed_exercise_order,
        up.total_completions,
        up.total_correct,
        up.last_completed_at,
        COUNT(e.id) as total_exercises,
        COALESCE(
          (SELECT COUNT(*) FROM exercises e2
           WHERE e2.grammar_section_id = gs.id
           AND e2.order_number <= up.last_completed_exercise_order),
          0
        ) as completed_exercises
      FROM grammar_sections gs
      LEFT JOIN user_progress up ON gs.id = up.grammar_section_id AND up.user_id = $1::uuid
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id AND e.is_active = true
      WHERE gs.is_active = true
    `;

    const queryParams: any[] = [userId];
    let paramCount = 1;

    if (level) {
      paramCount++;
      query += ` AND gs.level = $${paramCount}`;
      queryParams.push(level);
    }

    query += `
      GROUP BY gs.id, gs.name, gs.level, gs.category,
               up.last_completed_exercise_order, up.total_completions,
               up.total_correct, up.last_completed_at
      ORDER BY gs.level, gs.order_in_level
    `;

    const result = await sql(query, queryParams);

    // Format progress data
    const progress = result.map((row: any) => ({
      section_id: row.section_id,
      section_name: row.section_name,
      level: row.level,
      category: row.category,
      total_exercises: parseInt(row.total_exercises, 10),
      completed_exercises: parseInt(row.completed_exercises, 10),
      last_completed_exercise_order: row.last_completed_exercise_order,
      total_completions: row.total_completions || 0,
      total_correct: row.total_correct || 0,
      last_completed_at: row.last_completed_at,
      completion_percentage:
        row.total_exercises > 0
          ? Math.round((parseInt(row.completed_exercises, 10) / parseInt(row.total_exercises, 10)) * 100)
          : 0,
    }));

    // Calculate overall stats
    const overallStats = {
      total_sections: progress.length,
      completed_sections: progress.filter((p) => p.completion_percentage === 100).length,
      in_progress_sections: progress.filter((p) => p.completion_percentage > 0 && p.completion_percentage < 100).length,
      total_exercises: progress.reduce((sum, p) => sum + p.total_exercises, 0),
      completed_exercises: progress.reduce((sum, p) => sum + p.completed_exercises, 0),
      total_completions: progress.reduce((sum, p) => sum + p.total_completions, 0),
    };

    // Group by level
    const byLevel = progress.reduce((acc: any, item: any) => {
      if (!acc[item.level]) {
        acc[item.level] = [];
      }
      acc[item.level].push(item);
      return acc;
    }, {});

    return createResponse(200, {
      progress,
      byLevel,
      overallStats,
      filters: { user_id: userId, level },
    });

  } catch (error) {
    return handleError(error);
  }
};
