/**
 * GET /api/admin-pipeline-trace?run_id=<run id>
 *
 * The stages of one run, top to bottom (spec §5.5.3): per stage the totals (v_pipeline_stages),
 * per iteration the counts, cost and times (v_pipeline_iterations) and why exercises were sent
 * back or rejected (v_pipeline_iteration_issues), plus what each stage runs: models, settings,
 * prompt templates and rules (pipeline_stage_defs).
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

    const [stages, iterations, issues, defs, labels] = await Promise.all([
      sql`
        SELECT stage, stage_label, stage_order, n_in, n_passed, n_failed, n_other, n_passed_first_try,
               n_passed_after_retry, max_iteration_used, calls, input_tokens, output_tokens, reasoning_tokens,
               cost_usd, started_at, finished_at, span_seconds, call_seconds
        FROM v_pipeline_stages WHERE run_id = ${runId} ORDER BY stage_order
      `,
      sql`
        SELECT stage, iteration, n_in, n_passed, n_retry, n_failed, n_other, calls, input_tokens, output_tokens,
               reasoning_tokens, cost_usd, models, started_at, finished_at, span_seconds, call_seconds
        FROM v_pipeline_iterations WHERE run_id = ${runId} ORDER BY stage_order, iteration
      `,
      sql`
        SELECT i.stage, i.iteration, i.issue_code, i.issue_label, i.n_retry, i.n_failed, i.n
        FROM v_pipeline_iteration_issues i
        LEFT JOIN v_pipeline_issue_labels l ON l.issue_code = i.issue_code
        WHERE i.run_id = ${runId}
        ORDER BY i.stage, i.iteration, i.n_retry + i.n_failed DESC, coalesce(l.issue_order, 99), i.issue_code
      `,
      sql`
        SELECT stage, stage_order, max_iterations, component, component_order, kind, model, settings,
               prompt_id, prompt_text, rules_text, applies, snapshot
        FROM pipeline_stage_defs WHERE run_id = ${runId} ORDER BY stage_order, component_order
      `,
      sql`SELECT issue_code, issue_label FROM v_pipeline_issue_labels ORDER BY issue_order`,
    ]);

    const times = (r: any) => ({
      startedAt: r.started_at,
      finishedAt: r.finished_at,
      spanSeconds: num(r.span_seconds),
      callSeconds: num(r.call_seconds),
    });
    const tokens = (r: any) => ({
      calls: r.calls,
      inputTokens: num(r.input_tokens),
      outputTokens: num(r.output_tokens),
      reasoningTokens: num(r.reasoning_tokens),
      costUsd: num(r.cost_usd),
    });

    return createResponse(200, {
      stages: stages.map((s: any) => ({
        stage: s.stage,
        stageLabel: s.stage_label,
        stageOrder: s.stage_order,
        nIn: s.n_in,
        nPassed: s.n_passed,
        nFailed: s.n_failed,
        nOther: s.n_other,
        nPassedFirstTry: s.n_passed_first_try,
        nPassedAfterRetry: s.n_passed_after_retry,
        maxIterationUsed: s.max_iteration_used,
        ...tokens(s),
        ...times(s),
      })),
      iterations: iterations.map((i: any) => ({
        stage: i.stage,
        iteration: i.iteration,
        nIn: i.n_in,
        nPassed: i.n_passed,
        nRetry: i.n_retry,
        nFailed: i.n_failed,
        nOther: i.n_other,
        models: i.models || [],
        ...tokens(i),
        ...times(i),
      })),
      issues: issues.map((i: any) => ({
        stage: i.stage,
        iteration: i.iteration,
        issueCode: i.issue_code,
        issueLabel: i.issue_label,
        nRetry: i.n_retry,
        nFailed: i.n_failed,
        n: i.n,
      })),
      stageDefs: defs.map((d: any) => ({
        stage: d.stage,
        stageOrder: d.stage_order,
        maxIterations: d.max_iterations,
        component: d.component,
        componentOrder: d.component_order,
        kind: d.kind,
        model: d.model,
        settings: d.settings || {},
        promptId: d.prompt_id,
        promptText: d.prompt_text,
        rulesText: d.rules_text,
        applies: d.applies,
        snapshot: d.snapshot,
      })),
      issueLabels: Object.fromEntries(labels.map((l: any) => [l.issue_code, l.issue_label])),
    });
  } catch (error) {
    return handleError(error);
  }
};
