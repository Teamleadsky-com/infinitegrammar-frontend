/**
 * GET /api/admin-onboarding?days=7|30|90|all
 *
 * The onboarding funnel of new (anonymous) visitors, from exercise_view_events (migration 008) and
 * session_signups (migration 009): one session = one browser tab (the id lives in memory only).
 * A view = one display of one exercise; it is started with the first answer and completed when
 * submitted. Sessions are counted from their first exercise shown in the period.
 *
 * Returns: funnel totals, how far sessions get (depth 1..10), what happens to the first exercise,
 * daily sessions and signups, entry sections (where sessions land), activity per section, and the
 * funnel across starter positions 1..10.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, num } from './_shared/db';

const PERIODS: Record<string, number | null> = { '7': 7, '30': 30, '90': 90, all: null };

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const period = event.queryStringParameters?.days || '30';
    if (!(period in PERIODS)) {
      return createResponse(400, { error: 'days must be 7, 30, 90 or all' });
    }
    const days = PERIODS[period];
    // Computed here: Neon can't multiply an INTERVAL by a parameter
    const since = days ? new Date(Date.now() - days * 86_400_000).toISOString() : '1970-01-01T00:00:00Z';

    // Views of anonymous sessions whose first exercise was shown in the period
    const base = sql`
      WITH ev AS (
        SELECT * FROM exercise_view_events WHERE user_id IS NULL
      ), views AS (
        SELECT session_id, view_id, min(exercise_id) AS exercise_id, min(starter_position) AS starter_position,
               min(created_at) AS at,
               bool_or(event IN ('started', 'submitted')) AS started,
               bool_or(event = 'submitted') AS submitted,
               max(correct_answers) AS correct, max(total_answers) AS total
        FROM ev GROUP BY session_id, view_id
        HAVING bool_or(event = 'shown')
      ), sess AS (
        SELECT session_id, min(at) AS first_at,
               count(*)::int AS shown,
               count(*) FILTER (WHERE started)::int AS started,
               count(*) FILTER (WHERE submitted)::int AS submitted
        FROM views GROUP BY session_id
        HAVING min(at) >= ${since}::timestamptz
      ), v AS (
        SELECT views.* FROM views JOIN sess USING (session_id)
      )`;

    const [funnel, depth, firstExercise, daily, entry, sections, starters, range] = await Promise.all([
      sql`${base}
        SELECT count(*)::int AS sessions,
               count(*) FILTER (WHERE started > 0)::int AS started,
               count(*) FILTER (WHERE submitted > 0)::int AS completed1,
               count(*) FILTER (WHERE submitted >= 3)::int AS completed3,
               count(su.session_id)::int AS signups,
               coalesce(sum(shown), 0)::int AS views,
               coalesce(sum(submitted), 0)::int AS completions
        FROM sess LEFT JOIN session_signups su USING (session_id)`,
      sql`${base}
        SELECT k::int AS k,
               count(*) FILTER (WHERE sess.shown >= k)::int AS shown,
               count(*) FILTER (WHERE sess.submitted >= k)::int AS completed
        FROM generate_series(1, 10) k CROSS JOIN sess
        GROUP BY k ORDER BY k`,
      sql`${base}, first_view AS (
          SELECT DISTINCT ON (session_id) * FROM v ORDER BY session_id, at, view_id
        )
        SELECT count(*) FILTER (WHERE NOT started)::int AS untouched,
               count(*) FILTER (WHERE started AND NOT submitted)::int AS abandoned,
               count(*) FILTER (WHERE submitted)::int AS completed
        FROM first_view`,
      sql`${base}
        SELECT to_char(sess.first_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
               count(*)::int AS sessions,
               count(*) FILTER (WHERE sess.submitted > 0)::int AS completed1,
               count(su.session_id)::int AS signups
        FROM sess LEFT JOIN session_signups su USING (session_id)
        GROUP BY 1 ORDER BY 1`,
      sql`${base}, first_view AS (
          SELECT DISTINCT ON (session_id) * FROM v ORDER BY session_id, at, view_id
        )
        SELECT x.grammar_section_id AS section_id, gs.name AS section_name, gs.level,
               count(*)::int AS sessions,
               count(*) FILTER (WHERE s.submitted > 0)::int AS completed1,
               count(su.session_id)::int AS signups,
               round(avg(s.shown), 1) AS avg_shown,
               bool_or(f.starter_position IS NOT NULL) AS starter_first
        FROM first_view f
        JOIN sess s USING (session_id)
        JOIN exercises x ON x.id = f.exercise_id
        LEFT JOIN grammar_sections gs ON gs.id = x.grammar_section_id
        LEFT JOIN session_signups su ON su.session_id = f.session_id
        GROUP BY 1, 2, 3 ORDER BY sessions DESC, section_id`,
      sql`${base}
        SELECT x.grammar_section_id AS section_id, gs.name AS section_name, gs.level,
               count(DISTINCT v.session_id)::int AS sessions,
               count(*)::int AS views,
               count(*) FILTER (WHERE v.started)::int AS started,
               count(*) FILTER (WHERE v.submitted)::int AS completed,
               round(100.0 * sum(v.correct) FILTER (WHERE v.submitted) / nullif(sum(v.total) FILTER (WHERE v.submitted), 0)) AS score_pct,
               EXISTS (SELECT 1 FROM starter_exercises st WHERE st.grammar_section_id = x.grammar_section_id) AS has_starters
        FROM v JOIN exercises x ON x.id = v.exercise_id
        LEFT JOIN grammar_sections gs ON gs.id = x.grammar_section_id
        GROUP BY 1, 2, 3 ORDER BY views DESC, section_id`,
      sql`${base}
        SELECT starter_position::int AS position,
               count(*)::int AS shown,
               count(*) FILTER (WHERE started)::int AS started,
               count(*) FILTER (WHERE submitted)::int AS completed
        FROM v WHERE starter_position IS NOT NULL
        GROUP BY 1 ORDER BY 1`,
      sql`SELECT min(created_at) AS first_event FROM exercise_view_events`,
    ]);

    const f: any = funnel[0] || {};
    return createResponse(200, {
      period,
      since: days ? since : null,
      trackingSince: range[0]?.first_event ?? null,
      funnel: {
        sessions: f.sessions ?? 0,
        started: f.started ?? 0,
        completed1: f.completed1 ?? 0,
        completed3: f.completed3 ?? 0,
        signups: f.signups ?? 0,
        views: f.views ?? 0,
        completions: f.completions ?? 0,
      },
      depth: depth.map((d: any) => ({ k: d.k, shown: d.shown, completed: d.completed })),
      firstExercise: firstExercise[0] || { untouched: 0, abandoned: 0, completed: 0 },
      daily: daily.map((d: any) => ({ day: d.day, sessions: d.sessions, completed1: d.completed1, signups: d.signups })),
      entry: entry.map((e: any) => ({
        sectionId: e.section_id,
        sectionName: e.section_name,
        level: e.level,
        sessions: e.sessions,
        completed1: e.completed1,
        signups: e.signups,
        avgShown: num(e.avg_shown),
        starterFirst: e.starter_first,
      })),
      sections: sections.map((s: any) => ({
        sectionId: s.section_id,
        sectionName: s.section_name,
        level: s.level,
        sessions: s.sessions,
        views: s.views,
        started: s.started,
        completed: s.completed,
        scorePct: num(s.score_pct),
        hasStarters: s.has_starters,
      })),
      starters: starters.map((s: any) => ({ position: s.position, shown: s.shown, started: s.started, completed: s.completed })),
    });
  } catch (error) {
    return handleError(error);
  }
};
