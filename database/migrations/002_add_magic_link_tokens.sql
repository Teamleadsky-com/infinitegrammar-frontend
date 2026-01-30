-- ================================================
-- Migration: Add magic_link_tokens table
-- For passwordless authentication via email
-- ================================================

-- Drop table if exists with wrong schema
DROP TABLE IF EXISTS magic_link_tokens;

-- Create magic_link_tokens table
CREATE TABLE magic_link_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on token for faster lookups
CREATE INDEX idx_magic_link_tokens_token ON magic_link_tokens(token);

-- Create index on user_id
CREATE INDEX idx_magic_link_tokens_user_id ON magic_link_tokens(user_id);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_magic_link_tokens_expires_at ON magic_link_tokens(expires_at);
