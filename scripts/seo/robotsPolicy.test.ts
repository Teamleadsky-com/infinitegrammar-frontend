import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyRoute } from './routeClassifier.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROBOTS_TXT_PATH = path.resolve(__dirname, '../../public/robots.txt');

/**
 * Parses robots.txt into a map of user-agent -> { disallow: string[], allow: string[] }.
 *
 * Consecutive `User-agent:` lines share the directives that follow them (per the
 * robots.txt spec), so a directive is attributed to every user-agent in the
 * current group. Comments and the standalone `Sitemap:` line are ignored.
 */
function parseRobotsTxt(contents) {
  const groups = new Map();
  let currentAgents = [];
  let expectingAgents = false;

  for (const rawLine of contents.split('\n')) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (line === '') continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const field = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();

    if (field === 'user-agent') {
      if (!expectingAgents) {
        // Start of a new group.
        currentAgents = [];
      }
      currentAgents.push(value);
      if (!groups.has(value)) groups.set(value, { disallow: [], allow: [] });
      expectingAgents = true;
      continue;
    }

    expectingAgents = false;

    if (field === 'disallow') {
      for (const agent of currentAgents) groups.get(agent).disallow.push(value);
    } else if (field === 'allow') {
      for (const agent of currentAgents) groups.get(agent).allow.push(value);
    }
    // Sitemap and any other fields are intentionally ignored.
  }

  return groups;
}

/**
 * Matches a single robots.txt pattern against a path (plus query string) using
 * Google's documented semantics: patterns are anchored at the start of the
 * path, `*` matches any sequence of characters, and a trailing `$` anchors the
 * end. Without `$` the match is open-ended, which makes a pattern without
 * wildcards behave as a plain prefix match.
 *
 * The plain `startsWith` matcher this replaces could not evaluate the parameter
 * crawl policy at all — `/*?*utm_` would have been read as a literal prefix and
 * matched nothing.
 */
function robotsPatternMatches(pattern, pathToCheck) {
  if (pattern === '') return false;

  let source = pattern;
  let anchorEnd = false;
  if (source.endsWith('$')) {
    anchorEnd = true;
    source = source.slice(0, -1);
  }

  // Split on `*` so the wildcard survives, then escape every other regex
  // metacharacter in the literal segments.
  const body = source
    .split('*')
    .map((segment) => segment.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');

  return new RegExp(`^${body}${anchorEnd ? '$' : ''}`).test(pathToCheck);
}

/**
 * Returns true when `pathToCheck` is disallowed by any of the group's Disallow
 * directives, using robots.txt wildcard-match semantics.
 */
function isDisallowed(group, pathToCheck) {
  if (!group) return false;
  return group.disallow.some((rule) => robotsPatternMatches(rule, pathToCheck));
}

const robotsContents = fs.readFileSync(ROBOTS_TXT_PATH, 'utf-8');
const groups = parseRobotsTxt(robotsContents);

const SITEMAP_XML_PATH = path.resolve(__dirname, '../../public/sitemap.xml');

// The user-agent groups that are expected to gate private routes.
const CRAWLER_AGENTS = ['Googlebot', 'Bingbot', '*'];

// The documented private-route inventory (APP_FUNCTIONAL) that must be kept out
// of the crawl surface. Covers both the private routes named in the SEO
// post-mortem article and the parameterized app surface (`/exercise`, whose
// level/section/grammar/t query params generate an unbounded set of 200-status
// URLs). All entries are classified APP_FUNCTIONAL in
// config/seo-route-classes.json. `/email-preferences` and `/exercise-stats` each
// carry their own Disallow directive rather than relying on prefix-match spill
// from another rule, so their crawl treatment is declared rather than incidental.
const PRIVATE_ROUTES = [
  '/admin',
  '/auth',
  '/email-preferences',
  '/exercise',
  '/exercise-stats',
  '/profile',
  '/statistics',
  '/verify-magic-link',
];

// Representative SEO_DRIVER routes that must never be disallowed. Guards against
// an over-broad Disallow rule silently blocking valid ranking pages.
const SEO_DRIVER_ROUTES = [
  '/',
  '/deutsche-grammatik/b1-niveau-lernen',
  '/articles/why-infinitegrammar-focuses-on-exam-grammar',
  '/pruefungszentren/telc-berlin',
];

// Social preview fetchers are deliberately left at `Allow: /` with no Disallow
// directives: shared links routinely carry utm_* parameters, so applying the
// parameter policy to these agents would break link previews for exactly the
// URLs people share.
const SOCIAL_AGENTS = [
  'Twitterbot',
  'facebookexternalhit',
  'LinkedInBot',
  'Slackbot',
  'WhatsApp',
  'PinterestBot',
  'TelegramBot',
];

// One representative URL per parameter family named in the crawl policy. Each
// is a clean SEO_DRIVER path carrying a non-canonical parameter, so a failure
// here means the policy stopped covering that family rather than that the
// underlying page became private.
const PARAMETER_URLS = [
  {
    family: 'tracking',
    url: '/deutsche-grammatik/b1-niveau-lernen/?utm_source=email&utm_medium=campaign',
  },
  { family: 'tracking', url: '/articles/why-infinitegrammar-focuses-on-exam-grammar/?fbclid=abc123' },
  { family: 'tracking', url: '/?gclid=Cj0KCQ' },
  // The campaign deep link shape generated by netlify/functions/campaign-processor.ts.
  { family: 'session', url: '/exercise?level=B1&section=Verben&utm_source=email&t=tok123' },
  { family: 'session', url: '/pruefungszentren/telc-berlin/?token=tok123' },
  { family: 'session', url: '/?sid=abc' },
  { family: 'calendar', url: '/pruefungszentren/telc-berlin/?month=2026-03' },
  { family: 'calendar', url: '/pruefungszentren/?date=2026-03-01&view=week' },
  { family: 'calendar', url: '/?year=2026' },
];

describe('robots.txt private-route policy', () => {
  it('parses a Disallow group for every gating crawler user-agent', () => {
    for (const agent of CRAWLER_AGENTS) {
      expect(groups.has(agent)).toBe(true);
    }
  });

  describe('every documented private route is disallowed for each crawler', () => {
    for (const agent of CRAWLER_AGENTS) {
      for (const route of PRIVATE_ROUTES) {
        it(`disallows ${route} for ${agent}`, () => {
          expect(isDisallowed(groups.get(agent), route)).toBe(true);
        });
      }
    }
  });

  describe('every asserted private route is genuinely APP_FUNCTIONAL', () => {
    for (const route of PRIVATE_ROUTES) {
      it(`classifies ${route} as APP_FUNCTIONAL`, () => {
        expect(classifyRoute(route)).toBe('APP_FUNCTIONAL');
      });
    }
  });

  describe('no SEO-driver route is disallowed (over-block guard)', () => {
    for (const agent of CRAWLER_AGENTS) {
      for (const route of SEO_DRIVER_ROUTES) {
        it(`allows ${route} for ${agent}`, () => {
          expect(classifyRoute(route)).toBe('SEO_DRIVER');
          expect(isDisallowed(groups.get(agent), route)).toBe(false);
        });
      }
    }
  });
});

describe('robots.txt wildcard pattern semantics', () => {
  it('treats a wildcard-free pattern as a plain prefix match', () => {
    expect(robotsPatternMatches('/exercise', '/exercise')).toBe(true);
    expect(robotsPatternMatches('/exercise', '/exercise-stats')).toBe(true);
    expect(robotsPatternMatches('/exercise', '/deutsche-grammatik/')).toBe(false);
  });

  it('expands `*` to any sequence of characters', () => {
    expect(robotsPatternMatches('/*?*utm_', '/articles/foo/?a=1&utm_source=x')).toBe(true);
    expect(robotsPatternMatches('/*?*utm_', '/articles/foo/')).toBe(false);
  });

  it('anchors the end of the path on a trailing `$`', () => {
    expect(robotsPatternMatches('/*.pdf$', '/files/guide.pdf')).toBe(true);
    expect(robotsPatternMatches('/*.pdf$', '/files/guide.pdf.html')).toBe(false);
  });

  it('never matches an empty pattern', () => {
    expect(robotsPatternMatches('', '/anything')).toBe(false);
  });

  // The reason short parameter names are declared as `/*?t=` + `/*&t=` rather
  // than `/*?*t=`: the latter would also match `?format=1`, silently blocking an
  // unrelated future parameter.
  it('does not let a short parameter name match a longer one', () => {
    expect(robotsPatternMatches('/*?t=', '/x/?format=1')).toBe(false);
    expect(robotsPatternMatches('/*&t=', '/x/?a=1&format=2')).toBe(false);
    expect(robotsPatternMatches('/*?t=', '/x/?t=tok')).toBe(true);
    expect(robotsPatternMatches('/*&t=', '/x/?a=1&t=tok')).toBe(true);
  });
});

describe('robots.txt parameter crawl policy', () => {
  describe('every declared parameter family is disallowed for each crawler', () => {
    for (const agent of CRAWLER_AGENTS) {
      for (const { family, url } of PARAMETER_URLS) {
        it(`disallows ${family} URL ${url} for ${agent}`, () => {
          expect(isDisallowed(groups.get(agent), url)).toBe(true);
        });
      }
    }
  });

  describe('social preview crawlers carry no Disallow directives', () => {
    for (const agent of SOCIAL_AGENTS) {
      it(`leaves ${agent} unrestricted`, () => {
        const group = groups.get(agent);
        expect(group).toBeDefined();
        expect(group.disallow.filter((rule) => rule !== '')).toEqual([]);
      });
    }

    it('still allows a shared, utm-tagged article URL for Twitterbot', () => {
      const taggedArticle =
        '/articles/why-infinitegrammar-focuses-on-exam-grammar/?utm_source=twitter';
      expect(isDisallowed(groups.get('Twitterbot'), taggedArticle)).toBe(false);
    });
  });

  it('keeps the sitemap free of query-string URLs', () => {
    const sitemapContents = fs.readFileSync(SITEMAP_XML_PATH, 'utf-8');
    const locations = [...sitemapContents.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

    expect(locations.length).toBeGreaterThan(0);
    expect(locations.filter((loc) => loc.includes('?'))).toEqual([]);
  });
});
