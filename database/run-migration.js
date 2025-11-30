/**
 * Fixed Database Migration Runner
 * Uses Pool for proper raw SQL execution
 */

import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running Database Migration (FIXED VERSION)...\n');

  const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.NETLIFY_DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: NETLIFY_DATABASE_URL not found in .env');
    process.exit(1);
  }

  console.log('✓ Using unpooled connection\n');

  // Create Pool client for raw SQL execution
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    console.log('📂 Reading migration file...');
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    console.log('✓ Migration file loaded\n');

    console.log('📊 Executing migration as single transaction...\n');

    // Execute the entire migration in a transaction
    await client.query('BEGIN');

    try {
      // Remove comment lines first
      const lines = migrationSQL.split('\n');
      const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        // Keep non-empty lines that don't start with --
        return trimmed.length > 0 && !trimmed.startsWith('--');
      });
      const cleanedSQL = cleanedLines.join('\n');

      // Split by semicolon and filter out empty statements
      const statements = cleanedSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 10); // Filter out tiny fragments

      console.log(`Found ${statements.length} statements to execute\n`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        try {
          console.log(`[${i + 1}/${statements.length}] Executing...`);

          // Actually execute with Pool.query()
          await client.query(statement);

          // Show progress for CREATE statements
          if (statement.toUpperCase().includes('CREATE TABLE')) {
            const match = statement.match(/CREATE TABLE\s+(\w+)/i);
            if (match) {
              console.log(`   ✓ Created table: ${match[1]}`);
            }
          } else if (statement.toUpperCase().includes('CREATE INDEX')) {
            const match = statement.match(/CREATE INDEX\s+(\w+)/i);
            if (match) {
              console.log(`   ✓ Created index: ${match[1]}`);
            }
          } else if (statement.toUpperCase().includes('CREATE EXTENSION')) {
            const match = statement.match(/CREATE EXTENSION\s+(?:IF NOT EXISTS\s+)?"?([^"\s]+)"?/i);
            if (match) {
              console.log(`   ✓ Created extension: ${match[1]}`);
            }
          }
        } catch (error) {
          // Skip "already exists" errors
          if (error.message && error.message.includes('already exists')) {
            console.log(`   ⊝ Skipped (already exists)`);
          } else {
            throw error;
          }
        }
      }

      await client.query('COMMIT');
      console.log('\n✅ Migration completed successfully!\n');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Tables created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    result.rows.forEach(table => {
      console.log(`   ✓ ${table.table_name}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get table counts
    console.log('📊 Current row counts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const tableNames = [
      'users',
      'grammar_sections',
      'exercises',
      'exercise_gaps',
      'grammar_ui_topics',
      'user_progress',
      'exercise_completions'
    ];

    for (const tableName of tableNames) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
        console.log(`   ${tableName.padEnd(25)} ${countResult.rows[0].count} rows`);
      } catch (error) {
        console.log(`   ${tableName.padEnd(25)} [table not found]`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ Database schema is ready!\n');
    console.log('📝 Next steps:');
    console.log('   1. Seed data (insert grammar sections and exercises)');
    console.log('   2. Create Netlify Functions for API');
    console.log('   3. Update frontend to use database\n');

  } catch (error) {
    console.error('\n❌ Migration failed!\n');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
