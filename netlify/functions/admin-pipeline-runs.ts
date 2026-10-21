/**
 * GET /api/admin-pipeline-runs
 *
 * Generator pipeline runs (pipeline_runs), newest first, with yield and $ per accepted.
 * yield = accepted / (accepted + rejected); unfinished attempts are left out of it.
 * has_trace: the run has a stage-by-stage trace (pipeline_attempts, migration 014) for the Pipeline trace tab.
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
      SELECT run_id, kind, config, verifier_version, started_at, finished_at, status,
             attempts, accepted, rejected, unfinished, first_pass, repaired_accepted, spent_usd,
             round(100.0 * accepted / nullif(coalesce(accepted, 0) + coalesce(rejected, 0), 0))::int AS yield_pct,
             round(spent_usd / nullif(accepted, 0), 4) AS usd_per_accepted,
             EXISTS (SELECT 1 FROM pipeline_attempts a WHERE a.run_id = pipeline_runs.run_id) AS has_trace
      FROM pipeline_runs
      ORDER BY coalesce(started_at, finished_at, loaded_at) DESC, run_id
    `;

    return createResponse(200, {
      runs: rows.map((r: any) => ({
        runId: r.run_id,
        kind: r.kind,
        config: r.config,
        verifierVersion: r.verifier_version,
        startedAt: r.started_at,
        finishedAt: r.finished_at,
        status: r.status,
        attempts: r.attempts,
        accepted: r.accepted,
        rejected: r.rejected,
        unfinished: r.unfinished,
        firstPass: r.first_pass,
        repairedAccepted: r.repaired_accepted,
        spentUsd: num(r.spent_usd),
        yieldPct: r.yield_pct,
        usdPerAccepted: num(r.usd_per_accepted),
        hasTrace: r.has_trace,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
