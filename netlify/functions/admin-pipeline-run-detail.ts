/**
 * GET /api/admin-pipeline-run-detail?run_id=<run id>
 *
 * One pipeline run: funnel (pipeline_funnel), cost per stage x model (pipeline_stage_costs)
 * and yield by level (v_run_yield_by_level). Drop reasons are issue codes; labels come from
 * v_issue_labels.
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
    const runId = event.queryStringParameters?.run_id;
    if (!runId) {
      return createResponse(400, { error: 'run_id is required' });
    }

    const [funnel, costs, levels, labels] = await Promise.all([
      sql`
        SELECT step_order, step, n_in, n_out, drop_reasons
        FROM pipeline_funnel WHERE run_id = ${runId} ORDER BY step_order
      `,
      sql`
        SELECT stage, stage_order, model, requests, attempts, input_tokens, output_tokens,
               reasoning_tokens, cost_usd
        FROM pipeline_stage_costs WHERE run_id = ${runId} ORDER BY stage_order, model
      `,
      sql`
        SELECT level, attempts, accepted, rejected, yield_pct
        FROM v_run_yield_by_level WHERE run_id = ${runId}
        ORDER BY CASE level WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3 WHEN 'B2' THEN 4
                            WHEN 'C1' THEN 5 WHEN 'C2' THEN 6 ELSE 9 END
      `,
      sql`SELECT issue_code, issue_label FROM v_issue_labels`,
    ]);

    return createResponse(200, {
      funnel: funnel.map((f: any) => ({
        stepOrder: f.step_order,
        step: f.step,
        nIn: f.n_in,
        nOut: f.n_out,
        dropReasons: f.drop_reasons || {},
      })),
      costs: costs.map((c: any) => ({
        stage: c.stage,
        stageOrder: c.stage_order,
        model: c.model,
        requests: c.requests,
        attempts: c.attempts,
        inputTokens: num(c.input_tokens),
        outputTokens: num(c.output_tokens),
        reasoningTokens: num(c.reasoning_tokens),
        costUsd: num(c.cost_usd),
      })),
      levels: levels.map((l: any) => ({
        level: l.level,
        attempts: l.attempts,
        accepted: l.accepted,
        rejected: l.rejected,
        yieldPct: l.yield_pct,
      })),
      issueLabels: Object.fromEntries(labels.map((l: any) => [l.issue_code, l.issue_label])),
    });
  } catch (error) {
    return handleError(error);
  }
};
