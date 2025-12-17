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
  const [showExplanations, setShowExplanations] = useState(false);
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
      const url = `${API_BASE}/exercises?level=${level.toUpperCase()}&grammarSection=${grammarSectionId}`;

      console.log('Fetching exercises from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (!data.exercises || data.exercises.length === 0) {
        setError('Keine Übungen für diese Kombination verfügbar.');
        setLoading(false);
        return;
      }

      // Take first 5 exercises
      const selectedExercises = data.exercises.slice(0, 5);

      // Process exercises from API format
      const processedExercises = selectedExercises.map((ex: any) => {
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

        // Create processed gaps from API format
        matches.forEach((matchInfo, idx) => {
          const gapData = ex.gaps.find((g: any) => g.gap_number === matchInfo.gapNumber);
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

      console.log('Processed exercises:', processedExercises);
      setExercises(processedExercises);
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError(`Fehler beim Laden der Übungen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
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

        parts.push(
          <span key={`gap-${gap.id}`} className="inline-block mx-1">
            <select
              value={selectedAnswer || ''}
              onChange={(e) => handleAnswerSelect(gap.id, e.target.value)}
              className={`px-4 py-2 border-2 rounded-lg text-base font-medium transition-colors ${
                isAnswered
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
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

    return <div className="text-lg leading-relaxed">{parts}</div>;
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
      <Card className="p-10 animate-fade-in">
        <div className="text-center mb-8">
          <Trophy className={`h-20 w-20 mx-auto mb-6 ${isGoodScore ? 'text-yellow-500' : 'text-gray-400'}`} />
          <h3 className="text-3xl font-bold mb-4">Quiz abgeschlossen!</h3>
          <div className="text-5xl font-bold mb-6">
            <span className={isGoodScore ? 'text-green-600' : 'text-orange-600'}>{score.percentage}%</span>
          </div>
          <p className="text-xl text-muted-foreground">
            {score.correct} von {score.total} Antworten richtig
          </p>
        </div>

        <div className="space-y-6">
          {isGoodScore ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800 font-medium text-lg">
                Sehr gut! Du beherrschst {grammarSectionName} schon ziemlich gut.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <p className="text-orange-800 font-medium text-lg">
                Noch Verbesserungspotenzial! Übe {grammarSectionName} weiter, um sicherer zu werden.
              </p>
            </div>
          )}

          {/* Show explanations button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowExplanations(!showExplanations)}
              className="gap-2"
            >
              {showExplanations ? 'Erklärungen ausblenden' : 'Erklärungen anzeigen'}
            </Button>
          </div>

          {/* Explanations section */}
          {showExplanations && (
            <div className="space-y-6 mt-6">
              {exercises.map((exercise, exIdx) => (
                <div key={exercise.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold mb-4 text-lg">Übung {exIdx + 1}</h4>

                  {/* Show full exercise text with answers filled in */}
                  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-base leading-relaxed">
                      {exercise.text.split(/\[(\d+)\]/).map((part, idx) => {
                        // If this is a gap number
                        if (idx % 2 === 1) {
                          const gapNumber = parseInt(part);
                          const gap = exercise.gaps.find(g => g.gapNumber === gapNumber);
                          if (gap) {
                            const userAnswer = userAnswers[gap.id];
                            const isCorrect = userAnswer === gap.correctAnswer;
                            return (
                              <span
                                key={idx}
                                className={`inline-block px-2 py-0.5 mx-1 rounded font-medium ${
                                  isCorrect
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                                }`}
                              >
                                {userAnswer || '___'}
                              </span>
                            );
                          }
                        }
                        // Regular text
                        return <span key={idx}>{part}</span>;
                      })}
                    </p>
                  </div>

                  {/* Gap-by-gap explanations */}
                  <div className="space-y-3">
                    {exercise.gaps.map((gap) => {
                      const userAnswer = userAnswers[gap.id];
                      const isCorrect = userAnswer === gap.correctAnswer;
                      return (
                        <div key={gap.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="mb-1">
                                <span className="font-medium">Lücke {gap.gapNumber}:</span>
                                {!isCorrect && (
                                  <div className="text-sm mt-1">
                                    <span className="text-red-600">Deine Antwort: {userAnswer || '(keine)'}</span>
                                    {' → '}
                                    <span className="text-green-600 font-medium">Richtig: {gap.correctAnswer}</span>
                                  </div>
                                )}
                                {isCorrect && (
                                  <span className="text-green-600 text-sm font-medium ml-2">{gap.correctAnswer}</span>
                                )}
                              </div>
                              {gap.explanation && (
                                <p className="text-sm text-muted-foreground mt-2">{gap.explanation}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-center flex-wrap pt-4">
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
    <Card className="p-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm font-medium text-primary mb-1 block">
              {level.toUpperCase()} • {grammarSectionName}
            </span>
            <h3 className="text-2xl font-bold">Schnelltest</h3>
          </div>
          <div className="text-base text-muted-foreground">
            Übung {currentExerciseIndex + 1} von {exercises.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {currentExercise && (
        <>
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            {renderTextWithGaps(currentExercise.text, currentExercise.gaps)}
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose} size="lg">
              Abbrechen
            </Button>
            <Button onClick={handleNext} disabled={!isExerciseComplete()} size="lg">
              {currentExerciseIndex < exercises.length - 1 ? 'Weiter' : 'Ergebnisse anzeigen'}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
