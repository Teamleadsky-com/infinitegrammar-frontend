import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchJson } from "../dashboardShared";
import { IssueCodeChips } from "../trace/TraceBits";
import { compareCounts, formatP, mcnemarExactP } from "@/lib/bench";
import { BenchRun, BenchTypeMetric } from "./types";

type Row = {
  attempt_id: string; planted_type: string; level: string | null; sectionId: string | null;
  a_rejected: boolean; b_rejected: boolean; aStages: string[]; bStages: string[]; aCodes: string[]; bCodes: string[];
};
type CompareData = { subsetsDiffer: boolean; subsets: { a: string; b: string }; rows: Row[]; typesA: BenchTypeMetric[]; typesB: BenchTypeMetric[] };

const Pair = ({ title, bOnly, aOnly, better, help }: { title: string; bOnly: number; aOnly: number; better: "b" | "a"; help: string }) => {
  const p = mcnemarExactP(bOnly, aOnly);
  // planted: catching more is better; clean: rejecting fewer is better
  const bBetter = better === "b" ? bOnly > aOnly : bOnly < aOnly;
  return (
    <div className="rounded border p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mb-2">{help}</p>
      <div className="flex gap-6 text-sm">
        <span><span className="text-xs text-muted-foreground">B only </span><span className="font-semibold tabular-nums">{bOnly}</span></span>
        <span><span className="text-xs text-muted-foreground">A only </span><span className="font-semibold tabular-nums">{aOnly}</span></span>
        <span className={p < 0.05 ? "font-semibold" : "text-muted-foreground"}>{formatP(p)}{p < 0.05 ? (bBetter ? " · B better" : " · A better") : " · could be chance"}</span>
      </div>
    </div>
  );
};

/** Two runs on the same benchmark items (spec §5.6.4). */
export const BenchCompare = ({ apiBase, a, b, onOpenItem }: { apiBase: string; a: BenchRun; b: BenchRun; onOpenItem: (attemptId: string) => void }) => {
  const [data, setData] = useState<CompareData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    fetchJson<CompareData>(`${apiBase}/admin-bench-items?run_id=${encodeURIComponent(a.runId)}&compare=${encodeURIComponent(b.runId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [apiBase, a.runId, b.runId]);

  if (error) return <p className="text-sm text-destructive">Could not compare the runs: {error}</p>;
  if (!data) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  const counts = compareCounts(data.rows);
  const discordant = data.rows.filter((r) => r.a_rejected !== r.b_rejected);
  const typesB = Object.fromEntries(data.typesB.map((t) => [t.type, t]));
  const name = (r: BenchRun) => r.tag || r.config || r.runId;

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6 space-y-3">
        <div>
          <h4 className="font-semibold">A: {name(a)} · B: {name(b)}</h4>
          <p className="text-sm text-muted-foreground">
            {data.rows.length} common finished items ({counts.planted} planted, {counts.clean} clean). Exact two-sided McNemar test on the items where the runs differ; p &lt; 0.05 means the difference is unlikely to be chance.
          </p>
          {data.subsetsDiffer && (
            <p className="text-xs rounded border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 mt-2">
              The runs used different subsets ({data.subsets.a} vs {data.subsets.b}): only their common items are compared.
            </p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Pair title="Planted items: caught by one only" bOnly={counts.plantedBOnly} aOnly={counts.plantedAOnly} better="b" help="Catching more planted defects is better." />
          <Pair title="Clean items: rejected by one only" bOnly={counts.cleanBOnly} aOnly={counts.cleanAOnly} better="a" help="Rejecting fewer clean exercises is better." />
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold mb-3">By defect type</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-1.5 pr-3 font-medium">Type</th>
                <th className="py-1.5 pr-3 font-medium text-right">A rejected</th>
                <th className="py-1.5 pr-3 font-medium text-right">B rejected</th>
                <th className="py-1.5 font-medium text-right">B − A</th>
              </tr>
            </thead>
            <tbody>
              {data.typesA.map((t) => {
                const tb = typesB[t.type];
                const diff = tb && t.rejectedPct !== null && tb.rejectedPct !== null ? tb.rejectedPct - t.rejectedPct : null;
                return (
                  <tr key={t.type} className={`border-b last:border-0 ${t.type === "clean" ? "border-t-2" : ""}`}>
                    <td className="py-1.5 pr-3" title={t.label}><span className="font-mono text-xs mr-1.5">{t.type}</span><span className="text-muted-foreground">{t.label}</span></td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{t.rejected} / {t.n}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{tb ? `${tb.rejected} / ${tb.n}` : "–"}</td>
                    <td className="py-1.5 text-right tabular-nums">{diff === null ? "–" : `${diff > 0 ? "+" : ""}${Math.round(diff)} pp`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">For clean items a lower share is better.</p>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold mb-3">Items where A and B differ ({discordant.length})</h4>
        {discordant.length === 0 ? <p className="text-sm text-muted-foreground">The two runs agree on every common item.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 pr-3 font-medium">A</th>
                  <th className="py-2 font-medium">B</th>
                </tr>
              </thead>
              <tbody>
                {discordant.map((r) => (
                  <tr key={r.attempt_id} className="border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top" onClick={() => onOpenItem(r.attempt_id)}>
                    <td className="py-2 pr-3 font-mono text-xs">{r.attempt_id}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{r.planted_type}</td>
                    {([[r.a_rejected, r.aStages, r.aCodes], [r.b_rejected, r.bStages, r.bCodes]] as const).map(([rejected, stages, codes], i) => (
                      <td key={i} className="py-2 pr-3">
                        <Badge variant="outline" className="mr-1.5">{rejected ? "rejected" : "accepted"}</Badge>
                        {stages.map((s) => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0 mr-1">{s}</Badge>)}
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
