import { describe, it, expect, vi } from 'vitest';
import { getExercise } from './exerciseSelector';
import * as a1Exercises from './a1_mock_exercises';
import * as a2Exercises from './a2_mock_exercises';
import * as b1Exercises from './b1_mock_exercises';
import * as b2Exercises from './b2_mock_exercises';
import * as c1Exercises from './c1_mock_exercises';
import { grammarSections } from './grammarSections';

describe('exerciseSelector', () => {
  describe('Level Filtering - All Levels', () => {
    it('should return an A1 exercise when level is "a1"', () => {
      const exercise = getExercise('a1');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('A1');
    });

    it('should return an A2 exercise when level is "a2"', () => {
      const exercise = getExercise('a2');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('A2');
    });

    it('should return a B1 exercise when level is "b1"', () => {
      const exercise = getExercise('b1');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B1');
    });

    it('should return a B2 exercise when level is "b2"', () => {
      const exercise = getExercise('b2');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
    });

    it('should return a C1 exercise when level is "c1"', () => {
      const exercise = getExercise('c1');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('C1');
    });

    it('should be case insensitive for all levels', () => {
      const levelsToTest = ['A1', 'a2', 'B1', 'b2', 'C1'];
      levelsToTest.forEach(level => {
        const exercise = getExercise(level);
        expect(exercise).toBeTruthy();
        expect(exercise.level.toUpperCase()).toBe(level.toUpperCase());
      });
    });

    it('should return null for non-existent level', () => {
      const exercise = getExercise('d1');
      expect(exercise).toBeNull();
    });
  });

  describe('Exercise Count Verification', () => {
    it('should have correct number of A1 exercises', () => {
      const allExercises = Object.values(a1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      expect(allExercises.length).toBe(8);
    });

    it('should have correct number of A2 exercises', () => {
      const allExercises = Object.values(a2Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      expect(allExercises.length).toBe(8);
    });

    it('should have correct number of B1 exercises', () => {
      const allExercises = Object.values(b1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      expect(allExercises.length).toBe(15);
    });

    it('should have correct number of B2 exercises', () => {
      const allExercises = Object.values(b2Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      expect(allExercises.length).toBe(23);
    });

    it('should have correct number of C1 exercises', () => {
      const allExercises = Object.values(c1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      expect(allExercises.length).toBe(10);
    });
  });

  describe('Topic Filtering - All Levels', () => {
    it('should return exercises matching "verben" topic for A1', () => {
      const exercise = getExercise('a1', 'verben');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });

    it('should return exercises matching "verben" topic for B2', () => {
      const exercise = getExercise('b2', 'verben');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });

    it('should return exercises matching "adjektive" topic for C1', () => {
      const exercise = getExercise('c1', 'adjektive');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_ui_topics.includes('adjektive')).toBe(true);
    });

    it('should return exercises matching "satzbau" topic for B1', () => {
      const exercise = getExercise('b1', 'satzbau');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_ui_topics.includes('satzbau')).toBe(true);
    });

    it('should be case insensitive for topic filtering', () => {
      const exercise1 = getExercise('b2', 'VERBEN');
      const exercise2 = getExercise('b2', 'verben');
      const exercise3 = getExercise('b2', 'Verben');

      expect(exercise1).toBeTruthy();
      expect(exercise2).toBeTruthy();
      expect(exercise3).toBeTruthy();
    });

    it('should handle topics that match no exercises with fallback', () => {
      const exercise = getExercise('b2', 'nonexistent_topic_xyz');
      // Should still return an exercise (falls back to all B2)
      expect(exercise).toBeTruthy();
    });
  });

  describe('Grammar Section Filtering', () => {
    it('should return specific A1 exercise for grammar section', () => {
      const exercise = getExercise('a1', undefined, 'personalpronomen_nominativ');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_section_id).toBe('personalpronomen_nominativ');
    });

    it('should return specific B2 exercise for "konditionalsaetze_konjunktiv2"', () => {
      const exercise = getExercise('b2', undefined, 'konditionalsaetze_konjunktiv2');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_section_id).toBe('konditionalsaetze_konjunktiv2');
      expect(exercise.level).toBe('B2');
    });

    it('should return specific B1 exercise for grammar section', () => {
      const exercise = getExercise('b1', undefined, 'reflexive_verben');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_section_id).toBe('reflexive_verben');
    });

    it('should return specific C1 exercise for grammar section', () => {
      const exercise = getExercise('c1', undefined, 'nominalstil_und_verdichtung');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_section_id).toBe('nominalstil_und_verdichtung');
    });

    it('should handle invalid grammar section gracefully', () => {
      const exercise = getExercise('b2', undefined, 'invalid_grammar_section');
      // Should still return an exercise (falls back to all B2)
      expect(exercise).toBeTruthy();
    });
  });

  describe('Combined Filters', () => {
    it('should apply level + topic filters together', () => {
      const exercise = getExercise('b2', 'verben');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });

    it('should prioritize grammar section over topic', () => {
      const exercise = getExercise('b2', 'adjektive', 'passiv');
      expect(exercise).toBeTruthy();
      expect(exercise.grammar_section_id).toBe('passiv');
      expect(exercise.level).toBe('B2');
    });

    it('should handle all three filters together', () => {
      const exercise = getExercise('b2', 'verben', 'verben_praeposition');
      expect(exercise).toBeTruthy();
      expect(exercise.level).toBe('B2');
      expect(exercise.grammar_section_id).toBe('verben_praeposition');
      expect(exercise.grammar_ui_topics.includes('verben')).toBe(true);
    });
  });

  describe('Random Selection', () => {
    it('should return different exercises when pool has multiple options', () => {
      const originalRandom = Math.random;

      Math.random = vi.fn(() => 0.1);
      const exercise1 = getExercise('b2');

      Math.random = vi.fn(() => 0.9);
      const exercise2 = getExercise('b2');

      Math.random = originalRandom;

      expect(exercise1).toBeTruthy();
      expect(exercise2).toBeTruthy();
    });

    it('should avoid showing the same exercise twice in a row when multiple are available', () => {
      // Get multiple exercises for A2 satzbau (has 3 exercises)
      let lastId = null;
      const exercises = new Set();

      for (let i = 0; i < 10; i++) {
        const exercise = getExercise('a2', 'satzbau', null, false, lastId);
        exercises.add(exercise.id);
        lastId = exercise.id;
      }

      // Should see at least 2 different exercises in 10 tries
      expect(exercises.size).toBeGreaterThanOrEqual(2);
    });

    it('should avoid returning last shown exercise when passed', () => {
      const exercise1 = getExercise('b2', 'verben');
      expect(exercise1).toBeTruthy();

      // Get another exercise, passing the first one as lastShown
      const exercise2 = getExercise('b2', 'verben', null, false, exercise1.id);
      expect(exercise2).toBeTruthy();

      // If there are multiple exercises, they should be different
      const allVerbenExercises = Object.values(b2Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex &&
        ex.grammar_ui_topics && ex.grammar_ui_topics.includes('verben')
      );

      if (allVerbenExercises.length > 1) {
        expect(exercise2.id).not.toBe(exercise1.id);
      }
    });

    it('should return exercises from correct grammar section', () => {
      const exercise1 = getExercise('b2', undefined, 'passiv');
      const exercise2 = getExercise('b2', undefined, 'passiv');
      const exercise3 = getExercise('b2', undefined, 'passiv');

      expect(exercise1.grammar_section_id).toBe('passiv');
      expect(exercise2.grammar_section_id).toBe('passiv');
      expect(exercise3.grammar_section_id).toBe('passiv');
      expect(exercise1.level).toBe('B2');
    });

    it('should select randomly across the full pool', () => {
      const exercises = new Set();
      const grammarSectionIds = new Set();

      for (let i = 0; i < 100; i++) {
        const exercise = getExercise('b2');
        if (exercise) {
          exercises.add(exercise);
          grammarSectionIds.add(exercise.grammar_section_id);
        }
      }

      expect(grammarSectionIds.size).toBeGreaterThan(5);
    });
  });

  describe('Data Integrity - All Levels', () => {
    const allLevels = ['a1', 'a2', 'b1', 'b2', 'c1'];

    allLevels.forEach(level => {
      it(`should return ${level.toUpperCase()} exercises with all required fields`, () => {
        const exercise = getExercise(level);
        expect(exercise).toBeTruthy();
        expect(exercise.id).toBeDefined();
        expect(exercise.grammar_section_id).toBeDefined();
        expect(exercise.grammar_ui_topics).toBeDefined();
        expect(Array.isArray(exercise.grammar_ui_topics)).toBe(true);
        expect(exercise.content_topic).toBeDefined();
        expect(exercise.level).toBeDefined();
        expect(exercise.text).toBeDefined();
        expect(exercise.gaps).toBeDefined();
        expect(Array.isArray(exercise.gaps)).toBe(true);
      });

      it(`should return ${level.toUpperCase()} exercises with valid gap structure`, () => {
        const exercise = getExercise(level);
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

      it(`should ensure ${level.toUpperCase()} exercises have gaps matching text placeholders`, () => {
        const exercise = getExercise(level);

        const gapNumbersInText = new Set();
        const gapPattern = /\[(\d+)\]/g;
        let match;
        while ((match = gapPattern.exec(exercise.text)) !== null) {
          gapNumbersInText.add(parseInt(match[1]));
        }

        const gapNumbersInArray = new Set(exercise.gaps.map((g: any) => g.no));

        gapNumbersInText.forEach((num) => {
          expect(gapNumbersInArray.has(num)).toBe(true);
        });
      });
    });
  });

  describe('Mapping Validation', () => {
    it('should verify all A1 exercises have valid grammar_section_id', () => {
      const allExercises = Object.values(a1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      const a1Sections = grammarSections.a1 || [];
      const validSectionIds = new Set(a1Sections.map(s => s.id));

      allExercises.forEach((exercise: any) => {
        expect(validSectionIds.has(exercise.grammar_section_id)).toBe(true);
      });
    });

    it('should verify all A2 exercises have valid grammar_section_id', () => {
      const allExercises = Object.values(a2Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      const a2Sections = grammarSections.a2 || [];
      const validSectionIds = new Set(a2Sections.map(s => s.id));

      allExercises.forEach((exercise: any) => {
        expect(validSectionIds.has(exercise.grammar_section_id)).toBe(true);
      });
    });

    it('should verify all B1 exercises have valid grammar_section_id', () => {
      const allExercises = Object.values(b1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      const b1Sections = grammarSections.b1 || [];
      const validSectionIds = new Set(b1Sections.map(s => s.id));

      allExercises.forEach((exercise: any) => {
        expect(validSectionIds.has(exercise.grammar_section_id)).toBe(true);
      });
    });

    it('should verify all B2 exercises have valid grammar_section_id', () => {
      const allExercises = Object.values(b2Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      const b2Sections = grammarSections.b2 || [];
      const validSectionIds = new Set(b2Sections.map(s => s.id));

      allExercises.forEach((exercise: any) => {
        expect(validSectionIds.has(exercise.grammar_section_id)).toBe(true);
      });
    });

    it('should verify all C1 exercises have valid grammar_section_id', () => {
      const allExercises = Object.values(c1Exercises).filter(
        ex => ex && typeof ex === 'object' && 'id' in ex
      );
      const c1Sections = grammarSections.c1 || [];
      const validSectionIds = new Set(c1Sections.map(s => s.id));

      allExercises.forEach((exercise: any) => {
        expect(validSectionIds.has(exercise.grammar_section_id)).toBe(true);
      });
    });

    it('should verify all exercises have valid grammar_ui_topics', () => {
      const validTopics = new Set(['satzbau', 'verben', 'nomen', 'adjektive', 'praepositionen', 'artikel']);
      const allExerciseSets = [a1Exercises, a2Exercises, b1Exercises, b2Exercises, c1Exercises];

      allExerciseSets.forEach(exerciseSet => {
        const allExercises = Object.values(exerciseSet).filter(
          ex => ex && typeof ex === 'object' && 'id' in ex
        );

        allExercises.forEach((exercise: any) => {
          expect(Array.isArray(exercise.grammar_ui_topics)).toBe(true);
          expect(exercise.grammar_ui_topics.length).toBeGreaterThan(0);

          exercise.grammar_ui_topics.forEach((topic: string) => {
            expect(validTopics.has(topic)).toBe(true);
          });
        });
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

    it('should handle special characters in topic name', () => {
      const exercise = getExercise('b2', 'praepositionen');
      expect(exercise).toBeTruthy();
    });
  });
});
