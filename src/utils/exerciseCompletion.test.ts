import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  markExerciseCompleted,
  isExerciseCompleted,
  getCompletionData,
  areAllExercisesCompletedForTopic,
  getNextTopic,
  getNextLevel,
  areAllTopicsCompletedForLevel,
  getCurrentProgression,
  getRecommendedProgression,
  clearCompletionData,
  LEVEL_ORDER,
  TOPIC_ORDER,
} from './exerciseCompletion';

describe('exerciseCompletion', () => {
  // Mock exercises for testing
  const mockB2Exercises = [
    {
      id: 'b2_verben_1',
      level: 'B2',
      grammar_ui_topics: ['verben'],
      grammar_section_id: 'passiv',
    },
    {
      id: 'b2_verben_2',
      level: 'B2',
      grammar_ui_topics: ['verben'],
      grammar_section_id: 'passiv',
    },
    {
      id: 'b2_nomen_1',
      level: 'B2',
      grammar_ui_topics: ['nomen'],
      grammar_section_id: 'nominalisierung',
    },
    {
      id: 'b2_adjektive_1',
      level: 'B2',
      grammar_ui_topics: ['adjektive'],
      grammar_section_id: 'komparativ',
    },
  ];

  beforeEach(() => {
    clearCompletionData();
  });

  afterEach(() => {
    clearCompletionData();
  });

  describe('Basic Completion Tracking', () => {
    it('should mark an exercise as completed', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      expect(isExerciseCompleted('b2_verben_1')).toBe(true);
    });

    it('should return false for uncompleted exercises', () => {
      expect(isExerciseCompleted('b2_verben_1')).toBe(false);
    });

    it('should store completion data with timestamp', () => {
      const beforeTime = Date.now();
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      const afterTime = Date.now();

      const data = getCompletionData();
      expect(data['b2_verben_1']).toBeDefined();
      expect(data['b2_verben_1'].completedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(data['b2_verben_1'].completedAt).toBeLessThanOrEqual(afterTime);
      expect(data['b2_verben_1'].level).toBe('b2');
      expect(data['b2_verben_1'].topics).toEqual(['verben']);
    });

    it('should handle multiple completions', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);
      markExerciseCompleted('b2_nomen_1', 'b2', ['nomen']);

      expect(isExerciseCompleted('b2_verben_1')).toBe(true);
      expect(isExerciseCompleted('b2_verben_2')).toBe(true);
      expect(isExerciseCompleted('b2_nomen_1')).toBe(true);
      expect(isExerciseCompleted('b2_adjektive_1')).toBe(false);
    });

    it('should persist to localStorage', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);

      // Read from localStorage directly
      const stored = localStorage.getItem('exercise_completions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed['b2_verben_1']).toBeDefined();
    });
  });

  describe('Topic Completion', () => {
    it('should detect when all exercises for a topic are completed', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);

      expect(areAllExercisesCompletedForTopic('b2', 'verben', mockB2Exercises)).toBe(true);
    });

    it('should return false when topic has incomplete exercises', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      // b2_verben_2 not completed

      expect(areAllExercisesCompletedForTopic('b2', 'verben', mockB2Exercises)).toBe(false);
    });

    it('should return true for topics with no exercises', () => {
      expect(areAllExercisesCompletedForTopic('b2', 'satzbau', mockB2Exercises)).toBe(true);
    });
  });

  describe('Topic Progression', () => {
    it('should return next topic when current topic is completed', () => {
      // Complete all verben exercises
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);

      const nextTopic = getNextTopic('b2', 'verben', mockB2Exercises);
      expect(nextTopic).toBe('nomen');
    });

    it('should skip completed topics and find next incomplete', () => {
      // Complete verben and nomen
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);
      markExerciseCompleted('b2_nomen_1', 'b2', ['nomen']);

      const nextTopic = getNextTopic('b2', 'verben', mockB2Exercises);
      expect(nextTopic).toBe('adjektive');
    });

    it('should return null when all topics are completed', () => {
      // Complete all exercises
      mockB2Exercises.forEach(ex => {
        markExerciseCompleted(ex.id, ex.level, ex.grammar_ui_topics);
      });

      const nextTopic = getNextTopic('b2', 'adjektive', mockB2Exercises);
      expect(nextTopic).toBeNull();
    });

    it('should follow TOPIC_ORDER sequence', () => {
      expect(TOPIC_ORDER).toEqual([
        'satzbau',
        'verben',
        'nomen',
        'adjektive',
        'praepositionen',
        'artikel',
      ]);
    });
  });

  describe('Level Completion', () => {
    it('should detect when all topics for a level are completed', () => {
      // Complete all exercises
      mockB2Exercises.forEach(ex => {
        markExerciseCompleted(ex.id, ex.level, ex.grammar_ui_topics);
      });

      expect(areAllTopicsCompletedForLevel('b2', mockB2Exercises)).toBe(true);
    });

    it('should return false when level has incomplete topics', () => {
      // Only complete verben
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);

      expect(areAllTopicsCompletedForLevel('b2', mockB2Exercises)).toBe(false);
    });
  });

  describe('Level Progression', () => {
    it('should return next level in sequence', () => {
      expect(getNextLevel('a1')).toBe('a2');
      expect(getNextLevel('a2')).toBe('b1');
      expect(getNextLevel('b1')).toBe('b2');
      expect(getNextLevel('b2')).toBe('c1');
    });

    it('should return null for highest level', () => {
      expect(getNextLevel('c1')).toBeNull();
    });

    it('should be case insensitive', () => {
      expect(getNextLevel('A1')).toBe('a2');
      expect(getNextLevel('B2')).toBe('c1');
    });

    it('should return null for invalid level', () => {
      expect(getNextLevel('d1')).toBeNull();
    });

    it('should follow LEVEL_ORDER sequence', () => {
      expect(LEVEL_ORDER).toEqual(['a1', 'a2', 'b1', 'b2', 'c1']);
    });
  });

  describe('Current Progression Status', () => {
    it('should indicate topic advancement is needed', () => {
      // Complete all verben exercises
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);

      const status = getCurrentProgression('b2', 'verben', mockB2Exercises);
      expect(status.shouldAdvanceTopic).toBe(true);
      expect(status.nextTopic).toBe('nomen');
      expect(status.shouldAdvanceLevel).toBe(false);
    });

    it('should indicate level advancement is needed', () => {
      // Complete all exercises
      mockB2Exercises.forEach(ex => {
        markExerciseCompleted(ex.id, ex.level, ex.grammar_ui_topics);
      });

      const status = getCurrentProgression('b2', 'adjektive', mockB2Exercises);
      expect(status.shouldAdvanceTopic).toBe(false);
      expect(status.shouldAdvanceLevel).toBe(true);
      expect(status.nextLevel).toBe('c1');
    });

    it('should indicate no advancement needed', () => {
      // Only complete one exercise
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);

      const status = getCurrentProgression('b2', 'verben', mockB2Exercises);
      expect(status.shouldAdvanceTopic).toBe(false);
      expect(status.shouldAdvanceLevel).toBe(false);
      expect(status.nextTopic).toBeNull();
      expect(status.nextLevel).toBeNull();
    });
  });

  describe('Recommended Progression', () => {
    it('should recommend A1 satzbau for new user', () => {
      const mockAllExercises = [
        { id: 'a1_1', level: 'A1', grammar_ui_topics: ['satzbau'] },
        { id: 'a1_2', level: 'A1', grammar_ui_topics: ['verben'] },
      ];

      const recommendation = getRecommendedProgression(mockAllExercises);
      expect(recommendation.level).toBe('a1');
      expect(recommendation.topic).toBe('satzbau');
    });

    it('should recommend first incomplete topic', () => {
      const mockAllExercises = [
        { id: 'a1_satzbau_1', level: 'A1', grammar_ui_topics: ['satzbau'] },
        { id: 'a1_verben_1', level: 'A1', grammar_ui_topics: ['verben'] },
        { id: 'a1_nomen_1', level: 'A1', grammar_ui_topics: ['nomen'] },
      ];

      // Complete satzbau
      markExerciseCompleted('a1_satzbau_1', 'a1', ['satzbau']);

      const recommendation = getRecommendedProgression(mockAllExercises);
      expect(recommendation.level).toBe('a1');
      expect(recommendation.topic).toBe('verben');
    });

    it('should recommend next level when current level is complete', () => {
      const mockAllExercises = [
        { id: 'a1_satzbau_1', level: 'A1', grammar_ui_topics: ['satzbau'] },
        { id: 'a2_satzbau_1', level: 'A2', grammar_ui_topics: ['satzbau'] },
      ];

      // Complete A1
      markExerciseCompleted('a1_satzbau_1', 'a1', ['satzbau']);

      const recommendation = getRecommendedProgression(mockAllExercises);
      expect(recommendation.level).toBe('a2');
      expect(recommendation.topic).toBe('satzbau');
    });

    it('should return C1 artikel when everything is complete', () => {
      const mockAllExercises = [
        { id: 'c1_artikel_1', level: 'C1', grammar_ui_topics: ['artikel'] },
      ];

      // Complete everything
      markExerciseCompleted('c1_artikel_1', 'c1', ['artikel']);

      const recommendation = getRecommendedProgression(mockAllExercises);
      expect(recommendation.level).toBe('c1');
      expect(recommendation.topic).toBe('artikel');
    });
  });

  describe('Clear Completion Data', () => {
    it('should clear all completion data', () => {
      markExerciseCompleted('b2_verben_1', 'b2', ['verben']);
      markExerciseCompleted('b2_verben_2', 'b2', ['verben']);

      expect(Object.keys(getCompletionData()).length).toBeGreaterThan(0);

      clearCompletionData();

      expect(Object.keys(getCompletionData()).length).toBe(0);
      expect(isExerciseCompleted('b2_verben_1')).toBe(false);
    });
  });

  describe('Case Sensitivity', () => {
    it('should handle mixed case levels', () => {
      markExerciseCompleted('test_1', 'B2', ['verben']);

      const data = getCompletionData();
      expect(data['test_1'].level).toBe('b2');
    });

    it('should find completed exercises regardless of case', () => {
      markExerciseCompleted('test_1', 'B2', ['verben']);

      const mockEx = [
        { id: 'test_1', level: 'B2', grammar_ui_topics: ['verben'] },
      ];

      expect(areAllExercisesCompletedForTopic('b2', 'verben', mockEx)).toBe(true);
      expect(areAllExercisesCompletedForTopic('B2', 'verben', mockEx)).toBe(true);
    });
  });
});
