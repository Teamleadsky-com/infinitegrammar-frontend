/**
 * Helpers of the admin Verifier benchmark tab (generator spec §5.6). The benchmark is a meta-evaluation of the
 * pipeline's LLM judges: the positive class is a flawed exercise and a rejection is a positive prediction.
 * Rates with 95% Wilson intervals, precision and false omission rate at a chosen prevalence, the exact
 * McNemar test and Newcombe's interval for two setups on the same items, and confusion-matrix outcomes.
 */

export type Interval = [number, number];

const Z = 1.959964; // two-sided 95%

/** A rate with its sample size, e.g. "83% (n = 18)"; "–" without a sample. */
export const rateWithN = (pct: number | null | undefined, n: number | null | undefined): string => {
  if (pct === null || pct === undefined || !n) return "–";
  return `${formatRate(pct)} (n = ${n})`;
};

/** "94.4%", "50%"; one decimal unless the rate is whole. */
export const formatRate = (pct: number | null | undefined): string => {
  if (pct === null || pct === undefined || Number.isNaN(pct)) return "–";
  return `${Math.abs(pct - Math.round(pct)) < 0.05 ? String(Math.round(pct)) : pct.toFixed(1)}%`;
};

/** 95% Wilson score interval of k successes in n, as fractions; null without a sample. */
export const wilson = (k: number, n: number): Interval | null => {
  if (!n) return null;
  const p = k / n;
  const z2 = Z * Z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const half = (Z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return [Math.max(0, center - half), Math.min(1, center + half)];
};

/** An interval as whole percentages, "74–99%"; with signed = true "−12 to +30 pp". */
export const formatInterval = (ci: Interval | null, signed = false): string => {
  if (!ci) return "–";
  if (!signed) return `${Math.round(ci[0] * 100)}–${Math.round(ci[1] * 100)}%`;
  const s = (x: number) => {
    const r = Math.round(x * 100);
    return r > 0 ? `+${r}` : r < 0 ? `−${-r}` : "0";
  };
  return `${s(ci[0])} to ${s(ci[1])} pp`;
};

/**
 * 95% interval of balanced accuracy (TPR + TNR) / 2 from tp of nPos flawed and fp of nNeg clean items:
 * Wilson intervals of TPR and TNR combined by MOVER (Zou & Donner), as the two samples are independent.
 */
export const balancedAccuracyCI = (tp: number, nPos: number, fp: number, nNeg: number): Interval | null => {
  const a = wilson(tp, nPos);
  const b = wilson(nNeg - fp, nNeg);
  if (!a || !b) return null;
  const tpr = tp / nPos;
  const tnr = (nNeg - fp) / nNeg;
  const lo = tpr + tnr - Math.hypot(tpr - a[0], tnr - b[0]);
  const hi = tpr + tnr + Math.hypot(a[1] - tpr, b[1] - tnr);
  return [Math.max(0, lo / 2), Math.min(1, hi / 2)];
};

/** Precision (PPV) if a share `prevalence` of the checked exercises were flawed: rejected items that are flawed. */
export const ppvAt = (prevalence: number, tpr: number | null, fpr: number | null): number | null => {
  if (tpr === null || fpr === null) return null;
  const d = prevalence * tpr + (1 - prevalence) * fpr;
  return d > 0 ? (prevalence * tpr) / d : null;
};

/** False omission rate if a share `prevalence` were flawed: accepted items that are flawed (they reach learners). */
export const forAt = (prevalence: number, tpr: number | null, fpr: number | null): number | null => {
  if (tpr === null || fpr === null) return null;
  const d = prevalence * (1 - tpr) + (1 - prevalence) * (1 - fpr);
  return d > 0 ? (prevalence * (1 - tpr)) / d : null;
};

/** log of n choose k, exact enough for n up to a few thousand */
const logChoose = (n: number, k: number): number => {
  let s = 0;
  for (let i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i);
  return s;
};

/**
 * Exact two-sided McNemar p value from the discordant counts: b = only B right/flagged, c = only A.
 * With n = b + c and k = min(b, c): p = min(1, 2 · Σ_{i=0..k} C(n, i) / 2ⁿ). No discordant pairs: p = 1.
 */
export const mcnemarExactP = (b: number, c: number): number => {
  const n = b + c;
  if (n === 0) return 1;
  const k = Math.min(b, c);
  let sum = 0;
  for (let i = 0; i <= k; i++) sum += Math.exp(logChoose(n, i) - n * Math.LN2);
  return Math.min(1, 2 * sum);
};

/** Fewest discordant items, all in one direction, that the exact McNemar test can call significant (p < 0.05). */
export const MCNEMAR_MIN_DISCORDANT = 6;

export const formatP = (p: number): string => (p < 0.001 ? "p < 0.001" : `p = ${p.toFixed(p < 0.01 ? 3 : 2)}`);

/** A 2×2 table of two runs on the same items: both rejected, only A, only B, neither. */
export type PairTable = { both: number; aOnly: number; bOnly: number; neither: number; n: number };

/**
 * 95% interval of the paired difference pB − pA (Newcombe 1998, method 10: Wilson intervals of both proportions
 * with the phi correlation of the pairs), where pA = (both + aOnly) / n and pB = (both + bOnly) / n.
 */
export const pairedDiffCI = ({ both: e, aOnly: g, bOnly: f, neither: h, n }: PairTable): Interval | null => {
  if (!n) return null;
  const p1 = (e + f) / n;
  const p2 = (e + g) / n;
  const w1 = wilson(e + f, n)!;
  const w2 = wilson(e + g, n)!;
  const den = Math.sqrt((e + f) * (g + h) * (e + g) * (f + h));
  const phi = den > 0 ? (e * h - f * g) / den : 0;
  const theta = p1 - p2;
  const d = Math.sqrt(Math.max(0, (p1 - w1[0]) ** 2 - 2 * phi * (p1 - w1[0]) * (w2[1] - p2) + (w2[1] - p2) ** 2));
  const eps = Math.sqrt(Math.max(0, (w1[1] - p1) ** 2 - 2 * phi * (w1[1] - p1) * (p2 - w2[0]) + (p2 - w2[0]) ** 2));
  return [Math.max(-1, theta - d), Math.min(1, theta + eps)];
};

/**
 * 95% interval of the change in balanced accuracy B − A: half the sum of the change in TPR and the change in
 * TNR (= minus the change in FPR), their Newcombe intervals combined by MOVER (flawed and clean items are
 * independent samples).
 */
export const balancedAccuracyDiffCI = (planted: PairTable, clean: PairTable): Interval | null => {
  const t = pairedDiffCI(planted);
  const f = pairedDiffCI(clean);
  if (!t || !f || !planted.n || !clean.n) return null;
  const dT = (planted.bOnly - planted.aOnly) / planted.n;
  const dN = -(clean.bOnly - clean.aOnly) / clean.n; // change in TNR
  const nLo = -f[1];
  const nHi = -f[0];
  const lo = dT + dN - Math.hypot(dT - t[0], dN - nLo);
  const hi = dT + dN + Math.hypot(t[1] - dT, nHi - dN);
  return [lo / 2, hi / 2];
};

export type Outcome = "TP" | "FN" | "FP" | "TN";

/** Confusion-matrix cell of a verdict: positive = a flawed (planted) item, predicted positive = rejected. */
export const outcome = (plantedType: string, rejected: boolean): Outcome =>
  plantedType === "clean" ? (rejected ? "FP" : "TN") : rejected ? "TP" : "FN";

export const OUTCOME_LABELS: Record<Outcome, string> = {
  TP: "caught",
  FN: "missed",
  FP: "clean rejected",
  TN: "clean accepted",
};

/** A planted item should be rejected and a clean one accepted. */
export const verdictRight = (plantedType: string, rejected: boolean): boolean =>
  plantedType === "clean" ? !rejected : rejected;

/** What a verdict means for this item, e.g. "FN · missed". */
export const verdictLabel = (plantedType: string, rejected: boolean): string => {
  const o = outcome(plantedType, rejected);
  return `${o} · ${OUTCOME_LABELS[o]}`;
};

export type CompareRow = { attempt_id: string; planted_type: string; a_rejected: boolean; b_rejected: boolean };

/** The 2×2 tables of two runs on the same items, for planted and for clean items (cells count rejections). */
export const compareTables = (rows: CompareRow[]) => {
  const empty = (): PairTable => ({ both: 0, aOnly: 0, bOnly: 0, neither: 0, n: 0 });
  const out = { planted: empty(), clean: empty() };
  for (const r of rows) {
    const t = r.planted_type === "clean" ? out.clean : out.planted;
    t.n++;
    if (r.a_rejected && r.b_rejected) t.both++;
    else if (r.a_rejected) t.aOnly++;
    else if (r.b_rejected) t.bOnly++;
    else t.neither++;
  }
  return out;
};

/** Setups on the cost–accuracy frontier: no other setup is at least as cheap and at least as accurate, and better in one. */
export const paretoFrontier = <T,>(xs: T[], cost: (x: T) => number | null, score: (x: T) => number | null): Set<T> => {
  const ok = xs.filter((x) => cost(x) !== null && score(x) !== null);
  return new Set(
    ok.filter((x) => !ok.some((y) => y !== x && cost(y)! <= cost(x)! && score(y)! >= score(x)! && (cost(y)! < cost(x)! || score(y)! > score(x)!))),
  );
};
