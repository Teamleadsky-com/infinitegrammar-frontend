import { describe, it, expect } from 'vitest';
import { exerciseEventBody, isAutomated, newId } from './exerciseEvents';
import { parseExerciseEvent } from '../../netlify/functions/_shared/exerciseEvent';

const VIEW = '0b4d7f0e-6c1a-4f7e-9d2b-3a5c8e1f2d4b';
const SESSION = '9e8d7c6b-5a49-4382-a1b0-c9d8e7f6a5b4';
const USER = '11111111-2222-4333-8444-555555555555';

describe('exercise events (client)', () => {
  it('generates UUIDs the server accepts', () => {
    const id = newId();
    expect(parseExerciseEvent({ view_id: id, session_id: id, exercise_id: 'ex_1', event: 'shown' })).not.toBeTypeOf('string');
  });

  it('sends the score only with "submitted"', () => {
    expect(exerciseEventBody({ viewId: VIEW, exerciseId: 'ex_1', event: 'shown', correctAnswers: 3, totalAnswers: 5 }, SESSION))
      .toEqual({ view_id: VIEW, session_id: SESSION, exercise_id: 'ex_1', event: 'shown', user_id: null });
    expect(exerciseEventBody({ viewId: VIEW, exerciseId: 'ex_1', event: 'submitted', userId: USER, correctAnswers: 3, totalAnswers: 5 }, SESSION))
      .toEqual({ view_id: VIEW, session_id: SESSION, exercise_id: 'ex_1', event: 'submitted', user_id: USER, correct_answers: 3, total_answers: 5 });
  });

  it('treats automated browsers and crawlers as non-visitors', () => {
    expect(isAutomated({ webdriver: true, userAgent: 'Mozilla/5.0' })).toBe(true);
    expect(isAutomated({ webdriver: false, userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' })).toBe(true);
    expect(isAutomated({ webdriver: false, userAgent: 'Mozilla/5.0 HeadlessChrome/120.0' })).toBe(true);
    expect(isAutomated({ webdriver: false, userAgent: 'Mozilla/5.0 (Macintosh) Safari/605.1.15' })).toBe(false);
  });
});

describe('parseExerciseEvent (server)', () => {
  const base = { view_id: VIEW, session_id: SESSION, exercise_id: 'ex_1' };

  it('accepts anonymous and logged-in events', () => {
    expect(parseExerciseEvent({ ...base, event: 'shown' })).toEqual({ ...base, event: 'shown', user_id: null, correct_answers: null, total_answers: null });
    expect(parseExerciseEvent({ ...base, event: 'submitted', user_id: USER, correct_answers: 4, total_answers: 6 }))
      .toEqual({ ...base, event: 'submitted', user_id: USER, correct_answers: 4, total_answers: 6 });
  });

  it('ignores scores on events other than "submitted" and drops implausible ones', () => {
    expect(parseExerciseEvent({ ...base, event: 'started', correct_answers: 2, total_answers: 6 })).toMatchObject({ correct_answers: null, total_answers: null });
    expect(parseExerciseEvent({ ...base, event: 'submitted', correct_answers: -1, total_answers: 1.5 })).toMatchObject({ correct_answers: null, total_answers: null });
  });

  it.each([
    [null, 'body must be a JSON object'],
    [{ ...base, view_id: 'nope', event: 'shown' }, 'view_id must be a UUID'],
    [{ ...base, session_id: 42, event: 'shown' }, 'session_id must be a UUID'],
    [{ ...base, exercise_id: '', event: 'shown' }, 'exercise_id is required'],
    [{ ...base, exercise_id: 'x'.repeat(101), event: 'shown' }, 'exercise_id is required'],
    [{ ...base, event: 'clicked' }, 'event must be shown, started or submitted'],
    [{ ...base, event: 'shown', user_id: 'admin' }, 'user_id must be a UUID'],
  ])('rejects %j', (body, error) => {
    expect(parseExerciseEvent(body)).toBe(error);
  });
});
