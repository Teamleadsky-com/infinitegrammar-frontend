/**
 * GET /api/admin-supply
 *
 * Supply dashboard: one row per grammar section from v_section_supply
 * (active vs used exercises for the most advanced learner; status colour computed in the view).
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
    const rows = await sql`
      SELECT grammar_section_id, section_name, level, level_rank, order_in_level,
             active, used, remaining, learners_started, learners_le3_left,
             top_learner_last_completed_at, status
      FROM v_section_supply
      ORDER BY level_rank, order_in_level NULLS LAST, section_name
    `;

    return createResponse(200, {
      sections: rows.map((r: any) => ({
        sectionId: r.grammar_section_id,
        sectionName: r.section_name,
        level: r.level,
        orderInLevel: r.order_in_level,
        active: r.active,
        used: r.used,
        remaining: r.remaining,
        learnersStarted: r.learners_started,
        learnersLe3Left: r.learners_le3_left,
        topLearnerLastCompletedAt: r.top_learner_last_completed_at,
        status: r.status,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
