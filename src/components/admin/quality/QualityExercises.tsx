import { useEffect, useState } from "react";
import { Loader2, Power } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { IssueChips, LEVELS, REPORT_SOURCES, SEGMENTS, fetchJson, formatDate, setExerciseActive } from "../dashboardShared";

export type ExerciseFilters = { source: string; segment: string; level: string; section: string; status: string };

export const DEFAULT_EXERCISE_FILTERS: ExerciseFilters = { source: "learner", segment: "all", level: "all", section: "all", status: "all" };

type Row = {
  id: string;
  sectionId: string;
  sectionName: string | null;
  level: string;
  orderNumber: number;
  isActive: boolean;
  qualityStatus: string;
  reportSource: string | null;
  reportSourceLabel: string | null;
  segment: string;
  reportText: string | null;
  reportedAt: string | null;
  verifiedAt: string | null;
  issueCodes: string[];
};

const PAGE = 50;
const STATUSES = ["passed", "legacy", "pending", "rejected"];

const ReportText = ({ text }: { text: string | null }) => {
  const [open, setOpen] = useState(false);
  if (!text) return <span className="text-muted-foreground">—</span>;
  if (text.length <= 80) return <span>{text}</span>;
  return (
    <span>
      {open ? text : `${text.slice(0, 80)}…`}{" "}
      <button
        className="text-xs text-primary underline"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {open ? "less" : "more"}
      </button>
    </span>
  );
};

export const QualityExercises = ({
  apiBase,
  filters,
  onFiltersChange,
  sections,
  issueLabels,
  onOpen,
  onChanged,
}: {
  apiBase: string;
  filters: ExerciseFilters;
  onFiltersChange: (f: ExerciseFilters) => void;
  sections: Array<{ id: string; name: string; level: string }>;
  issueLabels: Record<string, string>;
  onOpen: (exerciseId: string) => void;
  onChanged: () => void;
}) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => setOffset(0), [filters]);

  useEffect(() => {
    const q = new URLSearchParams({ limit: String(PAGE), offset: String(offset) });
    if (filters.source !== "all") q.set("source", filters.source);
    if (filters.segment !== "all") q.set("segment", filters.segment);
    if (filters.level !== "all") q.set("level", filters.level);
    if (filters.section !== "all") q.set("section", filters.section);
    if (filters.status !== "all") q.set("status", filters.status);
    setRows(null);
    fetchJson<{ total: number; exercises: Row[] }>(`${apiBase}/admin-quality-exercises?${q}`)
      .then((d) => {
        setRows(d.exercises);
        setTotal(d.total);
      })
      .catch(() => setRows([]));
  }, [apiBase, filters, offset, reloadKey]);

  const toggle = async (row: Row) => {
    setTogglingId(row.id);
    try {
      await setExerciseActive(apiBase, row.id, !row.isActive);
      toast({ title: row.isActive ? "Exercise deactivated" : "Exercise reactivated" });
      setReloadKey((k) => k + 1);
      onChanged();
    } catch {
      toast({ title: "Could not change the exercise", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  const set = (key: keyof ExerciseFilters, value: string) => onFiltersChange({ ...filters, [key]: value });

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-wrap items-end gap-2 mb-4">
        <div>
          <Label className="text-xs">Reason / source</Label>
          <Select value={filters.source} onValueChange={(v) => set("source", v)}>
            <SelectTrigger className="w-[190px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {REPORT_SOURCES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Segment</Label>
          <Select value={filters.segment} onValueChange={(v) => set("segment", v)}>
            <SelectTrigger className="w-[230px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All segments</SelectItem>
              {SEGMENTS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Level</Label>
          <Select value={filters.level} onValueChange={(v) => onFiltersChange({ ...filters, level: v, section: "all" })}>
            <SelectTrigger className="w-[100px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Section</Label>
          <Select value={filters.section} onValueChange={(v) => set("section", v)}>
            <SelectTrigger className="w-[200px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {sections
                .filter((s) => filters.level === "all" || s.level === filters.level)
                .map((s) => <SelectItem key={s.id} value={s.id}>{s.level} · {s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Quality status</Label>
          <Select value={filters.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onFiltersChange(DEFAULT_EXERCISE_FILTERS)}>Reset</Button>
        <span className="text-sm text-muted-foreground ml-auto">{total} exercises</span>
      </div>

      {!rows ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No exercises match the filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Section</th>
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium">Active</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Reason / source</th>
                <th className="py-2 pr-3 font-medium">Issues</th>
                <th className="py-2 pr-3 font-medium min-w-[220px]">Report / verdict</th>
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40 cursor-pointer align-top" onClick={() => onOpen(r.id)}>
                  <td className="py-2 pr-3">
                    <Badge className="mr-1">{r.level}</Badge>
                    <span>{r.sectionName || r.sectionId}</span>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{r.orderNumber}</td>
                  <td className="py-2 pr-3">{r.isActive ? "yes" : <span className="text-destructive">no</span>}</td>
                  <td className="py-2 pr-3">{r.qualityStatus}</td>
                  <td className="py-2 pr-3">{r.reportSourceLabel || "—"}</td>
                  <td className="py-2 pr-3"><IssueChips codes={r.issueCodes} labels={issueLabels} /></td>
                  <td className="py-2 pr-3"><ReportText text={r.reportText} /></td>
                  <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">{formatDate(r.reportedAt || r.verifiedAt)}</td>
                  <td className="py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      disabled={togglingId === r.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(r);
                      }}
                    >
                      <Power className="h-3 w-3" />
                      {r.isActive ? "Deactivate" : "Reactivate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > PAGE && (
        <div className="flex items-center justify-end gap-2 mt-4 text-sm">
          <span className="text-muted-foreground">{offset + 1}–{Math.min(offset + PAGE, total)} of {total}</span>
          <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Previous</Button>
          <Button variant="outline" size="sm" disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Next</Button>
        </div>
      )}
    </Card>
  );
};
