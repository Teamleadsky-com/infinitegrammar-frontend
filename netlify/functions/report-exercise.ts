/**
 * /api/report-exercise
 *
 * POST - Report an exercise as having an issue, save report text, mark inactive
 * GET  - List all flagged exercises (admin)
 * PATCH - Reactivate a flagged exercise (admin)
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // POST: Flag an exercise
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { exerciseId, reportText } = body;

      if (!exerciseId) {
        return createResponse(400, { error: 'Exercise ID is required' });
      }

      const result = await sql`
        UPDATE exercises
        SET is_active = false,
            report_text = ${reportText || null},
            reported_at = NOW()
        WHERE id = ${exerciseId}
        RETURNING id, is_active
      `;

      if (result.length === 0) {
        return createResponse(404, { error: 'Exercise not found' });
      }

      console.log(`Exercise ${exerciseId} flagged. Report: ${reportText?.substring(0, 100)}`);

      return createResponse(200, {
        success: true,
        message: 'Exercise has been flagged and removed from circulation',
        exerciseId: result[0].id,
      });
    }

    // GET: List flagged exercises with gaps
    if (event.httpMethod === 'GET') {
      const [exercises, gaps] = await Promise.all([
        sql`
          SELECT e.id, e.level, e.text, e.report_text, e.reported_at,
                 gs.name as section_name
          FROM exercises e
          JOIN grammar_sections gs ON e.grammar_section_id = gs.id
          WHERE e.is_active = false
          ORDER BY e.reported_at DESC NULLS LAST
        `,
        sql`
          SELECT eg.exercise_id, eg.gap_number, eg.correct_answer, eg.distractors
          FROM exercise_gaps eg
          JOIN exercises e ON eg.exercise_id = e.id
          WHERE e.is_active = false
          ORDER BY eg.exercise_id, eg.gap_number
        `,
      ]);

      // Group gaps by exercise_id
      const gapsMap: Record<string, Array<{ gapNumber: number; correctAnswer: string; distractors: string[] }>> = {};
      for (const g of gaps) {
        if (!gapsMap[g.exercise_id]) gapsMap[g.exercise_id] = [];
        gapsMap[g.exercise_id].push({
          gapNumber: parseInt(g.gap_number, 10),
          correctAnswer: g.correct_answer,
          distractors: g.distractors || [],
        });
      }

      const flagged = exercises.map((e: any) => ({
        ...e,
        gaps: gapsMap[e.id] || [],
      }));

      return createResponse(200, { flagged });
    }

    // PATCH: Reactivate a flagged exercise
    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      const { exerciseId } = body;

      if (!exerciseId) {
        return createResponse(400, { error: 'Exercise ID is required' });
      }

      const result = await sql`
        UPDATE exercises
        SET is_active = true,
            report_text = NULL,
            reported_at = NULL
        WHERE id = ${exerciseId}
        RETURNING id, is_active
      `;

      if (result.length === 0) {
        return createResponse(404, { error: 'Exercise not found' });
      }

      return createResponse(200, {
        success: true,
        message: 'Exercise reactivated',
        exerciseId: result[0].id,
      });
    }

    return createResponse(405, { error: 'Method not allowed' });

  } catch (error) {
    return handleError(error);
  }
};
