import { expect, test, type Route } from "@playwright/test";

// Every page of the app a visitor sees is logged to /api/page-view (onboarding funnel), in the same tab
// session as the exercise events. Not for the admin area; the query string is never part of the path.
// Automated browsers send nothing, so navigator.webdriver and the headless user agent are hidden here.

test("pages are logged with the tab session; the admin area is not", async ({ page }) => {
  await page.addInitScript(() => {
    const userAgent = navigator.userAgent.replace("HeadlessChrome", "Chrome");
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgent", { get: () => userAgent });
  });
  await page.route("**/api/exercises**", (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        exercises: [{ id: "pv-ex", level: "A1", grammar_section_id: "pv_s", grammar_ui_topics: ["verben"], content_topic: "x", model: "x", order_number: 1,
          text: "PV_MARK Das [1] gut.", gaps: [{ no: 1, correct: "ist", distractors: ["war", "wird", "wäre"], explanation: "e" }] }],
      }),
    }),
  );
  await page.route("**/api/exercise-events", (route: Route) => route.fulfill({ status: 202, body: "{}" }));
  const views: Array<Record<string, unknown>> = [];
  await page.route("**/api/page-view", (route: Route) => {
    views.push(route.request().postDataJSON());
    route.fulfill({ status: 202, contentType: "application/json", body: '{"stored":true}' });
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect.poll(() => views.map((v) => v.page)).toEqual(["home"]);

  // in-app navigation to an exercise topic
  await page.getByRole("button", { name: "Verben" }).click();
  await expect(page.getByText("PV_MARK", { exact: false })).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => views.map((v) => v.page)).toEqual(["home", "exercise"]);
  expect(views[1].path).toBe("/exercise");
  expect(new Set(views.map((v) => v.session_id)).size).toBe(1);
  expect(views[0]).toMatchObject({ user_id: null });

  // the admin area is never logged
  await page.evaluate(() => {
    window.history.pushState({}, "", "/admin");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await page.waitForTimeout(800);
  // (a visitor who isn't the admin is sent back to the homepage, and that page view is logged)
  expect(views.some((v) => String(v.path).startsWith("/admin"))).toBe(false);
});
