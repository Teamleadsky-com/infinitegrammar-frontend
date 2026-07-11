import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type ConsoleMessage, type Route } from "@playwright/test";

// Stage 3B1: deterministic browser coverage for successful API-backed
// exercise loading, successful API-backed exercise-statistics loading, and
// one real in-application navigation path. Unlike e2e/functional-smoke.spec.ts
// (Stage 3A2, which exercises the deterministic *fallback* behavior when
// Netlify Functions are unavailable), these tests intercept the exact
// application API requests and fulfil them with realistic successful
// payloads, so no API-connection failure is expected on these paths.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenRoutesPath = path.resolve(
  __dirname,
  "../config/seo-golden-routes.json",
);
const goldenRoutes = JSON.parse(fs.readFileSync(goldenRoutesPath, "utf-8"));

function goldenSample(category: string) {
  const sample = goldenRoutes.samples.find(
    (s: { category: string }) => s.category === category,
  );
  if (!sample) {
    throw new Error(
      `No '${category}' category sample found in config/seo-golden-routes.json`,
    );
  }
  return sample;
}

const exerciseSample = goldenSample("exercise");
const exerciseStatsSample = goldenSample("exercise-statistics");

// Distinctive values injected into intercepted API responses. They do not
// appear in the application's mock/fallback data, so their presence in the
// rendered page proves the intercepted API response is what actually
// rendered rather than the local fallback.
const EXERCISE_TEXT_MARKER = "PILOT_API_TEST_MARKER";
const STATS_LEVEL_MARKER = "PILOT_STATS_TEST_LEVEL";

// Matches the BackendExercise contract consumed by src/pages/Exercise.tsx
// (processBackendExercise / mockBackendExercise).
const exerciseApiFixture = {
  exercises: [
    {
      id: "e2e-api-test-exercise",
      level: "B2",
      grammar_section_id: "e2e_test_section",
      grammar_ui_topics: ["verben"],
      content_topic: "E2E API Test",
      model: "e2e-fixture",
      order_number: 0,
      text: `${EXERCISE_TEXT_MARKER} Das Ergebnis [1] wichtig für den Test.`,
      gaps: [
        {
          no: 1,
          correct: "ist",
          distractors: ["war", "wird", "wäre"],
          explanation: "E2E fixture explanation.",
        },
      ],
    },
  ],
};

// Matches the response contracts consumed by src/pages/ExerciseStats.tsx
// (fetchStats: growthData.overall / snapshotData.byLevel).
const growthStatsApiFixture = {
  overall: [{ period: "2026-01-01", count: 7 }],
};
const snapshotApiFixture = {
  byLevel: [{ level: STATS_LEVEL_MARKER, count: 42 }],
};

function trackErrors(page: import("@playwright/test").Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  return { pageErrors, consoleErrors };
}

async function interceptExercisesApi(page: import("@playwright/test").Page) {
  const requestedUrls: string[] = [];
  await page.route("**/api/exercises**", (route: Route) => {
    requestedUrls.push(route.request().url());
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(exerciseApiFixture),
    });
  });
  return requestedUrls;
}

async function interceptStatsApis(page: import("@playwright/test").Page) {
  const requestedUrls: string[] = [];
  await page.route("**/api/exercise-growth-stats**", (route: Route) => {
    requestedUrls.push(route.request().url());
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(growthStatsApiFixture),
    });
  });
  await page.route("**/api/exercise-count-snapshots**", (route: Route) => {
    requestedUrls.push(route.request().url());
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(snapshotApiFixture),
    });
  });
  return requestedUrls;
}

test("exercise route renders content from the intercepted exercises API", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = trackErrors(page);
  const requestedUrls = await interceptExercisesApi(page);

  const response = await page.goto(exerciseSample.path, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  await expect(page.getByText("Übungen werden geladen...")).toBeHidden({
    timeout: 15_000,
  });

  // Proves the intercepted API request was actually made.
  expect(requestedUrls.length).toBeGreaterThan(0);

  // Proves content originating from the intercepted API response rendered
  // (the mock fallback exercise text never contains this marker).
  await expect(page.getByText(EXERCISE_TEXT_MARKER)).toBeVisible();

  // Proves the interactive exercise UI became available.
  await expect(
    page.getByRole("button", { name: "Check Answer" }),
  ).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("exercise-statistics route renders content from the intercepted stats APIs", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = trackErrors(page);
  const requestedUrls = await interceptStatsApis(page);

  const response = await page.goto(exerciseStatsSample.path, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  await expect(page.getByText("Loading statistics...")).toBeHidden({
    timeout: 15_000,
  });

  // Proves both intercepted API requests were actually made.
  expect(requestedUrls.length).toBeGreaterThanOrEqual(2);

  // Proves a distinctive label originating from the intercepted snapshot
  // response is rendered (the "Total Exercises by Level" bar chart's X-axis
  // tick), i.e. the stable view is not the empty fallback state.
  await expect(page.getByText(STATS_LEVEL_MARKER)).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("navigating from exercise-statistics to exercise via the existing 'Continue Learning' button works end to end", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = trackErrors(page);
  await interceptExercisesApi(page);
  await interceptStatsApis(page);

  const response = await page.goto(exerciseStatsSample.path, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  await expect(page.getByText("Loading statistics...")).toBeHidden({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("heading", { name: "Exercises Statistics" }),
  ).toBeVisible();

  // Existing visible internal navigation control (ExerciseStats.tsx ->
  // navigate("/exercise")) — no page.goto() is used to reach the second page.
  await page.getByRole("button", { name: "Continue Learning" }).click();

  await expect(page).toHaveURL(
    new RegExp(`${exerciseSample.path.replace(/\//g, "\\/")}$`),
  );

  await expect(page.getByText("Übungen werden geladen...")).toBeHidden({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("button", { name: "Check Answer" }),
  ).toBeVisible();
  await expect(page.getByText(EXERCISE_TEXT_MARKER)).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
