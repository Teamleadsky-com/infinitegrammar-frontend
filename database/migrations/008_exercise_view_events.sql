-- Migration 008: exercise view events
--
-- One row per thing that happens to an exercise on screen, for every visitor,
-- including anonymous ones (exercise_completions only covers logged-in users).
-- Written only by the web app (netlify/functions/exercise-events.ts).
--
--   shown      the exercise was displayed
--   started    the visitor picked a first answer
--   submitted  the visitor checked the answers (with the score)
--
-- A "view" is one display of one exercise; view_id ties its events together, so
-- shown without submitted = abandoned, shown without started = left untouched.
-- session_id groups the views of one page load (random, kept only in memory, not
-- in a cookie or storage), so the last exercise of a session can be found.
-- No IP address, user agent or other identifier is stored; user_id only for
-- logged-in visitors and set to NULL when the account is deleted.
--
-- Idempotent. Down: DROP VIEW IF EXISTS v_exercise_funnel; DROP TABLE IF EXISTS exercise_view_events;

CREATE TABLE IF NOT EXISTS exercise_view_events (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  view_id         UUID NOT NULL,
  session_id      UUID NOT NULL,
  exercise_id     TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  event           TEXT NOT NULL CHECK (event IN ('shown', 'started', 'submitted')),
  correct_answers SMALLINT,
  total_answers   SMALLINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (view_id, event)
);

CREATE INDEX IF NOT EXISTS idx_exercise_view_events_exercise ON exercise_view_events (exercise_id, event);
CREATE INDEX IF NOT EXISTS idx_exercise_view_events_created ON exercise_view_events (created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_view_events_session ON exercise_view_events (session_id);

-- Per exercise: how many views were shown, started and submitted, and the share
-- abandoned. Excluded accounts (analytics_excluded_users) don't count; anonymous
-- views always count.
CREATE OR REPLACE VIEW v_exercise_funnel AS
WITH views AS (
  SELECT view_id, exercise_id,
         bool_or(event IN ('started', 'submitted')) AS started,
         bool_or(event = 'submitted') AS submitted
  FROM exercise_view_events
  WHERE user_id IS NULL
     OR user_id NOT IN (SELECT user_id FROM analytics_excluded_users)
  GROUP BY view_id, exercise_id
  HAVING bool_or(event = 'shown')
)
SELECT v.exercise_id,
       e.grammar_section_id,
       e.level,
       e.order_number,
       e.is_active,
       COUNT(*)                                  AS shown,
       COUNT(*) FILTER (WHERE v.started)         AS started,
       COUNT(*) FILTER (WHERE v.submitted)       AS submitted,
       ROUND(100.0 * COUNT(*) FILTER (WHERE NOT v.started)   / COUNT(*), 1) AS untouched_pct,
       ROUND(100.0 * COUNT(*) FILTER (WHERE NOT v.submitted) / COUNT(*), 1) AS abandoned_pct
FROM views v
JOIN exercises e ON e.id = v.exercise_id
GROUP BY v.exercise_id, e.grammar_section_id, e.level, e.order_number, e.is_active;
