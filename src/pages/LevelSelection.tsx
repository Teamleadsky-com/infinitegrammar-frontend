import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, BarChart3, User, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const levels = [
  { id: "a1", name: "A1", description: "Beginner" },
  { id: "a2", name: "A2", description: "Elementary" },
  { id: "b1", name: "B1", description: "Intermediate" },
  { id: "b2", name: "B2", description: "Upper Intermediate" },
  { id: "c1", name: "C1", description: "Advanced" },
];

const sections = [
  { id: "verben", name: "Verben" },
  { id: "adjektive", name: "Adjektive" },
  { id: "artikel", name: "Artikel" },
  { id: "praepositionen", name: "Präpositionen" },
];

const LevelSelection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Infinite Grammar
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/statistics")}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Statistics
            </Button>
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Level
            </h2>
            <p className="text-lg text-muted-foreground">
              Practice German grammar with interactive gap-fill exercises
            </p>
          </div>

          {/* Level Selection */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-semibold mb-4">Select Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {levels.map((level) => (
                <Card
                  key={level.id}
                  className="p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-card border-2 hover:border-primary group"
                  onClick={() => navigate(`/exercise?level=${level.id}`)}
                >
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {level.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{level.description}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-semibold mb-4">Select Topic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/exercise?section=${section.id}`)}
                  className="h-auto py-6 text-lg"
                >
                  {section.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Start */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-muted-foreground mb-4">Or jump right in</p>
            <Button
              size="lg"
              onClick={() => navigate("/exercise")}
              className="text-lg"
            >
              Start Random Exercise
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LevelSelection;
