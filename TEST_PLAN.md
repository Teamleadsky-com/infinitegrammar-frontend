# Exercise Selection Workflow - Test Plan

## Overview
This test plan covers the exercise selection and filtering system, ensuring users receive appropriate exercises based on their level, section, and grammar preferences.

## Test Scope

### 1. Unit Tests - `exerciseSelector.ts`

#### 1.1 Level Filtering
- **Test**: `getAllExercisesForLevel("b2")` returns all B2 exercises
  - Expected: Should return 12 B2 exercises
  - Verify: All returned exercises have `language_level: "B2"`

- **Test**: `getAllExercisesForLevel("a1")` with no A1 data
  - Expected: Should return empty array
  - Verify: Returns `[]`

- **Test**: Level filtering is case-insensitive
  - Expected: `getAllExercisesForLevel("B2")` and `getAllExercisesForLevel("b2")` return same results

#### 1.2 Topic/Section Filtering
- **Test**: Filter by "verben" topic
  - Expected: Returns only exercises with "Verben" in grammar_section
  - Verify: `b2_verben_praeposition_1` is included

- **Test**: Filter by "adjektive" topic
  - Expected: Returns only exercises with "Adjektiv" in grammar_section
  - Verify: `b2_adjektivdeklination_1` is included

- **Test**: Filter by non-existent topic
  - Expected: Returns empty array or all exercises
  - Verify: Behavior is predictable

- **Test**: Topic filtering is case-insensitive
  - Expected: "Verben", "verben", "VERBEN" all work

#### 1.3 Grammar Section Filtering
- **Test**: Filter by specific grammar section ID
  - Input: `grammarSection: "konditionalsaetze_konjunktiv2"`
  - Expected: Returns only `b2_konditionalsaetze_konjunktiv2_1`
  - Verify: Correct exercise mapping

- **Test**: Filter by grammar section with multiple exercises (future)
  - Expected: Returns all exercises for that section
  - Verify: Multiple exercises returned when available

- **Test**: Invalid grammar section ID
  - Expected: Returns empty array or falls back gracefully

#### 1.4 Combined Filters
- **Test**: Level + Section filtering
  - Input: `level: "b2", section: "verben"`
  - Expected: Returns B2 exercises about verbs only
  - Verify: Intersection of both filters

- **Test**: Level + Section + Grammar filtering
  - Input: `level: "b2", section: "verben", grammar: "verben_praeposition"`
  - Expected: Returns most specific match
  - Verify: Most restrictive filter applied

- **Test**: Filters with no matching exercises
  - Input: `level: "b2", section: "nonexistent"`
  - Expected: Returns null or fallback
  - Verify: Graceful handling

#### 1.5 Random Selection
- **Test**: Multiple calls return different exercises (when pool > 1)
  - Setup: Filter that returns multiple exercises
  - Expected: Calling `getExercise()` multiple times may return different exercises
  - Verify: Randomization works (statistical test)

- **Test**: Single exercise in pool always returns same exercise
  - Setup: Filter that returns exactly 1 exercise
  - Expected: Always returns that exercise
  - Verify: Consistency

### 2. Component Tests - `Exercise.tsx`

#### 2.1 Initial Loading
- **Test**: Component loads exercise based on URL params
  - URL: `/exercise?level=b2&section=verben`
  - Expected: Displays B2 verben exercise
  - Verify: Exercise content matches filters

- **Test**: Component uses default params when none provided
  - URL: `/exercise`
  - Expected: Uses `level=b2, section=verben`
  - Verify: Default values applied

- **Test**: Component handles invalid URL params
  - URL: `/exercise?level=invalid&section=invalid`
  - Expected: Falls back to mock exercise or shows error
  - Verify: No crash

#### 2.2 Exercise Key Mechanism
- **Test**: Exercise reloads when exerciseKey changes
  - Action: Increment exerciseKey state
  - Expected: New exercise loads
  - Verify: useMemo dependency triggers

- **Test**: Exercise doesn't reload when unrelated state changes
  - Action: Update selectedAnswers
  - Expected: Exercise remains the same
  - Verify: useMemo optimization works

#### 2.3 Navigation and State
- **Test**: "Next Exercise" button increments exerciseKey
  - Action: Click "Next Exercise"
  - Expected: exerciseKey increments, new exercise loads
  - Verify: State update and re-render

- **Test**: Settings dialog updates URL and resets exercise
  - Action: Change level from B2 to A1 (when available)
  - Expected: URL updates, new exercise loads
  - Verify: Navigation works

- **Test**: Back button preserves exercise state
  - Action: Navigate away and back
  - Expected: Exercise state may reset (acceptable)
  - Verify: No errors

#### 2.4 Exercise Processing
- **Test**: Backend exercise format converted correctly
  - Input: Raw backend exercise object
  - Expected: Processed format with shuffled options
  - Verify: Options are shuffled, correct answer tracked

- **Test**: Gap positions calculated correctly
  - Input: Exercise with multiple gaps
  - Expected: Gaps rendered in correct text positions
  - Verify: Visual layout correct

- **Test**: Option shuffling is deterministic per load
  - Action: Load same exercise
  - Expected: Options shuffle differently each time
  - Verify: Math.random() called during processing

### 3. Integration Tests - User Workflows

#### 3.1 Complete Exercise Flow
- **Workflow**: Select level → Complete exercise → Next exercise
  1. User navigates to `/exercise?level=b2&section=verben`
  2. Exercise loads and displays
  3. User selects answers
  4. User clicks "Check Answers"
  5. Results display
  6. User clicks "Next Exercise"
  7. New exercise loads with same filters
  - Verify: Each step works, state transitions correct

#### 3.2 Filter Change Workflow
- **Workflow**: Start exercise → Change settings → Continue
  1. User loads B2 verben exercise
  2. User opens settings dialog
  3. User changes to B2 adjektive
  4. User applies settings
  5. New adjektive exercise loads
  - Verify: Filters apply immediately

#### 3.3 Grammar Section Navigation
- **Workflow**: Select specific grammar section
  1. User is on level selection page
  2. User clicks on specific grammar section (e.g., "Konditionalsätze")
  3. Navigates to `/exercise?level=b2&section=verben&grammar=konditionalsaetze_konjunktiv2`
  4. Correct exercise for that grammar section loads
  - Verify: Deep linking works

#### 3.4 Edge Cases
- **Test**: Rapid "Next Exercise" clicks
  - Action: Click "Next Exercise" multiple times quickly
  - Expected: Exercise updates each time without errors
  - Verify: No race conditions

- **Test**: Browser back/forward with exercise history
  - Action: Complete exercise, next, next, back, back
  - Expected: History works (may reset exercise state)
  - Verify: No crashes

- **Test**: URL manipulation
  - Action: Manually edit URL params
  - Expected: Exercise updates to match new params
  - Verify: Reactive to URL changes

### 4. Data Integrity Tests

#### 4.1 Exercise Data Structure
- **Test**: All B2 exercises have required fields
  - Verify: Each exercise has config, base_text, cloze_text, gaps
  - Verify: Each gap has n, original, distractors, explanation

- **Test**: Gap numbers are consistent
  - Verify: Gap numbers in cloze_text match gap objects
  - Verify: No missing or duplicate gap numbers

- **Test**: Grammar section IDs match exercise names
  - Verify: All entries in `grammarSectionToExerciseMap` reference valid exercises
  - Verify: Exercise exports match map keys

#### 4.2 Exercise Content Quality
- **Test**: Cloze text contains expected gap count
  - Verify: Number of `[n]` placeholders matches gaps.length
  - Verify: Gap positions are valid

- **Test**: Distractor count is consistent
  - Verify: Each gap has 3 distractors (or configured amount)
  - Verify: Original answer is not in distractors array

## Test Implementation Priority

1. **High Priority** (Must Have):
   - Unit tests for exerciseSelector.ts (1.1-1.4)
   - Component test for exerciseKey mechanism (2.2)
   - Integration test for "Next Exercise" workflow (3.1)

2. **Medium Priority** (Should Have):
   - Component tests for URL params (2.1)
   - Integration test for filter changes (3.2)
   - Data integrity tests (4.1)

3. **Low Priority** (Nice to Have):
   - Random selection tests (1.5)
   - Edge case tests (3.4)
   - Content quality tests (4.2)

## Testing Tools & Framework

- **Test Runner**: Vitest (already configured with Vite)
- **Component Testing**: @testing-library/react
- **Assertions**: Vitest's expect API
- **Mocking**: vi.mock() for modules
- **Coverage**: Target 80%+ for critical paths

## Success Criteria

- All high-priority tests pass
- Exercise selection logic is deterministic and testable
- No regressions in existing functionality
- Code coverage > 70% for exercise-related modules
