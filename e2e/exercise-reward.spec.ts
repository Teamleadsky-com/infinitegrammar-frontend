import { expect, test, type Page, type Route } from "@playwright/test";

// A perfect exercise is rewarded on the score card: a check badge and a short confetti burst
// (no confetti when the learner prefers reduced motion). The old full-screen 🎉 is gone.

const fixture = {
  exercises: [
    {
      id: "e2e-reward-exercise", level: "A1", grammar_section_id: "e2e_reward_section", grammar_ui_topics: ["verben"],
      content_topic: "E2E", model: "e2e", order_number: 1, text: "Ich [1] Tee. Du [2] Kaffee.",
      gaps: [
        { no: 1, correct: "trinke", distractors: ["trinkst", "trinkt", "trinken"], explanation: "ich trinke" },
        { no: 2, correct: "trinkst", distractors: ["trinke", "trinkt", "trinken"], explanation: "du trinkst" },
      ],
    },
  ],
};

async function answer(page: Page, answers: string[]) {
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture) }),
  );
  await page.goto("/exercise?level=a1&section=verben", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Tee.", { exact: false })).toBeVisible({ timeout: 15_000 });
  for (const a of answers) {
    await page.getByRole("button", { name: "___" }).first().click();
    await page.getByRole("button", { name: a, exact: true }).click();
  }
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
}

test("a perfect exercise shows the check badge and a short confetti burst", async ({ page }) => {
  await answer(page, ["trinke", "trinkst"]);
  await expect(page.getByText("Perfekt! Alle Antworten richtig.")).toBeVisible();
  await expect(page.getByTestId("success-check")).toBeVisible();
  // the burst's origin is a 0×0 point; its pieces are what is seen
  await expect(page.getByTestId("confetti-burst").locator("span").first()).toBeVisible();
  await expect(page.getByText("🎉")).toHaveCount(0);
  // the burst is short; the badge stays
  await expect(page.getByTestId("confetti-burst")).toHaveCount(0, { timeout: 4_000 });
  await expect(page.getByTestId("success-check")).toBeVisible();
});

test("an exercise with a wrong answer shows no reward", async ({ page }) => {
  await answer(page, ["trinke", "trinken"]);
  await expect(page.getByText("1 / 2")).toBeVisible();
  await expect(page.getByTestId("success-check")).toHaveCount(0);
  await expect(page.getByTestId("confetti-burst")).toHaveCount(0);
});

test("with reduced motion there is no confetti, only the badge", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await answer(page, ["trinke", "trinkst"]);
  await expect(page.getByTestId("success-check")).toBeVisible();
  await expect(page.getByTestId("confetti-burst").locator("span").first()).toBeHidden();
});
