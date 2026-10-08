/**
 * GET /api/admin-quality-status-by-level
 *
 * Corpus status per level (v_quality_status_by_level): exercise counts per level x segment.
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
    const rows = await sql`SELECT level, segment, n FROM v_quality_status_by_level`;
    return createResponse(200, {
      rows: rows.map((r: any) => ({ level: r.level, segment: r.segment, n: r.n })),
    });
  } catch (error) {
    return handleError(error);
  }
};
