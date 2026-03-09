/**
 * GET /api/admin-similarity-overview
 *
 * Returns section-level similarity summary for the latest completed run.
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

    // Get section summaries for this run, joined with grammar_sections for name/level
    const sections = await sql`
      SELECT
        ss.grammar_section_id,
        COALESCE(gs.name, ss.grammar_section_id) AS section_name,
        COALESCE(gs.level, '') AS level,
        ss.exercise_count,
        ss.mean_similarity,
        ss.max_similarity,
        ss.min_similarity,
        ss.p90_similarity,
        (SELECT COUNT(*) FROM exercise_pairwise_similarity ep
         WHERE ep.run_id = ss.run_id
           AND ep.exercise_a_id IN (SELECT exercise_id FROM exercise_similarity_features WHERE run_id = ss.run_id AND grammar_section_id = ss.grammar_section_id)
           AND ep.cosine_similarity >= 0.8) AS pairs_above_80,
        (SELECT COUNT(*) FROM exercise_pairwise_similarity ep
         WHERE ep.run_id = ss.run_id
           AND ep.exercise_a_id IN (SELECT exercise_id FROM exercise_similarity_features WHERE run_id = ss.run_id AND grammar_section_id = ss.grammar_section_id)
           AND ep.cosine_similarity >= 0.9) AS pairs_above_90
      FROM section_similarity_summary ss
      LEFT JOIN grammar_sections gs ON gs.id = ss.grammar_section_id
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
        meanSimilarity: parseFloat(row.mean_similarity),
        maxSimilarity: parseFloat(row.max_similarity),
        minSimilarity: parseFloat(row.min_similarity),
        p90Similarity: parseFloat(row.p90_similarity),
        pairsAbove80: parseInt(row.pairs_above_80, 10),
        pairsAbove90: parseInt(row.pairs_above_90, 10),
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};
