/**
 * GET /api/exercise-growth-stats
 *
 * Get exercise database growth statistics over time
 * Returns daily/weekly/monthly counts of exercises created, split by level, grammar section, and content topic
 *
 * Query parameters:
 * - period: 'daily' | 'weekly' | 'monthly' (default: 'daily')
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
    const period = params.period || 'daily';

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return createResponse(400, { error: 'period must be daily, weekly, or monthly' });
    }

    let overallGrowth, growthByLevel, growthBySection, growthByTopic;

    // Execute queries based on period type
    if (period === 'daily') {
      overallGrowth = await sql`
        WITH daily_counts AS (
          SELECT
            DATE_TRUNC('day', created_at) as period,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('day', created_at)
        )
        SELECT
          period,
          SUM(count) OVER (ORDER BY period) as count
        FROM daily_counts
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        WITH daily_level_counts AS (
          SELECT
            DATE_TRUNC('day', created_at) as period,
            level,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('day', created_at), level
        )
        SELECT
          period,
          level,
          SUM(count) OVER (PARTITION BY level ORDER BY period) as count
        FROM daily_level_counts
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        WITH daily_section_counts AS (
          SELECT
            DATE_TRUNC('day', e.created_at) as period,
            gs.name as section,
            COUNT(*) as count
          FROM exercises e
          JOIN grammar_sections gs ON e.grammar_section_id = gs.id
          WHERE e.is_active = true
          GROUP BY DATE_TRUNC('day', e.created_at), gs.name
        )
        SELECT
          period,
          section,
          SUM(count) OVER (PARTITION BY section ORDER BY period) as count
        FROM daily_section_counts
        ORDER BY period ASC, section
      `;

      growthByTopic = await sql`
        WITH daily_topic_counts AS (
          SELECT
            DATE_TRUNC('day', created_at) as period,
            content_topic as topic,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
            AND content_topic IS NOT NULL
          GROUP BY DATE_TRUNC('day', created_at), content_topic
        )
        SELECT
          period,
          topic,
          SUM(count) OVER (PARTITION BY topic ORDER BY period) as count
        FROM daily_topic_counts
        ORDER BY period ASC, topic
      `;
    } else if (period === 'weekly') {
      overallGrowth = await sql`
        WITH weekly_counts AS (
          SELECT
            DATE_TRUNC('week', created_at) as period,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('week', created_at)
        )
        SELECT
          period,
          SUM(count) OVER (ORDER BY period) as count
        FROM weekly_counts
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        WITH weekly_level_counts AS (
          SELECT
            DATE_TRUNC('week', created_at) as period,
            level,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('week', created_at), level
        )
        SELECT
          period,
          level,
          SUM(count) OVER (PARTITION BY level ORDER BY period) as count
        FROM weekly_level_counts
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        WITH weekly_section_counts AS (
          SELECT
            DATE_TRUNC('week', e.created_at) as period,
            gs.name as section,
            COUNT(*) as count
          FROM exercises e
          JOIN grammar_sections gs ON e.grammar_section_id = gs.id
          WHERE e.is_active = true
          GROUP BY DATE_TRUNC('week', e.created_at), gs.name
        )
        SELECT
          period,
          section,
          SUM(count) OVER (PARTITION BY section ORDER BY period) as count
        FROM weekly_section_counts
        ORDER BY period ASC, section
      `;

      growthByTopic = await sql`
        WITH weekly_topic_counts AS (
          SELECT
            DATE_TRUNC('week', created_at) as period,
            content_topic as topic,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
            AND content_topic IS NOT NULL
          GROUP BY DATE_TRUNC('week', created_at), content_topic
        )
        SELECT
          period,
          topic,
          SUM(count) OVER (PARTITION BY topic ORDER BY period) as count
        FROM weekly_topic_counts
        ORDER BY period ASC, topic
      `;
    } else {
      // monthly
      overallGrowth = await sql`
        WITH monthly_counts AS (
          SELECT
            DATE_TRUNC('month', created_at) as period,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('month', created_at)
        )
        SELECT
          period,
          SUM(count) OVER (ORDER BY period) as count
        FROM monthly_counts
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        WITH monthly_level_counts AS (
          SELECT
            DATE_TRUNC('month', created_at) as period,
            level,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
          GROUP BY DATE_TRUNC('month', created_at), level
        )
        SELECT
          period,
          level,
          SUM(count) OVER (PARTITION BY level ORDER BY period) as count
        FROM monthly_level_counts
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        WITH monthly_section_counts AS (
          SELECT
            DATE_TRUNC('month', e.created_at) as period,
            gs.name as section,
            COUNT(*) as count
          FROM exercises e
          JOIN grammar_sections gs ON e.grammar_section_id = gs.id
          WHERE e.is_active = true
          GROUP BY DATE_TRUNC('month', e.created_at), gs.name
        )
        SELECT
          period,
          section,
          SUM(count) OVER (PARTITION BY section ORDER BY period) as count
        FROM monthly_section_counts
        ORDER BY period ASC, section
      `;

      growthByTopic = await sql`
        WITH monthly_topic_counts AS (
          SELECT
            DATE_TRUNC('month', created_at) as period,
            content_topic as topic,
            COUNT(*) as count
          FROM exercises
          WHERE is_active = true
            AND content_topic IS NOT NULL
          GROUP BY DATE_TRUNC('month', created_at), content_topic
        )
        SELECT
          period,
          topic,
          SUM(count) OVER (PARTITION BY topic ORDER BY period) as count
        FROM monthly_topic_counts
        ORDER BY period ASC, topic
      `;
    }

    // Format the response
    const formatPeriod = (date: Date) => {
      switch (period) {
        case 'weekly':
          return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'monthly':
          return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        case 'daily':
        default:
          return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    return createResponse(200, {
      period,
      overall: overallGrowth.map((row: any) => ({
        period: formatPeriod(row.period),
        count: parseInt(row.count, 10),
      })),
      byLevel: growthByLevel.map((row: any) => ({
        period: formatPeriod(row.period),
        level: row.level.toUpperCase(),
        count: parseInt(row.count, 10),
      })),
      bySection: growthBySection.map((row: any) => ({
        period: formatPeriod(row.period),
        section: row.section,
        count: parseInt(row.count, 10),
      })),
      byTopic: growthByTopic.map((row: any) => ({
        period: formatPeriod(row.period),
        topic: row.topic,
        count: parseInt(row.count, 10),
      })),
    });

  } catch (error) {
    return handleError(error);
  }
};
