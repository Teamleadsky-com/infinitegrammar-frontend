import { expect, test, type Page, type Route } from "@playwright/test";

// Admin Pipeline -> Verifier benchmark (generator spec §5.6), against intercepted API responses: the runs
// table with rates and their n, one run by defect type and stage, and two runs compared.

const run = (id: string, config: string, tag: string, detection: number, falseRejects: number) => ({
  runId: id, config, tag, dataset: "verifier_bench_v1", subset: "pilot", status: "finished", mode: "sync",
  startedAt: "2026-10-27T08:00:00Z", finishedAt: null, items: 24, done: 24, planted: 18, caught: Math.round((detection * 18) / 100),
  caughtExpected: 16, clean: 6, falseRejects, detectionPct: detection, falseRejectPct: (falseRejects * 100) / 6,
  balancedAccuracyPct: (detection + 100 - (falseRejects * 100) / 6) / 2, precisionSetPct: 90, precisionAt20Pct: 59, precisionAt50Pct: 85,
  usdPerItem: 0.108, secondsPerItem: 89, spentUsd: 2.59, models: ["gpt-5.2", "gpt-6.1-sol"], finalGateModel: "gpt-6.1-sol",
});

const types = (p10: number, clean: number) => [
  { type: "P2", label: "Second correct form as a distractor", order: 2, n: 2, rejected: 2, rejectedPct: 100, rejectedExpected: 2, nWithGap: 2, atGap: 2 },
  { type: "P10", label: "Gap or distractor off the grammar section", order: 10, n: 2, rejected: p10, rejectedPct: p10 * 50, rejectedExpected: p10, nWithGap: 2, atGap: p10 },
  { type: "clean", label: "Clean parent (a rejection is a false reject)", order: 14, n: 6, rejected: clean, rejectedPct: (clean * 100) / 6, rejectedExpected: 0, nWithGap: 0, atGap: 0 },
];

async function setUp(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem("user", JSON.stringify({ id: "00000000-0000-4000-8000-000000000001", email: "aleksandr.zuravliov1@gmail.com", name: "Admin" })),
  );
  const json = (route: Route, body: unknown) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  await page.route("**/api/admin-bench-runs**", (route) =>
    json(route, { runs: [run("bench_b", "verifier_bench_fg2", "fg2", 100, 2), run("bench_a", "verifier_bench_sub6", "sub6", 94.4, 1)], typeLabels: [] }),
  );
  await page.route("**/api/admin-bench-run?**", (route) =>
    json(route, {
      types: types(1, 1),
      stages: [{ stage: "final_gate", label: "Final gate (FG1-FG6)", order: 3, plantedN: 18, plantedFlagged: 17, ownN: 17, ownFlagged: 16, ownRecallPct: 94.1, cleanN: 6, cleanFlagged: 1, cleanFlaggedPct: 16.7 }],
    }),
  );
  await page.route("**/api/admin-bench-items?**", (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("compare")) {
      return json(route, {
        subsetsDiffer: false, subsets: { a: "pilot", b: "pilot" },
        rows: [
          { attempt_id: "vb1-p4-P10-9", planted_type: "P10", level: "B1", sectionId: "s", a_rejected: true, b_rejected: false, aStages: ["final_gate"], bStages: [], aCodes: ["FG6"], bCodes: [] },
          { attempt_id: "vb1-p1-P2-0", planted_type: "P2", level: "A2", sectionId: "s", a_rejected: true, b_rejected: true, aStages: ["final_gate"], bStages: ["final_gate"], aCodes: ["FG1"], bCodes: ["FG1"] },
        ],
        typesA: types(2, 2), typesB: types(1, 1),
      });
    }
    return json(route, {
      items: [
        { attemptId: "vb1-p4-P10-9", parentId: "p4", subset: "pilot", sectionId: "s", level: "B1", plantedType: "P10", plantedVariant: "v1", plantedAuthor: "code", seenInCalibration: false, cleanSource: "audit", status: "accepted", rejected: false, done: true, flaggedStages: [], flaggedCodes: [], expectedHit: false, atGap: false, costUsd: 0.108, callSeconds: 89, wallSeconds: 90 },
        { attemptId: "vb1-p1-clean", parentId: "p1", subset: "pilot", sectionId: "s", level: "A2", plantedType: "clean", plantedVariant: null, plantedAuthor: null, seenInCalibration: false, cleanSource: "audit", status: "rejected", rejected: true, done: true, flaggedStages: ["final_gate"], flaggedCodes: ["FG5"], expectedHit: null, atGap: null, costUsd: 0.108, callSeconds: 80, wallSeconds: 85 },
      ],
    });
  });
  await page.goto("/admin?tab=pipeline&view=bench", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Verifier benchmark" })).toBeVisible({ timeout: 15_000 });
}

test("runs table shows rates with their n, and a run opens by type, stage and item", async ({ page }) => {
  await setUp(page);
  await expect(page.getByText("94.4% (n = 18)")).toBeVisible();
  await expect(page.getByText("16.7% (n = 6)")).toBeVisible();
  await expect(page.getByText("The pilot subset has 18 planted and 6 clean items")).toBeVisible();

  await page.getByText("verifier_bench_sub6").click();
  await expect(page.getByRole("heading", { name: "By defect type", exact: true })).toBeVisible();
  await expect(page.getByText("Clean items rejected: false rejects, lower is better")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Final gate (FG1-FG6)" })).toBeVisible();
  await expect(page.getByText("accepted · missed")).toBeVisible();
  await expect(page.getByText("rejected · false reject")).toBeVisible();
});

test("two runs of the same dataset compare with the exact McNemar test", async ({ page }) => {
  await setUp(page);
  await page.getByRole("checkbox", { name: "Compare bench_a" }).click();
  await page.getByRole("checkbox", { name: "Compare bench_b" }).click();
  await page.getByRole("button", { name: "Compare A and B" }).click();
  await expect(page.getByText("A: sub6 · B: fg2")).toBeVisible();
  await expect(page.getByText("p = 1.00 · could be chance").first()).toBeVisible();
  await expect(page.getByText("Items where A and B differ (1)")).toBeVisible();
  await expect(page.getByRole("cell", { name: "vb1-p4-P10-9" })).toBeVisible();
});

test("the benchmark links to the run in the Pipeline trace", async ({ page }) => {
  await setUp(page);
  await page.route("**/api/admin-pipeline-trace-runs**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"runs":[]}' }));
  await page.getByRole("button", { name: "Open in Pipeline trace" }).last().click();
  await expect(page).toHaveURL(/tab=pipeline&view=trace&run=bench_a/);
});
