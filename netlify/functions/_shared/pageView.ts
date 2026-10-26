/** Validation of POST /api/page-view bodies (kept free of the db import so it can be unit-tested). */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAGES = new Set(['home', 'grammar', 'exam_centers', 'exercise', 'exercise_stats', 'auth', 'account', 'other']);

export function parsePageView(body: unknown): { session_id: string; page: string; path: string; user_id: string | null } | string {
  if (!body || typeof body !== 'object') return 'body must be a JSON object';
  const b = body as Record<string, unknown>;
  if (typeof b.session_id !== 'string' || !UUID.test(b.session_id)) return 'session_id must be a UUID';
  if (typeof b.page !== 'string' || !PAGES.has(b.page)) return 'unknown page';
  if (typeof b.path !== 'string' || !b.path.startsWith('/')) return 'path must start with /';
  if (b.user_id != null && (typeof b.user_id !== 'string' || !UUID.test(b.user_id))) return 'user_id must be a UUID';
  const path = b.path.split(/[?#]/)[0].slice(0, 300) || '/';
  return { session_id: b.session_id, page: b.page, path, user_id: (b.user_id as string) || null };
}
