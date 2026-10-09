import { useEffect, useState } from "react";
import { Eye, Loader2, Power } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchJson, formatDate, setExerciseActive } from "../dashboardShared";

export type CheckerRun = {
  run_id: string;
  checker_name: string;
  levels: string[] | null;
  grammar_sections: string[] | null;
  created_at: string;
  exercise_count: number | string;
};

type Flagged = {
  id: string;
  level: string;
  section_name: string;
  checker_name: string;
  report_text: string | null;
  reported_at: string | null;
  text: string;
  is_active: boolean;
};

export const runLabel = (run: CheckerRun) =>
  `${run.checker_name} — ${formatDate(run.created_at)} — ${run.exercise_count} exercises` +
  (run.levels?.length ? ` — ${run.levels.join(", ")}` : "");

// Legacy exercise_checker_runs, one run at a time (same data as the Flagged tab's "Checker runs")
export const CheckerRunsView = ({ apiBase, onOpen, onChanged }: { apiBase: string; onOpen: (id: string) => void; onChanged: () => void }) => {
  const { toast } = useToast();
  const [runs, setRuns] = useState<CheckerRun[] | null>(null);
  const [runId, setRunId] = useState<string>("");
  const [flagged, setFlagged] = useState<Flagged[] | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ runs: CheckerRun[] }>(`${apiBase}/report-exercise?source=checker`)
      .then((d) => setRuns(d.runs))
      .catch(() => setRuns([]));
  }, [apiBase]);

  useEffect(() => {
    if (!runId) return;
    setFlagged(null);
    fetchJson<{ flagged: Flagged[] }>(`${apiBase}/report-exercise?source=checker&run_id=${runId}`)
      .then((d) => setFlagged(d.flagged))
      .catch(() => setFlagged([]));
  }, [apiBase, runId]);

  const toggle = async (ex: Flagged) => {
    setTogglingId(ex.id);
    try {
      await setExerciseActive(apiBase, ex.id, !ex.is_active);
      setFlagged((prev) => prev?.map((e) => (e.id === ex.id ? { ...e, is_active: !ex.is_active } : e)) || null);
      toast({ title: ex.is_active ? "Exercise deactivated" : "Exercise reactivated" });
      onChanged();
    } catch {
      toast({ title: "Could not change the exercise", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">Checker run (retired checkers, history only)</Label>
        {!runs ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No checker runs found.</p>
        ) : (
          <Select value={runId} onValueChange={setRunId}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Choose a run..." /></SelectTrigger>
            <SelectContent>
              {runs.map((run) => <SelectItem key={run.run_id} value={run.run_id}>{runLabel(run)}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </Card>

      {runId && !flagged && (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      )}
      {!runId && runs && runs.length > 0 && (
        <Card className="p-6 text-center text-muted-foreground">Select a checker run to view its flagged exercises.</Card>
      )}
      {flagged?.map((ex) => (
        <Card key={ex.id} className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge>{ex.level}</Badge>
                <Badge variant="outline">{ex.section_name}</Badge>
                <Badge variant="secondary">{ex.checker_name}</Badge>
                {!ex.is_active && <Badge variant="destructive">Deactivated</Badge>}
                <span className="text-xs text-muted-foreground">{formatDate(ex.reported_at)}</span>
              </div>
              <p className="text-sm mb-3 line-clamp-3">{ex.text}</p>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Checker report</p>
                <p className="text-sm">{ex.report_text || <span className="italic text-muted-foreground">No report text</span>}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => onOpen(ex.id)}>
                <Eye className="h-3 w-3" /> Detail
              </Button>
              <Button variant="outline" size="sm" className="gap-1" disabled={togglingId === ex.id} onClick={() => toggle(ex)}>
                <Power className="h-3 w-3" /> {ex.is_active ? "Deactivate" : "Reactivate"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {flagged && flagged.length === 0 && <Card className="p-6 text-center text-muted-foreground">No flagged exercises in this run.</Card>}
    </div>
  );
};
