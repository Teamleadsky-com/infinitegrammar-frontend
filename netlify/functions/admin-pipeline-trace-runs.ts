/**
 * GET /api/admin-pipeline-trace-runs
 *
 * Runs with a stage-by-stage trace (v_pipeline_runs WHERE has_trace, migration 014 of the
 * generator repo): production, experiment and regression runs, newest first, with the totals
 * of the Pipeline trace run header (spec §5.5.1–5.5.2).
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
    const rows = await sql`
      SELECT run_id, kind, config, verifier_version, mode, status, requested, attempts, accepted, rejected,
             unfinished, spent_usd, started_at, finished_at, duration_seconds, yield_pct, requested_met_pct,
             usd_per_accepted, stage_defs_snapshot
      FROM v_pipeline_runs
      WHERE has_trace
      ORDER BY started_at DESC NULLS LAST, run_id
    `;

    return createResponse(200, {
      runs: rows.map((r: any) => ({
        runId: r.run_id,
        kind: r.kind,
        config: r.config,
        verifierVersion: r.verifier_version,
        mode: r.mode,
        status: r.status,
        requested: r.requested,
        attempts: r.attempts,
        accepted: r.accepted,
        rejected: r.rejected,
        unfinished: r.unfinished,
        spentUsd: num(r.spent_usd),
        startedAt: r.started_at,
        finishedAt: r.finished_at,
        durationSeconds: num(r.duration_seconds),
        yieldPct: num(r.yield_pct),
        requestedMetPct: num(r.requested_met_pct),
        usdPerAccepted: num(r.usd_per_accepted),
        stageDefsSnapshot: r.stage_defs_snapshot,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
