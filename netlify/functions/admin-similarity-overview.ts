/**
 * GET /api/admin-similarity-overview
 *
 * Returns all grammar sections with similarity data from each section's latest applicable run.
 * Each section independently tracks which runs have data for it.
 * No global run_id param — each section uses its own latest completed run.
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
    // 1. Per-section available runs
    const sectionRunRows = await sql`
      SELECT ss.grammar_section_id, ss.run_id,
             sr.completed_at, sr.total_exercises, sr.total_pairs, sr.duration_seconds
      FROM section_similarity_summary ss
      JOIN similarity_runs sr ON sr.id = ss.run_id AND sr.status = 'completed'
      ORDER BY ss.grammar_section_id, sr.completed_at DESC
    `;

    // Group runs by section, first entry is latest
    const sectionRunMap: Record<string, Array<{
      id: string; completedAt: string; totalExercises: number; totalPairs: number; durationSeconds: number;
    }>> = {};
    const sectionLatestRunId: Record<string, string> = {};

    for (const row of sectionRunRows) {
      const sid = row.grammar_section_id;
      if (!sectionRunMap[sid]) {
        sectionRunMap[sid] = [];
        sectionLatestRunId[sid] = row.run_id;
      }
      sectionRunMap[sid].push({
        id: row.run_id,
        completedAt: row.completed_at,
        totalExercises: parseInt(row.total_exercises, 10),
        totalPairs: parseInt(row.total_pairs, 10),
        durationSeconds: parseFloat(row.duration_seconds),
      });
    }

    // 2. Get all sections with data from their latest run
    // Uses a single-pass JOIN instead of correlated subqueries for ~5x speedup
    const sections = await sql`
      WITH section_latest AS (
        SELECT DISTINCT ON (grammar_section_id)
          grammar_section_id, run_id
        FROM section_similarity_summary ss2
        JOIN similarity_runs sr2 ON sr2.id = ss2.run_id AND sr2.status = 'completed'
        ORDER BY grammar_section_id, sr2.completed_at DESC
      ),
      section_exercises AS (
        SELECT DISTINCT e.grammar_section_id, ep.exercise_a_id AS exercise_id, sl.run_id
        FROM section_latest sl
        JOIN exercise_pairwise_similarity ep ON ep.run_id = sl.run_id
        JOIN exercises e ON e.id = ep.exercise_a_id::text
          AND e.grammar_section_id = sl.grammar_section_id
        UNION
        SELECT DISTINCT e.grammar_section_id, ep.exercise_b_id, sl.run_id
        FROM section_latest sl
        JOIN exercise_pairwise_similarity ep ON ep.run_id = sl.run_id
        JOIN exercises e ON e.id = ep.exercise_b_id::text
          AND e.grammar_section_id = sl.grammar_section_id
      ),
      pair_agg AS (
        SELECT exercise_id, run_id, AVG(cosine_similarity) AS avg_sim
        FROM (
          SELECT ep.exercise_a_id AS exercise_id, ep.run_id, ep.cosine_similarity
          FROM exercise_pairwise_similarity ep
          JOIN section_latest sl ON ep.run_id = sl.run_id
          UNION ALL
          SELECT ep.exercise_b_id AS exercise_id, ep.run_id, ep.cosine_similarity
          FROM exercise_pairwise_similarity ep
          JOIN section_latest sl ON ep.run_id = sl.run_id
        ) all_pairs
        GROUP BY exercise_id, run_id
      ),
      exercise_avg_sim AS (
        SELECT se.grammar_section_id, COALESCE(pa.avg_sim, 0) AS avg_neighbor_sim
        FROM section_exercises se
        LEFT JOIN pair_agg pa ON pa.exercise_id = se.exercise_id AND pa.run_id = se.run_id
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
        sl.run_id AS latest_run_id,
        ss.exercise_count AS run_exercise_count,
        ss.mean_similarity,
        ss.max_similarity,
        ss.min_similarity,
        ss.weighted_neighbor_score,
        ss.ordering_quality_ratio,
        eb.median_avg_sim,
        eb.bucket_0_10,
        eb.bucket_10_25,
        eb.bucket_25_50,
        eb.bucket_50_75,
        eb.bucket_75_plus
      FROM grammar_sections gs
      LEFT JOIN exercise_counts ec ON ec.grammar_section_id = gs.id
      LEFT JOIN section_latest sl ON sl.grammar_section_id = gs.id
      LEFT JOIN section_similarity_summary ss
        ON ss.grammar_section_id = gs.id AND ss.run_id = sl.run_id
      LEFT JOIN exercise_buckets eb ON eb.grammar_section_id = gs.id
      WHERE gs.is_active = true
      ORDER BY ss.max_similarity DESC NULLS LAST, gs.level, gs.name
    `;

    return createResponse(200, {
      sections: sections.map((row: any) => {
        const hasData = row.mean_similarity != null;
        const runs = sectionRunMap[row.grammar_section_id] || [];
        return {
          grammarSectionId: row.grammar_section_id,
          sectionName: row.section_name,
          level: row.level?.toUpperCase() || '',
          exerciseCount: parseInt(row.exercise_count, 10),
          hasRunData: hasData,
          latestRunId: row.latest_run_id || null,
          latestRunDate: runs.length > 0 ? runs[0].completedAt : null,
          availableRuns: runs,
          meanSimilarity: hasData ? parseFloat(row.mean_similarity) : null,
          maxSimilarity: hasData ? parseFloat(row.max_similarity) : null,
          minSimilarity: hasData ? parseFloat(row.min_similarity) : null,
          medianAvgSim: row.median_avg_sim != null ? parseFloat(row.median_avg_sim) : null,
          bucket0_10: row.bucket_0_10 != null ? parseInt(row.bucket_0_10, 10) : null,
          bucket10_25: row.bucket_10_25 != null ? parseInt(row.bucket_10_25, 10) : null,
          bucket25_50: row.bucket_25_50 != null ? parseInt(row.bucket_25_50, 10) : null,
          bucket50_75: row.bucket_50_75 != null ? parseInt(row.bucket_50_75, 10) : null,
          bucket75plus: row.bucket_75_plus != null ? parseInt(row.bucket_75_plus, 10) : null,
          weightedNeighborScore: row.weighted_neighbor_score != null ? parseFloat(row.weighted_neighbor_score) : null,
          orderingQualityRatio: row.ordering_quality_ratio != null ? parseFloat(row.ordering_quality_ratio) : null,
        };
      }),
    });
  } catch (error) {
    return handleError(error);
  }
};
