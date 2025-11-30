/**
 * Simple API Test Script
 * Tests the main API endpoints directly against the database
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);

async function testAPI() {
  console.log('🧪 Testing API Functions\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Test 1: Create a test user
    console.log('1️⃣ Testing User Registration...');
    const testEmail = 'test@infinitegrammar.com';

    // Check if user exists, if not create
    let user = await sql`
      SELECT id, email, name FROM users WHERE email = ${testEmail}
    `;

    if (user.length === 0) {
      user = await sql`
        INSERT INTO users (email, name, created_at, last_login)
        VALUES (${testEmail}, 'Test User', NOW(), NOW())
        RETURNING id, email, name
      `;
      console.log('   ✓ Created test user:', user[0].email);
    } else {
      console.log('   ✓ Test user already exists:', user[0].email);
    }

    const userId = user[0].id;
    console.log('   User ID:', userId, '\n');

    // Test 2: Get grammar sections for A2
    console.log('2️⃣ Testing Grammar Sections (A2)...');
    const sections = await sql`
      SELECT
        gs.id,
        gs.name,
        gs.level,
        COUNT(e.id) as exercise_count
      FROM grammar_sections gs
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id
      WHERE gs.level = 'A2' AND gs.is_active = true
      GROUP BY gs.id, gs.name, gs.level
      ORDER BY gs.order_in_level
      LIMIT 3
    `;

    console.log('   ✓ Found ' + sections.length + ' A2 sections:');
    sections.forEach((s, i) => {
      console.log('     ' + (i + 1) + '. ' + s.name + ' (' + s.exercise_count + ' exercises)');
    });
    console.log('');

    // Test 3: Get exercises for A2 verben
    console.log('3️⃣ Testing Exercises (A2 Verben)...');
    const exercises = await sql`
      SELECT
        e.id,
        e.level,
        e.grammar_section_id,
        gs.name as section_name,
        COUNT(eg.id) as gap_count
      FROM exercises e
      JOIN grammar_sections gs ON e.grammar_section_id = gs.id
      LEFT JOIN exercise_gaps eg ON e.id = eg.exercise_id
      WHERE e.level = 'A2'
        AND EXISTS (
          SELECT 1 FROM grammar_ui_topics gut
          WHERE gut.grammar_section_id = e.grammar_section_id
          AND gut.topic = 'verben'
        )
      GROUP BY e.id, e.level, e.grammar_section_id, gs.name
      LIMIT 3
    `;

    console.log('   ✓ Found ' + exercises.length + ' A2 Verben exercises:');
    exercises.forEach((ex, i) => {
      console.log('     ' + (i + 1) + '. ' + ex.id + ' (' + ex.gap_count + ' gaps)');
    });
    console.log('');

    if (exercises.length === 0) {
      console.log('   ⚠️  No exercises found - skipping completion test\n');
      return;
    }

    // Test 4: Submit exercise completion
    console.log('4️⃣ Testing Exercise Completion...');
    const testExercise = exercises[0];

    const completion = await sql`
      INSERT INTO exercise_completions
        (user_id, exercise_id, correct_answers, total_answers, time_spent_seconds, completed_at)
      VALUES
        (${userId}, ${testExercise.id}, 4, 5, 120, NOW())
      RETURNING id, completed_at
    `;

    console.log('   ✓ Exercise completion recorded');
    console.log('   Completion ID:', completion[0].id);

    // Update user progress
    await sql`
      INSERT INTO user_progress
        (user_id, grammar_section_id, last_completed_exercise_order, total_completions, total_correct, last_completed_at)
      VALUES
        (${userId}, ${testExercise.grammar_section_id}, 1, 1, 4, NOW())
      ON CONFLICT (user_id, grammar_section_id)
      DO UPDATE SET
        total_completions = user_progress.total_completions + 1,
        total_correct = user_progress.total_correct + 4,
        last_completed_at = NOW()
    `;

    await sql`
      UPDATE users
      SET
        total_exercises_completed = total_exercises_completed + 1,
        total_correct_answers = total_correct_answers + 4,
        total_answers = total_answers + 5
      WHERE id = ${userId}
    `;

    console.log('   ✓ User progress updated\n');

    // Test 5: Get user stats
    console.log('5️⃣ Testing User Stats...');
    const userStats = await sql`
      SELECT
        total_exercises_completed,
        total_correct_answers,
        total_answers,
        current_streak
      FROM users
      WHERE id = ${userId}
    `;

    const stats = userStats[0];
    const accuracy = stats.total_answers > 0
      ? Math.round((stats.total_correct_answers / stats.total_answers) * 100)
      : 0;

    console.log('   ✓ User stats retrieved:');
    console.log('     - Exercises completed: ' + stats.total_exercises_completed);
    console.log('     - Accuracy: ' + accuracy + '%');
    console.log('     - Current streak: ' + stats.current_streak);
    console.log('');

    // Test 6: Get user progress
    console.log('6️⃣ Testing User Progress...');
    const progress = await sql`
      SELECT
        gs.name as section_name,
        up.total_completions,
        up.total_correct,
        COUNT(e.id) as total_exercises
      FROM user_progress up
      JOIN grammar_sections gs ON up.grammar_section_id = gs.id
      LEFT JOIN exercises e ON gs.id = e.grammar_section_id
      WHERE up.user_id = ${userId}
      GROUP BY gs.name, up.total_completions, up.total_correct
      LIMIT 5
    `;

    console.log('   ✓ Found progress in ' + progress.length + ' sections:');
    progress.forEach((p, i) => {
      console.log('     ' + (i + 1) + '. ' + p.section_name + ': ' + p.total_completions + ' completions');
    });
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All API tests passed!\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testAPI();
