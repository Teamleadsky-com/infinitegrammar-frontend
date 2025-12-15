/**
 * Migration: Add magic_link_tokens table
 *
 * This migration creates a table to store magic link tokens for passwordless authentication.
 *
 * Run with: node database/add-magic-link-tokens.cjs
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  if (!process.env.NETLIFY_DATABASE_URL) {
    throw new Error('NETLIFY_DATABASE_URL environment variable is not set');
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  console.log('🚀 Starting migration: add magic_link_tokens table...');

  try {
    // Create magic_link_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS magic_link_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Created magic_link_tokens table');

    // Create index on token for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token)
    `;
    console.log('✅ Created index on token column');

    // Create index on user_id
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_user_id ON magic_link_tokens(user_id)
    `;
    console.log('✅ Created index on user_id column');

    // Create index on expires_at for cleanup queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires_at ON magic_link_tokens(expires_at)
    `;
    console.log('✅ Created index on expires_at column');

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
