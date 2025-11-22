import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExerciseStats } from "@/hooks/useExerciseStats";
import { WaitlistModal } from "@/components/WaitlistModal";

// Backend response format
interface BackendExercise {
  config: {
    grammar_section: string;
    topic: string;
    language_level: string;
    exam_style: string;
    min_gaps: number;
    max_gaps: number;
    model: string;
  };
  base_text: string;
  cloze_text: string;
  gaps: Array<{
    n: number;
    original: string;
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
  config: {
    grammar_section: "Konjunktiv II in Konditionalsätzen",
    topic: "Arbeit im Homeoffice",
    language_level: "B2-C1",
    exam_style: "TELC / TestDaF style",
    min_gaps: 3,
    max_gaps: 6,
    model: "llama3.1:8b"
  },
  base_text: "Wenn ich nicht von zu Hause aus arbeiten müsste, würde ich wahrscheinlich viel mehr Zeit im Verkehr verlieren. Viele meiner Kolleginnen sagen, sie hätten gern die gleiche Flexibilität. Wenn wir ein größeres Büro hätten, könnten wir häufiger gemeinsam Workshops machen. Ich müsste dann aber wieder jeden Tag ins Zentrum fahren, und das würde ich eigentlich vermeiden wollen.",
  cloze_text: "Wenn ich nicht von zu Hause aus arbeiten [1], [2] ich wahrscheinlich viel mehr Zeit im Verkehr verlieren. Viele meiner Kolleginnen sagen, sie [3] gern die gleiche Flexibilität. Wenn wir ein größeres Büro [4], könnten wir häufiger gemeinsam Workshops machen. Ich [1] dann aber wieder jeden Tag ins Zentrum fahren, und das [2] ich eigentlich vermeiden wollen.",
  gaps: [
    {
      n: 1,
      original: "müsste",
      distractors: ["muss", "musste", "müssten"],
      explanation: `„müsste" steht hier im Konjunktiv II und drückt eine hypothetische Verpflichtung aus. Die Formen „muss", „musste" und „müssten" passen entweder zeitlich oder formal nicht genau zur Bedingungssituation.`
    },
    {
      n: 2,
      original: "würde",
      distractors: ["werde", "wird", "würden"],
      explanation: `„würde" + Infinitiv ist hier eine typische Konjunktiv-II-Umschreibung für eine hypothetische Folge. „werde" und „wird" sind Indikativformen, „würden" wäre Plural und stimmt nicht mit dem Subjekt überein.`
    },
    {
      n: 3,
      original: "hätten",
      distractors: ["haben", "hatten", "hätte"],
      explanation: `„hätten" ist Konjunktiv II und drückt einen nicht realen Wunsch der Kolleginnen aus. „haben" (Indikativ Präsens), „hatten" (Präteritum) und „hätte" (Singular) passen grammatisch oder inhaltlich nicht.`
    },
    {
      n: 4,
      original: "hätten",
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
  let processedText = exercise.cloze_text;

  // Find all gap placeholders [n] in the text
  const gapPattern = /\[(\d+)\]/g;
  const matches: Array<{ index: number; gapNumber: number; length: number }> = [];
  let match;

  while ((match = gapPattern.exec(exercise.cloze_text)) !== null) {
    matches.push({
      index: match.index,
      gapNumber: parseInt(match[1]),
      length: match[0].length
    });
  }

  // Create a unique gap entry for each occurrence
  matches.forEach((matchInfo, idx) => {
    const gapData = exercise.gaps.find(g => g.n === matchInfo.gapNumber);
    if (!gapData) return;

    // Shuffle options: original + distractors, then randomize
    const allOptions = [gapData.original, ...gapData.distractors];
    const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(gapData.original);

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
    text: exercise.cloze_text,
    gaps: gaps,
    level: exercise.config.language_level,
    section: exercise.config.grammar_section
  };
}

const Exercise = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const { stats, incrementExercise, shouldShowWaitlist, markWaitlistSeen } = useExerciseStats();

  // Process backend exercise data
  const exerciseData = useMemo(() => processBackendExercise(mockBackendExercise), []);

  const level = searchParams.get("level") || exerciseData.level;
  const section = searchParams.get("section") || exerciseData.section;

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

    // Track exercise completion
    incrementExercise(correctCount, exerciseData.gaps.length);

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
    // In a real app, load the next exercise
  };

  const handleWaitlistModalClose = (open: boolean) => {
    setShowWaitlistModal(open);
    if (!open) {
      markWaitlistSeen();
    }
  };

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
          <div className="flex items-center gap-4">
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
                <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                  {section}
                </span>
              </div>
            </div>
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

  const isCorrect = submitted && selected === gap.correct;
  const isWrong = submitted && selected !== undefined && selected !== gap.correct;

  return (
    <div className="relative inline-block">
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
