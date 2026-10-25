import { expect, test, type Page, type Route } from "@playwright/test";

// Starter-exercises experiment: an anonymous visitor gets a section's curated starters first, then
// the section's other exercises at random. When the visitor switches section themselves (settings
// dialog, an in-app navigation), that section's starters come first again, even if they were shown
// earlier in this visit. The fake API follows POST /api/exercises: starters first, `exclude` honoured.

const SECTIONS: Record<string, { exercises: number[]; starters: number[] }> = {
  s1: { exercises: [1, 2, 3, 4], starters: [3, 1] },
  s2: { exercises: [1, 2, 3], starters: [2] },
};

const exercise = (section: string, n: number) => ({
  id: `${section}-${n}`, level: "A1", grammar_section_id: section, grammar_section_name: `Section ${section}`,
  grammar_ui_topics: ["verben"], content_topic: "E2E", model: "e2e", order_number: n,
  text: `MARK_${section}_${n} Das Ergebnis [1] wichtig.`,
  gaps: [{ no: 1, correct: "ist", distractors: ["war", "wird", "wäre"], explanation: "E2E." }],
});

function fakeApi(body: { grammarSection?: string; exclude?: string[]; limit?: number }) {
  const section = body.grammarSection && SECTIONS[body.grammarSection] ? body.grammarSection : "s1";
  const { exercises, starters } = SECTIONS[section];
  const order = [...starters, ...exercises.filter((n) => !starters.includes(n))];
  const exclude = new Set(body.exclude || []);
  return order.map((n) => exercise(section, n)).filter((e) => !exclude.has(e.id)).slice(0, body.limit || 5);
}

const shown = async (page: Page) =>
  (await page.getByText(/MARK_\w+_\d/).first().innerText({ timeout: 15_000 })).match(/MARK_(\w+_\d)/)![1];

async function solveAndNext(page: Page) {
  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "ist", exact: true }).click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await page.getByRole("button", { name: "Nächste Übung" }).click();
}

/** Switch section inside the app, like the settings dialog does (no reload, the session stays). */
async function switchSection(page: Page, section: string) {
  await page.evaluate((s) => {
    window.history.pushState({}, "", `/exercise?level=a1&section=verben&grammar=${s}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, section);
}

test("starters first, then the rest; a section switched to again starts with its starters", async ({ page }) => {
  await page.route("**/api/exercises**", (route: Route) => {
    const body = route.request().method() === "POST" ? route.request().postDataJSON() : {};
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ exercises: fakeApi(body) }) });
  });
  await page.goto("/exercise?level=a1&section=verben&grammar=s1", { waitUntil: "domcontentloaded" });

  // s1: the starters 3 and 1, then the other exercises
  await expect.poll(() => shown(page)).toBe("s1_3");
  await solveAndNext(page);
  await expect.poll(() => shown(page)).toBe("s1_1");
  await solveAndNext(page);
  expect(["s1_2", "s1_4"]).toContain(await shown(page));

  // switching to s2 starts with its starter
  await switchSection(page, "s2");
  await expect.poll(() => shown(page)).toBe("s2_2");

  // switching back to s1 in the same visit: its starters come first again
  await switchSection(page, "s1");
  await expect.poll(() => shown(page)).toBe("s1_3");
});
