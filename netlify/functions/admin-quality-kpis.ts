/**
 * GET /api/admin-quality-kpis?pipelines=<p1,p2|all>
 *
 * Quality dashboard KPI row plus the reference lists its filters need.
 * "Verified" = live exercises whose latest verdict among the selected verification pipelines
 * (exercise_verifications; all pipelines by default) is 'passed'. Also returns the per-pipeline
 * breakdown (v_verification_by_pipeline).
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
    const pipelines = parseList(event.queryStringParameters?.pipelines);

    const [kpiRows, verifiedRows, breakdown, sections, labels] = await Promise.all([
      sql`SELECT * FROM v_quality_kpis`,
      sql`
        SELECT count(*)::int AS live,
               count(*) FILTER (WHERE ver.verdict = 'passed')::int AS verified,
               count(*) FILTER (WHERE ver.verdict = 'failed')::int AS failed,
               count(*) FILTER (WHERE ver.verdict IS NULL)::int AS unchecked
        FROM exercises e
        LEFT JOIN LATERAL (
          SELECT l.verdict FROM v_exercise_verification_latest l
          WHERE l.exercise_id = e.id AND (${pipelines}::text[] IS NULL OR l.pipeline = ANY(${pipelines}::text[]))
          ORDER BY l.checked_at DESC LIMIT 1
        ) ver ON true
        WHERE e.is_active
      `,
      sql`
        SELECT pipeline, label, kind, runs, last_checked_at, checked, passed, failed,
               live_checked, live_passed, live_failed
        FROM v_verification_by_pipeline ORDER BY sort_order, pipeline
      `,
      sql`
        SELECT id, name, level, order_in_level FROM grammar_sections
        ORDER BY CASE level WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3 WHEN 'B2' THEN 4
                            WHEN 'C1' THEN 5 WHEN 'C2' THEN 6 ELSE 9 END,
                 order_in_level NULLS LAST, name
      `,
      sql`SELECT issue_code, issue_label, issue_order FROM v_issue_labels ORDER BY issue_order`,
    ]);

    const k: any = kpiRows[0] || {};
    const v: any = verifiedRows[0] || {};
    return createResponse(200, {
      kpis: {
        live: v.live ?? 0,
        liveVerified: v.verified ?? 0,
        liveFailed: v.failed ?? 0,
        liveUnchecked: v.unchecked ?? 0,
        openLearnerReports: k.open_learner_reports ?? 0,
        auditConfig: k.audit_config ?? null,
        auditN: k.audit_n ?? null,
        auditCleanPct: k.audit_clean_pct ?? null,
        auditMinorPct: k.audit_minor_pct ?? null,
        auditFlawedPct: k.audit_flawed_pct ?? null,
      },
      pipelines: breakdown.map((p: any) => ({
        pipeline: p.pipeline,
        label: p.label,
        kind: p.kind,
        runs: p.runs,
        lastCheckedAt: p.last_checked_at,
        checked: p.checked,
        passed: p.passed,
        failed: p.failed,
        liveChecked: p.live_checked,
        livePassed: p.live_passed,
        liveFailed: p.live_failed,
      })),
      sections: sections.map((s: any) => ({ id: s.id, name: s.name, level: s.level })),
      issueLabels: labels.map((l: any) => ({ code: l.issue_code, label: l.issue_label, order: l.issue_order })),
    });
  } catch (error) {
    return handleError(error);
  }
};
