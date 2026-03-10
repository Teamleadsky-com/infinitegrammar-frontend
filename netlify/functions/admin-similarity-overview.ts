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
    const sections = await sql`
      WITH section_latest AS (
        SELECT DISTINCT ON (grammar_section_id)
          grammar_section_id, run_id
        FROM section_similarity_summary ss2
        JOIN similarity_runs sr2 ON sr2.id = ss2.run_id AND sr2.status = 'completed'
        ORDER BY grammar_section_id, sr2.completed_at DESC
      ),
      section_exercises AS (
        SELECT ef.grammar_section_id, ef.exercise_id, sl.run_id
        FROM section_latest sl
        JOIN exercise_similarity_features ef
          ON ef.grammar_section_id = sl.grammar_section_id AND ef.run_id = sl.run_id
      ),
      exercise_avg_sim AS (
        SELECT
          se.grammar_section_id,
          se.exercise_id,
          se.run_id,
          COALESCE(
            (
              SELECT AVG(sub.cosine_similarity)
              FROM (
                SELECT ep.cosine_similarity FROM exercise_pairwise_similarity ep
                WHERE ep.run_id = se.run_id AND ep.exercise_a_id = se.exercise_id
                UNION ALL
                SELECT ep.cosine_similarity FROM exercise_pairwise_similarity ep
                WHERE ep.run_id = se.run_id AND ep.exercise_b_id = se.exercise_id
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
        sl.run_id AS latest_run_id,
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
        };
      }),
    });
  } catch (error) {
    return handleError(error);
  }
};
