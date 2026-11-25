import { describe, it, expect } from 'vitest';
import { grammarTopics } from '@/data/grammarTopics';
import { LESSON_TITLE_MAX, lessonHeading, lessonPageTitle } from './lessonTitle';
import { BRAND_SUFFIX } from './seoTitle';

describe('lesson page titles', () => {
  it('covers every grammar topic', () => {
    expect(grammarTopics).toHaveLength(50);
  });

  it.each(grammarTopics.map((t) => [t.slug, t] as const))('%s: <title> fits the budget', (_slug, topic) => {
    expect(lessonPageTitle(topic).length).toBeLessThanOrEqual(LESSON_TITLE_MAX);
  });

  it('never prefixes the title, H1 or topic name with "Deutsche "', () => {
    for (const topic of grammarTopics) {
      expect(topic.title.startsWith('Deutsche ')).toBe(false);
      expect(lessonPageTitle(topic).startsWith('Deutsche ')).toBe(false);
      expect(lessonHeading(topic).startsWith('Deutsche ')).toBe(false);
    }
  });

  it('keeps the level out of the topic name (it is added once, in parentheses)', () => {
    for (const topic of grammarTopics) {
      expect(topic.title.endsWith(` ${topic.level}`)).toBe(false);
      expect(lessonPageTitle(topic).startsWith(`${topic.title} (${topic.level})`)).toBe(true);
    }
  });

  it('uses the full suffix in the H1', () => {
    expect(lessonHeading({ title: 'Präsens', level: 'A1' })).toBe('Präsens (A1): Regeln, Beispiele, Übungen');
  });

  it('shortens the suffix instead of cutting the topic', () => {
    expect(lessonPageTitle({ title: 'Präpositionen Ort & Richtung', level: 'A2' })).toBe(
      'Präpositionen Ort & Richtung (A2): Regeln & Übungen'
    );
    expect(lessonPageTitle({ title: 'Adjektivdeklination – komplexe Nominalgruppen', level: 'C1' })).toBe(
      'Adjektivdeklination – komplexe Nominalgruppen (C1): Übungen'
    );
  });

  it('adds the brand only when it fits within the lesson budget', () => {
    expect(lessonPageTitle({ title: 'Präsens', level: 'A1' })).toBe(
      `Präsens (A1): Regeln, Beispiele, Übungen${BRAND_SUFFIX}`
    );
    expect(lessonPageTitle({ title: 'Wortstellung', level: 'A1' })).toBe('Wortstellung (A1): Regeln, Beispiele, Übungen');
  });
});
