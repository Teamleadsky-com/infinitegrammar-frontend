import { describe, it, expect } from 'vitest';
import {
  balancedAccuracyCI, balancedAccuracyDiffCI, compareTables, forAt, formatInterval, formatP, formatRate, mcnemarExactP,
  MCNEMAR_MIN_DISCORDANT, outcome, pairedDiffCI, paretoFrontier, ppvAt, rateWithN, verdictLabel, verdictRight, wilson,
} from './bench';

describe('rateWithN', () => {
  it('shows a rate with its n', () => {
    expect(rateWithN(94.4, 18)).toBe('94.4% (n = 18)');
    expect(rateWithN(16.7, 6)).toBe('16.7% (n = 6)');
    expect(rateWithN(50, 2)).toBe('50% (n = 2)');
    expect(rateWithN(null, 6)).toBe('–');
    expect(rateWithN(40, 0)).toBe('–');
    expect(formatRate(null)).toBe('–');
  });
});

describe('wilson', () => {
  it('matches the Wilson score interval', () => {
    // pilot recall 17 / 18
    const [lo, hi] = wilson(17, 18)!;
    expect(lo).toBeCloseTo(0.7424, 3);
    expect(hi).toBeCloseTo(0.9901, 3);
    expect(formatInterval([lo, hi])).toBe('74–99%');
    // 0 of 6 and 6 of 6 stay inside [0, 1]
    expect(wilson(0, 6)![0]).toBe(0);
    expect(wilson(0, 6)![1]).toBeCloseTo(0.3903, 3);
    expect(wilson(6, 6)![1]).toBe(1);
    expect(wilson(3, 0)).toBeNull();
  });

  it('balanced accuracy interval contains the estimate', () => {
    const [lo, hi] = balancedAccuracyCI(17, 18, 1, 6)!;
    const ba = (17 / 18 + 5 / 6) / 2;
    expect(lo).toBeLessThan(ba);
    expect(hi).toBeGreaterThan(ba);
    expect(hi).toBeLessThanOrEqual(1);
    expect(balancedAccuracyCI(1, 0, 0, 6)).toBeNull();
  });
});

describe('prevalence-adjusted precision and false omission rate', () => {
  it('matches the views at 20% and 50% flawed', () => {
    // pilot: TPR 17/18, FPR 1/6 → v_bench_runs precision_at_20_pct 58.6, precision_at_50_pct 85.0
    expect(100 * ppvAt(0.2, 17 / 18, 1 / 6)!).toBeCloseTo(58.6, 1);
    expect(100 * ppvAt(0.5, 17 / 18, 1 / 6)!).toBeCloseTo(85.0, 1);
    // accepted items that are flawed at 20%: 0.2·(1/18) / (0.2·(1/18) + 0.8·(5/6))
    expect(forAt(0.2, 17 / 18, 1 / 6)!).toBeCloseTo(0.01111 / (0.01111 + 0.66667), 4);
    expect(ppvAt(0.2, 0, 0)).toBeNull();
    expect(forAt(0.2, null, 0.1)).toBeNull();
  });
});

describe('mcnemarExactP', () => {
  it('matches the exact binomial formula', () => {
    // n = 10, k = 1: 2 * (1 + 10) / 1024
    expect(mcnemarExactP(9, 1)).toBeCloseTo(22 / 1024, 10);
    expect(mcnemarExactP(1, 9)).toBeCloseTo(22 / 1024, 10);
    // n = 6, k = 0: 2 / 64
    expect(mcnemarExactP(6, 0)).toBeCloseTo(2 / 64, 10);
  });

  it('is 1 without a difference and capped at 1', () => {
    expect(mcnemarExactP(0, 0)).toBe(1);
    expect(mcnemarExactP(3, 3)).toBe(1);
    expect(mcnemarExactP(1, 0)).toBe(1);
  });

  it('needs at least six one-sided discordant items', () => {
    expect(mcnemarExactP(MCNEMAR_MIN_DISCORDANT, 0)).toBeLessThan(0.05);
    expect(mcnemarExactP(MCNEMAR_MIN_DISCORDANT - 1, 0)).toBeGreaterThan(0.05);
  });

  it('stays accurate for large counts', () => {
    const p = mcnemarExactP(70, 30);
    expect(p).toBeGreaterThan(0.00005);
    expect(p).toBeLessThan(0.0001);
    expect(formatP(p)).toBe('p < 0.001');
    expect(formatP(0.0312)).toBe('p = 0.03');
    expect(formatP(0.0049)).toBe('p = 0.005');
  });
});

describe('pairedDiffCI', () => {
  it('matches Newcombe (1998), method 10', () => {
    // Newcombe's example: e = 36 both, f = 12 first only, g = 2 second only, h = 0 → 0.0569 to 0.3404
    const [lo, hi] = pairedDiffCI({ both: 36, bOnly: 12, aOnly: 2, neither: 0, n: 50 })!;
    expect(lo).toBeCloseTo(0.0569, 3);
    expect(hi).toBeCloseTo(0.3404, 3);
    expect(formatInterval([lo, hi], true)).toBe('+6 to +34 pp');
  });

  it('is symmetric around zero for identical runs and null without items', () => {
    const [lo, hi] = pairedDiffCI({ both: 17, bOnly: 0, aOnly: 0, neither: 1, n: 18 })!;
    expect(lo).toBeLessThan(0);
    expect(hi).toBeGreaterThan(0);
    expect(pairedDiffCI({ both: 0, bOnly: 0, aOnly: 0, neither: 0, n: 0 })).toBeNull();
    expect(formatInterval([-0.12, 0.3], true)).toBe('−12 to +30 pp');
  });

  it('balanced accuracy change: B catches one more flawed item and rejects one more clean one', () => {
    const planted = { both: 17, bOnly: 1, aOnly: 0, neither: 0, n: 18 };
    const clean = { both: 1, bOnly: 1, aOnly: 0, neither: 4, n: 6 };
    const [lo, hi] = balancedAccuracyDiffCI(planted, clean)!;
    const d = (1 / 18 - 1 / 6) / 2;
    expect(lo).toBeLessThan(d);
    expect(hi).toBeGreaterThan(d);
  });
});

describe('verdicts', () => {
  it('a planted item should be rejected, a clean one accepted', () => {
    expect(verdictRight('P2', true)).toBe(true);
    expect(verdictRight('P2', false)).toBe(false);
    expect(verdictRight('clean', false)).toBe(true);
    expect(verdictRight('clean', true)).toBe(false);
    expect(outcome('P2', true)).toBe('TP');
    expect(outcome('P2', false)).toBe('FN');
    expect(outcome('clean', true)).toBe('FP');
    expect(outcome('clean', false)).toBe('TN');
    expect(verdictLabel('P7', false)).toBe('FN · missed');
    expect(verdictLabel('clean', true)).toBe('FP · clean rejected');
  });

  it('builds the 2×2 tables of two runs', () => {
    const rows = [
      { attempt_id: '1', planted_type: 'P1', a_rejected: false, b_rejected: true },
      { attempt_id: '2', planted_type: 'P1', a_rejected: true, b_rejected: true },
      { attempt_id: '3', planted_type: 'P2', a_rejected: true, b_rejected: false },
      { attempt_id: '4', planted_type: 'clean', a_rejected: true, b_rejected: false },
      { attempt_id: '5', planted_type: 'clean', a_rejected: false, b_rejected: false },
    ];
    expect(compareTables(rows)).toEqual({
      planted: { both: 1, aOnly: 1, bOnly: 1, neither: 0, n: 3 },
      clean: { both: 0, aOnly: 1, bOnly: 0, neither: 1, n: 2 },
    });
  });
});

describe('paretoFrontier', () => {
  it('keeps the setups no other is both cheaper and more accurate than', () => {
    const xs = [
      { id: 'a', cost: 0.1, ba: 88 },
      { id: 'b', cost: 0.2, ba: 92 },
      { id: 'c', cost: 0.25, ba: 90 }, // dominated by b
      { id: 'd', cost: 0.1, ba: 80 }, // dominated by a
      { id: 'e', cost: null, ba: 99 },
    ];
    const f = paretoFrontier(xs, (x) => x.cost, (x) => x.ba);
    expect([...f].map((x) => x.id).sort()).toEqual(['a', 'b']);
  });
});
