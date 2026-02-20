import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, BarChart3, Grid3x3, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define color palette for charts
const COLORS = {
  A1: "hsl(220, 70%, 50%)",
  A2: "hsl(200, 70%, 50%)",
  B1: "hsl(180, 70%, 50%)",
  B2: "hsl(160, 70%, 50%)",
  C1: "hsl(140, 70%, 50%)",
};

type PeriodType = 'daily' | 'weekly' | 'monthly';
type DemandSort = 'popularity' | 'remaining';

const ADMIN_EMAIL = 'aleksandr.zuravliov1@gmail.com';

const ExerciseStats = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [loading, setLoading] = useState(true);

  // State for growth data
  const [overallGrowth, setOverallGrowth] = useState<any[]>([]);
  const [growthByLevel, setGrowthByLevel] = useState<any[]>([]);
  const [growthBySection, setGrowthBySection] = useState<any[]>([]);
  const [growthByTopic, setGrowthByTopic] = useState<any[]>([]);

  // State for snapshot data
  const [countsByLevel, setCountsByLevel] = useState<any[]>([]);
  const [countsBySection, setCountsBySection] = useState<any[]>([]);
  const [countsByTopic, setCountsByTopic] = useState<any[]>([]);

  // State for coverage data
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  // State for admin demand data
  const [demandData, setDemandData] = useState<any[]>([]);
  const [demandSort, setDemandSort] = useState<DemandSort>('popularity');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.DEV
          ? 'http://localhost:8888/api'
          : '/api';

        // Fetch growth statistics
        const growthResponse = await fetch(
          `${API_BASE}/exercise-growth-stats?period=${period}`
        );
        if (growthResponse.ok) {
          const growthData = await growthResponse.json();
          setOverallGrowth(growthData.overall || []);

          // Transform growth by level into chart format
          const levelMap = new Map<string, any>();
          growthData.byLevel?.forEach((item: any) => {
            if (!levelMap.has(item.period)) {
              levelMap.set(item.period, { period: item.period });
            }
            levelMap.get(item.period)[item.level] = item.count;
          });
          setGrowthByLevel(Array.from(levelMap.values()));

          // Transform growth by section
          const sectionMap = new Map<string, any>();
          growthData.bySection?.forEach((item: any) => {
            if (!sectionMap.has(item.period)) {
              sectionMap.set(item.period, { period: item.period });
            }
            sectionMap.get(item.period)[item.section] = item.count;
          });
          setGrowthBySection(Array.from(sectionMap.values()));

          // Transform growth by topic
          const topicMap = new Map<string, any>();
          growthData.byTopic?.forEach((item: any) => {
            if (!topicMap.has(item.period)) {
              topicMap.set(item.period, { period: item.period });
            }
            topicMap.get(item.period)[item.topic] = item.count;
          });
          setGrowthByTopic(Array.from(topicMap.values()));
        }

        // Fetch snapshot counts
        const snapshotResponse = await fetch(
          `${API_BASE}/exercise-count-snapshots`
        );
        if (snapshotResponse.ok) {
          const snapshotData = await snapshotResponse.json();
          setCountsByLevel(snapshotData.byLevel || []);
          setCountsBySection(snapshotData.bySection || []);
          setCountsByTopic(snapshotData.byTopic || []);
        }

        // Fetch coverage stats
        const coverageResponse = await fetch(
          `${API_BASE}/exercise-coverage-stats`
        );
        if (coverageResponse.ok) {
          const coverageData = await coverageResponse.json();
          setHeatmapData(coverageData.heatmap || []);
        }

        // Fetch admin demand data (only for admin)
        if (isAdmin) {
          const demandResponse = await fetch(
            `${API_BASE}/admin-section-demand`
          );
          if (demandResponse.ok) {
            const demandResult = await demandResponse.json();
            setDemandData(demandResult.sections || []);
          }
        }

      } catch (error) {
        console.error('Error fetching exercise stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period, isAdmin]);

  // Get unique sections and their final counts
  const allSections = Array.from(
    new Set(
      growthBySection.flatMap((item) =>
        Object.keys(item).filter((key) => key !== 'period')
      )
    )
  );

  // Get final count for each section (last data point)
  const sectionFinalCounts = allSections.map((section) => {
    const lastEntry = growthBySection
      .slice()
      .reverse()
      .find((item) => item[section] !== undefined);
    return {
      section,
      count: lastEntry?.[section] || 0,
    };
  });

  // Sort by count and take top 10
  const topSections = sectionFinalCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => item.section);

  // Filter growth data to only include top sections
  const filteredGrowthBySection = growthBySection.map((item) => {
    const filtered: any = { period: item.period };
    topSections.forEach((section) => {
      if (item[section] !== undefined) {
        filtered[section] = item[section];
      }
    });
    return filtered;
  });

  // Get unique topics and their final counts
  const allTopics = Array.from(
    new Set(
      growthByTopic.flatMap((item) =>
        Object.keys(item).filter((key) => key !== 'period')
      )
    )
  );

  // Get final count for each topic
  const topicFinalCounts = allTopics.map((topic) => {
    const lastEntry = growthByTopic
      .slice()
      .reverse()
      .find((item) => item[topic] !== undefined);
    return {
      topic,
      count: lastEntry?.[topic] || 0,
    };
  });

  // Sort by count and take top 10
  const topTopics = topicFinalCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => item.topic);

  // Filter growth data to only include top topics
  const filteredGrowthByTopic = growthByTopic.map((item) => {
    const filtered: any = { period: item.period };
    topTopics.forEach((topic) => {
      if (item[topic] !== undefined) {
        filtered[topic] = item[topic];
      }
    });
    return filtered;
  });

  // Generate colors for top sections and topics
  const sectionColors = topSections.reduce((acc, section, idx) => {
    acc[section] = `hsl(${(idx * 360) / topSections.length}, 70%, 50%)`;
    return acc;
  }, {} as Record<string, string>);

  const topicColors = topTopics.reduce((acc, topic, idx) => {
    acc[topic] = `hsl(${(idx * 360) / topTopics.length}, 65%, 55%)`;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t('exerciseStats.title')}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">{t('exerciseStats.loading')}</div>
            </div>
          ) : (
            <>
              {/* Growth Over Time Section */}
              <div className="space-y-6 pb-12 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">{t('exerciseStats.growthOverTime')}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('exerciseStats.period')}:</span>
                    <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t('exerciseStats.daily')}</SelectItem>
                        <SelectItem value="weekly">{t('exerciseStats.weekly')}</SelectItem>
                        <SelectItem value="monthly">{t('exerciseStats.monthly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Overall Growth */}
                <Card className="p-6 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalExerciseCount')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={overallGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="period"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Growth by Level */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.cumulativeByLevel')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={growthByLevel}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="period"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      {['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => (
                        <Area
                          key={level}
                          type="monotone"
                          dataKey={level}
                          stackId="1"
                          stroke={COLORS[level as keyof typeof COLORS]}
                          fill={COLORS[level as keyof typeof COLORS]}
                          fillOpacity={0.6}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Snapshot Section */}
              <div className="space-y-6 pt-12 pb-12 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">{t('exerciseStats.currentSnapshot')}</h2>
                </div>

                {/* Snapshot by Level */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalByLevel')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countsByLevel}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="level"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Snapshot by Grammar Section */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalBySection')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countsBySection}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="section"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--success))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Snapshot by Content Topic */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalByTopic')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countsByTopic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="topic"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Coverage Analysis Section */}
              <div className="space-y-6 pt-12">
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">{t('exerciseStats.coverage')}</h2>
                </div>

                {/* Exercise Count Table */}
                <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                  <h3 className="text-base md:text-lg font-semibold mb-4">{t('exerciseStats.heatmap')}</h3>
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="px-4 md:px-0">
                      {(() => {
                        // Transform heatmap data into flat list
                        const tableData = heatmapData
                          .filter((item) => item.level !== 'NULL')
                          .sort((a, b) => {
                            // Sort by level first
                            const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                            const levelDiff = levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
                            if (levelDiff !== 0) return levelDiff;

                            // Then by order in level
                            if (a.orderInLevel !== null && b.orderInLevel !== null) {
                              return a.orderInLevel - b.orderInLevel;
                            }

                            // Finally by name
                            return a.sectionName.localeCompare(b.sectionName);
                          });

                        return (
                          <div className="min-w-max">
                            <table className="w-full border-collapse text-sm md:text-base">
                              <thead>
                                <tr>
                                  <th className="border border-border p-2 md:p-3 text-left bg-muted/50 text-xs md:text-sm">
                                    Level
                                  </th>
                                  <th className="border border-border p-2 md:p-3 text-left bg-muted/50 text-xs md:text-sm">
                                    Grammar Section
                                  </th>
                                  <th className="border border-border p-2 md:p-3 text-center bg-muted/50 text-xs md:text-sm">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-muted/30">
                                    <td className="border border-border p-2 md:p-3 font-medium text-xs md:text-sm">
                                      {item.level}
                                    </td>
                                    <td className="border border-border p-2 md:p-3 text-xs md:text-sm">
                                      {item.sectionName}
                                    </td>
                                    <td className="border border-border p-2 md:p-3 text-center font-semibold text-xs md:text-sm">
                                      {item.count}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Admin: Section Demand Chart */}
              {isAdmin && demandData.length > 0 && (() => {
                const sortedDemand = [...demandData].sort((a, b) => {
                  if (demandSort === 'remaining') {
                    return b.remaining - a.remaining;
                  }
                  return b.uniqueUsers - a.uniqueUsers;
                }).map((item) => ({
                  ...item,
                  label: `${item.sectionName} (${item.level})`,
                }));

                return (
                  <div className="space-y-6 pt-12 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">{t('exerciseStats.sectionDemand')}</h2>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={demandSort === 'popularity' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDemandSort('popularity')}
                        >
                          {t('exerciseStats.sortByPopularity')}
                        </Button>
                        <Button
                          variant={demandSort === 'remaining' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDemandSort('remaining')}
                        >
                          {t('exerciseStats.sortByRemaining')}
                        </Button>
                      </div>
                    </div>

                    <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                      <ResponsiveContainer width="100%" height={Math.max(400, sortedDemand.length * 36)}>
                        <BarChart data={sortedDemand} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            type="number"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "12px" }}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: "11px" }}
                            width={250}
                            tick={{ fill: "hsl(var(--foreground))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string) => {
                              const label = name === 'completed'
                                ? t('exerciseStats.completed')
                                : t('exerciseStats.remaining');
                              return [value, label];
                            }}
                            labelFormatter={(label) => label}
                          />
                          <Legend
                            formatter={(value) => {
                              if (value === 'completed') return t('exerciseStats.completed');
                              if (value === 'remaining') return t('exerciseStats.remaining');
                              return value;
                            }}
                          />
                          <Bar
                            dataKey="completed"
                            stackId="a"
                            fill="hsl(142, 70%, 45%)"
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar
                            dataKey="remaining"
                            stackId="a"
                            fill="hsl(38, 92%, 50%)"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                );
              })()}

              {/* Action Button */}
              <div className="flex justify-center animate-fade-in mt-12" style={{ animationDelay: "0.9s" }}>
                <Button size="lg" onClick={() => navigate("/exercise")}>
                  {t('exerciseStats.continueLearning')}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExerciseStats;
