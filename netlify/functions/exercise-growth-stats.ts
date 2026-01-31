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
        SELECT
          DATE_TRUNC('day', created_at) as period,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        SELECT
          DATE_TRUNC('day', created_at) as period,
          level,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('day', created_at), level
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        SELECT
          DATE_TRUNC('day', e.created_at) as period,
          gs.name as section,
          COUNT(*) as count
        FROM exercises e
        JOIN grammar_sections gs ON e.grammar_section_id = gs.id
        WHERE e.is_active = true
        GROUP BY DATE_TRUNC('day', e.created_at), gs.name
        ORDER BY period ASC, gs.name
      `;

      growthByTopic = await sql`
        SELECT
          DATE_TRUNC('day', created_at) as period,
          content_topic as topic,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
          AND content_topic IS NOT NULL
        GROUP BY DATE_TRUNC('day', created_at), content_topic
        ORDER BY period ASC, content_topic
      `;
    } else if (period === 'weekly') {
      overallGrowth = await sql`
        SELECT
          DATE_TRUNC('week', created_at) as period,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        SELECT
          DATE_TRUNC('week', created_at) as period,
          level,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('week', created_at), level
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        SELECT
          DATE_TRUNC('week', e.created_at) as period,
          gs.name as section,
          COUNT(*) as count
        FROM exercises e
        JOIN grammar_sections gs ON e.grammar_section_id = gs.id
        WHERE e.is_active = true
        GROUP BY DATE_TRUNC('week', e.created_at), gs.name
        ORDER BY period ASC, gs.name
      `;

      growthByTopic = await sql`
        SELECT
          DATE_TRUNC('week', created_at) as period,
          content_topic as topic,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
          AND content_topic IS NOT NULL
        GROUP BY DATE_TRUNC('week', created_at), content_topic
        ORDER BY period ASC, content_topic
      `;
    } else {
      // monthly
      overallGrowth = await sql`
        SELECT
          DATE_TRUNC('month', created_at) as period,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY period ASC
      `;

      growthByLevel = await sql`
        SELECT
          DATE_TRUNC('month', created_at) as period,
          level,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
        GROUP BY DATE_TRUNC('month', created_at), level
        ORDER BY period ASC, level
      `;

      growthBySection = await sql`
        SELECT
          DATE_TRUNC('month', e.created_at) as period,
          gs.name as section,
          COUNT(*) as count
        FROM exercises e
        JOIN grammar_sections gs ON e.grammar_section_id = gs.id
        WHERE e.is_active = true
        GROUP BY DATE_TRUNC('month', e.created_at), gs.name
        ORDER BY period ASC, gs.name
      `;

      growthByTopic = await sql`
        SELECT
          DATE_TRUNC('month', created_at) as period,
          content_topic as topic,
          COUNT(*) as count
        FROM exercises
        WHERE is_active = true
          AND content_topic IS NOT NULL
        GROUP BY DATE_TRUNC('month', created_at), content_topic
        ORDER BY period ASC, content_topic
      `;
    }

    // Calculate cumulative totals
    const calculateCumulative = (data: any[]) => {
      let cumulative = 0;
      return data.map((row: any) => {
        cumulative += parseInt(row.count, 10);
        return { ...row, count: cumulative };
      });
    };

    const calculateCumulativeByCategory = (data: any[], categoryKey: string) => {
      // Get all unique periods and categories
      const periods = [...new Set(data.map(row => row.period.getTime()))].sort((a, b) => a - b);
      const categories = [...new Set(data.map(row => row[categoryKey]))];

      // Build a map of period+category -> count for quick lookup
      const dataMap = new Map<string, number>();
      data.forEach(row => {
        const key = `${row.period.getTime()}-${row[categoryKey]}`;
        dataMap.set(key, parseInt(row.count, 10));
      });

      // Calculate cumulative values, carrying forward for missing period-category combinations
      const result: any[] = [];
      const cumulativeByCategory = new Map<string, number>();

      for (const periodTime of periods) {
        for (const category of categories) {
          const key = `${periodTime}-${category}`;
          const dayCount = dataMap.get(key) || 0;
          const previousCumulative = cumulativeByCategory.get(category) || 0;
          const newCumulative = previousCumulative + dayCount;
          cumulativeByCategory.set(category, newCumulative);

          // Only include if cumulative is > 0 (the category has appeared at least once)
          if (newCumulative > 0) {
            result.push({
              period: new Date(periodTime),
              [categoryKey]: category,
              count: newCumulative
            });
          }
        }
      }

      return result;
    };

    // Apply cumulative calculations
    overallGrowth = calculateCumulative(overallGrowth);
    growthByLevel = calculateCumulativeByCategory(growthByLevel, 'level');
    growthBySection = calculateCumulativeByCategory(growthBySection, 'section');
    growthByTopic = calculateCumulativeByCategory(growthByTopic, 'topic');

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
