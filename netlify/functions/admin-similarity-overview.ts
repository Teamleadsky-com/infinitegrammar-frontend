/**
 * GET /api/admin-similarity-overview
 *
 * Returns all grammar sections with similarity data for the selected run.
 * Sections without run data appear with null similarity values.
 * Optional query params:
 *   run_id (uuid) — specific run to display (defaults to latest completed)
 *   min_similarity (float) — filter sections with run data
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
    // Fetch all completed runs
    const allRuns = await sql`
      SELECT id, created_at, completed_at, total_exercises, total_pairs, duration_seconds, status
      FROM similarity_runs
      WHERE status = 'completed'
      ORDER BY completed_at DESC
    `;

    const formatRun = (r: any) => ({
      id: r.id,
      createdAt: r.created_at,
      completedAt: r.completed_at,
      totalExercises: parseInt(r.total_exercises, 10),
      totalPairs: parseInt(r.total_pairs, 10),
      durationSeconds: parseFloat(r.duration_seconds),
      status: r.status,
    });

    // Determine which run to use
    const requestedRunId = event.queryStringParameters?.run_id;
    let selectedRun = requestedRunId
      ? allRuns.find((r: any) => r.id === requestedRunId)
      : allRuns[0];

    // If no runs exist, return all sections with no data
    if (!selectedRun) {
      const allSections = await sql`
        SELECT gs.id AS grammar_section_id, gs.name AS section_name, gs.level,
               COUNT(e.id) AS exercise_count
        FROM grammar_sections gs
        LEFT JOIN exercises e ON e.grammar_section_id = gs.id AND e.is_active = true
        WHERE gs.is_active = true
        GROUP BY gs.id, gs.name, gs.level, gs.order_in_level
        ORDER BY gs.level, gs.order_in_level NULLS LAST, gs.name
      `;

      return createResponse(200, {
        runs: allRuns.map(formatRun),
        selectedRunId: null,
        sections: allSections.map((row: any) => ({
          grammarSectionId: row.grammar_section_id,
          sectionName: row.section_name,
          level: row.level?.toUpperCase() || '',
          exerciseCount: parseInt(row.exercise_count, 10),
          hasRunData: false,
          meanSimilarity: null,
          maxSimilarity: null,
          minSimilarity: null,
          medianAvgSim: null,
          bucket0_10: null,
          bucket10_25: null,
          bucket25_50: null,
          bucket50_75: null,
          bucket75plus: null,
        })),
      });
    }

    const runId = selectedRun.id;
    const minSimilarity = parseFloat(event.queryStringParameters?.min_similarity || '0');

    // Get all sections with LEFT JOIN to similarity data for selected run
    const sections = await sql`
      WITH section_exercises AS (
        SELECT grammar_section_id, exercise_id
        FROM exercise_similarity_features
        WHERE run_id = ${runId}::uuid
      ),
      exercise_avg_sim AS (
        SELECT
          se.grammar_section_id,
          se.exercise_id,
          COALESCE(
            (
              SELECT AVG(sub.cosine_similarity)
              FROM (
                SELECT ep.cosine_similarity FROM exercise_pairwise_similarity ep
                WHERE ep.run_id = ${runId}::uuid AND ep.exercise_a_id = se.exercise_id
                UNION ALL
                SELECT ep.cosine_similarity FROM exercise_pairwise_similarity ep
                WHERE ep.run_id = ${runId}::uuid AND ep.exercise_b_id = se.exercise_id
              ) sub
            ), 0
          ) AS avg_neighbor_sim
        FROM section_exercises se
      ),
      exercise_buckets AS (
        SELECT
          grammar_section_id,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE avg_neighbor_sim < 0.1) AS bucket_0_10,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.1 AND avg_neighbor_sim < 0.25) AS bucket_10_25,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.25 AND avg_neighbor_sim < 0.5) AS bucket_25_50,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.5 AND avg_neighbor_sim < 0.75) AS bucket_50_75,
          COUNT(*) FILTER (WHERE avg_neighbor_sim >= 0.75) AS bucket_75_plus,
          PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY avg_neighbor_sim) AS median_avg_sim
        FROM exercise_avg_sim
        GROUP BY grammar_section_id
      ),
      exercise_counts AS (
        SELECT grammar_section_id, COUNT(*) AS count
        FROM exercises
        WHERE is_active = true
        GROUP BY grammar_section_id
      )
      SELECT
        gs.id AS grammar_section_id,
        gs.name AS section_name,
        COALESCE(gs.level, '') AS level,
        COALESCE(ec.count, 0) AS exercise_count,
        ss.exercise_count AS run_exercise_count,
        ss.mean_similarity,
        ss.max_similarity,
        ss.min_similarity,
        eb.median_avg_sim,
        eb.bucket_0_10,
        eb.bucket_10_25,
        eb.bucket_25_50,
        eb.bucket_50_75,
        eb.bucket_75_plus
      FROM grammar_sections gs
      LEFT JOIN exercise_counts ec ON ec.grammar_section_id = gs.id
      LEFT JOIN section_similarity_summary ss
        ON ss.grammar_section_id = gs.id AND ss.run_id = ${runId}::uuid
      LEFT JOIN exercise_buckets eb ON eb.grammar_section_id = gs.id
      WHERE gs.is_active = true
      ORDER BY ss.max_similarity DESC NULLS LAST, gs.level, gs.name
    `;

    return createResponse(200, {
      runs: allRuns.map(formatRun),
      selectedRunId: runId,
      sections: sections.map((row: any) => {
        const hasData = row.mean_similarity != null;
        return {
          grammarSectionId: row.grammar_section_id,
          sectionName: row.section_name,
          level: row.level?.toUpperCase() || '',
          exerciseCount: parseInt(row.exercise_count, 10),
          hasRunData: hasData,
          meanSimilarity: hasData ? parseFloat(row.mean_similarity) : null,
          maxSimilarity: hasData ? parseFloat(row.max_similarity) : null,
          minSimilarity: hasData ? parseFloat(row.min_similarity) : null,
          medianAvgSim: row.median_avg_sim != null ? parseFloat(row.median_avg_sim) : null,
          bucket0_10: row.bucket_0_10 != null ? parseInt(row.bucket_0_10, 10) : null,
          bucket10_25: row.bucket_10_25 != null ? parseInt(row.bucket_10_25, 10) : null,
          bucket25_50: row.bucket_25_50 != null ? parseInt(row.bucket_25_50, 10) : null,
          bucket50_75: row.bucket_50_75 != null ? parseInt(row.bucket_50_75, 10) : null,
          bucket75plus: row.bucket_75_plus != null ? parseInt(row.bucket_75_plus, 10) : null,
        };
      }),
    });
  } catch (error) {
    return handleError(error);
  }
};
