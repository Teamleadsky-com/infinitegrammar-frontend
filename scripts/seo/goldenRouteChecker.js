/**
 * Deterministic golden-route checker.
 *
 * Loads the version-controlled golden-route sample set
 * (config/seo-golden-routes.json), confirms each sample agrees with the
 * Stage 1 route classifier (scripts/seo/routeClassifier.js), and applies
 * only the checks valid for a sample's declared route class against an
 * injected response object. Never contacts a live deployment -- callers
 * supply response fixtures (from a build, a mock, or a future live fetch).
 *
 * Usage: node scripts/seo/goldenRouteChecker.js
 * (loads the default golden-route file and reports schema/agreement validity)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { classify } from './routeClassifier.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_GOLDEN_PATH = path.resolve(__dirname, '../../config/seo-golden-routes.json');

// Expectation keys a sample is allowed to declare for its route class.
// Keeping this whitelist explicit is what lets us "reject contradictory
// expectations" and "apply only expectations valid for that class" --
// an expectation key outside this list for a given class is a malformed
// sample, not a lenient no-op.
const ALLOWED_EXPECTATIONS = {
  SEO_DRIVER: [
    'status',
    'indexable',
    'canonical',
    'title',
    'metaDescription',
    'h1Count',
    'minVisibleTextLength',
    'sitemapIncluded',
    'internalLinkPresent',
  ],
  APP_FUNCTIONAL: [
    'status',
    'sitemapIncluded',
    'robotsDisallowed',
    'indexable',
    'title',
    'metaDescription',
    'h1Count',
    'canonical',
  ],
  SYSTEM: ['status', 'contentType', 'redirectTo'],
};

let cachedGolden = null;
let cachedGoldenPath = null;

/**
 * Loads and validates the golden-route configuration from disk.
 * Results are cached per configPath; pass { fresh: true } to bypass the cache.
 */
export function loadGoldenRoutes(configPath = DEFAULT_GOLDEN_PATH, { fresh = false } = {}) {
  if (!fresh && cachedGolden && cachedGoldenPath === configPath) {
    return cachedGolden;
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw);
  validateGoldenConfig(parsed);

  cachedGolden = parsed;
  cachedGoldenPath = configPath;
  return parsed;
}

/**
 * Validates the top-level golden-route file: required categories are all
 * represented, sample ids are unique, and every sample is individually valid.
 */
export function validateGoldenConfig(goldenConfig) {
  if (!goldenConfig || typeof goldenConfig !== 'object') {
    throw new Error('Invalid golden-route config: root value must be an object');
  }
  if (!Array.isArray(goldenConfig.samples) || goldenConfig.samples.length === 0) {
    throw new Error('Invalid golden-route config: "samples" must be a non-empty array');
  }

  const seenIds = new Set();
  for (const sample of goldenConfig.samples) {
    validateSample(sample);
    if (seenIds.has(sample.id)) {
      throw new Error(`Invalid golden-route config: duplicate sample id "${sample.id}"`);
    }
    seenIds.add(sample.id);
  }

  if (Array.isArray(goldenConfig.requiredCategories)) {
    const presentCategories = new Set(goldenConfig.samples.map((s) => s.category));
    const missing = goldenConfig.requiredCategories.filter((c) => !presentCategories.has(c));
    if (missing.length > 0) {
      throw new Error(
        `Invalid golden-route config: missing required categories: ${missing.join(', ')}`
      );
    }
  }

  return goldenConfig;
}

/**
 * Validates a single golden-route sample: required fields, only-valid
 * expectation keys for its declared class, and no internally contradictory
 * expectations. Throws on any malformed or contradictory sample.
 */
export function validateSample(sample) {
  if (!sample || typeof sample !== 'object' || Array.isArray(sample)) {
    throw new Error('Malformed golden sample: sample must be an object');
  }
  if (typeof sample.id !== 'string' || sample.id.length === 0) {
    throw new Error('Malformed golden sample: missing or empty "id"');
  }
  if (typeof sample.path !== 'string' || sample.path.length === 0) {
    throw new Error(`Malformed golden sample "${sample.id}": missing or empty "path"`);
  }
  if (typeof sample.expectedClass !== 'string' || sample.expectedClass.length === 0) {
    throw new Error(`Malformed golden sample "${sample.id}": missing or empty "expectedClass"`);
  }
  if (
    sample.expectations === null ||
    typeof sample.expectations !== 'object' ||
    Array.isArray(sample.expectations)
  ) {
    throw new Error(`Malformed golden sample "${sample.id}": "expectations" must be an object`);
  }

  if (sample.expectedClass === 'UNKNOWN') {
    if (Object.keys(sample.expectations).length > 0) {
      throw new Error(
        `Invalid golden sample "${sample.id}": UNKNOWN samples must not declare any SEO expectations`
      );
    }
    return;
  }

  const allowedKeys = ALLOWED_EXPECTATIONS[sample.expectedClass];
  if (!allowedKeys) {
    throw new Error(
      `Invalid golden sample "${sample.id}": unsupported expectedClass "${sample.expectedClass}"`
    );
  }
  for (const key of Object.keys(sample.expectations)) {
    if (!allowedKeys.includes(key)) {
      throw new Error(
        `Invalid golden sample "${sample.id}": expectation "${key}" is not valid for class ${sample.expectedClass}`
      );
    }
  }

  const exp = sample.expectations;
  if (exp.robotsDisallowed === true && exp.indexable === true) {
    throw new Error(
      `Contradictory golden sample "${sample.id}": "robotsDisallowed" and "indexable" cannot both be true`
    );
  }
  if (exp.robotsDisallowed === true && exp.sitemapIncluded === true) {
    throw new Error(
      `Contradictory golden sample "${sample.id}": "robotsDisallowed" and "sitemapIncluded" cannot both be true`
    );
  }
  if (typeof exp.redirectTo === 'string' && typeof exp.status === 'number' && exp.status < 300) {
    throw new Error(
      `Contradictory golden sample "${sample.id}": "redirectTo" set with non-redirect status ${exp.status}`
    );
  }
  if ((exp.status === 301 || exp.status === 302) && typeof exp.redirectTo !== 'string') {
    throw new Error(
      `Contradictory golden sample "${sample.id}": redirect status ${exp.status} declared without "redirectTo"`
    );
  }
}

/**
 * Confirms a sample's declared expectedClass agrees with what the Stage 1
 * deterministic classifier actually resolves for its path.
 */
export function checkAgreement(sample, classifierOptions) {
  const result = classify(sample.path, classifierOptions);
  return {
    agrees: result.class === sample.expectedClass,
    actualClass: result.class,
    normalizedPath: result.normalizedPath,
  };
}

/**
 * Applies a sample's class-appropriate expectations against an injected
 * response fixture. Returns one of four outcomes:
 *  - "rejected": the sample is UNKNOWN and cannot be checked (fail-closed)
 *  - "missing":  no response fixture was supplied for this sample
 *  - "passed":   every declared expectation matched the response
 *  - "failed":   at least one declared expectation did not match
 */
export function checkSample(sample, response) {
  if (sample.expectedClass === 'UNKNOWN') {
    return {
      id: sample.id,
      status: 'rejected',
      reason:
        'UNKNOWN routes require explicit classification before any SEO treatment can be checked',
    };
  }

  if (!response) {
    return { id: sample.id, status: 'missing', reason: 'No response fixture supplied' };
  }

  const exp = sample.expectations;
  const failures = [];

  if ('status' in exp && response.status !== exp.status) {
    failures.push(`expected status ${exp.status}, got ${response.status}`);
  }
  if ('contentType' in exp && !String(response.contentType || '').startsWith(exp.contentType)) {
    failures.push(`expected contentType starting with "${exp.contentType}", got "${response.contentType}"`);
  }
  if ('redirectTo' in exp && response.redirectTo !== exp.redirectTo) {
    failures.push(`expected redirectTo "${exp.redirectTo}", got "${response.redirectTo}"`);
  }
  if ('canonical' in exp && response.canonical !== exp.canonical) {
    failures.push(`expected canonical "${exp.canonical}", got "${response.canonical}"`);
  }
  if ('title' in exp) {
    const hasTitle = Boolean(response.title && response.title.trim().length > 0);
    if (hasTitle !== exp.title) failures.push(`expected title presence=${exp.title}, got ${hasTitle}`);
  }
  if ('metaDescription' in exp) {
    const hasDesc = Boolean(response.metaDescription && response.metaDescription.trim().length >= 20);
    if (hasDesc !== exp.metaDescription) {
      failures.push(`expected metaDescription presence=${exp.metaDescription}, got ${hasDesc}`);
    }
  }
  if ('h1Count' in exp && response.h1Count !== exp.h1Count) {
    failures.push(`expected exactly ${exp.h1Count} H1, got ${response.h1Count}`);
  }
  if ('minVisibleTextLength' in exp && !(response.visibleTextLength >= exp.minVisibleTextLength)) {
    failures.push(
      `expected visible text length >= ${exp.minVisibleTextLength}, got ${response.visibleTextLength}`
    );
  }
  if ('sitemapIncluded' in exp && Boolean(response.sitemapIncluded) !== exp.sitemapIncluded) {
    failures.push(`expected sitemapIncluded=${exp.sitemapIncluded}, got ${Boolean(response.sitemapIncluded)}`);
  }
  if ('robotsDisallowed' in exp && Boolean(response.robotsDisallowed) !== exp.robotsDisallowed) {
    failures.push(
      `expected robotsDisallowed=${exp.robotsDisallowed}, got ${Boolean(response.robotsDisallowed)}`
    );
  }
  if ('indexable' in exp && Boolean(response.indexable) !== exp.indexable) {
    failures.push(`expected indexable=${exp.indexable}, got ${Boolean(response.indexable)}`);
  }
  if ('internalLinkPresent' in exp && Boolean(response.internalLinkPresent) !== exp.internalLinkPresent) {
    failures.push(
      `expected internalLinkPresent=${exp.internalLinkPresent}, got ${Boolean(response.internalLinkPresent)}`
    );
  }

  return failures.length === 0
    ? { id: sample.id, status: 'passed' }
    : { id: sample.id, status: 'failed', failures };
}

/**
 * Runs every golden sample: verifies classifier agreement first (a
 * disagreement is always reported as failed, regardless of response
 * fixtures), then checks class-appropriate expectations against the
 * supplied response fixtures, keyed by sample id.
 */
export function checkGoldenRoutes(responses = {}, { goldenConfig, configPath, classifierOptions } = {}) {
  const config = goldenConfig || loadGoldenRoutes(configPath);

  return config.samples.map((sample) => {
    const agreement = checkAgreement(sample, classifierOptions);
    if (!agreement.agrees) {
      return {
        id: sample.id,
        status: 'failed',
        failures: [
          `golden sample declares class "${sample.expectedClass}" but the classifier resolved "${agreement.actualClass}" for "${agreement.normalizedPath}"`,
        ],
      };
    }
    return checkSample(sample, responses[sample.id]);
  });
}

// Allow ad-hoc CLI usage: node scripts/seo/goldenRouteChecker.js
// Reports schema/agreement validity only -- no response fixtures are
// available outside of a build or test run, so every sample reports
// "rejected" (UNKNOWN) or "missing" (no fixture) here by design.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const config = loadGoldenRoutes();
  const results = checkGoldenRoutes({}, { goldenConfig: config });
  console.log(JSON.stringify(results, null, 2));
}
