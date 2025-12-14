/**
 * GET /api/exercise-count-snapshots
 *
 * Get current snapshot counts of exercises in the database
 * Returns counts per level, grammar section, and content topic
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
    // Get counts by level
    const countsByLevel = await sql`
      SELECT
        level,
        COUNT(*) as count
      FROM exercises
      WHERE is_active = true
      GROUP BY level
      ORDER BY level
    `;

    // Get counts by grammar section
    const countsBySection = await sql`
      SELECT
        gs.name as section,
        COUNT(*) as count
      FROM exercises e
      JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      WHERE e.is_active = true
      GROUP BY gs.name
      ORDER BY COUNT(*) DESC
    `;

    // Get counts by content topic
    const countsByTopic = await sql`
      SELECT
        content_topic as topic,
        COUNT(*) as count
      FROM exercises
      WHERE is_active = true
        AND content_topic IS NOT NULL
      GROUP BY content_topic
      ORDER BY COUNT(*) DESC
    `;

    return createResponse(200, {
      byLevel: countsByLevel.map((row: any) => ({
        level: row.level.toUpperCase(),
        count: parseInt(row.count, 10),
      })),
      bySection: countsBySection.map((row: any) => ({
        section: row.section,
        count: parseInt(row.count, 10),
      })),
      byTopic: countsByTopic.map((row: any) => ({
        topic: row.topic,
        count: parseInt(row.count, 10),
      })),
    });

  } catch (error) {
    return handleError(error);
  }
};
