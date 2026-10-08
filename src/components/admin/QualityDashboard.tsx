import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchJson, IssueLabel } from "./dashboardShared";
import { QualityKpis, QualityOverview } from "./quality/QualityOverview";
import { DEFAULT_EXERCISE_FILTERS, ExerciseFilters, QualityExercises } from "./quality/QualityExercises";
import { LearnerSignal } from "./quality/LearnerSignal";
import { CheckerRunsView } from "./quality/CheckerRunsView";
import { CompareRunsView } from "./quality/CompareRunsView";
import { ExerciseDetailSheet } from "./quality/ExerciseDetailSheet";

type KpiResponse = {
  kpis: QualityKpis;
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

  const openSegment = (segment: string, level: string) => {
    setFilters({ ...DEFAULT_EXERCISE_FILTERS, source: "all", segment, level });
    setView("exercises");
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">Could not load quality data: {error}</p>}
      <Tabs value={view} onValueChange={setView}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="signal">Learner signal</TabsTrigger>
          <TabsTrigger value="checker">Checker runs</TabsTrigger>
          <TabsTrigger value="compare">Compare runs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <QualityOverview apiBase={apiBase} kpis={data?.kpis || null} sections={sections} onSegmentClick={openSegment} />
        </TabsContent>
        <TabsContent value="exercises" className="mt-4">
          <QualityExercises
            apiBase={apiBase}
            filters={filters}
            onFiltersChange={setFilters}
            sections={sections}
            issueLabels={labels}
            onOpen={setOpenId}
            onChanged={loadKpis}
          />
        </TabsContent>
        <TabsContent value="signal" className="mt-4">
          <LearnerSignal apiBase={apiBase} onOpen={setOpenId} />
        </TabsContent>
        <TabsContent value="checker" className="mt-4">
          <CheckerRunsView apiBase={apiBase} onOpen={setOpenId} onChanged={loadKpis} />
        </TabsContent>
        <TabsContent value="compare" className="mt-4">
          <CompareRunsView apiBase={apiBase} onOpen={setOpenId} onChanged={loadKpis} />
        </TabsContent>
      </Tabs>

      <ExerciseDetailSheet apiBase={apiBase} exerciseId={openId} issueLabels={labels} onClose={() => setOpenId(null)} />
    </div>
  );
};
