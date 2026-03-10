import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, ChevronDown, ChevronUp, Info, Copy, Check } from "lucide-react";

interface SimilarityDashboardProps {
  apiBase: string;
}

interface RunInfo {
  id: string;
  createdAt: string;
  completedAt: string;
  totalExercises: number;
  totalPairs: number;
  durationSeconds: number;
  status: string;
}

interface SectionSummary {
  grammarSectionId: string;
  sectionName: string;
  level: string;
  exerciseCount: number;
  hasRunData: boolean;
  meanSimilarity: number | null;
  maxSimilarity: number | null;
  minSimilarity: number | null;
  medianAvgSim: number | null;
  bucket0_10: number | null;
  bucket10_25: number | null;
  bucket25_50: number | null;
  bucket50_75: number | null;
  bucket75plus: number | null;
}

interface PairData {
  exerciseAId: string;
  exerciseBId: string;
  similarityScore: number;
}

interface FeatureData {
  exerciseId: string;
  level: string;
  textPreview: string | null;
  orderNumber: number | null;
}

interface ExerciseDetail {
  id: string;
  text: string;
  level: string;
  orderNumber: number;
  grammarSectionId: string;
  gaps: Array<{ gapNumber: number; correctAnswer: string; distractors: string[] }>;
  features: { grammarSectionId: string; level: string } | null;
}

interface PairDetail {
  exerciseA: ExerciseDetail | null;
  exerciseB: ExerciseDetail | null;
  similarityScore: number | null;
}

type SortKey = "sectionName" | "level" | "exerciseCount" | "meanSimilarity" | "medianAvgSim" | "maxSimilarity" | "bucket75plus";

/** Replace [1], [2] etc. with correct answers as highlighted spans */
const renderTextWithGaps = (text: string, gaps: Array<{ gapNumber: number; correctAnswer: string }>) => {
  if (!gaps || gaps.length === 0) return text;

  const gapMap: Record<number, string> = {};
  for (const g of gaps) gapMap[g.gapNumber] = g.correctAnswer;

  const parts: Array<string | { answer: string; num: number }> = [];
  let lastIndex = 0;
  const regex = /\[(\d+)\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const num = parseInt(match[1], 10);
    parts.push({ answer: gapMap[num] || `[${num}]`, num });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, i) =>
    typeof part === "string" ? (
      <span key={i}>{part}</span>
    ) : (
      <span key={i} className="font-semibold text-primary bg-primary/10 px-1 rounded" title={`Gap ${part.num}`}>
        {part.answer}
      </span>
    )
  );
};

const getSimBadgeVariant = (score: number): "destructive" | "secondary" | "default" => {
  if (score >= 0.85) return "destructive";
  if (score >= 0.7) return "secondary";
  return "default";
};

/** Heatmap colors matching the header distribution buckets:
 *  0–0.1: green, 0.1–0.25: green, 0.25–0.5: neutral, 0.5–0.75: orange, >0.75: red */
const getHeatmapBg = (score: number): string => {
  if (score >= 0.75) return "rgba(220, 38, 38, 0.6)";   // red-600
  if (score >= 0.5) return "rgba(234, 88, 12, 0.5)";     // orange-600
  if (score >= 0.25) return "rgba(156, 163, 175, 0.25)";  // gray-400
  if (score >= 0.1) return "rgba(22, 163, 74, 0.25)";    // green-600
  return "rgba(22, 163, 74, 0.15)";                       // green-600 lighter
};

export const SimilarityDashboard = ({ apiBase }: SimilarityDashboardProps) => {
  const { t } = useTranslation();

  // Overview state
  const [runs, setRuns] = useState<RunInfo[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("maxSimilarity");
  const [sortAsc, setSortAsc] = useState(false);

  // Heatmap state
  const [selectedSection, setSelectedSection] = useState<SectionSummary | null>(null);
  const [pairs, setPairs] = useState<PairData[]>([]);
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // Pair detail state
  const [pairDetail, setPairDetail] = useState<PairDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Copy-to-clipboard feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Selected run derived from state
  const selectedRun = useMemo(
    () => runs.find((r) => r.id === selectedRunId) || null,
    [runs, selectedRunId]
  );

  // Fetch overview on mount
  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async (runId?: string) => {
    setLoadingOverview(true);
    try {
      const url = runId
        ? `${apiBase}/admin-similarity-overview?run_id=${encodeURIComponent(runId)}`
        : `${apiBase}/admin-similarity-overview`;
      const res = await fetch(url);
      const data = await res.json();
      setRuns(data.runs || []);
      setSelectedRunId(data.selectedRunId || null);
      setSections(data.sections || []);
    } catch (err) {
      console.error("Failed to fetch similarity overview:", err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const handleRunChange = (runId: string) => {
    setSelectedSection(null);
    fetchOverview(runId);
  };

  const fetchHeatmap = useCallback(async (section: SectionSummary) => {
    if (!selectedRunId || !section.hasRunData) return;
    setLoadingHeatmap(true);
    setSelectedSection(section);
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-heatmap?section_id=${encodeURIComponent(section.grammarSectionId)}&run_id=${selectedRunId}`
      );
      const data = await res.json();
      setPairs(data.pairs || []);
      setFeatures(data.features || []);
    } catch (err) {
      console.error("Failed to fetch heatmap:", err);
    } finally {
      setLoadingHeatmap(false);
    }
  }, [apiBase, selectedRunId]);

  const fetchPairDetail = useCallback(async (exerciseA: string, exerciseB: string) => {
    if (!selectedRunId) return;
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-pair-detail?exercise_a=${encodeURIComponent(exerciseA)}&exercise_b=${encodeURIComponent(exerciseB)}&run_id=${selectedRunId}`
      );
      const data = await res.json();
      setPairDetail(data);
    } catch (err) {
      console.error("Failed to fetch pair detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, [apiBase, selectedRunId]);

  // Sorted sections
  const sortedSections = useMemo(() => {
    const sorted = [...sections].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      // Nulls always go last
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [sections, sortKey, sortAsc]);

  // Build heatmap matrix
  const heatmapMatrix = useMemo(() => {
    if (pairs.length === 0) return { exerciseIds: [], matrix: {} as Record<string, Record<string, number>> };

    const ids = new Set<string>();
    const matrix: Record<string, Record<string, number>> = {};

    for (const p of pairs) {
      ids.add(p.exerciseAId);
      ids.add(p.exerciseBId);
      if (!matrix[p.exerciseAId]) matrix[p.exerciseAId] = {};
      if (!matrix[p.exerciseBId]) matrix[p.exerciseBId] = {};
      matrix[p.exerciseAId][p.exerciseBId] = p.similarityScore;
      matrix[p.exerciseBId][p.exerciseAId] = p.similarityScore;
    }

    // Sort by order_number (from features), fallback to ID
    const exerciseIds = Array.from(ids).sort((a, b) => {
      const orderA = featureMap[a]?.orderNumber ?? Infinity;
      const orderB = featureMap[b]?.orderNumber ?? Infinity;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
    return { exerciseIds, matrix };
  }, [pairs, featureMap]);

  // Neighbor chart data: max similarity per exercise
  const neighborData = useMemo(() => {
    if (pairs.length === 0) return [];

    const maxSim: Record<string, number> = {};
    for (const p of pairs) {
      maxSim[p.exerciseAId] = Math.max(maxSim[p.exerciseAId] || 0, p.similarityScore);
      maxSim[p.exerciseBId] = Math.max(maxSim[p.exerciseBId] || 0, p.similarityScore);
    }

    return Object.entries(maxSim)
      .map(([id, score]) => ({ exerciseId: id, maxSimilarity: score }))
      .sort((a, b) => b.maxSimilarity - a.maxSimilarity);
  }, [pairs]);

  // Feature lookup for labels
  const featureMap = useMemo(() => {
    const map: Record<string, FeatureData> = {};
    for (const f of features) map[f.exerciseId] = f;
    return map;
  }, [features]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortAsc ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };

  const shortId = (id: string) => id.length > 8 ? `...${id.slice(-6)}` : id;

  /** Label for heatmap axes: "#order ...id" */
  const heatmapLabel = (id: string) => {
    const order = featureMap[id]?.orderNumber;
    const idPart = shortId(id);
    return order != null ? `#${order} ${idPart}` : idPart;
  };

  const formatRunLabel = (r: RunInfo) => {
    const date = new Date(r.completedAt).toLocaleString("de-DE");
    return `${date} — ${r.totalExercises} ex, ${r.totalPairs.toLocaleString()} pairs, ${r.durationSeconds.toFixed(1)}s`;
  };

  if (loadingOverview) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading similarity data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Overview Table */}
      <Card className="p-6 animate-fade-in">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Section Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">
            For each exercise, we compute its average cosine similarity to all other exercises in the same section.
            The distribution columns show how many exercises fall into each similarity range.
            Click a row to explore the pairwise heatmap.
          </p>

          {/* Run selector */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {runs.length > 0 ? (
              <>
                <span className="text-sm font-medium">Analysis run:</span>
                <Select
                  value={selectedRunId || ""}
                  onValueChange={handleRunChange}
                >
                  <SelectTrigger className="w-auto min-w-[350px] h-8 text-xs">
                    <SelectValue placeholder="Select a run..." />
                  </SelectTrigger>
                  <SelectContent>
                    {runs.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs">
                        {formatRunLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRun && (
                  <Badge variant="default" className="text-xs">{selectedRun.status}</Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t("admin.similarity.noData", "No similarity analysis runs found. Run the analysis script first.")}
              </p>
            )}
          </div>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {/* Column group headers */}
                <tr className="border-b bg-muted/30">
                  <th colSpan={3} className="text-left py-1.5 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Grammar Section
                  </th>
                  <th colSpan={3} className="text-center py-1.5 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-l">
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center gap-1">
                        Pairwise Similarity
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>Cosine similarity across all exercise pairs in the section. Avg and Median summarize the overall distribution, Max shows the highest single pair.</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  <th colSpan={5} className="text-center py-1.5 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-l">
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center gap-1">
                        Exercise Distribution by Avg Neighbor Similarity
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>Each exercise is placed into a bucket based on its average similarity to all other exercises. Shows count/total (percentage). Green = unique, orange = moderately similar, red = near-duplicate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                </tr>
                {/* Individual column headers */}
                <tr className="border-b">
                  <th className="text-left py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("sectionName")}>
                    Section <SortIcon columnKey="sectionName" />
                  </th>
                  <th className="text-left py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("level")}>
                    Level <SortIcon columnKey="level" />
                  </th>
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("exerciseCount")}>
                    <Tooltip>
                      <TooltipTrigger>Exercises <SortIcon columnKey="exerciseCount" /></TooltipTrigger>
                      <TooltipContent>Total active exercises in this section</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary border-l" onClick={() => handleSort("meanSimilarity")}>
                    <Tooltip>
                      <TooltipTrigger>Avg <SortIcon columnKey="meanSimilarity" /></TooltipTrigger>
                      <TooltipContent>Mean pairwise similarity across all exercise pairs</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("medianAvgSim")}>
                    <Tooltip>
                      <TooltipTrigger>Median <SortIcon columnKey="medianAvgSim" /></TooltipTrigger>
                      <TooltipContent>Median of per-exercise average neighbor similarity</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("maxSimilarity")}>
                    <Tooltip>
                      <TooltipTrigger>Max <SortIcon columnKey="maxSimilarity" /></TooltipTrigger>
                      <TooltipContent>Highest similarity between any two exercises</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-center py-2 px-2 border-l">
                    <Tooltip>
                      <TooltipTrigger className="text-green-700 dark:text-green-400">0–0.1</TooltipTrigger>
                      <TooltipContent>Very unique — almost no overlap with other exercises</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-center py-2 px-2">
                    <Tooltip>
                      <TooltipTrigger className="text-green-600 dark:text-green-400">0.1–0.25</TooltipTrigger>
                      <TooltipContent>Mostly unique — low similarity to nearest neighbor</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-center py-2 px-2">
                    <Tooltip>
                      <TooltipTrigger>0.25–0.5</TooltipTrigger>
                      <TooltipContent>Moderate — some shared structure or vocabulary</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-center py-2 px-2">
                    <Tooltip>
                      <TooltipTrigger className="text-orange-600 dark:text-orange-400">0.5–0.75</TooltipTrigger>
                      <TooltipContent>Similar — significant overlap, review recommended</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-center py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("bucket75plus")}>
                    <Tooltip>
                      <TooltipTrigger className="text-red-600 dark:text-red-400">&gt;0.75 <SortIcon columnKey="bucket75plus" /></TooltipTrigger>
                      <TooltipContent>Near-duplicate — very high similarity, likely needs deduplication</TooltipContent>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSections.map((s) => {
                  const hasData = s.hasRunData;
                  const exCount = hasData ? s.exerciseCount : s.exerciseCount;
                  const pct = (n: number | null) => (n != null && exCount > 0) ? Math.round((n / exCount) * 100) : 0;

                  const renderBucket = (val: number | null, colorClass: string) => {
                    if (!hasData || val == null) return <span className="text-muted-foreground/50">—</span>;
                    if (val === 0) return <span className="text-muted-foreground/50">—</span>;
                    return (
                      <span className={colorClass}>
                        <span className="font-medium">{val}</span>
                        <span className="text-xs text-muted-foreground">/{exCount}</span>
                        <span className="text-xs text-muted-foreground ml-0.5">({pct(val)}%)</span>
                      </span>
                    );
                  };

                  return (
                    <tr
                      key={s.grammarSectionId}
                      className={`border-b transition-colors ${hasData ? "hover:bg-muted/50 cursor-pointer" : "opacity-60"}`}
                      onClick={() => hasData && fetchHeatmap(s)}
                    >
                      <td className="py-2.5 px-2 font-medium">{s.sectionName}</td>
                      <td className="py-2.5 px-2">
                        <Badge variant="outline" className="text-xs">{s.level}</Badge>
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">{s.exerciseCount}</td>
                      <td className="text-right py-2.5 px-2 tabular-nums border-l">
                        {hasData && s.meanSimilarity != null ? s.meanSimilarity.toFixed(3) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">
                        {hasData && s.medianAvgSim != null ? s.medianAvgSim.toFixed(3) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2">
                        {hasData && s.maxSimilarity != null ? (
                          <Badge variant={getSimBadgeVariant(s.maxSimilarity)} className="tabular-nums">
                            {s.maxSimilarity.toFixed(3)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="text-center py-2.5 px-2 border-l">
                        {renderBucket(s.bucket0_10, "text-green-700 dark:text-green-400")}
                      </td>
                      <td className="text-center py-2.5 px-2">
                        {renderBucket(s.bucket10_25, "text-green-600 dark:text-green-400")}
                      </td>
                      <td className="text-center py-2.5 px-2">
                        {renderBucket(s.bucket25_50, "")}
                      </td>
                      <td className="text-center py-2.5 px-2">
                        {renderBucket(s.bucket50_75, "text-orange-600 dark:text-orange-400")}
                      </td>
                      <td className="text-center py-2.5 px-2">
                        {renderBucket(s.bucket75plus, "text-red-600 dark:text-red-400")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
      </Card>

      {/* Heatmap + Neighbor Chart (shown when section is selected) */}
      {selectedSection && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedSection(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h3 className="text-lg font-semibold">
              {selectedSection.sectionName} ({selectedSection.level})
            </h3>
          </div>

          {loadingHeatmap ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading heatmap...</p>
            </Card>
          ) : (
            <>
              {/* Similarity Heatmap */}
              {heatmapMatrix.exerciseIds.length > 0 && heatmapMatrix.exerciseIds.length <= 50 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">{t("admin.similarity.heatmap", "Similarity Heatmap")}</h4>
                  <div className="overflow-x-auto">
                    <TooltipProvider>
                      <table className="border-collapse">
                        <thead>
                          <tr>
                            <th className="p-1 text-xs"></th>
                            {heatmapMatrix.exerciseIds.map((id) => (
                              <th key={id} className="p-1 text-xs" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className="cursor-pointer hover:text-primary transition-colors"
                                      onClick={() => copyToClipboard(id)}
                                    >
                                      {copiedId === id ? <Check className="h-3 w-3 inline text-green-500" /> : heatmapLabel(id)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top"><p className="text-xs font-mono">{id}<br/>Click to copy</p></TooltipContent>
                                </Tooltip>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {heatmapMatrix.exerciseIds.map((rowId) => (
                            <tr key={rowId}>
                              <td className="p-1 text-xs font-medium whitespace-nowrap">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className="cursor-pointer hover:text-primary transition-colors"
                                      onClick={() => copyToClipboard(rowId)}
                                    >
                                      {copiedId === rowId ? <Check className="h-3 w-3 inline text-green-500" /> : heatmapLabel(rowId)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="left"><p className="text-xs font-mono">{rowId}<br/>Click to copy</p></TooltipContent>
                                </Tooltip>
                              </td>
                              {heatmapMatrix.exerciseIds.map((colId) => {
                                if (rowId === colId) {
                                  return (
                                    <td key={colId} className="p-0">
                                      <div className="w-6 h-6 bg-muted" />
                                    </td>
                                  );
                                }
                                const score = heatmapMatrix.matrix[rowId]?.[colId];
                                if (score === undefined) {
                                  return (
                                    <td key={colId} className="p-0">
                                      <div className="w-6 h-6 bg-muted/30" />
                                    </td>
                                  );
                                }
                                return (
                                  <td key={colId} className="p-0">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className="w-6 h-6 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                          style={{ backgroundColor: getHeatmapBg(score) }}
                                          onClick={() => fetchPairDetail(rowId, colId)}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{(score * 100).toFixed(1)}%</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TooltipProvider>
                  </div>
                  {/* Color legend */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Low</span>
                    <div className="flex gap-0.5">
                      {[0.05, 0.15, 0.35, 0.6, 0.8].map((s) => (
                        <div key={s} className="w-4 h-4 rounded-sm" style={{ backgroundColor: getHeatmapBg(s) }} />
                      ))}
                    </div>
                    <span>High</span>
                  </div>
                </Card>
              )}

              {heatmapMatrix.exerciseIds.length > 50 && (
                <Card className="p-6">
                  <p className="text-muted-foreground text-sm">
                    Section has {heatmapMatrix.exerciseIds.length} exercises — heatmap too large to render.
                    Use the neighbor chart below to identify high-similarity exercises.
                  </p>
                </Card>
              )}

              {/* Neighbor Similarity Chart */}
              {neighborData.length > 0 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Max Similarity per Exercise</h4>
                  <div style={{ height: Math.max(300, neighborData.length * 28) }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={neighborData} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <YAxis
                          type="category"
                          dataKey="exerciseId"
                          width={75}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) => v.length > 10 ? `...${v.slice(-8)}` : v}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Max Similarity"]}
                          labelFormatter={(label) => `Exercise: ${label}`}
                        />
                        <Bar
                          dataKey="maxSimilarity"
                          fill="#3b82f6"
                          cursor="pointer"
                          onClick={(data) => {
                            const ex = data.exerciseId;
                            const topPair = pairs
                              .filter((p) => p.exerciseAId === ex || p.exerciseBId === ex)
                              .sort((a, b) => b.similarityScore - a.similarityScore)[0];
                            if (topPair) {
                              fetchPairDetail(topPair.exerciseAId, topPair.exerciseBId);
                            }
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Top similar pairs list */}
              {pairs.length > 0 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Top Similar Pairs</h4>
                  <div className="space-y-2">
                    {pairs.slice(0, 20).map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => fetchPairDetail(p.exerciseAId, p.exerciseBId)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-xs">{shortId(p.exerciseAId)}</span>
                          <span className="text-muted-foreground">↔</span>
                          <span className="font-mono text-xs">{shortId(p.exerciseBId)}</span>
                          {featureMap[p.exerciseAId]?.textPreview && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {featureMap[p.exerciseAId].textPreview}
                            </span>
                          )}
                        </div>
                        <Badge variant={getSimBadgeVariant(p.similarityScore)}>
                          {(p.similarityScore * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Least similar pairs list */}
              {pairs.length > 0 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Least Similar Pairs</h4>
                  <div className="space-y-2">
                    {[...pairs].reverse().slice(0, 20).map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => fetchPairDetail(p.exerciseAId, p.exerciseBId)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-xs">{shortId(p.exerciseAId)}</span>
                          <span className="text-muted-foreground">↔</span>
                          <span className="font-mono text-xs">{shortId(p.exerciseBId)}</span>
                          {featureMap[p.exerciseAId]?.textPreview && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {featureMap[p.exerciseAId].textPreview}
                            </span>
                          )}
                        </div>
                        <Badge variant="default">
                          {(p.similarityScore * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Pair Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Pair Comparison
              {pairDetail?.similarityScore != null && (
                <Badge variant={getSimBadgeVariant(pairDetail.similarityScore)}>
                  {(pairDetail.similarityScore * 100).toFixed(2)}% similar
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <p className="text-muted-foreground py-4">Loading...</p>
          ) : pairDetail ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[pairDetail.exerciseA, pairDetail.exerciseB].map((ex, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {idx === 0 ? "Exercise A" : "Exercise B"}
                      </Badge>
                      <span
                        className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        onClick={() => ex?.id && copyToClipboard(ex.id)}
                        title="Click to copy full ID"
                      >
                        {shortId(ex?.id || "")}
                        {copiedId === ex?.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </span>
                      {ex?.level && (
                        <Badge variant="outline" className="text-xs">{ex.level}</Badge>
                      )}
                    </div>
                    <Card className="p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {ex?.text ? renderTextWithGaps(ex.text, ex.gaps || []) : "N/A"}
                      </p>
                    </Card>
                    {/* Correct answers & distractors */}
                    {ex?.gaps && ex.gaps.length > 0 && (
                      <Card className="p-3">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Answers & Distractors
                        </h5>
                        <div className="space-y-2">
                          {ex.gaps.map((gap) => (
                            <div key={gap.gapNumber} className="text-sm">
                              <span className="text-xs text-muted-foreground mr-1.5">Gap {gap.gapNumber}:</span>
                              <span className="font-medium text-green-700 dark:text-green-400">{gap.correctAnswer}</span>
                              {gap.distractors && gap.distractors.length > 0 && (
                                <span className="text-muted-foreground">
                                  {" / "}
                                  {gap.distractors.map((d, i) => (
                                    <span key={i} className="text-red-600/70 dark:text-red-400/70">
                                      {d}{i < gap.distractors.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
