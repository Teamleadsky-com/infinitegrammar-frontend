import { expect, test, type Page, type Route } from "@playwright/test";

// The exercise page's basics, against an intercepted exercises API: the header names the level, topic and
// grammar section from the URL; each gap offers its correct answer and distractors; "Antwort prüfen" stays
// disabled until every gap is filled; the back button goes home and the settings button opens the settings.

const fixture = {
  exercises: [
    {
      id: "e2e-basics-exercise", level: "A1", grammar_section_id: "e2e_basics_section", grammar_section_name: "E2E Präsens",
      grammar_ui_topics: ["verben"], content_topic: "E2E", model: "e2e", order_number: 1, text: "Ich [1] Tee. Du [2] Kaffee.",
      gaps: [
        { no: 1, correct: "trinke", distractors: ["trinkst", "trinkt", "trinken"], explanation: "ich trinke" },
        { no: 2, correct: "trinkst", distractors: ["trinke", "trinkt", "trinken"], explanation: "du trinkst" },
      ],
    },
  ],
};

async function open(page: Page) {
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture) }),
  );
  await page.goto("/exercise?level=a1&section=verben&grammar=e2e_basics_section", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Tee.", { exact: false })).toBeVisible({ timeout: 15_000 });
}

test("header names the level, topic and grammar section; Check stays disabled until every gap is filled", async ({ page }) => {
  await open(page);
  const header = page.locator("header");
  await expect(header.getByText(/^a1$/i)).toBeVisible();
  await expect(header.getByText("verben")).toBeVisible();
  await expect(header.getByText("E2E Präsens")).toBeVisible();

  const check = page.getByRole("button", { name: "Antwort prüfen" });
  await expect(page.getByRole("button", { name: "___" })).toHaveCount(2);
  await expect(check).toBeDisabled();

  // the first gap offers its correct answer and all three distractors
  await page.getByRole("button", { name: "___" }).first().click();
  for (const option of ["trinke", "trinkst", "trinkt", "trinken"]) {
    await expect(page.getByRole("button", { name: option, exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "trinke", exact: true }).click();
  await expect(page.getByRole("button", { name: "___" })).toHaveCount(1);
  await expect(check).toBeDisabled();

  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "trinkst", exact: true }).click();
  await expect(check).toBeEnabled();
});

test("the back button goes home and the settings button opens the exercise settings", async ({ page }) => {
  await open(page);
  await page.locator("header button:has(svg.lucide-settings)").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.locator("header button:has(svg.lucide-arrow-left)").click();
  await expect(page).toHaveURL(/\/$/);
});
