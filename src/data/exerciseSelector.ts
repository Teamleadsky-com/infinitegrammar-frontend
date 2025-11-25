import * as a1Exercises from "./a1_mock_exercises";
import * as a2Exercises from "./a2_mock_exercises";
import * as b1Exercises from "./b1_mock_exercises";
import * as b2Exercises from "./b2_mock_exercises";
import * as c1Exercises from "./c1_mock_exercises";
import { GrammarUiTopicId } from "./grammarSections";

// Get all exercises for a given level
function getAllExercisesForLevel(level: string): any[] {
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

// Main function to get an exercise based on filters
export function getExercise(
  level: string,
  section?: string,
  grammarSection?: string | null
): any {
  let exercises = getAllExercisesForLevel(level);

  if (exercises.length === 0) {
    return null;
  }

  // If grammar section is provided, it takes priority over topic
  if (grammarSection) {
    const filtered = getExercisesByGrammarSection(exercises, grammarSection);
    if (filtered.length > 0) {
      exercises = filtered;
    }
  } else if (section) {
    // Only filter by topic if no grammar section is specified
    const filtered = getExercisesByTopic(exercises, section);
    if (filtered.length > 0) {
      exercises = filtered;
    }
  }

  // Return a random exercise from the filtered list
  if (exercises.length > 0) {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    return exercises[randomIndex];
  }

  return null;
}
