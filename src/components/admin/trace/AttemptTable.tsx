import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { levelRank } from "../dashboardShared";
import { formatCost, formatSeconds, shortAttemptId, shortIterationLabel } from "@/lib/pipelineTrace";
import { IssueCodeChips, StatusChip, VerdictChip } from "./TraceBits";
import { AttemptRow } from "./types";

const PAGE = 200;

export const AttemptTable = ({
  rows,
  runId,
  stage,
  issueLabels,
  onOpen,
  filters = false,
}: {
  rows: AttemptRow[];
  runId: string;
  /** set for the list of one stage: shows the step's verdict, issue codes and cost */
  stage?: string;
  issueLabels: Record<string, string>;
  onOpen: (attemptId: string) => void;
  filters?: boolean;
}) => {
  const [status, setStatus] = useState("all");
  const [section, setSection] = useState("all");
  const [level, setLevel] = useState("all");
  const [limit, setLimit] = useState(PAGE);

  const options = useMemo(() => {
    const statuses = [...new Set(rows.map((r) => r.status))].sort();
    const levels = [...new Set(rows.map((r) => r.level).filter(Boolean))].sort((a, b) => levelRank(a) - levelRank(b)) as string[];
    const sections = [...new Map(rows.filter((r) => r.sectionId).map((r) => [r.sectionId!, r.sectionName || r.sectionId!])).entries()]
      .sort((a, b) => a[1].localeCompare(b[1]));
    return { statuses, levels, sections };
  }, [rows]);

  const visible = rows.filter(
    (r) => (status === "all" || r.status === status) && (section === "all" || r.sectionId === section) && (level === "all" || r.level === level),
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of visible) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [visible]);

  return (
    <div className="space-y-3">
      {filters && (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => { setStatus(v); setLimit(PAGE); }}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {options.statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Level</Label>
            <Select value={level} onValueChange={(v) => { setLevel(v); setLimit(PAGE); }}>
              <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {options.levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Section</Label>
            <Select value={section} onValueChange={(v) => { setSection(v); setLimit(PAGE); }}>
              <SelectTrigger className="w-[260px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sections</SelectItem>
                {options.sections.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground pb-2">
            {visible.length} attempts · {Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(" · ")}
          </p>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attempts.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Attempt</th>
                <th className="py-2 pr-3 font-medium">Section</th>
                <th className="py-2 pr-3 font-medium">Level</th>
                <th className="py-2 pr-3 font-medium">Topic · scene</th>
                {stage && <th className="py-2 pr-3 font-medium">Here</th>}
                <th className="py-2 pr-3 font-medium">Final status</th>
                <th className="py-2 pr-3 font-medium">Issues</th>
                {!stage && <th className="py-2 pr-3 font-medium text-right">Steps</th>}
                <th className="py-2 pr-3 font-medium text-right">{stage ? "Cost here" : "Cost"}</th>
                {!stage && <th className="py-2 font-medium text-right">Call time</th>}
              </tr>
            </thead>
            <tbody>
              {visible.slice(0, limit).map((r) => (
                <tr key={r.attemptId} className="border-b last:border-0 cursor-pointer hover:bg-muted/40 align-top" onClick={() => onOpen(r.attemptId)}>
                  <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{shortAttemptId(r.attemptId, runId)}</td>
                  <td className="py-2 pr-3">{r.sectionName || r.sectionId || "–"}</td>
                  <td className="py-2 pr-3">{r.level || "–"}</td>
                  <td className="py-2 pr-3 max-w-xs">
                    <p className="truncate" title={r.contentTopic || undefined}>{r.contentTopic || "–"}</p>
                    {r.scene && <p className="text-xs text-muted-foreground truncate" title={r.scene}>{r.scene}</p>}
                  </td>
                  {stage && (
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {r.verdict && <VerdictChip verdict={r.verdict} />}
                        {r.iteration !== null && <span className="text-xs text-muted-foreground">{shortIterationLabel(stage, r.iteration)}</span>}
                      </div>
                      <IssueCodeChips codes={r.stepIssueCodes} labels={issueLabels} />
                    </td>
                  )}
                  <td className="py-2 pr-3"><StatusChip status={r.status} /></td>
                  <td className="py-2 pr-3"><IssueCodeChips codes={r.issueCodes} labels={issueLabels} /></td>
                  {!stage && <td className="py-2 pr-3 text-right tabular-nums">{r.steps}</td>}
                  <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">{formatCost(stage ? r.stepCostUsd : r.costUsd)}</td>
                  {!stage && <td className="py-2 text-right whitespace-nowrap">{formatSeconds(r.callSeconds)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {visible.length > limit && (
        <Button variant="outline" size="sm" onClick={() => setLimit(visible.length)}>Show all {visible.length}</Button>
      )}
    </div>
  );
};
