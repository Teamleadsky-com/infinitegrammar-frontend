import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, BarChart3, Grid3x3 } from "lucide-react";
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

const ExerciseStats = () => {
  const navigate = useNavigate();
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
  const [underCoveredSections, setUnderCoveredSections] = useState<any[]>([]);

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
          setUnderCoveredSections(coverageData.underCovered || []);
        }

      } catch (error) {
        console.error('Error fetching exercise stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Exercise Statistics</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">Loading statistics...</div>
            </div>
          ) : (
            <>
              {/* Growth Over Time Section */}
              <div className="space-y-6 pb-12 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Growth Over Time</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Period:</span>
                    <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Overall Growth */}
                <Card className="p-6 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Total Exercise Count Over Time</h3>
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
                  <h3 className="text-lg font-semibold mb-4">Cumulative Exercise Count by Level</h3>
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

                {/* Growth by Grammar Section */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <h3 className="text-lg font-semibold mb-4">Cumulative Exercise Count by Grammar Section (Top 10)</h3>
                  <ResponsiveContainer width="100%" height={450}>
                    <AreaChart data={filteredGrowthBySection}>
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
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                      />
                      {topSections.map((section) => (
                        <Area
                          key={section}
                          type="monotone"
                          dataKey={section}
                          stackId="1"
                          stroke={sectionColors[section]}
                          fill={sectionColors[section]}
                          fillOpacity={0.6}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Growth by Content Topic */}
                {topTopics.length > 0 && (
                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <h3 className="text-lg font-semibold mb-4">Cumulative Exercise Count by Content Topic (Top 10)</h3>
                    <ResponsiveContainer width="100%" height={450}>
                      <AreaChart data={filteredGrowthByTopic}>
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
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                        />
                        {topTopics.map((topic) => (
                          <Area
                            key={topic}
                            type="monotone"
                            dataKey={topic}
                            stackId="1"
                            stroke={topicColors[topic]}
                            fill={topicColors[topic]}
                            fillOpacity={0.6}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>

              {/* Snapshot Section */}
              <div className="space-y-6 pt-12 pb-12 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Current Snapshot</h2>
                </div>

                {/* Snapshot by Level */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <h3 className="text-lg font-semibold mb-4">Total Exercises by Level</h3>
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
                  <h3 className="text-lg font-semibold mb-4">Total Exercises by Grammar Section</h3>
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
                {countsByTopic.length > 0 && (
                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                    <h3 className="text-lg font-semibold mb-4">Total Exercises by Content Topic</h3>
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
                          fill="hsl(var(--chart-3))"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>

              {/* Coverage Analysis Section */}
              <div className="space-y-6 pt-12">
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Coverage Analysis</h2>
                </div>

                {/* Heatmap */}
                <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                  <h3 className="text-lg font-semibold mb-4">Exercise Count Heatmap: Level × Grammar Section</h3>
                  <div className="overflow-x-auto">
                    {(() => {
                      // Transform heatmap data into a grid
                      const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
                      const sectionsMap = new Map<string, any>();

                      heatmapData.forEach((item) => {
                        if (!sectionsMap.has(item.sectionId)) {
                          sectionsMap.set(item.sectionId, {
                            id: item.sectionId,
                            name: item.sectionName,
                            orderInLevel: item.orderInLevel,
                            counts: {},
                          });
                        }
                        const section = sectionsMap.get(item.sectionId);
                        if (section && item.level !== 'NULL') {
                          section.counts[item.level] = item.count;
                        }
                      });

                      const sections = Array.from(sectionsMap.values())
                        .sort((a, b) => {
                          if (a.orderInLevel !== null && b.orderInLevel !== null) {
                            return a.orderInLevel - b.orderInLevel;
                          }
                          return a.name.localeCompare(b.name);
                        });

                      const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

                      const getColor = (count: number) => {
                        if (count === 0) return 'hsl(var(--muted))';
                        const intensity = Math.min(count / maxCount, 1);
                        return `hsl(var(--primary) / ${0.2 + intensity * 0.8})`;
                      };

                      return (
                        <div className="min-w-max">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="border border-border p-2 text-left bg-muted/50 sticky left-0 z-10">
                                  Grammar Section
                                </th>
                                {levels.map((level) => (
                                  <th key={level} className="border border-border p-2 text-center bg-muted/50 min-w-[80px]">
                                    {level}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sections.map((section) => (
                                <tr key={section.id}>
                                  <td className="border border-border p-2 bg-background sticky left-0 z-10 font-medium text-sm">
                                    {section.name}
                                  </td>
                                  {levels.map((level) => {
                                    const count = section.counts[level] || 0;
                                    return (
                                      <td
                                        key={level}
                                        className="border border-border p-2 text-center font-semibold"
                                        style={{ backgroundColor: getColor(count) }}
                                      >
                                        {count}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </Card>

                {/* Under-covered Sections */}
                {underCoveredSections.length > 0 && (
                  <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                    <h3 className="text-lg font-semibold mb-4">Under-Covered Sections ({"<"}5 exercises)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2 font-semibold">Section Name</th>
                            <th className="text-left p-2 font-semibold">Level</th>
                            <th className="text-left p-2 font-semibold">Category</th>
                            <th className="text-center p-2 font-semibold">Exercise Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {underCoveredSections.map((section, idx) => (
                            <tr key={idx} className="border-b border-border hover:bg-muted/50">
                              <td className="p-2">{section.sectionName}</td>
                              <td className="p-2">{section.level || 'N/A'}</td>
                              <td className="p-2">{section.category}</td>
                              <td className="p-2 text-center">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                                  section.count === 0
                                    ? 'bg-destructive/20 text-destructive'
                                    : 'bg-warning/20 text-warning'
                                }`}>
                                  {section.count}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-center animate-fade-in mt-12" style={{ animationDelay: "0.9s" }}>
                <Button size="lg" onClick={() => navigate("/exercise")}>
                  Continue Learning
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
