import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, formatDate, formatUsd } from "./dashboardShared";
import { formatSeconds } from "@/lib/pipelineTrace";
import { balancedAccuracyCI, forAt, formatInterval, formatRate, ppvAt } from "@/lib/bench";
import { BenchRunView } from "./bench/BenchRunView";
import { BenchCompare } from "./bench/BenchCompare";
import { BenchItemSheet } from "./bench/BenchItemSheet";
import { BenchGuide } from "./bench/BenchGuide";
import { CostChart, RocChart, RunLegend, TypeHeatmap, runName } from "./bench/BenchCharts";
import { BENCH_COLORS, MetricHead, PrevalencePicker, RateCell } from "./bench/BenchBits";
import { BenchRun, BenchTypeMetric } from "./bench/types";

/**
 * Verifier benchmark (generator spec §5.6, migration 015 views): an LLM-as-judge meta-evaluation. Pipeline
 * setups run verify-only on a fixed set of clean exercises and copies with one planted defect each. Runs table
 * in standard metrics with 95% intervals, the setups in ROC space and against cost, recall by defect type × run,
 * one run in detail, and two runs compared pairwise on the same items.
 */

type RunsData = { runs: BenchRun[]; typesByRun: Record<string, BenchTypeMetric[]>; typeLabels: Array<{ type: string; label: string; order: number }> };

const SORTS: Record<string, { label: string; key: (r: BenchRun) => number | null; asc?: boolean }> = {
  newest: { label: "Newest first", key: () => 0 },
  ba: { label: "Balanced accuracy", key: (r) => r.balancedAccuracyPct },
  recall: { label: "Recall", key: (r) => r.detectionPct },
  fpr: { label: "Lowest FPR", key: (r) => r.falseRejectPct, asc: true },
  cost: { label: "Cheapest", key: (r) => r.usdPerItem, asc: true },
};

const tpr = (r: BenchRun) => (r.planted ? r.caught / r.planted : null);
const fpr = (r: BenchRun) => (r.clean ? r.falseRejects / r.clean : null);

export const BenchDashboard = ({ apiBase, onOpenTrace }: { apiBase: string; onOpenTrace: (runId: string) => void }) => {
  const [data, setData] = useState<RunsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({ dataset: "all", subset: "all", config: "all", sort: "newest" });
  const [prevalence, setPrevalence] = useState(0.2);
  const [openRun, setOpenRun] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<RunsData>(`${apiBase}/admin-bench-runs`).then(setData).catch((e) => setError(e.message));
  }, [apiBase]);

  const runs = data?.runs ?? null;
  const options = useMemo(() => {
    const uniq = (xs: Array<string | null>) => [...new Set(xs.filter(Boolean))].sort() as string[];
    return { datasets: uniq((runs || []).map((r) => r.dataset)), subsets: uniq((runs || []).map((r) => r.subset)), configs: uniq((runs || []).map((r) => r.config)) };
  }, [runs]);
  const sort = SORTS[f.sort];
  const visible = (runs || [])
    .filter((r) => (f.dataset === "all" || r.dataset === f.dataset) && (f.subset === "all" || r.subset === f.subset) && (f.config === "all" || r.config === f.config))
    .map((r, i) => ({ r, i }))
    .sort((x, y) => {
      if (f.sort === "newest") return x.i - y.i;
      const a = sort.key(x.r);
      const b = sort.key(y.r);
      if (a === null || b === null) return a === null ? 1 : -1;
      return sort.asc ? a - b : b - a;
    })
    .map(({ r }) => r);
  const byId = Object.fromEntries((runs || []).map((r) => [r.runId, r]));
  const [a, b] = picked.map((id) => byId[id]);
  const sameDataset = a && b && a.dataset === b.dataset;
  const selected = openRun ? byId[openRun] : null;
  const mixedSubsets = new Set(visible.map((r) => r.subset)).size > 1;
  const pct = Math.round(prevalence * 100);

  const toggle = (id: string) => {
    setComparing(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-2)));
  };
  const open = (id: string) => {
    setComparing(false);
    setOpenRun(id);
  };

  const filter = (key: keyof typeof f, label: string, values: Array<[string, string]>, all = true) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={f[key]} onValueChange={(v) => setF({ ...f, [key]: v })}>
        <SelectTrigger className="w-[170px] h-9" aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          {all && <SelectItem value="all">All</SelectItem>}
          {values.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
  const pairs = (xs: string[]) => xs.map((x) => [x, x] as [string, string]);

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Verifier benchmark</h3>
          <BenchGuide />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {filter("dataset", "Dataset", pairs(options.datasets))}
          {filter("subset", "Subset", pairs(options.subsets))}
          {filter("config", "Config", pairs(options.configs))}
          {filter("sort", "Sort", Object.entries(SORTS).map(([k, s]) => [k, s.label]), false)}
          <PrevalencePicker value={prevalence} onChange={setPrevalence} />
        </div>

        {error && <p className="text-sm text-destructive">Could not load the benchmark runs: {error}</p>}
        {!runs && !error && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        {runs && runs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No benchmark runs are loaded yet. They appear here once the generator loads them (experiment runs with params.eval = verifier_bench).
          </p>
        )}
        {visible.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-2 font-medium align-bottom">A/B</th>
                  <th className="py-2 pr-3 font-medium align-bottom">Setup · models</th>
                  <th className="py-2 pr-3 font-medium align-bottom">Subset</th>
                  <MetricHead name="Recall (TPR)" sub="flawed rejected" help="TP / (TP + FN): share of the items with a planted defect that the setup rejected, by any stage. Earlier called detection. Below: k / n and the 95% Wilson interval." />
                  <MetricHead name="FPR" sub="clean rejected" help="FP / (FP + TN): share of the clean items the setup rejected (1 − specificity). Earlier called false rejects. A lower bound: clean items had passed the production checks." />
                  <MetricHead name="Balanced acc." sub="(TPR + TNR) / 2" help="Mean of recall and specificity; unlike accuracy or F1 it does not depend on the benchmark's share of flawed items. 95% interval by MOVER from the two Wilson intervals." />
                  <MetricHead name={`PPV @ ${pct}%`} sub="rejected that are flawed" help={`Precision rescaled to production: of the exercises the setup rejects, the share really flawed if ${pct}% of the checked exercises were flawed. The benchmark itself is 2/3 flawed (3/4 in the pilot), so raw precision would look better than in production. Change π above.`} />
                  <MetricHead name={`FOR @ ${pct}%`} sub="accepted that are flawed" help={`False omission rate: of the exercises the setup accepts, the share still flawed if ${pct}% were flawed. This is what reaches learners.`} />
                  <MetricHead name="Attribution" sub="caught with right code" help="Error attribution: flawed items rejected with an issue code of the planted type, out of all flawed items. A catch for the wrong reason counts in recall but not here." />
                  <MetricHead name="$ / item" sub="spent in total" />
                  <MetricHead name="Time / item" sub="wall clock" last />
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const pick = picked.indexOf(r.runId);
                  const ba = balancedAccuracyCI(r.caught, r.planted, r.falseRejects, r.clean);
                  const ppv = ppvAt(prevalence, tpr(r), fpr(r));
                  const fo = forAt(prevalence, tpr(r), fpr(r));
                  return (
                    <tr key={r.runId} className={`border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top ${openRun === r.runId && !comparing ? "bg-muted/60" : ""}`} onClick={() => open(r.runId)}>
                      <td className="py-2 pr-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Checkbox checked={pick >= 0} onCheckedChange={() => toggle(r.runId)} aria-label={`Compare ${r.runId}`} />
                          {pick >= 0 && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold">
                              <span className="inline-block h-2 w-2 rounded-full" style={{ background: pick === 0 ? BENCH_COLORS.a : BENCH_COLORS.b }} />
                              {pick === 0 ? "A" : "B"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <p className="font-medium break-all">{r.config || "–"}{r.tag && <span className="text-muted-foreground font-normal"> · {r.tag}</span>}</p>
                        <p className="text-xs text-muted-foreground font-mono">{r.runId}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(r.startedAt)}</p>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[16rem]">
                          {r.models.map((m) => <Badge key={m} variant="secondary" className={`text-[10px] px-1.5 py-0 font-mono ${m === r.finalGateModel ? "ring-1 ring-primary/50" : ""}`} title={m === r.finalGateModel ? "final gate model" : undefined}>{m}</Badge>)}
                        </div>
                        <button type="button" className="text-xs text-primary underline decoration-dotted underline-offset-4 whitespace-nowrap mt-1" onClick={(e) => { e.stopPropagation(); onOpenTrace(r.runId); }}>
                          Open in Pipeline trace
                        </button>
                      </td>
                      <td className="py-2 pr-3">
                        {r.subset || "–"}{r.subset === "pilot" && <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">rough</Badge>}
                        <p className="text-[11px] text-muted-foreground whitespace-nowrap">{r.planted} flawed · {r.clean} clean</p>
                        <p className="text-[11px] text-muted-foreground whitespace-nowrap">{r.done} / {r.items} done</p>
                      </td>
                      <td className="py-2 pr-3 text-right"><RateCell k={r.caught} n={r.planted} strong /></td>
                      <td className="py-2 pr-3 text-right"><RateCell k={r.falseRejects} n={r.clean} strong /></td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">
                        <span className="font-semibold">{formatRate(r.balancedAccuracyPct)}</span>
                        <span className="block text-[11px] text-muted-foreground">CI {formatInterval(ba)}</span>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{ppv === null ? "–" : formatRate(100 * ppv)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{fo === null ? "–" : formatRate(100 * fo)}</td>
                      <td className="py-2 pr-3 text-right"><RateCell k={r.caughtExpected} n={r.planted} /></td>
                      <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">
                        {formatUsd(r.usdPerItem)}
                        <span className="block text-[11px] text-muted-foreground">{formatUsd(r.spentUsd)}</span>
                      </td>
                      <td className="py-2 text-right whitespace-nowrap">{formatSeconds(r.secondsPerItem)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="space-y-1 text-xs text-muted-foreground">
          {visible.some((r) => r.subset === "pilot") && (
            <p>The pilot subset has 18 flawed and 6 clean items: it shows that the plumbing works, and its intervals are wide. Decide on the test subset (240 items).</p>
          )}
          {mixedSubsets && <p className="text-amber-700">The list mixes subsets with different items: filter to one subset to compare setups like with like.</p>}
          <p>Tick two runs to compare them as A and B; click a row to open a run.</p>
        </div>
        {picked.length === 2 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" disabled={!sameDataset} onClick={() => { setComparing(true); setOpenRun(null); }}>Compare A and B</Button>
            {!sameDataset && <span className="text-xs text-destructive">Only runs of the same dataset can be compared.</span>}
          </div>
        )}
      </Card>

      {visible.length > 0 && data && (
        <Card className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RocChart runs={visible} picked={picked} onOpen={open} />
            <CostChart runs={visible} picked={picked} onOpen={open} />
          </div>
          <RunLegend runs={visible} picked={picked} />
          <TypeHeatmap runs={visible} typesByRun={data.typesByRun || {}} labels={data.typeLabels} picked={picked} onOpen={open} />
        </Card>
      )}

      {comparing && a && b && sameDataset && <BenchCompare apiBase={apiBase} a={a} b={b} prevalence={prevalence} onOpenItem={setItem} />}
      {!comparing && selected && (
        <>
          <h3 className="text-lg font-semibold">{runName(selected)} <span className="text-sm font-normal text-muted-foreground font-mono">{selected.runId}</span></h3>
          <BenchRunView apiBase={apiBase} run={selected} prevalence={prevalence} onOpenItem={setItem} />
        </>
      )}

      <BenchItemSheet
        apiBase={apiBase}
        runs={comparing && a && b ? [{ runId: a.runId, label: `A: ${runName(a)}` }, { runId: b.runId, label: `B: ${runName(b)}` }] : selected ? [{ runId: selected.runId, label: runName(selected) }] : []}
        attemptId={item}
        onOpenAttempt={setItem}
        onClose={() => setItem(null)}
      />
    </div>
  );
};
