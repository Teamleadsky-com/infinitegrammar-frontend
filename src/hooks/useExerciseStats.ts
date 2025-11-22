import { useState, useEffect } from "react";

interface ExerciseStats {
  totalExercisesCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  hasSeenWaitlist: boolean;
}

const STORAGE_KEY = "exerciseStats";

const defaultStats: ExerciseStats = {
  totalExercisesCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  hasSeenWaitlist: false,
};

export function useExerciseStats() {
  const [stats, setStats] = useState<ExerciseStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultStats;
      }
    }
    return defaultStats;
  });

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const incrementExercise = (correct: number, total: number) => {
    setStats((prev) => ({
      ...prev,
      totalExercisesCompleted: prev.totalExercisesCompleted + 1,
      correctAnswers: prev.correctAnswers + correct,
      totalAnswers: prev.totalAnswers + total,
    }));
  };

  const markWaitlistSeen = () => {
    setStats((prev) => ({
      ...prev,
      hasSeenWaitlist: true,
    }));
  };

  const shouldShowWaitlist = () => {
    return stats.totalExercisesCompleted >= 2 && !stats.hasSeenWaitlist;
  };

  const resetStats = () => {
    setStats(defaultStats);
  };

  return {
    stats,
    incrementExercise,
    markWaitlistSeen,
    shouldShowWaitlist,
    resetStats,
  };
}
