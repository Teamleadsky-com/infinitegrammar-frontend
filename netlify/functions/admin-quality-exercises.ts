/**
 * GET /api/admin-quality-exercises
 *
 * Exercise list of the Quality dashboard (v_exercise_quality), newest report or verification first.
 * Each row carries its latest verdict among the selected verification pipelines.
 * Query parameters (all optional): pipelines (comma-separated keys or 'all'), source (report_source),
 * segment (active_verified | active_failed | active_unchecked | inactive_*), level, section,
 * status (quality_status), limit (default 50, max 200), offset.
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
    const source = p.source || null;
    const segment = p.segment || null;
    const level = p.level || null;
    const section = p.section || null;
    const status = p.status || null;
    const limit = Math.min(Math.max(parseInt(p.limit || '50', 10) || 50, 1), 200);
    const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);

    const rows = await sql`
      WITH base AS (
        SELECT q.*, ver.verdict, ver.pipeline AS verdict_pipeline, ver.checked_at AS verdict_at,
               CASE WHEN NOT q.is_active THEN q.segment
                    WHEN ver.verdict = 'passed' THEN 'active_verified'
                    WHEN ver.verdict = 'failed' THEN 'active_failed'
                    ELSE 'active_unchecked' END AS dashboard_segment
        FROM v_exercise_quality q
        LEFT JOIN LATERAL (
          SELECT l.verdict, l.pipeline, l.checked_at FROM v_exercise_verification_latest l
          WHERE l.exercise_id = q.exercise_id AND (${pipelines}::text[] IS NULL OR l.pipeline = ANY(${pipelines}::text[]))
          ORDER BY l.checked_at DESC LIMIT 1
        ) ver ON true
      )
      SELECT q.exercise_id, q.grammar_section_id, gs.name AS section_name, q.level, q.order_number,
             q.is_active, q.quality_status, q.report_source, q.report_source_label, q.dashboard_segment AS segment,
             q.report_text, q.reported_at, q.issue_codes, q.verified_at, q.run_id,
             q.verdict, vp.label AS verdict_pipeline_label, q.verdict_at,
             count(*) OVER ()::int AS total
      FROM base q
      LEFT JOIN grammar_sections gs ON gs.id = q.grammar_section_id
      LEFT JOIN verification_pipelines vp ON vp.pipeline = q.verdict_pipeline
      WHERE (${source}::text IS NULL OR q.report_source = ${source})
        AND (${segment}::text IS NULL OR q.dashboard_segment = ${segment})
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
        verifiedAt: r.verified_at,
        issueCodes: r.issue_codes || [],
        verdict: r.verdict,
        verdictPipeline: r.verdict_pipeline_label,
        verdictAt: r.verdict_at,
        runId: r.run_id,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
