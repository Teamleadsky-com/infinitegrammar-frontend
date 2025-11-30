-- ================================================
-- INFINITE GRAMMAR DATABASE SCHEMA
-- Initial Migration: Create all tables
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLE: users
-- Stores user account information
-- ================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  total_exercises_completed INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_streak_date DATE
);

-- Index for faster email lookups (login)
CREATE INDEX idx_users_email ON users(email);

-- ================================================
-- TABLE: grammar_sections
-- Stores grammar topics/sections by level
-- ================================================
CREATE TABLE grammar_sections (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_in_level INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for filtering by level
CREATE INDEX idx_grammar_sections_level ON grammar_sections(level);

-- ================================================
-- TABLE: exercises
-- Stores individual exercises with order numbers
-- ================================================
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  grammar_section_id TEXT NOT NULL REFERENCES grammar_sections(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  content_topic TEXT,
  model TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Ensure unique order within each grammar section
  UNIQUE(grammar_section_id, order_number)
);

-- Index for fast lookups by section and order
CREATE INDEX idx_exercises_section_order ON exercises(grammar_section_id, order_number);

-- Index for filtering by level
CREATE INDEX idx_exercises_level ON exercises(level);

-- ================================================
-- TABLE: exercise_gaps
-- Stores gap fill questions for each exercise
-- ================================================
CREATE TABLE exercise_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  gap_number INTEGER NOT NULL,
  correct_answer TEXT NOT NULL,
  distractors TEXT[] NOT NULL,
  explanation TEXT NOT NULL,

  -- Ensure unique gap numbers per exercise
  UNIQUE(exercise_id, gap_number)
);

-- Index for fetching all gaps for an exercise
CREATE INDEX idx_exercise_gaps_exercise_id ON exercise_gaps(exercise_id);

-- ================================================
-- TABLE: grammar_ui_topics
-- Maps grammar sections to UI filter topics
-- ================================================
CREATE TABLE grammar_ui_topics (
  grammar_section_id TEXT NOT NULL REFERENCES grammar_sections(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,

  PRIMARY KEY (grammar_section_id, topic)
);

-- Index for filtering by topic
CREATE INDEX idx_grammar_ui_topics_topic ON grammar_ui_topics(topic);

-- ================================================
-- TABLE: user_progress
-- Tracks user progress within each grammar section
-- ================================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grammar_section_id TEXT NOT NULL REFERENCES grammar_sections(id) ON DELETE CASCADE,
  last_completed_exercise_order INTEGER,
  total_completions INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP,

  -- One progress record per user per section
  UNIQUE(user_id, grammar_section_id)
);

-- Index for fast user progress lookups
CREATE INDEX idx_user_progress_user_section ON user_progress(user_id, grammar_section_id);

-- ================================================
-- TABLE: exercise_completions
-- Historical record of each exercise completion
-- ================================================
CREATE TABLE exercise_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  correct_answers INTEGER NOT NULL,
  total_answers INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  time_spent_seconds INTEGER
);

-- Index for user's completion history
CREATE INDEX idx_exercise_completions_user_date ON exercise_completions(user_id, completed_at DESC);

-- Index for analytics per exercise
CREATE INDEX idx_exercise_completions_exercise ON exercise_completions(exercise_id);

-- ================================================
-- SUMMARY
-- ================================================
-- Tables created:
--   ✓ users (7 rows expected initially)
--   ✓ grammar_sections (~50+ sections across levels)
--   ✓ exercises (~59+ exercises currently)
--   ✓ exercise_gaps (~300+ gaps)
--   ✓ grammar_ui_topics (~100+ mappings)
--   ✓ user_progress (grows with user activity)
--   ✓ exercise_completions (grows with user activity)
--
-- Next step: Seed data (insert grammar sections and exercises)
-- ================================================
