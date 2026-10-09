/**
 * GET /api/admin-quality-exercises
 *
 * Exercise list of the Quality dashboard (v_exercise_quality), newest report or verification first.
 * Query parameters (all optional): source (effective report_source from the view), segment (view
 * segment; 'active_passed_other' = live, passed, verified by a check other than `verifier`),
 * verifier (verifier_version), level, section, status (quality_status), limit (default 50, max 200),
 * offset.
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
    const verifier = p.verifier || null;
    const otherVerifier = p.segment === 'active_passed_other';
    const segment = otherVerifier ? 'active_passed' : p.segment || null;
    const level = p.level || null;
    const section = p.section || null;
    const status = p.status || null;
    const limit = Math.min(Math.max(parseInt(p.limit || '50', 10) || 50, 1), 200);
    const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);

    const rows = await sql`
      SELECT q.exercise_id, q.grammar_section_id, gs.name AS section_name, q.level, q.order_number,
             q.is_active, q.quality_status, q.report_source, q.report_source_label, q.segment,
             q.report_text, q.reported_at, q.issue_codes, q.verifier_version, q.verified_at, q.run_id,
             count(*) OVER ()::int AS total
      FROM v_exercise_quality q
      LEFT JOIN grammar_sections gs ON gs.id = q.grammar_section_id
      WHERE (${source}::text IS NULL OR q.report_source = ${source})
        AND (${segment}::text IS NULL OR q.segment = ${segment})
        AND (${verifier}::text IS NULL OR
             (CASE WHEN ${otherVerifier} THEN q.verifier_version IS DISTINCT FROM ${verifier}
                   ELSE q.verifier_version = ${verifier} END))
        AND (${level}::text IS NULL OR q.level = ${level})
        AND (${section}::text IS NULL OR q.grammar_section_id = ${section})
        AND (${status}::text IS NULL OR q.quality_status = ${status})
      ORDER BY coalesce(q.reported_at, q.verified_at) DESC NULLS LAST, q.level, q.order_number
      LIMIT ${limit} OFFSET ${offset}
    `;

    return createResponse(200, {
      total: rows.length > 0 ? rows[0].total : 0,
      exercises: rows.map((r: any) => ({
        id: r.exercise_id,
        sectionId: r.grammar_section_id,
        sectionName: r.section_name,
        level: r.level,
        orderNumber: r.order_number,
        isActive: r.is_active,
        qualityStatus: r.quality_status,
        reportSource: r.report_source,
        reportSourceLabel: r.report_source_label,
        segment: r.segment,
        reportText: r.report_text,
        reportedAt: r.reported_at,
        verifierVersion: r.verifier_version,
        verifiedAt: r.verified_at,
        issueCodes: r.issue_codes || [],
        runId: r.run_id,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
