/**
 * GET /api/admin-bench-item?run_id=<run id>&attempt_id=<attempt id>
 *
 * One verifier benchmark item (generator spec §5.6.5): what was planted and why it's a defect, the
 * planted gaps, and the exercise of the item and of its clean parent (pipeline_exercise_versions) for
 * "Compare with the clean parent". Clean items have no parent version. The steps of the item come from
 * /api/admin-pipeline-trace-attempt.
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
    const runId = event.queryStringParameters?.run_id;
    const attemptId = event.queryStringParameters?.attempt_id;
    if (!runId || !attemptId) {
      return createResponse(400, { error: 'run_id and attempt_id are required' });
    }

    const rows = await sql`
      SELECT i.*, tl.type_label,
             (SELECT x.attempt_id FROM v_bench_items x
              WHERE x.run_id = i.run_id AND x.parent_id = i.parent_id AND x.planted_type = 'clean'
                AND x.attempt_id <> i.attempt_id LIMIT 1) AS clean_twin
      FROM v_bench_items i
      LEFT JOIN v_bench_type_labels tl ON tl.planted_type = i.planted_type
      WHERE i.run_id = ${runId} AND i.attempt_id = ${attemptId}
    `;
    const r: any = rows[0];
    if (!r) {
      return createResponse(404, { error: 'Item not found' });
    }

    const versionIds = [r.parent_version, r.item_version].filter(Boolean);
    const versions = versionIds.length
      ? await sql`SELECT version_id, exercise FROM pipeline_exercise_versions WHERE version_id = ANY(${versionIds}::text[])`
      : [];
    const byId = Object.fromEntries(versions.map((v: any) => [v.version_id, v.exercise]));

    return createResponse(200, {
      item: {
        attemptId: r.attempt_id,
        parentId: r.parent_id,
        plantedType: r.planted_type,
        typeLabel: r.type_label,
        plantedVariant: r.planted_variant,
        plantedAuthor: r.planted_author,
        plantedNote: r.planted_note,
        plantedGaps: r.planted_gaps || [],
        expectedCodes: r.expected_codes || [],
        rejected: r.rejected,
        done: r.done,
        flaggedStages: r.flagged_stages || [],
        flaggedCodes: r.flagged_codes || [],
        flaggedGaps: r.flagged_gaps || [],
        expectedHit: r.expected_hit,
        atGap: r.at_gap,
        seenInCalibration: r.seen_in_calibration,
        cleanSource: r.clean_source,
        cleanTwin: r.planted_type === 'clean' ? null : r.clean_twin,
      },
      parentExercise: r.parent_version && r.planted_type !== 'clean' ? byId[r.parent_version] ?? null : null,
      itemExercise: r.item_version ? byId[r.item_version] ?? null : null,
    });
  } catch (error) {
    return handleError(error);
  }
};
