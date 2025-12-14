/**
 * Verify content_topics table data
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function verifyContentTopics() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

  try {
    console.log('🔍 Verifying content_topics table...\n');

    // Get count by theme
    const themeStats = await sql`
      SELECT theme, COUNT(*) as topic_count
      FROM content_topics
      GROUP BY theme
      ORDER BY theme
    `;

    console.log('📊 Topics per theme:');
    console.log('='.repeat(80));
    themeStats.forEach(stat => {
      console.log(`${stat.theme.padEnd(50)} ${stat.topic_count} topics`);
    });
    console.log('='.repeat(80));

    const total = await sql`SELECT COUNT(*) as count FROM content_topics`;
    console.log(`\n✅ Total topics: ${total[0].count}`);

    // Show sample topics from first theme
    console.log('\n📝 Sample topics from first theme:');
    const samples = await sql`
      SELECT theme, topic
      FROM content_topics
      WHERE theme = 'Alltag und Lebensführung'
      LIMIT 5
    `;
    samples.forEach(sample => {
      console.log(`  - ${sample.topic}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

verifyContentTopics()
  .then(() => {
    console.log('\n✅ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
