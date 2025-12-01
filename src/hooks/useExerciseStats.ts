import { useState, useEffect } from "react";

interface ExerciseStats {
  totalExercisesCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  lastWaitlistShownAt: number;
}

const STORAGE_KEY = "exerciseStats";

// ⚙️ FEATURE SWITCH: Enable/disable waitlist popup
// Set to false to completely disable waitlist, set to true to enable it
const WAITLIST_ENABLED = true;

// ⚙️ CONFIGURATION: Change this value to set after how many completed exercises the waitlist popup appears
// Example: 2 = show after every 2 exercises, 5 = show after every 5 exercises, 10 = show after every 10 exercises
// The popup will appear repeatedly at this interval (e.g., at 4, 8, 12, 16... exercises)
const WAITLIST_TRIGGER_EXERCISE_COUNT = 4;

const defaultStats: ExerciseStats = {
  totalExercisesCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  lastWaitlistShownAt: 0,
};

export function useExerciseStats() {
  const [stats, setStats] = useState<ExerciseStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Migrate old data structure (hasSeenWaitlist -> lastWaitlistShownAt)
        if ('hasSeenWaitlist' in parsed && !('lastWaitlistShownAt' in parsed)) {
          return {
            totalExercisesCompleted: parsed.totalExercisesCompleted || 0,
            correctAnswers: parsed.correctAnswers || 0,
            totalAnswers: parsed.totalAnswers || 0,
            // If they've seen it before, set last shown to current count so it won't show immediately
            lastWaitlistShownAt: parsed.hasSeenWaitlist ? parsed.totalExercisesCompleted || 0 : 0,
          };
        }

        return parsed;
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
      lastWaitlistShownAt: prev.totalExercisesCompleted,
    }));
  };

  const shouldShowWaitlist = () => {
    if (!WAITLIST_ENABLED) return false;

    // Show if we've completed enough exercises since last shown
    const exercisesSinceLastShown = stats.totalExercisesCompleted - stats.lastWaitlistShownAt;
    return exercisesSinceLastShown >= WAITLIST_TRIGGER_EXERCISE_COUNT;
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
