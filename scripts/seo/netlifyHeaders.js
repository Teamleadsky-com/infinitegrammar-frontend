/**
 * Deterministic model of the public/_headers rule table.
 *
 * Parses the version-controlled _headers file into ordered blocks and resolves a
 * request path against them using Netlify's documented matching semantics:
 *
 *   - A rule line at column 0 is a path pattern; the indented lines below it are
 *     "Name: value" headers that Netlify adds to responses for matching paths.
 *   - "*" in a pattern matches any sequence of characters, including the empty
 *     sequence, so "/articles/*" also matches "/articles/".
 *   - Everything else is matched literally.
 *
 * This is a MODEL of the platform, not the platform itself, exactly as
 * scripts/seo/netlifyRedirects.js is. One deliberate omission keeps it honest:
 *
 *   - resolveHeader() does NOT pick a winner when several rules set the same
 *     header for one path. Netlify's precedence for conflicting same-header
 *     rules is undocumented, so the model returns *all* matches and refuses to
 *     guess. The test suite asserts that at most one rule ever sets
 *     Cache-Control for any path we care about, which is what makes the
 *     precedence question irrelevant rather than a bet.
 *
 * Because it is a model, it cannot detect a divergence between itself and the
 * platform. Deploy-Preview verification with curl remains load-bearing.
 *
 * Usage: node scripts/seo/netlifyHeaders.js /some/path [Header-Name]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_HEADERS_FILE = path.resolve(__dirname, '../../public/_headers');

/**
 * Parses a _headers file into ordered rules of the form
 * { path, headers: { "Name": "value" }, index }.
 *
 * Blank lines and "#" comments are ignored. A line starting at column 0 opens a
 * new rule; an indented "Name: value" line attaches a header to the open rule.
 */
export function parseHeaders(text) {
  if (typeof text !== 'string') {
    throw new TypeError('parseHeaders: text must be a string');
  }

  const rules = [];
  let current = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const isIndented = /^\s/.test(line);

    if (!isIndented) {
      current = { path: line.trim(), headers: {}, index: rules.length };
      rules.push(current);
      continue;
    }

    if (!current) continue; // header line before any path line: not a rule

    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const name = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (name) current.headers[name] = value;
  }

  return rules;
}

/** Loads the rules straight from the version-controlled public/_headers. */
export function loadHeaders(headersPath = DEFAULT_HEADERS_FILE) {
  return parseHeaders(fs.readFileSync(headersPath, 'utf-8'));
}

/**
 * Matches a request path against a single _headers path pattern.
 * "*" matches any sequence of characters including none; everything else is
 * literal. "/" therefore matches only the root, and "/*" matches everything.
 */
export function matchesPath(rulePath, requestPath) {
  const pattern = rulePath
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${pattern}$`).test(requestPath);
}

/**
 * Returns every rule that sets `headerName` for `requestPath`, in file order:
 * { matches: [{ rule, value }] }.
 *
 * More than one match means the platform has to break a tie whose rules are
 * undocumented -- see the module docblock. Callers must treat that as a defect
 * rather than reading matches[0] as the answer.
 */
export function resolveHeader(rules, requestPath, headerName) {
  if (!Array.isArray(rules)) {
    throw new TypeError('resolveHeader: rules must be an array of parsed header rules');
  }

  const target = headerName.toLowerCase();
  const matches = [];

  for (const rule of rules) {
    if (!matchesPath(rule.path, requestPath)) continue;
    for (const [name, value] of Object.entries(rule.headers)) {
      if (name.toLowerCase() === target) matches.push({ rule, value });
    }
  }

  return { matches };
}

/**
 * Extracts the max-age value, in seconds, from a Cache-Control header value.
 * Returns null when the directive is absent or unparseable.
 */
export function parseMaxAge(cacheControlValue) {
  if (typeof cacheControlValue !== 'string') return null;
  const match = cacheControlValue.match(/(?:^|[\s,])max-age\s*=\s*(\d+)(?:\s|,|$)/i);
  return match ? Number(match[1]) : null;
}

// Allow ad-hoc CLI usage: node scripts/seo/netlifyHeaders.js /some/path [Header-Name]
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node scripts/seo/netlifyHeaders.js <path> [header-name]');
    process.exit(1);
  }
  const headerName = process.argv[3] ?? 'Cache-Control';
  const { matches } = resolveHeader(loadHeaders(), target, headerName);
  console.log(
    JSON.stringify(
      {
        path: target,
        header: headerName,
        matches: matches.map(({ rule, value }) => ({ rule: rule.path, value })),
      },
      null,
      2
    )
  );
}
