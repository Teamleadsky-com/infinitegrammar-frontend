import { expect, test, type Page, type Route } from "@playwright/test";

// Section progression on the exercise page, against a small fake of POST /api/exercises that
// follows its contract (curriculum order of sections; `exclude` never returned; `limit`):
// a finished section continues with the next section of the same level, a finished level with
// the next level, and after the last level the curriculum starts over with A1's first section.
// No exercise is shown twice.

// Two exercises per section; A1, B1 and C1 have two sections, A2 and B2 none (to keep it short).
const CURRICULUM: Record<string, string[]> = {
  A1: ["a1_first", "a1_second"],
  A2: [],
  B1: ["b1_first", "b1_second"],
  B2: [],
  C1: ["c1_first", "c1_second"],
};
const PER_SECTION = 2;

const exercise = (level: string, sectionId: string, n: number) => ({
  id: `${sectionId}-${n}`,
  level,
  grammar_section_id: sectionId,
  grammar_section_name: `Section ${sectionId}`,
  grammar_ui_topics: ["verben"],
  content_topic: "E2E",
  model: "e2e",
  order_number: n,
  text: `MARK_${sectionId}_${n} Das Ergebnis [1] wichtig.`,
  gaps: [{ no: 1, correct: "ist", distractors: ["war", "wird", "wäre"], explanation: "E2E." }],
});

function fakeExercisesApi(body: { level: string; grammarSection?: string; afterSection?: string; exclude?: string[]; limit?: number }) {
  const sections = CURRICULUM[body.level] || [];
  let order = sections;
  if (body.grammarSection) order = sections.filter((s) => s === body.grammarSection);
  else if (body.afterSection) {
    const i = sections.indexOf(body.afterSection);
    order = [...sections.slice(i + 1), ...sections.slice(0, i + 1)];
  }
  const exclude = new Set(body.exclude || []);
  return order
    .flatMap((s) => Array.from({ length: PER_SECTION }, (_, k) => exercise(body.level, s, k + 1)))
    .filter((e) => !exclude.has(e.id))
    .slice(0, body.limit || 5);
}

async function setUp(page: Page, start: string) {
  await page.route("**/api/exercises**", (route: Route) => {
    const body = route.request().method() === "POST" ? route.request().postDataJSON() : {};
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ exercises: fakeExercisesApi(body) }) });
  });
  await page.goto(start, { waitUntil: "domcontentloaded" });
}

/** The marker of the exercise on screen, e.g. "b1_first_2". */
const shown = async (page: Page) => {
  const text = await page.getByText(/MARK_\w+_\d/).first().innerText({ timeout: 15_000 });
  return text.match(/MARK_(\w+_\d)/)![1];
};

async function solveAndNext(page: Page) {
  await page.getByRole("button", { name: "___" }).click();
  await page.getByRole("button", { name: "ist", exact: true }).click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await page.getByRole("button", { name: "Nächste Übung" }).click();
}

test("sections continue in order, levels move up, and after the last level it starts over with A1", async ({ page }) => {
  await setUp(page, "/exercise?level=b1&section=verben&grammar=b1_first");

  const sequence: string[] = [await shown(page)];
  for (let i = 0; i < 6; i++) {
    const before = sequence[sequence.length - 1];
    await solveAndNext(page);
    await expect.poll(() => shown(page)).not.toBe(before);
    sequence.push(await shown(page));
  }

  expect(sequence).toEqual([
    "b1_first_1", "b1_first_2",   // the chosen section
    "b1_second_1", "b1_second_2", // next section of the same level
    "c1_first_1", "c1_first_2",   // B1 done (B2 has none): the next level
    "c1_second_1",
  ]);
  expect(new Set(sequence).size).toBe(sequence.length);
  await expect(page).toHaveURL(/level=c1/);
  await expect(page).toHaveURL(/grammar=c1_second/);

  // finishing C1, the last level, starts over with the first A1 section
  await solveAndNext(page);
  await solveAndNext(page);
  await expect.poll(() => shown(page)).toBe("a1_first_1");
  await expect(page.getByText("Alle Niveaus geschafft! Weiter mit A1").first()).toBeVisible();
  await expect(page).toHaveURL(/level=a1/);
});

test("the last exercise of a section is not repeated: the next section follows", async ({ page }) => {
  await setUp(page, "/exercise?level=a1&section=verben&grammar=a1_first");
  await expect.poll(() => shown(page)).toBe("a1_first_1");
  await solveAndNext(page);
  await expect.poll(() => shown(page)).toBe("a1_first_2");
  await solveAndNext(page);
  await expect.poll(() => shown(page)).toBe("a1_second_1");
  await expect(page.getByText("Nächster Abschnitt").first()).toBeVisible();
});
