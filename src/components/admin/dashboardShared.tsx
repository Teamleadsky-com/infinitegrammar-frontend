import { Badge } from "@/components/ui/badge";

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const levelRank = (level: string | null | undefined) => {
  const i = LEVELS.indexOf((level || "") as (typeof LEVELS)[number]);
  return i === -1 ? 99 : i;
};

// USD with 2 decimals, or 3 below $0.10
export const formatUsd = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `$${value.toFixed(Math.abs(value) < 0.1 ? 3 : 2)}`;
};

export const formatPct = (value: number | null | undefined) =>
  value === null || value === undefined || Number.isNaN(value) ? "—" : `${Math.round(value)}%`;

// A rate measured on a sample always shows its n, e.g. "66% (n = 29)"
export const formatSamplePct = (value: number | null | undefined, n: number | null | undefined) =>
  value === null || value === undefined || !n ? "—" : `${Math.round(value)}% (n = ${n})`;

export const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString() : "—";

export const formatDateTime = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "—";

export const SUPPLY_COLORS: Record<string, string> = {
  red: "hsl(0, 72%, 51%)",
  amber: "hsl(38, 92%, 50%)",
  green: "hsl(142, 64%, 38%)",
  grey: "hsl(220, 9%, 62%)",
};

export const SEGMENTS: Array<{ key: string; label: string; color: string }> = [
  { key: "active_verified", label: "Live · verified (latest check passed)", color: "hsl(142, 64%, 38%)" },
  { key: "active_failed", label: "Live · failed latest check", color: "hsl(48, 90%, 50%)" },
  { key: "active_unchecked", label: "Live · not checked", color: "hsl(142, 30%, 72%)" },
  { key: "inactive_learner", label: "Deactivated · learner report", color: "hsl(0, 72%, 51%)" },
  { key: "inactive_admin", label: "Deactivated · by admin", color: "hsl(330, 60%, 55%)" },
  { key: "inactive_live_audit", label: "Deactivated · live-audit takedown", color: "hsl(25, 90%, 52%)" },
  { key: "inactive_generation", label: "Deactivated · rejected at generation", color: "hsl(270, 50%, 60%)" },
  { key: "inactive_other", label: "Deactivated · legacy checker / other", color: "hsl(220, 9%, 62%)" },
];

export type VerificationPipeline = {
  pipeline: string;
  label: string;
  kind: "generation" | "live_audit" | "checker";
  runs: number;
  lastCheckedAt: string | null;
  checked: number;
  passed: number;
  failed: number;
  liveChecked: number;
  livePassed: number;
  liveFailed: number;
};

// Query-string value for the selected pipeline(s); "all" means every pipeline
export const pipelinesParam = (selected: string) => `pipelines=${encodeURIComponent(selected)}`;

export const REPORT_SOURCES: Array<{ key: string; label: string }> = [
  { key: "learner", label: "Learner report" },
  { key: "admin", label: "Deactivated by admin" },
  { key: "live_audit", label: "Live-audit takedown" },
  { key: "generation_verifier", label: "Rejected at generation" },
  { key: "checker", label: "Legacy checker" },
  { key: "unknown", label: "Unknown" },
];

export type IssueLabel = { code: string; label: string; order?: number };

export const IssueChips = ({ codes, labels }: { codes: string[]; labels: Record<string, string> }) =>
  codes.length === 0 ? (
    <span className="text-muted-foreground">—</span>
  ) : (
    <div className="flex flex-wrap gap-1">
      {codes.map((code) => (
        <Badge key={code} variant="outline" className="text-[10px] px-1.5 py-0" title={labels[code] || code}>
          {code}
        </Badge>
      ))}
    </div>
  );

export type Gap = { gapNumber: number; correctAnswer: string; distractors?: string[]; explanation?: string };

// Text with each [n] placeholder replaced by the gap's correct answer
export const TextWithGaps = ({ text, gaps }: { text: string; gaps: Gap[] }) => {
  const answers: Record<number, string> = {};
  for (const g of gaps) answers[g.gapNumber] = g.correctAnswer;
  const parts = text.split(/(\[\d+\])/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        if (!m) return <span key={i}>{part}</span>;
        const n = parseInt(m[1], 10);
        return (
          <span key={i} className="font-semibold text-green-700 dark:text-green-400 underline decoration-dotted">
            {answers[n] ?? part}
            <sup className="text-[10px] text-muted-foreground ml-0.5">{n}</sup>
          </span>
        );
      })}
    </p>
  );
};

export const GapList = ({ gaps, showExplanation = false }: { gaps: Gap[]; showExplanation?: boolean }) => (
  <div className="space-y-2">
    {gaps.map((gap) => (
      <div key={gap.gapNumber} className="text-sm">
        <span className="text-xs text-muted-foreground mr-1.5">Gap {gap.gapNumber}:</span>
        <span className="font-medium text-green-700 dark:text-green-400">{gap.correctAnswer}</span>
        {gap.distractors && gap.distractors.length > 0 && (
          <span className="text-red-600/70 dark:text-red-400/70"> / {gap.distractors.join(", ")}</span>
        )}
        {showExplanation && gap.explanation && (
          <p className="text-xs text-muted-foreground mt-0.5">{gap.explanation}</p>
        )}
      </div>
    ))}
  </div>
);

// Admin deactivation / reactivation (report_source 'admin' on deactivate)
export const setExerciseActive = async (apiBase: string, exerciseId: string, active: boolean) => {
  const res = await fetch(`${apiBase}/report-exercise`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exerciseId, active }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

export const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
