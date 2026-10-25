/**
 * POST /api/exercise-events
 *
 * Log what happens to an exercise on screen, for every visitor including anonymous
 * ones, so abandonment can be measured per exercise (table: exercise_view_events,
 * migration 008).
 *
 * Request body:
 * {
 *   view_id: string (UUID, one display of one exercise),
 *   session_id: string (UUID, one page load),
 *   exercise_id: string,
 *   event: 'shown' | 'started' | 'submitted',
 *   user_id?: string (UUID, logged-in visitors only),
 *   correct_answers?: number, total_answers?: number ('submitted' only)
 * }
 *
 * Always answers 202 for a well-formed event, stored or not: logging must never
 * affect the exercise page. Crawlers are dropped by user agent. starter_position records the
 * exercise's starter slot at that moment (starter_exercises, migration 009).
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, corsHeaders } from './_shared/db';
import { parseExerciseEvent } from './_shared/exerciseEvent';

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|prerender|puppeteer|playwright/i;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  let body: unknown;
  try {
    body = JSON.parse(event.body || '');
  } catch {
    return createResponse(400, { error: 'Invalid JSON' });
  }
  const parsed = parseExerciseEvent(body);
  if (typeof parsed === 'string') {
    return createResponse(400, { error: parsed });
  }

  if (BOT_UA.test(event.headers['user-agent'] || '')) {
    return createResponse(202, { stored: false });
  }

  try {
    await sql`
      INSERT INTO exercise_view_events
        (view_id, session_id, exercise_id, user_id, event, correct_answers, total_answers, starter_position)
      VALUES
        (${parsed.view_id}::uuid, ${parsed.session_id}::uuid, ${parsed.exercise_id},
         ${parsed.user_id}::uuid, ${parsed.event}, ${parsed.correct_answers}, ${parsed.total_answers},
         (SELECT position FROM starter_exercises WHERE exercise_id = ${parsed.exercise_id}))
      ON CONFLICT (view_id, event) DO NOTHING
    `;
    return createResponse(202, { stored: true });
  } catch (error) {
    // 42P01: table not created yet (migration 008); 23503: unknown exercise or user id
    const { code, message } = (error ?? {}) as { code?: string; message?: string };
    console.warn('exercise-events not stored:', code, message);
    return createResponse(202, { stored: false });
  }
};
