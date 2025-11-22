import * as b2Exercises from "./b2_mock_exercises";

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

// Get exercises filtered by topic
function getExercisesByTopic(exercises: any[], topic: string): any[] {
  const topicLower = topic.toLowerCase();

  // Map topic names to grammar sections
  const topicToSectionMap: Record<string, string> = {
    verben: "verben",
    adjektive: "adjektive",
    artikel: "artikel",
    präpositionen: "präpositionen",
    praepositionen: "präpositionen", // Alternative spelling
  };

  const mappedTopic = topicToSectionMap[topicLower] || topicLower;

  return exercises.filter((ex) => {
    const config = ex.config;
    // Check if the grammar section topics array includes the mapped topic
    const grammarSection = config.grammar_section;

    // For now, do a simple string match
    // In a more complete implementation, you'd look up the grammar section definition
    return (
      grammarSection.toLowerCase().includes(mappedTopic) ||
      config.topic.toLowerCase().includes(mappedTopic)
    );
  });
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

  // Filter by topic if provided
  if (section) {
    const filtered = getExercisesByTopic(exercises, section);
    if (filtered.length > 0) {
      exercises = filtered;
    }
  }

  // Filter by grammar section if provided
  if (grammarSection) {
    const filtered = getExercisesByGrammarSection(exercises, grammarSection);
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
