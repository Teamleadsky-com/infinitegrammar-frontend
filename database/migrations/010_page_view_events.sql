-- Migration 010: page views of the web app
--
-- The onboarding funnel (admin User Metrics -> Onboarding) starts before the first exercise: which page
-- a visitor lands on (homepage, grammar pages, exam centres, ...), whether they reach an exercise, and
-- whether they create a profile without ever opening one. One row per page shown in the React app.
--
-- Same session as exercise_view_events.session_id: a random id that lives only in memory in the open tab
-- (src/lib/exerciseEvents.ts), no cookie or storage. Stored: the page class and the pathname (no query
-- string, so no tokens or tracking parameters); user_id only for logged-in visitors, set to NULL when the
-- account is deleted. Not tracked: the admin area, the static /articles pages, crawlers and automated
-- browsers. Written only by netlify/functions/page-view.ts.
--
-- Idempotent. Down: DROP TABLE IF EXISTS page_view_events;

CREATE TABLE IF NOT EXISTS page_view_events (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  UUID NOT NULL,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  page        TEXT NOT NULL CHECK (page IN ('home', 'grammar', 'exam_centers', 'exercise', 'exercise_stats', 'auth', 'account', 'other')),
  path        TEXT NOT NULL CHECK (path LIKE '/%' AND length(path) <= 300),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_view_events_session ON page_view_events (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_page_view_events_created ON page_view_events (created_at);
