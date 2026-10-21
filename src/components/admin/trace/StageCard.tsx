import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VERDICTS, formatCost, formatSeconds, formatTokens, iterationLabel } from "@/lib/pipelineTrace";
import { CountLink, Markdown, PromptText } from "./TraceBits";
import { AttemptQuery, StageDef, TraceIssue, TraceIteration, TraceStage } from "./types";

const SETTING_ORDER = ["reasoning_effort", "temperature", "samples", "candidates", "response_format"];

const settingEntries = (settings: Record<string, unknown>) =>
  Object.entries(settings).sort(
    ([a], [b]) => (SETTING_ORDER.indexOf(a) + 1 || 99) - (SETTING_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b),
  );

const Usage = ({ costUsd, calls, inputTokens, outputTokens, reasoningTokens, spanSeconds, callSeconds }: TraceStage) => (
  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
    <span><span className="text-foreground font-semibold text-sm">{formatCost(costUsd)}</span> cost</span>
    <span><span className="text-foreground">{calls}</span> calls</span>
    <span title="input / output / reasoning tokens">
      tokens <span className="text-foreground">{formatTokens(inputTokens)}</span> in · <span className="text-foreground">{formatTokens(outputTokens)}</span> out · <span className="text-foreground">{formatTokens(reasoningTokens)}</span> reasoning
    </span>
    <span title="first request sent → last answer received">span <span className="text-foreground">{formatSeconds(spanSeconds)}</span></span>
    <span title="summed request time of sync calls">call time <span className="text-foreground">{formatSeconds(callSeconds)}</span></span>
  </div>
);

const Reasons = ({ issues }: { issues: TraceIssue[] }) => {
  const shown = issues.filter((i) => i.n > 0);
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((i) => {
        const passedWith = i.n - i.nRetry - i.nFailed;
        const parts = [i.nRetry ? `${i.nRetry} sent to the next iteration` : "", i.nFailed ? `${i.nFailed} rejected` : "", passedWith ? `${passedWith} passed with it` : ""].filter(Boolean);
        const tone = i.nFailed > 0 ? "border-red-300 dark:border-red-800" : i.nRetry > 0 ? "border-amber-300 dark:border-amber-800" : "";
        return (
          <Badge key={i.issueCode} variant="outline" className={`text-[11px] font-normal py-0 ${tone}`} title={`${i.issueCode}: ${parts.join(", ")}`}>
            {i.issueLabel} <span className="ml-1 font-semibold">× {i.nRetry + i.nFailed || i.n}</span>
            {i.nRetry + i.nFailed === 0 && <span className="ml-1 text-muted-foreground">passed</span>}
          </Badge>
        );
      })}
    </div>
  );
};

const Configuration = ({ defs }: { defs: StageDef[] }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<StageDef | null>(null);
  if (defs.length === 0) return <p className="text-xs text-muted-foreground">No configuration recorded for this stage.</p>;
  const maxIterations = defs[0].maxIterations;
  return (
    <div>
      <button type="button" className="flex items-center gap-1 text-sm font-medium" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        Configuration
        <span className="font-normal text-muted-foreground ml-1">
          · {defs.length} component{defs.length === 1 ? "" : "s"} · {maxIterations ? `up to ${maxIterations} repair iteration${maxIterations === 1 ? "" : "s"}` : "no repair iterations"}
        </span>
      </button>
      {open && (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-1.5 pr-3 font-medium">Component</th>
                <th className="py-1.5 pr-3 font-medium">Kind</th>
                <th className="py-1.5 pr-3 font-medium">Model</th>
                <th className="py-1.5 pr-3 font-medium">Settings</th>
                <th className="py-1.5 pr-3 font-medium">When it runs</th>
                <th className="py-1.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {defs.map((d) => (
                <tr key={d.component} className="border-b last:border-0 align-top">
                  <td className="py-1.5 pr-3 font-mono">{d.component}</td>
                  <td className="py-1.5 pr-3"><Badge variant="outline" className="text-[10px] py-0">{d.kind === "llm" ? "model call" : "rules"}</Badge></td>
                  <td className="py-1.5 pr-3 font-mono">{d.model || "–"}</td>
                  <td className="py-1.5 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {settingEntries(d.settings).map(([k, v]) => (
                        <span key={k} className="rounded bg-muted px-1.5 py-0.5"><span className="text-muted-foreground">{k}</span> {String(v)}</span>
                      ))}
                      {Object.keys(d.settings).length === 0 && <span className="text-muted-foreground">–</span>}
                    </div>
                  </td>
                  <td className="py-1.5 pr-3 text-muted-foreground max-w-xs">{d.applies || "every time"}</td>
                  <td className="py-1.5 text-right whitespace-nowrap">
                    {d.kind === "llm" && d.promptText && (
                      <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => setText(d)}><FileText className="h-3.5 w-3.5" />Prompt</Button>
                    )}
                    {d.kind === "rules" && d.rulesText && (
                      <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => setText(d)}><ListChecks className="h-3.5 w-3.5" />Rules</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!text} onOpenChange={(o) => !o && setText(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-base">{text?.component} · {text?.kind === "llm" ? "prompt" : "rules"}</DialogTitle>
            <DialogDescription>
              {text?.kind === "llm"
                ? <>{text.model} · placeholders in braces are filled in for each exercise. {text.promptId && <span className="font-mono">({text.promptId})</span>}</>
                : "Deterministic rules in the code, no model."}
            </DialogDescription>
          </DialogHeader>
          {text?.kind === "llm" && text.promptText && <PromptText text={text.promptText} />}
          {text?.kind === "rules" && text.rulesText && <Markdown text={text.rulesText} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const StageCard = ({
  position,
  stage,
  iterations,
  issues,
  defs,
  onOpen,
}: {
  /** 1-based position among the stages this run has */
  position: number;
  stage: TraceStage;
  iterations: TraceIteration[];
  issues: TraceIssue[];
  defs: StageDef[];
  onOpen: (q: AttemptQuery) => void;
}) => {
  const open = (title: string, iteration: number | "last", verdicts?: readonly string[], minIteration?: number) => () =>
    onOpen({ title: `${stage.stageLabel} · ${title}`, stage: stage.stage, iteration, verdicts: verdicts ? [...verdicts] : undefined, minIteration });
  const metric = (label: string, node: React.ReactNode, sub?: React.ReactNode) => (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-lg">{node}</div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
  return (
    <Card className="p-4 md:p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-semibold grid place-items-center">{position}</span>
          <h3 className="text-lg font-semibold">{stage.stageLabel}</h3>
        </div>
        <Usage {...stage} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metric("In", <CountLink n={stage.nIn} onOpen={open("entered", 0)} showPct={false} />)}
        {metric(
          "Passed",
          <CountLink n={stage.nPassed} total={stage.nIn} tone="passed" onOpen={open("passed", "last", VERDICTS.passed)} />,
          <>
            <CountLink n={stage.nPassedFirstTry} onOpen={open("passed at the first try", 0, VERDICTS.passed)} showPct={false} /> at the first try ·{" "}
            <CountLink n={stage.nPassedAfterRetry} onOpen={open("passed after a repair", "last", VERDICTS.passed, 1)} showPct={false} /> after a repair
          </>,
        )}
        {metric("Failed (rejected here)", <CountLink n={stage.nFailed} total={stage.nIn} tone="failed" onOpen={open("failed", "last", VERDICTS.failed)} />)}
        {metric(
          "Other",
          <CountLink n={stage.nOther} total={stage.nIn} tone="other" onOpen={open("other", "last", [...VERDICTS.other, "retry"])} />,
          "API errors, unfinished, unknown",
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Iteration</th>
              <th className="py-2 pr-3 font-medium text-right">In</th>
              <th className="py-2 pr-3 font-medium text-right">Passed</th>
              <th className="py-2 pr-3 font-medium text-right">To next iteration</th>
              <th className="py-2 pr-3 font-medium text-right">Failed</th>
              <th className="py-2 pr-3 font-medium text-right">Other</th>
              <th className="py-2 pr-3 font-medium text-right">Cost</th>
              <th className="py-2 pr-3 font-medium">Models</th>
              <th className="py-2 pr-3 font-medium text-right">Span</th>
              <th className="py-2 font-medium text-right">Call time</th>
            </tr>
          </thead>
          <tbody>
            {iterations.map((it) => {
              const label = iterationLabel(stage.stage, it.iteration);
              const q = (title: string, verdicts?: readonly string[]) => open(`${it.iteration === 0 ? "" : `iteration ${it.iteration} · `}${title}`, it.iteration, verdicts);
              const rowIssues = issues.filter((i) => i.iteration === it.iteration);
              return (
                <tr key={it.iteration} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground tabular-nums pt-0.5">{it.iteration}</span>
                      <div className="space-y-1.5">
                        <p className="leading-snug">{label}</p>
                        <Reasons issues={rowIssues} />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap"><CountLink n={it.nIn} onOpen={q("entered")} showPct={false} /></td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap"><CountLink n={it.nPassed} total={it.nIn} tone="passed" onOpen={q("passed", VERDICTS.passed)} /></td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap"><CountLink n={it.nRetry} total={it.nIn} tone="retry" onOpen={q("sent to the next iteration", VERDICTS.retry)} /></td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap"><CountLink n={it.nFailed} total={it.nIn} tone="failed" onOpen={q("failed", VERDICTS.failed)} /></td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap"><CountLink n={it.nOther} total={it.nIn} tone="other" onOpen={q("other", VERDICTS.other)} /></td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">{formatCost(it.costUsd)}</td>
                  <td className="py-2 pr-3 text-xs font-mono">{it.models.length ? it.models.join(", ") : "rules"}</td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap">{formatSeconds(it.spanSeconds)}</td>
                  <td className="py-2 text-right whitespace-nowrap">{formatSeconds(it.callSeconds)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Configuration defs={defs} />
    </Card>
  );
};
