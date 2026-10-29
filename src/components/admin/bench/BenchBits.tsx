import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatInterval, formatRate, outcome, OUTCOME_LABELS, verdictRight, wilson } from "@/lib/bench";

/**
 * Colours of the benchmark charts (validated with the dataviz palette checks): A and B are the two compared
 * runs, other runs recede to grey; recall (flawed items) and FPR (clean items) each have their own hue.
 */
export const BENCH_COLORS = {
  a: "#2a78d6",
  b: "#1baf7a",
  other: "#898781",
  recall: "#6250d6",
  fpr: "#eb6834",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
};

/** Share of flawed exercises among the checked ones, for precision (PPV) and false omission rate. */
export const PREVALENCES = [0.05, 0.1, 0.2, 0.33, 0.5];

export const PrevalencePicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div>
    <Label className="text-xs">Flawed share in production (π)</Label>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-[150px] h-9" aria-label="Flawed share in production"><SelectValue /></SelectTrigger>
      <SelectContent>
        {PREVALENCES.map((p) => <SelectItem key={p} value={String(p)}>{Math.round(p * 100)}% flawed</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

/** A small info icon with a definition on hover. */
export const Help = ({ children }: { children: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" className="inline-flex align-middle text-muted-foreground hover:text-foreground ml-1" aria-label="Definition">
        <Info className="h-3.5 w-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-xs font-normal leading-relaxed">{children}</TooltipContent>
  </Tooltip>
);

/** A table header with the standard metric name and, below, what it counts in plain words. */
export const MetricHead = ({ name, sub, help, right = true, last = false }: { name: string; sub: string; help?: ReactNode; right?: boolean; last?: boolean }) => (
  <th className={`py-2 font-medium align-bottom ${last ? "" : "pr-3"} ${right ? "text-right" : ""}`}>
    <span className="text-foreground whitespace-nowrap">{name}{help && <Help>{help}</Help>}</span>
    <span className="block font-normal max-w-[7.5rem] ml-auto leading-tight">{sub}</span>
  </th>
);

/** A rate k / n with its 95% Wilson interval: "94.4%" over "17 / 18 · 74–99%". */
export const RateCell = ({ k, n, strong = false }: { k: number; n: number; strong?: boolean }) =>
  !n ? <span className="text-muted-foreground">–</span> : (
    <span className="whitespace-nowrap tabular-nums">
      <span className={strong ? "font-semibold" : ""}>{formatRate((100 * k) / n)}</span>
      <span className="block text-[11px] text-muted-foreground">{k} / {n} · CI {formatInterval(wilson(k, n))}</span>
    </span>
  );

/** The confusion-matrix cell of a verdict, green when right (TP, TN) and red when wrong (FN, FP). */
export const OutcomeBadge = ({ plantedType, rejected }: { plantedType: string; rejected: boolean }) => {
  const o = outcome(plantedType, rejected);
  return (
    <Badge
      variant="outline"
      title={`${plantedType === "clean" ? "clean" : "flawed"} item, ${rejected ? "rejected" : "accepted"}`}
      className={`whitespace-nowrap ${
        verdictRight(plantedType, rejected)
          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300"
          : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300"
      }`}
    >
      <span className="font-semibold mr-1">{o}</span>{OUTCOME_LABELS[o]}
    </Badge>
  );
};

/** A coloured dot that names a run in a legend or table. */
export const RunKey = ({ color, label }: { color: string; label: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
    {label}
  </span>
);
