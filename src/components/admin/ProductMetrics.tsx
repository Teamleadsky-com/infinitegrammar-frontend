import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Users, Activity, Loader2 } from "lucide-react";

interface ProductMetricsProps {
  apiBase: string;
}

interface RetentionRow {
  cohort: string;
  registered: number;
  week1: number;
  week4: number;
  week8: number;
  week1_pct: number;
  week4_pct: number;
  week8_pct: number;
}

interface WeeklyRow {
  week: string;
  wau: number;
  sessions_per_user: number;
}

interface MonthlyRow {
  month: string;
  mau: number;
  sessions_per_user: number;
}

/** Given a cohort like "2026-W10", return the ISO week string offset by N weeks */
const offsetWeek = (cohort: string, weeks: number): string => {
  const match = cohort.match(/(\d{4})-W(\d{2})/);
  if (!match) return "";
  let year = parseInt(match[1], 10);
  let week = parseInt(match[2], 10) + weeks;
  // ISO weeks: most years have 52, some have 53
  const maxWeek = 52; // simplified; close enough for display
  while (week > maxWeek) { week -= maxWeek; year++; }
  return `${year}-W${String(week).padStart(2, "0")}`;
};

const retentionCellColor = (pct: number) => {
  if (pct >= 50) return "bg-green-500/20 text-green-700 dark:text-green-400";
  if (pct >= 20) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  if (pct > 0) return "bg-red-500/20 text-red-700 dark:text-red-400";
  return "text-muted-foreground";
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

export function ProductMetrics({ apiBase }: ProductMetricsProps) {
  const [retention, setRetention] = useState<RetentionRow[]>([]);
  const [weekly, setWeekly] = useState<WeeklyRow[]>([]);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [weeklyWindow, setWeeklyWindow] = useState(12);
  const [monthlyWindow, setMonthlyWindow] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/admin-product-metrics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRetention(data.retention || []);
        setWeekly(data.weekly || []);
        setMonthly(data.monthly || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [apiBase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive">Failed to load metrics: {error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Retention Cohorts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Retention Cohorts</h3>
        </div>
        <Card className="p-4 md:p-6 animate-fade-in">
          {retention.length === 0 ? (
            <p className="text-muted-foreground text-sm">No cohort data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-border p-2 md:p-3 text-left bg-muted/50">Cohort</th>
                    <th className="border border-border p-2 md:p-3 text-center bg-muted/50">Registered</th>
                    <th className="border border-border p-2 md:p-3 text-center bg-muted/50">Week 1</th>
                    <th className="border border-border p-2 md:p-3 text-center bg-muted/50">Week 4</th>
                    <th className="border border-border p-2 md:p-3 text-center bg-muted/50">Week 8</th>
                  </tr>
                </thead>
                <tbody>
                  {retention.map((row) => (
                    <tr key={row.cohort} className="hover:bg-muted/30">
                      <td className="border border-border p-2 md:p-3 font-medium">{row.cohort}</td>
                      <td className="border border-border p-2 md:p-3 text-center">{row.registered}</td>
                      <td className={`border border-border p-2 md:p-3 text-center font-semibold ${retentionCellColor(row.week1_pct)}`}>
                        {row.week1_pct}%
                        <span className="text-xs font-normal ml-1">({row.week1})</span>
                        <div className="text-[10px] font-normal text-muted-foreground">{offsetWeek(row.cohort, 1)}</div>
                      </td>
                      <td className={`border border-border p-2 md:p-3 text-center font-semibold ${retentionCellColor(row.week4_pct)}`}>
                        {row.week4_pct}%
                        <span className="text-xs font-normal ml-1">({row.week4})</span>
                        <div className="text-[10px] font-normal text-muted-foreground">{offsetWeek(row.cohort, 4)}</div>
                      </td>
                      <td className={`border border-border p-2 md:p-3 text-center font-semibold ${retentionCellColor(row.week8_pct)}`}>
                        {row.week8_pct}%
                        <span className="text-xs font-normal ml-1">({row.week8})</span>
                        <div className="text-[10px] font-normal text-muted-foreground">{offsetWeek(row.cohort, 8)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Weekly Engagement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Engagement</h3>
          </div>
          <div className="flex gap-1">
            {[8, 12, 26, 52].map((w) => (
              <Button key={w} variant={weeklyWindow === w ? "default" : "outline"} size="sm" onClick={() => setWeeklyWindow(w)}>
                {w}w
              </Button>
            ))}
          </div>
        </div>
        <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {weekly.length === 0 ? (
            <p className="text-muted-foreground text-sm">No weekly data yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{weekly[weekly.length - 1]?.wau ?? 0}</p>
                  <p className="text-xs text-muted-foreground">WAU (latest week)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{weekly[weekly.length - 1]?.sessions_per_user ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Sessions/user (latest week)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weekly.slice(-weeklyWindow)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="week"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "11px" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--primary))"
                    style={{ fontSize: "12px" }}
                    label={{ value: "WAU", angle: -90, position: "insideLeft", style: { fontSize: "11px", fill: "hsl(var(--primary))" } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(142, 70%, 45%)"
                    style={{ fontSize: "12px" }}
                    label={{ value: "Sessions/user", angle: 90, position: "insideRight", style: { fontSize: "11px", fill: "hsl(142, 70%, 45%)" } }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="wau"
                    name="Weekly Active Users"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sessions_per_user"
                    name="Sessions / User"
                    stroke="hsl(142, 70%, 45%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </Card>
      </div>

      {/* Monthly Engagement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Monthly Engagement</h3>
          </div>
          <div className="flex gap-1">
            {[3, 6, 12, 24].map((m) => (
              <Button key={m} variant={monthlyWindow === m ? "default" : "outline"} size="sm" onClick={() => setMonthlyWindow(m)}>
                {m}m
              </Button>
            ))}
          </div>
        </div>
        <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {monthly.length === 0 ? (
            <p className="text-muted-foreground text-sm">No monthly data yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{monthly[monthly.length - 1]?.mau ?? 0}</p>
                  <p className="text-xs text-muted-foreground">MAU (latest month)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{monthly[monthly.length - 1]?.sessions_per_user ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Sessions/user (latest month)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthly.slice(-monthlyWindow)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--primary))"
                    style={{ fontSize: "12px" }}
                    label={{ value: "MAU", angle: -90, position: "insideLeft", style: { fontSize: "11px", fill: "hsl(var(--primary))" } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(142, 70%, 45%)"
                    style={{ fontSize: "12px" }}
                    label={{ value: "Sessions/user", angle: 90, position: "insideRight", style: { fontSize: "11px", fill: "hsl(142, 70%, 45%)" } }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="mau"
                    name="Monthly Active Users"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sessions_per_user"
                    name="Sessions / User"
                    stroke="hsl(142, 70%, 45%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
