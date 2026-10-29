/**
 * GET /api/admin-bench-run?run_id=<run id>
 *
 * One verifier benchmark run (generator spec §5.6.2–5.6.3): results by defect type
 * (v_bench_type_metrics) and by stage (v_bench_stage_metrics).
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, num } from './_shared/db';
import { typeMetric } from './_shared/bench';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const runId = event.queryStringParameters?.run_id;
    if (!runId) {
      return createResponse(400, { error: 'run_id is required' });
    }

    const [types, stages] = await Promise.all([
      sql`
        SELECT planted_type, type_label, type_order, n, rejected, rejected_pct, rejected_expected, n_with_gap, at_gap
        FROM v_bench_type_metrics WHERE run_id = ${runId} ORDER BY type_order
      `,
      sql`
        SELECT stage, stage_label, stage_order, planted_n, planted_flagged, own_n, own_flagged, own_recall_pct,
               clean_n, clean_flagged, clean_flagged_pct
        FROM v_bench_stage_metrics WHERE run_id = ${runId} ORDER BY stage_order
      `,
    ]);

    return createResponse(200, {
      types: types.map(typeMetric),
      stages: stages.map((s: any) => ({
        stage: s.stage,
        label: s.stage_label,
        order: s.stage_order,
        plantedN: s.planted_n,
        plantedFlagged: s.planted_flagged,
        ownN: s.own_n,
        ownFlagged: s.own_flagged,
        ownRecallPct: num(s.own_recall_pct),
        cleanN: s.clean_n,
        cleanFlagged: s.clean_flagged,
        cleanFlaggedPct: num(s.clean_flagged_pct),
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
