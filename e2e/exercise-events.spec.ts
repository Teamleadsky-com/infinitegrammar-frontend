import { expect, test, type Route } from "@playwright/test";

// The Exercise page logs what happens to an exercise on screen (shown, started,
// submitted) to /api/exercise-events for every visitor, including anonymous ones.
// Automated browsers are not visitors, so the page stays silent under Playwright
// unless navigator.webdriver and the headless user agent are hidden, as a real
// browser would report them.

const exerciseApiFixture = {
  exercises: [
    {
      id: "e2e-events-exercise",
      level: "B1",
      grammar_section_id: "e2e_events_section",
      grammar_ui_topics: ["verben"],
      content_topic: "E2E events",
      model: "e2e-fixture",
      order_number: 1,
      text: "EVENTS_TEST_MARKER Das Ergebnis [1] wichtig.",
      gaps: [{ no: 1, correct: "ist", distractors: ["war", "wird", "wäre"], explanation: "E2E." }],
    },
  ],
};

type EventBody = Record<string, unknown>;

async function setUp(page: import("@playwright/test").Page, { hideWebdriver }: { hideWebdriver: boolean }) {
  if (hideWebdriver) {
    await page.addInitScript(() => {
      const userAgent = navigator.userAgent.replace("HeadlessChrome", "Chrome");
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "userAgent", { get: () => userAgent });
    });
  }
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(exerciseApiFixture) }),
  );
  const events: EventBody[] = [];
  await page.route("**/api/exercise-events", (route: Route) => {
    events.push(route.request().postDataJSON());
    route.fulfill({ status: 202, contentType: "application/json", body: '{"stored":true}' });
  });
  return events;
}

test("an anonymous visitor's exercise logs shown, started and submitted for one view", async ({ page }) => {
  const events = await setUp(page, { hideWebdriver: true });

  await page.goto("/exercise?level=b1&section=verben", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("EVENTS_TEST_MARKER", { exact: false })).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => events.map((e) => e.event)).toEqual(["shown"]);

  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "wird", exact: true }).click();
  await page.getByRole("button", { name: "wird" }).click();
  await page.getByRole("button", { name: "ist", exact: true }).click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();

  // "started" is sent once, on the first answer, not on the change of answer.
  await expect.poll(() => events.map((e) => e.event)).toEqual(["shown", "started", "submitted"]);

  const [shown, started, submitted] = events;
  expect(new Set(events.map((e) => e.view_id)).size).toBe(1);
  expect(new Set(events.map((e) => e.session_id)).size).toBe(1);
  expect(shown).toMatchObject({ exercise_id: "e2e-events-exercise", user_id: null });
  expect(started).not.toHaveProperty("correct_answers");
  expect(submitted).toMatchObject({ exercise_id: "e2e-events-exercise", correct_answers: 1, total_answers: 1 });
});

test("automated browsers send no exercise events", async ({ page }) => {
  const events = await setUp(page, { hideWebdriver: false });

  await page.goto("/exercise?level=b1&section=verben", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("EVENTS_TEST_MARKER", { exact: false })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "ist", exact: true }).click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await expect(page.getByRole("button", { name: "Antwort prüfen" })).toBeHidden();

  expect(events).toEqual([]);
});
