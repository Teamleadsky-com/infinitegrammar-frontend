/**
 * Client side of /api/exercise-events: logs what happens to an exercise on screen
 * (shown, started, submitted) for every visitor, including anonymous ones.
 *
 * No cookie or storage: the session id lives only in memory for this page load,
 * and each display of an exercise gets its own view id. Fire-and-forget; a failed
 * request never affects the exercise page.
 */

export type ExerciseEventName = 'shown' | 'started' | 'submitted';

export interface ExerciseEventPayload {
  viewId: string;
  exerciseId: string;
  event: ExerciseEventName;
  userId?: string | null;
  correctAnswers?: number;
  totalAnswers?: number;
}

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888/api' : '/api';

export const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

const SESSION_ID = newId();

/** This tab's session: the same id the exercise events carry, sent along when an account is created. */
export const getSessionId = (): string => SESSION_ID;

/** Automated browsers (end-to-end tests, crawlers that run JavaScript) are not visitors. */
export const isAutomated = (nav: Pick<Navigator, 'webdriver' | 'userAgent'> | undefined = globalThis.navigator): boolean =>
  !nav || nav.webdriver === true || /bot|crawl|spider|headless|lighthouse|prerender/i.test(nav.userAgent || '');

export function exerciseEventBody(payload: ExerciseEventPayload, sessionId: string = SESSION_ID) {
  return {
    view_id: payload.viewId,
    session_id: sessionId,
    exercise_id: payload.exerciseId,
    event: payload.event,
    user_id: payload.userId || null,
    ...(payload.event === 'submitted'
      ? { correct_answers: payload.correctAnswers, total_answers: payload.totalAnswers }
      : {}),
  };
}

export function logExerciseEvent(payload: ExerciseEventPayload): void {
  if (isAutomated()) return;
  fetch(`${API_BASE}/exercise-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseEventBody(payload)),
    keepalive: true,
  }).catch(() => {});
}
