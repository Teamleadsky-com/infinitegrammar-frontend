import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, ArrowRight, Trophy } from 'lucide-react';

interface QuickQuizProps {
  level: string;
  grammarSectionId: string;
  grammarSectionName: string;
  onClose: () => void;
}

interface BackendGap {
  id: string;
  gap_number: number;
  correct_answer: string;
  distractors: string[];
  explanation?: string;
}

interface BackendExercise {
  id: string;
  text: string;
  gaps: BackendGap[];
}

interface ProcessedGap {
  id: string;
  position: number;
  gapNumber: number;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Exercise {
  id: string;
  text: string;
  gaps: ProcessedGap[];
}

export function QuickQuiz({ level, grammarSectionId, grammarSectionName, onClose }: QuickQuizProps) {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [level, grammarSectionId]);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE = import.meta.env.DEV ? 'http://localhost:8888/api' : '/api';
      const response = await fetch(
        `${API_BASE}/exercises?level=${level.toUpperCase()}&grammarSection=${grammarSectionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const data = await response.json();

      // Process and take first 5 exercises
      const processedExercises = data.exercises.slice(0, 5).map((ex: BackendExercise) => {
        const gaps: ProcessedGap[] = [];

        // Find all gap placeholders [n] in the text
        const gapPattern = /\[(\d+)\]/g;
        const matches: Array<{ index: number; gapNumber: number }> = [];
        let match;

        while ((match = gapPattern.exec(ex.text)) !== null) {
          matches.push({
            index: match.index,
            gapNumber: parseInt(match[1]),
          });
        }

        // Create processed gaps
        matches.forEach((matchInfo, idx) => {
          const gapData = ex.gaps.find((g) => g.gap_number === matchInfo.gapNumber);
          if (!gapData) return;

          const allOptions = [gapData.correct_answer, ...gapData.distractors];
          const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);

          gaps.push({
            id: gapData.id,
            position: matchInfo.index,
            gapNumber: matchInfo.gapNumber,
            options: shuffledOptions,
            correctAnswer: gapData.correct_answer,
            explanation: gapData.explanation,
          });
        });

        return {
          id: ex.id,
          text: ex.text,
          gaps: gaps,
        };
      });

      setExercises(processedExercises);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Fehler beim Laden der Übungen. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];

  const handleAnswerSelect = (gapId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [gapId]: answer }));
  };

  const isExerciseComplete = () => {
    if (!currentExercise) return false;
    return currentExercise.gaps.every((gap) => userAnswers[gap.id] !== undefined);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    exercises.forEach((exercise) => {
      exercise.gaps.forEach((gap) => {
        total++;
        if (userAnswers[gap.id] === gap.correctAnswer) {
          correct++;
        }
      });
    });

    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const renderTextWithGaps = (text: string, gaps: ProcessedGap[]) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort gaps by their position in text
    const sortedGaps = [...gaps].sort((a, b) => a.position - b.position);

    sortedGaps.forEach((gap, idx) => {
      const gapPlaceholder = `[${gap.gapNumber}]`;
      const gapIndex = text.indexOf(gapPlaceholder, lastIndex);

      if (gapIndex !== -1) {
        // Add text before gap
        parts.push(<span key={`text-${idx}`}>{text.substring(lastIndex, gapIndex)}</span>);

        // Add gap selector
        const selectedAnswer = userAnswers[gap.id];
        const isAnswered = selectedAnswer !== undefined;
        const isCorrect = selectedAnswer === gap.correctAnswer;

        parts.push(
          <span key={`gap-${gap.id}`} className="inline-block mx-1">
            <select
              value={selectedAnswer || ''}
              onChange={(e) => handleAnswerSelect(gap.id, e.target.value)}
              className={`px-3 py-1 border-2 rounded-md text-sm font-medium transition-colors ${
                isAnswered
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-primary focus:border-primary'
              }`}
              disabled={showResults}
            >
              <option value="">___</option>
              {gap.options.map((option, optIdx) => (
                <option key={optIdx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </span>
        );

        lastIndex = gapIndex + gapPlaceholder.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return <div className="text-base leading-relaxed">{parts}</div>;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Übungen werden geladen...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={onClose} variant="outline">
          Zurück
        </Button>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Keine Übungen für diese Kombination verfügbar.</p>
        <Button onClick={onClose} variant="outline">
          Zurück
        </Button>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const isGoodScore = score.percentage >= 70;

    return (
      <Card className="p-8 animate-fade-in">
        <div className="text-center mb-6">
          <Trophy className={`h-16 w-16 mx-auto mb-4 ${isGoodScore ? 'text-yellow-500' : 'text-gray-400'}`} />
          <h3 className="text-2xl font-bold mb-2">Quiz abgeschlossen!</h3>
          <div className="text-4xl font-bold mb-4">
            <span className={isGoodScore ? 'text-green-600' : 'text-orange-600'}>{score.percentage}%</span>
          </div>
          <p className="text-lg text-muted-foreground">
            {score.correct} von {score.total} Antworten richtig
          </p>
        </div>

        <div className="space-y-4">
          {isGoodScore ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">
                Sehr gut! Du beherrschst {grammarSectionName} schon ziemlich gut.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-orange-800 font-medium">
                Noch Verbesserungspotenzial! Übe {grammarSectionName} weiter, um sicherer zu werden.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate(`/exercise?level=${level}&section=${grammarSectionId}`)}
              className="gap-2"
            >
              Weiter üben
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onClose}>
              Quiz beenden
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm font-medium text-primary">
              {level.toUpperCase()} • {grammarSectionName}
            </span>
            <h3 className="text-lg font-bold">Schnelltest</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Übung {currentExerciseIndex + 1} von {exercises.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {currentExercise && (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {renderTextWithGaps(currentExercise.text, currentExercise.gaps)}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button onClick={handleNext} disabled={!isExerciseComplete()}>
              {currentExerciseIndex < exercises.length - 1 ? 'Weiter' : 'Ergebnisse'}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
