import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson } from "../dashboardShared";
import { ExerciseView, IssueCodeChips } from "../trace/TraceBits";
import { AttemptDetailView } from "../trace/AttemptSheet";
import { TraceExercise, diffExercise, exercisesDiffer } from "@/lib/pipelineTrace";
import { verdictLabel, verdictRight } from "@/lib/bench";

// Stage names of the Pipeline trace (v_pipeline_stage_labels)
const STAGE_LABELS: Record<string, string> = {
  premise: "Scene premise",
  generation: "Generation",
  novelty: "Novelty check",
  gap_checks: "Gap checks and repair",
  distractor_gate: "Distractor gate (G7)",
  coherence: "Text coherence (G6)",
  final_gate: "Final gate",
};

type BenchItem = {
  attemptId: string;
  plantedType: string;
  typeLabel: string | null;
  plantedVariant: string | null;
  plantedAuthor: string | null;
  plantedNote: string | null;
  plantedGaps: number[];
  expectedCodes: string[];
  rejected: boolean;
  flaggedStages: string[];
  flaggedCodes: string[];
  expectedHit: boolean | null;
  atGap: boolean | null;
  seenInCalibration: boolean | null;
  cleanSource: string | null;
  cleanTwin: string | null;
};
type ItemData = { item: BenchItem; parentExercise: TraceExercise | null; itemExercise: TraceExercise | null };

export const VerdictBadge = ({ plantedType, rejected }: { plantedType: string; rejected: boolean }) => (
  <Badge
    variant="outline"
    className={
      verdictRight(plantedType, rejected)
        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300"
        : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300"
    }
  >
    {rejected ? "rejected" : "accepted"} · {verdictLabel(plantedType, rejected)}
  </Badge>
);

/**
 * A benchmark item (spec §5.6.5): what was planted, the item compared with its clean parent, and the steps
 * of each run (the Pipeline trace attempt view). With two runs, both runs' steps are shown.
 */
export const BenchItemSheet = ({
  apiBase,
  runs,
  attemptId,
  onOpenAttempt,
  onClose,
}: {
  apiBase: string;
  runs: Array<{ runId: string; label: string }>;
  attemptId: string | null;
  onOpenAttempt: (attemptId: string) => void;
  onClose: () => void;
}) => {
  const [data, setData] = useState<ItemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showParent, setShowParent] = useState(false);
  const runId = runs[0]?.runId;

  useEffect(() => {
    if (!attemptId || !runId) return;
    setData(null);
    setError(null);
    setShowParent(false);
    fetchJson<ItemData>(`${apiBase}/admin-bench-item?run_id=${encodeURIComponent(runId)}&attempt_id=${encodeURIComponent(attemptId)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [apiBase, runId, attemptId]);

  const it = data?.item;
  const canCompare = !!data?.parentExercise && !!data?.itemExercise && it?.plantedType !== "clean";
  return (
    <Sheet open={!!attemptId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Benchmark item</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">{attemptId}</SheetDescription>
        </SheetHeader>
        {error && <p className="text-sm text-destructive mt-4">Could not load the item: {error}</p>}
        {!data && !error && attemptId && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        {it && (
          <div className="space-y-5 mt-4">
            <div className="rounded border p-3 space-y-2 bg-muted/30">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{it.plantedType}</Badge>
                <span className="text-sm font-medium">{it.typeLabel}</span>
                {it.plantedVariant && <Badge variant="outline">{it.plantedVariant}</Badge>}
                {it.plantedAuthor && <Badge variant="secondary">by {it.plantedAuthor}</Badge>}
                {runs.length === 1 && <VerdictBadge plantedType={it.plantedType} rejected={it.rejected} />}
              </div>
              {it.plantedNote && <p className="text-sm">{it.plantedNote}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                {it.plantedGaps.length > 0 && <span>planted at gap {it.plantedGaps.join(", ")}</span>}
                {it.expectedCodes.length > 0 && <span className="inline-flex items-center gap-1">expected codes <IssueCodeChips codes={it.expectedCodes} labels={{}} /></span>}
                {it.cleanSource && <span>clean source: {it.cleanSource}</span>}
                {it.seenInCalibration && <span className="text-amber-700 dark:text-amber-400">seen in calibration</span>}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {canCompare && (
                  <Button variant={showParent ? "secondary" : "outline"} size="sm" onClick={() => setShowParent(!showParent)}>
                    {showParent ? "Hide the comparison" : "Compare with the clean parent"}
                  </Button>
                )}
                {it.cleanTwin && (
                  <Button variant="ghost" size="sm" onClick={() => onOpenAttempt(it.cleanTwin!)}>Open the clean twin</Button>
                )}
              </div>
            </div>

            {showParent && data?.itemExercise && data?.parentExercise && (
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded border p-3">
                  <p className="text-xs font-medium mb-2">This item (changes highlighted)</p>
                  <ExerciseView exercise={data.itemExercise} diff={diffExercise(data.itemExercise, data.parentExercise)} />
                </div>
                <div className="rounded border p-3">
                  <p className="text-xs font-medium mb-2">Clean parent</p>
                  <ExerciseView exercise={data.parentExercise} diff={exercisesDiffer(data.parentExercise, data.itemExercise) ? diffExercise(data.parentExercise, data.itemExercise) : null} />
                </div>
              </div>
            )}

            {runs.map((r) => (
              <div key={r.runId}>
                {runs.length > 1 && <h4 className="font-semibold text-sm border-b pb-1">{r.label}</h4>}
                <AttemptDetailView
                  apiBase={apiBase}
                  runId={r.runId}
                  attemptId={attemptId!}
                  stageLabels={STAGE_LABELS}
                  issueLabels={{}}
                  onOpenExercise={() => {}}
                />
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
