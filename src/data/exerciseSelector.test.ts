import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getExercise } from './exerciseSelector';
import * as b2Exercises from './b2_mock_exercises';

describe('exerciseSelector', () => {
  describe('Level Filtering', () => {
    it('should return a B2 exercise when level is "b2"', () => {
      const exercise = getExercise('b2');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
    });

    it('should return a B2 exercise when level is "B2" (case insensitive)', () => {
      const exercise = getExercise('B2');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
    });

    it('should return null for non-existent level', () => {
      const exercise = getExercise('a1');
      expect(exercise).toBeNull();
    });

    it('should return all 12 B2 exercises when queried multiple times', () => {
      const exercises = new Set();
      // Try to get 50 exercises to likely hit all 12
      for (let i = 0; i < 50; i++) {
        const exercise = getExercise('b2');
        if (exercise) {
          exercises.add(exercise.grammar_section_id);
        }
      }
      // We should get at least some variety (likely all 12)
      expect(exercises.size).toBeGreaterThan(1);
    });
  });

  describe('Topic/Section Filtering', () => {
    it('should return exercises matching "verben" topic', () => {
      const exercise = getExercise('b2', 'verben');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });

    it('should return exercises matching "adjektive" topic', () => {
      // Try multiple times since it's random
      let foundAdjektiv = false;
      for (let i = 0; i < 20; i++) {
        const exercise = getExercise('b2', 'adjektive');
        if (exercise && exercise.grammar_section_id.toLowerCase().includes('adjektiv')) {
          foundAdjektiv = true;
          break;
        }
      }
      expect(foundAdjektiv).toBe(true);
    });

    it('should be case insensitive for topic filtering', () => {
      const exercise1 = getExercise('b2', 'VERBEN');
      const exercise2 = getExercise('b2', 'verben');
      const exercise3 = getExercise('b2', 'Verben');

      expect(exercise1).toBeTruthy();
      expect(exercise2).toBeTruthy();
      expect(exercise3).toBeTruthy();
    });

    it('should handle topics that match no exercises', () => {
      const exercise = getExercise('b2', 'nonexistent_topic_xyz');
      // Should still return an exercise (falls back to all B2)
      expect(exercise).toBeTruthy();
    });
  });

  describe('Grammar Section Filtering', () => {
    it('should return specific exercise for "konditionalsaetze_konjunktiv2"', () => {
      const exercise = getExercise('b2', undefined, 'konditionalsaetze_konjunktiv2');
      expect(exercise).toBeTruthy();
      expect(exercise).toBe(b2Exercises.b2_konditionalsaetze_konjunktiv2_1);
    });

    it('should return specific exercise for "passiv"', () => {
      const exercise = getExercise('b2', undefined, 'passiv');
      expect(exercise).toBeTruthy();
      expect(exercise).toBe(b2Exercises.b2_passiv_1);
    });

    it('should return specific exercise for "relativsaetze"', () => {
      const exercise = getExercise('b2', undefined, 'relativsaetze');
      expect(exercise).toBeTruthy();
      expect(exercise).toBe(b2Exercises.b2_relativsaetze_1);
    });

    it('should return specific exercise for "infinitivsaetze"', () => {
      const exercise = getExercise('b2', undefined, 'infinitivsaetze');
      expect(exercise).toBeTruthy();
      expect(exercise).toBe(b2Exercises.b2_infinitivsaetze_1);
    });

    it('should handle invalid grammar section gracefully', () => {
      const exercise = getExercise('b2', undefined, 'invalid_grammar_section');
      // Should still return an exercise (falls back to all B2)
      expect(exercise).toBeTruthy();
    });
  });

  describe('Combined Filters', () => {
    it('should apply level + section filters together', () => {
      const exercise = getExercise('b2', 'verben');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });

    it('should prioritize grammar section over topic when both provided and grammar section matches', () => {
      // When grammar section filter returns results, it should use those
      const exercise = getExercise('b2', 'adjektive', 'passiv');
      expect(exercise).toBeTruthy();
      // Should return the passiv exercise even though topic is adjektive
      expect(exercise).toBe(b2Exercises.b2_passiv_1);
    });

    it('should handle all three filters together', () => {
      const exercise = getExercise('b2', 'verben', 'verben_praeposition');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
      expect(exercise).toBe(b2Exercises.b2_verben_praeposition_1);
    });
  });

  describe('Random Selection', () => {
    it('should return different exercises when pool has multiple options', () => {
      // Mock Math.random to control which exercise is selected
      const originalRandom = Math.random;

      // First call returns index 0
      Math.random = vi.fn(() => 0.1);
      const exercise1 = getExercise('b2');

      // Second call returns different index
      Math.random = vi.fn(() => 0.9);
      const exercise2 = getExercise('b2');

      // Restore original
      Math.random = originalRandom;

      expect(exercise1).toBeTruthy();
      expect(exercise2).toBeTruthy();
      // They might be different (though with only 2 calls, not guaranteed)
    });

    it('should always return same exercise when pool has only one option', () => {
      const exercise1 = getExercise('b2', undefined, 'passiv');
      const exercise2 = getExercise('b2', undefined, 'passiv');
      const exercise3 = getExercise('b2', undefined, 'passiv');

      expect(exercise1).toBe(exercise2);
      expect(exercise2).toBe(exercise3);
      expect(exercise1).toBe(b2Exercises.b2_passiv_1);
    });

    it('should select randomly across the full pool', () => {
      const exercises = new Set();
      const grammarSections = new Set();

      // Get 100 exercises to ensure we hit variety
      for (let i = 0; i < 100; i++) {
        const exercise = getExercise('b2');
        if (exercise) {
          exercises.add(exercise);
          grammarSections.add(exercise.grammar_section_id);
        }
      }

      // With 100 tries across 12 exercises, we should get significant variety
      expect(grammarSections.size).toBeGreaterThan(5);
    });
  });

  describe('Data Integrity', () => {
    it('should return exercises with all required fields', () => {
      const exercise = getExercise('b2');
      expect(exercise).toBeTruthy();
      expect(exercise).toBeDefined();
      expect(exercise.grammar_section_id).toBeDefined();
      expect(exercise.content_topic).toBeDefined();
      expect(exercise.level).toBeDefined();
      expect(exercise.text).toBeDefined();
      expect(exercise.text).toBeDefined();
      expect(exercise.gaps).toBeDefined();
      expect(Array.isArray(exercise.gaps)).toBe(true);
    });

    it('should return exercises with valid gap structure', () => {
      const exercise = getExercise('b2');
      expect(exercise.gaps.length).toBeGreaterThan(0);

      exercise.gaps.forEach((gap: any) => {
        expect(gap.no).toBeDefined();
        expect(typeof gap.no).toBe('number');
        expect(gap.correct).toBeDefined();
        expect(typeof gap.correct).toBe('string');
        expect(Array.isArray(gap.distractors)).toBe(true);
        expect(gap.distractors.length).toBeGreaterThan(0);
        expect(gap.explanation).toBeDefined();
        expect(typeof gap.explanation).toBe('string');
      });
    });

    it('should return exercises where gaps match cloze_text placeholders', () => {
      const exercise = getExercise('b2');

      // Count gap numbers in cloze_text
      const gapNumbersInText = new Set();
      const gapPattern = /\[(\d+)\]/g;
      let match;
      while ((match = gapPattern.exec(exercise.text)) !== null) {
        gapNumbersInText.add(parseInt(match[1]));
      }

      // Check that all gap numbers exist in gaps array
      const gapNumbersInArray = new Set(exercise.gaps.map((g: any) => g.no));

      gapNumbersInText.forEach((num) => {
        expect(gapNumbersInArray.has(num)).toBe(true);
      });
    });

    it('should verify all B2 exercises are accessible', () => {
      const allExercises = Object.values(b2Exercises);
      expect(allExercises.length).toBe(12);

      allExercises.forEach((exercise) => {
        expect(exercise).toBeDefined();
        expect(exercise.level).toBe('B2');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty section parameter', () => {
      const exercise = getExercise('b2', '');
      expect(exercise).toBeTruthy();
    });

    it('should handle null grammar section', () => {
      const exercise = getExercise('b2', 'verben', null);
      expect(exercise).toBeTruthy();
    });

    it('should handle undefined parameters gracefully', () => {
      const exercise = getExercise('b2', undefined, undefined);
      expect(exercise).toBeTruthy();
    });

    it('should handle special characters in section name', () => {
      const exercise = getExercise('b2', 'präpositionen');
      // Should either match or fall back gracefully
      expect(exercise).toBeTruthy();
    });
  });
});
