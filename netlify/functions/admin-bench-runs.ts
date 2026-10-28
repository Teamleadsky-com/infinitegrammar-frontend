/**
 * GET /api/admin-bench-runs
 *
 * Verifier benchmark runs (generator spec §5.6.1; migration 015 views): one row per run of
 * v_bench_runs, newest first, with detection, false rejects, balanced accuracy, precision at 20% and
 * 50% flawed, cost and time per item; plus the defect type labels (v_bench_type_labels).
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
    const [runs, labels] = await Promise.all([
      sql`
        SELECT run_id, config, tag, dataset, subset, status, mode, started_at, finished_at, items, done, planted,
               caught, caught_expected, clean, false_rejects, detection_pct, false_reject_pct, balanced_accuracy_pct,
               precision_set_pct, precision_at_20_pct, precision_at_50_pct, usd_per_item, seconds_per_item, spent_usd,
               models, final_gate_model
        FROM v_bench_runs
        ORDER BY started_at DESC NULLS LAST, run_id
      `,
      sql`SELECT planted_type, type_label, type_order FROM v_bench_type_labels ORDER BY type_order`,
    ]);

    return createResponse(200, {
      runs: runs.map((r: any) => ({
        runId: r.run_id,
        config: r.config,
        tag: r.tag,
        dataset: r.dataset,
        subset: r.subset,
        status: r.status,
        mode: r.mode,
        startedAt: r.started_at,
        finishedAt: r.finished_at,
        items: r.items,
        done: r.done,
        planted: r.planted,
        caught: r.caught,
        caughtExpected: r.caught_expected,
        clean: r.clean,
        falseRejects: r.false_rejects,
        detectionPct: num(r.detection_pct),
        falseRejectPct: num(r.false_reject_pct),
        balancedAccuracyPct: num(r.balanced_accuracy_pct),
        precisionSetPct: num(r.precision_set_pct),
        precisionAt20Pct: num(r.precision_at_20_pct),
        precisionAt50Pct: num(r.precision_at_50_pct),
        usdPerItem: num(r.usd_per_item),
        secondsPerItem: num(r.seconds_per_item),
        spentUsd: num(r.spent_usd),
        models: r.models || [],
        finalGateModel: r.final_gate_model,
      })),
      typeLabels: labels.map((l: any) => ({ type: l.planted_type, label: l.type_label, order: l.type_order })),
    });
  } catch (error) {
    return handleError(error);
  }
};
