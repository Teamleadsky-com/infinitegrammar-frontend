// Utility for tracking exercise completion and progression
import { GrammarUiTopicId } from "@/data/grammarSections";

const COMPLETION_STORAGE_KEY = "exercise_completions";

// Level progression order
export const LEVEL_ORDER = ["a1", "a2", "b1", "b2", "c1"] as const;

// Topic progression order
export const TOPIC_ORDER: GrammarUiTopicId[] = [
  "satzbau",
  "verben",
  "nomen",
  "adjektive",
  "praepositionen",
  "artikel",
];

export interface CompletionData {
  [exerciseId: string]: {
    completedAt: number;
    level: string;
    topics: GrammarUiTopicId[];
  };
}

// Get all completion data from localStorage
export function getCompletionData(): CompletionData {
  try {
    const data = localStorage.getItem(COMPLETION_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading completion data:", error);
    return {};
  }
}

// Save completion data to localStorage
function saveCompletionData(data: CompletionData): void {
  try {
    localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving completion data:", error);
  }
}

// Mark an exercise as completed
export function markExerciseCompleted(
  exerciseId: string,
  level: string,
  topics: GrammarUiTopicId[]
): void {
  const data = getCompletionData();
  data[exerciseId] = {
    completedAt: Date.now(),
    level: level.toLowerCase(),
    topics,
  };
  saveCompletionData(data);
}

// Check if an exercise is completed
export function isExerciseCompleted(exerciseId: string): boolean {
  const data = getCompletionData();
  return !!data[exerciseId];
}

// Get all completed exercise IDs for a level and topic
export function getCompletedExercisesForTopic(
  level: string,
  topic: GrammarUiTopicId
): string[] {
  const data = getCompletionData();
  const levelLower = level.toLowerCase();

  return Object.entries(data)
    .filter(([_, completion]) => {
      return (
        completion.level === levelLower &&
        completion.topics.includes(topic)
      );
    })
    .map(([exerciseId]) => exerciseId);
}

// Check if all exercises for a level and topic are completed
export function areAllExercisesCompletedForTopic(
  level: string,
  topic: GrammarUiTopicId,
  allExercises: any[]
): boolean {
  const completedIds = new Set(getCompletedExercisesForTopic(level, topic));

  // Filter exercises that include this topic
  const topicExercises = allExercises.filter(ex =>
    ex.grammar_ui_topics && ex.grammar_ui_topics.includes(topic)
  );

  if (topicExercises.length === 0) {
    return true; // No exercises for this topic, consider it completed
  }

  // Check if all exercises for this topic are completed
  return topicExercises.every(ex => completedIds.has(ex.id));
}

// Get the next topic for a level
export function getNextTopic(
  currentLevel: string,
  currentTopic: GrammarUiTopicId,
  allExercises: any[]
): GrammarUiTopicId | null {
  const currentIndex = TOPIC_ORDER.indexOf(currentTopic);

  // Try to find next incomplete topic
  for (let i = currentIndex + 1; i < TOPIC_ORDER.length; i++) {
    const nextTopic = TOPIC_ORDER[i];
    if (!areAllExercisesCompletedForTopic(currentLevel, nextTopic, allExercises)) {
      return nextTopic;
    }
  }

  // All topics completed
  return null;
}

// Check if all topics for a level are completed
export function areAllTopicsCompletedForLevel(
  level: string,
  allExercises: any[]
): boolean {
  return TOPIC_ORDER.every(topic =>
    areAllExercisesCompletedForTopic(level, topic, allExercises)
  );
}

// Get the next level
export function getNextLevel(currentLevel: string): string | null {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel.toLowerCase() as any);

  if (currentIndex === -1 || currentIndex === LEVEL_ORDER.length - 1) {
    return null; // Invalid level or already at highest level
  }

  return LEVEL_ORDER[currentIndex + 1];
}

// Get current progression status (for breadcrumbs)
export function getCurrentProgression(
  level: string,
  topic: GrammarUiTopicId,
  allExercises: any[]
): {
  level: string;
  topic: GrammarUiTopicId;
  shouldAdvanceTopic: boolean;
  shouldAdvanceLevel: boolean;
  nextTopic: GrammarUiTopicId | null;
  nextLevel: string | null;
} {
  const allTopicCompleted = areAllExercisesCompletedForTopic(level, topic, allExercises);
  const nextTopic = allTopicCompleted ? getNextTopic(level, topic, allExercises) : null;
  const allLevelCompleted = areAllTopicsCompletedForLevel(level, allExercises);
  const nextLevel = allLevelCompleted ? getNextLevel(level) : null;

  return {
    level,
    topic,
    shouldAdvanceTopic: allTopicCompleted && nextTopic !== null,
    shouldAdvanceLevel: allLevelCompleted && nextLevel !== null,
    nextTopic,
    nextLevel,
  };
}

// Get recommended level and topic for the user
export function getRecommendedProgression(
  allExercises: any[]
): { level: string; topic: GrammarUiTopicId } {
  // Start with A1 and first topic
  let recommendedLevel = LEVEL_ORDER[0];
  let recommendedTopic = TOPIC_ORDER[0];

  // Find the first incomplete topic in each level
  for (const level of LEVEL_ORDER) {
    const levelExercises = allExercises.filter(
      ex => ex.level.toLowerCase() === level
    );

    for (const topic of TOPIC_ORDER) {
      if (!areAllExercisesCompletedForTopic(level, topic, levelExercises)) {
        return { level, topic };
      }
    }
  }

  // All exercises completed, return highest level and last topic
  return {
    level: LEVEL_ORDER[LEVEL_ORDER.length - 1],
    topic: TOPIC_ORDER[TOPIC_ORDER.length - 1],
  };
}

// Clear all completion data (for testing or reset)
export function clearCompletionData(): void {
  try {
    localStorage.removeItem(COMPLETION_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing completion data:", error);
  }
}
