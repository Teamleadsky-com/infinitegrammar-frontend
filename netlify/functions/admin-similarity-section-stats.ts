/**
 * GET /api/admin-similarity-section-stats
 *
 * Returns similarity stats + buckets for a single section + run combination.
 * Used when the user switches the run dropdown for a specific section.
 * Query params: section_id (required), run_id (required)
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
    const sectionId = event.queryStringParameters?.section_id;
    const runId = event.queryStringParameters?.run_id;

    if (!sectionId || !runId) {
      return createResponse(400, { error: 'section_id and run_id are required' });
    }

    const results = await sql`
      WITH section_exercises AS (
        SELECT DISTINCT exercise_id FROM (
          SELECT exercise_a_id AS exercise_id
          FROM exercise_pairwise_similarity
          WHERE run_id = ${runId}::uuid
          UNION
          SELECT exercise_b_id
          FROM exercise_pairwise_similarity
          WHERE run_id = ${runId}::uuid
        ) all_ids
        JOIN exercises e ON e.id = all_ids.exercise_id::text
          AND e.grammar_section_id = ${sectionId}
      ),
      pair_agg AS (
        SELECT exercise_id, AVG(cosine_similarity) AS avg_sim
        FROM (
          SELECT ep.exercise_a_id AS exercise_id, ep.cosine_similarity
          FROM exercise_pairwise_similarity ep
          WHERE ep.run_id = ${runId}::uuid
            AND ep.exercise_a_id IN (SELECT exercise_id FROM section_exercises)
          UNION ALL
          SELECT ep.exercise_b_id AS exercise_id, ep.cosine_similarity
          FROM exercise_pairwise_similarity ep
          WHERE ep.run_id = ${runId}::uuid
            AND ep.exercise_b_id IN (SELECT exercise_id FROM section_exercises)
        ) all_pairs
        GROUP BY exercise_id
      ),
      exercise_avg_sim AS (
        SELECT COALESCE(pa.avg_sim, 0) AS avg_neighbor_sim
        FROM section_exercises se
        LEFT JOIN pair_agg pa ON pa.exercise_id = se.exercise_id
      ),
      exercise_buckets AS (
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE avg_neighbor_sim < 0.1) AS bucket_0_10,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.1 AND avg_neighbor_sim < 0.25) AS bucket_10_25,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.25 AND avg_neighbor_sim < 0.5) AS bucket_25_50,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.5 AND avg_neighbor_sim < 0.75) AS bucket_50_75,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.75) AS bucket_75_plus,
          PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY avg_neighbor_sim) AS median_avg_sim
        FROM exercise_avg_sim
      )
      SELECT
        ss.exercise_count,
        ss.mean_similarity,
        ss.max_similarity,
        ss.min_similarity,
        eb.median_avg_sim,
        eb.bucket_0_10,
        eb.bucket_10_25,
        eb.bucket_25_50,
        eb.bucket_50_75,
        eb.bucket_75_plus
      FROM section_similarity_summary ss
      CROSS JOIN exercise_buckets eb
      WHERE ss.run_id = ${runId}::uuid
        AND ss.grammar_section_id = ${sectionId}
    `;

    if (results.length === 0) {
      return createResponse(200, { data: null });
    }

    const row = results[0];
    return createResponse(200, {
      data: {
        exerciseCount: parseInt(row.exercise_count, 10),
        meanSimilarity: parseFloat(row.mean_similarity),
        maxSimilarity: parseFloat(row.max_similarity),
        minSimilarity: parseFloat(row.min_similarity),
        medianAvgSim: row.median_avg_sim != null ? parseFloat(row.median_avg_sim) : null,
        bucket0_10: row.bucket_0_10 != null ? parseInt(row.bucket_0_10, 10) : null,
        bucket10_25: row.bucket_10_25 != null ? parseInt(row.bucket_10_25, 10) : null,
        bucket25_50: row.bucket_25_50 != null ? parseInt(row.bucket_25_50, 10) : null,
        bucket50_75: row.bucket_50_75 != null ? parseInt(row.bucket_50_75, 10) : null,
        bucket75plus: row.bucket_75_plus != null ? parseInt(row.bucket_75_plus, 10) : null,
      },
    });
  } catch (error) {
    return handleError(error);
  }
};
