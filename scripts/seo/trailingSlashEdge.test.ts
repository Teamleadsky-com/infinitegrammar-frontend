// @vitest-environment node
/**
 * Behavioural cover for netlify/edge-functions/trailing-slash.ts.
 *
 * The edge function is the only place that can consolidate host *and* trailing
 * slash in a single 301: netlify.toml's apex rules carry the path verbatim
 * through :splat and therefore cannot add the slash, while the edge function
 * used to copy the request host verbatim and therefore could not change the
 * host. Either alone leaves two 301 hops between host variants of one
 * canonical; this suite pins the one-hop behaviour.
 *
 * The `node` environment pragma is required: the handler calls
 * Response.redirect, which jsdom does not provide.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler, { CANONICAL_ROUTES } from '../../netlify/edge-functions/trailing-slash.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

/** Sentinel returned by the context stub, so "passed through" is observable. */
const NEXT = Symbol('context.next()');

// Only next() is exercised; the rest of the Netlify Context surface is unused
// by the handler.
const context = { next: () => NEXT } as never;

async function run(url: string) {
  return handler(new Request(url), context);
}

async function expectRedirect(from: string, to: string) {
  const response = (await run(from)) as Response;
  expect(response.status).toBe(301);
  expect(response.headers.get('location')).toBe(to);
}

describe('trailing-slash edge function', () => {
  describe('host consolidation', () => {
    it('consolidates apex + missing slash in ONE hop', async () => {
      await expectRedirect(
        'https://infinitegrammar.de/pruefungszentren/telc-koeln',
        'https://www.infinitegrammar.de/pruefungszentren/telc-koeln/'
      );
    });

    it('upgrades http apex to https www in ONE hop', async () => {
      await expectRedirect(
        'http://infinitegrammar.de/deutsche-grammatik/a1-niveau-lernen/pluralbildung-plural-deutsch-lernen',
        'https://www.infinitegrammar.de/deutsche-grammatik/a1-niveau-lernen/pluralbildung-plural-deutsch-lernen/'
      );
    });

    it('adds the slash on the canonical host without changing it', async () => {
      await expectRedirect(
        'https://www.infinitegrammar.de/articles/react-spa-seo-postmortem',
        'https://www.infinitegrammar.de/articles/react-spa-seo-postmortem/'
      );
    });

    it('preserves the query string while consolidating', async () => {
      await expectRedirect(
        'https://infinitegrammar.de/pruefungszentren/telc-koeln?utm_source=x',
        'https://www.infinitegrammar.de/pruefungszentren/telc-koeln/?utm_source=x'
      );
    });

    // Guard against the obvious wrong implementation -- hardcoding the canonical
    // host unconditionally would bounce every deploy preview to production and
    // make preview testing impossible. Do not weaken this case.
    it('keeps deploy previews on their own host', async () => {
      await expectRedirect(
        'https://deploy-preview-42--infinitegrammar.netlify.app/pruefungszentren/telc-koeln',
        'https://deploy-preview-42--infinitegrammar.netlify.app/pruefungszentren/telc-koeln/'
      );
    });
  });

  describe('pass-through', () => {
    it('passes a slash-terminated path to context.next()', async () => {
      expect(await run('https://infinitegrammar.de/articles/')).toBe(NEXT);
    });

    it('passes an unknown slash-less path to context.next()', async () => {
      expect(await run('https://www.infinitegrammar.de/assets/index-D4t9kPq2.js')).toBe(NEXT);
    });
  });

  describe('route set', () => {
    it('matches public/sitemap.xml exactly, minus the root path', () => {
      const sitemapPaths = [
        ...fs
          .readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf-8')
          .matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((match) => new URL(match[1]).pathname);

      expect(sitemapPaths).toHaveLength(89);
      expect(CANONICAL_ROUTES.size).toBe(88);
      expect([...CANONICAL_ROUTES].sort()).toEqual(
        sitemapPaths.filter((p) => p !== '/').sort()
      );
    });
  });
});
