import * as a1Exercises from "./a1_mock_exercises";
import * as a2Exercises from "./a2_mock_exercises";
import * as b1Exercises from "./b1_mock_exercises";
import * as b2Exercises from "./b2_mock_exercises";
import * as c1Exercises from "./c1_mock_exercises";
import { GrammarUiTopicId } from "./grammarSections";
import {
  isExerciseCompleted,
  areAllExercisesCompletedForTopic,
  getNextTopic,
  areAllTopicsCompletedForLevel,
  getNextLevel,
} from "@/utils/exerciseCompletion";

// Get all exercises for a given level
export function getAllExercisesForLevel(level: string): any[] {
  const levelLower = level.toLowerCase();

  switch (levelLower) {
    case "a1":
      return Object.values(a1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex);
    case "a2":
      return Object.values(a2Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex);
    case "b1":
      return Object.values(b1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex);
    case "b2":
      return Object.values(b2Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex);
    case "c1":
      return Object.values(c1Exercises).filter(ex => ex && typeof ex === 'object' && 'id' in ex);
    default:
      return [];
  }
}

// Get exercises filtered by topic using the grammar_ui_topics field
function getExercisesByTopic(exercises: any[], topic: string): any[] {
  const topicLower = topic.toLowerCase() as GrammarUiTopicId;

  // Filter exercises to only those that include this topic in their grammar_ui_topics
  const filtered = exercises.filter((ex) => {
    return ex.grammar_ui_topics && ex.grammar_ui_topics.includes(topicLower);
  });

  // If no exercises found for this topic, return all exercises as fallback
  return filtered.length > 0 ? filtered : exercises;
}

// Get exercises filtered by grammar section
function getExercisesByGrammarSection(exercises: any[], grammarSectionId: string): any[] {
  return exercises.filter((ex) => {
    return ex.grammar_section_id === grammarSectionId;
  });
}

// Main function to get an exercise based on filters with progression logic
export function getExercise(
  level: string,
  section?: string,
  grammarSection?: string | null,
  enableProgression: boolean = false,
  lastShownId?: string | null
): any {
  let currentLevel = level;
  let currentSection = section;

  let exercises = getAllExercisesForLevel(currentLevel);

  if (exercises.length === 0) {
    return null;
  }

  // If progression is enabled and section is provided, check for auto-advancement
  if (enableProgression && currentSection) {
    const topicLower = currentSection.toLowerCase() as GrammarUiTopicId;

    // Check if all exercises for current topic are completed
    if (areAllExercisesCompletedForTopic(currentLevel, topicLower, exercises)) {
      // Try to get next topic
      const nextTopic = getNextTopic(currentLevel, topicLower, exercises);

      if (nextTopic) {
        // Advance to next topic
        currentSection = nextTopic;
      } else {
        // All topics completed for this level, try next level
        if (areAllTopicsCompletedForLevel(currentLevel, exercises)) {
          const nextLevel = getNextLevel(currentLevel);
          if (nextLevel) {
            currentLevel = nextLevel;
            currentSection = "verben"; // Start with first topic in new level
            exercises = getAllExercisesForLevel(currentLevel);
          }
        }
      }
    }
  }

  // If grammar section is provided, it takes priority over topic
  if (grammarSection) {
    const filtered = getExercisesByGrammarSection(exercises, grammarSection);
    if (filtered.length > 0) {
      exercises = filtered;
    }
  } else if (currentSection) {
    // Only filter by topic if no grammar section is specified
    const filtered = getExercisesByTopic(exercises, currentSection);
    if (filtered.length > 0) {
      exercises = filtered;
    }
  }

  // Filter out completed exercises if progression is enabled
  if (enableProgression) {
    const incompleteExercises = exercises.filter(ex => !isExerciseCompleted(ex.id));
    if (incompleteExercises.length > 0) {
      exercises = incompleteExercises;
    }
    // If all exercises are completed, return null to indicate completion
    else if (exercises.length > 0 && exercises.every(ex => isExerciseCompleted(ex.id))) {
      return null;
    }
  }

  // Return a random exercise from the filtered list
  if (exercises.length > 0) {
    // Try to avoid showing the same exercise twice in a row
    let availableExercises = exercises;

    // If we have more than one exercise and last shown is in the list, exclude it
    if (exercises.length > 1 && lastShownId) {
      const withoutLast = exercises.filter(ex => ex.id !== lastShownId);
      if (withoutLast.length > 0) {
        availableExercises = withoutLast;
      }
    }

    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    return availableExercises[randomIndex];
  }

  return null;
}

// Get exercise with progression info - returns both exercise and progression state
export function getExerciseWithProgression(
  level: string,
  section?: string,
  grammarSection?: string | null
): {
  exercise: any;
  progressedLevel?: string;
  progressedTopic?: string;
  hasProgressed: boolean;
} {
  const originalLevel = level;
  const originalSection = section;

  const exercise = getExercise(level, section, grammarSection, true);

  // Determine if progression occurred by checking the exercise
  let hasProgressed = false;
  let progressedLevel = originalLevel;
  let progressedTopic = originalSection;

  if (exercise && originalSection) {
    // Check if exercise belongs to a different level or topic
    if (exercise.level.toLowerCase() !== originalLevel.toLowerCase()) {
      hasProgressed = true;
      progressedLevel = exercise.level.toLowerCase();
    }

    const topicLower = originalSection.toLowerCase() as GrammarUiTopicId;
    if (exercise.grammar_ui_topics && !exercise.grammar_ui_topics.includes(topicLower)) {
      hasProgressed = true;
      // Find the first matching topic in the exercise
      progressedTopic = exercise.grammar_ui_topics[0];
    }
  }

  return {
    exercise,
    progressedLevel,
    progressedTopic,
    hasProgressed,
  };
}
