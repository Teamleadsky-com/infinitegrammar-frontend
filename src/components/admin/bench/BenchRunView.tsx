import { ReactNode, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, levelRank } from "../dashboardShared";
import { IssueCodeChips } from "../trace/TraceBits";
import { formatCost, formatSeconds, shortAttemptId } from "@/lib/pipelineTrace";
import { balancedAccuracyCI, forAt, formatInterval, formatRate, outcome, Outcome, ppvAt, wilson } from "@/lib/bench";
import { BENCH_COLORS, Help, MetricHead, OutcomeBadge, RateCell } from "./BenchBits";
import { BenchItemRow, BenchRun, BenchStageMetric, BenchTypeMetric } from "./types";

type RunData = { types: BenchTypeMetric[]; stages: BenchStageMetric[] };

/** Bars per defect type: recall "k / n" with its 95% interval as a whisker; the clean bar (FPR, lower is better) below a divider. */
export const TypeBars = ({ types }: { types: BenchTypeMetric[] }) => {
  const planted = types.filter((t) => t.type !== "clean");
  const clean = types.find((t) => t.type === "clean");
  const Bar = ({ t, color }: { t: BenchTypeMetric; color: string }) => {
    const ci = wilson(t.rejected, t.n);
    return (
      <div className="grid grid-cols-[minmax(10rem,18rem)_1fr_4.5rem] items-center gap-3 text-sm" title={`${t.label}: ${t.rejected} of ${t.n}, 95% CI ${formatInterval(ci)}`}>
        <span className="truncate"><span className="font-mono text-xs mr-1.5">{t.type}</span>{t.label}</span>
        <div className="relative h-4 rounded bg-muted/60">
          <div className="h-full rounded-r" style={{ width: `${t.rejectedPct ?? 0}%`, background: color, minWidth: t.rejected ? 3 : 0 }} />
          {ci && <div className="absolute top-1/2 h-px bg-foreground/50" style={{ left: `${ci[0] * 100}%`, width: `${(ci[1] - ci[0]) * 100}%` }} />}
        </div>
        <span className="tabular-nums text-right">{t.rejected} / {t.n}</span>
      </div>
    );
  };
  return (
    <div className="space-y-1.5">
      {planted.map((t) => <Bar key={t.type} t={t} color={BENCH_COLORS.recall} />)}
      {clean && (
        <>
          <div className="border-t my-2" />
          <p className="text-xs text-muted-foreground">Clean items rejected: FPR, lower is better</p>
          <Bar t={clean} color={BENCH_COLORS.fpr} />
        </>
      )}
      <p className="text-xs text-muted-foreground pt-1">Line inside a bar: 95% Wilson interval.</p>
    </div>
  );
};

const Tile = ({ label, value, sub, help }: { label: string; value: ReactNode; sub?: ReactNode; help?: ReactNode }) => (
  <div className="rounded border p-3">
    <p className="text-xs text-muted-foreground">{label}{help && <Help>{help}</Help>}</p>
    <p className="text-xl font-semibold">{value}</p>
    {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
  </div>
);

/** The run's confusion matrix with its headline metrics and the findings worth acting on. */
const Summary = ({ run, types, stages, items, prevalence }: { run: BenchRun; types: BenchTypeMetric[]; stages: BenchStageMetric[]; items: BenchItemRow[]; prevalence: number }) => {
  const tp = run.caught;
  const fn = run.planted - run.caught;
  const fp = run.falseRejects;
  const tn = run.clean - run.falseRejects;
  const tpr = run.planted ? tp / run.planted : null;
  const fpr = run.clean ? fp / run.clean : null;
  const ppv = ppvAt(prevalence, tpr, fpr);
  const fo = forAt(prevalence, tpr, fpr);
  const withGap = types.filter((t) => t.type !== "clean").reduce((s, t) => s + t.nWithGap, 0);
  const atGap = types.filter((t) => t.type !== "clean").reduce((s, t) => s + t.atGap, 0);
  const pct = Math.round(prevalence * 100);
  const mix = run.planted + run.clean ? Math.round((100 * run.planted) / (run.planted + run.clean)) : null;

  // findings
  const done = items.filter((i) => i.done);
  const missed = done.filter((i) => outcome(i.plantedType, i.rejected) === "FN");
  const missedByType = Object.entries(missed.reduce<Record<string, number>>((m, i) => ({ ...m, [i.plantedType]: (m[i.plantedType] || 0) + 1 }), {}));
  const fpStages = stages.filter((s) => s.cleanFlagged > 0);
  const wrongReason = tp - run.caughtExpected;
  const seen = done.filter((i) => i.plantedType !== "clean" && i.seenInCalibration);
  const unseen = done.filter((i) => i.plantedType !== "clean" && !i.seenInCalibration);
  const caught = (xs: BenchItemRow[]) => xs.filter((i) => i.rejected).length;

  const Cell = ({ code, n, right, children }: { code: string; n: number; right: boolean; children: ReactNode }) => (
    <div className={`p-2.5 ${right ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
      <p className="text-xs"><span className={`font-semibold ${right ? "text-green-800" : "text-red-800"}`}>{code}</span> <span className="text-muted-foreground">{children}</span></p>
      <p className="text-lg font-semibold tabular-nums">{n}</p>
    </div>
  );

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_1fr] gap-6">
        <div>
          <h4 className="font-semibold mb-2">Confusion matrix</h4>
          <div className="grid grid-cols-[auto_1fr_1fr] text-sm border rounded overflow-hidden gap-px bg-border" aria-label="Confusion matrix">
            <span className="bg-muted/50 p-2" />
            <span className="bg-muted/50 p-2 text-xs font-medium">Rejected</span>
            <span className="bg-muted/50 p-2 text-xs font-medium">Accepted</span>
            <span className="bg-muted/50 p-2 text-xs font-medium">Flawed<br /><span className="font-normal text-muted-foreground">n = {run.planted}</span></span>
            <Cell code="TP" n={tp} right>caught</Cell>
            <Cell code="FN" n={fn} right={false}>missed</Cell>
            <span className="bg-muted/50 p-2 text-xs font-medium">Clean<br /><span className="font-normal text-muted-foreground">n = {run.clean}</span></span>
            <Cell code="FP" n={fp} right={false}>clean rejected</Cell>
            <Cell code="TN" n={tn} right>clean accepted</Cell>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 content-start">
          <Tile label="Recall (TPR)" value={formatRate(run.detectionPct)} sub={`95% CI ${formatInterval(wilson(tp, run.planted))}`} />
          <Tile label="FPR" value={formatRate(run.falseRejectPct)} sub={`95% CI ${formatInterval(wilson(fp, run.clean))}`} />
          <Tile label="Balanced accuracy" value={formatRate(run.balancedAccuracyPct)} sub={`95% CI ${formatInterval(balancedAccuracyCI(tp, run.planted, fp, run.clean))}`} />
          <Tile label={`PPV · FOR @ ${pct}% flawed`} value={`${ppv === null ? "–" : formatRate(100 * ppv)} · ${fo === null ? "–" : formatRate(100 * fo)}`} sub="rejected that are flawed · accepted that are flawed" />
          <Tile label="Raw precision on the benchmark" value={formatRate(run.precisionSetPct)} sub={mix === null ? undefined : `at the benchmark's ${mix}% flawed: not production`} help="TP / (TP + FP) on the benchmark's own mix. Use PPV at a realistic share of flawed exercises instead." />
          <Tile label="Error attribution" value={run.planted ? formatRate((100 * run.caughtExpected) / run.planted) : "–"} sub={`${run.caughtExpected} / ${run.planted} caught with a code of the planted type`} />
          <Tile label="Localization" value={withGap ? formatRate((100 * atGap) / withGap) : "–"} sub={`${atGap} / ${withGap} flagged at the planted gap`} />
          <Tile label="Cost · time per item" value={run.usdPerItem === null ? "–" : `$${run.usdPerItem.toFixed(3)}`} sub={formatSeconds(run.secondsPerItem)} />
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-1">What to look at</h4>
        <ul className="text-sm list-disc pl-5 space-y-0.5 text-muted-foreground">
          <li>
            <span className="text-foreground">Missed (FN):</span>{" "}
            {missedByType.length ? missedByType.map(([t, n]) => `${t} ×${n}`).join(", ") : "none"}
          </li>
          <li>
            <span className="text-foreground">False positives raised by:</span>{" "}
            {fpStages.length ? fpStages.map((s) => `${s.label} (${s.cleanFlagged} of ${s.cleanN} clean)`).join(", ") : "no stage"}
          </li>
          {wrongReason > 0 && <li><span className="text-foreground">Caught for another reason:</span> {wrongReason} of {tp} caught items were rejected without a code of their planted type.</li>}
          {seen.length > 0 && unseen.length > 0 && (
            <li>
              <span className="text-foreground">Calibration overlap:</span> recall {formatRate((100 * caught(seen)) / seen.length)} on items seen in calibration ({caught(seen)} / {seen.length})
              vs {formatRate((100 * caught(unseen)) / unseen.length)} on unseen ones ({caught(unseen)} / {unseen.length}).
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
};

export const BenchRunView = ({ apiBase, run, prevalence, onOpenItem }: { apiBase: string; run: BenchRun; prevalence: number; onOpenItem: (attemptId: string) => void }) => {
  const runId = run.runId;
  const [data, setData] = useState<RunData | null>(null);
  const [items, setItems] = useState<BenchItemRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({ type: "all", outcome: "all", level: "all", section: "all", calibration: "all", source: "all" });

  useEffect(() => {
    setData(null);
    setItems(null);
    setError(null);
    fetchJson<RunData>(`${apiBase}/admin-bench-run?run_id=${encodeURIComponent(runId)}`).then(setData).catch((e) => setError(e.message));
    fetchJson<{ items: BenchItemRow[] }>(`${apiBase}/admin-bench-items?run_id=${encodeURIComponent(runId)}`).then((d) => setItems(d.items)).catch((e) => setError(e.message));
  }, [apiBase, runId]);

  const options = useMemo(() => {
    const uniq = (xs: Array<string | null>) => [...new Set(xs.filter(Boolean))] as string[];
    const all = items || [];
    return {
      types: uniq(all.map((i) => i.plantedType)),
      levels: uniq(all.map((i) => i.level)).sort((a, b) => levelRank(a) - levelRank(b)),
      sections: uniq(all.map((i) => i.sectionId)).sort(),
      sources: uniq(all.map((i) => i.cleanSource)),
    };
  }, [items]);

  // per CEFR level and per stage, from the items (the views have no level split)
  const done = (items || []).filter((i) => i.done);
  const levels = options.levels.map((level) => {
    const xs = done.filter((i) => i.level === level);
    const pl = xs.filter((i) => i.plantedType !== "clean");
    const cl = xs.filter((i) => i.plantedType === "clean");
    return { level, tp: pl.filter((i) => i.rejected).length, p: pl.length, fp: cl.filter((i) => i.rejected).length, n: cl.length };
  });
  const sole = (stage: string, clean: boolean) =>
    done.filter((i) => (i.plantedType === "clean") === clean && i.flaggedStages.length === 1 && i.flaggedStages[0] === stage).length;

  const visible = (items || []).filter(
    (i) =>
      (f.type === "all" || i.plantedType === f.type) &&
      (f.outcome === "all" || (i.done && outcome(i.plantedType, i.rejected) === f.outcome)) &&
      (f.level === "all" || i.level === f.level) &&
      (f.section === "all" || i.sectionId === f.section) &&
      (f.calibration === "all" || String(!!i.seenInCalibration) === f.calibration) &&
      (f.source === "all" || i.cleanSource === f.source),
  );

  const filter = (key: keyof typeof f, label: string, values: Array<[string, string]>, width = "w-[150px]") => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={f[key]} onValueChange={(v) => setF({ ...f, [key]: v })}>
        <SelectTrigger className={`${width} h-9`} aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {values.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
  const OUTCOMES: Array<[Outcome, string]> = [["TP", "TP · caught"], ["FN", "FN · missed"], ["FP", "FP · clean rejected"], ["TN", "TN · clean accepted"]];

  if (error) return <p className="text-sm text-destructive">Could not load the run: {error}</p>;
  return (
    <div className="space-y-4">
      {data && items ? <Summary run={run} types={data.types} stages={data.stages} items={items} prevalence={prevalence} /> : <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">Recall by defect type</h4>
          <p className="text-sm text-muted-foreground mb-3">Share of the flawed items of each type that the setup rejected.</p>
          {!data ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : data.types.length === 0 ? <p className="text-sm text-muted-foreground">No finished items.</p> : <TypeBars types={data.types} />}
        </Card>
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By defect type: details</h4>
          <p className="text-sm text-muted-foreground mb-3">Attribution: caught with an issue code of the planted type. Localization: a failing stage named the planted gap.</p>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-1.5 pr-3 font-medium">Type</th>
                    <th className="py-1.5 pr-3 font-medium text-right">Recall · FPR</th>
                    <th className="py-1.5 pr-3 font-medium text-right">Attribution</th>
                    <th className="py-1.5 font-medium text-right">Localization</th>
                  </tr>
                </thead>
                <tbody>
                  {data.types.map((t) => (
                    <tr key={t.type} className={`border-b last:border-0 align-top ${t.type === "clean" ? "border-t-2" : ""}`}>
                      <td className="py-1.5 pr-3 font-mono text-xs" title={t.label}>{t.type}{t.type === "clean" && <span className="font-sans text-muted-foreground"> (FPR)</span>}</td>
                      <td className="py-1.5 pr-3 text-right"><RateCell k={t.rejected} n={t.n} /></td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{t.type === "clean" ? "–" : `${t.rejectedExpected} / ${t.n}`}</td>
                      <td className="py-1.5 text-right tabular-nums">{t.nWithGap ? `${t.atGap} / ${t.nWithGap}` : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By stage</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Every stage checks every item, and the setup rejects an item when any stage fails it. Sole catches and sole false alarms show what removing a stage would change.
          </p>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-medium align-bottom">Stage</th>
                    <MetricHead name="Recall on target types" sub="its own defect types" help="Recall of this check alone on the flawed items whose expected issue codes are its codes (gap checks G1–G5, coherence G6, final gate FG1–FG6)." />
                    <MetricHead name="Flagged flawed" sub="any type" />
                    <MetricHead name="FPR" sub="clean flagged" help="Clean items this check flagged: its false alarms." />
                    <MetricHead name="Sole catches" sub="only this stage" help="Flawed items only this stage flagged: recall would drop by this many without it." />
                    <MetricHead name="Sole false alarms" sub="only this stage" help="Clean items only this stage flagged: FPs that would go away without it." />
                  </tr>
                </thead>
                <tbody>
                  {data.stages.map((s) => (
                    <tr key={s.stage} className="border-b last:border-0 align-top">
                      <td className="py-2 pr-3">{s.label}</td>
                      <td className="py-2 pr-3 text-right"><RateCell k={s.ownFlagged} n={s.ownN} /></td>
                      <td className="py-2 pr-3 text-right tabular-nums">{s.plantedFlagged} / {s.plantedN}</td>
                      <td className="py-2 pr-3 text-right"><RateCell k={s.cleanFlagged} n={s.cleanN} /></td>
                      <td className="py-2 pr-3 text-right tabular-nums">{items ? sole(s.stage, false) : "…"}</td>
                      <td className="py-2 text-right tabular-nums">{items ? sole(s.stage, true) : "…"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By CEFR level</h4>
          <p className="text-sm text-muted-foreground mb-3">Recall and FPR per level of the exercise.</p>
          {items && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Level</th>
                  <th className="py-2 pr-3 font-medium text-right">Recall</th>
                  <th className="py-2 font-medium text-right">FPR</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((l) => (
                  <tr key={l.level} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-3">{l.level}</td>
                    <td className="py-2 pr-3 text-right"><RateCell k={l.tp} n={l.p} /></td>
                    <td className="py-2 text-right"><RateCell k={l.fp} n={l.n} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold mb-3">Items</h4>
        {!items ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : (
          <>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              {filter("type", "Defect type", options.types.map((t) => [t, t]), "w-[120px]")}
              {filter("outcome", "Outcome", OUTCOMES, "w-[170px]")}
              {filter("level", "Level", options.levels.map((l) => [l, l]), "w-[100px]")}
              {filter("section", "Section", options.sections.map((s) => [s, s]), "w-[220px]")}
              {filter("calibration", "Seen in calibration", [["true", "yes"], ["false", "no"]], "w-[130px]")}
              {filter("source", "Clean source", options.sources.map((s) => [s, s]), "w-[130px]")}
              <p className="text-xs text-muted-foreground pb-2">{visible.length} of {items.length} items</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Item</th>
                    <th className="py-2 pr-3 font-medium">Planted</th>
                    <th className="py-2 pr-3 font-medium">Level · section</th>
                    <th className="py-2 pr-3 font-medium">Outcome</th>
                    <th className="py-2 pr-3 font-medium">Flagged by</th>
                    <th className="py-2 pr-3 font-medium">Codes</th>
                    <th className="py-2 pr-3 font-medium">Attributed · localized</th>
                    <th className="py-2 pr-3 font-medium text-right">Cost</th>
                    <th className="py-2 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((i) => (
                    <tr key={i.attemptId} className="border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top" onClick={() => onOpenItem(i.attemptId)}>
                      <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{shortAttemptId(i.attemptId, runId)}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <span className="font-mono text-xs">{i.plantedType}</span>
                        {i.plantedVariant && <span className="text-xs text-muted-foreground"> · {i.plantedVariant}</span>}
                        {i.plantedAuthor && <span className="text-xs text-muted-foreground"> · {i.plantedAuthor}</span>}
                      </td>
                      <td className="py-2 pr-3 text-xs">{i.level} · {i.sectionId}</td>
                      <td className="py-2 pr-3">{i.done ? <OutcomeBadge plantedType={i.plantedType} rejected={i.rejected} /> : <Badge variant="outline">{i.status}</Badge>}</td>
                      <td className="py-2 pr-3"><div className="flex flex-wrap gap-1">{i.flaggedStages.map((s) => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}</div></td>
                      <td className="py-2 pr-3"><IssueCodeChips codes={i.flaggedCodes} labels={{}} /></td>
                      <td className="py-2 pr-3 text-xs">{i.plantedType === "clean" || !i.rejected ? "–" : `${i.expectedHit ? "yes" : "no"} · ${i.atGap === null ? "–" : i.atGap ? "yes" : "no"}`}</td>
                      <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">{formatCost(i.costUsd)}</td>
                      <td className="py-2 text-right whitespace-nowrap">{formatSeconds(i.wallSeconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
