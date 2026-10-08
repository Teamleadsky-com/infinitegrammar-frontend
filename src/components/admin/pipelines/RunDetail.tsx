import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchJson, formatPct, formatUsd } from "../dashboardShared";

export type PipelineRun = {
  runId: string;
  kind: string;
  config: string | null;
  verifierVersion: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  status: string | null;
  attempts: number | null;
  accepted: number | null;
  rejected: number | null;
  unfinished: number | null;
  firstPass: number | null;
  repairedAccepted: number | null;
  spentUsd: number | null;
  yieldPct: number | null;
  usdPerAccepted: number | null;
};

type Detail = {
  funnel: Array<{ stepOrder: number; step: string; nIn: number; nOut: number; dropReasons: Record<string, number> }>;
  costs: Array<{ stage: string; stageOrder: number; model: string; requests: number; attempts: number; inputTokens: number; outputTokens: number; reasoningTokens: number; costUsd: number }>;
  levels: Array<{ level: string; attempts: number; accepted: number; rejected: number; yieldPct: number | null }>;
  issueLabels: Record<string, string>;
};

const MODEL_COLORS = ["hsl(221, 83%, 53%)", "hsl(25, 90%, 52%)", "hsl(142, 64%, 38%)", "hsl(270, 50%, 60%)", "hsl(0, 72%, 51%)", "hsl(199, 80%, 45%)"];
const fmtInt = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toLocaleString());

const Funnel = ({ funnel, labels }: { funnel: Detail["funnel"]; labels: Record<string, string> }) => {
  const top = Math.max(1, ...funnel.map((f) => f.nIn));
  return (
    <div className="space-y-3">
      {funnel.map((f) => {
        const drops = Object.entries(f.dropReasons || {}).sort((a, b) => b[1] - a[1]);
        const dropped = f.nIn - f.nOut;
        return (
          <div key={f.step}>
            <div className="flex items-baseline justify-between text-sm mb-1">
              <span className="font-medium capitalize">{f.step}</span>
              <span className="text-muted-foreground">
                {fmtInt(f.nIn)} → <span className="font-semibold text-foreground">{fmtInt(f.nOut)}</span>
                {dropped > 0 && <span className="text-destructive"> (−{fmtInt(dropped)})</span>}
              </span>
            </div>
            <div className="h-3 rounded bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(100 * f.nOut) / top}%` }} />
            </div>
            {drops.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {drops.slice(0, 6).map(([code, n]) => (
                  <Badge key={code} variant="outline" className="text-[10px]" title={labels[code] || code}>
                    {code} {labels[code] ? `· ${labels[code]}` : ""}: {n}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const RunDetail = ({ apiBase, run }: { apiBase: string; run: PipelineRun }) => {
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    setDetail(null);
    fetchJson<Detail>(`${apiBase}/admin-pipeline-run-detail?run_id=${encodeURIComponent(run.runId)}`)
      .then(setDetail)
      .catch(() => setDetail({ funnel: [], costs: [], levels: [], issueLabels: {} }));
  }, [apiBase, run.runId]);

  const { costData, models } = useMemo(() => {
    const models = [...new Set((detail?.costs || []).map((c) => c.model))];
    const byStage = new Map<string, Record<string, number | string>>();
    for (const c of [...(detail?.costs || [])].sort((a, b) => a.stageOrder - b.stageOrder)) {
      const row = byStage.get(c.stage) || { stage: c.stage };
      row[c.model] = ((row[c.model] as number) || 0) + c.costUsd;
      byStage.set(c.stage, row);
    }
    return { costData: [...byStage.values()], models };
  }, [detail]);

  return (
    <Card className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold mr-2">{run.runId}</h3>
        <Badge variant="outline">{run.kind}</Badge>
        {run.config && <Badge variant="secondary">{run.config}</Badge>}
        {run.status && <Badge variant={run.status === "failed" ? "destructive" : "outline"}>{run.status}</Badge>}
        <span className="text-sm text-muted-foreground">
          {formatUsd(run.spentUsd)} spent · {fmtInt(run.accepted)} accepted · {fmtInt(run.rejected)} rejected · yield {formatPct(run.yieldPct)}
        </span>
      </div>

      {!detail ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Funnel</h4>
            <p className="text-xs text-muted-foreground mb-3">An attempt drops at the first check its final version fails, after any repairs.</p>
            {detail.funnel.length === 0 ? <p className="text-sm text-muted-foreground">No funnel recorded for this run.</p> : <Funnel funnel={detail.funnel} labels={detail.issueLabels} />}
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Yield by level</h4>
              {detail.levels.length === 0 ? (
                <p className="text-sm text-muted-foreground">No per-level numbers for this run.</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={detail.levels} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="level" />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip formatter={(v: number, _n, p: any) => [`${v}% (${p.payload.accepted}/${p.payload.attempts})`, "Yield"]} />
                    <Bar dataKey="yieldPct" fill="hsl(142, 64%, 38%)" isAnimationActive={false} label={{ position: "top", fontSize: 11, formatter: (v: number) => `${v}%` }} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="xl:col-span-2">
            <h4 className="text-sm font-semibold mb-2">Cost per stage and model</h4>
            {detail.costs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No per-stage costs for this run{run.kind === "live_audit" ? " (live audits record only their total)" : ""}. Total: {formatUsd(run.spentUsd)}.
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={costData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="stage" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v: number) => formatUsd(v)} />
                    <Tooltip formatter={(v: number, name: string) => [formatUsd(v), name]} />
                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
                    {models.map((m, i) => (
                      <Bar key={m} dataKey={m} stackId="cost" fill={MODEL_COLORS[i % MODEL_COLORS.length]} isAnimationActive={false} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">Stage</th>
                        <th className="py-2 pr-3 font-medium">Model</th>
                        <th className="py-2 pr-3 font-medium text-right">Requests</th>
                        <th className="py-2 pr-3 font-medium text-right">Attempts</th>
                        <th className="py-2 pr-3 font-medium text-right">Input tok</th>
                        <th className="py-2 pr-3 font-medium text-right">Output tok</th>
                        <th className="py-2 pr-3 font-medium text-right">Reasoning tok</th>
                        <th className="py-2 font-medium text-right">$</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.costs.map((c) => (
                        <tr key={`${c.stage}-${c.model}`} className="border-b last:border-0">
                          <td className="py-1.5 pr-3">{c.stage}</td>
                          <td className="py-1.5 pr-3 text-muted-foreground">{c.model}</td>
                          <td className="py-1.5 pr-3 text-right">{fmtInt(c.requests)}</td>
                          <td className="py-1.5 pr-3 text-right">{fmtInt(c.attempts)}</td>
                          <td className="py-1.5 pr-3 text-right">{fmtInt(c.inputTokens)}</td>
                          <td className="py-1.5 pr-3 text-right">{fmtInt(c.outputTokens)}</td>
                          <td className="py-1.5 pr-3 text-right">{fmtInt(c.reasoningTokens)}</td>
                          <td className="py-1.5 text-right font-medium">{formatUsd(c.costUsd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
