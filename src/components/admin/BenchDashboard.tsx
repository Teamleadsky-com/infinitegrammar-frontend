import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, formatDate, formatUsd } from "./dashboardShared";
import { formatSeconds } from "@/lib/pipelineTrace";
import { rateWithN } from "@/lib/bench";
import { BenchRunView } from "./bench/BenchRunView";
import { BenchCompare } from "./bench/BenchCompare";
import { BenchItemSheet } from "./bench/BenchItemSheet";
import { BenchRun } from "./bench/types";

/**
 * Verifier benchmark (generator spec §5.6, migration 015 views): pipeline setups run verify-only on a fixed
 * set of clean exercises and copies with one planted defect each. Runs table, one run by defect type, stage
 * and item, and two runs compared on the same items.
 */
const Definitions = () => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-4">
      <button type="button" className="flex items-center gap-1 text-sm font-medium" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        How to read this
      </button>
      {open && (
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Detection:</span> planted items the setup rejected (caught), by any stage and for any reason.</p>
          <p><span className="font-medium text-foreground">False rejects:</span> clean items the setup rejected. Clean items passed the production checks once, so this is a lower bound.</p>
          <p><span className="font-medium text-foreground">Balanced accuracy:</span> the average of detection and (100 − false rejects).</p>
          <p><span className="font-medium text-foreground">Precision at 20% / 50% flawed:</span> of the exercises the setup rejects, how many are really flawed, if 20% (or 50%) of the checked exercises were flawed.</p>
          <p><span className="font-medium text-foreground">Expected hit:</span> rejected with an issue code that belongs to the planted type (e.g. G2 or FG1 for a second correct answer). <span className="font-medium text-foreground">At gap:</span> a failing stage named the planted gap.</p>
          <p><span className="font-medium text-foreground">Seen in calibration:</span> the exercise was in the set the final-gate prompt was tuned on; results may look better there.</p>
          <p><span className="font-medium text-foreground">Clean source:</span> audit (production-accepted, graded clean), starter (onboarding starters), verified_v1 (older exercises verified in September 2026).</p>
          <p><span className="font-medium text-foreground">Cost and time:</span> as in the Pipeline trace: per item the sum of its calls; time from the first request sent to the last answer received.</p>
        </div>
      )}
    </Card>
  );
};

export const BenchDashboard = ({ apiBase, onOpenTrace }: { apiBase: string; onOpenTrace: (runId: string) => void }) => {
  const [runs, setRuns] = useState<BenchRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({ dataset: "all", subset: "all", config: "all" });
  const [openRun, setOpenRun] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ runs: BenchRun[] }>(`${apiBase}/admin-bench-runs`).then((d) => setRuns(d.runs)).catch((e) => setError(e.message));
  }, [apiBase]);

  const options = useMemo(() => {
    const uniq = (xs: Array<string | null>) => [...new Set(xs.filter(Boolean))].sort() as string[];
    return { datasets: uniq((runs || []).map((r) => r.dataset)), subsets: uniq((runs || []).map((r) => r.subset)), configs: uniq((runs || []).map((r) => r.config)) };
  }, [runs]);
  const visible = (runs || []).filter((r) => (f.dataset === "all" || r.dataset === f.dataset) && (f.subset === "all" || r.subset === f.subset) && (f.config === "all" || r.config === f.config));
  const byId = Object.fromEntries((runs || []).map((r) => [r.runId, r]));
  const [a, b] = picked.map((id) => byId[id]);
  const sameDataset = a && b && a.dataset === b.dataset;
  const selected = openRun ? byId[openRun] : null;
  const name = (r: BenchRun) => r.tag || r.config || r.runId;

  const toggle = (id: string) => {
    setComparing(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-2)));
  };

  const filter = (key: keyof typeof f, label: string, values: string[]) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={f[key]} onValueChange={(v) => setF({ ...f, [key]: v })}>
        <SelectTrigger className="w-[170px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {values.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Verifier benchmark</h3>
            <p className="text-sm text-muted-foreground">
              Pipeline setups checked on the same benchmark items: clean exercises, and copies of them with exactly one planted defect.
              A setup should reject the planted copies and accept the clean ones. Tick two runs to compare them; click a run to open it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filter("dataset", "Dataset", options.datasets)}
            {filter("subset", "Subset", options.subsets)}
            {filter("config", "Config", options.configs)}
          </div>
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
                  <th className="py-2 pr-2 font-medium">A/B</th>
                  <th className="py-2 pr-3 font-medium">Setup</th>
                  <th className="py-2 pr-3 font-medium">Subset</th>
                  <th className="py-2 pr-3 font-medium">Models</th>
                  <th className="py-2 pr-3 font-medium text-right">Detection</th>
                  <th className="py-2 pr-3 font-medium text-right">False rejects</th>
                  <th className="py-2 pr-3 font-medium text-right">Balanced accuracy</th>
                  <th className="py-2 pr-3 font-medium text-right">Precision @20% / @50%</th>
                  <th className="py-2 pr-3 font-medium text-right">$ / item</th>
                  <th className="py-2 pr-3 font-medium text-right">Time / item</th>
                  <th className="py-2 pr-3 font-medium text-right">Spent</th>
                  <th className="py-2 pr-3 font-medium text-right">Done</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const pick = picked.indexOf(r.runId);
                  return (
                    <tr key={r.runId} className={`border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top ${openRun === r.runId ? "bg-muted/60" : ""}`} onClick={() => { setComparing(false); setOpenRun(r.runId); }}>
                      <td className="py-2 pr-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Checkbox checked={pick >= 0} onCheckedChange={() => toggle(r.runId)} aria-label={`Compare ${r.runId}`} />
                          {pick >= 0 && <span className="text-xs font-semibold">{pick === 0 ? "A" : "B"}</span>}
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <p className="font-medium">{r.config || "–"}{r.tag && <span className="text-muted-foreground font-normal"> · {r.tag}</span>}</p>
                        <p className="text-xs text-muted-foreground font-mono">{r.runId}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(r.startedAt)}</p>
                      </td>
                      <td className="py-2 pr-3">{r.subset || "–"}{r.subset === "pilot" && <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">rough</Badge>}</td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1 max-w-[14rem]">
                          {r.models.map((m) => <Badge key={m} variant="secondary" className={`text-[10px] px-1.5 py-0 font-mono ${m === r.finalGateModel ? "ring-1 ring-primary/50" : ""}`} title={m === r.finalGateModel ? "final gate model" : undefined}>{m}</Badge>)}
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">{rateWithN(r.detectionPct, r.planted)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">{rateWithN(r.falseRejectPct, r.clean)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums font-medium">{r.balancedAccuracyPct === null ? "–" : `${r.balancedAccuracyPct.toFixed(1)}%`}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">{r.precisionAt20Pct === null ? "–" : `${Math.round(r.precisionAt20Pct)}%`} / {r.precisionAt50Pct === null ? "–" : `${Math.round(r.precisionAt50Pct)}%`}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatUsd(r.usdPerItem)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatSeconds(r.secondsPerItem)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatUsd(r.spentUsd)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.done} / {r.items}</td>
                      <td className="py-2 text-right">
                        <button type="button" className="text-xs text-primary underline decoration-dotted underline-offset-4 whitespace-nowrap" onClick={(e) => { e.stopPropagation(); onOpenTrace(r.runId); }}>
                          Open in Pipeline trace
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {visible.some((r) => r.subset === "pilot") && (
          <p className="text-xs text-muted-foreground">The pilot subset has 18 planted and 6 clean items: its rates are rough.</p>
        )}
        {picked.length === 2 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" disabled={!sameDataset} onClick={() => { setComparing(true); setOpenRun(null); }}>Compare A and B</Button>
            {!sameDataset && <span className="text-xs text-destructive">Only runs of the same dataset can be compared.</span>}
          </div>
        )}
      </Card>

      <Definitions />

      {comparing && a && b && sameDataset && <BenchCompare apiBase={apiBase} a={a} b={b} onOpenItem={setItem} />}
      {!comparing && selected && (
        <>
          <h3 className="text-lg font-semibold">{name(selected)} <span className="text-sm font-normal text-muted-foreground font-mono">{selected.runId}</span></h3>
          <BenchRunView apiBase={apiBase} runId={selected.runId} onOpenItem={setItem} />
        </>
      )}

      <BenchItemSheet
        apiBase={apiBase}
        runs={comparing && a && b ? [{ runId: a.runId, label: `A: ${name(a)}` }, { runId: b.runId, label: `B: ${name(b)}` }] : selected ? [{ runId: selected.runId, label: name(selected) }] : []}
        attemptId={item}
        onOpenAttempt={setItem}
        onClose={() => setItem(null)}
      />
    </div>
  );
};
