/**
 * GET /api/admin-learner-signal
 *
 * Live exercises with at least 5 completions and their average correct % (v_learner_signal),
 * lowest first, to spot ambiguous (very low) or trivial (very high) exercises.
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
      SELECT s.exercise_id, s.grammar_section_id, gs.name AS section_name, s.level, s.order_number,
             s.completions, s.avg_correct_pct
      FROM v_learner_signal s
      LEFT JOIN grammar_sections gs ON gs.id = s.grammar_section_id
      ORDER BY s.avg_correct_pct ASC NULLS LAST, s.completions DESC
    `;

    return createResponse(200, {
      exercises: rows.map((r: any) => ({
        id: r.exercise_id,
        sectionId: r.grammar_section_id,
        sectionName: r.section_name,
        level: r.level,
        orderNumber: r.order_number,
        completions: r.completions,
        avgCorrectPct: num(r.avg_correct_pct),
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
