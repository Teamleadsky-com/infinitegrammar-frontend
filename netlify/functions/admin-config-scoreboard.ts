/**
 * GET /api/admin-config-scoreboard
 *
 * One row per generator config (v_config_scoreboard): yield, first-draft pass, cost and audit
 * grades pooled over all of the config's runs. The production config comes first.
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
      SELECT config, models, reasoning_effort, decision_id, status, decided_on, notes, runs,
             attempts, yield_pct, first_pass_pct, usd_per_accepted, usd_per_clean,
             audit_n, clean_pct, minor_pct, flawed_pct
      FROM v_config_scoreboard
      ORDER BY CASE status WHEN 'production' THEN 1 WHEN 'candidate' THEN 2 WHEN 'previous' THEN 3
                           WHEN 'experiment' THEN 4 WHEN 'rejected' THEN 5 ELSE 6 END,
               decided_on DESC NULLS LAST, config
    `;

    return createResponse(200, {
      configs: rows.map((r: any) => ({
        config: r.config,
        models: r.models,
        reasoningEffort: r.reasoning_effort,
        decisionId: r.decision_id,
        status: r.status,
        decidedOn: r.decided_on,
        notes: r.notes,
        runs: r.runs,
        attempts: r.attempts,
        yieldPct: r.yield_pct,
        firstPassPct: r.first_pass_pct,
        usdPerAccepted: num(r.usd_per_accepted),
        usdPerClean: num(r.usd_per_clean),
        auditN: r.audit_n,
        cleanPct: r.clean_pct,
        minorPct: r.minor_pct,
        flawedPct: r.flawed_pct,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
