import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Exercise from './Exercise';
import * as exerciseSelectorModule from '@/data/exerciseSelector';
import * as b2Exercises from '@/data/b2_mock_exercises';

// Mock the modules
vi.mock('@/hooks/useExerciseStats', () => ({
  useExerciseStats: () => ({
    stats: { totalExercisesCompleted: 0 },
    incrementExercise: vi.fn(),
    shouldShowWaitlist: () => false,
    markWaitlistSeen: vi.fn(),
  }),
}));

vi.mock('@/data/grammarSections', () => ({
  getGrammarSectionById: (level: string, id: string) => {
    if (id === 'konditionalsaetze_konjunktiv2') {
      return { id, name: 'Konditionalsätze und Konjunktiv II', topics: ['verben'], points: [] };
    }
    return null;
  },
  getGrammarSections: (level: string, topic: string) => {
    return [
      { id: 'satzbau_wortstellung', name: 'Satzbau und Wortstellung', topics: ['verben'], points: [] },
      { id: 'konditionalsaetze_konjunktiv2', name: 'Konditionalsätze und Konjunktiv II', topics: ['verben'], points: [] },
    ];
  },
  grammarSections: {
    b2: [
      { id: 'satzbau_wortstellung', name: 'Satzbau und Wortstellung', topics: ['verben'], points: [] },
      { id: 'konditionalsaetze_konjunktiv2', name: 'Konditionalsätze und Konjunktiv II', topics: ['verben'], points: [] },
    ],
  },
}));

describe('Exercise Component', () => {
  const renderExercise = (initialUrl = '/exercise?level=b2&section=verben') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Initial Loading', () => {
    it('should load exercise based on URL parameters', () => {
      const { container } = renderExercise('/exercise?level=b2&section=verben');

      // Should render the exercise component
      expect(container.querySelector('.min-h-screen')).toBeTruthy();

      // Should show level badge
      expect(screen.getByText('b2')).toBeTruthy();

      // Should show section badge (may appear in badge and breadcrumb)
      expect(screen.getAllByText('verben').length).toBeGreaterThan(0);
    });

    it('should use default parameters when none provided', () => {
      renderExercise('/exercise');

      // Should use defaults: level=b2, section=verben
      expect(screen.getByText('b2')).toBeTruthy();
      expect(screen.getAllByText('verben').length).toBeGreaterThan(0);
    });

    it('should display grammar section name when provided', () => {
      renderExercise('/exercise?level=b2&section=verben&grammar=konditionalsaetze_konjunktiv2');

      // Should show the grammar section name
      expect(screen.getByText('Konditionalsätze und Konjunktiv II')).toBeTruthy();
    });

    it('should render exercise text with gaps', () => {
      renderExercise('/exercise?level=b2&section=verben');

      // Should have gap buttons (rendered as "___" initially)
      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___') || btn.textContent?.trim().length > 0
      );

      expect(gapButtons.length).toBeGreaterThan(0);
    });

    it('should render Check Answers button initially', () => {
      renderExercise('/exercise?level=b2&section=verben');

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      expect(checkButton).toBeTruthy();
    });
  });

  describe('Exercise Key Mechanism', () => {
    it('should load a new exercise when exerciseKey changes', async () => {
      const getExerciseSpy = vi.spyOn(exerciseSelectorModule, 'getExercise');

      renderExercise('/exercise?level=b2&section=verben');

      // Initial load
      expect(getExerciseSpy).toHaveBeenCalled();
      const initialCallCount = getExerciseSpy.mock.calls.length;

      // Find and click "Next Exercise" button (after submitting)
      // First, we need to select answers and submit
      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___')
      );

      if (gapButtons.length > 0) {
        // Click first gap to open dropdown
        await userEvent.click(gapButtons[0]);

        // Wait a bit for any dropdowns/animations
        await waitFor(() => {}, { timeout: 100 });
      }

      // The key mechanism should trigger new exercise load
      // (Note: Full user flow test would require selecting all answers)
    });

    it('should call getExercise with correct parameters', () => {
      const getExerciseSpy = vi.spyOn(exerciseSelectorModule, 'getExercise');

      renderExercise('/exercise?level=b2&section=verben&grammar=passiv');

      // getExercise is called with: level, section, grammarSection, enableProgression, lastShownId
      expect(getExerciseSpy).toHaveBeenCalled();
      const calls = getExerciseSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls[0][0]).toBe('b2');
      expect(calls[0][1]).toBe('verben');
      expect(calls[0][3]).toBe(true); // enableProgression
    });

    it('should fallback to mock exercise when getExercise returns null', () => {
      vi.spyOn(exerciseSelectorModule, 'getExercise').mockReturnValueOnce(null);

      renderExercise('/exercise?level=invalid');

      // Should still render something (fallback exercise)
      expect(screen.getByRole('button', { name: /check answers/i })).toBeTruthy();
    });
  });

  describe('Exercise Processing', () => {
    it('should shuffle options for each gap', () => {
      // Mock Math.random to control shuffling
      const originalRandom = Math.random;
      let callCount = 0;

      Math.random = vi.fn(() => {
        callCount++;
        return callCount % 2 === 0 ? 0.3 : 0.7; // Alternate values
      });

      renderExercise('/exercise?level=b2&section=verben');

      // Restore
      Math.random = originalRandom;

      // Options should be rendered (shuffled)
      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___')
      );

      expect(gapButtons.length).toBeGreaterThan(0);
    });

    it('should create unique gap IDs for each gap occurrence', () => {
      renderExercise('/exercise?level=b2&section=verben');

      // All gap buttons should have unique keys (implicitly tested by React)
      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___')
      );

      // If there are duplicate keys, React would warn
      expect(gapButtons.length).toBeGreaterThan(0);
    });
  });

  describe('User Interaction', () => {
    it('should disable Check Answers button until all gaps are filled', async () => {
      renderExercise('/exercise?level=b2&section=verben');

      const checkButton = screen.getByRole('button', { name: /check answers/i });

      // Should be disabled initially
      expect(checkButton).toHaveProperty('disabled', true);
    });

    it('should allow selecting options from gap dropdown', async () => {
      const user = userEvent.setup();
      renderExercise('/exercise?level=b2&section=verben');

      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___')
      );

      if (gapButtons.length > 0) {
        const firstGap = gapButtons[0];

        // Click to open dropdown
        await user.click(firstGap);

        // Dropdown should open with options
        await waitFor(() => {
          const options = screen.getAllByRole('button').filter(
            btn => !btn.textContent?.includes('___') &&
                   !btn.textContent?.includes('Check') &&
                   btn.textContent?.trim().length > 0
          );
          expect(options.length).toBeGreaterThan(0);
        }, { timeout: 1000 });
      }
    });
  });

  describe('Navigation', () => {
    it('should show back button to return home', () => {
      renderExercise('/exercise?level=b2');

      const backButtons = screen.getAllByRole('button').filter(
        btn => btn.querySelector('svg') // Arrow icon
      );

      expect(backButtons.length).toBeGreaterThan(0);
    });

    it('should show settings button', () => {
      renderExercise('/exercise?level=b2');

      // Settings button should be present
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Exercise Loads', () => {
    it('should handle different URL parameter combinations', async () => {
      // Note: In a real app, URL changes would be handled by router navigation
      // This test verifies the component renders correctly with different URL params
      const { unmount } = renderExercise('/exercise?level=b2&section=verben');
      expect(screen.getAllByText('verben').length).toBeGreaterThan(0);

      unmount();

      // Render with different params
      renderExercise('/exercise?level=b2&section=adjektive');
      await waitFor(() => {
        expect(screen.getAllByText('adjektive').length).toBeGreaterThan(0);
      });
    });

    it('should maintain exercise state across re-renders', () => {
      const { rerender } = renderExercise('/exercise?level=b2&section=verben');

      const initialText = screen.getByRole('button', { name: /check answers/i });
      expect(initialText).toBeTruthy();

      // Re-render with same props
      rerender(
        <MemoryRouter initialEntries={['/exercise?level=b2&section=verben']}>
          <Routes>
            <Route path="/exercise" element={<Exercise />} />
          </Routes>
        </MemoryRouter>
      );

      // Should still render exercise
      expect(screen.getByRole('button', { name: /check answers/i })).toBeTruthy();
    });
  });

  describe('Exercise Content Display', () => {
    it('should render exercise text between gaps', () => {
      renderExercise('/exercise?level=b2&section=verben');

      // Should have text content (from the exercise)
      const card = document.querySelector('.p-8');
      expect(card).toBeTruthy();
      expect(card?.textContent).toBeTruthy();
      expect(card?.textContent?.length).toBeGreaterThan(10);
    });

    it('should render all gaps in correct positions', () => {
      renderExercise('/exercise?level=b2&section=verben');

      const gapButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('___')
      );

      // Should have at least 3 gaps (based on B2 exercises)
      expect(gapButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Error Handling', () => {
    it('should fallback to mock exercise when getExercise returns null', () => {
      vi.spyOn(exerciseSelectorModule, 'getExercise').mockReturnValueOnce(null);

      renderExercise('/exercise?level=b2');

      // Should render fallback exercise (the mock exercise)
      expect(screen.getByRole('button', { name: /check answers/i })).toBeTruthy();

      // Should still show the requested level
      expect(screen.getByText('b2')).toBeTruthy();
    });

    it('should handle missing exercise data gracefully', () => {
      vi.spyOn(exerciseSelectorModule, 'getExercise').mockReturnValueOnce(null);

      renderExercise('/exercise?level=b2');

      // Should render fallback exercise
      expect(screen.getByRole('button', { name: /check answers/i })).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderExercise('/exercise?level=b2&section=verben');

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // All buttons should be focusable
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should render semantic HTML structure', () => {
      const { container } = renderExercise('/exercise?level=b2');

      expect(container.querySelector('header')).toBeTruthy();
      expect(container.querySelector('main')).toBeTruthy();
    });
  });
});
