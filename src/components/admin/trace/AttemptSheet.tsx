import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchJson, formatDateTime } from "../dashboardShared";
import {
  NO_TIME,
  TraceExercise,
  diffExercise,
  exercisesDiffer,
  formatCost,
  formatSeconds,
  formatTokens,
  shortAttemptId,
  shortIterationLabel,
  verdictGroup,
} from "@/lib/pipelineTrace";
import { ExerciseView, IssueCodeChips, StatusChip, VerdictChip } from "./TraceBits";
import { AttemptTable } from "./AttemptTable";
import { AttemptDetail, AttemptQuery, AttemptRow, TraceStep } from "./types";

const DOT = { passed: "bg-green-500", retry: "bg-amber-500", failed: "bg-red-500", other: "bg-muted-foreground/50" };

const stageLabelOf = (stage: string, labels: Record<string, string>) => labels[stage] || stage;

/** The exercise a step entered / left, with "Show changes" when the two differ. */
const StepExercise = ({ step, versions }: { step: TraceStep; versions: Record<string, TraceExercise> }) => {
  const entered = step.inputVersion ? versions[step.inputVersion] : null;
  const left = step.outputVersion ? versions[step.outputVersion] : null;
  const [which, setWhich] = useState<"in" | "out" | null>(null);
  const [changes, setChanges] = useState(false);
  const differ = exercisesDiffer(entered, left);
  const shown = which === "in" ? entered : which === "out" ? left : null;
  const other = which === "in" ? left : entered;
  if (!entered && !left) return null;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">Exercise</span>
        <Button variant={which === "in" ? "default" : "outline"} size="sm" className="h-7" disabled={!entered} onClick={() => setWhich(which === "in" ? null : "in")}>entered</Button>
        <Button variant={which === "out" ? "default" : "outline"} size="sm" className="h-7" disabled={!left} onClick={() => setWhich(which === "out" ? null : "out")}>left</Button>
        {entered && left && !differ && <span className="text-xs text-muted-foreground">unchanged by this step</span>}
        {shown && differ && (
          <Button variant={changes ? "secondary" : "ghost"} size="sm" className="h-7" onClick={() => setChanges(!changes)}>
            {changes ? "Hide changes" : "Show changes"}
          </Button>
        )}
      </div>
      {shown && (
        <div className="rounded border p-3 bg-background">
          {changes && differ && other && (
            <p className="text-xs text-muted-foreground mb-2">Highlighted: what differs from the version the step {which === "in" ? "returned" : "received"}.</p>
          )}
          <ExerciseView exercise={shown} diff={changes && differ && other ? diffExercise(shown, other) : null} />
        </div>
      )}
    </div>
  );
};

const StepCard = ({
  step,
  versions,
  stageLabels,
  issueLabels,
}: {
  step: TraceStep;
  versions: Record<string, TraceExercise>;
  stageLabels: Record<string, string>;
  issueLabels: Record<string, string>;
}) => {
  const [more, setMore] = useState(false);
  const group = verdictGroup(step.verdict);
  // The model's or the rule's own output; always present on retry and failed steps
  const showFeedback = !!step.feedback?.trim();
  const hasDetails = Object.keys(step.details || {}).length > 0;
  return (
    <li className="relative pl-6">
      <span className={cn("absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ring-background", DOT[group])} />
      <div className="space-y-2 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{stageLabelOf(step.stage, stageLabels)}</span>
          <span className="text-sm text-muted-foreground">· {shortIterationLabel(step.stage, step.iteration)}</span>
          <VerdictChip verdict={step.verdict} />
          <IssueCodeChips codes={step.issueCodes} labels={issueLabels} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{step.models.length ? step.models.join(", ") : "rules, no model"}</span>
          <span>{formatCost(step.costUsd)} · {step.calls} call{step.calls === 1 ? "" : "s"}</span>
          {(step.inputTokens || step.outputTokens) ? (
            <span>{formatTokens(step.inputTokens)} in · {formatTokens(step.outputTokens)} out · {formatTokens(step.reasoningTokens)} reasoning</span>
          ) : null}
          <span>{step.startedAt ? `${formatDateTime(step.startedAt)} → ${formatDateTime(step.finishedAt)}` : `time ${NO_TIME}`}</span>
          <span>call time {formatSeconds(step.callSeconds)}</span>
        </div>
        {showFeedback && (
          <div>
            <p className="text-xs font-medium mb-1">Feedback</p>
            <pre className={cn(
              "text-xs whitespace-pre-wrap break-words rounded p-2.5 border font-sans leading-relaxed",
              group === "failed" ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
                : group === "retry" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900" : "bg-muted/50",
            )}>{step.feedback}</pre>
          </div>
        )}
        <StepExercise step={step} versions={versions} />
        {hasDetails && (
          <div>
            <button type="button" className="text-xs underline decoration-dotted underline-offset-4" onClick={() => setMore(!more)}>
              {more ? "Less" : "More"} (details)
            </button>
            {more && <pre className="mt-1 text-[11px] rounded bg-muted p-2.5 overflow-x-auto max-h-96">{JSON.stringify(step.details, null, 2)}</pre>}
          </div>
        )}
      </div>
    </li>
  );
};

const AttemptDetailView = ({
  apiBase,
  runId,
  attemptId,
  stageLabels,
  issueLabels,
  onOpenExercise,
}: {
  apiBase: string;
  runId: string;
  attemptId: string;
  stageLabels: Record<string, string>;
  issueLabels: Record<string, string>;
  onOpenExercise: (exerciseId: string) => void;
}) => {
  const [data, setData] = useState<AttemptDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setData(null);
    setError(null);
    fetchJson<AttemptDetail>(`${apiBase}/admin-pipeline-trace-attempt?run_id=${encodeURIComponent(runId)}&attempt_id=${encodeURIComponent(attemptId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [apiBase, runId, attemptId]);

  if (error) return <p className="text-sm text-destructive mt-4">Could not load the attempt: {error}</p>;
  if (!data) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  const a = data.attempt;
  const linkable = a.runKind === "production" && !!a.exerciseId && (a.status === "accepted" || a.status === "rejected");
  return (
    <div className="space-y-5 mt-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={a.status} />
          {a.level && <Badge>{a.level}</Badge>}
          <Badge variant="outline">{a.sectionName || a.sectionId || "–"}</Badge>
          <IssueCodeChips codes={a.issueCodes} labels={issueLabels} />
        </div>
        <p className="text-sm"><span className="text-muted-foreground">Topic</span> {a.contentTopic || "–"}</p>
        {a.scene && <p className="text-sm"><span className="text-muted-foreground">Scene</span> {a.scene}</p>}
        <p className="text-sm text-muted-foreground">
          {formatCost(a.costUsd)} · {a.calls} calls · {a.steps} steps · call time {formatSeconds(a.callSeconds)}
        </p>
        {linkable && (
          <Button variant="outline" size="sm" className="gap-1" onClick={() => onOpenExercise(a.exerciseId!)}>
            <ExternalLink className="h-3.5 w-3.5" /> Open exercise in the Quality tab
          </Button>
        )}
      </div>
      <ol className="border-l ml-1.5 pl-0 space-y-0 [&>li]:-ml-[7px]">
        {data.steps.map((s) => (
          <StepCard key={s.stepOrder} step={s} versions={data.versions} stageLabels={stageLabels} issueLabels={issueLabels} />
        ))}
      </ol>
    </div>
  );
};

/**
 * Side panel of the trace: the attempts behind a count (query), and the detail of one attempt
 * (spec §5.5.4–5.5.5). From a list, "Back" returns to it.
 */
export const AttemptSheet = ({
  apiBase,
  runId,
  query,
  attemptId,
  stageLabels,
  issueLabels,
  onOpenAttempt,
  onBack,
  onClose,
  onOpenExercise,
}: {
  apiBase: string;
  runId: string;
  query: AttemptQuery | null;
  attemptId: string | null;
  stageLabels: Record<string, string>;
  issueLabels: Record<string, string>;
  onOpenAttempt: (attemptId: string) => void;
  onBack: () => void;
  onClose: () => void;
  onOpenExercise: (exerciseId: string) => void;
}) => {
  const [rows, setRows] = useState<AttemptRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setRows(null);
    setError(null);
    const params = new URLSearchParams({ run_id: runId, stage: query.stage, iteration: String(query.iteration) });
    if (query.verdicts) params.set("verdicts", query.verdicts.join(","));
    if (query.minIteration) params.set("min_iteration", String(query.minIteration));
    fetchJson<{ attempts: AttemptRow[] }>(`${apiBase}/admin-pipeline-trace-attempts?${params}`)
      .then((d) => setRows(d.attempts))
      .catch((e) => setError(e.message));
  }, [apiBase, runId, query]);

  const open = !!query || !!attemptId;
  // While the sheet animates closed, keep showing what it showed (the props are already cleared)
  const shownRef = useRef({ query, attemptId });
  if (open) shownRef.current = { query, attemptId };
  const shownQuery = shownRef.current.query;
  const shownAttempt = shownRef.current.attemptId;
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader>
          {shownAttempt && shownQuery && (
            <Button variant="ghost" size="sm" className="self-start -ml-2 gap-1" onClick={onBack}><ArrowLeft className="h-4 w-4" />Back to the list</Button>
          )}
          <SheetTitle>{shownAttempt ? "Attempt" : shownQuery?.title}</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">
            {shownAttempt ? shortAttemptId(shownAttempt, runId) : `${rows ? rows.length : "…"} attempts · ${runId}`}
          </SheetDescription>
        </SheetHeader>
        {shownAttempt ? (
          <AttemptDetailView apiBase={apiBase} runId={runId} attemptId={shownAttempt} stageLabels={stageLabels} issueLabels={issueLabels} onOpenExercise={onOpenExercise} />
        ) : error ? (
          <p className="text-sm text-destructive mt-4">Could not load the attempts: {error}</p>
        ) : !rows || !shownQuery ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="mt-4">
            <AttemptTable rows={rows} runId={runId} stage={shownQuery.stage} issueLabels={issueLabels} onOpen={onOpenAttempt} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
