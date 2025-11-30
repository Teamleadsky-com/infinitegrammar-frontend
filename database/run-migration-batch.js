/**
 * Database Migration Runner - Batch Execution
 * Executes entire SQL file as one batch
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running Database Migration (Batch Mode)...\n');

  const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.NETLIFY_DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: NETLIFY_DATABASE_URL not found in .env');
    process.exit(1);
  }

  if (databaseUrl.includes('-pooler')) {
    console.warn('⚠️  WARNING: Using pooled connection. DDL operations may not persist.');
  } else {
    console.log('✓ Using unpooled connection for migrations\n');
  }

  try {
    const sql = neon(databaseUrl);

    console.log('📂 Reading migration file...');
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('✓ Migration file loaded');
    console.log('📊 Executing entire migration as single batch...\n');

    // Execute entire SQL file as one statement
    await sql.unsafe(migrationSQL);

    console.log('✅ Migration executed!\n');

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
    if (tables.length === 0) {
      console.log('   ❌ No tables found!');
    } else {
      tables.forEach(table => {
        console.log(`   ✓ ${table.table_name}`);
      });
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (tables.length > 0) {
      console.log('📊 Row counts:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      for (const table of tables) {
        try {
          const result = await sql.unsafe(`SELECT COUNT(*) FROM ${table.table_name}`);
          console.log(`   ${table.table_name.padEnd(25)} ${result[0].count} rows`);
        } catch (error) {
          console.log(`   ${table.table_name.padEnd(25)} [error]`);
        }
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    console.log('✨ Database migration complete!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed!\n');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

runMigration();
