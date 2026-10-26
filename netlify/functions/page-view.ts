/**
 * POST /api/page-view
 *
 * One page of the app shown to a visitor (table page_view_events, migration 010), in the same tab
 * session as the exercise events, for the onboarding funnel in the admin area.
 *
 * Request body: { session_id: UUID, page: 'home' | 'grammar' | ..., path: '/...', user_id?: UUID }
 *
 * Always answers 202 for a well-formed event, stored or not: logging must never affect a page.
 * Crawlers are dropped by user agent; the query string is never stored.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, corsHeaders } from './_shared/db';
import { parsePageView } from './_shared/pageView';

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
  const parsed = parsePageView(body);
  if (typeof parsed === 'string') {
    return createResponse(400, { error: parsed });
  }
  if (BOT_UA.test(event.headers['user-agent'] || '')) {
    return createResponse(202, { stored: false });
  }

  try {
    await sql`
      INSERT INTO page_view_events (session_id, user_id, page, path)
      VALUES (${parsed.session_id}::uuid, ${parsed.user_id}::uuid, ${parsed.page}, ${parsed.path})
    `;
    return createResponse(202, { stored: true });
  } catch (error) {
    // 42P01: table not created yet (migration 010); 23503: unknown user id
    const { code, message } = (error ?? {}) as { code?: string; message?: string };
    console.warn('page-view not stored:', code, message);
    return createResponse(202, { stored: false });
  }
};
