import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, BarChart3, User } from "lucide-react";
import { getAllGrammarUiTopics } from "@/data/grammarSections";
import { WaitlistModal } from "@/components/WaitlistModal";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { Footer } from "@/components/Footer";
import { EXERCISES_MAINTENANCE_MODE } from "@/config/features";

// ⚙️ FEATURE SWITCH: Sign In button behavior
// 0 = Normal sign in (navigate to /auth page)
// 1 = Show waitlist popup instead of sign in
const SIGN_IN_SHOWS_WAITLIST = 0;

const sections = getAllGrammarUiTopics();

const LevelSelection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // SEO meta data
  const pageTitle = t('levelSelection.metaTitle');
  const pageDescription = t('levelSelection.metaDescription');
  const pageUrl = 'https://www.infinitegrammar.de/';
  const currentLanguage = i18n.language || 'de';

  const levels = [
    { id: "a1", name: "A1", description: t('levelSelection.beginner') },
    { id: "a2", name: "A2", description: t('levelSelection.elementary') },
    { id: "b1", name: "B1", description: t('levelSelection.intermediate') },
    { id: "b2", name: "B2", description: t('levelSelection.upperIntermediate') },
    { id: "c1", name: "C1", description: t('levelSelection.advanced') },
  ];

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
    // Show coming soon modal if maintenance mode is enabled
    if (EXERCISES_MAINTENANCE_MODE) {
      setShowComingSoonModal(true);
      return;
    }

    if (selectedLevel) {
      // Navigate with selected level and topic
      navigate(`/exercise?level=${selectedLevel}&section=${sectionId}`);
    } else {
      // Navigate with just topic (random level)
      navigate(`/exercise?section=${sectionId}`);
    }
  };

  const handleStartRandomExercise = () => {
    // Show coming soon modal if maintenance mode is enabled
    if (EXERCISES_MAINTENANCE_MODE) {
      setShowComingSoonModal(true);
      return;
    }

    // Randomly select a level and section
    const randomLevel = levels[Math.floor(Math.random() * levels.length)].id;
    const randomSection = sections[Math.floor(Math.random() * sections.length)].id;

    // Navigate with the random level and section (same as clicking a specific topic)
    navigate(`/exercise?level=${randomLevel}&section=${randomSection}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <html lang={currentLanguage} />
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Schema Markup for SEO */}
      <SchemaMarkup
        type="educational"
        data={{
          headline: t('levelSelection.h1'),
          description: pageDescription,
          url: pageUrl,
          educationalLevel: 'A1-C1',
          learningResourceType: 'Interactive Exercise Platform',
          keywords: ['German Grammar', 'Gap-Fill Exercises', 'telc', 'TestDaF', 'German Learning']
        }}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "InfiniteGrammar",
          "description": pageDescription,
          "url": pageUrl,
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "inLanguage": currentLanguage
        })}
      </script>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('common.appName')}
            </div>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                {t('nav.profile')}
              </Button>
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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* SEO Hero Section */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
              {t('levelSelection.h1')}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-3xl mx-auto">
              {t('levelSelection.introText')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="text-primary">✓</span> {t('levelSelection.benefit1')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-primary">✓</span> {t('levelSelection.benefit2')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-primary">✓</span> {t('levelSelection.benefit3')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-primary">✓</span> {t('levelSelection.benefit4')}
              </span>
            </div>
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
              onClick={handleStartRandomExercise}
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
              <a
                href="/pruefungszentren/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/pruefungszentren/");
                }}
              >
                {t('levelSelection.examCenters')}
              </a>
              <a
                href="/deutsche-grammatik/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/deutsche-grammatik/");
                }}
              >
                {t('levelSelection.grammarReference')}
              </a>
            </div>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{t('levelSelection.faqTitle')}</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  {t('levelSelection.faqQ1')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('levelSelection.faqA1')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  {t('levelSelection.faqQ2')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('levelSelection.faqA2')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  {t('levelSelection.faqQ3')}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('levelSelection.faqA3')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* FAQ Schema */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": t('levelSelection.faqQ1'),
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": t('levelSelection.faqA1')
                    }
                  },
                  {
                    "@type": "Question",
                    "name": t('levelSelection.faqQ2'),
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": t('levelSelection.faqA2')
                    }
                  },
                  {
                    "@type": "Question",
                    "name": t('levelSelection.faqQ3'),
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": t('levelSelection.faqA3')
                    }
                  }
                ]
              })}
            </script>
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

      {/* Coming Soon Modal (Maintenance Mode) */}
      <ComingSoonModal
        open={showComingSoonModal}
        onOpenChange={setShowComingSoonModal}
      />

      <Footer />
    </div>
  );
};

export default LevelSelection;
