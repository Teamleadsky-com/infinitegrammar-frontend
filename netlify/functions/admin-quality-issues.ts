/**
 * GET /api/admin-quality-issues
 *
 * Why exercises fail checks: number of exercises per issue code, for exercises whose latest verdict
 * among the selected verification pipelines is 'failed'. Failures without an issue code (legacy
 * checkers give free-text reasons) are counted as UNTYPED.
 * Query parameters (all optional):
 * - pipelines: comma-separated pipeline keys, or 'all' (default)
 * - level, section (grammar_section_id), run (run_id of the failing verdict)
 * - active: 'true' | 'false'
 * - tolerated: 'true' to add G3_TOL (verified exercises with tolerated mixed-grammar gaps)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, parseList } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const p = event.queryStringParameters || {};
    const pipelines = parseList(p.pipelines);
    const level = p.level || null;
    const section = p.section || null;
    const run = p.run || null;
    const active = p.active === 'true' ? true : p.active === 'false' ? false : null;
    const tolerated = p.tolerated === 'true';

    const [issues, runs] = await Promise.all([
      sql`
        WITH latest AS (
          SELECT e.id, e.is_active, e.level, e.grammar_section_id, e.issue_codes AS exercise_codes, ver.*
          FROM exercises e
          JOIN LATERAL (
            SELECT l.verdict, l.issue_codes, l.run_id FROM v_exercise_verification_latest l
            WHERE l.exercise_id = e.id AND (${pipelines}::text[] IS NULL OR l.pipeline = ANY(${pipelines}::text[]))
            ORDER BY l.checked_at DESC LIMIT 1
          ) ver ON true
          WHERE (${level}::text IS NULL OR e.level = ${level})
            AND (${section}::text IS NULL OR e.grammar_section_id = ${section})
            AND (${active}::boolean IS NULL OR e.is_active = ${active})
        ),
        codes AS (
          SELECT id, unnest(CASE WHEN cardinality(issue_codes) > 0 THEN issue_codes ELSE ARRAY['UNTYPED'] END) AS code
          FROM latest
          WHERE verdict = 'failed' AND (${run}::text IS NULL OR run_id = ${run})
          UNION ALL
          SELECT id, 'G3_TOL' FROM latest
          WHERE ${tolerated} AND verdict = 'passed' AND 'G3_TOL' = ANY(coalesce(exercise_codes, '{}'))
        )
        SELECT c.code AS issue_code,
               coalesce(l.issue_label, CASE c.code WHEN 'UNTYPED' THEN 'No issue type (free-text reason)' ELSE c.code END) AS issue_label,
               coalesce(l.issue_order, 98) AS issue_order,
               count(DISTINCT c.id)::int AS n
        FROM codes c
        LEFT JOIN v_issue_labels l ON l.issue_code = c.code
        GROUP BY 1, 2, 3
        ORDER BY n DESC, issue_order
      `,
      sql`
        SELECT DISTINCT run_id FROM v_exercise_verification_latest
        WHERE verdict = 'failed' AND (${pipelines}::text[] IS NULL OR pipeline = ANY(${pipelines}::text[]))
        ORDER BY run_id
      `,
    ]);

    return createResponse(200, {
      issues: issues.map((r: any) => ({ code: r.issue_code, label: r.issue_label, n: r.n })),
      runs: runs.map((r: any) => r.run_id),
    });
  } catch (error) {
    return handleError(error);
  }
};
