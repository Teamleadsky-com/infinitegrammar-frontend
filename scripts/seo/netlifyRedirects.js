/**
 * Deterministic model of the netlify.toml redirect table.
 *
 * Parses the version-controlled [[redirects]] blocks from netlify.toml and
 * resolves a request path against them using Netlify's documented precedence:
 *
 *   1. forced rules (force = true) win over everything, in file order
 *   2. an existing file in the publish directory is served next
 *   3. the first matching non-forced rule wins, in file order
 *   4. nothing matched -> the platform's own 404
 *
 * This is a MODEL of the platform, not the platform itself. Two deliberate
 * choices keep it conservative, so that a "200" it reports is never optimistic:
 *
 *   - Path matching is exact. Netlify normalises trailing slashes before
 *     matching, but this model does not assume that. A rule set that resolves
 *     correctly here therefore also resolves correctly on Netlify, whether or
 *     not the platform normalises.
 *   - Rules whose `from` carries a scheme/host (the non-www -> www redirects)
 *     are host-scoped and are skipped when resolving a bare path.
 *
 * Because it is a model, it cannot detect a divergence between itself and the
 * platform. Deploy-Preview verification with curl remains load-bearing.
 *
 * Usage: node scripts/seo/netlifyRedirects.js /some/path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_NETLIFY_TOML = path.resolve(__dirname, '../../netlify.toml');

/**
 * Parses every [[redirects]] block out of a netlify.toml, preserving file order.
 * Returns objects of the form { from, to, status, force, index }.
 */
export function parseRedirects(tomlText) {
  if (typeof tomlText !== 'string') {
    throw new TypeError('parseRedirects: tomlText must be a string');
  }

  const rules = [];
  const blocks = tomlText.split(/^\s*\[\[redirects\]\]\s*$/m).slice(1);

  for (const block of blocks) {
    // A block ends at the next top-level table header ("[" at column 0).
    const body = block.split(/^\[/m)[0];

    const from = matchString(body, 'from');
    const to = matchString(body, 'to');
    const status = matchNumber(body, 'status');
    const force = /^\s*force\s*=\s*true\s*$/m.test(body);

    if (from === null) continue;

    rules.push({ from, to, status: status ?? 301, force, index: rules.length });
  }

  return rules;
}

function matchString(body, key) {
  const match = body.match(new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"\\s*$`, 'm'));
  return match ? match[1] : null;
}

function matchNumber(body, key) {
  const match = body.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)\\s*$`, 'm'));
  return match ? Number(match[1]) : null;
}

/**
 * Loads the redirect rules straight from netlify.toml.
 */
export function loadRedirects(tomlPath = DEFAULT_NETLIFY_TOML) {
  return parseRedirects(fs.readFileSync(tomlPath, 'utf-8'));
}

/**
 * True when a rule's `from` targets a specific scheme/host rather than a bare
 * path (e.g. "https://infinitegrammar.de/*"). Such rules only fire for that
 * host and are out of scope when resolving a path on the canonical domain.
 */
export function isHostScoped(rule) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(rule.from) || rule.from.startsWith('//');
}

/**
 * Matches a path against a single `from` pattern and returns its captures, or
 * null when the pattern does not match. A trailing "/*" is a splat that captures
 * the remainder of the path (including an empty remainder); ":param"
 * placeholders capture a single segment. Everything else is literal.
 */
export function matchFrom(from, requestPath) {
  if (from.endsWith('/*')) {
    // "/*" yields prefix "" and therefore matches every path -- the catch-all.
    const prefix = from.slice(0, -2);
    if (requestPath === prefix) return { splat: '', params: {} };
    if (requestPath.startsWith(prefix + '/')) {
      return { splat: requestPath.slice(prefix.length + 1), params: {} };
    }
    return null;
  }

  if (from.includes('/:')) {
    const names = [];
    const pattern = from
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          names.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    const match = requestPath.match(new RegExp(`^${pattern}$`));
    if (!match) return null;

    const params = {};
    names.forEach((name, i) => {
      params[name] = match[i + 1];
    });
    return { splat: '', params };
  }

  return from === requestPath ? { splat: '', params: {} } : null;
}

/** Boolean convenience wrapper around matchFrom(). */
export function matchesFrom(from, requestPath) {
  return matchFrom(from, requestPath) !== null;
}

/**
 * Substitutes ":splat" and ":param" placeholders in a rule's destination with
 * the captures produced by matchFrom(), yielding the concrete target Netlify
 * would redirect or rewrite to.
 */
export function expandTo(to, captures) {
  if (typeof to !== 'string') return to;

  let expanded = to.replace(/:splat\b/g, captures.splat);
  for (const [name, value] of Object.entries(captures.params)) {
    expanded = expanded.replace(new RegExp(`:${name}\\b`, 'g'), value);
  }
  return expanded;
}

/**
 * Resolves a path against the publish directory. `staticFiles` is a set of file
 * paths relative to the publish root, each with a leading slash
 * (e.g. "/index.html", "/articles/some-slug/index.html").
 *
 * Netlify serves "/dir/" from "/dir/index.html", and also serves "/dir" from
 * "/dir/index.html" (pretty URLs), so both forms are checked.
 */
export function findStaticFile(requestPath, staticFiles) {
  if (staticFiles.has(requestPath)) return requestPath;

  const indexCandidate = requestPath.endsWith('/')
    ? requestPath + 'index.html'
    : requestPath + '/index.html';
  if (staticFiles.has(indexCandidate)) return indexCandidate;

  return null;
}

/**
 * Resolves a request path to { status, to, via }.
 *
 * `via` is one of "forced-rule" | "static-file" | "rule" | "platform-404" and
 * exists so a test can assert *how* a path got its status, not just the number.
 */
export function resolve(requestPath, { rules, staticFiles = new Set() } = {}) {
  if (!Array.isArray(rules)) {
    throw new TypeError('resolve: options.rules must be an array of parsed redirect rules');
  }

  const pathRules = rules.filter((rule) => !isHostScoped(rule));

  for (const rule of pathRules) {
    const captures = rule.force ? matchFrom(rule.from, requestPath) : null;
    if (captures) {
      return { status: rule.status, to: expandTo(rule.to, captures), via: 'forced-rule', rule };
    }
  }

  const file = findStaticFile(requestPath, staticFiles);
  if (file) {
    return { status: 200, to: file, via: 'static-file', rule: null };
  }

  for (const rule of pathRules) {
    const captures = rule.force ? null : matchFrom(rule.from, requestPath);
    if (captures) {
      return { status: rule.status, to: expandTo(rule.to, captures), via: 'rule', rule };
    }
  }

  return { status: 404, to: null, via: 'platform-404', rule: null };
}

// Allow ad-hoc CLI usage: node scripts/seo/netlifyRedirects.js /some/path
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node scripts/seo/netlifyRedirects.js <path>');
    process.exit(1);
  }
  const { rule, ...result } = resolve(target, { rules: loadRedirects() });
  console.log(JSON.stringify({ path: target, ...result, from: rule?.from ?? null }, null, 2));
}
