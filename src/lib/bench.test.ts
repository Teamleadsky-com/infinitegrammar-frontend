import { describe, it, expect } from 'vitest';
import { compareCounts, formatP, mcnemarExactP, rateWithN, verdictLabel, verdictRight } from './bench';

describe('rateWithN', () => {
  it('shows a rate with its n', () => {
    expect(rateWithN(94.4, 18)).toBe('94.4% (n = 18)');
    expect(rateWithN(16.7, 6)).toBe('16.7% (n = 6)');
    expect(rateWithN(50, 2)).toBe('50% (n = 2)');
    expect(rateWithN(null, 6)).toBe('–');
    expect(rateWithN(40, 0)).toBe('–');
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

  it('stays accurate for large counts', () => {
    const p = mcnemarExactP(70, 30);
    expect(p).toBeGreaterThan(0.00005);
    expect(p).toBeLessThan(0.0001);
    expect(formatP(p)).toBe('p < 0.001');
    expect(formatP(0.0312)).toBe('p = 0.03');
    expect(formatP(0.0049)).toBe('p = 0.005');
  });
});

describe('verdicts', () => {
  it('a planted item should be rejected, a clean one accepted', () => {
    expect(verdictRight('P2', true)).toBe(true);
    expect(verdictRight('P2', false)).toBe(false);
    expect(verdictRight('clean', false)).toBe(true);
    expect(verdictRight('clean', true)).toBe(false);
    expect(verdictLabel('P7', false)).toBe('missed');
    expect(verdictLabel('clean', true)).toBe('false reject');
  });

  it('counts the discordant items of two runs', () => {
    const rows = [
      { attempt_id: '1', planted_type: 'P1', a_rejected: false, b_rejected: true },
      { attempt_id: '2', planted_type: 'P1', a_rejected: true, b_rejected: true },
      { attempt_id: '3', planted_type: 'P2', a_rejected: true, b_rejected: false },
      { attempt_id: '4', planted_type: 'clean', a_rejected: true, b_rejected: false },
      { attempt_id: '5', planted_type: 'clean', a_rejected: false, b_rejected: false },
    ];
    expect(compareCounts(rows)).toEqual({ plantedBOnly: 1, plantedAOnly: 1, cleanBOnly: 0, cleanAOnly: 1, planted: 3, clean: 2 });
  });
});
