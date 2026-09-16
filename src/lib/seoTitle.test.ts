import { describe, it, expect } from 'vitest';
import {
  BRAND_NAME,
  BRAND_SUFFIX,
  MAX_TITLE_WITH_BRAND,
  buildPageTitle,
} from './seoTitle';

/** A base title of exactly `length` characters. */
const base = (length: number) => 'x'.repeat(length);

/** Longest base that still leaves room for the suffix inside the budget. */
const FITTING_BASE_LENGTH = MAX_TITLE_WITH_BRAND - BRAND_SUFFIX.length;

describe('buildPageTitle', () => {
  it('appends the brand suffix when the finished title fits the budget', () => {
    expect(buildPageTitle('Futur I B1')).toBe(`Futur I B1${BRAND_SUFFIX}`);
  });

  it('keeps the brand at exactly the budget boundary', () => {
    const title = buildPageTitle(base(FITTING_BASE_LENGTH));
    expect(title).toHaveLength(MAX_TITLE_WITH_BRAND);
    expect(title.endsWith(BRAND_SUFFIX)).toBe(true);
  });

  it('drops the brand one character past the budget', () => {
    const tooLong = base(FITTING_BASE_LENGTH + 1);
    expect(buildPageTitle(tooLong)).toBe(tooLong);
  });

  it('appends the brand regardless of length when forceBrand is set', () => {
    const tooLong = base(FITTING_BASE_LENGTH + 40);
    expect(buildPageTitle(tooLong, { forceBrand: true })).toBe(`${tooLong}${BRAND_SUFFIX}`);
  });

  it('is idempotent — never double-appends the suffix', () => {
    const once = buildPageTitle('Futur I B1');
    expect(buildPageTitle(once)).toBe(once);
    expect(buildPageTitle(once, { forceBrand: true })).toBe(once);
    expect(once.match(/InfiniteGrammar/g)).toHaveLength(1);
  });

  it('never returns an empty title', () => {
    expect(buildPageTitle('')).toBe(BRAND_NAME);
    expect(buildPageTitle('   ')).toBe(BRAND_NAME);
    expect(buildPageTitle(undefined as unknown as string)).toBe(BRAND_NAME);
    expect(buildPageTitle(null as unknown as string)).toBe(BRAND_NAME);
  });

  it('trims surrounding whitespace before measuring', () => {
    expect(buildPageTitle('  Futur I B1  ')).toBe(`Futur I B1${BRAND_SUFFIX}`);
  });
});

describe('call-site templates', () => {
  // One fixture per page that builds a title, using the real strings the pages
  // pass in. `brand: true` means the finished title must carry the suffix.
  const fixtures: { name: string; input: string; brand: boolean }[] = [
    // ArticleContent.tsx — article.title
    { name: 'article (short)', input: 'Generating Exercises in Batches', brand: true },
    { name: 'article (medium)', input: 'Exercise Generation AI Pipeline Analysis', brand: true },
    {
      name: 'article (long)',
      input: 'Why InfiniteGrammar.de Started with Exam-Driven Grammar Demand',
      brand: false,
    },
    // GrammatikContent.tsx — `${topic.title}: Regeln & Beispiele einfach erklärt`
    { name: 'grammar topic (short)', input: 'Futur I B1: Regeln & Beispiele einfach erklärt', brand: true },
    { name: 'grammar topic (A2)', input: 'Komplexe Sätze A2: Regeln & Beispiele einfach erklärt', brand: false },
    {
      name: 'grammar topic (long)',
      input: 'Wechselpräpositionen: Wo? Wohin? B1: Regeln & Beispiele einfach erklärt',
      brand: false,
    },
    // CityExamPage.tsx — content.title
    { name: 'city exam (Frankfurt)', input: 'telc Prüfungszentren in Frankfurt – VHS & Goethe-Institut', brand: false },
    { name: 'city exam (Stuttgart)', input: 'telc Prüfungszentren in Stuttgart – VHS, Berlitz & mehr', brand: false },
    // PruefungsZentren.tsx
    {
      name: 'exam centre hub',
      input: 'telc & TestDaF Prüfungszentren Deutschland: Finden & Anmelden',
      brand: false,
    },
    // Grammatik.tsx / GrammatikLevel.tsx
    { name: 'grammar hub', input: 'Deutsche Grammatik A1-C1: Regeln & Übungen einfach erklärt', brand: false },
    { name: 'grammar level', input: 'Deutsche Grammatik B1: Regeln & Übungen einfach erklärt', brand: false },
    // Articles.tsx / ExerciseStats.tsx
    { name: 'articles hub', input: 'Articles: Building a German Grammar Platform', brand: true },
    { name: 'exercise stats (de)', input: 'Übungsstatistiken A1–C1', brand: true },
    { name: 'exercise stats (en)', input: 'Exercise Statistics A1–C1', brand: true },
  ];

  it.each(fixtures)('$name keeps the brand only when it fits', ({ input, brand }) => {
    const title = buildPageTitle(input);
    expect(title.endsWith(BRAND_SUFFIX)).toBe(brand);
    expect(title.startsWith(input)).toBe(true);
    if (brand) expect(title.length).toBeLessThanOrEqual(MAX_TITLE_WITH_BRAND);
  });

  it('leaves at most a minority of the call-site templates carrying the brand', () => {
    const branded = fixtures.filter((f) => buildPageTitle(f.input).endsWith(BRAND_SUFFIX));
    expect(branded.length / fixtures.length).toBeLessThan(0.8);
  });
});
