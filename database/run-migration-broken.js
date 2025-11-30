/**
 * Database Migration Runner
 *
 * Runs SQL migration files against Neon PostgreSQL database
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running Database Migration...\n');

  // Get database URL - use unpooled for migrations
  const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.NETLIFY_DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: NETLIFY_DATABASE_URL not found in .env');
    process.exit(1);
  }

  if (databaseUrl.includes('-pooler')) {
    console.warn('⚠️  WARNING: Using pooled connection. DDL operations may not persist.');
    console.warn('   Consider adding NETLIFY_DATABASE_URL_UNPOOLED to .env\n');
  } else {
    console.log('✓ Using unpooled connection for migrations\n');
  }

  try {
    // Connect to database
    const sql = neon(databaseUrl);

    console.log('📂 Reading migration file...');

    // Read the SQL migration file
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('✓ Migration file loaded');
    console.log('📊 Executing migration...\n');

    // Parse SQL statements more carefully
    // Remove single-line comments but keep multi-line structure
    const lines = migrationSQL.split('\n');
    const cleanedLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('--');
    });
    const cleanedSQL = cleanedLines.join('\n');

    // Split by semicolon, but be more careful
    const statements = cleanedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out tiny fragments

    let successCount = 0;
    let skippedCount = 0;

    console.log(`Found ${statements.length} statements to execute`);
    console.log('First statement preview:');
    console.log(statements[0].substring(0, 200) + '...\n');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          console.log(`[${i + 1}/${statements.length}] Executing...`);
          // Use unsafe() for dynamic SQL execution
          const result = await sql.unsafe(statement);
          successCount++;

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
          }
        } catch (error) {
          // Ignore "already exists" errors during re-runs
          if (error.message.includes('already exists')) {
            skippedCount++;
            const typeMatch = statement.match(/(TABLE|INDEX|EXTENSION)\s+(\S+)/i);
            if (typeMatch) {
              console.log(`   ⊝ Skipped (exists): ${typeMatch[2]}`);
            }
          } else {
            console.error(`\n❌ Error executing statement:`);
            console.error('Statement preview:', statement.substring(0, 150) + '...');
            console.error('Error:', error.message);
            console.error('\nFull statement:');
            console.error(statement);
            throw error;
          }
        }
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`   ${successCount} statements executed`);
    if (skippedCount > 0) {
      console.log(`   ${skippedCount} statements skipped (already exists)`);
    }
    console.log();

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');

    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('📋 Tables created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    tables.forEach(table => {
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
        const result = await sql.unsafe(`SELECT COUNT(*) FROM ${tableName}`);
        console.log(`   ${tableName.padEnd(25)} ${result[0].count} rows`);
      } catch (error) {
        console.log(`   ${tableName.padEnd(25)} [table not found]`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Database schema is ready!');
    console.log('\n📝 Next steps:');
    console.log('   1. Seed data (insert grammar sections and exercises)');
    console.log('   2. Create Netlify Functions for API');
    console.log('   3. Update frontend to use database\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed!\n');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
