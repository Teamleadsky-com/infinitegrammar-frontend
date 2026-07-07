import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Stage 3A1 proof-of-life only: verifies the local app boots and renders
// the homepage without fatal errors. The homepage path is read from the
// Stage 2 golden-route config rather than hard-coded here, so there is a
// single source of truth for repository routes.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenRoutesPath = path.resolve(
  __dirname,
  "../config/seo-golden-routes.json",
);
const goldenRoutes = JSON.parse(fs.readFileSync(goldenRoutesPath, "utf-8"));

const homepageSample = goldenRoutes.samples.find(
  (sample) => sample.category === "homepage",
);

if (!homepageSample) {
  throw new Error(
    "No 'homepage' category sample found in config/seo-golden-routes.json",
  );
}

test("homepage loads and renders visible content without page or console errors", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  const response = await page.goto(homepageSample.path, {
    waitUntil: "networkidle",
  });

  expect(response?.ok()).toBe(true);

  const root = page.locator("#root");
  const rootText = await root.innerText();
  expect(rootText.trim().length).toBeGreaterThan(0);

  await expect(root).toBeVisible();
  const rootBox = await root.boundingBox();
  expect(rootBox?.height ?? 0).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
