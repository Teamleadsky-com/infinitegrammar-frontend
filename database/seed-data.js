/**
 * Seed Database with Grammar Sections and Exercises
 *
 * Reads TypeScript mock data files and inserts them into the database
 */

import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    // Step 1: Read and parse the grammarSections.ts file
    console.log('📖 Reading grammar sections data...');
    const grammarSectionsPath = join(__dirname, '..', 'src', 'data', 'grammarSections.ts');
    const grammarSectionsContent = readFileSync(grammarSectionsPath, 'utf8');

    // Extract the grammarSections object using regex
    const grammarSectionsMatch = grammarSectionsContent.match(/export const grammarSections[^=]*=\s*({[\s\S]*?});/);
    if (!grammarSectionsMatch) {
      throw new Error('Could not parse grammarSections from file');
    }

    // Convert to JSON-like format and parse
    const grammarSectionsJson = grammarSectionsMatch[1]
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/(\w+):/g, '"$1":') // Quote keys
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

    const grammarSections = eval(`(${grammarSectionsJson})`);

    console.log('✓ Grammar sections loaded\n');

    // Step 2: Insert grammar sections
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

    // Step 3: Read and insert exercises from each level
    console.log('📚 Reading exercise data...');

    const levels = ['a1', 'a2', 'b1', 'b2', 'c1'];
    let exerciseCount = 0;
    let gapCount = 0;

    for (const level of levels) {
      const exercisePath = join(__dirname, '..', 'src', 'data', `${level}_mock_exercises.ts`);

      try {
        const exerciseContent = readFileSync(exercisePath, 'utf8');

        // Extract all exported exercise objects
        const exportMatches = exerciseContent.matchAll(/export const (\w+):\s*Exercise\s*=\s*({[\s\S]*?});/g);

        let orderNumber = 1;
        for (const match of exportMatches) {
          const exerciseName = match[1];
          let exerciseData = match[2];

          // Clean up the exercise data
          exerciseData = exerciseData
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/(\w+):/g, '"$1":') // Quote keys
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/\+\s*\n\s*/g, '') // Remove line continuations
            .replace(/\s+/g, ' '); // Normalize whitespace

          try {
            const exercise = eval(`(${exerciseData})`);

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
                orderNumber++,
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
                 VALUES ($1, $2, $3, $4, $5)`,
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
          } catch (parseError) {
            console.warn(`   ⚠️  Could not parse exercise: ${exerciseName}`);
          }
        }

        console.log(`✓ Processed ${level.toUpperCase()} exercises`);
      } catch (fileError) {
        console.warn(`   ⚠️  Could not read ${level} exercises file`);
      }
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

  } catch (error) {
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
