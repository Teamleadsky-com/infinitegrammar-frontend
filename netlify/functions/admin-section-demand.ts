/**
 * GET /api/admin-section-demand
 *
 * Get exercise demand data for grammar sections that users are actively working on.
 * Shows total exercises, completed (unique), and remaining per section.
 * Intended for admin use to prioritize exercise generation.
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
    const data = await sql`
      SELECT
        gs.name AS section_name,
        gs.level,
        COUNT(DISTINCT e.id) AS total,
        COUNT(DISTINCT ec.exercise_id) AS completed,
        COUNT(DISTINCT e.id) - COUNT(DISTINCT ec.exercise_id) AS remaining,
        COUNT(DISTINCT up.user_id) AS unique_users
      FROM user_progress up
      JOIN grammar_sections gs ON gs.id = up.grammar_section_id
      LEFT JOIN exercises e ON e.grammar_section_id = gs.id AND e.is_active = true
      LEFT JOIN exercise_completions ec ON ec.exercise_id = e.id
      GROUP BY gs.id, gs.name, gs.level
      ORDER BY COUNT(DISTINCT up.user_id) DESC, gs.level, gs.name
    `;

    return createResponse(200, {
      sections: data.map((row: any) => ({
        sectionName: row.section_name,
        level: row.level?.toUpperCase() || 'NULL',
        total: parseInt(row.total, 10),
        completed: parseInt(row.completed, 10),
        remaining: parseInt(row.remaining, 10),
        uniqueUsers: parseInt(row.unique_users, 10),
      })),
    });

  } catch (error) {
    return handleError(error);
  }
};
