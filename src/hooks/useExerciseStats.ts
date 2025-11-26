import { useState, useEffect } from "react";

interface ExerciseStats {
  totalExercisesCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  hasSeenWaitlist: boolean;
}

const STORAGE_KEY = "exerciseStats";

// ⚙️ CONFIGURATION: Change this value to set after how many completed exercises the waitlist popup appears
// Example: 2 = show after 2 exercises, 5 = show after 5 exercises, 10 = show after 10 exercises
const WAITLIST_TRIGGER_EXERCISE_COUNT = 1;

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
    return stats.totalExercisesCompleted >= WAITLIST_TRIGGER_EXERCISE_COUNT && !stats.hasSeenWaitlist;
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
