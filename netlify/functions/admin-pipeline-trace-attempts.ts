/**
 * GET /api/admin-pipeline-trace-attempts?run_id=<run id>[&stage=<stage>&iteration=<n>|last&verdicts=<a,b>&min_iteration=<n>]
 *
 * Attempts of one run (spec §5.5.4):
 * - without stage: every attempt of the run (pipeline_attempts);
 * - with stage and iteration = n: the attempts of that stage iteration whose step verdict is in verdicts
 *   (all verdicts when omitted), with the step's verdict, issue codes and cost;
 * - with stage and iteration = last: the attempts whose last step in the stage has one of verdicts and,
 *   with min_iteration, an iteration of at least that (stage totals: passed, passed after a repair,
 *   failed, other), with the cost of all their steps in the stage.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, num } from './_shared/db';

const ALL_VERDICTS = ['passed', 'retry', 'failed', 'done', 'error', 'pending', 'unknown'];

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const q = event.queryStringParameters || {};
    const runId = q.run_id;
    if (!runId) {
      return createResponse(400, { error: 'run_id is required' });
    }
    const verdicts = q.verdicts ? q.verdicts.split(',').map((v) => v.trim()) : ALL_VERDICTS;
    if (verdicts.some((v) => !ALL_VERDICTS.includes(v))) {
      return createResponse(400, { error: `verdicts must be among ${ALL_VERDICTS.join(', ')}` });
    }
    const iteration = q.iteration === undefined || q.iteration === 'last' ? q.iteration : Number(q.iteration);
    if (q.stage && (iteration === undefined || (typeof iteration === 'number' && !Number.isInteger(iteration)))) {
      return createResponse(400, { error: 'iteration must be a number or "last" when stage is given' });
    }
    const minIteration = Number(q.min_iteration || 0);

    let rows;
    if (!q.stage) {
      rows = await sql`
        SELECT a.attempt_id, a.grammar_section_id, g.name AS section_name, a.level, a.content_topic, a.scene,
               a.status, a.issue_codes, a.exercise_id, a.steps, a.calls, a.cost_usd, a.call_seconds,
               NULL AS verdict, NULL AS step_issue_codes, NULL AS step_cost_usd, NULL AS iteration
        FROM pipeline_attempts a
        LEFT JOIN grammar_sections g ON g.id = a.grammar_section_id
        WHERE a.run_id = ${runId}
        ORDER BY a.grammar_section_id, a.attempt_id
      `;
    } else if (iteration === 'last') {
      rows = await sql`
        WITH last AS (
          SELECT DISTINCT ON (attempt_id) attempt_id, iteration, verdict, issue_codes
          FROM pipeline_steps WHERE run_id = ${runId} AND stage = ${q.stage}
          ORDER BY attempt_id, iteration DESC
        ), cost AS (
          SELECT attempt_id, sum(cost_usd) AS cost_usd
          FROM pipeline_steps WHERE run_id = ${runId} AND stage = ${q.stage} GROUP BY attempt_id
        )
        SELECT a.attempt_id, a.grammar_section_id, g.name AS section_name, a.level, a.content_topic, a.scene,
               a.status, a.issue_codes, a.exercise_id, a.steps, a.calls, a.cost_usd, a.call_seconds,
               l.verdict, l.issue_codes AS step_issue_codes, c.cost_usd AS step_cost_usd, l.iteration
        FROM last l
        JOIN pipeline_attempts a ON a.run_id = ${runId} AND a.attempt_id = l.attempt_id
        JOIN cost c ON c.attempt_id = l.attempt_id
        LEFT JOIN grammar_sections g ON g.id = a.grammar_section_id
        WHERE l.verdict = ANY(${verdicts}::text[]) AND l.iteration >= ${minIteration}
        ORDER BY a.grammar_section_id, a.attempt_id
      `;
    } else {
      rows = await sql`
        SELECT a.attempt_id, a.grammar_section_id, g.name AS section_name, a.level, a.content_topic, a.scene,
               a.status, a.issue_codes, a.exercise_id, a.steps, a.calls, a.cost_usd, a.call_seconds,
               s.verdict, s.issue_codes AS step_issue_codes, s.cost_usd AS step_cost_usd, s.iteration
        FROM pipeline_steps s
        JOIN pipeline_attempts a USING (run_id, attempt_id)
        LEFT JOIN grammar_sections g ON g.id = a.grammar_section_id
        WHERE s.run_id = ${runId} AND s.stage = ${q.stage} AND s.iteration = ${iteration}
          AND s.verdict = ANY(${verdicts}::text[])
        ORDER BY a.grammar_section_id, a.attempt_id
      `;
    }

    return createResponse(200, {
      attempts: rows.map((r: any) => ({
        attemptId: r.attempt_id,
        sectionId: r.grammar_section_id,
        sectionName: r.section_name,
        level: r.level,
        contentTopic: r.content_topic,
        scene: r.scene,
        status: r.status,
        issueCodes: r.issue_codes || [],
        exerciseId: r.exercise_id,
        steps: r.steps,
        calls: r.calls,
        costUsd: num(r.cost_usd),
        callSeconds: num(r.call_seconds),
        verdict: r.verdict,
        stepIssueCodes: r.step_issue_codes,
        stepCostUsd: num(r.step_cost_usd),
        iteration: r.iteration,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
