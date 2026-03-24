-- Migration 006: Add report columns to exercises table
-- Stores the user's report text and timestamp when an exercise is flagged

ALTER TABLE exercises ADD COLUMN report_text TEXT;
ALTER TABLE exercises ADD COLUMN reported_at TIMESTAMP;
