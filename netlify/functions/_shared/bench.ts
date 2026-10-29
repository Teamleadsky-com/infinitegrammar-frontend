/** Shared by the verifier benchmark functions (admin-bench-*). */

import { num } from './db';

/** A row of v_bench_type_metrics */
export const typeMetric = (t: any) => ({
  type: t.planted_type,
  label: t.type_label,
  order: t.type_order,
  n: t.n,
  rejected: t.rejected,
  rejectedPct: num(t.rejected_pct),
  rejectedExpected: t.rejected_expected,
  nWithGap: t.n_with_gap,
  atGap: t.at_gap,
});
