import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { ClusteringDendrogram } from "./ClusteringDendrogram";

interface SimilarityDashboardProps {
  apiBase: string;
}

interface SectionRunInfo {
  id: string;
  completedAt: string;
  totalExercises: number;
  totalPairs: number;
  durationSeconds: number;
}

interface SectionSummary {
  grammarSectionId: string;
  sectionName: string;
  level: string;
  exerciseCount: number;
  hasRunData: boolean;
  latestRunId: string | null;
  latestRunDate: string | null;
  availableRuns: SectionRunInfo[];
  meanSimilarity: number | null;
  maxSimilarity: number | null;
  minSimilarity: number | null;
  medianAvgSim: number | null;
  bucket0_10: number | null;
  bucket10_25: number | null;
  bucket25_50: number | null;
  bucket50_75: number | null;
  bucket75plus: number | null;
  weightedNeighborScore: number | null;
  orderingQualityRatio: number | null;
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

type SortKey = "sectionName" | "level" | "exerciseCount" | "meanSimilarity" | "medianAvgSim" | "maxSimilarity" | "weightedNeighborScore" | "orderingQualityRatio" | "bucket75plus";

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

const getWnsColor = (score: number): string => {
  if (score > 0.5) return "text-red-600 dark:text-red-400";
  if (score > 0.35) return "text-orange-600 dark:text-orange-400";
  if (score >= 0.2) return "";
  return "text-green-700 dark:text-green-400";
};

const getOqrColor = (score: number): string => {
  if (score > 1.0) return "text-red-600 dark:text-red-400";
  if (score > 0.75) return "text-orange-600 dark:text-orange-400";
  if (score >= 0.5) return "";
  return "text-green-700 dark:text-green-400";
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

  // Scroll refs
  const sectionTableRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  // Overview state
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("maxSimilarity");
  const [sortAsc, setSortAsc] = useState(false);
  // Per-section run overrides (when user picks a non-default run)
  const [sectionRunOverrides, setSectionRunOverrides] = useState<Record<string, string>>({});

  // Heatmap state
  const [selectedSection, setSelectedSection] = useState<SectionSummary | null>(null);
  const [pairs, setPairs] = useState<PairData[]>([]);
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // Clustering state
  const [clusteringData, setClusteringData] = useState<{
    linkageMatrix: [number, number, number, number][];
    exerciseIds: string[];
    exerciseLabels: Record<string, { orderNumber: number | null; textPreview: string | null; createdAt?: string | null }>;
  } | null>(null);

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

  // Fetch overview on mount
  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${apiBase}/admin-similarity-overview`);
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      console.error("Failed to fetch similarity overview:", err);
    } finally {
      setLoadingOverview(false);
    }
  };

  /** Get the active run_id for a section (override or latest) */
  const getActiveRunId = (section: SectionSummary): string | null => {
    return sectionRunOverrides[section.grammarSectionId] || section.latestRunId;
  };

  /** Handle per-section run change from the dropdown */
  const handleSectionRunChange = async (sectionId: string, runId: string) => {
    setSectionRunOverrides((prev) => ({ ...prev, [sectionId]: runId }));
    // Fetch updated stats for this section+run
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-section-stats?section_id=${encodeURIComponent(sectionId)}&run_id=${encodeURIComponent(runId)}`
      );
      const data = await res.json();
      if (data.data) {
        setSections((prev) =>
          prev.map((s) =>
            s.grammarSectionId === sectionId
              ? {
                  ...s,
                  hasRunData: true,
                  meanSimilarity: data.data.meanSimilarity,
                  maxSimilarity: data.data.maxSimilarity,
                  minSimilarity: data.data.minSimilarity,
                  medianAvgSim: data.data.medianAvgSim,
                  bucket0_10: data.data.bucket0_10,
                  bucket10_25: data.data.bucket10_25,
                  bucket25_50: data.data.bucket25_50,
                  bucket50_75: data.data.bucket50_75,
                  bucket75plus: data.data.bucket75plus,
                  weightedNeighborScore: data.data.weightedNeighborScore,
                  orderingQualityRatio: data.data.orderingQualityRatio,
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch section stats:", err);
    }
  };

  const fetchHeatmap = useCallback(async (section: SectionSummary, runIdOverride?: string) => {
    const runId = runIdOverride || getActiveRunId(section);
    if (!runId || !section.hasRunData) return;
    setLoadingHeatmap(true);
    setSelectedSection(section);
    setClusteringData(null);
    try {
      const [heatmapRes, clusteringRes] = await Promise.all([
        fetch(
          `${apiBase}/admin-similarity-heatmap?section_id=${encodeURIComponent(section.grammarSectionId)}&run_id=${runId}`
        ),
        fetch(
          `${apiBase}/admin-section-clustering?section_id=${encodeURIComponent(section.grammarSectionId)}&run_id=${runId}`
        ).catch(() => null),
      ]);
      const heatmapData = await heatmapRes.json();
      setPairs(heatmapData.pairs || []);
      setFeatures(heatmapData.features || []);

      if (clusteringRes && clusteringRes.ok) {
        const cData = await clusteringRes.json();
        if (cData.linkageMatrix && cData.exerciseIds?.length >= 3) {
          setClusteringData(cData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch heatmap:", err);
    } finally {
      setLoadingHeatmap(false);
      setTimeout(() => heatmapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [apiBase, sectionRunOverrides]);

  // Stable ref to avoid stale closure in fetchPairDetail
  const activeRunIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeRunIdRef.current = selectedSection ? getActiveRunId(selectedSection) : null;
  }, [selectedSection, sectionRunOverrides]);

  const fetchPairDetail = useCallback(async (exerciseA: string, exerciseB: string) => {
    const runId = activeRunIdRef.current;
    if (!runId) return;
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-pair-detail?exercise_a=${encodeURIComponent(exerciseA)}&exercise_b=${encodeURIComponent(exerciseB)}&run_id=${runId}`
      );
      const data = await res.json();
      setPairDetail(data);
    } catch (err) {
      console.error("Failed to fetch pair detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, [apiBase]);

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

  // Feature lookup for labels
  const featureMap = useMemo(() => {
    const map: Record<string, FeatureData> = {};
    for (const f of features) map[f.exerciseId] = f;
    return map;
  }, [features]);

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

  // Neighbor proximity strip data: for each exercise, similarity to next 1-5 exercises
  const PROXIMITY_RANGE = 5;
  const proximityData = useMemo(() => {
    const { exerciseIds, matrix } = heatmapMatrix;
    if (exerciseIds.length === 0) return [];

    return exerciseIds.map((id, idx) => {
      const neighbors: Array<{ distance: number; targetId: string; score: number | null }> = [];
      for (let d = 1; d <= PROXIMITY_RANGE; d++) {
        const targetIdx = idx + d;
        if (targetIdx < exerciseIds.length) {
          const targetId = exerciseIds[targetIdx];
          const score = matrix[id]?.[targetId] ?? null;
          neighbors.push({ distance: d, targetId, score });
        } else {
          neighbors.push({ distance: d, targetId: "", score: null });
        }
      }
      return { exerciseId: id, orderNumber: featureMap[id]?.orderNumber, neighbors };
    });
  }, [heatmapMatrix, featureMap]);

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

  const formatRunLabel = (r: SectionRunInfo) => {
    const date = new Date(r.completedAt).toLocaleString("de-DE");
    return `${date} — ${r.totalExercises} ex, ${r.totalPairs.toLocaleString()} pairs, ${r.durationSeconds.toFixed(1)}s`;
  };

  const formatRunDate = (r: SectionRunInfo) => {
    return new Date(r.completedAt).toLocaleDateString("de-DE");
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
      <Card className="p-6 animate-fade-in" ref={sectionTableRef}>
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Section Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">
            For each exercise, we compute its average cosine similarity to all other exercises in the same section.
            The distribution columns show how many exercises fall into each similarity range.
            Each section independently uses its latest analysis run. Click a row to explore the pairwise heatmap.
          </p>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {/* Column group headers */}
                <tr className="border-b bg-muted/30">
                  <th colSpan={4} className="text-left py-1.5 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Grammar Section
                  </th>
                  <th colSpan={5} className="text-center py-1.5 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-l">
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
                  <th className="text-left py-2 px-2">
                    <Tooltip>
                      <TooltipTrigger>Run</TooltipTrigger>
                      <TooltipContent>Analysis run used for this section's data. Switch to view different runs.</TooltipContent>
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
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("weightedNeighborScore")}>
                    <Tooltip>
                      <TooltipTrigger>WNS <SortIcon columnKey="weightedNeighborScore" /></TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>Weighted Neighborhood Score — average similarity to the next 1–5 exercises in sequence (weights: +1=50%, +2=25%, +3=12.5%, +4=7.5%, +5=5%). Lower = more varied sequence.</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("orderingQualityRatio")}>
                    <Tooltip>
                      <TooltipTrigger>OQR <SortIcon columnKey="orderingQualityRatio" /></TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>Ordering Quality Ratio — where adjacent exercise pairs rank among all pairs by similarity. Below 1.0 means reordering is working (adjacent pairs are less similar than the average pair). Scale-invariant: comparable across runs.</p>
                      </TooltipContent>
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
                      <td className="py-1 px-2" onClick={(e) => e.stopPropagation()}>
                        {s.availableRuns.length > 0 ? (
                          <Select
                            value={sectionRunOverrides[s.grammarSectionId] || s.latestRunId || undefined}
                            onValueChange={(runId) => handleSectionRunChange(s.grammarSectionId, runId)}
                          >
                            <SelectTrigger className="h-7 w-auto min-w-[90px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {s.availableRuns.map((r) => (
                                <SelectItem key={r.id} value={r.id} className="text-xs">
                                  {formatRunLabel(r)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">—</span>
                        )}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums border-l">
                        {hasData && s.meanSimilarity != null ? s.meanSimilarity.toFixed(3) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">
                        {hasData && s.medianAvgSim != null ? s.medianAvgSim.toFixed(3) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">
                        {hasData && s.maxSimilarity != null ? s.maxSimilarity.toFixed(3) : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">
                        {hasData && s.weightedNeighborScore != null
                          ? <span className={getWnsColor(s.weightedNeighborScore)}>{s.weightedNeighborScore.toFixed(2)}</span>
                          : <span className="text-muted-foreground/50">—</span>}
                      </td>
                      <td className="text-right py-2.5 px-2 tabular-nums">
                        {hasData && s.orderingQualityRatio != null
                          ? <span className={getOqrColor(s.orderingQualityRatio)}>{s.orderingQualityRatio.toFixed(2)}</span>
                          : <span className="text-muted-foreground/50">—</span>}
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
        <div className="space-y-6 animate-fade-in" ref={heatmapRef}>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => {
              setSelectedSection(null);
              setTimeout(() => sectionTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
            }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h3 className="text-lg font-semibold">
              {selectedSection.sectionName} ({selectedSection.level})
            </h3>
            {selectedSection.availableRuns.length > 1 && (
              <Select
                value={getActiveRunId(selectedSection) || undefined}
                onValueChange={(runId) => {
                  handleSectionRunChange(selectedSection.grammarSectionId, runId);
                  fetchHeatmap(selectedSection, runId);
                }}
              >
                <SelectTrigger className="h-8 w-auto min-w-[300px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedSection.availableRuns.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {formatRunLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {loadingHeatmap ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading heatmap...</p>
            </Card>
          ) : (
            <>
              {/* Clustering Dendrogram */}
              {clusteringData && (
                <ClusteringDendrogram
                  linkageMatrix={clusteringData.linkageMatrix}
                  exerciseIds={clusteringData.exerciseIds}
                  exerciseLabels={clusteringData.exerciseLabels}
                  onCopyId={copyToClipboard}
                  copiedId={copiedId}
                />
              )}

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

              {/* Neighbor Proximity Strip */}
              {proximityData.length > 0 && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-1">Sequential Neighbor Similarity</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    For each exercise, shows similarity to the next 1–5 exercises in sequence.
                    Orange/red in the +1 column means consecutive exercises feel repetitive.
                  </p>
                  <div className="overflow-x-auto">
                    <TooltipProvider>
                      <table className="border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="py-1.5 px-2 text-left font-medium text-muted-foreground">Exercise</th>
                            {Array.from({ length: PROXIMITY_RANGE }, (_, i) => (
                              <th key={i} className="py-1.5 px-3 text-center font-medium text-muted-foreground">
                                +{i + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {proximityData.map((row) => (
                            <tr key={row.exerciseId} className="border-t border-muted/30">
                              <td className="py-1 px-2 font-medium whitespace-nowrap">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className="cursor-pointer hover:text-primary transition-colors"
                                      onClick={() => copyToClipboard(row.exerciseId)}
                                    >
                                      {copiedId === row.exerciseId
                                        ? <Check className="h-3 w-3 inline text-green-500" />
                                        : heatmapLabel(row.exerciseId)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="left">
                                    <p className="font-mono">{row.exerciseId}<br/>Click to copy</p>
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              {row.neighbors.map((n) => (
                                <td key={n.distance} className="p-0">
                                  {n.score != null ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className="w-full h-7 flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-primary transition-all"
                                          style={{ backgroundColor: getHeatmapBg(n.score) }}
                                          onClick={() => n.targetId && fetchPairDetail(row.exerciseId, n.targetId)}
                                        >
                                          <span className="tabular-nums" style={{ color: n.score >= 0.5 ? "white" : undefined }}>
                                            {n.score.toFixed(2)}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {heatmapLabel(row.exerciseId)} → {heatmapLabel(n.targetId)}<br/>
                                          Similarity: {(n.score * 100).toFixed(1)}%
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <div className="w-full h-7 bg-muted/20" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TooltipProvider>
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
                          tick={{ fontSize: 10, cursor: "pointer" }}
                          tickFormatter={(v) => {
                            const order = featureMap[v]?.orderNumber;
                            const idPart = v.length > 10 ? `...${v.slice(-6)}` : v;
                            return order != null ? `#${order} ${idPart}` : idPart;
                          }}
                          onClick={(_e: any, payload: any) => {
                            if (payload?.value) copyToClipboard(payload.value);
                          }}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Max Similarity"]}
                          labelFormatter={(label) => `Exercise: ${label} — click label to copy ID`}
                        />
                        <Bar
                          dataKey="maxSimilarity"
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
                          shape={(props: any) => {
                            const { x, y, width, height, payload } = props;
                            return (
                              <rect
                                x={x} y={y} width={width} height={height}
                                fill={getHeatmapBg(payload.maxSimilarity)}
                                stroke={getHeatmapBg(payload.maxSimilarity)}
                                rx={2}
                              />
                            );
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
                          <span
                            className="font-mono text-xs cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(p.exerciseAId); }}
                            title="Click to copy ID"
                          >
                            {copiedId === p.exerciseAId ? <Check className="h-3 w-3 text-green-500" /> : shortId(p.exerciseAId)}
                          </span>
                          <span className="text-muted-foreground">↔</span>
                          <span
                            className="font-mono text-xs cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(p.exerciseBId); }}
                            title="Click to copy ID"
                          >
                            {copiedId === p.exerciseBId ? <Check className="h-3 w-3 text-green-500" /> : shortId(p.exerciseBId)}
                          </span>
                          {featureMap[p.exerciseAId]?.textPreview && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {featureMap[p.exerciseAId].textPreview}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: getHeatmapBg(p.similarityScore), color: p.similarityScore >= 0.5 ? "white" : undefined }}
                        >
                          {(p.similarityScore * 100).toFixed(1)}%
                        </span>
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
                          <span
                            className="font-mono text-xs cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(p.exerciseAId); }}
                            title="Click to copy ID"
                          >
                            {copiedId === p.exerciseAId ? <Check className="h-3 w-3 text-green-500" /> : shortId(p.exerciseAId)}
                          </span>
                          <span className="text-muted-foreground">↔</span>
                          <span
                            className="font-mono text-xs cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(p.exerciseBId); }}
                            title="Click to copy ID"
                          >
                            {copiedId === p.exerciseBId ? <Check className="h-3 w-3 text-green-500" /> : shortId(p.exerciseBId)}
                          </span>
                          {featureMap[p.exerciseAId]?.textPreview && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {featureMap[p.exerciseAId].textPreview}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: getHeatmapBg(p.similarityScore) }}
                        >
                          {(p.similarityScore * 100).toFixed(1)}%
                        </span>
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
                      {ex?.orderNumber != null && (
                        <span className="text-xs font-mono text-muted-foreground">#{ex.orderNumber}</span>
                      )}
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
