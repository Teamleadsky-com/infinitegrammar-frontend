import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  console.error('❌ NETLIFY_DATABASE_URL_UNPOOLED is not set');
  process.exit(1);
}

async function addPasswordColumn() {
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    console.log('🔄 Adding password column to users table...');

    await client.query('BEGIN');

    // Add password column (nullable for now to allow existing users)
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

    await client.query('COMMIT');

    console.log('✅ Password column added successfully!');

    // Verify the change
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'password_hash';
    `);

    console.log('📋 Column info:', result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addPasswordColumn()
  .then(() => {
    console.log('🎉 Migration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration error:', error);
    process.exit(1);
  });
