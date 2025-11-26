import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExerciseStats } from "@/hooks/useExerciseStats";
import { WaitlistModal } from "@/components/WaitlistModal";
import { ExerciseSettingsDialog } from "@/components/ExerciseSettingsDialog";
import { getGrammarSectionById } from "@/data/grammarSections";
import { getExercise } from "@/data/exerciseSelector";
import { markExerciseCompleted } from "@/utils/exerciseCompletion";
import { toast } from "@/hooks/use-toast";

// Backend response format (simplified structure)
import { GrammarUiTopicId } from "@/data/grammarSections";

interface BackendExercise {
  id: string;
  level: string;
  grammar_section_id: string;
  grammar_ui_topics: GrammarUiTopicId[];
  content_topic: string;
  model: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<BackendExercise | null>(null);
  const lastShownIdRef = useRef<string | null>(null);
  const { stats, incrementExercise, shouldShowWaitlist, markWaitlistSeen } = useExerciseStats();

  // Get level and section from URL, with defaults
  const level = searchParams.get("level") || "b2";
  const section = searchParams.get("section") || "verben";
  const grammarSection = searchParams.get("grammar");

  // Reset last shown exercise ID when level or section changes
  useEffect(() => {
    lastShownIdRef.current = null;
  }, [level, section, grammarSection]);

  // Detect progression and update URL when exercise changes
  useEffect(() => {
    if (!currentExercise) return;

    const exerciseLevel = currentExercise.level.toLowerCase();
    const exerciseTopics = currentExercise.grammar_ui_topics;
    const currentLevelLower = level.toLowerCase();
    const currentSectionLower = section.toLowerCase();

    // Check if level has progressed
    if (exerciseLevel !== currentLevelLower) {
      const params = new URLSearchParams();
      params.set("level", exerciseLevel);
      params.set("section", exerciseTopics[0]);
      if (grammarSection) {
        params.delete("grammar");
      }
      setSearchParams(params, { replace: true });

      toast({
        title: "Level Up!",
        description: `Congratulations! You've advanced to ${exerciseLevel.toUpperCase()}`,
      });
      return;
    }

    // Check if topic has progressed
    if (!exerciseTopics.includes(currentSectionLower as any)) {
      const params = new URLSearchParams();
      params.set("level", level);
      params.set("section", exerciseTopics[0]);
      if (grammarSection) {
        params.delete("grammar");
      }
      setSearchParams(params, { replace: true });

      toast({
        title: "Topic Completed!",
        description: `Moving to ${exerciseTopics[0]} exercises`,
      });
    }
  }, [currentExercise, level, section, grammarSection]);

  // Load exercise based on URL parameters and exerciseKey
  const exerciseData = useMemo(() => {
    // Get exercise with progression enabled, avoiding last shown
    const exercise = getExercise(level, section, grammarSection, true, lastShownIdRef.current);

    if (exercise) {
      setCurrentExercise(exercise);
      lastShownIdRef.current = exercise.id;
      return processBackendExercise(exercise);
    }

    // Fall back to mock if no exercise found
    setCurrentExercise(mockBackendExercise);
    lastShownIdRef.current = mockBackendExercise.id;
    return processBackendExercise(mockBackendExercise);
  }, [level, section, grammarSection, exerciseKey]);

  const handleOptionSelect = (gapId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [gapId]: optionIndex });
  };

  const handleSubmit = () => {
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
        currentExercise.grammar_ui_topics
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

    // Just increment the key - progression detection happens in useMemo
    setExerciseKey(prev => prev + 1);
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
        <span key={gap.id} className="inline-block mx-1 my-1">
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

  const correctCount = submitted
    ? exerciseData.gaps.filter((gap) => selectedAnswers[gap.id] === gap.correct).length
    : 0;

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsDialog(true)}
              className="ml-2"
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
            <div className="text-lg leading-relaxed">
              <p className="text-foreground flex flex-wrap items-center gap-y-3">{renderTextWithGaps()}</p>
            </div>
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
                Check Answers
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
                    : "Keep practicing! You're improving!"}
                </div>
              </Card>

              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleNext} variant="success">
                  Next Exercise
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                  Back to Menu
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
          "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-300 min-w-32 text-center",
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
          <div className="text-xs text-muted-foreground mb-1">Correct:</div>
          <div className="font-medium text-success">{gap.options[gap.correct]}</div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
