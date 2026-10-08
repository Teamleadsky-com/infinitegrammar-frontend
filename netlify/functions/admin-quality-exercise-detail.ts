/**
 * GET /api/admin-quality-exercise-detail?id=<exercise id>
 *
 * One exercise for the Quality detail drawer: text and gaps, its quality row (v_exercise_quality),
 * the normalized quality record, audit grades and learner counts (v_exercise_quality_detail).
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, num } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return createResponse(400, { error: 'id is required' });
    }

    const [exerciseRows, gaps, detailRows] = await Promise.all([
      sql`
        SELECT e.id, e.text, e.content_topic, e.model, gs.name AS section_name,
               q.level, q.order_number, q.is_active, q.quality_status, q.report_source,
               q.report_source_label, q.report_text, q.reported_at, q.issue_codes,
               q.verifier_version, q.verified_at, q.generator_config, q.run_id
        FROM exercises e
        JOIN v_exercise_quality q ON q.exercise_id = e.id
        LEFT JOIN grammar_sections gs ON gs.id = e.grammar_section_id
        WHERE e.id = ${id}
      `,
      sql`
        SELECT gap_number, correct_answer, distractors, explanation
        FROM exercise_gaps WHERE exercise_id = ${id} ORDER BY gap_number
      `,
      sql`
        SELECT quality_report, audits, completions, avg_correct_pct
        FROM v_exercise_quality_detail WHERE exercise_id = ${id}
      `,
    ]);

    if (exerciseRows.length === 0) {
      return createResponse(404, { error: 'Exercise not found' });
    }

    const e: any = exerciseRows[0];
    const d: any = detailRows[0] || {};
    return createResponse(200, {
      exercise: {
        id: e.id,
        text: e.text,
        contentTopic: e.content_topic,
        model: e.model,
        sectionName: e.section_name,
        level: e.level,
        orderNumber: e.order_number,
        isActive: e.is_active,
        qualityStatus: e.quality_status,
        reportSource: e.report_source,
        reportSourceLabel: e.report_source_label,
        reportText: e.report_text,
        reportedAt: e.reported_at,
        issueCodes: e.issue_codes || [],
        verifierVersion: e.verifier_version,
        verifiedAt: e.verified_at,
        generatorConfig: e.generator_config,
        runId: e.run_id,
      },
      gaps: gaps.map((g: any) => ({
        gapNumber: g.gap_number,
        correctAnswer: g.correct_answer,
        distractors: g.distractors || [],
        explanation: g.explanation,
      })),
      qualityReport: d.quality_report ?? null,
      audits: d.audits ?? [],
      completions: d.completions ?? 0,
      avgCorrectPct: num(d.avg_correct_pct),
    });
  } catch (error) {
    return handleError(error);
  }
};
