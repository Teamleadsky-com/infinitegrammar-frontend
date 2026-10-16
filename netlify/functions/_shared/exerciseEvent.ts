/** Validation of POST /api/exercise-events bodies (kept free of the db import so it can be unit-tested). */

const EVENTS = new Set(['shown', 'started', 'submitted']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ExerciseEvent {
  view_id: string;
  session_id: string;
  exercise_id: string;
  event: string;
  user_id: string | null;
  correct_answers: number | null;
  total_answers: number | null;
}

const count = (value: unknown): number | null =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 100 ? (value as number) : null;

/** Returns the event to store, or an error message. */
export function parseExerciseEvent(body: unknown): ExerciseEvent | string {
  if (!body || typeof body !== 'object') return 'body must be a JSON object';
  const b = body as Record<string, unknown>;
  if (typeof b.view_id !== 'string' || !UUID.test(b.view_id)) return 'view_id must be a UUID';
  if (typeof b.session_id !== 'string' || !UUID.test(b.session_id)) return 'session_id must be a UUID';
  if (typeof b.exercise_id !== 'string' || !b.exercise_id || b.exercise_id.length > 100) return 'exercise_id is required';
  if (typeof b.event !== 'string' || !EVENTS.has(b.event)) return 'event must be shown, started or submitted';
  if (b.user_id != null && (typeof b.user_id !== 'string' || !UUID.test(b.user_id))) return 'user_id must be a UUID';
  const submitted = b.event === 'submitted';
  return {
    view_id: b.view_id,
    session_id: b.session_id,
    exercise_id: b.exercise_id,
    event: b.event,
    user_id: (b.user_id as string) || null,
    correct_answers: submitted ? count(b.correct_answers) : null,
    total_answers: submitted ? count(b.total_answers) : null,
  };
}
