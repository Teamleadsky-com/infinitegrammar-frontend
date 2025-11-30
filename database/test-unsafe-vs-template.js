/**
 * Test sql.unsafe() vs tagged template literals
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testExecution() {
  console.log('🧪 Testing sql.unsafe() vs tagged templates\n');

  const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

  // Cleanup first
  await sql`DROP TABLE IF EXISTS test_unsafe CASCADE`;
  await sql`DROP TABLE IF EXISTS test_template CASCADE`;

  console.log('━━━ TEST 1: Using sql.unsafe() ━━━\n');

  const createTableSQL = `
    CREATE TABLE test_unsafe (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  try {
    console.log('Executing with sql.unsafe()...');
    await sql.unsafe(createTableSQL);
    console.log('✓ sql.unsafe() returned without error\n');

    // Check if table exists
    const check1 = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'test_unsafe'
    `;

    if (check1.length > 0) {
      console.log('✅ SUCCESS: test_unsafe table EXISTS\n');
    } else {
      console.log('❌ PROBLEM: test_unsafe table DOES NOT EXIST\n');
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }

  console.log('━━━ TEST 2: Using tagged template ━━━\n');

  try {
    console.log('Executing with tagged template...');
    await sql`
      CREATE TABLE test_template (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tagged template returned without error\n');

    // Check if table exists
    const check2 = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'test_template'
    `;

    if (check2.length > 0) {
      console.log('✅ SUCCESS: test_template table EXISTS\n');
    } else {
      console.log('❌ PROBLEM: test_template table DOES NOT EXIST\n');
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }

  console.log('━━━ FINAL CHECK: All tables ━━━\n');

  const allTables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;

  console.log(`Found ${allTables.length} tables in public schema:`);
  allTables.forEach(t => console.log(`   - ${t.table_name}`));

  // Cleanup
  await sql`DROP TABLE IF EXISTS test_unsafe CASCADE`;
  await sql`DROP TABLE IF EXISTS test_template CASCADE`;
  console.log('\n✓ Cleanup complete');
}

testExecution();
