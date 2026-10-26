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

test("User Metrics has Engagement and Onboarding; Onboarding shows the new-visitor funnel", async ({ page }) => {
  await page.route("**/api/admin-onboarding**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        period: "30", trackingSince: "2026-10-23T14:05:59Z",
        funnel: { sessions: 40, started: 20, completed1: 16, completed3: 4, signups: 2, views: 90, completions: 45 },
        depth: [{ k: 1, shown: 40, completed: 16 }, { k: 2, shown: 12, completed: 6 }],
        firstExercise: { untouched: 22, abandoned: 2, completed: 16 },
        daily: [{ day: "2026-10-25", sessions: 40, completed1: 16, signups: 2 }],
        entry: [{ sectionId: "s1", sectionName: "Satzbau", level: "A1", sessions: 40, completed1: 16, signups: 2, avgShown: 2.3, starterFirst: true }],
        sections: [{ sectionId: "s1", sectionName: "Satzbau", level: "A1", sessions: 40, views: 90, started: 50, completed: 45, scorePct: 80, hasStarters: true }],
        starters: [{ position: 1, shown: 30, started: 15, completed: 14 }],
      }),
    }),
  );
  await openAdmin(page, "?tab=metrics");
  await expect(page.getByRole("tab", { name: "Engagement" })).toHaveAttribute("data-state", "active");
  await page.getByRole("tab", { name: "Onboarding" }).click();
  await expect(page).toHaveURL(/view=onboarding/); // User Metrics is the default tab: no tab= in the URL
  await expect(page.getByRole("heading", { name: "Funnel" })).toBeVisible();
  await expect(page.getByText("Profile created", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Where new visitors land")).toBeVisible();
  await expect(page.getByText("5%", { exact: true })).toBeVisible(); // 2 profiles of 40 sessions
});

test("links to the former separate tabs land on their new place", async ({ page }) => {
  await openAdmin(page, "?tab=templates");
  await expect(page.getByRole("tab", { name: "Kampagne" })).toHaveAttribute("data-state", "active");
  await expect(page.getByRole("tab", { name: "Vorlagen" })).toHaveAttribute("data-state", "active");

  await page.goto("/admin?tab=trace&run=e2e_run", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("tab", { name: "Pipeline" })).toHaveAttribute("data-state", "active", { timeout: 15_000 });
  await expect(page.getByRole("tab", { name: "Trace" })).toHaveAttribute("data-state", "active");
});
