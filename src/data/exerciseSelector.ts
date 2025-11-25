import * as b2Exercises from "./b2_mock_exercises";
import { GrammarUiTopicId } from "./grammarSections";

// Map to convert grammar section names to exercise IDs
const grammarSectionToExerciseMap: Record<string, string[]> = {
  satzbau_wortstellung: ["b2_satzbau_wortstellung_1"],
  konnektoren_nebensaetze: ["b2_konnektoren_nebensaetze_1"],
  konditionalsaetze_konjunktiv2: ["b2_konditionalsaetze_konjunktiv2_1"],
  passiv: ["b2_passiv_1"],
  indirekte_rede: ["b2_indirekte_rede_1"],
  adjektivdeklination: ["b2_adjektivdeklination_1"],
  relativsaetze: ["b2_relativsaetze_1"],
  infinitivsaetze: ["b2_infinitivsaetze_1"],
  verben_praeposition: ["b2_verben_praeposition_1"],
  nominalisierung: ["b2_nominalisierung_1"],
  feste_verbindungen: ["b2_feste_verbindungen_1"],
  genitiv: ["b2_genitiv_1"],
};

// Get all exercises for a given level
function getAllExercisesForLevel(level: string): any[] {
  const levelLower = level.toLowerCase();

  if (levelLower === "b2") {
    return Object.values(b2Exercises);
  }

  // Add other levels as they become available
  return [];
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
  const exerciseKeys = grammarSectionToExerciseMap[grammarSectionId] || [];

  return exercises.filter((ex) => {
    const exerciseName = Object.keys(b2Exercises).find(
      (key) => (b2Exercises as any)[key] === ex
    );
    return exerciseName && exerciseKeys.includes(exerciseName);
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
