/**
 * Debug the SQL parsing logic
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('📂 Original file length:', migrationSQL.length, 'chars\n');

// Parse SQL statements (same logic as run-migration.js)
const lines = migrationSQL.split('\n');
const cleanedLines = lines.filter(line => {
  const trimmed = line.trim();
  return trimmed.length > 0 && !trimmed.startsWith('--');
});
const cleanedSQL = cleanedLines.join('\n');

console.log('📝 After removing comments:', cleanedSQL.length, 'chars\n');

// Split by semicolon
const statements = cleanedSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 10);

console.log(`📊 Found ${statements.length} statements\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Print each statement
statements.forEach((stmt, i) => {
  console.log(`[${i + 1}/${statements.length}] Length: ${stmt.length} chars`);
  console.log('First 150 chars:', stmt.substring(0, 150).replace(/\n/g, ' '));
  console.log('Last 50 chars:', stmt.substring(stmt.length - 50).replace(/\n/g, ' '));
  console.log('');
});

// Check for potential issues
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🔍 Checking for issues:\n');

statements.forEach((stmt, i) => {
  const issues = [];

  if (stmt.includes(';;')) issues.push('Contains double semicolon');
  if (stmt.match(/\n{5,}/)) issues.push('Contains 5+ consecutive newlines');
  if (!stmt.match(/^(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|SELECT|SET)/i)) {
    issues.push('Does not start with SQL keyword');
  }

  if (issues.length > 0) {
    console.log(`Statement ${i + 1}: ⚠️  ${issues.join(', ')}`);
    console.log('   Preview:', stmt.substring(0, 100).replace(/\n/g, ' '));
    console.log('');
  }
});

console.log('✓ Parsing check complete');
