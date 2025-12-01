/**
 * GET /api/stats-by-level-topic
 *
 * Get user's accuracy statistics broken down by level and topic
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

    // Get accuracy by level
    const levelStats = await sql`
      SELECT
        practiced_level as level,
        COUNT(*) as total_exercises,
        SUM(correct_answers) as total_correct,
        SUM(total_answers) as total_questions,
        ROUND(
          CASE
            WHEN SUM(total_answers) > 0
            THEN (SUM(correct_answers)::decimal / SUM(total_answers)::decimal * 100)
            ELSE 0
          END
        ) as accuracy
      FROM exercise_completions
      WHERE user_id = ${userId}::uuid
        AND practiced_level IS NOT NULL
      GROUP BY practiced_level
      ORDER BY practiced_level
    `;

    // Get accuracy by topic
    const topicStats = await sql`
      SELECT
        practiced_topic as topic,
        COUNT(*) as total_exercises,
        SUM(correct_answers) as total_correct,
        SUM(total_answers) as total_questions,
        ROUND(
          CASE
            WHEN SUM(total_answers) > 0
            THEN (SUM(correct_answers)::decimal / SUM(total_answers)::decimal * 100)
            ELSE 0
          END
        ) as accuracy
      FROM exercise_completions
      WHERE user_id = ${userId}::uuid
        AND practiced_topic IS NOT NULL
      GROUP BY practiced_topic
      ORDER BY practiced_topic
    `;

    // Format level stats
    const levelData = levelStats.map((stat: any) => ({
      name: stat.level.toUpperCase(),
      accuracy: parseInt(stat.accuracy, 10),
      total_exercises: parseInt(stat.total_exercises, 10),
      total_correct: parseInt(stat.total_correct, 10),
      total_questions: parseInt(stat.total_questions, 10),
    }));

    // Format topic stats - capitalize first letter
    const topicData = topicStats.map((stat: any) => ({
      name: stat.topic.charAt(0).toUpperCase() + stat.topic.slice(1),
      accuracy: parseInt(stat.accuracy, 10),
      total_exercises: parseInt(stat.total_exercises, 10),
      total_correct: parseInt(stat.total_correct, 10),
      total_questions: parseInt(stat.total_questions, 10),
    }));

    return createResponse(200, {
      levelData,
      topicData,
    });

  } catch (error) {
    return handleError(error);
  }
};
