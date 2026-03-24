-- Migration 007: Exercise checker runs table
-- Stores results from automated exercise quality checkers

CREATE TABLE exercise_checker_runs (
  id SERIAL PRIMARY KEY,
  run_id UUID NOT NULL DEFAULT gen_random_uuid(),
  exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  checker_name TEXT NOT NULL,
  report_text TEXT,
  levels TEXT[],
  grammar_sections TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checker_runs_exercise ON exercise_checker_runs(exercise_id);
CREATE INDEX idx_checker_runs_run_id ON exercise_checker_runs(run_id);
CREATE INDEX idx_checker_runs_checker ON exercise_checker_runs(checker_name);
