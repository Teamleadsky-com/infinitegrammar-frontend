/**
 * Pure helpers of the admin Pipeline trace tab (generator spec §5.5): labels, formatting,
 * the exercise-version diff, prompt placeholders and a small Markdown parser for rules texts.
 */

// ---------------------------------------------------------------------------
// Verdicts and labels
// ---------------------------------------------------------------------------

export type Verdict = "passed" | "retry" | "failed" | "done" | "error" | "pending" | "unknown";

/** Verdict groups behind the counts (passed = passed + done; other = error, pending, unknown). */
export const VERDICTS = {
  passed: ["passed", "done"],
  retry: ["retry"],
  failed: ["failed"],
  other: ["error", "pending", "unknown"],
} as const;

export type VerdictGroup = keyof typeof VERDICTS;

export const verdictGroup = (verdict: string): VerdictGroup =>
  verdict === "passed" || verdict === "done"
    ? "passed"
    : verdict === "retry"
      ? "retry"
      : verdict === "failed"
        ? "failed"
        : "other";

export const VERDICT_HELP: Record<Verdict, string> = {
  passed: "Passed the check.",
  retry: "Sent to the next iteration of the same stage.",
  failed: "Rejected here.",
  done: "A writing step: nothing was checked.",
  error: "Repeated API errors: the attempt was skipped. Never a quality verdict.",
  pending: "The run is unfinished.",
  unknown: "The run's records don't say (only the earliest strategy experiments).",
};

const ITERATION_LABELS: Record<string, { first: string; next?: (k: number) => string; short: [string, (k: number) => string] }> = {
  premise: {
    first: "Scene premise: the model writes 5 scenes; local rules pick one",
    short: ["Scene premise", (k) => `Iteration ${k}`],
  },
  generation: {
    first: "First draft",
    next: (k) => `Regeneration ${k} (old strategy S-a only)`,
    short: ["First draft", (k) => `Regeneration ${k}`],
  },
  novelty: {
    first: "Similarity check (rules, no model)",
    next: () => "Re-draft from the second scene (not checked again)",
    short: ["Similarity check", () => "Re-draft"],
  },
  gap_checks: {
    first: "Verifier: L1 format rules → solver pair + judge → adjudicator on disputed gaps",
    next: (k) => `Gap repair ${k} → full re-check → strict G3 of the repaired gaps`,
    short: ["First check", (k) => `Repair ${k}`],
  },
  distractor_gate: {
    first: "G7 distractor gate",
    next: (k) => `Repair ${k} → re-check (old candidate config only)`,
    short: ["G7 check", (k) => `Repair ${k}`],
  },
  coherence: {
    first: "G6 text coherence",
    next: (k) => `Text repair ${k} → gap checks → G6`,
    short: ["G6 check", (k) => `Text repair ${k}`],
  },
  final_gate: {
    first: "Final gate (senior-editor model)",
    next: (k) => `Repair ${k} → gap checks → G6 → gate`,
    short: ["Gate", (k) => `Repair ${k}`],
  },
};

/** What an iteration of a stage runs (spec §5.5.3 table). */
export const iterationLabel = (stage: string, iteration: number): string => {
  const l = ITERATION_LABELS[stage];
  if (!l) return iteration === 0 ? "Iteration 0" : `Iteration ${iteration}`;
  if (iteration === 0) return l.first;
  return l.next ? l.next(iteration) : `Iteration ${iteration}`;
};

export const shortIterationLabel = (stage: string, iteration: number): string => {
  const l = ITERATION_LABELS[stage];
  if (!l) return `Iteration ${iteration}`;
  return iteration === 0 ? l.short[0] : l.short[1](iteration);
};

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** Attempt id without the run prefix ("refill_20261009:praesens_grundform:21" → "praesens_grundform:21"). */
export const shortAttemptId = (attemptId: string, runId: string) =>
  attemptId.startsWith(`${runId}:`) ? attemptId.slice(runId.length + 1) : attemptId;

export const NO_TIME = "–";

/** Share of a total as a whole percentage; "–" without a total, "<1%" for small non-zero shares. */
export const pctOf = (n: number | null | undefined, total: number | null | undefined): string => {
  if (n === null || n === undefined || !total) return NO_TIME;
  const p = (100 * n) / total;
  if (p > 0 && p < 1) return "<1%";
  return `${Math.round(p)}%`;
};

/** Durations of stages, iterations and steps: "45 s", "12 min", "2 h 05 min"; "–" when unknown. */
export const formatSeconds = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return NO_TIME;
  if (seconds < 90) return `${Math.round(seconds)} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min`;
};

/** Run duration as h:mm. */
export const formatHmm = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return NO_TIME;
  const minutes = Math.round(seconds / 60);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
};

export const formatTokens = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return NO_TIME;
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
};

/** Step and attempt costs are often fractions of a cent. */
export const formatCost = (usd: number | null | undefined): string => {
  if (usd === null || usd === undefined || Number.isNaN(usd)) return NO_TIME;
  if (usd === 0) return "$0";
  if (Math.abs(usd) < 0.01) return `$${usd.toFixed(4)}`;
  if (Math.abs(usd) < 0.1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
};

// ---------------------------------------------------------------------------
// Exercise versions
// ---------------------------------------------------------------------------

export type TraceGap = { no: number; correct: string; distractors?: string[]; explanation?: string };
export type TraceExercise = { text: string; gaps: TraceGap[] };

/** Sentences of an exercise text, keeping their trailing punctuation, quotes and spaces. */
export const splitSentences = (text: string): string[] =>
  text.match(/[^.!?…]+(?:[.!?…]+["“”»«„’]*|$)\s*/g) || (text ? [text] : []);

export type ExerciseDiff = {
  /** gap number -> what changed */
  gaps: Record<number, Array<"correct" | "distractors" | "explanation" | "added">>;
  /** sentences of `current` (trimmed) that are not in `other` */
  changedSentences: Set<string>;
};

/** What `current` changed compared with `other`: gaps by number, sentences by text. */
export const diffExercise = (current: TraceExercise, other: TraceExercise): ExerciseDiff => {
  const before = new Map(other.gaps.map((g) => [g.no, g]));
  const gaps: ExerciseDiff["gaps"] = {};
  for (const g of current.gaps) {
    const o = before.get(g.no);
    const changes: ExerciseDiff["gaps"][number] = [];
    if (!o) changes.push("added");
    else {
      if ((o.correct || "") !== (g.correct || "")) changes.push("correct");
      if ((o.distractors || []).join("\u0000") !== (g.distractors || []).join("\u0000")) changes.push("distractors");
      if ((o.explanation || "").trim() !== (g.explanation || "").trim()) changes.push("explanation");
    }
    if (changes.length) gaps[g.no] = changes;
  }
  const otherSentences = new Set(splitSentences(other.text).map((s) => s.trim()));
  const changedSentences = new Set(
    splitSentences(current.text).map((s) => s.trim()).filter((s) => s && !otherSentences.has(s)),
  );
  return { gaps, changedSentences };
};

export const exercisesDiffer = (a: TraceExercise | null | undefined, b: TraceExercise | null | undefined) =>
  !!a && !!b && JSON.stringify(a) !== JSON.stringify(b);

// ---------------------------------------------------------------------------
// Prompts and rules
// ---------------------------------------------------------------------------

/**
 * Splits a prompt template into text and placeholders ({grammar_section}, {failing gaps}, ...).
 * JSON examples in a prompt ({"text": ...}) are not placeholders: no quotes or colons inside.
 */
export const splitPlaceholders = (prompt: string): Array<{ text: string; placeholder: boolean }> => {
  const parts: Array<{ text: string; placeholder: boolean }> = [];
  const re = /\{[^{}"\n:]{1,80}\}/g;
  let last = 0;
  for (let m = re.exec(prompt); m; m = re.exec(prompt)) {
    if (m.index > last) parts.push({ text: prompt.slice(last, m.index), placeholder: false });
    parts.push({ text: m[0], placeholder: true });
    last = m.index + m[0].length;
  }
  if (last < prompt.length) parts.push({ text: prompt.slice(last), placeholder: false });
  return parts;
};

export type MdBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "code"; text: string };

const tableCells = (line: string) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));

/** Block-level Markdown as used in rules_text: headings, paragraphs, lists, pipe tables, fenced code. */
export const parseMarkdown = (md: string): MdBlock[] => {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const isFence = (i: number) => lines[i].trim().startsWith("```");
  const isHeading = (i: number) => /^#{1,6}\s/.test(lines[i]);
  const isTable = (i: number) => lines[i].trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1]);
  const isItem = (i: number) => /^\s*([-*]|\d+\.)\s+/.test(lines[i]);
  const blocks: MdBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) {
      i++;
    } else if (isFence(i)) {
      const body: string[] = [];
      for (i++; i < lines.length && !isFence(i); i++) body.push(lines[i]);
      i++;
      blocks.push({ type: "code", text: body.join("\n") });
    } else if (isHeading(i)) {
      const [, hashes, text] = lines[i].match(/^(#{1,6})\s+(.*)$/)!;
      blocks.push({ type: "heading", level: hashes.length, text: text.trim() });
      i++;
    } else if (isTable(i)) {
      const header = tableCells(lines[i]);
      const rows: string[][] = [];
      for (i += 2; i < lines.length && lines[i].trim().startsWith("|"); i++) rows.push(tableCells(lines[i]));
      blocks.push({ type: "table", header, rows });
    } else if (isItem(i)) {
      const items: string[] = [];
      for (; i < lines.length && lines[i].trim() && !isFence(i) && !isHeading(i) && !isTable(i); i++) {
        if (isItem(i)) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        else items[items.length - 1] += ` ${lines[i].trim()}`;
      }
      blocks.push({ type: "list", items });
    } else {
      const para: string[] = [];
      for (; i < lines.length && lines[i].trim() && !isFence(i) && !isHeading(i) && !isTable(i) && !isItem(i); i++) {
        para.push(lines[i].trim());
      }
      blocks.push({ type: "paragraph", text: para.join(" ") });
    }
  }
  return blocks;
};

export type MdInline = { text: string; style?: "code" | "bold" | "italic" };

/** Inline Markdown: `code`, **bold**, *italic*. */
export const parseInline = (text: string): MdInline[] => {
  const out: MdInline[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ text: m[1], style: "code" });
    else if (m[2] !== undefined) out.push({ text: m[2], style: "bold" });
    else out.push({ text: m[3], style: "italic" });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
};
