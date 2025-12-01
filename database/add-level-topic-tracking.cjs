/**
 * Migration: Add level and topic tracking to exercise_completions
 *
 * This allows us to track which level and topic the user was practicing
 * when they completed an exercise, so we can calculate accurate stats
 * per level and topic.
 */

require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function migrate() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    console.log('🔄 Starting migration: Add level and topic tracking...');

    // Add columns to exercise_completions table
    await sql`
      ALTER TABLE exercise_completions
      ADD COLUMN IF NOT EXISTS practiced_level TEXT,
      ADD COLUMN IF NOT EXISTS practiced_topic TEXT
    `;

    console.log('✅ Added practiced_level and practiced_topic columns');

    // Create index for querying by level and topic
    await sql`
      CREATE INDEX IF NOT EXISTS idx_exercise_completions_level_topic
      ON exercise_completions(user_id, practiced_level, practiced_topic)
    `;

    console.log('✅ Created index for level/topic queries');

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
