import { devices, expect, test } from "@playwright/test";

// On the homepage a level alone starts nothing: a grammar topic has to be picked too. On phones the
// topics are below the fold, so tapping a level scrolls down to them. On desktop both are in view.
// On phones the page fits the screen: the header buttons show only their icons (their names stay
// for screen readers) and the quick links wrap.

const fitsScreen = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

/** Width of a header button's label: 1px when only screen readers get it. */
const labelWidth = async (page: import("@playwright/test").Page, name: string) =>
  (await page.locator("header").getByRole("button", { name }).locator("span").boundingBox())!.width;

test.describe("on a phone", () => {
  const { defaultBrowserType: _browser, ...iPhone } = devices["iPhone 13"];
  test.use(iPhone);

  test("tapping a level scrolls down to the grammar topics", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const topics = page.getByRole("heading", { name: "Thema wählen" });
    await expect(topics).not.toBeInViewport();

    await page.getByText("A1", { exact: true }).first().tap();

    await expect(topics).toBeInViewport();
    // below the sticky header, not under it
    const header = await page.locator("header").first().boundingBox();
    const heading = await topics.boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  });

  test("the page fits the screen; the header buttons show icons and keep their names", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(await fitsScreen(page)).toBe(true);
    for (const name of ["Ergebnisse", "Konto"]) {
      await expect(page.locator("header").getByRole("button", { name })).toBeVisible();
      expect(await labelWidth(page, name)).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("on a small Android phone", () => {
  const { defaultBrowserType: _browser, ...galaxy } = devices["Galaxy S8"];
  test.use(galaxy);

  test("the page fits the 360px screen", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Niveau wählen" })).toBeVisible();
    expect(await fitsScreen(page)).toBe(true);
  });
});

test("on desktop the header buttons show their labels", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(await labelWidth(page, "Ergebnisse")).toBeGreaterThan(20);
  expect(await labelWidth(page, "Konto")).toBeGreaterThan(20);
});

test("on desktop selecting a level does not move the page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByText("A1", { exact: true }).first().click();
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
