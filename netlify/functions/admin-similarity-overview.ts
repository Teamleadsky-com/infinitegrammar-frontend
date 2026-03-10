/**
 * GET /api/admin-similarity-overview
 *
 * Returns section-level similarity summary for the latest completed run.
 * Includes percentile values (p30, p50/median, p75, p90) and pair counts above thresholds.
 * Optional query param: min_similarity (float) to filter sections.
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
    const minSimilarity = parseFloat(event.queryStringParameters?.min_similarity || '0');

    // Find the latest completed run
    const runs = await sql`
      SELECT id, created_at, completed_at, total_exercises, total_pairs, duration_seconds, status,
             scope_grammar_section_ids, scope_levels
      FROM similarity_runs
      WHERE status = 'completed'
      ORDER BY completed_at DESC
      LIMIT 1
    `;

    if (runs.length === 0) {
      return createResponse(200, { run: null, sections: [] });
    }

    const run = runs[0];

    // Get section summaries with percentiles and threshold counts computed from pairwise data
    const sections = await sql`
      WITH section_exercises AS (
        SELECT grammar_section_id, exercise_id
        FROM exercise_similarity_features
        WHERE run_id = ${run.id}::uuid
      ),
      -- Per-exercise max similarity to any neighbor
      exercise_max_sim AS (
        SELECT
          se.grammar_section_id,
          se.exercise_id,
          GREATEST(
            COALESCE(MAX(ep_a.cosine_similarity), 0),
            COALESCE(MAX(ep_b.cosine_similarity), 0)
          ) AS max_neighbor_sim
        FROM section_exercises se
        LEFT JOIN exercise_pairwise_similarity ep_a
          ON ep_a.run_id = ${run.id}::uuid AND ep_a.exercise_a_id = se.exercise_id
        LEFT JOIN exercise_pairwise_similarity ep_b
          ON ep_b.run_id = ${run.id}::uuid AND ep_b.exercise_b_id = se.exercise_id
        GROUP BY se.grammar_section_id, se.exercise_id
      ),
      -- Bucket exercises by max-neighbor-similarity ranges
      exercise_buckets AS (
        SELECT
          grammar_section_id,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE max_neighbor_sim < 0.1) AS bucket_0_10,
          COUNT(*) FILTER (WHERE max_neighbor_sim >= 0.1 AND max_neighbor_sim < 0.25) AS bucket_10_25,
          COUNT(*) FILTER (WHERE max_neighbor_sim >= 0.25 AND max_neighbor_sim < 0.5) AS bucket_25_50,
          COUNT(*) FILTER (WHERE max_neighbor_sim >= 0.5 AND max_neighbor_sim < 0.75) AS bucket_50_75,
          COUNT(*) FILTER (WHERE max_neighbor_sim >= 0.75) AS bucket_75_plus,
          PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY max_neighbor_sim) AS median_max_sim
        FROM exercise_max_sim
        GROUP BY grammar_section_id
      )
      SELECT
        ss.grammar_section_id,
        COALESCE(gs.name, ss.grammar_section_id) AS section_name,
        COALESCE(gs.level, '') AS level,
        ss.exercise_count,
        ss.mean_similarity,
        ss.max_similarity,
        ss.min_similarity,
        COALESCE(eb.median_max_sim, 0) AS median_max_sim,
        COALESCE(eb.bucket_0_10, 0) AS bucket_0_10,
        COALESCE(eb.bucket_10_25, 0) AS bucket_10_25,
        COALESCE(eb.bucket_25_50, 0) AS bucket_25_50,
        COALESCE(eb.bucket_50_75, 0) AS bucket_50_75,
        COALESCE(eb.bucket_75_plus, 0) AS bucket_75_plus
      FROM section_similarity_summary ss
      LEFT JOIN grammar_sections gs ON gs.id = ss.grammar_section_id
      LEFT JOIN exercise_buckets eb ON eb.grammar_section_id = ss.grammar_section_id
      WHERE ss.run_id = ${run.id}::uuid
        AND ss.max_similarity >= ${minSimilarity}
      ORDER BY ss.max_similarity DESC, section_name
    `;

    return createResponse(200, {
      run: {
        id: run.id,
        createdAt: run.created_at,
        completedAt: run.completed_at,
        totalExercises: parseInt(run.total_exercises, 10),
        totalPairs: parseInt(run.total_pairs, 10),
        durationSeconds: parseFloat(run.duration_seconds),
        status: run.status,
      },
      sections: sections.map((row: any) => ({
        grammarSectionId: row.grammar_section_id,
        sectionName: row.section_name,
        level: row.level?.toUpperCase() || '',
        exerciseCount: parseInt(row.exercise_count, 10),
        totalPairs: parseInt(row.total_pairs, 10),
        meanSimilarity: parseFloat(row.mean_similarity),
        maxSimilarity: parseFloat(row.max_similarity),
        minSimilarity: parseFloat(row.min_similarity),
        medianMaxSim: parseFloat(row.median_max_sim),
        bucket0_10: parseInt(row.bucket_0_10, 10),
        bucket10_25: parseInt(row.bucket_10_25, 10),
        bucket25_50: parseInt(row.bucket_25_50, 10),
        bucket50_75: parseInt(row.bucket_50_75, 10),
        bucket75plus: parseInt(row.bucket_75_plus, 10),
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
