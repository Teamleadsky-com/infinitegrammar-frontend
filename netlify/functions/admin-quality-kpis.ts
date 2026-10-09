/**
 * GET /api/admin-quality-kpis
 *
 * Quality dashboard KPI row (v_quality_kpis; "verified" = quality_status 'passed'), the breakdown
 * of exercises by the check that set their status (v_exercise_quality.verifier_version), and the
 * reference lists the filters need (grammar sections, issue labels).
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
    const [kpiRows, verifiers, sections, labels] = await Promise.all([
      sql`SELECT * FROM v_quality_kpis`,
      sql`
        SELECT verifier_version,
               count(*) FILTER (WHERE is_active AND quality_status = 'passed')::int AS live_passed,
               count(*) FILTER (WHERE NOT is_active AND quality_status = 'rejected')::int AS rejected,
               count(*) FILTER (WHERE is_active AND quality_status = 'rejected')::int AS live_reactivated,
               max(verified_at) AS last_verified_at
        FROM v_exercise_quality
        WHERE verifier_version IS NOT NULL
        GROUP BY verifier_version
        ORDER BY live_passed DESC, verifier_version
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
    return createResponse(200, {
      kpis: {
        live: k.live ?? 0,
        livePassed: k.live_passed ?? 0,
        liveLegacy: k.live_legacy ?? 0,
        livePending: k.live_pending ?? 0,
        liveReactivated: k.live_reactivated ?? 0,
        openLearnerReports: k.open_learner_reports ?? 0,
        auditConfig: k.audit_config ?? null,
        auditN: k.audit_n ?? null,
        auditCleanPct: k.audit_clean_pct ?? null,
        auditMinorPct: k.audit_minor_pct ?? null,
        auditFlawedPct: k.audit_flawed_pct ?? null,
      },
      verifiers: verifiers.map((v: any) => ({
        verifierVersion: v.verifier_version,
        livePassed: v.live_passed,
        rejected: v.rejected,
        liveReactivated: v.live_reactivated,
        lastVerifiedAt: v.last_verified_at,
      })),
      sections: sections.map((s: any) => ({ id: s.id, name: s.name, level: s.level })),
      issueLabels: labels.map((l: any) => ({ code: l.issue_code, label: l.issue_label, order: l.issue_order })),
    });
  } catch (error) {
    return handleError(error);
  }
};
