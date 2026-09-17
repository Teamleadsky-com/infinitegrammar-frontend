import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadRedirects, parseRedirects, resolve, isHostScoped } from './netlifyRedirects.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const rules = loadRedirects();

const routeClasses = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config/seo-route-classes.json'), 'utf-8')
);

/**
 * The client-only routes that must keep a 200 SPA shell.
 *
 * Deliberately scoped to exactRules only. The wildcardRules also contain
 * "/admin/*" as APP_FUNCTIONAL, but src/App.tsx has no nested admin route, so
 * /admin/<anything> renders <NotFound /> and 404 is the correct status for it.
 * The exclusion is asserted explicitly below so that adding a real admin
 * sub-route to src/App.tsx fails this suite rather than silently shipping a 404.
 */
const APP_FUNCTIONAL_EXACT: string[] = routeClasses.exactRules
  .filter((rule: { class: string }) => rule.class === 'APP_FUNCTIONAL')
  .map((rule: { path: string }) => rule.path);

/** Every <loc> in public/sitemap.xml, reduced to its pathname. */
const SITEMAP_PATHS: string[] = [
  ...fs
    .readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf-8')
    .matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => new URL(match[1]).pathname);

/**
 * Models the publish directory produced by scripts/prerender.js: one
 * dist/<path>index.html per sitemap URL, plus the SPA shell and a hashed asset.
 */
const PRERENDERED_FILES = new Set<string>([
  '/index.html',
  '/robots.txt',
  '/sitemap.xml',
  '/assets/index-D4t9kPq2.js',
  ...SITEMAP_PATHS.map((p) => (p.endsWith('/') ? p + 'index.html' : p + '/index.html')),
]);

/** No prerendered output at all -- proves a rule, not a file, produced the result. */
const NO_FILES = new Set<string>();

describe('netlify.toml redirect table', () => {
  describe('parseRedirects', () => {
    it('parses every [[redirects]] block in file order', () => {
      expect(rules.length).toBeGreaterThan(60);
      expect(rules[0].from).toBe('/api/*');
      expect(rules[rules.length - 1].from).toBe('/*');
    });

    it('reads force = true only where it is declared', () => {
      const forced = rules.filter((rule) => rule.force).map((rule) => rule.from);
      expect(forced).toContain('/sitemap.xml');
      expect(forced).toContain('/robots.txt');
      expect(forced).not.toContain('/*');
      expect(forced).not.toContain('/api/*');
    });

    it('treats scheme-qualified rules as host-scoped', () => {
      const hostScoped = rules.filter(isHostScoped).map((rule) => rule.from);
      expect(hostScoped).toEqual([
        'http://infinitegrammar.de/*',
        'https://infinitegrammar.de/*',
      ]);
    });

    it('defaults a block without an explicit status to 301', () => {
      const parsed = parseRedirects('[[redirects]]\n  from = "/x"\n  to = "/y"\n');
      expect(parsed).toEqual([{ from: '/x', to: '/y', status: 301, force: false, index: 0 }]);
    });
  });

  // Check 1 -- the fix itself.
  describe('terminal catch-all', () => {
    it('has exactly one "/*" catch-all and it is the last rule', () => {
      const catchAlls = rules.filter((rule) => rule.from === '/*');
      expect(catchAlls).toHaveLength(1);
      expect(catchAlls[0].index).toBe(rules.length - 1);
    });

    it('serves the React shell with a hard 404, not a soft 404', () => {
      const catchAll = rules[rules.length - 1];
      expect(catchAll.to).toBe('/index.html');
      expect(catchAll.status).toBe(404);
    });

    it('returns 404 for both frozen TECH-011 probe targets', () => {
      for (const probe of [
        '/__seo_autopilot_probe__/f2e6457cbd0ba133',
        '/__seo_autopilot_probe__/f9867eb9b7c1de6c/nested',
      ]) {
        const result = resolve(probe, { rules, staticFiles: PRERENDERED_FILES });
        expect(result.status).toBe(404);
        expect(result.to).toBe('/index.html');
      }
    });
  });

  // Check 2 -- client-only routes must not depend on prerendering.
  describe('APP_FUNCTIONAL routes', () => {
    it('covers all eight exact APP_FUNCTIONAL paths from config/seo-route-classes.json', () => {
      expect(APP_FUNCTIONAL_EXACT).toEqual([
        '/exercise',
        '/exercise-stats',
        '/statistics',
        '/auth',
        '/profile',
        '/verify-magic-link',
        '/admin',
        '/email-preferences',
      ]);
    });

    it.each(APP_FUNCTIONAL_EXACT)('serves %s as a 200 SPA shell with no static files', (route) => {
      const result = resolve(route, { rules, staticFiles: NO_FILES });
      expect(result).toMatchObject({ status: 200, to: '/index.html', via: 'rule' });
    });

    it.each(APP_FUNCTIONAL_EXACT)(
      'serves the trailing-slash form of %s as a 200 SPA shell',
      (route) => {
        const result = resolve(route + '/', { rules, staticFiles: NO_FILES });
        expect(result).toMatchObject({ status: 200, to: '/index.html', via: 'rule' });
      }
    );

    it('leaves /admin/* sub-routes on the 404 fallback (no nested admin route in src/App.tsx)', () => {
      const wildcardAdmin = routeClasses.wildcardRules.find(
        (rule: { pattern: string }) => rule.pattern === '/admin/*'
      );
      expect(wildcardAdmin?.class).toBe('APP_FUNCTIONAL');

      const result = resolve('/admin/section-clustering', {
        rules,
        staticFiles: PRERENDERED_FILES,
      });
      expect(result.status).toBe(404);
    });
  });

  // Check 3 -- no indexed URL may be reached through the 404 rule.
  describe('sitemap URLs', () => {
    it('lists 89 URLs', () => {
      expect(SITEMAP_PATHS).toHaveLength(89);
    });

    it.each(SITEMAP_PATHS)('serves %s as a 200 static file', (sitemapPath) => {
      const result = resolve(sitemapPath, { rules, staticFiles: PRERENDERED_FILES });
      expect(result).toMatchObject({ status: 200, via: 'static-file' });
    });
  });

  // Check 4 -- the legacy 301 table must not be shadowed by the new fallback.
  describe('legacy redirects', () => {
    it.each([
      ['/grammatik/a1/praesens', '/deutsche-grammatik/a1-niveau-lernen/praesens-gegenwart-deutsch/'],
      ['/grammatik/thema/satzbau', '/deutsche-grammatik/thema/satzbau/'],
      ['/grammatik/thema/satzbau/', '/deutsche-grammatik/thema/satzbau/'],
      ['/grammatik/b1', '/deutsche-grammatik/b1-niveau-lernen/'],
      ['/grammatik', '/deutsche-grammatik/'],
    ])('301s %s to %s', (from, to) => {
      const result = resolve(from, { rules, staticFiles: PRERENDERED_FILES });
      expect(result).toMatchObject({ status: 301, to });
    });
  });

  // Check 5 -- system routes and assets keep their existing behaviour.
  describe('system routes', () => {
    it('proxies /api/* to the Netlify function at 200', () => {
      const result = resolve('/api/exercises', { rules, staticFiles: PRERENDERED_FILES });
      expect(result).toMatchObject({ status: 200, to: '/.netlify/functions/exercises' });
    });

    it.each(['/robots.txt', '/sitemap.xml'])('serves %s at 200 via its forced rule', (route) => {
      const result = resolve(route, { rules, staticFiles: PRERENDERED_FILES });
      expect(result).toMatchObject({ status: 200, via: 'forced-rule' });
    });

    it('serves a hashed build asset as a 200 static file', () => {
      const result = resolve('/assets/index-D4t9kPq2.js', {
        rules,
        staticFiles: PRERENDERED_FILES,
      });
      expect(result).toMatchObject({ status: 200, via: 'static-file' });
    });
  });

  // Check 6 -- the golden "nonexistent" sample.
  describe('unmapped routes', () => {
    it.each([
      '/this-route-does-not-exist-in-the-app',
      '/articles/made-up-article-slug/',
      '/deutsche-grammatik/b1-niveau-lernen/fake-topic/',
      '/pruefungszentren/telc-leipzig/',
    ])('returns 404 for %s', (route) => {
      const result = resolve(route, { rules, staticFiles: PRERENDERED_FILES });
      expect(result).toMatchObject({ status: 404, to: '/index.html' });
    });
  });
});
