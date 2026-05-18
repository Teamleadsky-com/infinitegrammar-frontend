/**
 * GET /api/admin-product-metrics
 *
 * Returns product metrics for the admin dashboard:
 * - Retention cohorts (week 1 / week 4 / week 8)
 * - Weekly engagement (WAU, sessions per user)
 * - Monthly engagement (MAU, sessions per user)
 *
 * Admin user is excluded from all metrics.
 * A "session" is defined as a group of completions where each is within 30 minutes of the previous.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

const ADMIN_EMAIL = 'aleksandr.zuravliov1@gmail.com';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const adminUser = await sql`SELECT id FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1`;
    const adminId = adminUser[0]?.id;

    const [retention, weekly, monthly] = await Promise.all([
      getRetentionCohorts(adminId),
      getWeeklyEngagement(adminId),
      getMonthlyEngagement(adminId),
    ]);

    return createResponse(200, { retention, weekly, monthly });
  } catch (error) {
    return handleError(error);
  }
};

async function getRetentionCohorts(adminId: string | undefined) {
  const rows = await sql`
    WITH cohorts AS (
      SELECT
        u.id AS user_id,
        date_trunc('week', u.created_at) AS cohort_week
      FROM users u
      WHERE u.created_at >= NOW() - INTERVAL '14 weeks'
        AND (${adminId}::uuid IS NULL OR u.id != ${adminId}::uuid)
    ),
    activity AS (
      SELECT
        c.user_id,
        c.cohort_week,
        EXTRACT(DAY FROM (ec.completed_at - c.cohort_week)) / 7 AS weeks_since_signup
      FROM cohorts c
      JOIN exercise_completions ec ON ec.user_id = c.user_id
      WHERE ec.completed_at >= c.cohort_week
    )
    SELECT
      to_char(c.cohort_week, 'IYYY-"W"IW') AS cohort,
      c.cohort_week,
      COUNT(DISTINCT c.user_id) AS registered,
      COUNT(DISTINCT CASE WHEN a.weeks_since_signup >= 1 AND a.weeks_since_signup < 2 THEN a.user_id END) AS week1,
      COUNT(DISTINCT CASE WHEN a.weeks_since_signup >= 4 AND a.weeks_since_signup < 5 THEN a.user_id END) AS week4,
      COUNT(DISTINCT CASE WHEN a.weeks_since_signup >= 8 AND a.weeks_since_signup < 9 THEN a.user_id END) AS week8
    FROM cohorts c
    LEFT JOIN activity a ON a.user_id = c.user_id AND a.cohort_week = c.cohort_week
    GROUP BY c.cohort_week
    ORDER BY c.cohort_week
  `;

  return rows.map((r: any) => ({
    cohort: r.cohort,
    registered: parseInt(r.registered, 10),
    week1: parseInt(r.week1, 10),
    week4: parseInt(r.week4, 10),
    week8: parseInt(r.week8, 10),
    week1_pct: r.registered > 0 ? Math.round((r.week1 / r.registered) * 100) : 0,
    week4_pct: r.registered > 0 ? Math.round((r.week4 / r.registered) * 100) : 0,
    week8_pct: r.registered > 0 ? Math.round((r.week8 / r.registered) * 100) : 0,
  }));
}

async function getWeeklyEngagement(adminId: string | undefined) {
  const rows = await sql`
    WITH completions AS (
      SELECT
        ec.user_id,
        ec.completed_at,
        to_char(ec.completed_at, 'IYYY-"W"IW') AS week,
        date_trunc('week', ec.completed_at) AS week_start,
        LAG(ec.completed_at) OVER (PARTITION BY ec.user_id ORDER BY ec.completed_at) AS prev_completed_at
      FROM exercise_completions ec
      WHERE ec.completed_at >= NOW() - INTERVAL '52 weeks'
        AND (${adminId}::uuid IS NULL OR ec.user_id != ${adminId}::uuid)
    ),
    sessions AS (
      SELECT
        user_id,
        week,
        week_start,
        SUM(CASE
          WHEN prev_completed_at IS NULL
            OR EXTRACT(EPOCH FROM (completed_at - prev_completed_at)) > 1800
          THEN 1 ELSE 0
        END) AS session_starts
      FROM completions
      GROUP BY user_id, week, week_start
    )
    SELECT
      s.week,
      s.week_start,
      COUNT(DISTINCT s.user_id) AS wau,
      ROUND(SUM(s.session_starts)::numeric / NULLIF(COUNT(DISTINCT s.user_id), 0), 1) AS sessions_per_user
    FROM sessions s
    GROUP BY s.week, s.week_start
    ORDER BY s.week_start
  `;

  return rows.map((r: any) => ({
    week: r.week,
    wau: parseInt(r.wau, 10),
    sessions_per_user: parseFloat(r.sessions_per_user) || 0,
  }));
}

async function getMonthlyEngagement(adminId: string | undefined) {
  const rows = await sql`
    WITH completions AS (
      SELECT
        ec.user_id,
        ec.completed_at,
        to_char(ec.completed_at, 'YYYY-MM') AS month,
        date_trunc('month', ec.completed_at) AS month_start,
        LAG(ec.completed_at) OVER (PARTITION BY ec.user_id ORDER BY ec.completed_at) AS prev_completed_at
      FROM exercise_completions ec
      WHERE ec.completed_at >= NOW() - INTERVAL '24 months'
        AND (${adminId}::uuid IS NULL OR ec.user_id != ${adminId}::uuid)
    ),
    sessions AS (
      SELECT
        user_id,
        month,
        month_start,
        SUM(CASE
          WHEN prev_completed_at IS NULL
            OR EXTRACT(EPOCH FROM (completed_at - prev_completed_at)) > 1800
          THEN 1 ELSE 0
        END) AS session_starts
      FROM completions
      GROUP BY user_id, month, month_start
    )
    SELECT
      s.month,
      s.month_start,
      COUNT(DISTINCT s.user_id) AS mau,
      ROUND(SUM(s.session_starts)::numeric / NULLIF(COUNT(DISTINCT s.user_id), 0), 1) AS sessions_per_user
    FROM sessions s
    GROUP BY s.month, s.month_start
    ORDER BY s.month_start
  `;

  return rows.map((r: any) => ({
    month: r.month,
    mau: parseInt(r.mau, 10),
    sessions_per_user: parseFloat(r.sessions_per_user) || 0,
  }));
}
