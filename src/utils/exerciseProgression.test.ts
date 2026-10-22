import { describe, it, expect } from "vitest";
import { START_OVER_STEP, buildProgressionSteps, levelRank } from "./exerciseProgression";

const levels = (steps: ReturnType<typeof buildProgressionSteps>) => steps.map((s) => s.level);

describe("buildProgressionSteps", () => {
  it("continues the section, then the rest of its level, then the higher levels, then round to A1", () => {
    const steps = buildProgressionSteps({ level: "b1", currentSection: "modalverben_b1", topic: "verben" });
    expect(steps[0]).toMatchObject({ level: "B1", grammarSection: "modalverben_b1" });
    expect(steps[1]).toMatchObject({ level: "B1", afterSection: "modalverben_b1" });
    expect(steps[1].topic).toBeUndefined();
    expect(levels(steps)).toEqual(["B1", "B1", "B2", "C1", "A1", "A2"]);
    expect(steps.every((s) => !s.restart)).toBe(true);
  });

  it("starts with the topic's first section on entry by topic", () => {
    const steps = buildProgressionSteps({ level: "a2", currentSection: null, topic: "verben" });
    expect(steps[0]).toMatchObject({ level: "A2", topic: "verben" });
    expect(steps[1]).toEqual({ level: "A2", description: "sections of A2" });
    expect(levels(steps)).toEqual(["A2", "A2", "B1", "B2", "C1", "A1"]);
  });

  it("goes from the last level straight round to A1", () => {
    expect(levels(buildProgressionSteps({ level: "C1", currentSection: "konjunktiv_c1" }))).toEqual(["C1", "C1", "A1", "A2", "B1", "B2"]);
  });

  it("marks every step in restart mode and starts over with A1's first section", () => {
    expect(buildProgressionSteps({ level: "A1", currentSection: "x", restart: true }).every((s) => s.restart)).toBe(true);
    expect(START_OVER_STEP).toMatchObject({ level: "A1", restart: true });
    expect(START_OVER_STEP.grammarSection).toBeUndefined();
    expect(START_OVER_STEP.afterSection).toBeUndefined();
  });

  it("treats an unknown level as A1 and ranks levels", () => {
    expect(buildProgressionSteps({ level: "zz", currentSection: null })[0].level).toBe("A1");
    expect(levelRank("B2")).toBeGreaterThan(levelRank("a1"));
    expect(levelRank(null)).toBe(-1);
  });
});
