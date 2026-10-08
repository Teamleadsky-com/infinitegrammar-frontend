import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Trash2, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LEVELS, SUPPLY_COLORS, fetchJson, formatDate, levelRank } from "./dashboardShared";

type SupplySection = {
  sectionId: string;
  sectionName: string;
  level: string;
  orderInLevel: number | null;
  active: number;
  used: number;
  remaining: number;
  learnersStarted: number;
  learnersLe3Left: number;
  topLearnerLastCompletedAt: string | null;
  status: "red" | "amber" | "green" | "grey";
};

type SortKey = "curriculum" | "usedShare" | "remaining";

const STATUS_LEGEND: Array<{ status: SupplySection["status"]; label: string }> = [
  { status: "red", label: "Almost or fully used (≤ 3 left or ≥ 90% used)" },
  { status: "amber", label: "Getting close (≤ 5 left or ≥ 70% used)" },
  { status: "green", label: "Plenty left" },
  { status: "grey", label: "No learner has started" },
];

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const SupplyTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const s: SupplySection = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md space-y-0.5">
      <p className="font-semibold text-sm">{s.sectionName}</p>
      <p className="text-muted-foreground">{s.level} · {s.sectionId}</p>
      <p>Active: {s.active} · Used: {s.used} · Remaining: {s.remaining}</p>
      <p>Learners started: {s.learnersStarted}</p>
      <p>Learners with ≤ 3 left: {s.learnersLe3Left}</p>
      <p>Most advanced learner's last completion: {formatDate(s.topLearnerLastCompletedAt)}</p>
    </div>
  );
};

const LevelChart = ({ level, rows, maxActive }: { level: string; rows: SupplySection[]; maxActive: number }) => (
  <div>
    <h4 className="text-sm font-semibold mb-1">
      {level} <span className="font-normal text-muted-foreground">· {rows.length} sections</span>
    </h4>
    <ResponsiveContainer width="100%" height={rows.length * 26 + 16}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 64, bottom: 4, left: 0 }} barCategoryGap={4}>
        <XAxis type="number" hide domain={[0, Math.max(maxActive, 1)]} />
        <YAxis
          type="category"
          dataKey="sectionName"
          width={240}
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => truncate(v, 38)}
          interval={0}
        />
        <Tooltip content={<SupplyTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Bar dataKey="used" stackId="supply" isAnimationActive={false}>
          {rows.map((r) => (
            <Cell key={r.sectionId} fill={SUPPLY_COLORS[r.status]} />
          ))}
        </Bar>
        <Bar dataKey="remaining" stackId="supply" isAnimationActive={false}>
          {rows.map((r) => (
            <Cell key={r.sectionId} fill={SUPPLY_COLORS[r.status]} fillOpacity={0.25} />
          ))}
          <LabelList
            position="right"
            content={(props: any) => {
              const r = rows[props.index];
              if (!r) return null;
              return (
                <text x={props.x + props.width + 6} y={props.y + props.height / 2 + 4} fontSize={11} fill="hsl(var(--foreground))">
                  {r.used} / {r.active}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

type ExcludedAccount = { userId: string; email: string | null; note: string | null; addedAt: string; addedBy: string | null };

const ExcludedAccountsPanel = ({ apiBase, onChange }: { apiBase: string; onChange: () => void }) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<ExcludedAccount[]>([]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchJson<{ accounts: ExcludedAccount[] }>(`${apiBase}/admin-excluded-users`)
      .then((d) => setAccounts(d.accounts))
      .catch(() => toast({ title: "Could not load excluded accounts", variant: "destructive" }));
  }, [apiBase, toast]);

  const send = async (method: "POST" | "DELETE", body: object) => {
    setBusy(true);
    try {
      const res = await fetch(`${apiBase}/admin-excluded-users`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || `Error ${res.status}`, variant: "destructive" });
        return false;
      }
      setAccounts(data.accounts);
      onChange();
      return true;
    } catch {
      toast({ title: "Request failed", variant: "destructive" });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    if (await send("POST", { email, note })) {
      setEmail("");
      setNote("");
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <UserX className="h-4 w-4" />
        <h3 className="text-lg font-semibold">Excluded accounts</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Left out of every learner-based number: Supply, learner signal and the Metrics tab. Changes apply on the next load.
      </p>

      <div className="flex flex-col md:flex-row gap-2 md:items-end mb-4">
        <div className="flex-1">
          <Label htmlFor="exclude-email" className="text-xs">Exact account email</Label>
          <Input id="exclude-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="flex-1">
          <Label htmlFor="exclude-note" className="text-xs">Note (optional)</Label>
          <Input id="exclude-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. tester" />
        </div>
        <Button onClick={add} disabled={busy || !email.trim()}>Add</Button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No excluded accounts.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 font-medium">Note</th>
                <th className="py-2 pr-3 font-medium">Added</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.userId} className="border-b last:border-0">
                  <td className="py-2 pr-3">{a.email || <span className="font-mono text-xs">{a.userId}</span>}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{a.note || "—"}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{formatDate(a.addedAt)}</td>
                  <td className="py-2 text-right">
                    <Button variant="ghost" size="sm" disabled={busy} onClick={() => send("DELETE", { userId: a.userId })} title="Remove">
                      <Trash2 className="h-4 w-4" />
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
};

export const SupplyDashboard = ({ apiBase }: { apiBase: string }) => {
  const [sections, setSections] = useState<SupplySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("curriculum");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [hideNotStarted, setHideNotStarted] = useState(false);

  const load = () => {
    setLoading(true);
    fetchJson<{ sections: SupplySection[] }>(`${apiBase}/admin-supply`)
      .then((d) => {
        setSections(d.sections);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [apiBase]);

  const groups = useMemo(() => {
    const visible = sections.filter(
      (s) => (levelFilter === "all" || s.level === levelFilter) && (!hideNotStarted || s.status !== "grey"),
    );
    const sorted = [...visible].sort((a, b) => {
      if (sort === "usedShare") {
        const share = (s: SupplySection) => (s.active > 0 ? s.used / s.active : s.learnersStarted > 0 ? 1 : 0);
        return share(b) - share(a);
      }
      if (sort === "remaining") return a.remaining - b.remaining;
      return 0; // the API already returns curriculum order
    });
    const byLevel = new Map<string, SupplySection[]>();
    for (const s of sorted) {
      const key = s.level || "—";
      byLevel.set(key, [...(byLevel.get(key) || []), s]);
    }
    return [...byLevel.entries()].sort((a, b) => levelRank(a[0]) - levelRank(b[0]));
  }, [sections, sort, levelFilter, hideNotStarted]);

  const maxActive = useMemo(() => Math.max(1, ...sections.map((s) => s.active)), [sections]);
  const counts = useMemo(
    () => Object.fromEntries(STATUS_LEGEND.map(({ status }) => [status, sections.filter((s) => s.status === status).length])),
    [sections],
  );

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Active vs used exercises per section</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Full bar = active exercises; filled part = exercises the most advanced logged-in learner has already passed.
              Excluded accounts don't count; anonymous visitors get random exercises and use up no supply.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="text-xs">Sort</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[190px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="curriculum">Curriculum order</SelectItem>
                  <SelectItem value="usedShare">Most used share first</SelectItem>
                  <SelectItem value="remaining">Fewest remaining first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm h-9">
              <Switch checked={hideNotStarted} onCheckedChange={setHideNotStarted} />
              Hide sections nobody started
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-5 text-xs">
          {STATUS_LEGEND.map(({ status, label }) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: SUPPLY_COLORS[status] }} />
              {label} <span className="text-muted-foreground">({counts[status] ?? 0})</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-sm opacity-25" style={{ backgroundColor: SUPPLY_COLORS.green }} />
            lighter part = remaining
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : error ? (
          <p className="text-sm text-destructive">Could not load supply data: {error}</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sections match the filters.</p>
        ) : (
          <div className="space-y-6">
            {groups.map(([level, rows]) => (
              <LevelChart key={level} level={level} rows={rows} maxActive={maxActive} />
            ))}
          </div>
        )}
      </Card>

      <ExcludedAccountsPanel apiBase={apiBase} onChange={load} />
    </div>
  );
};
