import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle, Settings, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExerciseStats } from "@/hooks/useExerciseStats";
import { useAuth } from "@/contexts/AuthContext";
import { WaitlistModal } from "@/components/WaitlistModal";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { ExerciseSettingsDialog } from "@/components/ExerciseSettingsDialog";
import { ReportExerciseModal } from "@/components/ReportExerciseModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getGrammarSectionById } from "@/data/grammarSections";
import { markExerciseCompleted, LEVEL_ORDER } from "@/utils/exerciseCompletion";
import { toast } from "@/hooks/use-toast";
import { EXERCISES_MAINTENANCE_MODE } from "@/config/features";

// ⚙️ FEATURE SWITCH: Enable/disable report exercise button
// Set to false to hide the report button, set to true to show it
const REPORT_EXERCISE_ENABLED = true;

// Backend response format (simplified structure)
import { GrammarUiTopicId } from "@/data/grammarSections";

interface BackendExercise {
  id: string;
  level: string;
  grammar_section_id: string;
  grammar_ui_topics: GrammarUiTopicId[];
  content_topic: string;
  model: string;
  order_number: number;
  text: string;
  gaps: Array<{
    no: number;
    correct: string;
    distractors: string[];
    explanation: string;
  }>;
}

// Internal format for rendering
interface ProcessedGap {
  id: string;
  position: number;
  gapNumber: number;
  options: string[];
  correct: number;
  explanation: string;
}

// Mock exercise data in backend format
const mockBackendExercise: BackendExercise = {
  id: "mock_exercise_1",
  level: "B2",
  grammar_section_id: "konditionalsaetze_konjunktiv2",
  grammar_ui_topics: ["verben"],
  content_topic: "Arbeit im Homeoffice",
  model: "llama3.1:8b",
  order_number: 0,
  text: "Wenn ich nicht von zu Hause aus arbeiten [1], [2] ich wahrscheinlich viel mehr Zeit im Verkehr verlieren. Viele meiner Kolleginnen sagen, sie [3] gern die gleiche Flexibilität. Wenn wir ein größeres Büro [4], könnten wir häufiger gemeinsam Workshops machen. Ich [1] dann aber wieder jeden Tag ins Zentrum fahren, und das [2] ich eigentlich vermeiden wollen.",
  gaps: [
    {
      no: 1,
      correct: "müsste",
      distractors: ["muss", "musste", "müssten"],
      explanation: `„müsste" steht hier im Konjunktiv II und drückt eine hypothetische Verpflichtung aus. Die Formen „muss", „musste" und „müssten" passen entweder zeitlich oder formal nicht genau zur Bedingungssituation.`
    },
    {
      no: 2,
      correct: "würde",
      distractors: ["werde", "wird", "würden"],
      explanation: `„würde" + Infinitiv ist hier eine typische Konjunktiv-II-Umschreibung für eine hypothetische Folge. „werde" und „wird" sind Indikativformen, „würden" wäre Plural und stimmt nicht mit dem Subjekt überein.`
    },
    {
      no: 3,
      correct: "hätten",
      distractors: ["haben", "hatten", "hätte"],
      explanation: `„hätten" ist Konjunktiv II und drückt einen nicht realen Wunsch der Kolleginnen aus. „haben" (Indikativ Präsens), „hatten" (Präteritum) und „hätte" (Singular) passen grammatisch oder inhaltlich nicht.`
    },
    {
      no: 4,
      correct: "hätten",
      distractors: ["haben", "hatten", "hätte"],
      explanation: `Auch hier signalisiert „hätten" eine irreale Bedingung („Wenn wir ein größeres Büro hätten …"). Die Alternativen sind Formen desselben Verbs, aber nicht im passenden Modus oder Numerus.`
    }
  ]
};

// Function to convert backend format to internal format
function processBackendExercise(exercise: BackendExercise): {
  text: string;
  gaps: ProcessedGap[];
  level: string;
  section: string;
} {
  const gaps: ProcessedGap[] = [];
  let processedText = exercise.text;

  // Find all gap placeholders [n] in the text
  const gapPattern = /\[(\d+)\]/g;
  const matches: Array<{ index: number; gapNumber: number; length: number }> = [];
  let match;

  while ((match = gapPattern.exec(exercise.text)) !== null) {
    matches.push({
      index: match.index,
      gapNumber: parseInt(match[1]),
      length: match[0].length
    });
  }

  // Create a unique gap entry for each occurrence
  matches.forEach((matchInfo, idx) => {
    const gapData = exercise.gaps.find(g => g.no === matchInfo.gapNumber);
    if (!gapData) return;

    // Shuffle options: correct + distractors, then randomize
    const allOptions = [gapData.correct, ...gapData.distractors];
    const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(gapData.correct);

    gaps.push({
      id: `gap-${idx}`,
      position: matchInfo.index,
      gapNumber: matchInfo.gapNumber,
      options: shuffledOptions,
      correct: correctIndex,
      explanation: gapData.explanation
    });
  });

  return {
    text: exercise.text,
    gaps: gaps,
    level: exercise.level,
    section: exercise.grammar_section_id
  };
}

const Exercise = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(EXERCISES_MAINTENANCE_MODE);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<BackendExercise | null>(null);
  const [availableExercises, setAvailableExercises] = useState<BackendExercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [exercisesCompletedInBatch, setExercisesCompletedInBatch] = useState(0);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const lastShownIdRef = useRef<string | null>(null);
  const shownExerciseIdsRef = useRef<Set<string>>(new Set());
  // Progression tracking
  const exhaustedGrammarSectionsRef = useRef<Map<string, Set<string>>>(new Map()); // level -> Set of exhausted grammar_section_ids
  const exhaustedLevelsRef = useRef<Set<string>>(new Set());
  const currentGrammarSectionRef = useRef<string | null>(null); // Track current grammar section for progression
  const { stats, incrementExercise, shouldShowWaitlist, markWaitlistSeen } = useExerciseStats();
  const { user, isAuthenticated, refreshUser } = useAuth();

  // Get level and section from URL, with defaults
  const level = searchParams.get("level") || "b2";
  const section = searchParams.get("section") || "verben";
  const grammarSection = searchParams.get("grammar");

  // Fetch exercises from API when level or section changes
  useEffect(() => {
    lastShownIdRef.current = null;
    shownExerciseIdsRef.current.clear();
    exhaustedGrammarSectionsRef.current.clear();
    exhaustedLevelsRef.current.clear();
    currentGrammarSectionRef.current = grammarSection || null;
    setExercisesCompletedInBatch(0);
    fetchExercisesWithProgression(true);
  }, [level, section, grammarSection]);

  // Get the next CEFR level
  const getNextLevel = (currentLevel: string): string | null => {
    const currentIndex = LEVEL_ORDER.indexOf(currentLevel.toLowerCase() as any);
    if (currentIndex === -1 || currentIndex === LEVEL_ORDER.length - 1) {
      return null;
    }
    return LEVEL_ORDER[currentIndex + 1];
  };

  // Mark a grammar section as exhausted for a level
  const markSectionExhausted = (levelKey: string, sectionId: string) => {
    if (!exhaustedGrammarSectionsRef.current.has(levelKey)) {
      exhaustedGrammarSectionsRef.current.set(levelKey, new Set());
    }
    exhaustedGrammarSectionsRef.current.get(levelKey)!.add(sectionId);
    console.log(`Marked section ${sectionId} as exhausted for level ${levelKey}`);
  };

  // Fetch exercises with progression logic
  const fetchExercisesWithProgression = async (isInitial: boolean = false) => {
    if (isInitial) {
      setLoadingExercises(true);
    } else {
      setIsFetchingNext(true);
    }

    const API_BASE = import.meta.env.DEV ? 'http://localhost:8888/api' : '/api';

    // Progression steps:
    // 1. Try current grammar section (if set)
    // 2. Try same level, same topic (any grammar section)
    // 3. Try same level, any topic
    // 4. Try next higher level
    // 5. Try random (no filters)

    const progressionSteps: Array<{
      level: string | null;
      topic: string | null;
      grammarSection: string | null;
      description: string;
    }> = [];

    // Step 1: Current grammar section (if specified)
    if (currentGrammarSectionRef.current) {
      progressionSteps.push({
        level: level.toUpperCase(),
        topic: null,
        grammarSection: currentGrammarSectionRef.current,
        description: `grammar section ${currentGrammarSectionRef.current} at ${level.toUpperCase()}`
      });
    }

    // Step 2: Same level, same topic (any grammar section)
    progressionSteps.push({
      level: level.toUpperCase(),
      topic: section,
      grammarSection: null,
      description: `topic ${section} at ${level.toUpperCase()}`
    });

    // Step 3: Same level, any topic
    progressionSteps.push({
      level: level.toUpperCase(),
      topic: null,
      grammarSection: null,
      description: `any topic at ${level.toUpperCase()}`
    });

    // Step 4: Higher levels
    let nextLevel = getNextLevel(level);
    while (nextLevel) {
      if (!exhaustedLevelsRef.current.has(nextLevel)) {
        progressionSteps.push({
          level: nextLevel.toUpperCase(),
          topic: null,
          grammarSection: null,
          description: `any topic at ${nextLevel.toUpperCase()}`
        });
      }
      nextLevel = getNextLevel(nextLevel);
    }

    // Step 5: Random (no level filter)
    progressionSteps.push({
      level: null,
      topic: null,
      grammarSection: null,
      description: 'random exercises'
    });

    // Try each progression step
    for (const step of progressionSteps) {
      try {
        let url = `${API_BASE}/exercises?limit=5`;

        if (step.level) {
          url += `&level=${step.level}`;
        }

        if (isAuthenticated && user?.id) {
          url += `&userId=${user.id}`;
        }

        if (step.grammarSection) {
          url += `&grammarSection=${step.grammarSection}`;
        } else if (step.topic) {
          url += `&topic=${step.topic}`;
        }

        console.log(`Trying progression step: ${step.description}`, url);

        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`HTTP ${response.status} for ${step.description}`);
          continue;
        }

        const data = await response.json();

        if (data.exercises && data.exercises.length > 0) {
          // Filter out exercises we've already shown
          const newExercises = data.exercises.filter(
            (ex: BackendExercise) => !shownExerciseIdsRef.current.has(ex.id)
          );

          if (newExercises.length > 0) {
            console.log(`Found ${newExercises.length} new exercises from ${step.description}`);

            // Track the grammar section of the first exercise
            const firstExerciseSection = newExercises[0].grammar_section_id;
            if (firstExerciseSection) {
              currentGrammarSectionRef.current = firstExerciseSection;
            }

            if (isInitial) {
              const [firstExercise, ...restExercises] = newExercises;
              setCurrentExercise(firstExercise);
              lastShownIdRef.current = firstExercise.id;
              shownExerciseIdsRef.current.add(firstExercise.id);
              setAvailableExercises(restExercises);

              // Show progression toast if level changed
              if (step.level && step.level.toLowerCase() !== level.toLowerCase()) {
                toast({
                  title: "Level Up!",
                  description: `Moving to ${step.level} exercises`,
                });
                // Update URL to reflect new level
                const params = new URLSearchParams();
                params.set("level", step.level.toLowerCase());
                params.set("section", firstExercise.grammar_ui_topics?.[0] || section);
                setSearchParams(params, { replace: true });
              } else if (step.topic && step.topic !== section) {
                toast({
                  title: "Topic Changed",
                  description: `Now practicing ${step.topic}`,
                });
              }

              console.log('Initial exercise selected:', firstExercise.id);
            } else {
              setAvailableExercises(prev => [...prev, ...newExercises]);
            }

            setLoadingExercises(false);
            setIsFetchingNext(false);
            return; // Success, exit the function
          } else {
            console.log(`All exercises from ${step.description} already shown`);
            // Mark this section/level as exhausted
            if (step.grammarSection && step.level) {
              markSectionExhausted(step.level, step.grammarSection);
            }
          }
        } else {
          console.log(`No exercises found for ${step.description}`);
          // Mark this section/level as exhausted
          if (step.grammarSection && step.level) {
            markSectionExhausted(step.level, step.grammarSection);
          } else if (step.level && !step.topic && !step.grammarSection) {
            exhaustedLevelsRef.current.add(step.level.toLowerCase());
            console.log(`Marked level ${step.level} as exhausted`);
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${step.description}:`, error);
      }
    }

    // If we get here, all progression steps failed
    console.warn('All progression steps exhausted, clearing shown IDs and retrying...');
    if (isInitial) {
      // Clear everything and try again from the beginning
      shownExerciseIdsRef.current.clear();
      exhaustedGrammarSectionsRef.current.clear();
      exhaustedLevelsRef.current.clear();

      // Fetch one more time, if still nothing, use mock
      try {
        const url = `${API_BASE}/exercises?level=${level.toUpperCase()}&topic=${section}&limit=5`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.exercises && data.exercises.length > 0) {
          const [firstExercise, ...restExercises] = data.exercises;
          setCurrentExercise(firstExercise);
          lastShownIdRef.current = firstExercise.id;
          shownExerciseIdsRef.current.add(firstExercise.id);
          setAvailableExercises(restExercises);
        } else {
          setCurrentExercise(mockBackendExercise);
        }
      } catch {
        setCurrentExercise(mockBackendExercise);
      }
      setLoadingExercises(false);
    } else {
      setIsFetchingNext(false);
    }
  };

  // Scroll to top when exercise changes
  useEffect(() => {
    if (currentExercise) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentExercise?.id]);


  // Process current exercise for display
  const exerciseData = useMemo(() => {
    if (!currentExercise) {
      return processBackendExercise(mockBackendExercise);
    }
    return processBackendExercise(currentExercise);
  }, [currentExercise]);

  const handleOptionSelect = (gapId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [gapId]: optionIndex });
  };

  // Submit exercise completion to backend
  const submitExerciseToBackend = async (exerciseId: string, correctAnswers: number, totalAnswers: number) => {
    if (!isAuthenticated || !user) {
      console.log('⏭️  Skipping backend sync - user not authenticated');
      return; // Skip backend sync for non-authenticated users
    }

    console.log('📤 Submitting exercise completion to backend:', {
      exerciseId,
      correctAnswers,
      totalAnswers,
      userId: user.id,
      level,
      section,
    });

    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:8888/api'
        : '/api';

      const response = await fetch(`${API_BASE}/exercise-completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: exerciseId,
          correct_answers: correctAnswers,
          total_answers: totalAnswers,
          practiced_level: level,
          practiced_topic: section,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit exercise');
      }

      const result = await response.json();
      console.log('✅ Exercise completion submitted successfully:', result);

      // Refresh user data to get updated stats
      console.log('🔄 Refreshing user data...');
      refreshUser();
    } catch (error) {
      console.error('❌ Error submitting exercise completion:', error);
      // Don't show error to user - this is a background sync
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== exerciseData.gaps.length) {
      return;
    }
    setSubmitted(true);

    const correctCount = exerciseData.gaps.filter(
      (gap) => selectedAnswers[gap.id] === gap.correct
    ).length;

    // Track exercise completion for stats
    incrementExercise(correctCount, exerciseData.gaps.length);

    // IMPORTANT: Mark exercise as seen/attempted regardless of score
    // This enables progression to next topic when all exercises have been attempted
    if (currentExercise) {
      markExerciseCompleted(
        currentExercise.id,
        currentExercise.level,
        currentExercise.grammar_ui_topics || []
      );

      // Submit to backend if user is authenticated
      await submitExerciseToBackend(
        currentExercise.id,
        correctCount,
        exerciseData.gaps.length
      );
    }

    // Show celebration only if all answers correct
    if (correctCount === exerciseData.gaps.length) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    // Check if we should show waitlist modal
    if (shouldShowWaitlist()) {
      setShowWaitlistModal(true);
    }
  };

  const handleNext = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setShowExplanations(false);

    // Increment completed exercises counter
    const newCount = exercisesCompletedInBatch + 1;
    setExercisesCompletedInBatch(newCount);

    // Prefetch next batch when user completes 3 exercises
    if (newCount === 3 && !isFetchingNext) {
      console.log('Prefetching next batch of 5 exercises...');
      fetchExercisesWithProgression(false);
    }

    // Reset counter when reaching 5
    if (newCount >= 5) {
      setExercisesCompletedInBatch(0);
    }

    // Select next exercise from available pool using state updater to get latest value
    setAvailableExercises(prev => {
      if (prev.length > 0) {
        const nextExercise = prev[0];
        console.log('Selecting next exercise:', nextExercise.id);

        // Set the next exercise
        setCurrentExercise(nextExercise);
        lastShownIdRef.current = nextExercise.id;
        shownExerciseIdsRef.current.add(nextExercise.id);

        // Track the grammar section for progression
        if (nextExercise.grammar_section_id) {
          currentGrammarSectionRef.current = nextExercise.grammar_section_id;
        }

        // Return the remaining exercises (removing the one we just selected)
        return prev.slice(1);
      } else {
        // If no exercises available, fetch new ones with progression
        console.log('No exercises in pool, fetching with progression...');
        fetchExercisesWithProgression(true);
        return prev;
      }
    });
  };

  const handleWaitlistModalClose = (open: boolean) => {
    setShowWaitlistModal(open);
    if (!open) {
      markWaitlistSeen();
    }
  };

  const handleSettingsApply = (newLevel: string, newSection: string, newGrammar: string | null) => {
    const params = new URLSearchParams();
    params.set("level", newLevel);
    params.set("section", newSection);
    if (newGrammar) {
      params.set("grammar", newGrammar);
    }
    navigate(`/exercise?${params.toString()}`, { replace: true });
    // In a real app, this would trigger loading new exercises
  };

  // Get grammar section name if set
  const grammarSectionName = grammarSection
    ? getGrammarSectionById(level, grammarSection)?.name
    : null;

  const renderTextWithGaps = () => {
    const parts = [];
    let lastIndex = 0;

    const sortedGaps = [...exerciseData.gaps].sort((a, b) => a.position - b.position);

    sortedGaps.forEach((gap) => {
      // Add text before the gap
      const textBefore = exerciseData.text.slice(lastIndex, gap.position);
      parts.push(textBefore);

      // Add the gap selector
      parts.push(
        <span key={gap.id} className="inline-block align-middle mx-1">
          <GapSelector
            gap={gap}
            selected={selectedAnswers[gap.id]}
            onSelect={(optionIndex) => handleOptionSelect(gap.id, optionIndex)}
            submitted={submitted}
          />
        </span>
      );

      // Find the length of the gap placeholder (e.g., [1], [2])
      const gapMatch = exerciseData.text.slice(gap.position).match(/^\[\d+\]/);
      const gapLength = gapMatch ? gapMatch[0].length : 0;

      lastIndex = gap.position + gapLength;
    });

    parts.push(exerciseData.text.slice(lastIndex));
    return parts;
  };

  const renderTextWithExplanations = () => {
    const items = [];
    let lastIndex = 0;

    const sortedGaps = [...exerciseData.gaps].sort((a, b) => a.position - b.position);

    sortedGaps.forEach((gap, idx) => {
      // Add text before the gap
      const textBefore = exerciseData.text.slice(lastIndex, gap.position);

      const correctOption = gap.options[gap.correct];

      // Find the length of the gap placeholder (e.g., [1], [2])
      const gapMatch = exerciseData.text.slice(gap.position).match(/^\[\d+\]/);
      const gapLength = gapMatch ? gapMatch[0].length : 0;

      lastIndex = gap.position + gapLength;

      // Create an item with text + answer + explanation
      items.push(
        <div key={gap.id} className="mb-8">
          {/* Text before the gap + the correct answer */}
          <div className="text-lg mb-3 leading-relaxed">
            <span className="text-foreground">{textBefore}</span>
            <span className="px-3 py-1.5 mx-1 bg-success/20 text-success font-semibold rounded border-2 border-success/40">
              {correctOption}
            </span>
          </div>
          {/* Explanation box */}
          <div className="ml-4 pl-4 border-l-4 border-primary/30 bg-primary/5 p-3 rounded-r-lg">
            <div className="text-xs font-semibold text-primary mb-1">Explanation:</div>
            <div className="text-sm text-muted-foreground">{gap.explanation}</div>
          </div>
        </div>
      );
    });

    // Add remaining text after the last gap
    const remainingText = exerciseData.text.slice(lastIndex);
    if (remainingText.trim()) {
      items.push(
        <div key="remaining" className="text-lg text-foreground leading-relaxed">
          {remainingText}
        </div>
      );
    }

    return items;
  };

  const correctCount = submitted
    ? exerciseData.gaps.filter((gap) => selectedAnswers[gap.id] === gap.correct).length
    : 0;

  // Show coming soon modal if maintenance mode is enabled
  if (EXERCISES_MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ComingSoonModal
          open={showComingSoonModal}
          onOpenChange={(open) => {
            setShowComingSoonModal(open);
            if (!open) {
              navigate("/");
            }
          }}
        />
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">🚧</h1>
          <h2 className="text-2xl font-bold mb-2">Exercises Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're currently improving our exercise quality. Leave your email to be notified when they're ready!
          </p>
          <Button onClick={() => setShowComingSoonModal(true)} size="lg">
            Get Notified
          </Button>
          <div className="mt-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching exercises
  if (loadingExercises && !currentExercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Übungen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {level}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                  {section}
                </span>
                {grammarSectionName && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                      {grammarSectionName}
                    </span>
                  </>
                )}
              </div>
            </div>
            <LanguageSwitcher />
            {REPORT_EXERCISE_ENABLED && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReportModal(true)}
                className="text-muted-foreground hover:text-foreground"
                title="Report an issue with this exercise"
              >
                <Flag className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsDialog(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-6 bg-gradient-card shadow-lg animate-fade-in">
            {showExplanations && submitted ? (
              <div className="space-y-2">
                {renderTextWithExplanations()}
              </div>
            ) : (
              <div className="text-lg leading-relaxed text-foreground">
                {renderTextWithGaps()}
              </div>
            )}
          </Card>

          {/* Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-6">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== exerciseData.gaps.length}
                className="min-w-48"
              >
                {t('exercise.checkAnswer')}
              </Button>
            </div>
          )}

          {/* Results */}
          {submitted && (
            <div className="space-y-6 animate-scale-in">
              <Card
                className={cn(
                  "p-6 text-center",
                  correctCount === exerciseData.gaps.length
                    ? "bg-success-light border-success"
                    : "bg-card"
                )}
              >
                <div className="text-4xl font-bold mb-2">
                  {correctCount} / {exerciseData.gaps.length}
                </div>
                <div className="text-muted-foreground">
                  {correctCount === exerciseData.gaps.length
                    ? "Perfect! All answers correct! 🎉"
                    : t('exercise.keepPracticing')}
                </div>
              </Card>

              <div className="flex justify-center gap-4 flex-wrap">
                <Button size="lg" onClick={handleNext} variant="success">
                  {t('exercise.nextExercise')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowExplanations(!showExplanations)}
                >
                  {t('exercise.showExplanations')}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                  {t('exercise.backToMenu')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-8xl animate-celebrate">🎉</div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        open={showWaitlistModal}
        onOpenChange={handleWaitlistModalClose}
        exercisesCompleted={stats.totalExercisesCompleted}
        openSource="exercise-completion"
      />

      {/* Exercise Settings Dialog */}
      <ExerciseSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        currentLevel={level}
        currentSection={section}
        currentGrammar={grammarSection}
        onApply={handleSettingsApply}
      />

      {/* Report Exercise Modal */}
      {REPORT_EXERCISE_ENABLED && (
        <ReportExerciseModal
          open={showReportModal}
          onOpenChange={setShowReportModal}
          exerciseId={currentExercise?.id || "unknown"}
          exerciseText={currentExercise?.text || ""}
          gaps={currentExercise?.gaps || []}
        />
      )}
    </div>
  );
};

interface GapSelectorProps {
  gap: ProcessedGap;
  selected?: number;
  onSelect: (index: number) => void;
  submitted: boolean;
}

const GapSelector = ({ gap, selected, onSelect, submitted }: GapSelectorProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCorrect = submitted && selected === gap.correct;
  const isWrong = submitted && selected !== undefined && selected !== gap.correct;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => !submitted && setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1.5 rounded-lg border-2 font-medium transition-all duration-300 text-center whitespace-nowrap",
          !submitted && "hover:border-primary hover:shadow-md cursor-pointer",
          submitted && "cursor-default",
          selected !== undefined && !submitted && "border-primary bg-primary/10",
          isCorrect && "border-success bg-success-light animate-celebrate",
          isWrong && "border-error bg-error-light animate-shake"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {selected !== undefined ? gap.options[selected] : "___"}
          {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
          {submitted && isWrong && <XCircle className="h-4 w-4 text-error" />}
        </span>
      </button>

      {isOpen && !submitted && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 bg-popover border-2 border-border rounded-lg shadow-lg p-2 min-w-48 animate-scale-in">
          {gap.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(index);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selected === index && "bg-primary/10 text-primary font-medium"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Show correct answer if wrong */}
      {submitted && isWrong && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-success-light border-2 border-success rounded-lg shadow-lg px-4 py-2 whitespace-nowrap">
          <div className="text-xs text-muted-foreground mb-1">{t('exercise.correct')}:</div>
          <div className="font-medium text-success">{gap.options[gap.correct]}</div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
