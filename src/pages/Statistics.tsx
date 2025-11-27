import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Target, Award } from "lucide-react";
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
} from "recharts";

// Mock data
const overallStats = {
  totalExercises: 47,
  correctAnswers: 312,
  totalAnswers: 376,
  accuracy: 83,
  streak: 7,
};

const levelData = [
  { name: "A1", accuracy: 92 },
  { name: "A2", accuracy: 87 },
  { name: "B1", accuracy: 81 },
  { name: "B2", accuracy: 76 },
  { name: "C1", accuracy: 68 },
];

const sectionData = [
  { name: "Verben", accuracy: 85 },
  { name: "Adjektive", accuracy: 88 },
  { name: "Artikel", accuracy: 79 },
  { name: "Präpositionen", accuracy: 82 },
];

const progressData = [
  { week: "Week 1", accuracy: 72 },
  { week: "Week 2", accuracy: 76 },
  { week: "Week 3", accuracy: 79 },
  { week: "Week 4", accuracy: 83 },
];

const Statistics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Your Statistics</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Exercises</p>
                  <p className="text-3xl font-bold">{overallStats.totalExercises}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-3xl font-bold">{overallStats.accuracy}%</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold">
                    {overallStats.correctAnswers}/{overallStats.totalAnswers}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold">{overallStats.streak} days</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg text-2xl">🔥</div>
              </div>
            </Card>
          </div>

          {/* Progress Over Time */}
          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-bold mb-6">Progress Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="week"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
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
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance by Level */}
          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-bold mb-6">Accuracy by Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance by Section */}
          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl font-bold mb-6">Accuracy by Topic</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="accuracy" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" onClick={() => navigate("/exercise")}>
              Continue Learning
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
