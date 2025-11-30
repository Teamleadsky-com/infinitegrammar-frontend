/**
 * Test sql.unsafe() with simple DDL (no extensions needed)
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testSimpleDDL() {
  console.log('🧪 Testing sql.unsafe() with simple tables (no UUIDs)\n');

  const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

  console.log('━━━ TEST 1: Simple table with sql.unsafe() ━━━\n');

  try {
    // Cleanup
    await sql`DROP TABLE IF EXISTS simple_test CASCADE`;

    const createSQL = `CREATE TABLE simple_test (id SERIAL PRIMARY KEY, name TEXT NOT NULL)`;

    console.log('Executing:', createSQL);
    const result = await sql.unsafe(createSQL);
    console.log('✓ sql.unsafe() returned:', result);
    console.log('');

    // Check if it exists
    const check = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'simple_test'
    `;

    if (check.length > 0) {
      console.log('✅ Table EXISTS!');
      console.log('   Schema:', check[0]);

      // Try inserting data
      await sql`INSERT INTO simple_test (name) VALUES ('test row')`;
      const rows = await sql`SELECT * FROM simple_test`;
      console.log('   Data:', rows[0]);
    } else {
      console.log('❌ Table DOES NOT EXIST');
    }

    // Show all tables
    const all = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log(`\nAll tables in public: ${all.length}`);
    all.forEach(t => console.log(`   - ${t.table_name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testSimpleDDL();
