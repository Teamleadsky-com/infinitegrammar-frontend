/**
 * Seed Database with Grammar Sections and Exercises
 *
 * This TypeScript file directly imports the data and seeds the database
 */

import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import { grammarSections } from '../src/data/grammarSections';
import * as a1Exercises from '../src/data/a1_mock_exercises';
import * as a2Exercises from '../src/data/a2_mock_exercises';
import * as b1Exercises from '../src/data/b1_mock_exercises';
import * as b2Exercises from '../src/data/b2_mock_exercises';
import * as c1Exercises from '../src/data/c1_mock_exercises';

interface Exercise {
  id: string;
  level: string;
  grammar_section_id: string;
  grammar_ui_topics: string[];
  content_topic: string;
  model: string;
  text: string;
  gaps: Array<{
    no: number;
    correct: string;
    distractors: string[];
    explanation: string;
  }>;
}

async function seedData() {
  console.log('🌱 Seeding Database with Grammar Sections and Exercises...\n');

  const databaseUrl = process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.NETLIFY_DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: NETLIFY_DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Insert grammar sections
    console.log('📝 Inserting grammar sections...');
    let sectionCount = 0;
    let topicMappingCount = 0;

    for (const [level, sections] of Object.entries(grammarSections)) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const category = section.grammar_ui_topics[0] || 'general';

        // Insert grammar section
        await client.query(
          `INSERT INTO grammar_sections
            (id, level, category, name, description, order_in_level, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [
            section.id,
            level.toUpperCase(),
            category,
            section.name,
            section.points ? section.points.join('\n') : null,
            i + 1,
            true
          ]
        );
        sectionCount++;

        // Insert grammar UI topic mappings
        for (const topic of section.grammar_ui_topics) {
          await client.query(
            `INSERT INTO grammar_ui_topics (grammar_section_id, topic)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [section.id, topic]
          );
          topicMappingCount++;
        }
      }
    }

    console.log(`✓ Inserted ${sectionCount} grammar sections`);
    console.log(`✓ Inserted ${topicMappingCount} topic mappings\n`);

    // Step 2: Insert exercises
    console.log('📚 Inserting exercises...');

    const allExercises: { level: string; exercises: Exercise[] }[] = [
      { level: 'A1', exercises: Object.values(a1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex) as Exercise[] },
      { level: 'A2', exercises: Object.values(a2Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex) as Exercise[] },
      { level: 'B1', exercises: Object.values(b1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex) as Exercise[] },
      { level: 'B2', exercises: Object.values(b2Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex) as Exercise[] },
      { level: 'C1', exercises: Object.values(c1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex) as Exercise[] },
    ];

    let exerciseCount = 0;
    let gapCount = 0;

    for (const { level, exercises } of allExercises) {
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];

        // Insert exercise
        await client.query(
          `INSERT INTO exercises
            (id, grammar_section_id, level, order_number, text, content_topic, model, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            exercise.id,
            exercise.grammar_section_id,
            exercise.level.toUpperCase(),
            i + 1,
            exercise.text,
            exercise.content_topic,
            exercise.model,
            true
          ]
        );
        exerciseCount++;

        // Insert exercise gaps
        for (const gap of exercise.gaps) {
          await client.query(
            `INSERT INTO exercise_gaps
              (exercise_id, gap_number, correct_answer, distractors, explanation)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (exercise_id, gap_number) DO NOTHING`,
            [
              exercise.id,
              gap.no,
              gap.correct,
              gap.distractors,
              gap.explanation
            ]
          );
          gapCount++;
        }
      }

      console.log(`✓ Processed ${level} exercises`);
    }

    console.log(`\n✓ Inserted ${exerciseCount} exercises`);
    console.log(`✓ Inserted ${gapCount} gaps\n`);

    await client.query('COMMIT');

    // Verify data
    console.log('🔍 Verifying data...\n');

    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM grammar_sections) as sections,
        (SELECT COUNT(*) FROM grammar_ui_topics) as topics,
        (SELECT COUNT(*) FROM exercises) as exercises,
        (SELECT COUNT(*) FROM exercise_gaps) as gaps
    `);

    console.log('📊 Final counts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   grammar_sections:     ${counts.rows[0].sections} rows`);
    console.log(`   grammar_ui_topics:    ${counts.rows[0].topics} rows`);
    console.log(`   exercises:            ${counts.rows[0].exercises} rows`);
    console.log(`   exercise_gaps:        ${counts.rows[0].gaps} rows`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Database seeding completed successfully!\n');

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seeding failed!\n');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedData();
