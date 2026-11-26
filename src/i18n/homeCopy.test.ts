import { describe, it, expect } from 'vitest';
import de from './locales/de.json';
import en from './locales/en.json';
import { BRAND_SUFFIX } from '@/lib/seoTitle';

/** Longer titles get truncated in results (claude-seo page check: title-too-long). */
const HOME_TITLE_MAX = 60;

const locales = { de: de.levelSelection, en: en.levelSelection };

describe('home page copy', () => {
  it('has the same keys in German and English', () => {
    expect(Object.keys(locales.en).sort()).toEqual(Object.keys(locales.de).sort());
    expect(locales.en.faq).toHaveLength(locales.de.faq.length);
    expect(locales.en.examRows.map((r) => r.level)).toEqual(locales.de.examRows.map((r) => r.level));
  });

  it.each(Object.entries(locales))('%s: meta title and description fit the SERP budget', (_locale, copy) => {
    expect(copy.metaTitle.endsWith(BRAND_SUFFIX)).toBe(true);
    expect(copy.metaTitle.length).toBeLessThanOrEqual(HOME_TITLE_MAX);
    expect(copy.metaDescription.length).toBeLessThanOrEqual(155);
  });

  it.each(Object.entries(locales))('%s: every FAQ item has a question and an answer', (_locale, copy) => {
    expect(copy.faq.length).toBeGreaterThanOrEqual(5);
    for (const item of copy.faq) {
      expect(item.q.trim().endsWith('?')).toBe(true);
      expect(item.a.trim().length).toBeGreaterThan(40);
    }
  });

  it('maps exam goals to B1, B2 and C1', () => {
    expect(locales.de.examRows.map((r) => r.level)).toEqual(['B1', 'B2', 'C1']);
  });

  it('names DTZ and Goethe and no longer claims full TestDaF grammar coverage', () => {
    for (const copy of Object.values(locales)) {
      const text = JSON.stringify(copy);
      expect(text).toContain('DTZ');
      expect(text).toContain('Goethe');
      expect(text).not.toMatch(/alle Grammatikthemen|all grammar topics/i);
    }
  });
});
