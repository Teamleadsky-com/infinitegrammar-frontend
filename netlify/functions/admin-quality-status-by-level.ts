/**
 * GET /api/admin-quality-status-by-level?verifier=<verifier_version>
 *
 * Corpus status per level (v_quality_status_by_level). With `verifier`, the live verified segment
 * (active_passed) is split into exercises verified by that check and active_passed_other (verified
 * by another check); every other segment and the level totals are unchanged.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const verifier = event.queryStringParameters?.verifier || null;

    const rows = verifier
      ? await sql`
          SELECT level,
                 CASE WHEN segment = 'active_passed' AND verifier_version IS DISTINCT FROM ${verifier}
                      THEN 'active_passed_other' ELSE segment END AS segment,
                 count(*)::int AS n
          FROM v_exercise_quality
          GROUP BY 1, 2
        `
      : await sql`SELECT level, segment, n FROM v_quality_status_by_level`;

    return createResponse(200, {
      rows: rows.map((r: any) => ({ level: r.level, segment: r.segment, n: r.n })),
    });
  } catch (error) {
    return handleError(error);
  }
};
