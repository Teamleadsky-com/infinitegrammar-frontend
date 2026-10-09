import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IssueLabel, Verifier, fetchJson, verifierLabel } from "./dashboardShared";
import { QualityKpis, QualityOverview } from "./quality/QualityOverview";
import { DEFAULT_EXERCISE_FILTERS, ExerciseFilters, QualityExercises } from "./quality/QualityExercises";
import { LearnerSignal } from "./quality/LearnerSignal";
import { CheckerRunsView } from "./quality/CheckerRunsView";
import { CompareRunsView } from "./quality/CompareRunsView";
import { ExerciseDetailSheet } from "./quality/ExerciseDetailSheet";

type KpiResponse = {
  kpis: QualityKpis;
  verifiers: Verifier[];
  sections: Array<{ id: string; name: string; level: string }>;
  issueLabels: IssueLabel[];
};

export const QualityDashboard = ({
  apiBase,
  onLearnerReportsChange,
}: {
  apiBase: string;
  onLearnerReportsChange?: (count: number) => void;
}) => {
  const [view, setView] = useState("overview");
  const [verifier, setVerifier] = useState("all");
  const [data, setData] = useState<KpiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExerciseFilters>(DEFAULT_EXERCISE_FILTERS);
  const [openId, setOpenId] = useState<string | null>(null);

  const loadKpis = useCallback(() => {
    fetchJson<KpiResponse>(`${apiBase}/admin-quality-kpis`)
      .then((d) => {
        setData(d);
        setError(null);
        onLearnerReportsChange?.(d.kpis.openLearnerReports);
      })
      .catch((e) => setError(e.message));
  }, [apiBase, onLearnerReportsChange]);

  useEffect(loadKpis, [loadKpis]);

  const labels = Object.fromEntries((data?.issueLabels || []).map((l) => [l.code, l.label]));
  const sections = data?.sections || [];
  const verifiers = data?.verifiers || [];

  const openSegment = (segment: string, level: string) => {
    setFilters({ ...DEFAULT_EXERCISE_FILTERS, source: "all", segment, level });
    setView("exercises");
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">Could not load quality data: {error}</p>}
      <Tabs value={view} onValueChange={setView}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="signal">Learner signal</TabsTrigger>
            <TabsTrigger value="checker">Checker runs (history)</TabsTrigger>
            <TabsTrigger value="compare">Compare runs (history)</TabsTrigger>
          </TabsList>
          <div>
            <Label className="text-xs">Verified by</Label>
            <Select value={verifier} onValueChange={setVerifier}>
              <SelectTrigger className="w-[280px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All checks</SelectItem>
                {verifiers.map((v) => (
                  <SelectItem key={v.verifierVersion} value={v.verifierVersion}>{verifierLabel(v.verifierVersion)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <QualityOverview
            apiBase={apiBase}
            kpis={data?.kpis || null}
            verifiers={verifiers}
            selectedVerifier={verifier}
            onSelectVerifier={setVerifier}
            sections={sections}
            onSegmentClick={openSegment}
          />
        </TabsContent>
        <TabsContent value="exercises" className="mt-0">
          <QualityExercises
            apiBase={apiBase}
            verifier={verifier}
            filters={filters}
            onFiltersChange={setFilters}
            sections={sections}
            issueLabels={labels}
            onOpen={setOpenId}
            onChanged={loadKpis}
          />
        </TabsContent>
        <TabsContent value="signal" className="mt-0">
          <LearnerSignal apiBase={apiBase} onOpen={setOpenId} />
        </TabsContent>
        <TabsContent value="checker" className="mt-0">
          <CheckerRunsView apiBase={apiBase} onOpen={setOpenId} onChanged={loadKpis} />
        </TabsContent>
        <TabsContent value="compare" className="mt-0">
          <CompareRunsView apiBase={apiBase} onOpen={setOpenId} onChanged={loadKpis} />
        </TabsContent>
      </Tabs>

      <ExerciseDetailSheet apiBase={apiBase} exerciseId={openId} issueLabels={labels} onClose={() => setOpenId(null)} />
    </div>
  );
};
