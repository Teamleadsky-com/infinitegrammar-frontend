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
 * Returns true when `pathToCheck` is disallowed by any of the group's Disallow
 * directives, using robots.txt prefix-match semantics.
 */
function isDisallowed(group, pathToCheck) {
  if (!group) return false;
  return group.disallow.some((rule) => rule !== '' && pathToCheck.startsWith(rule));
}

const robotsContents = fs.readFileSync(ROBOTS_TXT_PATH, 'utf-8');
const groups = parseRobotsTxt(robotsContents);

// The user-agent groups that are expected to gate private routes.
const CRAWLER_AGENTS = ['Googlebot', 'Bingbot', '*'];

// The documented private-route inventory (APP_FUNCTIONAL) that must be kept out
// of the crawl surface. Mirrors the private routes named in the SEO post-mortem
// article and classified APP_FUNCTIONAL in config/seo-route-classes.json.
const PRIVATE_ROUTES = ['/admin', '/auth', '/profile', '/statistics', '/verify-magic-link'];

// Representative SEO_DRIVER routes that must never be disallowed. Guards against
// an over-broad Disallow rule silently blocking valid ranking pages.
const SEO_DRIVER_ROUTES = [
  '/',
  '/deutsche-grammatik/b1-niveau-lernen',
  '/articles/why-infinitegrammar-focuses-on-exam-grammar',
  '/pruefungszentren/telc-berlin',
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
