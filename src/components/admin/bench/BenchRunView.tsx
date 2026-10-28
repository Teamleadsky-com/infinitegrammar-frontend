import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, levelRank } from "../dashboardShared";
import { IssueCodeChips } from "../trace/TraceBits";
import { formatCost, formatSeconds, shortAttemptId } from "@/lib/pipelineTrace";
import { rateWithN } from "@/lib/bench";
import { VerdictBadge } from "./BenchItemSheet";
import { BenchItemRow, BenchTypeMetric } from "./types";

type RunData = {
  types: Array<BenchTypeMetric & { rejectedExpected: number; nWithGap: number; atGap: number }>;
  stages: Array<{ stage: string; label: string; order: number; plantedN: number; plantedFlagged: number; ownN: number; ownFlagged: number; ownRecallPct: number | null; cleanN: number; cleanFlagged: number; cleanFlaggedPct: number | null }>;
};

const C = { planted: "hsl(262, 83%, 58%)", clean: "hsl(25, 90%, 52%)" };

/** Bars per defect type: share rejected, "k / n"; the clean bar (false rejects, lower is better) below a divider. */
export const TypeBars = ({ types }: { types: BenchTypeMetric[] }) => {
  const planted = types.filter((t) => t.type !== "clean");
  const clean = types.find((t) => t.type === "clean");
  const Bar = ({ t, color }: { t: BenchTypeMetric; color: string }) => (
    <div className="grid grid-cols-[minmax(10rem,18rem)_1fr_4.5rem] items-center gap-3 text-sm" title={t.label}>
      <span className="truncate"><span className="font-mono text-xs mr-1.5">{t.type}</span>{t.label}</span>
      <div className="h-4 rounded bg-muted/60 overflow-hidden">
        <div className="h-full rounded" style={{ width: `${t.rejectedPct ?? 0}%`, background: color, minWidth: t.rejected ? 3 : 0 }} />
      </div>
      <span className="tabular-nums text-right">{t.rejected} / {t.n}</span>
    </div>
  );
  return (
    <div className="space-y-1.5">
      {planted.map((t) => <Bar key={t.type} t={t} color={C.planted} />)}
      {clean && (
        <>
          <div className="border-t my-2" />
          <p className="text-xs text-muted-foreground">Clean items rejected: false rejects, lower is better</p>
          <Bar t={clean} color={C.clean} />
        </>
      )}
    </div>
  );
};

export const BenchRunView = ({ apiBase, runId, onOpenItem }: { apiBase: string; runId: string; onOpenItem: (attemptId: string) => void }) => {
  const [data, setData] = useState<RunData | null>(null);
  const [items, setItems] = useState<BenchItemRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({ type: "all", verdict: "all", level: "all", section: "all", calibration: "all", source: "all" });

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

  const visible = (items || []).filter(
    (i) =>
      (f.type === "all" || i.plantedType === f.type) &&
      (f.verdict === "all" || (f.verdict === "rejected") === i.rejected) &&
      (f.level === "all" || i.level === f.level) &&
      (f.section === "all" || i.sectionId === f.section) &&
      (f.calibration === "all" || String(!!i.seenInCalibration) === f.calibration) &&
      (f.source === "all" || i.cleanSource === f.source),
  );

  const filter = (key: keyof typeof f, label: string, values: Array<[string, string]>, width = "w-[150px]") => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={f[key]} onValueChange={(v) => setF({ ...f, [key]: v })}>
        <SelectTrigger className={`${width} h-9`}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {values.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  if (error) return <p className="text-sm text-destructive">Could not load the run: {error}</p>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By defect type</h4>
          <p className="text-sm text-muted-foreground mb-3">Share of the items of each type the setup rejected.</p>
          {!data ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : data.types.length === 0 ? <p className="text-sm text-muted-foreground">No finished items.</p> : <TypeBars types={data.types} />}
        </Card>
        <Card className="p-4 md:p-6">
          <h4 className="font-semibold">By defect type: details</h4>
          <p className="text-sm text-muted-foreground mb-3">Expected = rejected with an issue code of that type; at gap = a failing stage named the planted gap.</p>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-1.5 pr-3 font-medium">Type</th>
                    <th className="py-1.5 pr-3 font-medium text-right">n</th>
                    <th className="py-1.5 pr-3 font-medium text-right">Rejected</th>
                    <th className="py-1.5 pr-3 font-medium text-right">Expected</th>
                    <th className="py-1.5 font-medium text-right">At gap</th>
                  </tr>
                </thead>
                <tbody>
                  {data.types.map((t) => (
                    <tr key={t.type} className={`border-b last:border-0 ${t.type === "clean" ? "border-t-2" : ""}`}>
                      <td className="py-1.5 pr-3 font-mono text-xs" title={t.label}>{t.type}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{t.n}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{t.rejected}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{t.type === "clean" ? "–" : t.rejectedExpected}</td>
                      <td className="py-1.5 text-right tabular-nums">{t.nWithGap ? `${t.atGap} / ${t.nWithGap}` : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold">By stage</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Every stage checks every item (verify-only). A stage that flags clean items often is the first place to look when false rejects are high.
        </p>
        {data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Stage</th>
                  <th className="py-2 pr-3 font-medium text-right">Planted flagged</th>
                  <th className="py-2 pr-3 font-medium text-right">Own types flagged</th>
                  <th className="py-2 font-medium text-right">Clean flagged (false alarms)</th>
                </tr>
              </thead>
              <tbody>
                {data.stages.map((s) => (
                  <tr key={s.stage} className="border-b last:border-0">
                    <td className="py-2 pr-3">{s.label}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.plantedFlagged} / {s.plantedN}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{s.ownFlagged} / {s.ownN} <span className="text-muted-foreground">· {rateWithN(s.ownRecallPct, s.ownN)}</span></td>
                    <td className="py-2 text-right tabular-nums">{s.cleanFlagged} / {s.cleanN} <span className="text-muted-foreground">· {rateWithN(s.cleanFlaggedPct, s.cleanN)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="font-semibold mb-3">Items</h4>
        {!items ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : (
          <>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              {filter("type", "Defect type", options.types.map((t) => [t, t]), "w-[120px]")}
              {filter("verdict", "Verdict", [["rejected", "rejected"], ["accepted", "accepted"]], "w-[130px]")}
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
                    <th className="py-2 pr-3 font-medium">Verdict</th>
                    <th className="py-2 pr-3 font-medium">Flagged by</th>
                    <th className="py-2 pr-3 font-medium">Codes</th>
                    <th className="py-2 pr-3 font-medium">Expected · at gap</th>
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
                      <td className="py-2 pr-3">{i.done ? <VerdictBadge plantedType={i.plantedType} rejected={i.rejected} /> : <Badge variant="outline">{i.status}</Badge>}</td>
                      <td className="py-2 pr-3"><div className="flex flex-wrap gap-1">{i.flaggedStages.map((s) => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}</div></td>
                      <td className="py-2 pr-3"><IssueCodeChips codes={i.flaggedCodes} labels={{}} /></td>
                      <td className="py-2 pr-3 text-xs">{i.plantedType === "clean" ? "–" : `${i.expectedHit ? "yes" : "no"} · ${i.atGap === null ? "–" : i.atGap ? "yes" : "no"}`}</td>
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
