/**
 * GET /api/exercise-coverage-stats
 *
 * Get exercise coverage statistics for heatmap and under-covered sections
 * Returns counts by level x grammar section and list of sections with low coverage
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
    // Get exercise counts by level and grammar section
    const heatmapData = await sql`
      SELECT
        e.level,
        gs.id as section_id,
        gs.name as section_name,
        gs.order_in_level,
        COUNT(e.id) as count
      FROM grammar_sections gs
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id AND e.is_active = true
      GROUP BY e.level, gs.id, gs.name, gs.order_in_level
      ORDER BY e.level, gs.order_in_level NULLS LAST, gs.name
    `;

    // Get under-covered sections (sections with < 5 exercises or no exercises)
    const underCoveredSections = await sql`
      SELECT
        gs.id as section_id,
        gs.name as section_name,
        gs.level,
        gs.category,
        COALESCE(COUNT(e.id), 0) as count
      FROM grammar_sections gs
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id AND e.is_active = true
      GROUP BY gs.id, gs.name, gs.level, gs.category
      HAVING COALESCE(COUNT(e.id), 0) < 5
      ORDER BY count ASC, gs.level, gs.name
    `;

    return createResponse(200, {
      heatmap: heatmapData.map((row: any) => ({
        level: row.level?.toUpperCase() || 'NULL',
        sectionId: row.section_id,
        sectionName: row.section_name,
        orderInLevel: row.order_in_level,
        count: parseInt(row.count, 10),
      })),
      underCovered: underCoveredSections.map((row: any) => ({
        sectionId: row.section_id,
        sectionName: row.section_name,
        level: row.level?.toUpperCase(),
        category: row.category,
        count: parseInt(row.count, 10),
      })),
    });

  } catch (error) {
    return handleError(error);
  }
};
