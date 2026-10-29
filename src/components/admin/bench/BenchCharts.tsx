import { CartesianGrid, ErrorBar, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { formatUsd } from "../dashboardShared";
import { balancedAccuracyCI, formatInterval, formatRate, paretoFrontier, wilson } from "@/lib/bench";
import { BENCH_COLORS, RunKey } from "./BenchBits";
import { BenchRun, BenchTypeMetric } from "./types";

/**
 * Charts over all listed runs: each setup as one point in ROC space (recall vs FPR) and on the
 * cost–accuracy plane, with 95% intervals; and recall by defect type × run as a heatmap.
 */

export const runName = (r: BenchRun) => r.tag || r.config || r.runId;

type Point = {
  run: BenchRun;
  name: string;
  x: number;
  y: number;
  xErr?: [number, number];
  yErr: [number, number];
  color: string;
  role: "A" | "B" | null;
  frontier?: boolean;
};

const roleOf = (r: BenchRun, picked: string[]): "A" | "B" | null => (picked[0] === r.runId ? "A" : picked[1] === r.runId ? "B" : null);
const colorOf = (role: "A" | "B" | null) => (role === "A" ? BENCH_COLORS.a : role === "B" ? BENCH_COLORS.b : BENCH_COLORS.other);
const err = (value: number, ci: [number, number] | null): [number, number] => (ci ? [value - 100 * ci[0], 100 * ci[1] - value] : [0, 0]);

/** A point with a 2px surface ring; labelled with the setup name when there are few points, or it is A or B. */
const dot = (labelAll: boolean) => (props: unknown) => {
  const { cx, cy, payload } = props as { cx?: number; cy?: number; payload: Point };
  if (cx === undefined || cy === undefined) return <g />;
  const label = labelAll || payload.role;
  return (
    <g style={{ cursor: "pointer" }}>
      <circle cx={cx} cy={cy} r={9} fill="transparent" />
      <circle cx={cx} cy={cy} r={payload.role ? 5.5 : 4.5} fill={payload.color} stroke="#fff" strokeWidth={2} />
      {label && (
        <text x={cx + 9} y={cy - 7} fontSize={11} fill="#52514e">
          {payload.role ? `${payload.role}: ` : ""}{payload.name}
        </text>
      )}
    </g>
  );
};

const PointTooltip = ({ active, payload, kind }: { active?: boolean; payload?: Array<{ payload: Point }>; kind: "roc" | "cost" }) => {
  if (!active || !payload?.length) return null;
  const p: Point = payload[0].payload;
  if (!p?.run) return null;
  const r = p.run;
  return (
    <div className="rounded border bg-background px-3 py-2 text-xs shadow-sm space-y-0.5">
      <p className="font-medium">{p.role ? `${p.role}: ` : ""}{p.name}</p>
      <p className="text-muted-foreground font-mono">{r.runId} · {r.subset}</p>
      <p>Recall {formatRate(r.detectionPct)} ({r.caught} / {r.planted}, CI {formatInterval(wilson(r.caught, r.planted))})</p>
      <p>FPR {formatRate(r.falseRejectPct)} ({r.falseRejects} / {r.clean}, CI {formatInterval(wilson(r.falseRejects, r.clean))})</p>
      {kind === "cost" && (
        <>
          <p>Balanced accuracy {formatRate(r.balancedAccuracyPct)} (CI {formatInterval(balancedAccuracyCI(r.caught, r.planted, r.falseRejects, r.clean))})</p>
          <p>{formatUsd(r.usdPerItem)} per item{p.frontier ? " · on the frontier" : ""}</p>
        </>
      )}
      <p className="text-muted-foreground">Click to open the run</p>
    </div>
  );
};

/** Points split into other runs, A and B (drawn in that order, so A and B are on top), each with its colour. */
const series = (pts: Point[]): Array<[string, Point[], string]> =>
  ([["other", null], ["A", "A"], ["B", "B"]] as const)
    .map(([key, role]) => [key, pts.filter((p) => p.role === role), colorOf(role)] as [string, Point[], string])
    .filter(([, data]) => data.length > 0);

const axisProps = { tick: { fontSize: 11, fill: "#898781" }, stroke: BENCH_COLORS.axis, tickLine: false };

/** Each setup in ROC space: recall (TPR) against FPR, with 95% Wilson intervals on both. */
export const RocChart = ({ runs, picked, onOpen }: { runs: BenchRun[]; picked: string[]; onOpen: (runId: string) => void }) => {
  const pts: Point[] = runs
    .filter((r) => r.detectionPct !== null && r.falseRejectPct !== null)
    .map((r) => {
      const role = roleOf(r, picked);
      return {
        run: r, name: runName(r), role, color: colorOf(role),
        x: r.falseRejectPct!, y: r.detectionPct!,
        xErr: err(r.falseRejectPct!, wilson(r.falseRejects, r.clean)),
        yErr: err(r.detectionPct!, wilson(r.caught, r.planted)),
      };
    });
  return (
    <div>
      <h4 className="font-semibold">Recall vs false-positive rate</h4>
      <p className="text-xs text-muted-foreground mb-2">
        ROC space: each dot is one setup with 95% intervals. Up and to the left is better; the diagonal is a checker that rejects at random.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 12, right: 24, bottom: 24, left: 0 }}>
          <CartesianGrid stroke={BENCH_COLORS.grid} />
          <XAxis type="number" dataKey="x" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" name="FPR" {...axisProps}
            label={{ value: "FPR: clean items rejected", position: "insideBottom", offset: -14, fontSize: 11, fill: "#52514e" }} />
          <YAxis type="number" dataKey="y" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" name="Recall" width={66} {...axisProps}
            label={{ value: "Recall: flawed rejected", angle: -90, position: "insideLeft", offset: 4, dy: 60, fontSize: 11, fill: "#52514e" }} />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke={BENCH_COLORS.axis} />
          <Tooltip content={(p) => <PointTooltip {...(p as object)} kind="roc" />} cursor={false} />
          {series(pts).map(([key, data, color]) => (
            <Scatter key={key} data={data} shape={dot(pts.length <= 6)} onClick={(d: { run?: BenchRun }) => d?.run && onOpen(d.run.runId)} isAnimationActive={false}>
              <ErrorBar dataKey="xErr" direction="x" width={0} stroke={color} strokeOpacity={0.55} />
              <ErrorBar dataKey="yErr" direction="y" width={0} stroke={color} strokeOpacity={0.55} />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Balanced accuracy against cost per item; the frontier joins the setups no other beats on both. */
export const CostChart = ({ runs, picked, onOpen }: { runs: BenchRun[]; picked: string[]; onOpen: (runId: string) => void }) => {
  const ok = runs.filter((r) => r.balancedAccuracyPct !== null && r.usdPerItem !== null);
  const front = paretoFrontier(ok, (r) => r.usdPerItem, (r) => r.balancedAccuracyPct);
  const pts: Point[] = ok
    .map((r) => {
      const role = roleOf(r, picked);
      return {
        run: r, name: runName(r), role, color: colorOf(role), frontier: front.has(r),
        x: r.usdPerItem!, y: r.balancedAccuracyPct!,
        yErr: err(r.balancedAccuracyPct!, balancedAccuracyCI(r.caught, r.planted, r.falseRejects, r.clean)),
      };
    });
  const line = pts.filter((p) => p.frontier).sort((p, q) => p.x - q.x);
  const lows = pts.map((p) => p.y - p.yErr[0]);
  const yMin = lows.length ? Math.max(0, Math.floor((Math.min(...lows) - 5) / 10) * 10) : 0;
  return (
    <div>
      <h4 className="font-semibold">Balanced accuracy vs cost per item</h4>
      <p className="text-xs text-muted-foreground mb-2">
        Up and to the left is better. The line joins the frontier: setups that no other setup beats on both accuracy and cost.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 12, right: 24, bottom: 24, left: 0 }}>
          <CartesianGrid stroke={BENCH_COLORS.grid} />
          <XAxis type="number" dataKey="x" domain={[0, "auto"]} tickFormatter={(v) => `$${v}`} name="$ / item" {...axisProps}
            label={{ value: "$ per item", position: "insideBottom", offset: -14, fontSize: 11, fill: "#52514e" }} />
          <YAxis type="number" dataKey="y" domain={[yMin, 100]} unit="%" name="Balanced accuracy" width={66} {...axisProps}
            label={{ value: "Balanced accuracy", angle: -90, position: "insideLeft", offset: 4, dy: 50, fontSize: 11, fill: "#52514e" }} />
          <Tooltip content={(p) => <PointTooltip {...(p as object)} kind="cost" />} cursor={false} />
          {line.length > 1 && <Scatter data={line} line={{ stroke: BENCH_COLORS.axis, strokeWidth: 2 }} shape={() => <g />} isAnimationActive={false} legendType="none" />}
          {series(pts).map(([key, data, color]) => (
            <Scatter key={key} data={data} shape={dot(pts.length <= 6)} onClick={(d: { run?: BenchRun }) => d?.run && onOpen(d.run.runId)} isAnimationActive={false}>
              <ErrorBar dataKey="yErr" direction="y" width={0} stroke={color} strokeOpacity={0.55} />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Legend of the run colours, shown under the two scatter charts. */
export const RunLegend = ({ runs, picked }: { runs: BenchRun[]; picked: string[] }) => {
  const byId = Object.fromEntries(runs.map((r) => [r.runId, r]));
  const a = byId[picked[0]];
  const b = byId[picked[1]];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
      {a && <RunKey color={BENCH_COLORS.a} label={`A: ${runName(a)}`} />}
      {b && <RunKey color={BENCH_COLORS.b} label={`B: ${runName(b)}`} />}
      <RunKey color={BENCH_COLORS.other} label={a || b ? "other setups" : "setups (tick A/B in the table to highlight)"} />
      <span>Whiskers: 95% intervals</span>
    </div>
  );
};

/** Tint of a heatmap cell: a single hue from pale (0%) to full (100%); white text only on dark violet (orange stays light). */
const tint = (color: string, share: number) => {
  const alpha = 0.1 + 0.8 * share;
  const hex = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return { background: `${color}${hex}`, color: alpha > 0.6 && color === BENCH_COLORS.recall ? "#fff" : "#0b0b0b" };
};

/** Recall per defect type for every listed run (columns), the clean row as FPR below a divider. */
export const TypeHeatmap = ({
  runs, typesByRun, labels, picked, onOpen,
}: {
  runs: BenchRun[];
  typesByRun: Record<string, BenchTypeMetric[]>;
  labels: Array<{ type: string; label: string; order: number }>;
  picked: string[];
  onOpen: (runId: string) => void;
}) => {
  const present = new Set(runs.flatMap((r) => (typesByRun[r.runId] || []).map((t) => t.type)));
  const rows = labels.filter((l) => present.has(l.type) && l.type !== "clean");
  const cell = (r: BenchRun, type: string) => (typesByRun[r.runId] || []).find((t) => t.type === type);
  const Cell = ({ k, n, color, title }: { k: number; n: number; color: string; title: string }) =>
    !n ? <td className="px-1 py-1 text-center text-muted-foreground">–</td> : (
      <td className="p-0.5" title={title}>
        <div className="rounded px-1.5 py-1 text-center tabular-nums text-xs" style={tint(color, k / n)}>{k}/{n}</div>
      </td>
    );
  return (
    <div>
      <h4 className="font-semibold">Recall by defect type, all setups</h4>
      <p className="text-xs text-muted-foreground mb-2">
        Caught / flawed items of each type; darker is better. Pale cells are the defect types a setup misses. The clean row is FPR, so there lighter is better.
      </p>
      <div className="overflow-x-auto">
        <table className="text-sm border-separate border-spacing-0">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="text-left font-medium pr-3 pb-1">Defect type</th>
              {runs.map((r) => {
                const role = roleOf(r, picked);
                return (
                  <th key={r.runId} className="px-0.5 pb-1 font-medium align-bottom min-w-[3.5rem]">
                    <button type="button" className="hover:text-foreground underline decoration-dotted underline-offset-2 max-w-[7rem] truncate block mx-auto" title={`${r.runId} · ${r.subset}`} onClick={() => onOpen(r.runId)}>
                      {role && <span className="inline-block h-2 w-2 rounded-full mr-1" style={{ background: colorOf(role) }} />}
                      {runName(r)}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.type}>
                <td className="pr-3 py-0.5 whitespace-nowrap max-w-[18rem] truncate" title={l.label}>
                  <span className="font-mono text-xs mr-1.5">{l.type}</span><span className="text-muted-foreground">{l.label}</span>
                </td>
                {runs.map((r) => {
                  const t = cell(r, l.type);
                  return <Cell key={r.runId} k={t?.rejected ?? 0} n={t?.n ?? 0} color={BENCH_COLORS.recall} title={`${runName(r)} · ${l.type}: ${t?.rejected ?? 0} of ${t?.n ?? 0} caught`} />;
                })}
              </tr>
            ))}
            <tr>
              <td className="pr-3 pt-1.5 font-medium whitespace-nowrap border-t">All flawed (recall)</td>
              {runs.map((r) => <Cell key={r.runId} k={r.caught} n={r.planted} color={BENCH_COLORS.recall} title={`${runName(r)}: recall ${r.caught} of ${r.planted}`} />)}
            </tr>
            <tr>
              <td className="pr-3 py-0.5 font-medium whitespace-nowrap">Clean (FPR, lower is better)</td>
              {runs.map((r) => <Cell key={r.runId} k={r.falseRejects} n={r.clean} color={BENCH_COLORS.fpr} title={`${runName(r)}: ${r.falseRejects} of ${r.clean} clean items rejected`} />)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
