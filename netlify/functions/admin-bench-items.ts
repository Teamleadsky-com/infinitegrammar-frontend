/**
 * GET /api/admin-bench-items?run_id=<A>[&compare=<B>]
 *
 * Items of a verifier benchmark run (generator spec §5.6.5, v_bench_items); with compare=<B> the two
 * runs side by side on their common finished items (§5.6.4), plus both runs' results by defect type.
 * Only runs of the same dataset can be compared.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, num } from './_shared/db';
import { typeMetric } from './_shared/bench';

const item = (r: any) => ({
  attemptId: r.attempt_id,
  parentId: r.parent_id,
  subset: r.subset,
  sectionId: r.grammar_section_id,
  level: r.level,
  plantedType: r.planted_type,
  plantedVariant: r.planted_variant,
  plantedAuthor: r.planted_author,
  seenInCalibration: r.seen_in_calibration,
  cleanSource: r.clean_source,
  status: r.status,
  rejected: r.rejected,
  done: r.done,
  flaggedStages: r.flagged_stages || [],
  flaggedCodes: r.flagged_codes || [],
  expectedHit: r.expected_hit,
  atGap: r.at_gap,
  costUsd: num(r.cost_usd),
  callSeconds: num(r.call_seconds),
  wallSeconds: num(r.wall_seconds),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const runId = event.queryStringParameters?.run_id;
    const compare = event.queryStringParameters?.compare;
    if (!runId) {
      return createResponse(400, { error: 'run_id is required' });
    }

    if (!compare) {
      const rows = await sql`
        SELECT * FROM v_bench_items WHERE run_id = ${runId}
        ORDER BY (planted_type = 'clean'), planted_type, attempt_id
      `;
      return createResponse(200, { items: rows.map(item) });
    }

    const datasets = await sql`
      SELECT run_id, dataset, subset FROM v_bench_runs WHERE run_id IN (${runId}, ${compare})
    `;
    const a = datasets.find((d: any) => d.run_id === runId);
    const b = datasets.find((d: any) => d.run_id === compare);
    if (!a || !b) {
      return createResponse(404, { error: 'Run not found' });
    }
    if (a.dataset !== b.dataset) {
      return createResponse(400, { error: `Runs of different datasets can't be compared (${a.dataset} vs ${b.dataset})` });
    }

    const [rows, typesA, typesB] = await Promise.all([
      sql`
        SELECT a.attempt_id, a.planted_type, a.level, a.grammar_section_id,
               a.rejected AS a_rejected, b.rejected AS b_rejected,
               a.flagged_stages AS a_stages, b.flagged_stages AS b_stages,
               a.flagged_codes AS a_codes, b.flagged_codes AS b_codes
        FROM v_bench_items a JOIN v_bench_items b USING (attempt_id)
        WHERE a.run_id = ${runId} AND b.run_id = ${compare} AND a.done AND b.done
        ORDER BY (a.planted_type = 'clean'), a.planted_type, a.attempt_id
      `,
      sql`SELECT * FROM v_bench_type_metrics WHERE run_id = ${runId} ORDER BY type_order`,
      sql`SELECT * FROM v_bench_type_metrics WHERE run_id = ${compare} ORDER BY type_order`,
    ]);

    return createResponse(200, {
      subsetsDiffer: a.subset !== b.subset,
      subsets: { a: a.subset, b: b.subset },
      rows: rows.map((r: any) => ({
        attempt_id: r.attempt_id,
        planted_type: r.planted_type,
        level: r.level,
        sectionId: r.grammar_section_id,
        a_rejected: r.a_rejected,
        b_rejected: r.b_rejected,
        aStages: r.a_stages || [],
        bStages: r.b_stages || [],
        aCodes: r.a_codes || [],
        bCodes: r.b_codes || [],
      })),
      typesA: typesA.map(typeMetric),
      typesB: typesB.map(typeMetric),
    });
  } catch (error) {
    return handleError(error);
  }
};
