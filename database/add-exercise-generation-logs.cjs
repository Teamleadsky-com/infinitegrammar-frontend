/**
 * Migration: Create exercise_generation_logs table
 *
 * This table is used by the exercise generation application for logging
 * generation attempts, validation results, and debugging information.
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function createExerciseGenerationLogsTable() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

  try {
    console.log('🚀 Starting exercise_generation_logs table migration...');

    // Create the exercise_generation_logs table
    console.log('📋 Creating exercise_generation_logs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS exercise_generation_logs (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        run_id UUID NOT NULL,

        stage TEXT NOT NULL,        -- e.g. generation | format_validation | semantic_validation | db_insert
        validator TEXT NOT NULL,    -- e.g. json_parse | regex_structure | llm_judge_same_model | insert_into_db
        status TEXT NOT NULL,       -- "fail" (you can also allow "ok" later)

        model TEXT,
        target_level TEXT,

        grammar_section_id TEXT,
        grammar_section_name TEXT,
        content_topic TEXT,

        exercise_id TEXT,
        order_number INTEGER,

        reasons JSONB NOT NULL DEFAULT '[]'::jsonb,

        generated_json JSONB,
        judge_json JSONB,

        raw_generation TEXT,
        raw_judge TEXT,

        meta JSONB NOT NULL DEFAULT '{}'::jsonb
      )
    `;
    console.log('✅ Table created successfully');

    // Create indexes
    console.log('📋 Creating indexes...');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_exercise_generation_logs_run_id
        ON exercise_generation_logs (run_id)
    `;
    console.log('✅ Created index: idx_exercise_generation_logs_run_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_exercise_generation_logs_created_at
        ON exercise_generation_logs (created_at DESC)
    `;
    console.log('✅ Created index: idx_exercise_generation_logs_created_at');

    // Verify the table structure
    console.log('\n📊 Verifying table structure...');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'exercise_generation_logs'
      ORDER BY ordinal_position
    `;

    console.log('\n📋 Table columns:');
    console.log('='.repeat(80));
    columns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}${def}`);
    });
    console.log('='.repeat(80));

    // Verify indexes
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'exercise_generation_logs'
      ORDER BY indexname
    `;

    console.log('\n📋 Indexes:');
    console.log('='.repeat(80));
    indexes.forEach(idx => {
      console.log(`  ${idx.indexname}`);
    });
    console.log('='.repeat(80));

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run the migration
createExerciseGenerationLogsTable()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
