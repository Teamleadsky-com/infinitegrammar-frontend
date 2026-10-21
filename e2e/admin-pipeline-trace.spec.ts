import { expect, test, type Page, type Route } from "@playwright/test";

// Admin "Pipeline trace" tab (generator spec §5.5), against intercepted API responses: the run
// header, one card per stage with its iteration rows, a count opening exactly its attempts, an
// attempt's steps with feedback and exercise versions, and closing the side panel again.

const RUN = {
  runId: "e2e_refill", kind: "production", config: "generator_e2e", verifierVersion: "v3", mode: "batch",
  status: "finalized", requested: 3, attempts: 3, accepted: 2, rejected: 1, unfinished: 0, spentUsd: 0.25,
  startedAt: "2026-10-09T17:29:00Z", finishedAt: "2026-10-09T19:40:00Z", durationSeconds: 7860, yieldPct: 66.7,
  requestedMetPct: 66.7, usdPerAccepted: 0.125, stageDefsSnapshot: false,
};

const usage = { calls: 3, inputTokens: 3000, outputTokens: 2000, reasoningTokens: 500, costUsd: 0.05, startedAt: null, finishedAt: null, spanSeconds: null, callSeconds: null };

const TRACE = {
  stages: [
    { stage: "generation", stageLabel: "Generation", stageOrder: 2, nIn: 3, nPassed: 3, nFailed: 0, nOther: 0, nPassedFirstTry: 3, nPassedAfterRetry: 0, maxIterationUsed: 0, ...usage },
    { stage: "gap_checks", stageLabel: "Gap checks and repair", stageOrder: 4, nIn: 3, nPassed: 2, nFailed: 1, nOther: 0, nPassedFirstTry: 1, nPassedAfterRetry: 1, maxIterationUsed: 1, ...usage },
  ],
  iterations: [
    { stage: "generation", iteration: 0, nIn: 3, nPassed: 3, nRetry: 0, nFailed: 0, nOther: 0, models: ["gpt-6.1-sol"], ...usage },
    { stage: "gap_checks", iteration: 0, nIn: 3, nPassed: 1, nRetry: 2, nFailed: 0, nOther: 0, models: ["gpt-5-mini", "gpt-5.2"], ...usage },
    { stage: "gap_checks", iteration: 1, nIn: 2, nPassed: 1, nRetry: 0, nFailed: 1, nOther: 0, models: ["gpt-5.2", "gpt-6.1-sol"], ...usage },
  ],
  issues: [
    { stage: "gap_checks", iteration: 0, issueCode: "G2", issueLabel: "Second correct answer", nRetry: 2, nFailed: 0, n: 2 },
    { stage: "gap_checks", iteration: 1, issueCode: "G4", issueLabel: "Explanation or key wrong", nRetry: 0, nFailed: 1, n: 1 },
  ],
  stageDefs: [
    { stage: "gap_checks", stageOrder: 4, maxIterations: 2, component: "judge", componentOrder: 1, kind: "llm", model: "gpt-5.2", settings: { reasoning_effort: "low" }, promptId: "judge:1", promptText: "Check the gaps of {grammar_section}.", rulesText: null, applies: null, snapshot: false },
  ],
  issueLabels: { G2: "Second correct answer", G4: "Explanation or key wrong" },
};

const attemptRow = (n: number, status: string, extra = {}) => ({
  attemptId: `e2e_refill:praesens:${n}`, sectionId: "praesens", sectionName: "Präsens", level: "A1", contentTopic: `Topic ${n}`,
  scene: null, status, issueCodes: status === "rejected" ? ["G4"] : [], exerciseId: null, steps: 3, calls: 6, costUsd: 0.08,
  callSeconds: null, verdict: null, stepIssueCodes: null, stepCostUsd: null, iteration: null, ...extra,
});

const v1 = { text: "Ich [1] Tee.", gaps: [{ no: 1, correct: "trinke", distractors: ["trinkst", "trinkt", "trinken"], explanation: "ich trinke" }] };
const v2 = { text: "Ich [1] gern Tee.", gaps: [{ no: 1, correct: "trinke", distractors: ["trinkst", "trinkt", "trinken"], explanation: "Bei „ich“: trinke" }] };

const ATTEMPT = {
  attempt: { ...attemptRow(3, "rejected"), runKind: "production", firstVersion: "v1", finalVersion: "v2", startedAt: null, finishedAt: null, details: {} },
  steps: [
    { stage: "generation", stageOrder: 2, iteration: 0, stepOrder: 1, verdict: "done", issueCodes: [], feedback: null, details: {}, inputVersion: null, outputVersion: "v1", models: ["gpt-6.1-sol"], calls: 1, inputTokens: 900, outputTokens: 1000, reasoningTokens: 100, costUsd: 0.004, startedAt: null, finishedAt: null, callSeconds: null },
    { stage: "gap_checks", stageOrder: 4, iteration: 0, stepOrder: 2, verdict: "retry", issueCodes: ["G2"], feedback: "[G2] Lücke [1]: more than one option fits.", details: { failing_gaps: [{ gap_no: 1, G2: false }] }, inputVersion: "v1", outputVersion: "v1", models: ["gpt-5-mini"], calls: 3, inputTokens: 5000, outputTokens: 9000, reasoningTokens: 5000, costUsd: 0.013, startedAt: null, finishedAt: null, callSeconds: null },
    { stage: "gap_checks", stageOrder: 4, iteration: 1, stepOrder: 3, verdict: "failed", issueCodes: ["G4"], feedback: "[G4] Lücke [1]: explanation wrong.", details: {}, inputVersion: "v1", outputVersion: "v2", models: ["gpt-6.1-sol"], calls: 5, inputTokens: 8000, outputTokens: 11000, reasoningTokens: 6000, costUsd: 0.024, startedAt: null, finishedAt: null, callSeconds: null },
  ],
  versions: { v1, v2 },
};

async function setUp(page: Page) {
  const attemptQueries: string[] = [];
  await page.addInitScript(() =>
    localStorage.setItem("user", JSON.stringify({ id: "00000000-0000-4000-8000-000000000001", email: "aleksandr.zuravliov1@gmail.com", name: "Admin" })),
  );
  const json = (route: Route, body: unknown) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  await page.route("**/api/admin-pipeline-trace-runs**", (route) => json(route, { runs: [RUN] }));
  await page.route("**/api/admin-pipeline-trace?**", (route) => json(route, TRACE));
  await page.route("**/api/admin-pipeline-trace-attempts?**", (route) => {
    const url = new URL(route.request().url());
    attemptQueries.push(url.search);
    const failedHere = url.searchParams.get("stage") === "gap_checks" && url.searchParams.get("verdicts") === "failed";
    return json(route, {
      attempts: failedHere
        ? [attemptRow(3, "rejected", { verdict: "failed", stepIssueCodes: ["G4"], stepCostUsd: 0.04, iteration: 1 })]
        : [attemptRow(1, "accepted"), attemptRow(2, "accepted"), attemptRow(3, "rejected")],
    });
  });
  await page.route("**/api/admin-pipeline-trace-attempt?**", (route) => json(route, ATTEMPT));
  return attemptQueries;
}

test("pipeline trace shows the run stage by stage and opens the attempts behind a count", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  const attemptQueries = await setUp(page);

  await page.goto("/admin?tab=trace&run=e2e_refill", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Gap checks and repair" })).toBeVisible({ timeout: 15_000 });

  // run header: totals, batch and rebuilt-settings notes, h:mm duration
  await expect(page.getByText("Batch API: durations include the queue time")).toBeVisible();
  await expect(page.getByText("Stage settings were rebuilt from today's code")).toBeVisible();
  await expect(page.getByText("2:11")).toBeVisible();

  // stage cards top to bottom, numbered 1..n, with iteration labels and reasons
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(["Pipeline trace", "Generation", "Gap checks and repair"]);
  await expect(page.getByText("Gap repair 1 → full re-check → strict G3 of the repaired gaps")).toBeVisible();
  await expect(page.getByText("Second correct answer × 2")).toBeVisible();

  // the stage's "failed" count opens exactly those attempts
  const gapCard = page.locator(".rounded-lg").filter({ has: page.getByRole("heading", { name: "Gap checks and repair" }) });
  await gapCard.getByTitle("Show these attempts").nth(4).click(); // in, passed, first try, after a repair, failed
  const panel = page.getByRole("dialog");
  await expect(panel.getByRole("heading", { name: "Gap checks and repair · failed" })).toBeVisible();
  expect(attemptQueries.at(-1)).toContain("stage=gap_checks");
  expect(attemptQueries.at(-1)).toContain("iteration=last");
  await expect(panel.locator("tbody tr")).toHaveCount(1);

  // the attempt: feedback of the retry and failed steps, exercise versions with the correct answer marked
  await panel.locator("tbody tr").first().click();
  await expect(panel.getByText("[G4] Lücke [1]: explanation wrong.")).toBeVisible();
  await expect(panel.getByText("[G2] Lücke [1]: more than one option fits.")).toBeVisible();
  await panel.getByRole("button", { name: "left", exact: true }).nth(2).click();
  await expect(panel.getByText("✓ trinke")).toBeVisible();
  await panel.getByRole("button", { name: "Show changes" }).click();
  await expect(panel.getByText("changed: explanation")).toBeVisible();

  // back to the list, then close: the page stays usable
  await panel.getByRole("button", { name: "Back to the list" }).click();
  await expect(panel.locator("tbody tr")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("heading", { name: "Gap checks and repair" })).toBeVisible();

  // configuration: the prompt with its placeholder
  await gapCard.getByRole("button", { name: /Configuration/ }).click();
  await gapCard.getByRole("button", { name: "Prompt" }).click();
  await expect(page.getByRole("dialog").locator("mark", { hasText: "{grammar_section}" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});
