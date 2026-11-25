import type { GrammarTopic } from '@/data/grammarTopics';
import { buildPageTitle } from './seoTitle';

/**
 * Title and H1 for grammar lesson pages: "<Topic> (<Level>): Regeln, Beispiele, Übungen".
 *
 * `topic.title` holds only the topic name (no "Deutsche " prefix, no level), so
 * the level is added here once. The <title> must stay within LESSON_TITLE_MAX:
 * when the full suffix does not fit, a shorter suffix is used rather than
 * cutting the topic name. The H1 has no length budget and always uses the full
 * suffix.
 */

export const LESSON_TITLE_MAX = 60;

/** Suffixes from longest to shortest; the first one that fits is used. */
export const LESSON_SUFFIXES = [': Regeln, Beispiele, Übungen', ': Regeln & Übungen', ': Übungen', ''] as const;

type LessonTopic = Pick<GrammarTopic, 'title' | 'level'>;

const lessonHead = (topic: LessonTopic) => `${topic.title} (${topic.level})`;

export function lessonHeading(topic: LessonTopic): string {
  return `${lessonHead(topic)}${LESSON_SUFFIXES[0]}`;
}

export function lessonPageTitle(topic: LessonTopic): string {
  const head = lessonHead(topic);
  const suffix = LESSON_SUFFIXES.find((s) => head.length + s.length <= LESSON_TITLE_MAX) ?? '';
  return buildPageTitle(`${head}${suffix}`, { maxLength: LESSON_TITLE_MAX });
}
