/**
 * Verify Database Schema
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function verifySchema() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  console.log('🔍 Verifying database schema...\n');

  // Get all tables
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;

  console.log(`Found ${tables.length} tables:\n`);
  tables.forEach(t => console.log(`  ✓ ${t.table_name}`));

  if (tables.length > 0) {
    console.log('\n📊 Row counts:\n');

    for (const table of tables) {
      const count = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table.table_name}`);
      console.log(`  ${table.table_name.padEnd(30)} ${count[0].count} rows`);
    }
  }

  console.log('\n✅ Schema verification complete!');
}

verifySchema().catch(console.error);
