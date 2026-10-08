import { useEffect, useMemo, useState } from "react";
import { Check, Eye, Loader2, Power } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchJson, setExerciseActive } from "../dashboardShared";
import { CheckerRun, runLabel } from "./CheckerRunsView";

type CompareExercise = {
  id: string;
  level: string;
  text: string;
  section_name: string;
  is_active: boolean;
  run_ids: string[];
};

// Overlap of legacy checker runs (same data as the Flagged tab's "Compare runs")
export const CompareRunsView = ({ apiBase, onOpen, onChanged }: { apiBase: string; onOpen: (id: string) => void; onChanged: () => void }) => {
  const { toast } = useToast();
  const [runs, setRuns] = useState<CheckerRun[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [exercises, setExercises] = useState<CompareExercise[]>([]);
  const [compared, setCompared] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"overlap" | "difference">("overlap");
  const [filter, setFilter] = useState<"all" | "shared" | "unique">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ runs: CheckerRun[] }>(`${apiBase}/report-exercise?source=checker`)
      .then((d) => setRuns(d.runs))
      .catch(() => setRuns([]));
  }, [apiBase]);

  const compare = async () => {
    setLoading(true);
    try {
      const d = await fetchJson<{ exercises: CompareExercise[] }>(`${apiBase}/report-exercise?source=compare&run_ids=${selected.join(",")}`);
      setExercises(d.exercises);
      setCompared(selected);
    } catch {
      toast({ title: "Could not compare runs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (ex: CompareExercise) => {
    setTogglingId(ex.id);
    try {
      await setExerciseActive(apiBase, ex.id, !ex.is_active);
      setExercises((prev) => prev.map((e) => (e.id === ex.id ? { ...e, is_active: !ex.is_active } : e)));
      toast({ title: ex.is_active ? "Exercise deactivated" : "Exercise reactivated" });
      onChanged();
    } catch {
      toast({ title: "Could not change the exercise", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  const comparedRuns = (runs || []).filter((r) => compared.includes(r.run_id));
  const runSets = useMemo(() => {
    const sets: Record<string, Set<string>> = {};
    for (const rid of compared) sets[rid] = new Set();
    for (const ex of exercises) for (const rid of ex.run_ids) sets[rid]?.add(ex.id);
    return sets;
  }, [exercises, compared]);

  const filtered = exercises
    .filter((ex) => (filter === "shared" ? ex.run_ids.length > 1 : filter === "unique" ? ex.run_ids.length === 1 : true))
    .sort((a, b) => b.run_ids.length - a.run_ids.length);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Select checker runs to compare (2 or more)</Label>
        {!runs ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="space-y-2">
            {runs.map((run) => (
              <label key={run.run_id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selected.includes(run.run_id)}
                  onCheckedChange={() =>
                    setSelected((s) => (s.includes(run.run_id) ? s.filter((x) => x !== run.run_id) : [...s, run.run_id]))
                  }
                />
                <span className="text-sm">{runLabel(run)}</span>
              </label>
            ))}
          </div>
        )}
        <Button className="mt-3" size="sm" disabled={selected.length < 2 || loading} onClick={compare}>
          {loading ? "Loading..." : "Compare"}
        </Button>
      </Card>

      {exercises.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">{mode === "overlap" ? "Overlap matrix" : "Difference matrix"}</h4>
            <div className="flex gap-1">
              <Button variant={mode === "overlap" ? "default" : "outline"} size="sm" onClick={() => setMode("overlap")}>Overlap</Button>
              <Button variant={mode === "difference" ? "default" : "outline"} size="sm" onClick={() => setMode("difference")}>Differences</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border p-3 bg-muted/50 text-xs text-muted-foreground">{mode === "difference" ? "row \\ col" : ""}</th>
                  {comparedRuns.map((run) => (
                    <th key={run.run_id} className="border border-border p-3 bg-muted/50 text-xs font-medium min-w-[140px]">{run.checker_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparedRuns.map((rowRun) => (
                  <tr key={rowRun.run_id}>
                    <td className="border border-border p-3 bg-muted/50 text-xs font-medium min-w-[140px]">{rowRun.checker_name}</td>
                    {comparedRuns.map((colRun) => {
                      const rowSet = runSets[rowRun.run_id];
                      const colSet = runSets[colRun.run_id];
                      const diagonal = rowRun.run_id === colRun.run_id;
                      if (mode === "overlap") {
                        const overlap = [...rowSet].filter((id) => colSet.has(id)).length;
                        const share = overlap / Math.max(rowSet.size, colSet.size, 1);
                        return (
                          <td key={colRun.run_id} className="border border-border p-3 text-center font-semibold min-w-[60px]"
                              style={{ backgroundColor: diagonal ? "hsl(var(--muted))" : `hsl(142, 70%, ${90 - share * 50}%)` }}
                              title={diagonal ? `Flagged by ${rowRun.checker_name}: ${overlap}` : `${overlap} flagged by both (${Math.round(share * 100)}% of the larger set)`}>
                            {overlap}
                          </td>
                        );
                      }
                      const rowOnly = [...rowSet].filter((id) => !colSet.has(id)).length;
                      const colOnly = [...colSet].filter((id) => !rowSet.has(id)).length;
                      const intensity = diagonal ? 0 : (rowOnly + colOnly) / (rowSet.size + colSet.size || 1);
                      return (
                        <td key={colRun.run_id} className="border border-border p-3 text-center font-semibold min-w-[80px]"
                            style={{ backgroundColor: diagonal ? "hsl(var(--muted))" : `hsl(0, 70%, ${95 - intensity * 40}%)` }}
                            title={diagonal ? `Flagged by ${rowRun.checker_name}: ${rowSet.size}` : `${rowOnly} only in row run, ${colOnly} only in column run`}>
                          {diagonal ? rowSet.size : `${rowOnly} / ${colOnly}`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {mode === "overlap"
              ? "Diagonal = total flagged per run. Off-diagonal = flagged by both runs; greener = more agreement."
              : "Diagonal = total flagged per run. Off-diagonal = row-only / column-only; redder = more disagreement."}
          </p>
        </Card>
      )}

      {exercises.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Exercises ({filtered.length} of {exercises.length})</h4>
            <div className="flex gap-1">
              {(["all", "shared", "unique"] as const).map((f) => (
                <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : f === "shared" ? "Shared (2+)" : "Unique (1)"}
                </Button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border p-2 text-left bg-muted/50 text-xs">Level</th>
                  <th className="border border-border p-2 text-left bg-muted/50 text-xs">Section</th>
                  <th className="border border-border p-2 text-left bg-muted/50 text-xs">Exercise</th>
                  {comparedRuns.map((run) => (
                    <th key={run.run_id} className="border border-border p-2 text-center bg-muted/50 text-xs min-w-[110px]">{run.checker_name}</th>
                  ))}
                  <th className="border border-border p-2 text-center bg-muted/50 text-xs">Count</th>
                  <th className="border border-border p-2 text-center bg-muted/50 text-xs">Active</th>
                  <th className="border border-border p-2 bg-muted/50" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((ex) => (
                  <tr key={ex.id} className="hover:bg-muted/30">
                    <td className="border border-border p-2 text-xs">{ex.level}</td>
                    <td className="border border-border p-2 text-xs">{ex.section_name}</td>
                    <td className="border border-border p-2 text-xs max-w-[300px] truncate" title={ex.text}>{ex.text?.slice(0, 80)}{ex.text?.length > 80 ? "…" : ""}</td>
                    {comparedRuns.map((run) => (
                      <td key={run.run_id} className="border border-border p-2 text-center">
                        {ex.run_ids.includes(run.run_id) ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                      </td>
                    ))}
                    <td className="border border-border p-2 text-center">
                      <Badge variant={ex.run_ids.length === compared.length ? "default" : ex.run_ids.length > 1 ? "secondary" : "outline"}>{ex.run_ids.length}</Badge>
                    </td>
                    <td className="border border-border p-2 text-center">
                      <Button variant="ghost" size="sm" className={`h-7 w-7 p-0 ${ex.is_active ? "text-green-600" : "text-red-500"}`}
                              disabled={togglingId === ex.id} onClick={() => toggle(ex)} title={ex.is_active ? "Deactivate" : "Reactivate"}>
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                    <td className="border border-border p-2 text-center">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onOpen(ex.id)} title="Detail">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {exercises.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          {selected.length < 2 ? "Select at least 2 runs to compare." : "Click Compare to load the comparison."}
        </Card>
      )}
    </div>
  );
};
