/**
 * Diagnostic script to understand what's happening
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function diagnose() {
  console.log('🔍 Running diagnostics...\n');

  // Test both connections
  const pooled = process.env.NETLIFY_DATABASE_URL;
  const unpooled = process.env.NETLIFY_DATABASE_URL_UNPOOLED;

  console.log('Pooled URL:', pooled ? '✓ Set' : '✗ Missing');
  console.log('Unpooled URL:', unpooled ? '✓ Set' : '✗ Missing');
  console.log();

  // Test unpooled connection
  if (unpooled) {
    console.log('━━━ Testing UNPOOLED connection ━━━\n');
    try {
      const sql = neon(unpooled);

      // Get current database and schema
      const info = await sql`SELECT current_database(), current_schema()`;
      console.log('Database:', info[0].current_database);
      console.log('Schema:', info[0].current_schema);

      // Try to create a test table
      console.log('\n📝 Creating test table...');
      await sql`DROP TABLE IF EXISTS diagnostic_test`;
      await sql`CREATE TABLE diagnostic_test (id SERIAL PRIMARY KEY, name TEXT)`;
      await sql`INSERT INTO diagnostic_test (name) VALUES ('test')`;

      // Check if it exists
      const result = await sql`SELECT * FROM diagnostic_test`;
      console.log('✓ Test table created and data inserted');
      console.log('✓ Retrieved:', result[0]);

      // Check all tables in public schema
      const tables = await sql`
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
      `;

      console.log(`\n📋 Tables in public schema: ${tables.length}`);
      tables.forEach(t => console.log(`   - ${t.tablename}`));

      // Clean up
      await sql`DROP TABLE diagnostic_test`;
      console.log('\n✓ Test table cleaned up');

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

diagnose();
