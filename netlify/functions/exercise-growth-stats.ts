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

    // Determine date truncation and interval based on period
    let dateTrunc: string;
    let interval: string;
    let defaultDays: number;

    switch (period) {
      case 'weekly':
        dateTrunc = 'week';
        interval = '12 weeks';
        defaultDays = 12;
        break;
      case 'monthly':
        dateTrunc = 'month';
        interval = '6 months';
        defaultDays = 6;
        break;
      case 'daily':
      default:
        dateTrunc = 'day';
        interval = '30 days';
        defaultDays = 30;
        break;
    }

    const days = params.days ? parseInt(params.days, 10) : defaultDays;

    // Get overall growth data (all time)
    const overallGrowth = await sql`
      SELECT
        DATE_TRUNC(${dateTrunc}, created_at) as period,
        COUNT(*) as count
      FROM exercises
      WHERE is_active = true
      GROUP BY DATE_TRUNC(${dateTrunc}, created_at)
      ORDER BY period ASC
    `;

    // Get growth by level (all time)
    const growthByLevel = await sql`
      SELECT
        DATE_TRUNC(${dateTrunc}, created_at) as period,
        level,
        COUNT(*) as count
      FROM exercises
      WHERE is_active = true
      GROUP BY DATE_TRUNC(${dateTrunc}, created_at), level
      ORDER BY period ASC, level
    `;

    // Get growth by grammar section (all time)
    const growthBySection = await sql`
      SELECT
        DATE_TRUNC(${dateTrunc}, e.created_at) as period,
        gs.name as section,
        COUNT(*) as count
      FROM exercises e
      JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      WHERE e.is_active = true
      GROUP BY DATE_TRUNC(${dateTrunc}, e.created_at), gs.name
      ORDER BY period ASC, gs.name
    `;

    // Get growth by content topic (all time)
    const growthByTopic = await sql`
      SELECT
        DATE_TRUNC(${dateTrunc}, created_at) as period,
        content_topic as topic,
        COUNT(*) as count
      FROM exercises
      WHERE is_active = true
        AND content_topic IS NOT NULL
      GROUP BY DATE_TRUNC(${dateTrunc}, created_at), content_topic
      ORDER BY period ASC, content_topic
    `;

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
