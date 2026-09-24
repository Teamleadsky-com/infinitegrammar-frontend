import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadHeaders, parseHeaders, matchesPath, resolveHeader, parseMaxAge } from './netlifyHeaders.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const rules = loadHeaders();

const routeClasses = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config/seo-route-classes.json'), 'utf-8')
);

/** Every <loc> in public/sitemap.xml, reduced to its pathname. */
const SITEMAP_PATHS: string[] = [
  ...fs
    .readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf-8')
    .matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => new URL(match[1]).pathname);

/**
 * Representative hashed build assets. The hashes are arbitrary; what matters is
 * the /assets/ prefix and the extension, which is what the rules match on.
 */
const ASSET_PATHS = ['/assets/index-D4t9kPq2.js', '/assets/index-B7xQm1Za.css'];

/**
 * Root-level static images shipped from public/.
 *
 * Deliberately scoped to the root level. "/assets/*" and "/*.png" would both
 * match a hypothetical "/assets/foo.png" -- a pre-existing overlap between two
 * rules that carry the *same* value, not something this change introduced. Do
 * not broaden this list to nested image paths without first resolving that
 * overlap in public/_headers, or the no-overlap test below will fail for a
 * reason unrelated to document caching.
 */
const IMAGE_PATHS = ['/og-image.png', '/favicon.ico', '/placeholder.svg'];

/** Client-only routes that must never be publicly cached for an hour. */
const APP_FUNCTIONAL_PATHS: string[] = routeClasses.exactRules
  .filter((rule: { class: string }) => rule.class === 'APP_FUNCTIONAL')
  .flatMap((rule: { path: string }) => [rule.path, `${rule.path}/`]);

/** The floor PERF-012 requires of a reusable document, in seconds. */
const DOCUMENT_MAX_AGE_FLOOR = 3600;

function cacheControlMatches(requestPath: string) {
  return resolveHeader(rules, requestPath, 'Cache-Control').matches;
}

describe('public/_headers rule table', () => {
  describe('parseHeaders', () => {
    it('parses every block in file order, preserving header names and values', () => {
      expect(rules.map((rule) => rule.path)).toEqual([
        '/assets/*',
        '/',
        '/deutsche-grammatik/*',
        '/pruefungszentren/*',
        '/articles/*',
        '/*.png',
        '/*.jpg',
        '/*.svg',
        '/*.ico',
        '/index.html',
        '/sitemap.xml',
        '/robots.txt',
        '/*',
      ]);
      expect(rules[0].headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
      expect(rules[rules.length - 1].headers['X-Frame-Options']).toBe('DENY');
    });

    it('ignores comments and blank lines', () => {
      const parsed = parseHeaders('# a comment\n\n/foo\n  X-Test: 1\n\n# trailing comment\n');
      expect(parsed).toEqual([{ path: '/foo', headers: { 'X-Test': '1' }, index: 0 }]);
    });

    it('matches "*" against any sequence of characters, including none', () => {
      expect(matchesPath('/articles/*', '/articles/')).toBe(true);
      expect(matchesPath('/articles/*', '/articles/some-slug/')).toBe(true);
      expect(matchesPath('/articles/*', '/articles')).toBe(false);
      expect(matchesPath('/', '/')).toBe(true);
      expect(matchesPath('/', '/exercise')).toBe(false);
      expect(matchesPath('/*', '/anything/at/all')).toBe(true);
    });

    it('reads max-age out of a Cache-Control value', () => {
      expect(parseMaxAge('public, max-age=3600')).toBe(3600);
      expect(parseMaxAge('public, max-age=31536000, immutable')).toBe(31536000);
      expect(parseMaxAge('no-cache, must-revalidate')).toBeNull();
    });
  });

  describe('prerendered documents', () => {
    it('covers every sitemap URL with exactly one Cache-Control rule', () => {
      expect(SITEMAP_PATHS.length).toBeGreaterThan(0);
      for (const pathname of SITEMAP_PATHS) {
        const matches = cacheControlMatches(pathname);
        expect(matches.map((m) => m.rule.path), pathname).toHaveLength(1);
      }
    });

    it('grants every sitemap URL a public, reusable cache lifetime', () => {
      for (const pathname of SITEMAP_PATHS) {
        const value = cacheControlMatches(pathname)[0].value;
        expect(parseMaxAge(value), pathname).toBeGreaterThanOrEqual(DOCUMENT_MAX_AGE_FLOOR);
        expect(value.toLowerCase(), pathname).toContain('public');
        for (const forbidden of ['no-store', 'private', 'no-cache']) {
          expect(value.toLowerCase(), pathname).not.toContain(forbidden);
        }
      }
    });
  });

  describe('hashed build assets', () => {
    it('keeps the immutable year-long policy, matched by exactly one rule', () => {
      for (const pathname of ASSET_PATHS) {
        const matches = cacheControlMatches(pathname);
        expect(matches.map((m) => m.rule.path), pathname).toEqual(['/assets/*']);
        expect(matches[0].value).toBe('public, max-age=31536000, immutable');
      }
    });

    // TECH-016: the retained legacy entry bundle must be cached like any other
    // hashed asset, never picked up by a document caching rule.
    it('gives the retained legacy entry bundle the same single immutable rule', () => {
      const matches = cacheControlMatches('/assets/index-GYNgpxbY.js');
      expect(matches.map((m) => m.rule.path)).toEqual(['/assets/*']);
      expect(matches[0].value).toBe('public, max-age=31536000, immutable');
    });
  });

  describe('no-overlap invariant', () => {
    it('never lets two rules set Cache-Control for the same request path', () => {
      for (const pathname of [...SITEMAP_PATHS, ...ASSET_PATHS, ...IMAGE_PATHS]) {
        const matches = cacheControlMatches(pathname);
        expect(matches.map((m) => m.rule.path), pathname).toHaveLength(1);
      }
    });
  });

  describe('APP_FUNCTIONAL routes', () => {
    it('never grants a per-user route a reusable cache lifetime', () => {
      expect(APP_FUNCTIONAL_PATHS.length).toBeGreaterThan(0);
      for (const pathname of APP_FUNCTIONAL_PATHS) {
        for (const { value } of cacheControlMatches(pathname)) {
          const maxAge = parseMaxAge(value);
          expect(maxAge === null || maxAge < DOCUMENT_MAX_AGE_FLOOR, `${pathname}: ${value}`).toBe(
            true
          );
        }
      }
    });
  });

  describe('system files', () => {
    it('leaves /robots.txt and /sitemap.xml untouched', () => {
      const robots = rules.find((rule) => rule.path === '/robots.txt');
      expect(robots?.headers).toEqual({
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      });

      const sitemap = rules.find((rule) => rule.path === '/sitemap.xml');
      expect(sitemap?.headers).toEqual({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      });
    });

    it('leaves the /index.html shell uncached', () => {
      const indexHtml = rules.find((rule) => rule.path === '/index.html');
      expect(indexHtml?.headers['Cache-Control']).toBe('no-cache, must-revalidate');
    });
  });

  describe('security headers', () => {
    it('still applies the /* security block to every document', () => {
      for (const pathname of [...SITEMAP_PATHS, ...APP_FUNCTIONAL_PATHS]) {
        for (const header of [
          'X-Frame-Options',
          'X-Content-Type-Options',
          'Referrer-Policy',
          'Permissions-Policy',
        ]) {
          const matches = resolveHeader(rules, pathname, header).matches;
          expect(matches.map((m) => m.rule.path), `${pathname} ${header}`).toEqual(['/*']);
        }
      }
    });
  });
});
