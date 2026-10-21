/**
 * GET /api/admin-pipeline-trace-attempt?run_id=<run id>&attempt_id=<attempt id>
 *
 * One attempt of a run (spec §5.5.5): the attempt, its steps in order (verdict, issue codes,
 * feedback, details, models, cost, times) and every exercise version they entered or left
 * (pipeline_exercise_versions: {text, gaps: [{no, correct, distractors, explanation}]}).
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
    const attemptId = event.queryStringParameters?.attempt_id;
    if (!runId || !attemptId) {
      return createResponse(400, { error: 'run_id and attempt_id are required' });
    }

    const [attempts, steps] = await Promise.all([
      sql`
        SELECT a.*, g.name AS section_name, r.kind AS run_kind
        FROM pipeline_attempts a
        JOIN pipeline_runs r ON r.run_id = a.run_id
        LEFT JOIN grammar_sections g ON g.id = a.grammar_section_id
        WHERE a.run_id = ${runId} AND a.attempt_id = ${attemptId}
      `,
      sql`
        SELECT stage, stage_order, iteration, step_order, verdict, issue_codes, feedback, details, input_version,
               output_version, models, calls, input_tokens, output_tokens, reasoning_tokens, cost_usd, started_at,
               finished_at, call_seconds
        FROM pipeline_steps WHERE run_id = ${runId} AND attempt_id = ${attemptId}
        ORDER BY step_order
      `,
    ]);
    const a: any = attempts[0];
    if (!a) {
      return createResponse(404, { error: 'Attempt not found' });
    }

    const versionIds = [
      ...new Set(
        [a.first_version, a.final_version, ...steps.flatMap((s: any) => [s.input_version, s.output_version])].filter(Boolean),
      ),
    ];
    const versions = versionIds.length
      ? await sql`SELECT version_id, exercise FROM pipeline_exercise_versions WHERE version_id = ANY(${versionIds}::text[])`
      : [];

    return createResponse(200, {
      attempt: {
        attemptId: a.attempt_id,
        runKind: a.run_kind,
        sectionId: a.grammar_section_id,
        sectionName: a.section_name,
        level: a.level,
        contentTopic: a.content_topic,
        scene: a.scene,
        status: a.status,
        issueCodes: a.issue_codes || [],
        firstVersion: a.first_version,
        finalVersion: a.final_version,
        exerciseId: a.exercise_id,
        steps: a.steps,
        calls: a.calls,
        inputTokens: num(a.input_tokens),
        outputTokens: num(a.output_tokens),
        reasoningTokens: num(a.reasoning_tokens),
        costUsd: num(a.cost_usd),
        startedAt: a.started_at,
        finishedAt: a.finished_at,
        callSeconds: num(a.call_seconds),
        details: a.details || {},
      },
      steps: steps.map((s: any) => ({
        stage: s.stage,
        stageOrder: s.stage_order,
        iteration: s.iteration,
        stepOrder: s.step_order,
        verdict: s.verdict,
        issueCodes: s.issue_codes || [],
        feedback: s.feedback,
        details: s.details || {},
        inputVersion: s.input_version,
        outputVersion: s.output_version,
        models: s.models || [],
        calls: s.calls,
        inputTokens: num(s.input_tokens),
        outputTokens: num(s.output_tokens),
        reasoningTokens: num(s.reasoning_tokens),
        costUsd: num(s.cost_usd),
        startedAt: s.started_at,
        finishedAt: s.finished_at,
        callSeconds: num(s.call_seconds),
      })),
      versions: Object.fromEntries(versions.map((v: any) => [v.version_id, v.exercise])),
    });
  } catch (error) {
    return handleError(error);
  }
};
