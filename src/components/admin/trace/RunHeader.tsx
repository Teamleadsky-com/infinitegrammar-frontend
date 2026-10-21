import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatUsd } from "../dashboardShared";
import { NO_TIME, formatHmm, pctOf } from "@/lib/pipelineTrace";
import { TraceRun } from "./types";

const Tile = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Card className="p-4 space-y-1">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    {children}
  </Card>
);

const Line = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-3 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="tabular-nums text-right">
      {value}
      {sub !== undefined && <span className="text-xs text-muted-foreground ml-1">{sub}</span>}
    </span>
  </div>
);

/** Totals of the run (spec §5.5.2). */
export const RunHeader = ({ run }: { run: TraceRun }) => {
  const of = (n: number | null) => (n === null ? undefined : pctOf(n, run.attempts));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <Tile label="Exercises">
          <Line label="Requested" value={run.requested ?? NO_TIME} />
          <Line label="Attempts" value={run.attempts ?? NO_TIME} />
          <Line label="Accepted" value={<span className="text-green-700 dark:text-green-400 font-semibold">{run.accepted ?? 0}</span>} sub={of(run.accepted)} />
          <Line label="Rejected" value={<span className="text-red-700 dark:text-red-400 font-semibold">{run.rejected ?? 0}</span>} sub={of(run.rejected)} />
          <Line label="Unfinished" value={run.unfinished ?? 0} sub={of(run.unfinished)} />
        </Tile>
        <Tile label="Result">
          <Line label="Yield" value={run.yieldPct === null ? NO_TIME : `${run.yieldPct}%`} sub="accepted / (accepted + rejected)" />
          <Line label="Requested met" value={run.requestedMetPct === null ? NO_TIME : `${run.requestedMetPct}%`} sub="accepted / requested" />
        </Tile>
        <Tile label="Cost">
          <p className="text-2xl font-semibold tabular-nums">{formatUsd(run.spentUsd)}</p>
          <Line label="Per accepted exercise" value={formatUsd(run.usdPerAccepted)} />
        </Tile>
        <Tile label="Duration">
          <p className="text-2xl font-semibold tabular-nums">{formatHmm(run.durationSeconds)}{run.durationSeconds !== null && <span className="text-sm font-normal text-muted-foreground"> h:mm</span>}</p>
          <Line label="Started" value={formatDateTime(run.startedAt)} />
          <Line label="Finished" value={run.finishedAt ? formatDateTime(run.finishedAt) : NO_TIME} />
          {run.mode === "batch" && (
            <p className="text-xs text-muted-foreground pt-1">Batch API: durations include the queue time and any pause before a resume.</p>
          )}
        </Tile>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge>{run.kind}</Badge>
        {run.mode && <Badge variant="outline">{run.mode}</Badge>}
        {run.status && <Badge variant={run.status === "failed" ? "destructive" : "outline"}>{run.status}</Badge>}
        <span className="text-muted-foreground">Config</span>
        <span className="font-mono text-xs">{run.config || NO_TIME}</span>
        <span className="text-muted-foreground ml-2">Verifier</span>
        <span className="font-mono text-xs">{run.verifierVersion || NO_TIME}</span>
      </div>
      {run.stageDefsSnapshot === false && (
        <p className="text-xs rounded border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2">
          Stage settings were rebuilt from today's code (run from before 2026-10-21). The models of every call are exact.
        </p>
      )}
    </div>
  );
};
