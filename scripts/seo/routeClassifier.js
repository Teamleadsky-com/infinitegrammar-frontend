/**
 * Deterministic route classifier.
 *
 * Loads the version-controlled route configuration (config/seo-route-classes.json)
 * and classifies a path into exactly one of the configured classes, or the
 * fallback class UNKNOWN when no rule matches. Route classes are never decided
 * by page content, metadata, or runtime heuristics -- only by this configuration.
 *
 * Usage: node scripts/seo/routeClassifier.js /some/path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '../../config/seo-route-classes.json');

export const FALLBACK_CLASS = 'UNKNOWN';

let cachedConfig = null;
let cachedConfigPath = null;

/**
 * Loads and validates the route-class configuration from disk.
 * Results are cached per configPath; pass { fresh: true } to bypass the cache.
 */
export function loadRouteConfig(configPath = DEFAULT_CONFIG_PATH, { fresh = false } = {}) {
  if (!fresh && cachedConfig && cachedConfigPath === configPath) {
    return cachedConfig;
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);
  validateConfig(config);

  cachedConfig = config;
  cachedConfigPath = configPath;
  return config;
}

function validateConfig(config) {
  if (!Array.isArray(config.classes) || config.classes.length === 0) {
    throw new Error('Invalid route-class config: "classes" must be a non-empty array');
  }
  if (!Array.isArray(config.exactRules)) {
    throw new Error('Invalid route-class config: "exactRules" must be an array');
  }
  if (!Array.isArray(config.wildcardRules)) {
    throw new Error('Invalid route-class config: "wildcardRules" must be an array');
  }

  const validClasses = new Set(config.classes);
  for (const rule of [...config.exactRules, ...config.wildcardRules]) {
    if (!validClasses.has(rule.class)) {
      const identifier = rule.path ?? rule.pattern;
      throw new Error(
        `Invalid route-class config: rule "${identifier}" references undeclared class "${rule.class}"`
      );
    }
  }
}

/**
 * Normalizes a path or full URL into a consistent path form:
 * - extracts the pathname when given a full/protocol-relative URL
 * - strips query strings and hash fragments
 * - ensures a single leading slash and collapses duplicate slashes
 * - removes a trailing slash, except for the root path "/"
 */
export function normalizePath(input) {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('normalizePath: input must be a non-empty string');
  }

  let raw = input.trim();

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw) || raw.startsWith('//')) {
    try {
      raw = new URL(raw, 'http://localhost').pathname;
    } catch {
      // Not a parseable URL; fall through and treat the original input as a path.
    }
  }

  raw = raw.split('#')[0].split('?')[0];

  if (!raw.startsWith('/')) raw = '/' + raw;
  raw = raw.replace(/\/{2,}/g, '/');

  if (raw.length > 1 && raw.endsWith('/')) {
    raw = raw.replace(/\/+$/, '');
  }

  return raw;
}

function wildcardToRegExp(pattern) {
  const escaped = pattern
    .split('*')
    .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${escaped}$`);
}

/**
 * Classifies a route path (or full URL) into exactly one class.
 * Returns a detail object: { normalizedPath, class, matchedRule }.
 * matchedRule is null when the fallback class (UNKNOWN) is returned.
 */
export function classify(input, { config, configPath } = {}) {
  const resolvedConfig = config || loadRouteConfig(configPath);
  const normalizedPath = normalizePath(input);

  for (const rule of resolvedConfig.exactRules) {
    if (rule.path === normalizedPath) {
      return { normalizedPath, class: rule.class, matchedRule: { type: 'exact', ...rule } };
    }
  }

  for (const rule of resolvedConfig.wildcardRules) {
    if (wildcardToRegExp(rule.pattern).test(normalizedPath)) {
      return { normalizedPath, class: rule.class, matchedRule: { type: 'wildcard', ...rule } };
    }
  }

  return { normalizedPath, class: resolvedConfig.fallbackClass || FALLBACK_CLASS, matchedRule: null };
}

/**
 * Convenience wrapper around classify() that returns just the class string.
 */
export function classifyRoute(input, options) {
  return classify(input, options).class;
}

// Allow ad-hoc CLI usage: node scripts/seo/routeClassifier.js /some/path
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node scripts/seo/routeClassifier.js <path>');
    process.exit(1);
  }
  console.log(JSON.stringify(classify(target), null, 2));
}
