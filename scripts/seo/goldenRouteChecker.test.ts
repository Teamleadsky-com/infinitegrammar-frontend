import { describe, it, expect } from 'vitest';
import {
  loadGoldenRoutes,
  validateGoldenConfig,
  validateSample,
  checkAgreement,
  checkSample,
  checkGoldenRoutes,
} from './goldenRouteChecker.js';

function findSample(config, id) {
  const sample = config.samples.find((s) => s.id === id);
  if (!sample) throw new Error(`Fixture error: no golden sample with id "${id}"`);
  return sample;
}

describe('goldenRouteChecker', () => {
  describe('golden-file schema validation', () => {
    it('loads the version-controlled golden-route file without throwing', () => {
      expect(() => loadGoldenRoutes()).not.toThrow();
    });

    it('every sample has a stable id, path, expectedClass, and expectations object', () => {
      const config = loadGoldenRoutes();
      for (const sample of config.samples) {
        expect(typeof sample.id).toBe('string');
        expect(sample.id.length).toBeGreaterThan(0);
        expect(typeof sample.path).toBe('string');
        expect(typeof sample.expectedClass).toBe('string');
        expect(typeof sample.expectations).toBe('object');
      }
    });

    it('rejects a config whose samples array is empty', () => {
      expect(() => validateGoldenConfig({ samples: [] })).toThrow(/non-empty array/);
    });

    it('rejects duplicate sample ids', () => {
      const dupe = {
        samples: [
          { id: 'dup', path: '/', expectedClass: 'SEO_DRIVER', expectations: {} },
          { id: 'dup', path: '/other', expectedClass: 'SEO_DRIVER', expectations: {} },
        ],
      };
      expect(() => validateGoldenConfig(dupe)).toThrow(/duplicate sample id/);
    });
  });

  describe('presence of all required representative route categories', () => {
    it('declares every category required by the PILOT-002 golden-route contract', () => {
      const config = loadGoldenRoutes();
      const requiredCategories = [
        'homepage',
        'grammar',
        'article',
        'testing-centre',
        'exercise',
        'exercise-statistics',
        'auth-account',
        'robots-txt',
        'sitemap',
        'redirect',
        'api-system',
        'nonexistent',
      ];
      const presentCategories = new Set(config.samples.map((s) => s.category));
      for (const category of requiredCategories) {
        expect(presentCategories.has(category)).toBe(true);
      }
    });

    it('rejects a config missing a category listed in requiredCategories', () => {
      const incomplete = {
        requiredCategories: ['homepage', 'article'],
        samples: [{ id: 'home', category: 'homepage', path: '/', expectedClass: 'SEO_DRIVER', expectations: {} }],
      };
      expect(() => validateGoldenConfig(incomplete)).toThrow(/missing required categories/);
    });
  });

  describe('agreement between golden samples and the Stage 1 classifier', () => {
    it('every non-UNKNOWN sample agrees with routeClassifier.classify()', () => {
      const config = loadGoldenRoutes();
      for (const sample of config.samples) {
        const agreement = checkAgreement(sample);
        expect(agreement.agrees).toBe(true);
      }
    });

    it('the nonexistent-route sample genuinely resolves to UNKNOWN via the classifier', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'nonexistent-route');
      const agreement = checkAgreement(sample);
      expect(agreement.actualClass).toBe('UNKNOWN');
      expect(agreement.agrees).toBe(true);
    });

    it('reports disagreement as a failed check rather than throwing', () => {
      const mismatched = { id: 'mismatch', path: '/exercise', expectedClass: 'SEO_DRIVER', expectations: {} };
      const result = checkSample(mismatched, { status: 200 });
      // checkSample alone does not re-verify agreement -- checkGoldenRoutes does.
      const results = checkGoldenRoutes(
        {},
        { goldenConfig: { samples: [mismatched] } }
      );
      expect(results[0].status).toBe('failed');
      expect(results[0].failures[0]).toMatch(/classifier resolved "APP_FUNCTIONAL"/);
      expect(result.status).toBe('passed'); // sanity: checkSample itself just matches the (empty) expectations
    });
  });

  describe('SEO_DRIVER response checks', () => {
    it('passes a fully compliant SEO_DRIVER response', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'homepage');
      const response = {
        status: 200,
        indexable: true,
        canonical: 'https://www.infinitegrammar.de/',
        title: 'InfiniteGrammar – Deutsche Grammatik üben',
        metaDescription: 'Practice German grammar with adaptive cloze exercises for every level.',
        h1Count: 1,
        visibleTextLength: 500,
        sitemapIncluded: true,
        internalLinkPresent: true,
      };
      const result = checkSample(sample, response);
      expect(result.status).toBe('passed');
    });

    it('fails an SEO_DRIVER response missing a title and H1', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'homepage');
      const response = {
        status: 200,
        indexable: true,
        canonical: 'https://www.infinitegrammar.de/',
        title: '',
        metaDescription: 'Practice German grammar with adaptive cloze exercises for every level.',
        h1Count: 0,
        visibleTextLength: 500,
        sitemapIncluded: true,
        internalLinkPresent: true,
      };
      const result = checkSample(sample, response);
      expect(result.status).toBe('failed');
      expect(result.failures.some((f) => f.includes('title'))).toBe(true);
      expect(result.failures.some((f) => f.includes('H1'))).toBe(true);
    });
  });

  describe('APP_FUNCTIONAL is not subjected to general ranking-content checks', () => {
    it('passes an APP_FUNCTIONAL response with no title, description, H1, or canonical at all', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'exercise-route');
      // Deliberately omit title/metaDescription/h1Count/canonical/visibleTextLength --
      // exercise-route's expectations only declare status and sitemapIncluded.
      const response = { status: 200, sitemapIncluded: false };
      const result = checkSample(sample, response);
      expect(result.status).toBe('passed');
    });

    it('fails an APP_FUNCTIONAL response only when a declared expectation (sitemap exclusion) is violated', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'exercise-route');
      const response = { status: 200, sitemapIncluded: true };
      const result = checkSample(sample, response);
      expect(result.status).toBe('failed');
      expect(result.failures[0]).toMatch(/sitemapIncluded/);
    });
  });

  describe('SYSTEM route-specific validation', () => {
    it('passes a robots.txt response with a matching status and content type', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'robots-txt');
      const result = checkSample(sample, { status: 200, contentType: 'text/plain; charset=utf-8' });
      expect(result.status).toBe('passed');
    });

    it('passes a legacy redirect response with the expected status and target', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'legacy-grammatik-redirect');
      const result = checkSample(sample, { status: 301, redirectTo: '/deutsche-grammatik/' });
      expect(result.status).toBe('passed');
    });

    it('fails a legacy redirect response pointing at the wrong target', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'legacy-grammatik-redirect');
      const result = checkSample(sample, { status: 301, redirectTo: '/wrong-target/' });
      expect(result.status).toBe('failed');
      expect(result.failures[0]).toMatch(/redirectTo/);
    });
  });

  describe('rejection of UNKNOWN', () => {
    it('rejects the nonexistent-route (UNKNOWN) sample instead of passing or failing it', () => {
      const config = loadGoldenRoutes();
      const sample = findSample(config, 'nonexistent-route');
      const result = checkSample(sample, { status: 200 });
      expect(result.status).toBe('rejected');
    });

    it('throws when a non-UNKNOWN-labeled sample nonetheless declares expectations while typed UNKNOWN', () => {
      const bad = { id: 'bad-unknown', path: '/whatever', expectedClass: 'UNKNOWN', expectations: { status: 200 } };
      expect(() => validateSample(bad)).toThrow(/must not declare any SEO expectations/);
    });
  });

  describe('rejection of malformed expectations', () => {
    it('throws when a sample is missing an id', () => {
      expect(() =>
        validateSample({ path: '/', expectedClass: 'SEO_DRIVER', expectations: {} })
      ).toThrow(/missing or empty "id"/);
    });

    it('throws when expectations is not an object', () => {
      expect(() =>
        validateSample({ id: 'x', path: '/', expectedClass: 'SEO_DRIVER', expectations: 'nope' })
      ).toThrow(/"expectations" must be an object/);
    });

    it('throws when an expectation key is not valid for the declared class', () => {
      expect(() =>
        validateSample({
          id: 'x',
          path: '/exercise',
          expectedClass: 'APP_FUNCTIONAL',
          expectations: { minVisibleTextLength: 200 },
        })
      ).toThrow(/not valid for class APP_FUNCTIONAL/);
    });

    it('throws for an unsupported expectedClass', () => {
      expect(() =>
        validateSample({ id: 'x', path: '/', expectedClass: 'RANKING_SUPREME', expectations: {} })
      ).toThrow(/unsupported expectedClass/);
    });
  });

  describe('rejection of contradictory expectations', () => {
    it('throws when indexable and robotsDisallowed are both true', () => {
      expect(() =>
        validateSample({
          id: 'x',
          path: '/auth',
          expectedClass: 'APP_FUNCTIONAL',
          expectations: { indexable: true, robotsDisallowed: true },
        })
      ).toThrow(/cannot both be true/);
    });

    it('throws when sitemapIncluded and robotsDisallowed are both true', () => {
      expect(() =>
        validateSample({
          id: 'x',
          path: '/auth',
          expectedClass: 'APP_FUNCTIONAL',
          expectations: { sitemapIncluded: true, robotsDisallowed: true },
        })
      ).toThrow(/cannot both be true/);
    });

    it('throws when redirectTo is set alongside a non-redirect status', () => {
      expect(() =>
        validateSample({
          id: 'x',
          path: '/grammatik',
          expectedClass: 'SYSTEM',
          expectations: { status: 200, redirectTo: '/deutsche-grammatik/' },
        })
      ).toThrow(/non-redirect status/);
    });

    it('throws when a redirect status is declared without redirectTo', () => {
      expect(() =>
        validateSample({
          id: 'x',
          path: '/grammatik',
          expectedClass: 'SYSTEM',
          expectations: { status: 301 },
        })
      ).toThrow(/without "redirectTo"/);
    });
  });

  describe('checkGoldenRoutes end-to-end over the real golden-route file', () => {
    it('reports missing for every sample when no response fixtures are supplied, except UNKNOWN which reports rejected', () => {
      const results = checkGoldenRoutes({});
      for (const result of results) {
        if (result.id === 'nonexistent-route') {
          expect(result.status).toBe('rejected');
        } else {
          expect(result.status).toBe('missing');
        }
      }
    });
  });
});
