import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type ConsoleMessage } from "@playwright/test";

// Stage 3A2: application route smoke tests for exercise, exercise-statistics,
// and authentication/account. Routes are read from the Stage 2 golden-route
// config rather than hard-coded here, so there is a single source of truth
// for repository routes (config/seo-golden-routes.json).
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
const authSample = goldenSample("auth-account");

/**
 * The local Playwright harness starts the app via `npm run dev` (plain Vite),
 * not `netlify dev`. Netlify Functions therefore aren't reachable on
 * localhost:8888 in this environment, so the Exercise and ExerciseStats
 * pages' own data-fetching `fetch()` calls reject with a connection error.
 * Both pages already handle this in their existing production code by
 * catching the failure, logging it via `console.error`, and falling back to
 * deterministic local behavior (mock exercise data / an empty stats view) —
 * this is existing app behavior, not something invented for this test.
 * These specific, fixed log messages are allow-listed below so the smoke
 * test can still fail on any *other*, unexpected console error.
 */
const BENIGN_CONSOLE_PATTERNS: RegExp[] = [
  /^Error fetching from /, // Exercise.tsx progression-step fetch failures
  /^Error fetching exercise stats:/, // ExerciseStats.tsx fetch failure
  // Chromium's own resource-load-failure log for the same rejected
  // `fetch()` calls to the unavailable localhost:8888 API above.
  /^Failed to load resource: net::ERR_CONNECTION_REFUSED$/,
];

function trackErrors(page: import("@playwright/test").Page) {
  const pageErrors: string[] = [];
  const unexpectedConsoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (BENIGN_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))) return;
    unexpectedConsoleErrors.push(text);
  });

  return { pageErrors, unexpectedConsoleErrors };
}

test("exercise route renders and hydrates without fatal errors", async ({
  page,
}) => {
  const { pageErrors, unexpectedConsoleErrors } = trackErrors(page);

  const response = await page.goto(exerciseSample.path, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  // Initial loading state must resolve rather than remain stuck.
  await expect(page.getByText("Übungen werden geladen...")).toBeHidden({
    timeout: 15_000,
  });

  // Hydration reached the interactive exercise UI (proves the SPA shell
  // is not a permanently blank/empty shell for this route).
  await expect(
    page.getByRole("button", { name: "Check Answer" }),
  ).toBeVisible();

  const root = page.locator("#root");
  const rootBox = await root.boundingBox();
  expect(rootBox?.height ?? 0).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
  expect(unexpectedConsoleErrors).toEqual([]);
});

test("exercise-statistics route renders and hydrates without fatal errors", async ({
  page,
}) => {
  const { pageErrors, unexpectedConsoleErrors } = trackErrors(page);

  const response = await page.goto(exerciseStatsSample.path, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);

  // Initial loading state must resolve rather than remain stuck.
  await expect(page.getByText("Loading statistics...")).toBeHidden({
    timeout: 15_000,
  });

  // The page reached its stable view (heading is always rendered once
  // loading completes, whether or not growth data was available).
  await expect(
    page.getByRole("heading", { name: "Exercises Statistics" }),
  ).toBeVisible();

  const root = page.locator("#root");
  const rootBox = await root.boundingBox();
  expect(rootBox?.height ?? 0).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
  expect(unexpectedConsoleErrors).toEqual([]);
});

test("authentication route renders the existing unauthenticated login interface", async ({
  page,
}) => {
  const { pageErrors, unexpectedConsoleErrors } = trackErrors(page);

  const response = await page.goto(authSample.path, {
    waitUntil: "networkidle",
  });
  expect(response?.ok()).toBe(true);

  // Specific, intentional unauthenticated behavior: the existing login
  // form (not merely "some non-empty page").
  await expect(
    page.getByRole("heading", { name: "Infinite Grammar" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(unexpectedConsoleErrors).toEqual([]);
});
