/**
 * GET /api/grammar-sections-with-exercises
 *
 * Get grammar sections that have at least 5 exercises available
 * Used for the quick quiz feature
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
    const minExercises = parseInt(params.minExercises || '5');

    // Query grammar sections with exercise counts
    const result = await sql`
      SELECT
        gs.id,
        gs.level,
        gs.name,
        COUNT(e.id)::int as exercise_count
      FROM grammar_sections gs
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id AND e.is_active = true
      GROUP BY gs.id, gs.level, gs.name
      HAVING COUNT(e.id) >= ${minExercises}
      ORDER BY gs.level, COUNT(e.id) DESC
    `;

    // Group by level for easier frontend consumption
    const byLevel: { [key: string]: any[] } = {};

    result.forEach((row: any) => {
      const level = row.level;
      if (!byLevel[level]) {
        byLevel[level] = [];
      }
      byLevel[level].push({
        id: row.id,
        name: row.name,
        exerciseCount: row.exercise_count,
      });
    });

    return createResponse(200, {
      sections: result,
      byLevel,
      totalSections: result.length,
    });

  } catch (error: any) {
    console.error('Error fetching grammar sections with exercises:', error);
    return handleError(error);
  }
};
