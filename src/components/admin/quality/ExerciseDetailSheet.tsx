import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Gap, GapList, IssueChips, TextWithGaps, fetchJson, formatDate, formatPct, formatUsd } from "../dashboardShared";

type Detail = {
  exercise: {
    id: string;
    text: string;
    contentTopic: string | null;
    model: string | null;
    sectionName: string | null;
    level: string;
    orderNumber: number;
    isActive: boolean;
    qualityStatus: string;
    reportSourceLabel: string | null;
    reportText: string | null;
    reportedAt: string | null;
    issueCodes: string[];
    verifierVersion: string | null;
    verifiedAt: string | null;
    generatorConfig: string | null;
    runId: string | null;
  };
  gaps: Gap[];
  qualityReport: Record<string, any> | null;
  audits: Array<{ verdict: string; auditor_type: string; auditor: string | null; audit_batch: string; note: string | null; audited_at: string | null }>;
  verifications: Array<{
    pipeline: string;
    label: string | null;
    runId: string;
    verdict: "passed" | "failed";
    issueCodes: string[];
    reason: string | null;
    checkedAt: string;
  }>;
  completions: number;
  avgCorrectPct: number | null;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-1 text-sm border-b last:border-0">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="text-right break-words min-w-0">{children}</span>
  </div>
);

const yesNo = (v: unknown) => (v === true ? "passed" : v === false ? "failed" : "—");

const QualityRecord = ({ report, labels }: { report: Record<string, any>; labels: Record<string, string> }) => {
  const mustPass = report.must_pass as Record<string, boolean> | undefined;
  const gateIssues = (report.final_gate?.issues as Array<{ gap: number; type: string; explanation: string }>) || [];
  return (
    <div>
      <Row label="Config / model">{[report.generator_config, report.model, report.reasoning_effort].filter(Boolean).join(" · ") || "—"}</Row>
      {report.audit_tag && <Row label="Live audit">{report.audit_tag}</Row>}
      <Row label="First draft">{yesNo(report.first_passed)}{report.first_l1_fails ? ` (${report.first_l1_fails} rule fails)` : ""}</Row>
      <Row label="Repair rounds">{report.repair_rounds ?? "—"}</Row>
      <Row label="Final verdict">{yesNo(report.final_passed)}{report.stopped_at ? ` · stopped at ${report.stopped_at}` : ""}</Row>
      {report.cost_usd !== undefined && <Row label="Cost">{formatUsd(Number(report.cost_usd))}</Row>}
      <Row label="Verifier">{[report.verifier_version, formatDate(report.verified_at)].filter((v) => v && v !== "—").join(" · ") || "—"}</Row>
      {mustPass && (
        <div className="py-2">
          <p className="text-xs text-muted-foreground mb-1">Checks</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(mustPass).map(([code, ok]) => (
              <Badge key={code} variant={ok ? "outline" : "destructive"} className="text-[10px]" title={labels[code] || code}>
                {code} {ok ? "✓" : "✗"}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(report.repairs) && report.repairs.length > 0 && (
        <div className="py-2">
          <p className="text-xs text-muted-foreground mb-1">Repairs</p>
          {report.repairs.map((r: any) => (
            <p key={r.round} className="text-sm">
              Round {r.round}: gaps {(r.failing_gaps || []).join(", ") || "—"} → {r.passed_after ? "passed" : "still failing"}
            </p>
          ))}
        </div>
      )}
      {gateIssues.length > 0 && (
        <div className="py-2">
          <p className="text-xs text-muted-foreground mb-1">Final gate issues</p>
          {gateIssues.map((g, i) => (
            <p key={i} className="text-sm">Gap {g.gap} · {g.type}: {g.explanation}</p>
          ))}
        </div>
      )}
      {report.feedback_text && (
        <div className="py-2">
          <p className="text-xs text-muted-foreground mb-1">Feedback</p>
          <p className="text-sm">{report.feedback_text}</p>
        </div>
      )}
    </div>
  );
};

export const ExerciseDetailSheet = ({
  apiBase,
  exerciseId,
  issueLabels,
  onClose,
}: {
  apiBase: string;
  exerciseId: string | null;
  issueLabels: Record<string, string>;
  onClose: () => void;
}) => {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exerciseId) return;
    setDetail(null);
    setError(null);
    fetchJson<Detail>(`${apiBase}/admin-quality-exercise-detail?id=${encodeURIComponent(exerciseId)}`)
      .then(setDetail)
      .catch((e) => setError(e.message));
  }, [apiBase, exerciseId]);

  const e = detail?.exercise;
  return (
    <Sheet open={!!exerciseId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Exercise detail</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">{exerciseId}</SheetDescription>
        </SheetHeader>

        {error && <p className="text-sm text-destructive mt-4">Could not load: {error}</p>}
        {!detail && !error && (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        )}

        {detail && e && (
          <div className="space-y-4 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{e.level}</Badge>
              <Badge variant="outline">{e.sectionName}</Badge>
              <Badge variant="secondary">#{e.orderNumber}</Badge>
              <Badge variant={e.isActive ? "default" : "destructive"}>{e.isActive ? "Live" : "Deactivated"}</Badge>
              <Badge variant="outline">{e.qualityStatus}</Badge>
              {e.reportSourceLabel && <Badge variant="outline">{e.reportSourceLabel}</Badge>}
            </div>

            <Card className="p-4">
              <TextWithGaps text={e.text} gaps={detail.gaps} />
            </Card>

            {detail.gaps.length > 0 && (
              <Card className="p-4">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Answers, distractors, explanations</h5>
                <GapList gaps={detail.gaps} showExplanation />
              </Card>
            )}

            {e.reportText && (
              <Card className="p-4 border-destructive/30 bg-destructive/5">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Report · {formatDate(e.reportedAt)}
                </h5>
                <p className="text-sm">{e.reportText}</p>
              </Card>
            )}

            <Card className="p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quality record</h5>
              <div className="mb-2"><IssueChips codes={e.issueCodes} labels={issueLabels} /></div>
              {detail.qualityReport ? (
                <QualityRecord report={detail.qualityReport} labels={issueLabels} />
              ) : (
                <p className="text-sm text-muted-foreground">Not checked with the current pipeline.</p>
              )}
            </Card>

            <Card className="p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Verification history</h5>
              {(detail.verifications || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No pipeline has checked this exercise.</p>
              ) : (
                <div className="space-y-2">
                  {detail.verifications.map((v, i) => (
                    <div key={i} className="text-sm border-b last:border-0 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={v.verdict === "passed" ? "outline" : "destructive"}>{v.verdict}</Badge>
                        <span className="font-medium">{v.label || v.pipeline}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(v.checkedAt)} · run {v.runId}</span>
                        {i === 0 && <span className="text-xs text-muted-foreground">(latest)</span>}
                      </div>
                      {v.issueCodes.length > 0 && <div className="mt-1"><IssueChips codes={v.issueCodes} labels={issueLabels} /></div>}
                      {v.reason && <p className="text-xs text-muted-foreground mt-1">{v.reason}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Audit grades</h5>
              {detail.audits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No audits.</p>
              ) : (
                detail.audits.map((a, i) => (
                  <Row key={i} label={`${formatDate(a.audited_at)} · ${a.auditor_type}${a.auditor ? ` (${a.auditor})` : ""}`}>
                    <span className="font-medium">{a.verdict}</span>
                    {a.note ? ` · ${a.note}` : ""}
                  </Row>
                ))
              )}
            </Card>

            <Card className="p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Learners</h5>
              <Row label="Completions">{detail.completions}</Row>
              <Row label="Average correct">{formatPct(detail.avgCorrectPct)}</Row>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
