import { describe, it, expect } from 'vitest';
import handler, { lowercaseLevelSegment } from './trailing-slash.ts';

const PASSTHROUGH = Symbol('context.next');

/** Runs the edge function against a path, returning the 301 Location or PASSTHROUGH. */
async function run(path: string): Promise<string | typeof PASSTHROUGH> {
  const context = { next: () => PASSTHROUGH } as never;
  const response = await handler(new Request(`https://www.infinitegrammar.de${path}`), context);
  if ((response as unknown) === PASSTHROUGH) return PASSTHROUGH;
  const res = response as Response;
  expect(res.status).toBe(301);
  return new URL(res.headers.get('location') as string).pathname + new URL(res.headers.get('location') as string).search;
}

describe('lowercaseLevelSegment', () => {
  it('lowercases a mixed-case level segment', () => {
    expect(lowercaseLevelSegment('/deutsche-grammatik/B1-niveau-lernen/')).toBe(
      '/deutsche-grammatik/b1-niveau-lernen/'
    );
  });

  it('lowercases the level segment while leaving the topic slug untouched', () => {
    expect(
      lowercaseLevelSegment('/deutsche-grammatik/B1-niveau-lernen/relativsaetze-relativpronomen-deutsch/')
    ).toBe('/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch/');
  });

  it('normalizes a mixed-case path that also lacks the trailing slash', () => {
    expect(lowercaseLevelSegment('/deutsche-grammatik/A2-Niveau-Lernen')).toBe(
      '/deutsche-grammatik/a2-niveau-lernen'
    );
  });

  it('returns null for an already-lowercase path so no self-redirect is possible', () => {
    expect(lowercaseLevelSegment('/deutsche-grammatik/b1-niveau-lernen/')).toBeNull();
    expect(
      lowercaseLevelSegment('/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch/')
    ).toBeNull();
  });

  it('returns null for non-level paths', () => {
    expect(lowercaseLevelSegment('/deutsche-grammatik/')).toBeNull();
    expect(lowercaseLevelSegment('/deutsche-grammatik/thema/Verben/')).toBeNull();
    expect(lowercaseLevelSegment('/assets/Index-ABC123.js')).toBeNull();
    expect(lowercaseLevelSegment('/og-image.png')).toBeNull();
    expect(lowercaseLevelSegment('/sitemap.xml')).toBeNull();
    expect(lowercaseLevelSegment('/robots.txt')).toBeNull();
    expect(lowercaseLevelSegment('/pruefungszentren/telc-Berlin/')).toBeNull();
  });

  it('normalizes unknown levels too — the CANONICAL_ROUTES gate in the handler rejects them', () => {
    expect(lowercaseLevelSegment('/deutsche-grammatik/D1-niveau-lernen/')).toBe(
      '/deutsche-grammatik/d1-niveau-lernen/'
    );
  });

  it('is idempotent: normalizing its own output returns null', () => {
    const once = lowercaseLevelSegment('/deutsche-grammatik/C1-Niveau-Lernen/');
    expect(once).toBe('/deutsche-grammatik/c1-niveau-lernen/');
    expect(lowercaseLevelSegment(once as string)).toBeNull();
  });
});

describe('trailing-slash handler', () => {
  it('301s a mixed-case level URL to its lowercase canonical', async () => {
    expect(await run('/deutsche-grammatik/B1-niveau-lernen/')).toBe('/deutsche-grammatik/b1-niveau-lernen/');
  });

  it('301s a mixed-case topic URL to its lowercase canonical', async () => {
    expect(await run('/deutsche-grammatik/B1-niveau-lernen/relativsaetze-relativpronomen-deutsch/')).toBe(
      '/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch/'
    );
  });

  it('corrects casing and a missing trailing slash in a single hop', async () => {
    expect(await run('/deutsche-grammatik/A2-Niveau-Lernen')).toBe('/deutsche-grammatik/a2-niveau-lernen/');
  });

  it('preserves the query string across the redirect', async () => {
    expect(await run('/deutsche-grammatik/B1-niveau-lernen/?utm_source=x')).toBe(
      '/deutsche-grammatik/b1-niveau-lernen/?utm_source=x'
    );
  });

  it('passes through canonical lowercase URLs without redirecting', async () => {
    expect(await run('/deutsche-grammatik/b1-niveau-lernen/')).toBe(PASSTHROUGH);
    expect(await run('/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch/')).toBe(
      PASSTHROUGH
    );
  });

  it('passes through mixed-case unknown levels and slugs — the CANONICAL_ROUTES gate rejects them', async () => {
    expect(await run('/deutsche-grammatik/D1-niveau-lernen/')).toBe(PASSTHROUGH);
    expect(await run('/deutsche-grammatik/B1-niveau-lernen/Relativsaetze-Relativpronomen-Deutsch/')).toBe(
      PASSTHROUGH
    );
  });

  it('passes through assets, sitemap and robots', async () => {
    expect(await run('/assets/Index-ABC123.js')).toBe(PASSTHROUGH);
    expect(await run('/og-image.png')).toBe(PASSTHROUGH);
    expect(await run('/sitemap.xml')).toBe(PASSTHROUGH);
    expect(await run('/robots.txt')).toBe(PASSTHROUGH);
  });

  it('still applies the pre-existing trailing-slash redirect for lowercase routes', async () => {
    expect(await run('/deutsche-grammatik/b1-niveau-lernen')).toBe('/deutsche-grammatik/b1-niveau-lernen/');
    expect(await run('/pruefungszentren/telc-berlin')).toBe('/pruefungszentren/telc-berlin/');
  });
});
