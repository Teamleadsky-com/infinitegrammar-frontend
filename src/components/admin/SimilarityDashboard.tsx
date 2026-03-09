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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

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
  meanSimilarity: number;
  maxSimilarity: number;
  minSimilarity: number;
  p90Similarity: number;
  pairsAbove80: number;
  pairsAbove90: number;
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
  gaps: Array<{ gapNumber: number; correctAnswer: string }>;
  features: { grammarSectionId: string; level: string } | null;
}

interface PairDetail {
  exerciseA: ExerciseDetail | null;
  exerciseB: ExerciseDetail | null;
  similarityScore: number | null;
}

type SortKey = "sectionName" | "level" | "exerciseCount" | "meanSimilarity" | "maxSimilarity" | "pairsAbove80" | "pairsAbove90";

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

const getHeatmapBg = (score: number): string => {
  if (score >= 0.9) return "rgba(239, 68, 68, 0.8)";
  if (score >= 0.85) return "rgba(239, 68, 68, 0.5)";
  if (score >= 0.8) return "rgba(251, 146, 60, 0.5)";
  if (score >= 0.7) return "rgba(250, 204, 21, 0.4)";
  if (score >= 0.5) return "rgba(134, 239, 172, 0.3)";
  return "rgba(187, 247, 208, 0.2)";
};

export const SimilarityDashboard = ({ apiBase }: SimilarityDashboardProps) => {
  const { t } = useTranslation();

  // Overview state
  const [run, setRun] = useState<RunInfo | null>(null);
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

  // Fetch overview on mount
  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${apiBase}/admin-similarity-overview`);
      const data = await res.json();
      setRun(data.run);
      setSections(data.sections || []);
    } catch (err) {
      console.error("Failed to fetch similarity overview:", err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchHeatmap = useCallback(async (section: SectionSummary) => {
    if (!run) return;
    setLoadingHeatmap(true);
    setSelectedSection(section);
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-heatmap?section_id=${encodeURIComponent(section.grammarSectionId)}&run_id=${run.id}`
      );
      const data = await res.json();
      setPairs(data.pairs || []);
      setFeatures(data.features || []);
    } catch (err) {
      console.error("Failed to fetch heatmap:", err);
    } finally {
      setLoadingHeatmap(false);
    }
  }, [apiBase, run]);

  const fetchPairDetail = useCallback(async (exerciseA: string, exerciseB: string) => {
    if (!run) return;
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const res = await fetch(
        `${apiBase}/admin-similarity-pair-detail?exercise_a=${encodeURIComponent(exerciseA)}&exercise_b=${encodeURIComponent(exerciseB)}&run_id=${run.id}`
      );
      const data = await res.json();
      setPairDetail(data);
    } catch (err) {
      console.error("Failed to fetch pair detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, [apiBase, run]);

  // Sorted sections
  const sortedSections = useMemo(() => {
    const sorted = [...sections].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
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

    const exerciseIds = Array.from(ids).sort();
    return { exerciseIds, matrix };
  }, [pairs]);

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

  if (loadingOverview) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading similarity data...</p>
      </div>
    );
  }

  if (!run) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">{t("admin.similarity.noData", "No similarity analysis runs found. Run the analysis script first.")}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Run Info Banner */}
      <Card className="p-4 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Badge variant="default">{run.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(run.completedAt).toLocaleString("de-DE")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{run.totalExercises} exercises</span>
            <span>{run.totalPairs.toLocaleString()} pairs</span>
            <span>{run.durationSeconds.toFixed(1)}s</span>
            <span>{sections.length} sections</span>
          </div>
        </div>
      </Card>

      {/* Section Overview Table */}
      <Card className="p-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{t("admin.similarity.sectionOverview", "Section Overview")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("sectionName")}>
                  Section <SortIcon columnKey="sectionName" />
                </th>
                <th className="text-left py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("level")}>
                  Level <SortIcon columnKey="level" />
                </th>
                <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("exerciseCount")}>
                  Exercises <SortIcon columnKey="exerciseCount" />
                </th>
                <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("meanSimilarity")}>
                  Avg Sim <SortIcon columnKey="meanSimilarity" />
                </th>
                <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("maxSimilarity")}>
                  Max Sim <SortIcon columnKey="maxSimilarity" />
                </th>
                <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("pairsAbove80")}>
                  &gt;80% <SortIcon columnKey="pairsAbove80" />
                </th>
                <th className="text-right py-2 px-2 cursor-pointer hover:text-primary" onClick={() => handleSort("pairsAbove90")}>
                  &gt;90% <SortIcon columnKey="pairsAbove90" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSections.map((s) => (
                <tr
                  key={s.grammarSectionId}
                  className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => fetchHeatmap(s)}
                >
                  <td className="py-2 px-2 font-medium">{s.sectionName}</td>
                  <td className="py-2 px-2">
                    <Badge variant="outline" className="text-xs">{s.level}</Badge>
                  </td>
                  <td className="text-right py-2 px-2">{s.exerciseCount}</td>
                  <td className="text-right py-2 px-2">{s.meanSimilarity.toFixed(3)}</td>
                  <td className="text-right py-2 px-2">
                    <Badge variant={getSimBadgeVariant(s.maxSimilarity)}>
                      {s.maxSimilarity.toFixed(3)}
                    </Badge>
                  </td>
                  <td className="text-right py-2 px-2">
                    {s.pairsAbove80 > 0 ? (
                      <span className="text-orange-600 font-medium">{s.pairsAbove80}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="text-right py-2 px-2">
                    {s.pairsAbove90 > 0 ? (
                      <span className="text-red-600 font-medium">{s.pairsAbove90}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                                {shortId(id)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {heatmapMatrix.exerciseIds.map((rowId) => (
                            <tr key={rowId}>
                              <td className="p-1 text-xs font-medium whitespace-nowrap">
                                {shortId(rowId)}
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
                      {[0.3, 0.5, 0.7, 0.8, 0.85, 0.9].map((s) => (
                        <div key={s} className="w-4 h-4" style={{ backgroundColor: getHeatmapBg(s) }} />
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
                      <span className="text-xs font-mono text-muted-foreground">{shortId(ex?.id || "")}</span>
                      {ex?.level && (
                        <Badge variant="outline" className="text-xs">{ex.level}</Badge>
                      )}
                    </div>
                    <Card className="p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {ex?.text ? renderTextWithGaps(ex.text, ex.gaps || []) : "N/A"}
                      </p>
                    </Card>
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
