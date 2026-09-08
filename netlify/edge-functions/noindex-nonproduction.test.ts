// @vitest-environment node
//
// The repo-wide vitest environment is jsdom (vitest.config.ts), which does not
// implement the Fetch API. These tests are built entirely on `Response` /
// `Headers`, so they must run under Node's globals.

import { describe, it, expect } from 'vitest';
import handler, { isNonProductionHost, withNoindex } from './noindex-nonproduction.js';

// Minimal stand-in for the Netlify edge `Context`; only `next()` is exercised.
const contextReturning = (response: Response) =>
  ({ next: async () => response }) as unknown as Parameters<typeof handler>[1];

const run = (url: string, upstream: Response) =>
  handler(new Request(url), contextReturning(upstream));

describe('isNonProductionHost', () => {
  const nonProduction = [
    'infinitegrammar.netlify.app',
    'deploy-preview-42--infinitegrammar.netlify.app',
    'main--infinitegrammar.netlify.app',
    'INFINITEGRAMMAR.NETLIFY.APP',
    'localhost',
    '127.0.0.1',
    '[::1]',
  ];

  for (const host of nonProduction) {
    it(`flags ${host} as non-production`, () => {
      expect(isNonProductionHost(host)).toBe(true);
    });
  }

  const production = [
    'www.infinitegrammar.de',
    'infinitegrammar.de',
    'WWW.INFINITEGRAMMAR.DE',
  ];

  for (const host of production) {
    it(`treats ${host} as production`, () => {
      expect(isNonProductionHost(host)).toBe(false);
    });
  }

  // The denylist must fail safe: anything it does not recognise is production
  // and is left indexable, rather than being silently noindexed.
  it('treats an unrecognised custom domain as production', () => {
    expect(isNonProductionHost('infinitegrammar.com')).toBe(false);
    expect(isNonProductionHost('shop.infinitegrammar.de')).toBe(false);
  });

  // Guards against a substring match: a host that merely contains the suffix
  // elsewhere is not a Netlify host.
  it('does not match a lookalike host', () => {
    expect(isNonProductionHost('netlify.app.example.com')).toBe(false);
  });
});

describe('withNoindex', () => {
  it('replaces an existing X-Robots-Tag rather than appending to it', async () => {
    const result = withNoindex(
      new Response('body', { headers: { 'X-Robots-Tag': 'all' } })
    );

    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('preserves status, statusText, body and other headers', async () => {
    const result = withNoindex(
      new Response('hello', {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' },
      })
    );

    expect(result.status).toBe(404);
    expect(result.statusText).toBe('Not Found');
    expect(result.headers.get('Content-Type')).toBe('text/html');
    expect(result.headers.get('Cache-Control')).toBe('no-cache');
    expect(await result.text()).toBe('hello');
  });
});

describe('noindex-nonproduction handler', () => {
  it('returns the upstream response untouched on the canonical production host', async () => {
    const upstream = new Response('<html></html>', {
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' },
    });

    const result = await run('https://www.infinitegrammar.de/', upstream);

    // Identity, not just equivalence: the rewrap path must be unreachable here.
    expect(result).toBe(upstream);
    expect(result.headers.get('X-Robots-Tag')).toBeNull();
    expect(result.headers.get('Content-Type')).toBe('text/html');
    expect(result.headers.get('Cache-Control')).toBe('no-cache');
  });

  it('returns the upstream response untouched on the apex production host', async () => {
    const upstream = new Response('<html></html>');
    const result = await run('https://infinitegrammar.de/', upstream);

    expect(result).toBe(upstream);
    expect(result.headers.get('X-Robots-Tag')).toBeNull();
  });

  it('adds noindex on the default netlify.app host, preserving everything else', async () => {
    const upstream = new Response('<html></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' },
    });

    const result = await run('https://infinitegrammar.netlify.app/', upstream);

    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(result.status).toBe(200);
    expect(result.headers.get('Content-Type')).toBe('text/html');
    expect(result.headers.get('Cache-Control')).toBe('no-cache');
    expect(await result.text()).toBe('<html></html>');
  });

  it('adds noindex on Deploy Preview and branch-deploy hosts', async () => {
    for (const url of [
      'https://deploy-preview-42--infinitegrammar.netlify.app/',
      'https://main--infinitegrammar.netlify.app/',
    ]) {
      const result = await run(url, new Response('ok'));
      expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    }
  });

  // trailing-slash.ts returns `Response.redirect(...)`, whose headers are
  // immutable; rewrapping must not throw and must keep the redirect intact.
  it('handles an immutable redirect response from an upstream edge function', async () => {
    const upstream = Response.redirect(
      'https://infinitegrammar.netlify.app/deutsche-grammatik/b1-niveau-lernen/',
      301
    );

    const result = await run(
      'https://infinitegrammar.netlify.app/deutsche-grammatik/b1-niveau-lernen',
      upstream
    );

    expect(result.status).toBe(301);
    expect(result.headers.get('Location')).toBe(
      'https://infinitegrammar.netlify.app/deutsche-grammatik/b1-niveau-lernen/'
    );
    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('handles a null-body status without throwing', async () => {
    const result = await run(
      'https://infinitegrammar.netlify.app/assets/app.js',
      new Response(null, { status: 304 })
    );

    expect(result.status).toBe(304);
    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('replaces an upstream X-Robots-Tag instead of appending', async () => {
    const result = await run(
      'https://infinitegrammar.netlify.app/',
      new Response('ok', { headers: { 'X-Robots-Tag': 'index, follow' } })
    );

    expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
