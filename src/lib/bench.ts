/**
 * Helpers of the admin Verifier benchmark tab (generator spec §5.6): rates with their n, the exact
 * McNemar test for two setups on the same items, and whether a verdict was right.
 */

/** A rate with its sample size, e.g. "83% (n = 18)"; "–" without a sample. */
export const rateWithN = (pct: number | null | undefined, n: number | null | undefined): string => {
  if (pct === null || pct === undefined || !n) return "–";
  const rounded = Math.abs(pct - Math.round(pct)) < 0.05 ? String(Math.round(pct)) : pct.toFixed(1);
  return `${rounded}% (n = ${n})`;
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

export const formatP = (p: number): string => (p < 0.001 ? "p < 0.001" : `p = ${p.toFixed(p < 0.01 ? 3 : 2)}`);

/** A planted item should be rejected and a clean one accepted. */
export const verdictRight = (plantedType: string, rejected: boolean): boolean =>
  plantedType === "clean" ? !rejected : rejected;

/** What a verdict means for this item. */
export const verdictLabel = (plantedType: string, rejected: boolean): string =>
  plantedType === "clean" ? (rejected ? "false reject" : "correct") : rejected ? "caught" : "missed";

export type CompareRow = { attempt_id: string; planted_type: string; a_rejected: boolean; b_rejected: boolean };

/** Discordant counts of two runs on the same items: planted (caught by one only) and clean (rejected by one only). */
export const compareCounts = (rows: CompareRow[]) => {
  const out = { plantedBOnly: 0, plantedAOnly: 0, cleanBOnly: 0, cleanAOnly: 0, planted: 0, clean: 0 };
  for (const r of rows) {
    if (r.planted_type === "clean") {
      out.clean++;
      if (r.b_rejected && !r.a_rejected) out.cleanBOnly++;
      if (r.a_rejected && !r.b_rejected) out.cleanAOnly++;
    } else {
      out.planted++;
      if (r.b_rejected && !r.a_rejected) out.plantedBOnly++;
      if (r.a_rejected && !r.b_rejected) out.plantedAOnly++;
    }
  }
  return out;
};
