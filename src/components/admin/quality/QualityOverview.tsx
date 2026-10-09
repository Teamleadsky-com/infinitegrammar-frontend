import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEVELS, SEGMENTS, Verifier, fetchJson, formatDate, formatPct, levelRank, verifierLabel } from "../dashboardShared";

// v_quality_kpis: "verified" = quality_status 'passed'
export type QualityKpis = {
  live: number;
  livePassed: number;
  liveLegacy: number;
  livePending: number;
  liveReactivated: number;
  openLearnerReports: number;
  auditConfig: string | null;
  auditN: number | null;
  auditCleanPct: number | null;
  auditMinorPct: number | null;
  auditFlawedPct: number | null;
};

const Tile = ({ title, value, sub }: { title: string; value: React.ReactNode; sub?: React.ReactNode }) => (
  <Card className="p-4">
    <p className="text-xs text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </Card>
);

type IssueRow = { code: string; label: string; n: number };

const ISSUE_SOURCES = [
  { key: "all", label: "All sources" },
  { key: "generation_verifier", label: "Generation" },
  { key: "live_audit", label: "Live audit" },
];

const VerifiedBy = ({
  verifiers,
  kpis,
  selected,
  onSelect,
}: {
  verifiers: Verifier[];
  kpis: QualityKpis | null;
  selected: string;
  onSelect: (verifier: string) => void;
}) => (
  <Card className="p-4 md:p-6">
    <h3 className="text-lg font-semibold">Verified by</h3>
    <p className="text-sm text-muted-foreground mb-4">
      The check that set each exercise's quality status (<code>verifier_version</code>): passed exercises stay live,
      rejected ones are deactivated.
    </p>
    {verifiers.length === 0 ? (
      <p className="text-sm text-muted-foreground">No exercise has been checked by the current pipeline yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Check</th>
              <th className="py-2 pr-3 font-medium text-right">Live, passed</th>
              <th className="py-2 pr-3 font-medium text-right">Share of live</th>
              <th className="py-2 pr-3 font-medium text-right">Rejected (deactivated)</th>
              <th className="py-2 pr-3 font-medium">Last check</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {verifiers.map((v) => (
              <tr key={v.verifierVersion} className={`border-b last:border-0 ${selected === v.verifierVersion ? "bg-muted/60" : ""}`}>
                <td className="py-2 pr-3">
                  <span className="font-medium">{verifierLabel(v.verifierVersion)}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{v.verifierVersion}</span>
                </td>
                <td className="py-2 pr-3 text-right">{v.livePassed}</td>
                <td className="py-2 pr-3 text-right">{kpis && kpis.live > 0 ? formatPct((100 * v.livePassed) / kpis.live) : "—"}</td>
                <td className="py-2 pr-3 text-right">{v.rejected}</td>
                <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{formatDate(v.lastVerifiedAt)}</td>
                <td className="py-2 text-right">
                  <Button variant="outline" size="sm" disabled={selected === v.verifierVersion} onClick={() => onSelect(v.verifierVersion)}>
                    Show
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

export const QualityOverview = ({
  apiBase,
  kpis,
  verifiers,
  selectedVerifier,
  onSelectVerifier,
  sections,
  onSegmentClick,
}: {
  apiBase: string;
  kpis: QualityKpis | null;
  verifiers: Verifier[];
  selectedVerifier: string;
  onSelectVerifier: (verifier: string) => void;
  sections: Array<{ id: string; name: string; level: string }>;
  onSegmentClick: (segment: string, level: string) => void;
}) => {
  const [byLevel, setByLevel] = useState<Array<{ level: string; segment: string; n: number }> | null>(null);
  const [issues, setIssues] = useState<IssueRow[] | null>(null);
  const [runs, setRuns] = useState<string[]>([]);
  const [filters, setFilters] = useState({ source: "all", level: "all", section: "all", run: "all", active: "all", tolerated: false });
  const verifier = selectedVerifier === "all" ? null : selectedVerifier;

  useEffect(() => {
    setByLevel(null);
    const q = verifier ? `?verifier=${encodeURIComponent(verifier)}` : "";
    fetchJson<{ rows: Array<{ level: string; segment: string; n: number }> }>(`${apiBase}/admin-quality-status-by-level${q}`)
      .then((d) => setByLevel(d.rows))
      .catch(() => setByLevel([]));
  }, [apiBase, verifier]);

  useEffect(() => {
    const q = new URLSearchParams();
    if (verifier) q.set("verifier", verifier);
    if (filters.source !== "all") q.set("source", filters.source);
    if (filters.level !== "all") q.set("level", filters.level);
    if (filters.section !== "all") q.set("section", filters.section);
    if (filters.run !== "all") q.set("run", filters.run);
    if (filters.active !== "all") q.set("active", filters.active);
    if (filters.tolerated) q.set("tolerated", "true");
    fetchJson<{ issues: IssueRow[]; runs: string[] }>(`${apiBase}/admin-quality-issues?${q}`)
      .then((d) => {
        setIssues(d.issues);
        setRuns(d.runs);
      })
      .catch(() => setIssues([]));
  }, [apiBase, filters, verifier]);

  const levelData = useMemo(() => {
    if (!byLevel) return [];
    const map = new Map<string, Record<string, number | string>>();
    for (const r of byLevel) {
      const row = map.get(r.level) || { level: r.level };
      row[r.segment] = r.n;
      map.set(r.level, row);
    }
    return [...map.values()].sort((a, b) => levelRank(a.level as string) - levelRank(b.level as string));
  }, [byLevel]);

  const presentSegments = SEGMENTS.filter((s) => byLevel?.some((r) => r.segment === s.key));
  const set = (key: keyof typeof filters, value: string | boolean) => setFilters((f) => ({ ...f, [key]: value }));
  const selectedLivePassed = verifier ? verifiers.find((v) => v.verifierVersion === verifier)?.livePassed ?? 0 : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile title="Live exercises" value={kpis ? kpis.live : "—"} />
        <Tile
          title="Verified (passed the current checks)"
          value={kpis && kpis.live > 0 ? formatPct((100 * kpis.livePassed) / kpis.live) : "—"}
          sub={
            kpis
              ? `${kpis.livePassed} passed · ${kpis.liveLegacy} legacy · ${kpis.livePending} pending · ${kpis.liveReactivated} reactivated` +
                (verifier && selectedLivePassed !== null ? ` · ${selectedLivePassed} by ${verifierLabel(verifier)}` : "")
              : undefined
          }
        />
        <Tile
          title={`Audit grade of the production config${kpis?.auditConfig ? ` (${kpis.auditConfig})` : ""}`}
          value={kpis?.auditN ? `${kpis.auditCleanPct}% clean` : "—"}
          sub={kpis?.auditN ? `${kpis.auditMinorPct}% minor · ${kpis.auditFlawedPct}% flawed (n = ${kpis.auditN}) · graded samples of new output` : "No audits for this config"}
        />
        <Tile
          title="Open learner reports"
          value={kpis ? kpis.openLearnerReports : "—"}
          sub="Deactivated by a learner report and not reactivated"
        />
      </div>

      <VerifiedBy verifiers={verifiers} kpis={kpis} selected={selectedVerifier} onSelect={onSelectVerifier} />

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold">Corpus status per level</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Live and deactivated exercises, and why they were deactivated
          {verifier ? `; live verified exercises split into ${verifierLabel(verifier)} and other checks` : ""}. Click a segment
          to list its exercises.
        </p>
        {!byLevel ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : levelData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={levelData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="level" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {presentSegments.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.key === "active_passed" && verifier ? `Live · verified by ${verifierLabel(verifier)}` : s.label}
                  stackId="corpus"
                  fill={s.color}
                  cursor="pointer"
                  isAnimationActive={false}
                  onClick={(entry: any) => onSegmentClick(s.key, entry.level)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Why exercises fail checks</h3>
            <p className="text-sm text-muted-foreground">
              Exercises per issue type, for exercises rejected or taken down by the pipeline
              {verifier ? ` (checked by ${verifierLabel(verifier)})` : ""}.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label className="text-xs">Source</Label>
              <Select value={filters.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ISSUE_SOURCES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Level</Label>
              <Select value={filters.level} onValueChange={(v) => setFilters((f) => ({ ...f, level: v, section: "all" }))}>
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
                <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sections</SelectItem>
                  {sections
                    .filter((s) => filters.level === "all" || s.level === filters.level)
                    .map((s) => <SelectItem key={s.id} value={s.id}>{s.level} · {s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Run</Label>
              <Select value={filters.run} onValueChange={(v) => set("run", v)}>
                <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All runs</SelectItem>
                  {runs.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Exercise</Label>
              <Select value={filters.active} onValueChange={(v) => set("active", v)}>
                <SelectTrigger className="w-[120px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Live</SelectItem>
                  <SelectItem value="false">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-xs h-9" title="G3_TOL: passing exercises with mixed-grammar gaps within the 30% tolerance">
              <Switch checked={filters.tolerated} onCheckedChange={(v) => set("tolerated", v)} />
              Include tolerated (G3_TOL)
            </label>
          </div>
        </div>
        {!issues ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : issues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No issues for these filters.</p>
        ) : (
          <ResponsiveContainer width="100%" height={issues.length * 30 + 30}>
            <BarChart data={issues} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 0 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="label" width={270} tick={{ fontSize: 12 }} interval={0}
                     tickFormatter={(label: string, i: number) => `${issues[i]?.code ?? ""} · ${label}`} />
              <Tooltip formatter={(v: number) => [v, "Exercises"]} />
              <Bar dataKey="n" fill="hsl(25, 90%, 52%)" isAnimationActive={false} label={{ position: "right", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};
