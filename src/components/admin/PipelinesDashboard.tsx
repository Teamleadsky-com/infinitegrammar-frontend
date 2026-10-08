import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, formatDate, formatDateTime, formatPct, formatSamplePct, formatUsd } from "./dashboardShared";
import { PipelineRun, RunDetail } from "./pipelines/RunDetail";

type ConfigRow = {
  config: string;
  models: string | null;
  reasoningEffort: string | null;
  decisionId: string | null;
  status: string;
  decidedOn: string | null;
  notes: string | null;
  runs: number | null;
  attempts: number | null;
  yieldPct: number | null;
  firstPassPct: number | null;
  usdPerAccepted: number | null;
  usdPerClean: number | null;
  auditN: number | null;
  cleanPct: number | null;
  minorPct: number | null;
  flawedPct: number | null;
};

const KINDS = [
  { key: "all", label: "All kinds" },
  { key: "production", label: "Production" },
  { key: "live_audit", label: "Live audit" },
  { key: "experiment", label: "Experiment" },
];

const duration = (start: string | null, end: string | null) => {
  if (!start || !end) return "—";
  const min = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`;
};

const TrendChart = ({ title, data, dataKey, format, unit }: { title: string; data: any[]; dataKey: string; format: (v: number) => string; unit?: string }) => (
  <Card className="p-4">
    <h4 className="text-sm font-semibold mb-2">{title}</h4>
    {data.length < 2 ? (
      <p className="text-sm text-muted-foreground">Needs at least two finished production runs.</p>
    ) : (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={format} unit={unit} width={56} />
          <Tooltip formatter={(v: number) => format(v)} labelFormatter={(_l, p: any) => p?.[0]?.payload?.runId ?? ""} />
          <Line type="monotone" dataKey={dataKey} stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </Card>
);

export const PipelinesDashboard = ({ apiBase }: { apiBase: string }) => {
  const [runs, setRuns] = useState<PipelineRun[] | null>(null);
  const [configs, setConfigs] = useState<ConfigRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<PipelineRun | null>(null);

  useEffect(() => {
    fetchJson<{ runs: PipelineRun[] }>(`${apiBase}/admin-pipeline-runs`)
      .then((d) => setRuns(d.runs))
      .catch((e) => setError(e.message));
    fetchJson<{ configs: ConfigRow[] }>(`${apiBase}/admin-config-scoreboard`)
      .then((d) => setConfigs(d.configs))
      .catch((e) => setError(e.message));
  }, [apiBase]);

  const statuses = useMemo(() => [...new Set((runs || []).map((r) => r.status).filter(Boolean))] as string[], [runs]);
  const visibleRuns = (runs || []).filter((r) => (kind === "all" || r.kind === kind) && (status === "all" || r.status === status));

  const trend = useMemo(
    () =>
      (runs || [])
        .filter((r) => r.kind === "production" && r.finishedAt && r.status !== "failed")
        .sort((a, b) => new Date(a.finishedAt!).getTime() - new Date(b.finishedAt!).getTime())
        .map((r) => ({ runId: r.runId, date: formatDate(r.finishedAt), usdPerAccepted: r.usdPerAccepted, yieldPct: r.yieldPct })),
    [runs],
  );

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-destructive">Could not load pipeline data: {error}</p>}

      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Pipeline runs</h3>
            <p className="text-sm text-muted-foreground">Generator runs, newest first. Yield = accepted / (accepted + rejected). Click a run for its funnel and costs.</p>
          </div>
          <div className="flex gap-2">
            <div>
              <Label className="text-xs">Kind</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{KINDS.map((k) => <SelectItem key={k.key} value={k.key}>{k.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {!runs ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : visibleRuns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Run</th>
                  <th className="py-2 pr-3 font-medium">Kind</th>
                  <th className="py-2 pr-3 font-medium">Config</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Started</th>
                  <th className="py-2 pr-3 font-medium">Duration</th>
                  <th className="py-2 pr-3 font-medium text-right">Attempts</th>
                  <th className="py-2 pr-3 font-medium text-right">Accepted</th>
                  <th className="py-2 pr-3 font-medium text-right">Rejected</th>
                  <th className="py-2 pr-3 font-medium text-right">Unfinished</th>
                  <th className="py-2 pr-3 font-medium text-right">Yield</th>
                  <th className="py-2 pr-3 font-medium text-right">$ total</th>
                  <th className="py-2 font-medium text-right">$ / accepted</th>
                </tr>
              </thead>
              <tbody>
                {visibleRuns.map((r) => (
                  <tr
                    key={r.runId}
                    className={`border-b last:border-0 cursor-pointer hover:bg-muted/40 ${selected?.runId === r.runId ? "bg-muted/60" : ""}`}
                    onClick={() => setSelected(r)}
                  >
                    <td className="py-2 pr-3 font-mono text-xs">{r.runId}</td>
                    <td className="py-2 pr-3">{r.kind}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.config || "—"}</td>
                    <td className="py-2 pr-3">
                      <Badge variant={r.status === "failed" ? "destructive" : "outline"}>{r.status || "—"}</Badge>
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">{formatDateTime(r.startedAt)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{duration(r.startedAt, r.finishedAt)}</td>
                    <td className="py-2 pr-3 text-right">{r.attempts ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{r.accepted ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{r.rejected ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{r.unfinished ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{formatPct(r.yieldPct)}</td>
                    <td className="py-2 pr-3 text-right">{formatUsd(r.spentUsd)}</td>
                    <td className="py-2 text-right">{formatUsd(r.usdPerAccepted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && <RunDetail apiBase={apiBase} run={selected} />}

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold">Config scoreboard</h3>
        <p className="text-sm text-muted-foreground mb-4">What each generator config cost and yielded, and how its output was graded in audits.</p>
        {!configs ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Config</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Models · effort</th>
                  <th className="py-2 pr-3 font-medium">Decision</th>
                  <th className="py-2 pr-3 font-medium text-right">Runs</th>
                  <th className="py-2 pr-3 font-medium text-right">Attempts</th>
                  <th className="py-2 pr-3 font-medium text-right">Yield</th>
                  <th className="py-2 pr-3 font-medium text-right">First-draft pass</th>
                  <th className="py-2 pr-3 font-medium text-right">$ / accepted</th>
                  <th className="py-2 pr-3 font-medium text-right">$ / clean</th>
                  <th className="py-2 font-medium">Audit (clean · minor · flawed)</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((c) => (
                  <tr key={c.config} className={`border-b last:border-0 align-top ${c.status === "production" ? "bg-green-50 dark:bg-green-950/30 font-medium" : ""}`}>
                    <td className="py-2 pr-3 font-mono text-xs">{c.config}</td>
                    <td className="py-2 pr-3"><Badge variant={c.status === "production" ? "default" : "outline"}>{c.status}</Badge></td>
                    <td className="py-2 pr-3 text-muted-foreground">{[c.models, c.reasoningEffort].filter(Boolean).join(" · ") || "—"}</td>
                    <td className="py-2 pr-3 text-muted-foreground" title={c.notes || undefined}>
                      {c.decisionId || "—"}{c.decidedOn ? ` · ${formatDate(c.decidedOn)}` : ""}
                    </td>
                    <td className="py-2 pr-3 text-right">{c.runs ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{c.attempts ?? "—"}</td>
                    <td className="py-2 pr-3 text-right">{formatPct(c.yieldPct)}</td>
                    <td className="py-2 pr-3 text-right">{formatPct(c.firstPassPct)}</td>
                    <td className="py-2 pr-3 text-right">{formatUsd(c.usdPerAccepted)}</td>
                    <td className="py-2 pr-3 text-right">{formatUsd(c.usdPerClean)}</td>
                    <td className="py-2 whitespace-nowrap">
                      {c.auditN ? `${formatSamplePct(c.cleanPct, c.auditN)} · ${formatPct(c.minorPct)} · ${formatPct(c.flawedPct)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Yield and cost are pooled over all of a config's runs, which used different test sets. For a fair comparison,
          compare configs that were tested together in the same experiment.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart title="$ per accepted exercise (production runs)" data={trend} dataKey="usdPerAccepted" format={(v) => formatUsd(v)} />
        <TrendChart title="Yield (production runs)" data={trend} dataKey="yieldPct" format={(v) => `${Math.round(v)}%`} />
      </div>
    </div>
  );
};
