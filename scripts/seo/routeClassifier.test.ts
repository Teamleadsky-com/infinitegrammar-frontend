import { describe, it, expect } from 'vitest';
import {
  classify,
  classifyRoute,
  normalizePath,
  loadRouteConfig,
  FALLBACK_CLASS,
} from './routeClassifier.js';

describe('routeClassifier', () => {
  describe('normalizePath', () => {
    it('keeps the root path as "/"', () => {
      expect(normalizePath('/')).toBe('/');
    });

    it('strips a trailing slash from non-root paths', () => {
      expect(normalizePath('/exercise/')).toBe('/exercise');
    });

    it('strips query strings', () => {
      expect(normalizePath('/exercise?level=b2&topic=verben')).toBe('/exercise');
    });

    it('strips hash fragments', () => {
      expect(normalizePath('/deutsche-grammatik#section')).toBe('/deutsche-grammatik');
    });

    it('strips both query strings and hash fragments together', () => {
      expect(normalizePath('/exercise/?level=b2#top')).toBe('/exercise');
    });

    it('extracts the pathname from a full URL', () => {
      expect(normalizePath('https://www.infinitegrammar.de/articles/some-slug/')).toBe(
        '/articles/some-slug'
      );
    });

    it('collapses duplicate slashes', () => {
      expect(normalizePath('/articles//some-slug')).toBe('/articles/some-slug');
    });

    it('adds a leading slash when missing', () => {
      expect(normalizePath('exercise')).toBe('/exercise');
    });

    it('throws for empty input', () => {
      expect(() => normalizePath('')).toThrow(TypeError);
    });
  });

  describe('classify - exact matching', () => {
    it('classifies the homepage as SEO_DRIVER', () => {
      const result = classify('/');
      expect(result.class).toBe('SEO_DRIVER');
      expect(result.matchedRule?.type).toBe('exact');
    });

    it('classifies /exercise as APP_FUNCTIONAL', () => {
      expect(classifyRoute('/exercise')).toBe('APP_FUNCTIONAL');
    });

    it('classifies /admin as APP_FUNCTIONAL', () => {
      expect(classifyRoute('/admin')).toBe('APP_FUNCTIONAL');
    });

    it('classifies /robots.txt as SYSTEM', () => {
      expect(classifyRoute('/robots.txt')).toBe('SYSTEM');
    });

    it('classifies /sitemap.xml as SYSTEM', () => {
      expect(classifyRoute('/sitemap.xml')).toBe('SYSTEM');
    });

    it('normalizes trailing slash and query strings before exact matching', () => {
      expect(classifyRoute('/exercise/?level=b2')).toBe('APP_FUNCTIONAL');
    });
  });

  describe('classify - wildcard matching', () => {
    it('classifies an article page as SEO_DRIVER', () => {
      expect(classifyRoute('/articles/some-article-slug')).toBe('SEO_DRIVER');
    });

    it('classifies a testing-centre city page as SEO_DRIVER', () => {
      expect(classifyRoute('/pruefungszentren/berlin')).toBe('SEO_DRIVER');
    });

    it('classifies a grammar level page as SEO_DRIVER', () => {
      expect(classifyRoute('/deutsche-grammatik/b1-niveau-lernen')).toBe('SEO_DRIVER');
    });

    it('classifies a grammar content (level/slug) page as SEO_DRIVER', () => {
      expect(classifyRoute('/deutsche-grammatik/b1-niveau-lernen/relativsaetze')).toBe(
        'SEO_DRIVER'
      );
    });

    it('classifies an admin sub-route as APP_FUNCTIONAL', () => {
      expect(classifyRoute('/admin/section-clustering')).toBe('APP_FUNCTIONAL');
    });

    it('classifies an /api/* route as SYSTEM', () => {
      expect(classifyRoute('/api/exercises')).toBe('SYSTEM');
    });
  });

  describe('classify - precedence', () => {
    it('prefers the more specific /deutsche-grammatik/thema/* wildcard over the general /deutsche-grammatik/* wildcard', () => {
      const result = classify('/deutsche-grammatik/thema/verben');
      expect(result.class).toBe('SEO_DRIVER');
      expect(result.matchedRule?.pattern).toBe('/deutsche-grammatik/thema/*');
    });

    it('prefers an exact rule over a wildcard rule for the same path', () => {
      const result = classify('/deutsche-grammatik');
      expect(result.matchedRule?.type).toBe('exact');
      expect(result.matchedRule?.path).toBe('/deutsche-grammatik');
    });

    it('prefers the first matching exact rule when config is passed explicitly', () => {
      const config = loadRouteConfig();
      const result = classify('/exercise', { config });
      expect(result.class).toBe('APP_FUNCTIONAL');
    });
  });

  describe('classify - UNKNOWN fallback', () => {
    it('returns UNKNOWN for an unmatched, non-existent route', () => {
      const result = classify('/this-route-does-not-exist-anywhere');
      expect(result.class).toBe(FALLBACK_CLASS);
      expect(result.matchedRule).toBeNull();
    });

    it('returns UNKNOWN rather than guessing indexability for an unlisted route', () => {
      expect(classifyRoute('/some/deeply/nested/unmapped/path')).toBe('UNKNOWN');
    });
  });

  describe('loadRouteConfig', () => {
    it('loads a config that declares only the documented classes', () => {
      const config = loadRouteConfig();
      expect(config.classes).toEqual(
        expect.arrayContaining(['SEO_DRIVER', 'APP_FUNCTIONAL', 'SYSTEM'])
      );
    });

    it('every exact and wildcard rule references a declared class', () => {
      const config = loadRouteConfig();
      const validClasses = new Set(config.classes);
      for (const rule of [...config.exactRules, ...config.wildcardRules]) {
        expect(validClasses.has(rule.class)).toBe(true);
      }
    });

    it('declares the fallback class UNKNOWN explicitly, not just as a fallback reference', () => {
      const config = loadRouteConfig();
      expect(config.classes).toContain(config.fallbackClass);
      expect(config.classes).toContain('UNKNOWN');
    });
  });
});
