/**
 * GET /api/grammar-sections
 *
 * Get grammar sections filtered by level and/or topic
 *
 * Query parameters:
 * - level: A1, A2, B1, B2, C1 (optional, returns all if not provided)
 * - topic: verben, artikel, adjektive, etc. (optional)
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
    const level = params.level?.toUpperCase();
    const topic = params.topic?.toLowerCase();

    let query = `
      SELECT
        gs.id,
        gs.level,
        gs.category,
        gs.name,
        gs.description,
        gs.order_in_level,
        json_agg(DISTINCT gut.topic) FILTER (WHERE gut.topic IS NOT NULL) as topics,
        COUNT(DISTINCT e.id) as exercise_count
      FROM grammar_sections gs
      LEFT JOIN grammar_ui_topics gut ON gs.id = gut.grammar_section_id
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id AND e.is_active = true
      WHERE gs.is_active = true
    `;

    const queryParams: any[] = [];
    let paramCount = 0;

    if (level) {
      paramCount++;
      query += ` AND gs.level = $${paramCount}`;
      queryParams.push(level);
    }

    if (topic) {
      paramCount++;
      query += `
        AND EXISTS (
          SELECT 1 FROM grammar_ui_topics gut2
          WHERE gut2.grammar_section_id = gs.id
          AND gut2.topic = $${paramCount}
        )
      `;
      queryParams.push(topic);
    }

    query += `
      GROUP BY gs.id, gs.level, gs.category, gs.name, gs.description, gs.order_in_level
      ORDER BY gs.level, gs.order_in_level
    `;

    const result = await sql(query, queryParams);

    // Format the response
    const sections = result.map((row: any) => ({
      id: row.id,
      level: row.level,
      category: row.category,
      name: row.name,
      description: row.description,
      order_in_level: row.order_in_level,
      topics: row.topics || [],
      exercise_count: parseInt(row.exercise_count, 10),
    }));

    // Group by level for easier consumption
    const byLevel = sections.reduce((acc: any, section: any) => {
      if (!acc[section.level]) {
        acc[section.level] = [];
      }
      acc[section.level].push(section);
      return acc;
    }, {});

    return createResponse(200, {
      sections,
      byLevel,
      count: sections.length,
      filters: { level, topic },
    });

  } catch (error) {
    return handleError(error);
  }
};
