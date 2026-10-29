import { ReactNode, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchJson, formatUsd } from "../dashboardShared";
import { IssueCodeChips } from "../trace/TraceBits";
import { formatSeconds } from "@/lib/pipelineTrace";
import {
  balancedAccuracyDiffCI, compareTables, forAt, formatInterval, formatP, formatRate, MCNEMAR_MIN_DISCORDANT, mcnemarExactP,
  pairedDiffCI, PairTable, ppvAt, verdictRight, wilson,
} from "@/lib/bench";
import { BENCH_COLORS, Help, OutcomeBadge, RunKey } from "./BenchBits";
import { runName } from "./BenchCharts";
import { BenchRun, BenchStageMetric, BenchTypeMetric } from "./types";

type Row = {
  attempt_id: string; planted_type: string; level: string | null; sectionId: string | null;
  a_rejected: boolean; b_rejected: boolean; aStages: string[]; bStages: string[]; aCodes: string[]; bCodes: string[];
};
type CompareData = { subsetsDiffer: boolean; subsets: { a: string; b: string }; rows: Row[]; typesA: BenchTypeMetric[]; typesB: BenchTypeMetric[] };

const pp = (x: number | null) => (x === null ? "–" : `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x).toFixed(1).replace(/\.0$/, "")} pp`);
const rate = (t: PairTable, who: "a" | "b") => (t.n ? (t.both + (who === "a" ? t.aOnly : t.bOnly)) / t.n : null);

/** Who the paired test favours: lowerIsBetter for FPR. */
const verdict = (t: PairTable, lowerIsBetter: boolean) => {
  const p = mcnemarExactP(t.bOnly, t.aOnly);
  if (p >= 0.05 || t.bOnly === t.aOnly) return { p, text: "could be chance", tone: "muted" as const };
  const bHigher = t.bOnly > t.aOnly;
  return { p, text: bHigher !== lowerIsBetter ? "B better" : "A better", tone: "strong" as const };
};

/** 2×2 table of the two runs on the same items, the discordant cells (the only ones McNemar uses) outlined. */
const TwoByTwo = ({ title, t, help, lowerIsBetter = false }: { title: string; t: PairTable; help: string; lowerIsBetter?: boolean }) => {
  const C = ({ n, label, discordant }: { n: number; label: string; discordant?: boolean }) => (
    <div className={`p-2 text-center ${discordant ? "bg-amber-50 ring-1 ring-inset ring-amber-300" : "bg-background"}`}>
      <p className="text-lg font-semibold tabular-nums">{n}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
  const v = verdict(t, lowerIsBetter);
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mb-2">{help}</p>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-px bg-border border rounded overflow-hidden text-xs max-w-sm">
        <span className="bg-muted/50 p-2" />
        <span className="bg-muted/50 p-2 font-medium">B rejected</span>
        <span className="bg-muted/50 p-2 font-medium">B accepted</span>
        <span className="bg-muted/50 p-2 font-medium">A rejected</span>
        <C n={t.both} label="both" />
        <C n={t.aOnly} label="A only" discordant />
        <span className="bg-muted/50 p-2 font-medium">A accepted</span>
        <C n={t.bOnly} label="B only" discordant />
        <C n={t.neither} label="neither" />
      </div>
      <p className={`text-sm mt-2 ${v.tone === "strong" ? "font-semibold" : "text-muted-foreground"}`}>
        McNemar exact: {formatP(v.p)} · {v.text}
      </p>
    </div>
  );
};

/** A and B per defect type on one 0–100% track: two dots joined by a line, the gap is the difference. */
const DotRows = ({ typesA, typesB }: { typesA: BenchTypeMetric[]; typesB: BenchTypeMetric[] }) => {
  const byB = Object.fromEntries(typesB.map((t) => [t.type, t]));
  const rows = typesA.map((a) => ({ a, b: byB[a.type] as BenchTypeMetric | undefined }));
  const Row = ({ a, b }: { a: BenchTypeMetric; b?: BenchTypeMetric }) => {
    const pa = a.rejectedPct;
    const pb = b?.rejectedPct ?? null;
    const diff = pa !== null && pb !== null && a.n && b?.n ? 100 * (b.rejected / b.n - a.rejected / a.n) : null;
    const clean = a.type === "clean";
    const better = diff === null || Math.abs(diff) < 0.05 ? null : clean ? diff < 0 : diff > 0;
    return (
      <div className="grid grid-cols-[minmax(9rem,16rem)_1fr_3.5rem_3.5rem_6rem] items-center gap-3 text-sm py-0.5" title={a.label}>
        <span className="truncate"><span className="font-mono text-xs mr-1.5">{a.type}</span><span className="text-muted-foreground">{clean ? "Clean: FPR, lower is better" : a.label}</span></span>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          {pa !== null && pb !== null && (
            <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground/40" style={{ left: `${Math.min(pa, pb)}%`, width: `${Math.abs(pb - pa)}%` }} />
          )}
          {/* A sits a little above the line and B below, so equal values stay visible */}
          {pa !== null && <span className="absolute top-[calc(50%-4px)] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background" style={{ left: `${pa}%`, background: BENCH_COLORS.a }} title={`A: ${a.rejected} of ${a.n}`} />}
          {pb !== null && <span className="absolute top-[calc(50%+4px)] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background" style={{ left: `${pb}%`, background: BENCH_COLORS.b }} title={`B: ${b?.rejected} of ${b?.n}`} />}
        </div>
        <span className="tabular-nums text-right text-xs">{a.rejected}/{a.n}</span>
        <span className="tabular-nums text-right text-xs">{b ? `${b.rejected}/${b.n}` : "–"}</span>
        <span className="tabular-nums text-right text-xs whitespace-nowrap">
          {pp(diff)}
          {better !== null && <span className={better ? "text-green-700 ml-1" : "text-red-700 ml-1"}>{better ? "▲" : "▼"}</span>}
        </span>
      </div>
    );
  };
  return (
    <div className="space-y-0.5">
      <div className="grid grid-cols-[minmax(9rem,16rem)_1fr_3.5rem_3.5rem_6rem] gap-3 text-xs text-muted-foreground pb-1">
        <span>Defect type</span>
        <span className="flex justify-between"><span>0%</span><span>50%</span><span>100%</span></span>
        <span className="text-right">A</span>
        <span className="text-right">B</span>
        <span className="text-right">B − A</span>
      </div>
      {rows.filter((r) => r.a.type !== "clean").map((r) => <Row key={r.a.type} {...r} />)}
      {rows.filter((r) => r.a.type === "clean").map((r) => (
        <div key="clean" className="border-t mt-2 pt-2"><Row {...r} /></div>
      ))}
    </div>
  );
};

/** Two runs on the same benchmark items (spec §5.6.4), compared pairwise. */
export const BenchCompare = ({ apiBase, a, b, prevalence, onOpenItem }: { apiBase: string; a: BenchRun; b: BenchRun; prevalence: number; onOpenItem: (attemptId: string) => void }) => {
  const [data, setData] = useState<CompareData | null>(null);
  const [stages, setStages] = useState<{ a: BenchStageMetric[]; b: BenchStageMetric[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [who, setWho] = useState<"all" | "a" | "b">("all");

  useEffect(() => {
    setData(null);
    setStages(null);
    setError(null);
    fetchJson<CompareData>(`${apiBase}/admin-bench-items?run_id=${encodeURIComponent(a.runId)}&compare=${encodeURIComponent(b.runId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
    const run = (id: string) => fetchJson<{ stages: BenchStageMetric[] }>(`${apiBase}/admin-bench-run?run_id=${encodeURIComponent(id)}`).then((d) => d.stages);
    Promise.all([run(a.runId), run(b.runId)]).then(([sa, sb]) => setStages({ a: sa, b: sb })).catch(() => setStages({ a: [], b: [] }));
  }, [apiBase, a.runId, b.runId]);

  if (error) return <p className="text-sm text-destructive">Could not compare the runs: {error}</p>;
  if (!data) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  const { planted, clean } = compareTables(data.rows);
  const recall = { a: rate(planted, "a"), b: rate(planted, "b") };
  const fpr = { a: rate(clean, "a"), b: rate(clean, "b") };
  const ba = (w: "a" | "b") => (recall[w] === null || fpr[w] === null ? null : (recall[w]! + 1 - fpr[w]!) / 2);
  const vRecall = verdict(planted, false);
  const vFpr = verdict(clean, true);
  const lowPower = planted.aOnly + planted.bOnly < MCNEMAR_MIN_DISCORDANT && clean.aOnly + clean.bOnly < MCNEMAR_MIN_DISCORDANT;
  const discordant = data.rows.filter((r) => r.a_rejected !== r.b_rejected);
  const shown = discordant.filter((r) => who === "all" || verdictRight(r.planted_type, who === "a" ? r.a_rejected : r.b_rejected));
  const ppv = (w: "a" | "b") => ppvAt(prevalence, recall[w], fpr[w]);
  const fo = (w: "a" | "b") => forAt(prevalence, recall[w], fpr[w]);
  const pct = Math.round(prevalence * 100);
  const d = (x: number | null, y: number | null) => (x === null || y === null ? null : 100 * (y - x));
  const more = (n: number, what: string) => (n === 0 ? `the same number of ${what}` : `${Math.abs(n)} ${n > 0 ? "more" : "fewer"} ${what}`);

  const metricRows: Array<{ name: string; help?: ReactNode; a: string; b: string; diff: string; ci?: string; test?: ReactNode }> = [
    {
      name: "Recall (TPR)", help: "Flawed items rejected. Paired on the common items: McNemar uses only the items caught by one run.",
      a: `${formatRate(recall.a === null ? null : 100 * recall.a)} (${planted.both + planted.aOnly}/${planted.n})`,
      b: `${formatRate(recall.b === null ? null : 100 * recall.b)} (${planted.both + planted.bOnly}/${planted.n})`,
      diff: pp(d(recall.a, recall.b)), ci: formatInterval(pairedDiffCI(planted), true),
      test: <span className={vRecall.tone === "strong" ? "font-semibold" : "text-muted-foreground"}>{formatP(vRecall.p)} · {vRecall.text}</span>,
    },
    {
      name: "FPR", help: "Clean items rejected; lower is better.",
      a: `${formatRate(fpr.a === null ? null : 100 * fpr.a)} (${clean.both + clean.aOnly}/${clean.n})`,
      b: `${formatRate(fpr.b === null ? null : 100 * fpr.b)} (${clean.both + clean.bOnly}/${clean.n})`,
      diff: pp(d(fpr.a, fpr.b)), ci: formatInterval(pairedDiffCI(clean), true),
      test: <span className={vFpr.tone === "strong" ? "font-semibold" : "text-muted-foreground"}>{formatP(vFpr.p)} · {vFpr.text}</span>,
    },
    {
      name: "Balanced accuracy", help: "Its interval combines the two paired intervals above (MOVER); no separate test.",
      a: formatRate(ba("a") === null ? null : 100 * ba("a")!), b: formatRate(ba("b") === null ? null : 100 * ba("b")!),
      diff: pp(d(ba("a"), ba("b"))), ci: formatInterval(balancedAccuracyDiffCI(planted, clean), true),
    },
    { name: `PPV @ ${pct}% flawed`, a: formatRate(ppv("a") === null ? null : 100 * ppv("a")!), b: formatRate(ppv("b") === null ? null : 100 * ppv("b")!), diff: pp(d(ppv("a"), ppv("b"))) },
    { name: `FOR @ ${pct}% flawed`, help: "Accepted items that are flawed; lower is better.", a: formatRate(fo("a") === null ? null : 100 * fo("a")!), b: formatRate(fo("b") === null ? null : 100 * fo("b")!), diff: pp(d(fo("a"), fo("b"))) },
    {
      name: "Error attribution", help: "Whole runs: flawed items caught with a code of the planted type.",
      a: `${a.caughtExpected}/${a.planted}`, b: `${b.caughtExpected}/${b.planted}`,
      diff: pp(a.planted && b.planted ? 100 * (b.caughtExpected / b.planted - a.caughtExpected / a.planted) : null),
    },
    {
      name: "$ / item", a: formatUsd(a.usdPerItem), b: formatUsd(b.usdPerItem),
      diff: a.usdPerItem && b.usdPerItem ? `${b.usdPerItem >= a.usdPerItem ? "+" : "−"}$${Math.abs(b.usdPerItem - a.usdPerItem).toFixed(3)} (×${(b.usdPerItem / a.usdPerItem).toFixed(2)})` : "–",
    },
    { name: "Time / item", a: formatSeconds(a.secondsPerItem), b: formatSeconds(b.secondsPerItem), diff: a.secondsPerItem && b.secondsPerItem ? `×${(b.secondsPerItem / a.secondsPerItem).toFixed(2)}` : "–" },
  ];

  const stageA = stages?.a || [];
  const stageB = Object.fromEntries((stages?.b || []).map((s) => [s.stage, s]));

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6 space-y-4">
        <div>
          <h4 className="font-semibold flex flex-wrap items-center gap-x-4 gap-y-1">
            <RunKey color={BENCH_COLORS.a} label={`A: ${runName(a)}`} />
            <RunKey color={BENCH_COLORS.b} label={`B: ${runName(b)}`} />
          </h4>
          <p className="text-sm mt-2">
            On {data.rows.length} common finished items ({planted.n} flawed, {clean.n} clean), B catches {more(planted.bOnly - planted.aOnly, "flawed items")} ({vRecall.text}, {formatP(vRecall.p)})
            {" "}and rejects {more(clean.bOnly - clean.aOnly, "clean items")} ({vFpr.text}, {formatP(vFpr.p)}).
          </p>
          {lowPower && (
            <p className="text-xs text-muted-foreground mt-1">
              The runs disagree on too few items for a significant result: the exact McNemar test needs at least {MCNEMAR_MIN_DISCORDANT} discordant items in one direction. Run both setups on a larger subset.
            </p>
          )}
          {data.subsetsDiffer && (
            <p className="text-xs rounded border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 mt-2">
              The runs used different subsets ({data.subsets.a} vs {data.subsets.b}): only their common items are compared.
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Metric</th>
                <th className="py-2 pr-3 font-medium text-right"><RunKey color={BENCH_COLORS.a} label="A" /></th>
                <th className="py-2 pr-3 font-medium text-right"><RunKey color={BENCH_COLORS.b} label="B" /></th>
                <th className="py-2 pr-3 font-medium text-right">B − A</th>
                <th className="py-2 pr-3 font-medium text-right">95% CI of B − A</th>
                <th className="py-2 font-medium">Paired test</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((m) => (
                <tr key={m.name} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium whitespace-nowrap">{m.name}{m.help && <Help>{m.help}</Help>}</td>
                  <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">{m.a}</td>
                  <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">{m.b}</td>
                  <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap font-medium">{m.diff}</td>
                  <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap text-muted-foreground">{m.ci || ""}</td>
                  <td className="py-2 text-xs whitespace-nowrap">{m.test || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Recall and FPR are paired on the common items: exact two-sided McNemar test, and Newcombe's interval for the paired difference. An interval that contains 0 means no detectable difference.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <TwoByTwo title="Flawed items" t={planted} help="Catching more is better. Only the outlined cells, where the runs disagree, count for the test." />
          <TwoByTwo title="Clean items" t={clean} help="Rejecting fewer is better." lowerIsBetter />
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold">Recall by defect type</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Each row: A and B on the same track; the line between them is the difference. ▲ B better, ▼ B worse. Few items per type: read the direction, not the size.
        </p>
        <div className="overflow-x-auto"><div className="min-w-[36rem]"><DotRows typesA={data.typesA} typesB={data.typesB} /></div></div>
      </Card>

      {stageA.length > 0 && (
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By stage</h4>
          <p className="text-sm text-muted-foreground mb-3">Each check on its own: recall on the defect types it targets, and its false alarms on clean items (whole runs).</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Stage</th>
                  <th className="py-2 pr-3 font-medium text-right">Recall on target types A</th>
                  <th className="py-2 pr-3 font-medium text-right">B</th>
                  <th className="py-2 pr-3 font-medium text-right">B − A</th>
                  <th className="py-2 pr-3 font-medium text-right">FPR A</th>
                  <th className="py-2 pr-3 font-medium text-right">B</th>
                  <th className="py-2 font-medium text-right">B − A</th>
                </tr>
              </thead>
              <tbody>
                {stageA.map((s) => {
                  const t = stageB[s.stage];
                  const r = (k: number, n: number) => (n ? (100 * k) / n : null);
                  const cell = (k: number, n: number) => <span title={`95% CI ${formatInterval(wilson(k, n))}`}>{n ? `${formatRate(r(k, n))} (${k}/${n})` : "–"}</span>;
                  return (
                    <tr key={s.stage} className="border-b last:border-0">
                      <td className="py-2 pr-3">{s.label}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{cell(s.ownFlagged, s.ownN)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{t ? cell(t.ownFlagged, t.ownN) : "–"}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{t && s.ownN && t.ownN ? pp(r(t.ownFlagged, t.ownN)! - r(s.ownFlagged, s.ownN)!) : "–"}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{cell(s.cleanFlagged, s.cleanN)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{t ? cell(t.cleanFlagged, t.cleanN) : "–"}</td>
                      <td className="py-2 text-right tabular-nums">{t && s.cleanN && t.cleanN ? pp(r(t.cleanFlagged, t.cleanN)! - r(s.cleanFlagged, s.cleanN)!) : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="font-semibold">Items where A and B differ ({discordant.length})</h4>
          {discordant.length > 0 && (
            <div className="flex gap-1" role="group" aria-label="Show items">
              {([["all", "All"], ["b", "B right"], ["a", "A right"]] as const).map(([k, l]) => (
                <button key={k} type="button" onClick={() => setWho(k)}
                  className={`text-xs rounded border px-2 py-1 ${who === k ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                  {l} ({discordant.filter((r) => k === "all" || verdictRight(r.planted_type, k === "a" ? r.a_rejected : r.b_rejected)).length})
                </button>
              ))}
            </div>
          )}
        </div>
        {discordant.length === 0 ? <p className="text-sm text-muted-foreground">The two runs agree on every common item.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Type · level</th>
                  <th className="py-2 pr-3 font-medium">Right</th>
                  <th className="py-2 pr-3 font-medium">A</th>
                  <th className="py-2 font-medium">B</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.attempt_id} className="border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top" onClick={() => onOpenItem(r.attempt_id)}>
                    <td className="py-2 pr-3 font-mono text-xs">{r.attempt_id}</td>
                    <td className="py-2 pr-3 text-xs whitespace-nowrap"><span className="font-mono">{r.planted_type}</span> · {r.level}</td>
                    <td className="py-2 pr-3">
                      <RunKey color={verdictRight(r.planted_type, r.a_rejected) ? BENCH_COLORS.a : BENCH_COLORS.b} label={verdictRight(r.planted_type, r.a_rejected) ? "A" : "B"} />
                    </td>
                    {([[r.a_rejected, r.aStages, r.aCodes], [r.b_rejected, r.bStages, r.bCodes]] as const).map(([rejected, st, codes], i) => (
                      <td key={i} className="py-2 pr-3">
                        <span className="mr-1.5"><OutcomeBadge plantedType={r.planted_type} rejected={rejected} /></span>
                        {st.map((s) => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0 mr-1">{s}</Badge>)}
                        <IssueCodeChips codes={codes} labels={{}} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
