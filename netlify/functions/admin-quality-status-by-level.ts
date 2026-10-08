/**
 * GET /api/admin-quality-status-by-level?pipelines=<p1,p2|all>
 *
 * Corpus status per level. Live exercises are split by their latest verdict among the selected
 * verification pipelines (active_verified / active_failed / active_unchecked); deactivated exercises
 * keep their deactivation reason (inactive_* segments of v_exercise_quality).
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders, parseList } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const pipelines = parseList(event.queryStringParameters?.pipelines);

    const rows = await sql`
      SELECT q.level,
             CASE WHEN NOT q.is_active THEN q.segment
                  WHEN ver.verdict = 'passed' THEN 'active_verified'
                  WHEN ver.verdict = 'failed' THEN 'active_failed'
                  ELSE 'active_unchecked' END AS segment,
             count(*)::int AS n
      FROM v_exercise_quality q
      LEFT JOIN LATERAL (
        SELECT l.verdict FROM v_exercise_verification_latest l
        WHERE l.exercise_id = q.exercise_id AND (${pipelines}::text[] IS NULL OR l.pipeline = ANY(${pipelines}::text[]))
        ORDER BY l.checked_at DESC LIMIT 1
      ) ver ON true
      GROUP BY 1, 2
    `;

    return createResponse(200, {
      rows: rows.map((r: any) => ({ level: r.level, segment: r.segment, n: r.n })),
    });
  } catch (error) {
    return handleError(error);
  }
};
