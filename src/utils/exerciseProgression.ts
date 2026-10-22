// Where the exercise page looks for the next exercises, in order (POST /api/exercises).
//
// 1. the section being practised (on entry by topic: the topic's first unfinished section);
// 2. the rest of its level: the sections after it in curriculum order, then the earlier ones
//    not finished yet;
// 3. each higher level, from its first section;
// 4. then round to A1 and up to the level below, so after the last level it starts over with A1.
// When every step is empty the learner has done everything: the page starts over with A1's
// first section, ignoring progress (restart).
import { LEVEL_ORDER } from "./exerciseCompletion";

export interface ProgressionStep {
  level: string;
  grammarSection?: string;
  topic?: string;
  afterSection?: string;
  restart?: boolean;
  description: string;
}

export const levelRank = (level: string | null | undefined): number =>
  LEVEL_ORDER.indexOf((level || "").toLowerCase() as (typeof LEVEL_ORDER)[number]);

export function buildProgressionSteps({
  level,
  currentSection,
  topic,
  restart = false,
}: {
  level: string;
  currentSection: string | null;
  topic?: string | null;
  restart?: boolean;
}): ProgressionStep[] {
  const current = levelRank(level) === -1 ? 0 : levelRank(level);
  const L = LEVEL_ORDER[current].toUpperCase();
  const flag = restart ? { restart: true } : {};
  const steps: ProgressionStep[] = [];

  if (currentSection) {
    steps.push({ level: L, grammarSection: currentSection, ...flag, description: `section ${currentSection} at ${L}` });
  } else if (topic) {
    steps.push({ level: L, topic, ...flag, description: `first section of topic ${topic} at ${L}` });
  }
  steps.push({
    level: L,
    ...(currentSection ? { afterSection: currentSection } : {}),
    ...flag,
    description: currentSection ? `sections after ${currentSection} at ${L}` : `sections of ${L}`,
  });
  for (let i = 1; i < LEVEL_ORDER.length; i++) {
    const next = LEVEL_ORDER[(current + i) % LEVEL_ORDER.length].toUpperCase();
    steps.push({ level: next, ...flag, description: `sections of ${next}` });
  }
  return steps;
}

/** The step that starts the curriculum over: A1 from its first section, progress ignored. */
export const START_OVER_STEP: ProgressionStep = {
  level: LEVEL_ORDER[0].toUpperCase(),
  restart: true,
  description: "start over with the first A1 section",
};
