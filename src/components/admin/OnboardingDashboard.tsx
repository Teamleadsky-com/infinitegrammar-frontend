import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson, formatDate } from "./dashboardShared";

// Onboarding of new (anonymous) visitors: GET /api/admin-onboarding (exercise_view_events, session_signups)

type Section = { sectionId: string; sectionName: string | null; level: string | null };
type Data = {
  period: string;
  trackingSince: string | null;
  funnel: { sessions: number; started: number; completed1: number; completed3: number; signups: number; views: number; completions: number };
  depth: Array<{ k: number; shown: number; completed: number }>;
  firstExercise: { untouched: number; abandoned: number; completed: number };
  daily: Array<{ day: string; sessions: number; completed1: number; signups: number }>;
  entry: Array<Section & { sessions: number; completed1: number; signups: number; avgShown: number | null; starterFirst: boolean }>;
  sections: Array<Section & { sessions: number; views: number; started: number; completed: number; scorePct: number | null; hasStarters: boolean }>;
  starters: Array<{ position: number; shown: number; started: number; completed: number }>;
};

const PERIODS = [
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "90", label: "Last 90 days" },
  { key: "all", label: "All time" },
];

// One hue for magnitude; green and amber only where they mean done / dropped
const C = {
  primary: "hsl(262, 83%, 58%)",
  done: "hsl(142, 64%, 38%)",
  dropped: "hsl(38, 92%, 50%)",
  untouched: "hsl(220, 9%, 70%)",
};

const pct = (n: number, of: number) => (of ? `${Math.round((100 * n) / of)}%` : "–");

const Tile = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <Card className="p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </Card>
);

const SectionLabel = ({ s }: { s: Section }) => (
  <span>
    {s.level && <Badge variant="outline" className="mr-1.5 text-[10px] px-1.5 py-0">{s.level}</Badge>}
    {s.sectionName || s.sectionId}
  </span>
);

/** The funnel as horizontal bars: count, share of sessions, and the drop from the step before. */
const Funnel = ({ steps, total }: { steps: Array<{ label: string; n: number; help: string }>; total: number }) => (
  <div className="space-y-3">
    {steps.map((step, i) => {
      const prev = i > 0 ? steps[i - 1].n : null;
      const drop = prev ? prev - step.n : 0;
      return (
        <div key={step.label} className="grid grid-cols-[minmax(9rem,14rem)_1fr_auto] items-center gap-3" title={step.help}>
          <span className="text-sm">{step.label}</span>
          <div className="h-7 rounded bg-muted/60 overflow-hidden">
            <div className="h-full rounded" style={{ width: total ? `${(100 * step.n) / total}%` : 0, background: C.primary, minWidth: step.n ? 4 : 0 }} />
          </div>
          <span className="text-sm tabular-nums whitespace-nowrap w-40 text-right">
            <span className="font-semibold">{step.n}</span>
            <span className="text-muted-foreground"> · {pct(step.n, total)}</span>
            {prev !== null && drop > 0 && <span className="text-xs text-muted-foreground"> · −{pct(drop, prev)}</span>}
          </span>
        </div>
      );
    })}
  </div>
);

type SortKey = "views" | "sessions" | "completion";

export const OnboardingDashboard = ({ apiBase }: { apiBase: string }) => {
  const [period, setPeriod] = useState("30");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("views");
  const [allEntries, setAllEntries] = useState(false);
  const [allSections, setAllSections] = useState(false);
  const TOP = 10;

  useEffect(() => {
    setData(null);
    setError(null);
    fetchJson<Data>(`${apiBase}/admin-onboarding?days=${period}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [apiBase, period]);

  const sections = useMemo(() => {
    const rows = [...(data?.sections || [])];
    const rate = (r: Data["sections"][number]) => (r.views ? r.completed / r.views : 0);
    rows.sort((a, b) => (sort === "views" ? b.views - a.views : sort === "sessions" ? b.sessions - a.sessions : rate(b) - rate(a) || b.views - a.views));
    return rows;
  }, [data, sort]);

  const f = data?.funnel;
  const first = data?.firstExercise;
  const firstTotal = first ? first.untouched + first.abandoned + first.completed : 0;

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Onboarding</h3>
            <p className="text-sm text-muted-foreground">
              New visitors before they have an account: what they see first, how far they get and how many create a profile.
              One session is one browser tab.
              {data?.trackingSince && <> Tracking since {formatDate(data.trackingSince)}.</>}
            </p>
          </div>
          <div>
            <Label className="text-xs">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{PERIODS.map((p) => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {error && <p className="text-sm text-destructive">Could not load onboarding data: {error}</p>}
      {!data && !error && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}

      {data && f && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Tile label="New-visitor sessions" value={f.sessions} sub="at least one exercise shown" />
            <Tile label="Completed an exercise" value={pct(f.completed1, f.sessions)} sub={`${f.completed1} sessions`} />
            <Tile label="Created a profile" value={pct(f.signups, f.sessions)} sub={`${f.signups} sessions`} />
            <Tile label="Exercises per session" value={f.sessions ? (f.views / f.sessions).toFixed(1) : "–"} sub="shown, on average" />
            <Tile label="Exercises completed" value={pct(f.completions, f.views)} sub={`${f.completions} of ${f.views} shown`} />
          </div>

          <Card className="p-4 md:p-6">
            <h4 className="font-semibold">Funnel</h4>
            <p className="text-sm text-muted-foreground mb-4">Share of sessions at each step; the small number is the drop from the step before.</p>
            <Funnel
              total={f.sessions}
              steps={[
                { label: "Exercise shown", n: f.sessions, help: "Sessions with at least one exercise shown" },
                { label: "First answer chosen", n: f.started, help: "Picked an answer in at least one exercise" },
                { label: "Exercise completed", n: f.completed1, help: "Checked the answers of at least one exercise" },
                { label: "3+ exercises completed", n: f.completed3, help: "Checked the answers of three or more exercises" },
                { label: "Profile created", n: f.signups, help: "An account was created in the same tab" },
              ]}
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 md:p-6">
              <h4 className="font-semibold">The first exercise</h4>
              <p className="text-sm text-muted-foreground mb-4">What visitors do with the first exercise they see.</p>
              <div className="flex h-7 w-full gap-0.5 overflow-hidden rounded">
                {([["completed", C.done], ["abandoned", C.dropped], ["untouched", C.untouched]] as const).map(([key, color]) =>
                  first![key] > 0 ? <div key={key} style={{ width: `${(100 * first![key]) / firstTotal}%`, background: color }} title={`${key}: ${first![key]}`} /> : null,
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                {([
                  ["Completed", first!.completed, C.done, "answers checked"],
                  ["Abandoned", first!.abandoned, C.dropped, "answered, never checked"],
                  ["Untouched", first!.untouched, C.untouched, "no answer chosen"],
                ] as const).map(([label, n, color, help]) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />{label}</div>
                    <p className="font-semibold tabular-nums">{n} <span className="font-normal text-muted-foreground">· {pct(n, firstTotal)}</span></p>
                    <p className="text-xs text-muted-foreground">{help}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h4 className="font-semibold">How far sessions get</h4>
              <p className="text-sm text-muted-foreground mb-2">Sessions that reached the n-th exercise, and that completed n exercises.</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.depth} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="k" tick={{ fontSize: 11 }} tickFormatter={(k) => `${k}${k === 10 ? "+" : ""}`} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(k) => `Exercise ${k}`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="shown" name="Reached" fill={C.primary} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="completed" name="Completed" fill={C.done} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-4 md:p-6">
            <h4 className="font-semibold">Per day</h4>
            <p className="text-sm text-muted-foreground mb-2">New-visitor sessions by the day of their first exercise (UTC).</p>
            {data.daily.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.daily} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d) => formatDate(d)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(d) => formatDate(d as string)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="sessions" name="Sessions" fill={C.primary} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="completed1" name="Completed an exercise" fill={C.done} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="signups" name="Profile created" fill={C.dropped} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-4 md:p-6">
            <h4 className="font-semibold">Where new visitors land</h4>
            <p className="text-sm text-muted-foreground mb-3">
              The section of the first exercise in each session. Homepage and other page landings aren't tracked here (see Google Analytics).
            </p>
            {data.entry.length === 0 ? <p className="text-sm text-muted-foreground">No sessions in this period.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Section</th>
                      <th className="py-2 pr-3 font-medium text-right">Sessions</th>
                      <th className="py-2 pr-3 font-medium w-40"></th>
                      <th className="py-2 pr-3 font-medium text-right">Completed an exercise</th>
                      <th className="py-2 pr-3 font-medium text-right">Exercises per session</th>
                      <th className="py-2 font-medium text-right">Profiles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(allEntries ? data.entry : data.entry.slice(0, TOP)).map((e) => (
                      <tr key={e.sectionId} className="border-b last:border-0">
                        <td className="py-2 pr-3"><SectionLabel s={e} />{e.starterFirst && <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">starter</Badge>}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-medium">{e.sessions}</td>
                        <td className="py-2 pr-3"><div className="h-2 rounded bg-muted/60"><div className="h-2 rounded" style={{ width: `${(100 * e.sessions) / data.entry[0].sessions}%`, background: C.primary }} /></div></td>
                        <td className="py-2 pr-3 text-right tabular-nums">{pct(e.completed1, e.sessions)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{e.avgShown ?? "–"}</td>
                        <td className="py-2 text-right tabular-nums">{e.signups}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.entry.length > TOP && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAllEntries(!allEntries)}>
                {allEntries ? "Show top 10" : `Show all ${data.entry.length}`}
              </Button>
            )}
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-3">
              <div>
                <h4 className="font-semibold">Section popularity</h4>
                <p className="text-sm text-muted-foreground">Everything new visitors practised, per section.</p>
              </div>
              <div>
                <Label className="text-xs">Sort by</Label>
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="w-[170px] h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Exercises shown</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                    <SelectItem value="completion">Completion rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {sections.length === 0 ? <p className="text-sm text-muted-foreground">No sessions in this period.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Section</th>
                      <th className="py-2 pr-3 font-medium text-right">Sessions</th>
                      <th className="py-2 pr-3 font-medium text-right">Shown</th>
                      <th className="py-2 pr-3 font-medium text-right">Answered</th>
                      <th className="py-2 pr-3 font-medium text-right">Completed</th>
                      <th className="py-2 font-medium text-right">Avg score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(allSections ? sections : sections.slice(0, TOP)).map((s) => (
                      <tr key={s.sectionId} className="border-b last:border-0">
                        <td className="py-2 pr-3"><SectionLabel s={s} />{s.hasStarters && <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">starters</Badge>}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{s.sessions}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-medium">{s.views}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{pct(s.started, s.views)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{pct(s.completed, s.views)}</td>
                        <td className="py-2 text-right tabular-nums">{s.scorePct === null ? "–" : `${s.scorePct}%`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {sections.length > TOP && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAllSections(!allSections)}>
                {allSections ? "Show top 10" : `Show all ${sections.length}`}
              </Button>
            )}
          </Card>

          <Card className="p-4 md:p-6">
            <h4 className="font-semibold">Starter exercises</h4>
            <p className="text-sm text-muted-foreground mb-3">The curated first 10 exercises of a section: how often each position was shown, answered and completed.</p>
            {data.starters.length === 0 ? <p className="text-sm text-muted-foreground">No starter exercises were shown in this period.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Position</th>
                      <th className="py-2 pr-3 font-medium text-right">Shown</th>
                      <th className="py-2 pr-3 font-medium text-right">Answered</th>
                      <th className="py-2 font-medium text-right">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.starters.map((s) => (
                      <tr key={s.position} className="border-b last:border-0">
                        <td className="py-2 pr-3">{s.position}</td>
                        <td className="py-2 pr-3 text-right tabular-nums font-medium">{s.shown}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{s.started} <span className="text-muted-foreground">· {pct(s.started, s.shown)}</span></td>
                        <td className="py-2 text-right tabular-nums">{s.completed} <span className="text-muted-foreground">· {pct(s.completed, s.shown)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <p className="text-xs text-muted-foreground">
            Counts only visitors without an account. A session lasts while the tab is open: a reload or a new tab starts a new one, and a
            profile counts only when it's created in the same tab, so profile creation is a lower bound. Crawlers and automated browsers are
            not tracked.
          </p>
        </>
      )}
    </div>
  );
};
