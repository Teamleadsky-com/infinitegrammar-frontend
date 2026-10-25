-- Migration 009: starter exercises experiment
--
-- Experiment (owner, 2026-10-24): every grammar section gets up to 10 curated "starter"
-- exercises. Anonymous visitors see a section's starters first (in `position` order), then the
-- section's other exercises as before. We measure conversion from the first exercise shown in an
-- anonymous session to creating an account, before and after the starters go live.
--
-- Sessions are tab-scoped: the session id lives only in memory in the open tab (no cookie or
-- storage, see src/lib/exerciseEvents.ts), so returning visitors can't be recognised and a signup
-- in a later visit or another tab is not linked. Conversion is therefore a lower bound.
--
-- Writers:
--   starter_exercises        backend dev (generator repo) or the owner; the web app only reads it
--   exercise_view_events     web app (starter_position set by netlify/functions/exercise-events.ts)
--   session_signups          web app (netlify/functions/auth-register.ts)
--
-- Idempotent. Down:
--   DROP VIEW IF EXISTS v_starter_conversion, v_anonymous_sessions;
--   DROP TABLE IF EXISTS session_signups, starter_exercises;
--   ALTER TABLE exercise_view_events DROP COLUMN IF EXISTS starter_position;

-- The curated exercises: positions 1..10 per section, each exercise at most once.
CREATE TABLE IF NOT EXISTS starter_exercises (
  grammar_section_id TEXT NOT NULL REFERENCES grammar_sections(id) ON DELETE CASCADE,
  position           SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 10),
  exercise_id        TEXT NOT NULL UNIQUE REFERENCES exercises(id) ON DELETE CASCADE,
  added_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (grammar_section_id, position)
);
-- Check after loading (must return no rows): starters whose exercise is in another section or inactive
--   SELECT s.* FROM starter_exercises s JOIN exercises e ON e.id = s.exercise_id
--   WHERE e.grammar_section_id <> s.grammar_section_id OR NOT e.is_active;

-- Which starter slot an exercise filled when it was shown (NULL: not a starter at that time).
ALTER TABLE exercise_view_events ADD COLUMN IF NOT EXISTS starter_position SMALLINT;

-- The anonymous session (exercise_view_events.session_id) in which an account was created.
CREATE TABLE IF NOT EXISTS session_signups (
  session_id   UUID PRIMARY KEY,
  user_id      UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per anonymous session that was shown at least one exercise: what it saw first, how far it
-- got, and whether an account was created in it.
CREATE OR REPLACE VIEW v_anonymous_sessions AS
WITH ev AS (
  SELECT * FROM exercise_view_events WHERE user_id IS NULL
),
first_shown AS (
  SELECT DISTINCT ON (session_id) session_id, exercise_id, starter_position, created_at
  FROM ev WHERE event = 'shown'
  ORDER BY session_id, created_at, id
)
SELECT f.session_id,
       f.created_at                                   AS first_shown_at,
       f.exercise_id                                  AS first_exercise_id,
       e.grammar_section_id                           AS first_section_id,
       e.level                                        AS first_level,
       f.starter_position IS NOT NULL                 AS first_was_starter,
       COUNT(DISTINCT ev.view_id) FILTER (WHERE ev.event = 'shown')     AS exercises_shown,
       COUNT(DISTINCT ev.view_id) FILTER (WHERE ev.event = 'submitted') AS exercises_submitted,
       COUNT(DISTINCT ev.view_id) FILTER (WHERE ev.event = 'shown' AND ev.starter_position IS NOT NULL) AS starters_shown,
       s.user_id IS NOT NULL                          AS signed_up,
       s.signed_up_at
FROM first_shown f
JOIN ev ON ev.session_id = f.session_id
JOIN exercises e ON e.id = f.exercise_id
LEFT JOIN session_signups s ON s.session_id = f.session_id
GROUP BY f.session_id, f.created_at, f.exercise_id, e.grammar_section_id, e.level, f.starter_position,
         s.user_id, s.signed_up_at;

-- Conversion per day (by the session's first exercise), split by whether that exercise was a starter.
CREATE OR REPLACE VIEW v_starter_conversion AS
SELECT first_shown_at::date                                  AS day,
       first_was_starter,
       COUNT(*)                                              AS sessions,
       COUNT(*) FILTER (WHERE signed_up)                     AS signups,
       ROUND(100.0 * COUNT(*) FILTER (WHERE signed_up) / COUNT(*), 2) AS conversion_pct,
       ROUND(AVG(exercises_submitted), 2)                    AS avg_exercises_submitted
FROM v_anonymous_sessions
GROUP BY 1, 2;
