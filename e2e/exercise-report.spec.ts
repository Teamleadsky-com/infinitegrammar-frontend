import { expect, test, type Page, type Route } from "@playwright/test";

// Reporting an exercise takes it down: the report is saved to the database
// (POST /api/report-exercise sets the exercise inactive), and the learner goes on with
// the next exercise without solving the reported one. A report that is not saved
// keeps the exercise and says so.

const exercise = (id: string, marker: string) => ({
  id,
  level: "B1",
  grammar_section_id: "e2e_report_section",
  grammar_ui_topics: ["verben"],
  content_topic: "E2E report",
  model: "e2e-fixture",
  order_number: 1,
  text: `${marker} Das Ergebnis [1] wichtig.`,
  gaps: [{ no: 1, correct: "ist", distractors: ["war", "wird", "wäre"], explanation: "E2E." }],
});

async function setUp(page: Page, reportStatus: number) {
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ exercises: [exercise("e2e-report-first", "FIRST_EXERCISE"), exercise("e2e-report-second", "SECOND_EXERCISE")] }),
    }),
  );
  const reports: Array<Record<string, unknown>> = [];
  await page.route("**/api/report-exercise", (route: Route) => {
    reports.push(route.request().postDataJSON());
    route.fulfill({
      status: reportStatus,
      contentType: "application/json",
      body: JSON.stringify(reportStatus === 200 ? { success: true } : { error: "Internal server error" }),
    });
  });
  await page.goto("/exercise?level=b1&section=verben", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("FIRST_EXERCISE", { exact: false })).toBeVisible({ timeout: 15_000 });
  await page.getByTitle("Report an issue with this exercise").click();
  await page.getByLabel("Describe the issue").fill("Gap 1 has two correct answers in this sentence.");
  await page.getByRole("button", { name: "Submit Report" }).click();
  return reports;
}

test("a saved report takes the exercise down and shows the next one", async ({ page }) => {
  const reports = await setUp(page, 200);

  await expect(page.getByRole("heading", { name: "✓ Thank you!" })).toBeVisible();
  expect(reports).toEqual([{ exerciseId: "e2e-report-first", reportText: "Gap 1 has two correct answers in this sentence." }]);

  // behind the dialog the next exercise is already shown, unsolved
  await page.getByRole("button", { name: "Continue Learning" }).click();
  await expect(page.getByText("SECOND_EXERCISE", { exact: false })).toBeVisible();
  await expect(page.getByText("FIRST_EXERCISE", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Antwort prüfen" })).toBeDisabled();
});

test("a report that is not saved keeps the exercise and shows an error", async ({ page }) => {
  await setUp(page, 500);

  await expect(page.getByText("Something went wrong. Please try again.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "✓ Thank you!" })).toHaveCount(0);
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("FIRST_EXERCISE", { exact: false })).toBeVisible();
});
