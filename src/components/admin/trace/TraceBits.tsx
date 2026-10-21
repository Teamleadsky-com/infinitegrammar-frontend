import { Fragment, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ExerciseDiff,
  MdInline,
  TraceExercise,
  VERDICT_HELP,
  Verdict,
  parseInline,
  parseMarkdown,
  pctOf,
  splitPlaceholders,
  splitSentences,
  verdictGroup,
} from "@/lib/pipelineTrace";

const VERDICT_STYLES = {
  passed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900",
  retry: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  failed: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900",
  other: "bg-muted text-muted-foreground border-border",
};

export const VerdictChip = ({ verdict }: { verdict: string }) => (
  <Badge variant="outline" className={cn("text-[11px] px-1.5 py-0 font-medium", VERDICT_STYLES[verdictGroup(verdict)])} title={VERDICT_HELP[verdict as Verdict]}>
    {verdict}
  </Badge>
);

const STATUS_GROUP: Record<string, keyof typeof VERDICT_STYLES> = { accepted: "passed", rejected: "failed" };

export const StatusChip = ({ status }: { status: string }) => (
  <Badge variant="outline" className={cn("text-[11px] px-1.5 py-0 font-medium", VERDICT_STYLES[STATUS_GROUP[status] || "other"])}>
    {status}
  </Badge>
);

export const IssueCodeChips = ({ codes, labels }: { codes: string[] | null | undefined; labels: Record<string, string> }) =>
  !codes || codes.length === 0 ? null : (
    <span className="inline-flex flex-wrap gap-1">
      {codes.map((code) => (
        <Badge key={code} variant="outline" className="text-[10px] px-1.5 py-0 font-mono" title={labels[code] || code}>
          {code}
        </Badge>
      ))}
    </span>
  );

/** A count of exercises with its share; clickable when it opens the list of those attempts. */
export const CountLink = ({
  n,
  total,
  onOpen,
  tone,
  showPct = true,
}: {
  n: number;
  total?: number;
  onOpen?: () => void;
  tone?: "passed" | "retry" | "failed" | "other";
  showPct?: boolean;
}) => {
  const color =
    tone === "passed" ? "text-green-700 dark:text-green-400"
      : tone === "retry" ? "text-amber-700 dark:text-amber-400"
        : tone === "failed" ? "text-red-700 dark:text-red-400"
          : tone === "other" ? "text-muted-foreground" : "";
  const body = (
    <>
      <span className={cn("font-semibold tabular-nums", color)}>{n}</span>
      {showPct && total !== undefined && <span className="text-xs text-muted-foreground ml-1 tabular-nums">{pctOf(n, total)}</span>}
    </>
  );
  if (!onOpen || n === 0) return <span className={n === 0 ? "opacity-60" : ""}>{body}</span>;
  return (
    <button type="button" onClick={onOpen} className="underline decoration-dotted underline-offset-4 hover:decoration-solid" title="Show these attempts">
      {body}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Markdown (rules texts) and prompt templates
// ---------------------------------------------------------------------------

const Inline = ({ text }: { text: string }) => (
  <>
    {parseInline(text).map((part: MdInline, i) =>
      part.style === "code" ? (
        <code key={i} className="px-1 py-0.5 rounded bg-muted font-mono text-[0.85em]">{part.text}</code>
      ) : part.style === "bold" ? (
        <strong key={i}>{part.text}</strong>
      ) : part.style === "italic" ? (
        <em key={i}>{part.text}</em>
      ) : (
        <Fragment key={i}>{part.text}</Fragment>
      ),
    )}
  </>
);

export const Markdown = ({ text }: { text: string }) => (
  <div className="space-y-3 text-sm leading-relaxed">
    {parseMarkdown(text).map((block, i) => {
      if (block.type === "heading") return <h4 key={i} className="font-semibold text-base"><Inline text={block.text} /></h4>;
      if (block.type === "code") return <pre key={i} className="p-3 rounded bg-muted text-xs overflow-x-auto">{block.text}</pre>;
      if (block.type === "list")
        return <ul key={i} className="list-disc pl-5 space-y-1">{block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ul>;
      if (block.type === "table")
        return (
          <div key={i} className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>{block.header.map((h, j) => <th key={j} className="border px-2 py-1 text-left font-medium bg-muted/50"><Inline text={h} /></th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j}>{row.map((cell, k) => <td key={k} className="border px-2 py-1 align-top"><Inline text={cell} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      return <p key={i}><Inline text={block.text} /></p>;
    })}
  </div>
);

/** A prompt template with its placeholders ({grammar_section}, {answer}, ...) highlighted. */
export const PromptText = ({ text }: { text: string }) => (
  <pre className="p-3 rounded bg-muted text-xs leading-relaxed whitespace-pre-wrap break-words font-mono">
    {splitPlaceholders(text).map((part, i) =>
      part.placeholder ? (
        <mark key={i} className="rounded px-0.5 bg-sky-200/70 text-sky-950 dark:bg-sky-800/60 dark:text-sky-100" title="Filled in for each exercise">
          {part.text}
        </mark>
      ) : (
        <Fragment key={i}>{part.text}</Fragment>
      ),
    )}
  </pre>
);

// ---------------------------------------------------------------------------
// Exercise versions
// ---------------------------------------------------------------------------

const CHANGED = "bg-amber-100 dark:bg-amber-900/40 rounded";

/** Text with its [N] markers, then one row per gap: correct answer marked, distractors, explanation. */
export const ExerciseView = ({ exercise, diff }: { exercise: TraceExercise; diff?: ExerciseDiff | null }) => {
  const renderMarkers = (text: string): ReactNode[] =>
    text.split(/(\[\d+\])/g).map((part, i) =>
      /^\[\d+\]$/.test(part) ? (
        <span key={i} className="inline-block mx-0.5 px-1 rounded border border-primary/40 bg-primary/10 text-primary text-xs font-semibold align-baseline">
          {part.slice(1, -1)}
        </span>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
  const sentences = diff ? splitSentences(exercise.text) : [exercise.text];
  return (
    <div className="space-y-3">
      <p className="text-sm leading-7 whitespace-pre-wrap">
        {sentences.map((s, i) => (
          <span key={i} className={diff?.changedSentences.has(s.trim()) ? CHANGED : undefined}>{renderMarkers(s)}</span>
        ))}
      </p>
      <div className="divide-y border rounded">
        {[...exercise.gaps].sort((a, b) => a.no - b.no).map((gap) => {
          const changes = diff?.gaps[gap.no] || [];
          return (
            <div key={gap.no} className={cn("p-2 text-sm flex gap-3", changes.length > 0 && "bg-amber-50 dark:bg-amber-950/30")}>
              <span className="w-6 shrink-0 text-xs font-semibold text-primary pt-0.5">[{gap.no}]</span>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={cn("font-semibold text-green-700 dark:text-green-400", changes.includes("correct") && CHANGED)}>✓ {gap.correct}</span>
                  <span className={cn("inline-flex flex-wrap gap-1", changes.includes("distractors") && CHANGED)} title="distractors">
                    {(gap.distractors || []).map((d, i) => (
                      <span key={i} className="rounded bg-muted px-1.5 text-muted-foreground"><span className="text-red-500/80 mr-0.5">✗</span>{d}</span>
                    ))}
                  </span>
                  {changes.length > 0 && <Badge variant="outline" className="text-[10px] px-1 py-0">changed: {changes.join(", ")}</Badge>}
                </div>
                {gap.explanation && <p className={cn("text-xs text-muted-foreground", changes.includes("explanation") && CHANGED)}>{gap.explanation}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
