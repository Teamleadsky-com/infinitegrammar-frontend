/**
 * Check connection details for both pooled and unpooled URLs
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function checkConnections() {
  console.log('🔍 Checking connection details...\n');

  const pooled = process.env.NETLIFY_DATABASE_URL;
  const unpooled = process.env.NETLIFY_DATABASE_URL_UNPOOLED;

  // Check UNPOOLED connection (used by migrations)
  console.log('━━━ UNPOOLED CONNECTION (migrations) ━━━');
  console.log('URL:', unpooled?.substring(0, 50) + '...\n');

  try {
    const sql1 = neon(unpooled);
    const info1 = await sql1`
      SELECT
        current_user,
        current_database(),
        current_schema(),
        inet_server_addr()::text AS host,
        inet_server_port() AS port
    `;
    console.log('Connection details:');
    console.table(info1[0]);

    // List ALL tables across ALL schemas
    const allTables1 = await sql1`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `;
    console.log(`\nAll tables (${allTables1.length} found):`);
    if (allTables1.length > 0) {
      console.table(allTables1);
    } else {
      console.log('  (no tables found in any schema)\n');
    }
  } catch (error) {
    console.error('❌ Error with unpooled:', error.message);
  }

  console.log('\n━━━ POOLED CONNECTION (app queries) ━━━');
  console.log('URL:', pooled?.substring(0, 50) + '...\n');

  try {
    const sql2 = neon(pooled);
    const info2 = await sql2`
      SELECT
        current_user,
        current_database(),
        current_schema(),
        inet_server_addr()::text AS host,
        inet_server_port() AS port
    `;
    console.log('Connection details:');
    console.table(info2[0]);

    // List ALL tables across ALL schemas
    const allTables2 = await sql2`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `;
    console.log(`\nAll tables (${allTables2.length} found):`);
    if (allTables2.length > 0) {
      console.table(allTables2);
    } else {
      console.log('  (no tables found in any schema)\n');
    }
  } catch (error) {
    console.error('❌ Error with pooled:', error.message);
  }

  console.log('\n━━━ MINIMAL MIGRATION TEST ━━━');
  console.log('Creating a simple test table...\n');

  try {
    const sql = neon(unpooled);

    // Create a simple test table
    await sql`CREATE TABLE IF NOT EXISTS ping_test (id serial primary key, created_at timestamp default now())`;
    console.log('✓ CREATE TABLE executed\n');

    // Check if it exists
    const tables = await sql`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name = 'ping_test'
    `;

    if (tables.length > 0) {
      console.log('✅ SUCCESS! ping_test table exists:');
      console.table(tables[0]);
    } else {
      console.log('❌ PROBLEM: ping_test table not found after creation');
    }

    // Clean up
    await sql`DROP TABLE IF EXISTS ping_test`;
    console.log('\n✓ Cleanup done');

  } catch (error) {
    console.error('❌ Error in minimal test:', error.message);
  }
}

checkConnections();
