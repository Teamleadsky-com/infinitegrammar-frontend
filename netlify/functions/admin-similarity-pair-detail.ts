/**
 * GET /api/admin-similarity-pair-detail
 *
 * Returns full exercise texts for a specific pair (drill-down dialog).
 * Query params: exercise_a (required), exercise_b (required), run_id (required)
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
    const exerciseA = event.queryStringParameters?.exercise_a;
    const exerciseB = event.queryStringParameters?.exercise_b;
    const runId = event.queryStringParameters?.run_id;

    if (!exerciseA || !exerciseB || !runId) {
      return createResponse(400, { error: 'exercise_a, exercise_b, and run_id are required' });
    }

    // Fetch exercises, features, and similarity score in parallel
    const [exercises, features, pairScore] = await Promise.all([
      sql`
        SELECT id, text, grammar_section_id, level, order_number
        FROM exercises
        WHERE id IN (${exerciseA}, ${exerciseB})
      `,
      sql`
        SELECT exercise_id, grammar_section_id, level
        FROM exercise_similarity_features
        WHERE run_id = ${runId}::uuid
          AND exercise_id IN (${exerciseA}::uuid, ${exerciseB}::uuid)
      `,
      sql`
        SELECT cosine_similarity
        FROM exercise_pairwise_similarity
        WHERE run_id = ${runId}::uuid
          AND ((exercise_a_id = ${exerciseA}::uuid AND exercise_b_id = ${exerciseB}::uuid)
            OR (exercise_a_id = ${exerciseB}::uuid AND exercise_b_id = ${exerciseA}::uuid))
        LIMIT 1
      `,
    ]);

    const exerciseMap: Record<string, any> = {};
    for (const e of exercises) {
      exerciseMap[e.id] = {
        id: e.id,
        text: e.text,
        grammarSectionId: e.grammar_section_id,
        level: e.level?.toUpperCase() || '',
        orderNumber: e.order_number,
      };
    }

    const featureMap: Record<string, any> = {};
    for (const f of features) {
      featureMap[f.exercise_id] = {
        grammarSectionId: f.grammar_section_id,
        level: f.level?.toUpperCase() || '',
      };
    }

    return createResponse(200, {
      exerciseA: {
        ...exerciseMap[exerciseA],
        features: featureMap[exerciseA] || null,
      },
      exerciseB: {
        ...exerciseMap[exerciseB],
        features: featureMap[exerciseB] || null,
      },
      similarityScore: pairScore.length > 0 ? parseFloat(pairScore[0].cosine_similarity) : null,
    });
  } catch (error) {
    return handleError(error);
  }
};
