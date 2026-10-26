import { expect, test, type Page, type Route } from "@playwright/test";

// Admin area layout: User Metrics, Campaign, Supply, Quality, Pipeline, Similarity. Campaign groups
// its overview, templates and settings, and Pipeline its runs and trace, as sub-tabs. The open page
// is in the URL (?tab=, ?view=); links to the former separate tabs still land on the right sub-tab.

async function openAdmin(page: Page, query = "") {
  await page.addInitScript(() =>
    localStorage.setItem("user", JSON.stringify({ id: "00000000-0000-4000-8000-000000000001", email: "aleksandr.zuravliov1@gmail.com", name: "Admin" })),
  );
  const json = (route: Route, body: unknown) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  await page.route("**/api/admin-pipeline-runs**", (route) =>
    json(route, { runs: [{ runId: "e2e_run", kind: "production", config: "c", status: "finalized", attempts: 1, accepted: 1, rejected: 0, unfinished: 0, hasTrace: true }] }),
  );
  await page.route("**/api/admin-pipeline-trace-runs**", (route) => json(route, { runs: [] }));
  await page.goto(`/admin${query}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("tab", { name: "User Metrics" })).toBeVisible({ timeout: 15_000 });
}

const topTabs = (page: Page) => page.getByRole("tablist").first().getByRole("tab");

test("top-level tabs are in the agreed order and the admin area opens on User Metrics", async ({ page }) => {
  await openAdmin(page);
  await expect(topTabs(page)).toHaveText(["User Metrics", "Kampagne", "Supply", "Quality", "Pipeline", "Ähnlichkeit"]);
  await expect(page.getByRole("tab", { name: "User Metrics" })).toHaveAttribute("data-state", "active");
});

test("Campaign groups overview, templates and settings as sub-tabs", async ({ page }) => {
  await openAdmin(page);
  await page.getByRole("tab", { name: "Kampagne" }).click();
  await expect(page.getByRole("tab", { name: "Übersicht" })).toHaveAttribute("data-state", "active");
  await page.getByRole("tab", { name: "Vorlagen" }).click();
  await expect(page).toHaveURL(/tab=campaign&view=templates/);
  await page.getByRole("tab", { name: "Einstellungen" }).click();
  await expect(page).toHaveURL(/tab=campaign&view=settings/);
});

test("Pipeline groups runs and trace; a run's Trace link opens the trace sub-tab", async ({ page }) => {
  await openAdmin(page, "?tab=pipeline");
  await expect(page.getByRole("tab", { name: "Runs" })).toHaveAttribute("data-state", "active");
  await page.getByRole("button", { name: "Trace", exact: true }).click();
  await expect(page).toHaveURL(/tab=pipeline&view=trace&run=e2e_run/);
  await expect(page.getByRole("tab", { name: "Trace" })).toHaveAttribute("data-state", "active");
});

test("links to the former separate tabs land on their new place", async ({ page }) => {
  await openAdmin(page, "?tab=templates");
  await expect(page.getByRole("tab", { name: "Kampagne" })).toHaveAttribute("data-state", "active");
  await expect(page.getByRole("tab", { name: "Vorlagen" })).toHaveAttribute("data-state", "active");

  await page.goto("/admin?tab=trace&run=e2e_run", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("tab", { name: "Pipeline" })).toHaveAttribute("data-state", "active", { timeout: 15_000 });
  await expect(page.getByRole("tab", { name: "Trace" })).toHaveAttribute("data-state", "active");
});
