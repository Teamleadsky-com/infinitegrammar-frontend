/**
 * Test creating a single table using template literal syntax
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testSingleTable() {
  console.log('🧪 Testing single table creation...\n');

  const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED;
  const sql = neon(databaseUrl);

  try {
    // Drop if exists
    console.log('1. Dropping table if exists...');
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    console.log('   ✓ Done\n');

    // Create extension
    console.log('2. Creating UUID extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('   ✓ Done\n');

    // Create table
    console.log('3. Creating users table...');
    await sql`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP,
        total_exercises_completed INTEGER DEFAULT 0,
        total_correct_answers INTEGER DEFAULT 0,
        total_answers INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        last_streak_date DATE
      )
    `;
    console.log('   ✓ Done\n');

    // Verify it exists
    console.log('4. Checking if table exists...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    `;

    if (tables.length > 0) {
      console.log('   ✅ SUCCESS! Table exists:', tables[0].table_name);

      // Test inserting data
      console.log('\n5. Testing insert...');
      await sql`
        INSERT INTO users (email, name)
        VALUES ('test@example.com', 'Test User')
      `;
      console.log('   ✓ Insert successful\n');

      // Query it back
      console.log('6. Querying data...');
      const users = await sql`SELECT * FROM users`;
      console.log('   ✓ Found:', users[0]);

    } else {
      console.log('   ❌ FAILED! Table does not exist');
    }

    // Check all tables
    console.log('\n7. All tables in database:');
    const allTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    allTables.forEach(t => console.log(`   - ${t.table_name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testSingleTable();
