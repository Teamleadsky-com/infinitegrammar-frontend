/**
 * GET /api/admin-quality-issues
 *
 * Why exercises fail checks: number of exercises per issue code (v_quality_issues).
 * Query parameters (all optional):
 * - source: report_source (generation_verifier | live_audit | ...)
 * - level, section (grammar_section_id), run (run_id)
 * - active: 'true' | 'false'
 * - tolerated: 'true' to include G3_TOL (tolerated mixed grammar on passing exercises)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const p = event.queryStringParameters || {};
    const source = p.source || null;
    const level = p.level || null;
    const section = p.section || null;
    const run = p.run || null;
    const active = p.active === 'true' ? true : p.active === 'false' ? false : null;
    const tolerated = p.tolerated === 'true';

    const [issues, runs] = await Promise.all([
      sql`
        SELECT i.issue_code, i.issue_label, coalesce(l.issue_order, 99) AS issue_order,
               count(DISTINCT i.exercise_id)::int AS n
        FROM v_quality_issues i
        LEFT JOIN v_issue_labels l ON l.issue_code = i.issue_code
        WHERE (${source}::text IS NULL OR i.report_source = ${source})
          AND (${level}::text IS NULL OR i.level = ${level})
          AND (${section}::text IS NULL OR i.grammar_section_id = ${section})
          AND (${run}::text IS NULL OR i.run_id = ${run})
          AND (${active}::boolean IS NULL OR i.is_active = ${active})
          AND (${tolerated} OR i.issue_code <> 'G3_TOL')
        GROUP BY i.issue_code, i.issue_label, l.issue_order
        ORDER BY n DESC, issue_order
      `,
      sql`SELECT DISTINCT run_id FROM v_quality_issues WHERE run_id IS NOT NULL ORDER BY run_id`,
    ]);

    return createResponse(200, {
      issues: issues.map((r: any) => ({ code: r.issue_code, label: r.issue_label, n: r.n })),
      runs: runs.map((r: any) => r.run_id),
    });
  } catch (error) {
    return handleError(error);
  }
};
