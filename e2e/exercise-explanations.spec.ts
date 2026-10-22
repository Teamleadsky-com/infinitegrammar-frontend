import { expect, test, type Route } from "@playwright/test";

// After submitting, "Erklärungen anzeigen" lists the explanation of every gap. The ones that belong
// to wrong answers stand out (red box with ✗ "Erklärung", the learner's answer struck through,
// "Deine Antwort: …"); the ones of correct answers keep the calm style.

const exerciseApiFixture = {
  exercises: [
    {
      id: "e2e-explanations-exercise",
      level: "A1",
      grammar_section_id: "e2e_explanations_section",
      grammar_ui_topics: ["verben"],
      content_topic: "E2E",
      model: "e2e",
      order_number: 1,
      text: "Ich [1] Tee. Du [2] Kaffee.",
      gaps: [
        { no: 1, correct: "trinke", distractors: ["trinkst", "trinkt", "trinken"], explanation: "EXPLANATION_ONE: ich trinke." },
        { no: 2, correct: "trinkst", distractors: ["trinke", "trinkt", "trinken"], explanation: "EXPLANATION_TWO: du trinkst." },
      ],
    },
  ],
};

test("explanations of wrong answers are highlighted, with the learner's answer", async ({ page }) => {
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(exerciseApiFixture) }),
  );
  await page.goto("/exercise?level=a1&section=verben", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Tee.", { exact: false })).toBeVisible({ timeout: 15_000 });

  // gap 1 right, gap 2 wrong
  await page.getByRole("button", { name: "___" }).first().click();
  await page.getByRole("button", { name: "trinke", exact: true }).click();
  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "trinken", exact: true }).click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await page.getByRole("button", { name: "Erklärungen anzeigen" }).click();

  const items = page.getByTestId("gap-explanation");
  await expect(items).toHaveCount(2);

  const right = items.filter({ hasText: "EXPLANATION_ONE" });
  await expect(right).toHaveAttribute("data-wrong", "false");
  await expect(right.getByText("Falsch")).toHaveCount(0);
  await expect(right.getByText("Erklärung:")).toBeVisible();

  const wrong = items.filter({ hasText: "EXPLANATION_TWO" });
  await expect(wrong).toHaveAttribute("data-wrong", "true");
  await expect(wrong.getByText("Falsch")).toHaveCount(0);
  await expect(wrong.getByText("Erklärung", { exact: true })).toBeVisible();
  await expect(wrong.locator("svg.lucide-circle-x, svg.lucide-x-circle")).toHaveCount(1);
  await expect(wrong.getByText("Deine Antwort:", { exact: false })).toBeVisible();
  // the learner's answer is struck through, the correct one shown next to it
  await expect(wrong.locator(".line-through", { hasText: "trinken" }).first()).toBeVisible();
  await expect(wrong.locator(".text-success", { hasText: "trinkst" }).first()).toBeVisible();

  await page.getByTestId("gap-explanation").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath("explanations.png"), fullPage: true });
});
