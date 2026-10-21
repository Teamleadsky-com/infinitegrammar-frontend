import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, formatDate } from "./dashboardShared";
import { RunHeader } from "./trace/RunHeader";
import { StageCard } from "./trace/StageCard";
import { Definitions } from "./trace/Definitions";
import { AttemptTable } from "./trace/AttemptTable";
import { AttemptSheet } from "./trace/AttemptSheet";
import { AttemptQuery, AttemptRow, TraceData, TraceRun } from "./trace/types";

const KINDS = [
  { key: "all", label: "All kinds" },
  { key: "production", label: "Production" },
  { key: "experiment", label: "Experiment" },
  { key: "regression", label: "Regression" },
];

/**
 * Pipeline trace (generator spec §5.5): one generation run, stage by stage from top to bottom,
 * with the counts, reasons, cost and times of every stage and iteration, what each stage runs,
 * and every attempt step by step. The run comes from the URL (?run=<run_id>).
 */
export const PipelineTraceDashboard = ({ apiBase, onOpenExercise }: { apiBase: string; onOpenExercise: (exerciseId: string) => void }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [runs, setRuns] = useState<TraceRun[] | null>(null);
  const [kind, setKind] = useState("all");
  const [trace, setTrace] = useState<TraceData | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState("stages");
  const [query, setQuery] = useState<AttemptQuery | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ runs: TraceRun[] }>(`${apiBase}/admin-pipeline-trace-runs`)
      .then((d) => setRuns(d.runs))
      .catch((e) => setError(e.message));
  }, [apiBase]);

  const requested = searchParams.get("run");
  const run = useMemo(() => {
    if (!runs) return null;
    return runs.find((r) => r.runId === requested) || runs.find((r) => r.kind === "production") || runs[0] || null;
  }, [runs, requested]);
  const runId = run?.runId || null;

  useEffect(() => {
    if (!runId) return;
    setTrace(null);
    setAttempts(null);
    setQuery(null);
    setAttemptId(null);
    fetchJson<TraceData>(`${apiBase}/admin-pipeline-trace?run_id=${encodeURIComponent(runId)}`)
      .then(setTrace)
      .catch((e) => setError(e.message));
  }, [apiBase, runId]);

  useEffect(() => {
    if (!runId || view !== "attempts" || attempts) return;
    fetchJson<{ attempts: AttemptRow[] }>(`${apiBase}/admin-pipeline-trace-attempts?run_id=${encodeURIComponent(runId)}`)
      .then((d) => setAttempts(d.attempts))
      .catch((e) => setError(e.message));
  }, [apiBase, runId, view, attempts]);

  const selectRun = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("run", id);
    setSearchParams(next, { replace: true });
  };

  const pickable = (runs || []).filter((r) => kind === "all" || r.kind === kind || r.runId === runId);
  const stageLabels = Object.fromEntries((trace?.stages || []).map((s) => [s.stage, s.stageLabel]));
  const issueLabels = trace?.issueLabels || {};

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">Could not load the pipeline trace: {error}</p>}

      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Pipeline trace</h3>
            <p className="text-sm text-muted-foreground">One generation run, stage by stage: what each stage runs, how many exercises enter, pass and fail it, why, what it costs and how long it takes. Click any count to see those exercises.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div>
              <Label className="text-xs">Kind</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{KINDS.map((k) => <SelectItem key={k.key} value={k.key}>{k.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Run</Label>
              <Select value={runId || ""} onValueChange={selectRun} disabled={!runs}>
                <SelectTrigger className="w-[min(520px,80vw)] h-9"><SelectValue placeholder="Loading runs…" /></SelectTrigger>
                <SelectContent className="max-h-[60vh]">
                  {pickable.map((r) => (
                    <SelectItem key={r.runId} value={r.runId}>
                      <span className="font-mono text-xs">{r.runId}</span>
                      <span className="text-muted-foreground text-xs"> · {r.config || "–"} · {r.kind} · {formatDate(r.startedAt)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {!runs ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : !run ? (
          <p className="text-sm text-muted-foreground">No run has a trace yet.</p>
        ) : (
          <RunHeader run={run} />
        )}
      </Card>

      {run && (
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="stages">Stages</TabsTrigger>
            <TabsTrigger value="attempts">All attempts{run.attempts ? ` (${run.attempts})` : ""}</TabsTrigger>
          </TabsList>

          <TabsContent value="stages" className="space-y-0 mt-4">
            <div className="mb-4"><Definitions /></div>
            {!trace ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : trace.stages.length === 0 ? (
              <p className="text-sm text-muted-foreground">This run has no stage records.</p>
            ) : (
              trace.stages.map((s, i) => (
                <div key={s.stage}>
                  {i > 0 && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground" aria-hidden>
                      <ArrowDown className="h-5 w-5" />
                      <span>{s.nIn} in</span>
                    </div>
                  )}
                  <StageCard
                    position={i + 1}
                    stage={s}
                    iterations={trace.iterations.filter((it) => it.stage === s.stage)}
                    issues={trace.issues.filter((it) => it.stage === s.stage)}
                    defs={trace.stageDefs.filter((d) => d.stage === s.stage)}
                    onOpen={(q) => { setAttemptId(null); setQuery(q); }}
                  />
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="attempts" className="mt-4">
            <Card className="p-4 md:p-6">
              {!attempts ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <AttemptTable rows={attempts} runId={run.runId} issueLabels={issueLabels} onOpen={(id) => { setQuery(null); setAttemptId(id); }} filters />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {run && (
        <AttemptSheet
          apiBase={apiBase}
          runId={run.runId}
          query={query}
          attemptId={attemptId}
          stageLabels={stageLabels}
          issueLabels={issueLabels}
          onOpenAttempt={setAttemptId}
          onBack={() => setAttemptId(null)}
          onClose={() => { setQuery(null); setAttemptId(null); }}
          onOpenExercise={onOpenExercise}
        />
      )}
    </div>
  );
};
