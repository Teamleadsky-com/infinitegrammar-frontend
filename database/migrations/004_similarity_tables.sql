-- Migration 004: Exercise Similarity Monitoring Tables
-- NOTE: These tables were already created by the Python analysis script.
-- This file documents the schema for reference.

-- Metadata per analysis run
CREATE TABLE IF NOT EXISTS similarity_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  scope_grammar_section_ids JSONB,
  scope_levels JSONB,
  status VARCHAR NOT NULL DEFAULT 'running',
  total_exercises INTEGER,
  total_pairs INTEGER,
  duration_seconds NUMERIC,
  error_message TEXT
);

-- Per-section aggregate similarity stats
CREATE TABLE IF NOT EXISTS section_similarity_summary (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  run_id UUID NOT NULL REFERENCES similarity_runs(id) ON DELETE CASCADE,
  grammar_section_id VARCHAR NOT NULL,
  exercise_count INTEGER NOT NULL,
  mean_similarity NUMERIC NOT NULL,
  max_similarity NUMERIC NOT NULL,
  min_similarity NUMERIC NOT NULL,
  p90_similarity NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual exercise pair similarity scores
CREATE TABLE IF NOT EXISTS exercise_pairwise_similarity (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  run_id UUID NOT NULL REFERENCES similarity_runs(id) ON DELETE CASCADE,
  exercise_a_id UUID NOT NULL,
  exercise_b_id UUID NOT NULL,
  cosine_similarity NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-exercise feature vectors
CREATE TABLE IF NOT EXISTS exercise_similarity_features (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  run_id UUID NOT NULL REFERENCES similarity_runs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL,
  grammar_section_id VARCHAR NOT NULL,
  level VARCHAR,
  text_tfidf_vector JSONB,
  answers_tfidf_vector JSONB,
  structure_vector JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
