import { useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart3, User } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import { getAllGrammarUiTopics } from "@/data/grammarSections";
import { grammarCategories } from "@/data/grammarTopics";
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
const categoryLinks = Object.entries(grammarCategories);

const GRAMMAR_OVERVIEW_PATH = "/deutsche-grammatik/";
const levelPath = (level: string) => `/deutsche-grammatik/${level.toLowerCase()}-niveau-lernen/`;
const categoryPath = (category: string) => `/deutsche-grammatik/thema/${category}/`;

// grammar: "section" = the exam has its own grammar part (e.g. telc Sprachbausteine), "writing" = grammar only counts in writing
type ExamGrammar = "section" | "writing";

// Exams shown on the level cards: only exams the page itself names (exam section and its legend)
const LEVEL_EXAMS: Record<string, string> = {
  b1: "DTZ, telc, Goethe",
  b2: "telc",
  c1: "telc, TestDaF, DSH",
};
type ExamRow = { goal: string; short: string; level: string; exams: { name: string; grammar?: ExamGrammar }[] };
type FaqItem = { q: string; a: string };

const LevelSelection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const topicsRef = useRef<HTMLDivElement>(null);

  const scrollToTopics = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() =>
      topicsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }),
    );
  };

  // Clicking the chosen level again clears it. A level alone starts nothing: on phones the topics
  // are below the fold, so take the learner there
  const handleLevelClick = (levelId: string) => {
    if (selectedLevel === levelId) {
      setSelectedLevel(null);
      return;
    }
    setSelectedLevel(levelId);
    if (window.matchMedia("(max-width: 767px)").matches) scrollToTopics();
  };

  // "B2 üben" in the exam section: choose the goal's level and go up to the topics
  const handlePracticeLevel = (levelId: string) => {
    setSelectedLevel(levelId);
    scrollToTopics();
  };
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

  const selectedLevelName = levels.find((level) => level.id === selectedLevel)?.name;

  const examRowsValue = t('levelSelection.examRows', { returnObjects: true });
  const examRows: ExamRow[] = Array.isArray(examRowsValue) ? examRowsValue : [];
  const faqValue = t('levelSelection.faq', { returnObjects: true });
  const faqItems: FaqItem[] = Array.isArray(faqValue) ? faqValue : [];

  // Real <a href> for crawlers; plain left-clicks stay in the SPA, modified clicks open normally
  const handleInternalLink = (path: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path);
  };

  const handleSignInClick = () => {
    if (SIGN_IN_SHOWS_WAITLIST === 1) {
      // Show waitlist modal instead of navigating to auth
      setShowWaitlistModal(true);
    } else {
      // Normal behavior: navigate to auth page
      navigate("/auth/");
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

    // A chosen level is respected; only the topic (and, without a choice, the level) is random
    const level = selectedLevel ?? levels[Math.floor(Math.random() * levels.length)].id;
    const randomSection = sections[Math.floor(Math.random() * sections.length)].id;

    navigate(`/exercise?level=${level}&section=${randomSection}`);
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
        <meta property="og:image" content="https://www.infinitegrammar.de/images/og-default.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pageTitle} />
        <meta property="og:site_name" content="InfiniteGrammar" />
        <meta property="og:locale" content={currentLanguage.startsWith('en') ? 'en_US' : 'de_DE'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.infinitegrammar.de/images/og-default.jpg" />
        <meta name="twitter:image:alt" content={pageTitle} />
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
          keywords: ['Deutsche Grammatik', 'Sprachbausteine', 'telc', 'DTZ', 'Goethe-Zertifikat', 'TestDaF', 'DSH', 'Lückentext']
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
          {/* On phones the name wraps onto two lines; tight line spacing keeps "Infinite" and "Grammar"
              together as one stacked wordmark instead of two loose lines */}
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <LogoIcon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
            <div className="pb-0.5 text-2xl font-bold leading-none bg-gradient-primary bg-clip-text text-transparent sm:pb-0 sm:leading-8">
              {t('common.appName')}
            </div>
          </div>
          {/* On phones the buttons show only their icons; the labels stay for screen readers */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/statistics/")}
              className="gap-2 px-2 min-[360px]:px-2.5 sm:px-3"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{t('nav.statistics')}</span>
            </Button>
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile/")}
                className="gap-2 px-2 min-[360px]:px-2.5 sm:px-3"
              >
                <User className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('nav.profile')}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignInClick}
                className="gap-2 px-2 min-[360px]:px-2.5 sm:px-3"
              >
                <User className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('nav.account')}</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content: an app band (hero + chooser) followed by guide bands for the exam info, links and FAQ */}
      <main className="flex-1">
        {/* App band: the exercise chooser leads the page */}
        <section
          id="uebung"
          aria-labelledby="home-title"
          className="scroll-mt-20 border-b border-primary/10 bg-[hsl(var(--surface-app))]"
        >
          <div className="container mx-auto px-4 pt-10 pb-12 md:pt-16 md:pb-16">
            <div className="max-w-4xl mx-auto">
              {/* SEO Hero Section */}
              <div className="text-left sm:text-center mb-10 md:mb-14 animate-fade-in">
                <h1
                  id="home-title"
                  className="text-3xl md:text-5xl font-bold tracking-tight text-balance mb-4 md:mb-5"
                >
                  {t('levelSelection.h1')}
                </h1>
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-pretty max-w-[62ch] sm:mx-auto">
                  {t('levelSelection.introText')}
                </p>
              </div>

              {/* Level Selection */}
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h2 id="level-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-5">
                  {t('levelSelection.selectLevel')}
                </h2>
                {/* Toggle buttons: reachable with Tab, announced as pressed; clicking the chosen level again clears it */}
                <div role="group" aria-labelledby="level-heading" className="grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-5">
                  {levels.map((level, index) => {
                    const selected = selectedLevel === level.id;
                    const exams = LEVEL_EXAMS[level.id];
                    return (
                      <button
                        key={level.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleLevelClick(level.id)}
                        className={`flex flex-col items-center rounded-lg border-2 px-2 py-4 text-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3 sm:py-5 ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : "border-border bg-gradient-card hover:border-primary/60 hover:shadow-md"
                        }`}
                      >
                        <span className={`text-2xl font-bold leading-none tracking-tight sm:text-3xl ${selected ? "" : "text-primary"}`}>
                          {level.name}
                        </span>
                        {/* Position on the A1–C1 scale, as in the exam section */}
                        <span aria-hidden="true" className="mt-2.5 flex gap-0.5">
                          {levels.map((step, stepIndex) => (
                            <span
                              key={step.id}
                              className={`h-1 w-2.5 rounded-full sm:w-3 ${
                                stepIndex <= index
                                  ? selected ? "bg-primary-foreground" : "bg-primary"
                                  : selected ? "bg-primary-foreground/30" : "bg-primary/15"
                              }`}
                            />
                          ))}
                        </span>
                        <span className={`mt-2 text-xs leading-tight sm:text-sm ${selected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                          {level.description}
                        </span>
                        {exams && (
                          <span className={`mt-1 text-[11px] font-semibold leading-tight sm:text-xs ${selected ? "text-primary-foreground" : "text-primary"}`}>
                            {exams}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Goal shortcuts: the goal already decides the level */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="w-full text-sm text-foreground/70 sm:mr-1 sm:w-auto">{t('levelSelection.goalLabel')}</span>
                  {examRows.map((row) => {
                    const levelId = row.level.toLowerCase();
                    const selected = selectedLevel === levelId;
                    return (
                      <button
                        key={row.level}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleLevelClick(levelId)}
                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-2.5 text-[13px] min-[390px]:gap-2 min-[390px]:px-3 min-[390px]:text-sm sm:px-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/20 bg-card text-foreground hover:border-primary/60"
                        }`}
                      >
                        <span>{row.short}</span>
                        <span className={`font-bold ${selected ? "" : "text-primary"}`}>{row.level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section Selection (scroll-mt keeps its heading below the sticky header) */}
              <div
                ref={topicsRef}
                className="mt-10 md:mt-14 animate-fade-in scroll-mt-24"
                style={{ animationDelay: "0.2s" }}
              >
                {/* Names the level the topic will use, so a topic without a level is never a surprise */}
                <div aria-live="polite" className="mb-4 md:mb-5">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {selectedLevelName
                      ? t('levelSelection.selectTopicFor', { level: selectedLevelName })
                      : t('levelSelection.selectTopic')}
                  </h2>
                  {!selectedLevelName && (
                    <p className="mt-1 text-sm text-foreground/70 text-pretty">{t('levelSelection.anyLevelHint')}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant="outline"
                      size="lg"
                      onClick={() => handleTopicClick(section.id)}
                      className="h-auto py-5 text-lg font-semibold border border-primary/20 bg-card text-foreground shadow-sm hover:border-primary/60 hover:bg-card hover:text-primary hover:shadow-md"
                    >
                      {section.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Start */}
              <div className="mt-10 md:mt-12 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <p className="text-foreground/70 mb-4">{t('levelSelection.quickStart')}</p>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleStartRandomExercise}
                  className="border border-primary/30 bg-card text-base font-semibold text-primary hover:border-primary hover:bg-card hover:text-primary"
                >
                  {selectedLevelName
                    ? t('levelSelection.startRandomAtLevel', { level: selectedLevelName })
                    : t('levelSelection.startRandom')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Exam guide: which exam for which goal, and where grammar counts */}
        <section aria-labelledby="exam-guide-title" className="bg-card border-b">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 id="exam-guide-title" className="text-xl md:text-2xl font-semibold tracking-tight text-balance mb-2">
                {t('levelSelection.examTitle')}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-pretty max-w-[65ch] mb-4">
                {t('levelSelection.examLead')}
              </p>
              {/* Key for the dots, before the lists that use them (each exam also carries the text for screen readers) */}
              <p aria-hidden="true" className="mb-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground/80 md:mb-10">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {t('levelSelection.examWithGrammar')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
                  {t('levelSelection.examWithoutGrammar')}
                </span>
              </p>

              {/* One column per goal, led by the level it needs and that level's place on the A1–C1 scale */}
              <ul className="grid md:grid-cols-3 md:gap-10">
                {examRows.map((row) => {
                  const position = levels.findIndex((level) => level.name === row.level);
                  return (
                    <li
                      key={row.level}
                      className="grid grid-cols-[4.75rem_1fr] gap-x-4 border-t py-7 first:border-t-0 first:pt-0 md:block md:border-t-0 md:py-0"
                    >
                      <div aria-hidden="true">
                        <div className="text-5xl font-bold leading-none tracking-tight text-primary md:text-7xl">
                          {row.level}
                        </div>
                        <div className="mt-3 flex gap-1">
                          {levels.map((level, index) => (
                            <span
                              key={level.id}
                              className={`h-1.5 w-3 rounded-full md:w-6 ${index <= position ? "bg-primary" : "bg-primary/15"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="md:mt-6">
                        {/* Two lines reserved on desktop so the exam lists start at the same height */}
                        <h3 className="text-lg font-semibold leading-snug md:min-h-[3.5rem]">
                          <span className="sr-only">{row.level}: </span>
                          {row.goal}
                        </h3>
                        <ul className="mt-3 space-y-2 text-[15px] text-foreground/80">
                          {(Array.isArray(row.exams) ? row.exams : []).map((exam) => (
                            <li key={exam.name} className="flex items-center gap-2.5">
                              {exam.grammar && (
                                <>
                                  <span
                                    aria-hidden="true"
                                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                      exam.grammar === "section" ? "bg-primary" : "border-2 border-primary"
                                    }`}
                                  />
                                  <span className="sr-only">
                                    (
                                    {t(
                                      exam.grammar === "section"
                                        ? "levelSelection.examWithGrammar"
                                        : "levelSelection.examWithoutGrammar",
                                    )}
                                    )
                                  </span>
                                </>
                              )}
                              <span>{exam.name}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePracticeLevel(row.level.toLowerCase())}
                            className="font-semibold"
                          >
                            {t('levelSelection.practiceLevel', { level: row.level })}
                          </Button>
                          <a
                            href={levelPath(row.level)}
                            onClick={handleInternalLink(levelPath(row.level))}
                            className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                          >
                            {t('levelSelection.levelLink', { level: row.level })}
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Legend for the dots: exams with their own grammar section vs. grammar only in writing */}
              <div className="mt-10 grid rounded-2xl bg-[hsl(var(--surface-app))] md:mt-12 md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <h3 className="flex items-center gap-2.5 text-lg font-semibold">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    {t('levelSelection.withGrammarTitle')}
                  </h3>
                  <p className="mt-3 text-foreground/80 leading-relaxed text-pretty">{t('levelSelection.withGrammarText')}</p>
                </div>
                <div className="border-t border-primary/10 p-6 md:border-l md:border-t-0 md:p-8">
                  <h3 className="flex items-center gap-2.5 text-lg font-semibold">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-primary" />
                    {t('levelSelection.withoutGrammarTitle')}
                  </h3>
                  <p className="mt-3 text-foreground/80 leading-relaxed text-pretty">{t('levelSelection.withoutGrammarText')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grammar reference: every level page and every topic page */}
        <section aria-labelledby="grammar-browse-title" className="border-b">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 id="grammar-browse-title" className="text-xl md:text-2xl font-semibold tracking-tight text-balance mb-2">
                {t('levelSelection.browseTitle')}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-pretty max-w-[65ch] mb-8">
                <Trans
                  i18nKey="levelSelection.browseLead"
                  components={{
                    overview: (
                      <a
                        href={GRAMMAR_OVERVIEW_PATH}
                        onClick={handleInternalLink(GRAMMAR_OVERVIEW_PATH)}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      />
                    ),
                  }}
                />
              </p>

              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('levelSelection.browseByLevel')}</h3>
                  <ul className="space-y-3">
                    {levels.map((level) => (
                      <li key={level.id} className="text-pretty">
                        <a
                          href={levelPath(level.id)}
                          onClick={handleInternalLink(levelPath(level.id))}
                          className="font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {t('levelSelection.levelLink', { level: level.name })}
                        </a>
                        <span className="text-foreground/80">: {t(`levelSelection.levelTopics.${level.id}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('levelSelection.browseByTopic')}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {categoryLinks.map(([id, category]) => (
                      <li key={id}>
                        <a
                          href={categoryPath(id)}
                          onClick={handleInternalLink(categoryPath(id))}
                          className="inline-flex min-h-10 items-center rounded-full border bg-card px-4 text-sm transition-colors hover:border-primary hover:text-primary"
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ: visible answers and FAQPage schema come from the same list */}
        <section aria-labelledby="faq-title" className="bg-card">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl mx-auto">
              <h2 id="faq-title" className="text-xl md:text-2xl font-semibold tracking-tight text-balance mb-4">
                {t('levelSelection.faqTitle')}
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.q} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-foreground/80 text-pretty">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": faqItems.map((item) => ({
                    "@type": "Question",
                    "name": item.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.a
                    }
                  }))
                })}
              </script>
            </div>
          </div>
        </section>

        {/* Closing band: the page ends on the action, not on the last FAQ answer */}
        <section aria-labelledby="closing-title" className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
              <div>
                <h2 id="closing-title" className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
                  {t('levelSelection.closingTitle')}
                </h2>
                <p className="mt-2 text-primary-foreground/90 text-pretty max-w-[48ch]">
                  {t('levelSelection.closingText')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:shrink-0">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleStartRandomExercise}
                  className="bg-card text-primary shadow-md hover:bg-card/90"
                >
                  {selectedLevelName
                    ? t('levelSelection.startRandomAtLevel', { level: selectedLevelName })
                    : t('levelSelection.startRandom')}
                </Button>
                <a
                  href="#uebung"
                  className="font-medium underline underline-offset-4 decoration-primary-foreground/50 hover:decoration-primary-foreground"
                >
                  {t('levelSelection.closingChoose')}
                </a>
              </div>
            </div>
          </div>
        </section>
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
