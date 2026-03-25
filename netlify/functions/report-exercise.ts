/**
 * /api/report-exercise
 *
 * POST - Report an exercise as having an issue, save report text, mark inactive
 * GET  - List flagged exercises: from checker runs (with ?source=checker&run_id=...)
 *        or from user reports (default, is_active=false exercises)
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

    // GET: List flagged exercises
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      const source = params.source || 'user';

      if (source === 'compare') {
        // Compare multiple runs: return exercises with which runs flagged them
        const runIdsParam = params.run_ids || '';
        const runIds = runIdsParam.split(',').filter(Boolean);

        if (runIds.length < 2) {
          return createResponse(400, { error: 'At least 2 run_ids required' });
        }

        // Fetch all flagged exercise_ids grouped by run_id for selected runs
        const [rows, gaps] = await Promise.all([
          sql`
            SELECT cr.run_id, cr.exercise_id, cr.report_text as checker_report,
                   e.level, e.text, gs.name as section_name
            FROM exercise_checker_runs cr
            JOIN exercises e ON cr.exercise_id = e.id
            JOIN grammar_sections gs ON e.grammar_section_id = gs.id
            WHERE cr.run_id = ANY(${runIds}::uuid[])
            ORDER BY e.level, gs.name
          `,
          sql`
            SELECT eg.exercise_id, eg.gap_number, eg.correct_answer, eg.distractors
            FROM exercise_gaps eg
            JOIN exercise_checker_runs cr ON eg.exercise_id = cr.exercise_id
            WHERE cr.run_id = ANY(${runIds}::uuid[])
            ORDER BY eg.exercise_id, eg.gap_number
          `,
        ]);

        const gapsMap: Record<string, Array<{ gapNumber: number; correctAnswer: string; distractors: string[] }>> = {};
        for (const g of gaps) {
          if (!gapsMap[g.exercise_id]) gapsMap[g.exercise_id] = [];
          // Avoid duplicates from multiple runs referencing the same exercise
          if (!gapsMap[g.exercise_id].some((x) => x.gapNumber === parseInt(g.gap_number, 10))) {
            gapsMap[g.exercise_id].push({
              gapNumber: parseInt(g.gap_number, 10),
              correctAnswer: g.correct_answer,
              distractors: g.distractors || [],
            });
          }
        }

        // Group by exercise, collecting which runs flagged it
        const exerciseMap: Record<string, any> = {};
        for (const row of rows) {
          if (!exerciseMap[row.exercise_id]) {
            exerciseMap[row.exercise_id] = {
              id: row.exercise_id,
              level: row.level,
              text: row.text,
              section_name: row.section_name,
              run_ids: [],
              reports: {} as Record<string, string>,
              gaps: gapsMap[row.exercise_id] || [],
            };
          }
          exerciseMap[row.exercise_id].run_ids.push(row.run_id);
          if (row.checker_report) {
            exerciseMap[row.exercise_id].reports[row.run_id] = row.checker_report;
          }
        }

        const exercises = Object.values(exerciseMap);

        return createResponse(200, { exercises, run_ids: runIds });
      }

      if (source === 'checker') {
        // Return checker runs list + exercises for a specific run
        const runs = await sql`
          SELECT run_id, checker_name, levels, grammar_sections, created_at,
                 COUNT(*) as exercise_count
          FROM exercise_checker_runs
          GROUP BY run_id, checker_name, levels, grammar_sections, created_at
          ORDER BY created_at DESC
        `;

        let flagged: any[] = [];
        const runId = params.run_id;

        if (runId) {
          const [checkerRows, gaps] = await Promise.all([
            sql`
              SELECT cr.exercise_id as id, cr.report_text, cr.created_at as reported_at,
                     cr.checker_name,
                     e.level, e.text, gs.name as section_name
              FROM exercise_checker_runs cr
              JOIN exercises e ON cr.exercise_id = e.id
              JOIN grammar_sections gs ON e.grammar_section_id = gs.id
              WHERE cr.run_id = ${runId}::uuid
              ORDER BY e.level, gs.name
            `,
            sql`
              SELECT eg.exercise_id, eg.gap_number, eg.correct_answer, eg.distractors
              FROM exercise_gaps eg
              JOIN exercise_checker_runs cr ON eg.exercise_id = cr.exercise_id
              WHERE cr.run_id = ${runId}::uuid
              ORDER BY eg.exercise_id, eg.gap_number
            `,
          ]);

          const gapsMap: Record<string, Array<{ gapNumber: number; correctAnswer: string; distractors: string[] }>> = {};
          for (const g of gaps) {
            if (!gapsMap[g.exercise_id]) gapsMap[g.exercise_id] = [];
            gapsMap[g.exercise_id].push({
              gapNumber: parseInt(g.gap_number, 10),
              correctAnswer: g.correct_answer,
              distractors: g.distractors || [],
            });
          }

          flagged = checkerRows.map((e: any) => ({
            ...e,
            gaps: gapsMap[e.id] || [],
          }));
        }

        return createResponse(200, { runs, flagged });
      }

      // Default: user-reported flagged exercises
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
