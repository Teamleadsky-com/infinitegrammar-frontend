import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, BarChart3, User, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAllGrammarUiTopics } from "@/data/grammarSections";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// ⚙️ FEATURE SWITCH: Sign In button behavior
// 0 = Normal sign in (navigate to /auth page)
// 1 = Show waitlist popup instead of sign in
const SIGN_IN_SHOWS_WAITLIST = 0;

const sections = getAllGrammarUiTopics();

const LevelSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const levels = [
    { id: "a1", name: "A1", description: t('levelSelection.beginner') },
    { id: "a2", name: "A2", description: t('levelSelection.elementary') },
    { id: "b1", name: "B1", description: t('levelSelection.intermediate') },
    { id: "b2", name: "B2", description: t('levelSelection.upperIntermediate') },
    { id: "c1", name: "C1", description: t('levelSelection.advanced') },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleSignInClick = () => {
    if (SIGN_IN_SHOWS_WAITLIST === 1) {
      // Show waitlist modal instead of navigating to auth
      setShowWaitlistModal(true);
    } else {
      // Normal behavior: navigate to auth page
      navigate("/auth");
    }
  };

  const handleTopicClick = (sectionId: string) => {
    if (selectedLevel) {
      // Navigate with selected level and topic
      navigate(`/exercise?level=${selectedLevel}&section=${sectionId}`);
    } else {
      // Navigate with just topic (random level)
      navigate(`/exercise?section=${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('common.appName')}
            </h1>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/statistics")}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {t('nav.statistics')}
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleSignInClick}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                {t('nav.account')}
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
              {t('levelSelection.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('levelSelection.subtitle')}
            </p>
          </div>

          {/* Level Selection */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-semibold mb-4">{t('levelSelection.selectLevel')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {levels.map((level) => (
                <Card
                  key={level.id}
                  className={`p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 group ${
                    selectedLevel === level.id
                      ? "bg-primary border-primary shadow-lg scale-105"
                      : "bg-gradient-card hover:border-primary"
                  }`}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  <div className={`text-3xl font-bold mb-2 group-hover:scale-110 transition-transform ${
                    selectedLevel === level.id ? "text-primary-foreground" : "text-primary"
                  }`}>
                    {level.name}
                  </div>
                  <div className={`text-sm ${
                    selectedLevel === level.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}>{level.description}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-semibold mb-4">{t('levelSelection.selectTopic')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  size="lg"
                  onClick={() => handleTopicClick(section.id)}
                  className="h-auto py-6 text-lg"
                >
                  {section.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Start */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-muted-foreground mb-4">{t('levelSelection.quickStart')}</p>
            <Button
              size="lg"
              onClick={() => navigate("/exercise")}
              className="text-lg"
            >
              {t('levelSelection.startRandom')}
            </Button>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/exercise-stats")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                {t('levelSelection.exerciseStats')}
              </button>
              <button
                onClick={() => navigate("/pruefungszentren")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                {t('levelSelection.examCenters')}
              </button>
              <button
                onClick={() => navigate("/grammatik")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                {t('levelSelection.grammarReference')}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Waitlist Modal */}
      <WaitlistModal
        open={showWaitlistModal}
        onOpenChange={setShowWaitlistModal}
        exercisesCompleted={0}
        openSource="sign-in-button"
      />
    </div>
  );
};

export default LevelSelection;
