import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Standard names first; the project's earlier names and the view columns for the team.
const METRICS: Array<{ name: string; meaning: string; formula: string; earlier: string; column: string }> = [
  { name: "Recall (sensitivity, TPR)", meaning: "Flawed items the setup rejected", formula: "TP / (TP + FN)", earlier: "Detection", column: "detection_pct (tpr)" },
  { name: "False-positive rate (FPR = 1 − specificity)", meaning: "Clean items the setup rejected", formula: "FP / (FP + TN)", earlier: "False rejects", column: "false_reject_pct (frr)" },
  { name: "Balanced accuracy", meaning: "Mean of TPR and TNR; does not depend on the share of flawed items", formula: "(TPR + 1 − FPR) / 2", earlier: "same", column: "balanced_accuracy_pct" },
  { name: "Precision (PPV) at prevalence π", meaning: "Rejected items that are really flawed, if a share π of the checked exercises were flawed", formula: "π·TPR / (π·TPR + (1 − π)·FPR)", earlier: "Precision at 20% / 50% flawed", column: "precision_at_20_pct, precision_at_50_pct" },
  { name: "False omission rate (FOR) at π", meaning: "Accepted items that are flawed: what would reach learners", formula: "π·(1 − TPR) / (π·(1 − TPR) + (1 − π)·(1 − FPR))", earlier: "–", column: "computed here from tpr and frr" },
  { name: "Raw precision on the benchmark", meaning: "Precision on the benchmark's own mix (2/3 flawed, 3/4 in the pilot), so higher than in production", formula: "TP / (TP + FP)", earlier: "–", column: "precision_set_pct" },
  { name: "Error attribution", meaning: "Caught with an issue code of the planted type (e.g. G2 or FG1 for a second correct answer)", formula: "TP with expected code / flawed", earlier: "Expected hit", column: "caught_expected, rejected_expected" },
  { name: "Localization", meaning: "A failing stage named the gap where the defect was planted", formula: "at planted gap / flawed with a planted gap", earlier: "At gap", column: "at_gap / n_with_gap" },
  { name: "Stage recall on its target types", meaning: "One check's recall on the types its codes cover (gap checks G1–G5, coherence G6, final gate FG1–FG6)", formula: "flagged / target items", earlier: "Own types flagged", column: "v_bench_stage_metrics.own_recall_pct" },
  { name: "Stage FPR", meaning: "Clean items one check flagged (its false alarms)", formula: "flagged / clean", earlier: "Clean flagged", column: "v_bench_stage_metrics.clean_flagged_pct" },
];

const FAQ: Array<[string, string]> = [
  [
    "Why not F1?",
    "F1 ignores true negatives, so it says nothing about false positives, and it shifts with the share of flawed items. Balanced accuracy and prevalence-adjusted precision handle both. The two errors also cost different things: a missed defect (FN) reaches learners, a false positive wastes a generated exercise and its cost.",
  ],
  [
    "Why no ROC curve or AUC?",
    "The checks give pass/fail verdicts, not scores, so each setup is one operating point. The recall vs FPR chart places the setups in ROC space instead.",
  ],
  [
    "Agreement with human labels?",
    "For planted items the labels are exact by construction. For real defects, the final gate was calibrated earlier on 98 hand-audited exercises; Cohen's kappa would be the number to report there.",
  ],
  [
    "How big is the test set?",
    "verifier_bench_v1 has 360 items: 120 clean and 240 flawed in 13 defect types. The pilot subset (24 items: 18 flawed, 6 clean) only shows that the plumbing works: 17 of 18 has a 95% interval of 74–99%. Decisions are made on the test subset (240 items); dev has 120.",
  ],
  [
    "When is a difference between two setups real?",
    "Setups run on the same items, so they are compared pairwise: the exact McNemar test uses only the items where they disagree. It needs at least 6 such items, all in one direction, to reach p < 0.05; the interval of the difference (Newcombe) shows how large it could be.",
  ],
];

/**
 * The benchmark explained in standard evaluation terms (spec §5.6.6): a one-line summary and the
 * confusion-matrix legend always shown, the method, metric glossary and FAQ on demand.
 */
export const BenchGuide = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      <p className="text-sm">
        <span className="font-medium">LLM-as-judge meta-evaluation.</span> Every pipeline setup (prompts, gates, models) checks the same labelled
        items verify-only: clean exercises and copies of them with exactly one planted defect. We measure the checker, not the generator.
        The <span className="font-medium">positive class is a flawed exercise</span>, and a rejection is a positive prediction.
      </p>
      <div className="grid grid-cols-[auto_1fr_1fr] max-w-md text-xs border rounded overflow-hidden" role="table" aria-label="Confusion matrix legend">
        <span className="p-2 bg-muted/50" />
        <span className="p-2 bg-muted/50 font-medium">Rejected (predicted flawed)</span>
        <span className="p-2 bg-muted/50 font-medium">Accepted</span>
        <span className="p-2 bg-muted/50 font-medium">Flawed (planted)</span>
        <span className="p-2"><span className="font-semibold text-green-700">TP</span> caught</span>
        <span className="p-2"><span className="font-semibold text-red-700">FN</span> missed, reaches learners</span>
        <span className="p-2 bg-muted/50 font-medium">Clean</span>
        <span className="p-2"><span className="font-semibold text-red-700">FP</span> wasted exercise</span>
        <span className="p-2"><span className="font-semibold text-green-700">TN</span> correct</span>
      </div>

      <button type="button" className="flex items-center gap-1 text-sm font-medium" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        Method, metric definitions and FAQ
      </button>
      {open && (
        <div className="space-y-5 text-sm">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-muted-foreground">
            <p><span className="font-medium text-foreground">Test set: fault injection.</span> Each flawed item is a clean exercise with one synthetic defect of a known type (P1–P13), like mutation testing; its label, defect type and gap are known exactly.</p>
            <p><span className="font-medium text-foreground">Contrastive pairs.</span> Each flawed copy has its clean twin (the parent) in the set, so a rejection can be checked against the same text without the defect.</p>
            <p><span className="font-medium text-foreground">FPR is a lower bound.</span> Clean items were chosen among exercises the production checks had accepted, so a production-like setup tends to accept them again.</p>
            <p><span className="font-medium text-foreground">Verify-only.</span> No repairs, and every stage checks every item, so each stage's verdict is recorded even when an earlier stage already rejected the item. The setup rejects an item if any stage fails it.</p>
            <p><span className="font-medium text-foreground">Seen in calibration:</span> the exercise was in the set the final-gate prompt was tuned on, so results there may look better. <span className="font-medium text-foreground">Clean source:</span> audit (production-accepted, graded clean), starter (onboarding starters), verified_v1 (older exercises verified in September 2026).</p>
            <p><span className="font-medium text-foreground">Intervals.</span> 95% Wilson score intervals for every rate; balanced accuracy combines the TPR and TNR intervals (MOVER). <span className="font-medium text-foreground">Cost and time</span> per item: the sum of its calls, and the span from the first request to the last answer (as in the Pipeline trace).</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-1.5 pr-3 font-medium">Metric</th>
                  <th className="py-1.5 pr-3 font-medium">What it counts</th>
                  <th className="py-1.5 pr-3 font-medium">Formula</th>
                  <th className="py-1.5 pr-3 font-medium">Earlier name here</th>
                  <th className="py-1.5 font-medium">Column (migration 015)</th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => (
                  <tr key={m.name} className="border-b last:border-0 align-top">
                    <td className="py-1.5 pr-3 font-medium">{m.name}</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">{m.meaning}</td>
                    <td className="py-1.5 pr-3 font-mono text-xs whitespace-nowrap">{m.formula}</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">{m.earlier}</td>
                    <td className="py-1.5 font-mono text-xs">{m.column}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            {FAQ.map(([q, a]) => (
              <div key={q}>
                <p className="font-medium">{q}</p>
                <p className="text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
