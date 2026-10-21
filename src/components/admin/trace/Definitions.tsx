import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VERDICT_HELP, Verdict } from "@/lib/pipelineTrace";
import { VerdictChip } from "./TraceBits";

/** How to read the trace (spec §5.5.6). */
export const Definitions = () => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-4">
      <button type="button" className="flex items-center gap-1 text-sm font-medium" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        How to read this
      </button>
      {open && (
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-3 text-sm">
          <div className="space-y-1.5">
            <h4 className="font-medium">Verdicts</h4>
            {(Object.keys(VERDICT_HELP) as Verdict[]).map((v) => (
              <div key={v} className="flex items-start gap-2">
                <span className="w-16 shrink-0"><VerdictChip verdict={v} /></span>
                <span className="text-muted-foreground">{VERDICT_HELP[v]}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground">Counting</h4>
              <p>An attempt counts in every iteration it enters. A stage's "in" is the number of attempts that reached it, so the "passed" of one stage is the "in" of the next, except attempts that end as "other" (for example unfinished ones).</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Cost</h4>
              <p>Per step: the calls made in that step at the run's prices (batch prices are half the standard ones). The steps of an attempt add up to its cost. The run's total is what the run paid: in experiments that compare configs on the same test cases, identical requests are paid once but counted for each config, so the attempts can add up to more.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Durations</h4>
              <p>Run: wall clock from start to the last update. Span of a stage or iteration: first request sent to last answer received, over all attempts (in batch mode mostly queue time). Call time: summed request time of sync calls only, empty in batch mode. Runs from before 2026-10-21 and rule-only steps have no times ("–").</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
