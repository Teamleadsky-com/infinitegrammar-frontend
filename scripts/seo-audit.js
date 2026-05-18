/**
 * Local SEO audit script.
 * Runs against dist/ after build. Exits non-zero on any failure.
 *
 * Usage: node scripts/seo-audit.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const DOMAIN = 'https://www.infinitegrammar.de';

// Routes that are prerendered but should NOT appear in sitemap
const NON_INDEXABLE = [
  /^\/admin\/?/,
  /^\/exercise\/?$/,
  /^\/exercise-stats\/?/,
  /^\/auth\/?/,
  /^\/profile\/?/,
  /^\/statistics\/?/,
  /^\/verify-magic-link\/?/,
  /^\/email-preferences\/?/,
];

const isNonIndexable = (urlPath) =>
  NON_INDEXABLE.some((re) => re.test(urlPath));

// ── Helpers ──────────────────────────────────────────────────────────

function parseSitemapUrls(xml) {
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) urls.push(m[1]);
  return urls;
}

function findPrerenderedPages(dir, base = '') {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // Skip asset directories
      if (entry.name === 'assets') continue;
      pages.push(...findPrerenderedPages(path.join(dir, entry.name), base + '/' + entry.name));
    } else if (entry.name === 'index.html' && base !== '') {
      // base === '' is the root index.html (SPA shell / homepage)
      pages.push(base + '/');
    }
  }
  return pages;
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function stripTags(html) {
  // Remove script and style content entirely
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove all tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// ── Checks ───────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`[PASS] ${msg}`);
  passed++;
}

function fail(msg, details = []) {
  console.log(`[FAIL] ${msg}`);
  for (const d of details) console.log(`  - ${d}`);
  failed++;
}

// ── Main ─────────────────────────────────────────────────────────────

// Read dist/sitemap.xml
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('ERROR: dist/sitemap.xml not found. Run npm run build first.');
  process.exit(1);
}

const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
const sitemapUrls = parseSitemapUrls(sitemapXml);
const sitemapPaths = sitemapUrls.map((u) => u.replace(DOMAIN, ''));

// Find all prerendered pages
const prerenderedPaths = findPrerenderedPages(DIST);
// Also include homepage (root index.html is prerendered too)
prerenderedPaths.unshift('/');

const indexablePaths = prerenderedPaths.filter((p) => !isNonIndexable(p));
const nonIndexablePaths = prerenderedPaths.filter((p) => isNonIndexable(p));

console.log(`\nSEO Audit — dist/\n`);
console.log(`Sitemap: ${sitemapUrls.length} URLs`);
console.log(`Prerendered: ${indexablePaths.length} indexable, ${nonIndexablePaths.length} non-indexable\n`);

// ── 1. Sitemap URL format validation ─────────────────────────────────

{
  const errors = [];
  for (const url of sitemapUrls) {
    if (!url.startsWith(DOMAIN + '/')) {
      errors.push(`Wrong domain: ${url}`);
    }
    if (!url.endsWith('/')) {
      errors.push(`Missing trailing slash: ${url}`);
    }
    const afterDomain = url.slice(DOMAIN.length);
    if (afterDomain.includes('?')) {
      errors.push(`Contains query string: ${url}`);
    }
    if (afterDomain.includes('#')) {
      errors.push(`Contains hash: ${url}`);
    }
    if (afterDomain.includes('//')) {
      errors.push(`Contains double slash: ${url}`);
    }
  }
  if (errors.length === 0) pass('Sitemap URL format valid');
  else fail('Sitemap URL format errors', errors);
}

// ── 2. Sitemap ↔ prerendered HTML cross-reference ────────────────────

// 2a. Every sitemap URL has matching HTML
{
  const missing = [];
  for (const sp of sitemapPaths) {
    const htmlPath = sp === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, sp, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      missing.push(sp);
    }
  }
  if (missing.length === 0) pass('All sitemap URLs have matching HTML');
  else fail('Sitemap URLs missing prerendered HTML', missing);
}

// 2b. Every indexable prerendered page is in sitemap
{
  const sitemapPathSet = new Set(sitemapPaths);
  const missing = indexablePaths.filter((p) => !sitemapPathSet.has(p));
  if (missing.length === 0) pass('All indexable pages are in sitemap');
  else fail('Indexable pages missing from sitemap', missing);
}

// 2c. No non-indexable routes in sitemap
{
  const leaked = sitemapPaths.filter((p) => isNonIndexable(p));
  if (leaked.length === 0) pass('No non-indexable routes in sitemap');
  else fail('Non-indexable routes found in sitemap', leaked);
}

// ── 3–8. Per-page checks ─────────────────────────────────────────────

const canonicalMap = new Map(); // canonical → file path (for duplicate detection)
const canonicalErrors = [];
const ogUrlErrors = [];
const titleErrors = [];
const descErrors = [];
const shellErrors = [];
const linkErrors = [];
const noindexErrors = [];

const sitemapPathSet = new Set(sitemapPaths);
const prerenderedPathSet = new Set(prerenderedPaths);

for (const pagePath of prerenderedPaths) {
  const htmlFile = pagePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, pagePath, 'index.html');

  const html = fs.readFileSync(htmlFile, 'utf-8');
  const label = pagePath;

  // ── 3. Canonical and og:url ──────────────────────────────────────

  const canonical = extractTag(html, /rel="canonical"\s+href="([^"]+)"/);
  const ogUrl = extractTag(html, /property="og:url"\s+content="([^"]+)"/);

  if (!canonical) {
    canonicalErrors.push(`${label}: missing canonical`);
  } else {
    if (!canonical.startsWith(DOMAIN + '/')) {
      canonicalErrors.push(`${label}: canonical wrong domain: ${canonical}`);
    }
    if (!canonical.endsWith('/')) {
      canonicalErrors.push(`${label}: canonical missing trailing slash: ${canonical}`);
    }
    // Canonical must match file path
    const expectedCanonical = DOMAIN + pagePath;
    if (canonical !== expectedCanonical) {
      canonicalErrors.push(`${label}: canonical mismatch — expected ${expectedCanonical}, got ${canonical}`);
    }
    // Duplicate detection
    if (canonicalMap.has(canonical)) {
      canonicalErrors.push(`${label}: duplicate canonical (also declared by ${canonicalMap.get(canonical)})`);
    } else {
      canonicalMap.set(canonical, label);
    }
  }

  if (!ogUrl) {
    ogUrlErrors.push(`${label}: missing og:url`);
  } else if (canonical && ogUrl !== canonical) {
    ogUrlErrors.push(`${label}: og:url (${ogUrl}) != canonical (${canonical})`);
  }

  // ── 4. Title and description ─────────────────────────────────────

  const title = extractTag(html, /<title>([^<]*)<\/title>/);
  if (!title || title.trim().length === 0) {
    titleErrors.push(`${label}: missing or empty title`);
  }

  const desc = extractTag(html, /name="description"\s+content="([^"]+)"/);
  if (!desc) {
    descErrors.push(`${label}: missing description`);
  } else if (desc.length < 20) {
    descErrors.push(`${label}: description too short (${desc.length} chars)`);
  }

  // ── 5. SPA shell detection ───────────────────────────────────────

  if (html.includes('<div id="root"></div>')) {
    shellErrors.push(`${label}: empty root div (SPA shell)`);
  } else {
    const visibleText = stripTags(html);
    if (visibleText.length < 200) {
      shellErrors.push(`${label}: visible text too short (${visibleText.length} chars)`);
    }
  }

  // ── 6. Internal link trailing slash ──────────────────────────────

  const linkRe = /<a\s[^>]*href="(\/[^"]+)"/g;
  let lm;
  while ((lm = linkRe.exec(html))) {
    const href = lm[1];
    // Skip assets, query strings, anchors, API paths
    if (/\.\w{2,4}$/.test(href)) continue; // .js, .css, .png, etc.
    if (href.includes('?')) continue;
    if (href.startsWith('/#')) continue;
    if (href.startsWith('/api/')) continue;

    // Only check links that point to known prerendered routes
    const hrefPath = href.endsWith('/') ? href : href + '/';
    if (!prerenderedPathSet.has(hrefPath) && !prerenderedPathSet.has(href)) continue;

    if (!href.endsWith('/')) {
      linkErrors.push(`${label}: internal link missing slash: ${href}`);
    }
  }

  // ── 8. No noindex on sitemap pages ───────────────────────────────

  if (sitemapPathSet.has(pagePath)) {
    if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
      noindexErrors.push(`${label}: has noindex but is in sitemap`);
    }
  }
}

// ── Report results ───────────────────────────────────────────────────

if (canonicalErrors.length === 0) pass('Canonical URLs valid and match file paths');
else fail('Canonical URL errors', canonicalErrors);

if (ogUrlErrors.length === 0) pass('og:url matches canonical on all pages');
else fail('og:url errors', ogUrlErrors);

if (titleErrors.length === 0) pass('All pages have title');
else fail('Title errors', titleErrors);

if (descErrors.length === 0) pass('All pages have description');
else fail('Description errors', descErrors);

if (shellErrors.length === 0) pass('No SPA shell pages');
else fail('SPA shell / thin content detected', shellErrors);

if (linkErrors.length === 0) pass('Internal links use trailing slashes');
else fail('Internal links missing trailing slash', linkErrors);

// Duplicate canonical detection
{
  const dupeErrors = [];
  const seen = new Map();
  for (const [canonical, filePath] of canonicalMap) {
    // canonicalMap only stores first occurrence; duplicates are caught during collection
  }
  // Check for duplicates by reversing: scan all pages again
  const allCanonicals = new Map();
  for (const pagePath of prerenderedPaths) {
    const htmlFile = pagePath === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, pagePath, 'index.html');
    const html = fs.readFileSync(htmlFile, 'utf-8');
    const canonical = extractTag(html, /rel="canonical"\s+href="([^"]+)"/);
    if (canonical) {
      if (allCanonicals.has(canonical)) {
        dupeErrors.push(`${canonical} claimed by both ${allCanonicals.get(canonical)} and ${pagePath}`);
      } else {
        allCanonicals.set(canonical, pagePath);
      }
    }
  }
  if (dupeErrors.length === 0) pass('No duplicate canonicals');
  else fail('Duplicate canonical URLs', dupeErrors);
}

if (noindexErrors.length === 0) pass('No noindex on sitemap pages');
else fail('noindex conflicts with sitemap', noindexErrors);

// ── Summary ──────────────────────────────────────────────────────────

console.log('');
if (failed === 0) {
  console.log(`✓ ${passed} checks passed, 0 failed\n`);
  process.exit(0);
} else {
  console.log(`✗ ${passed} checks passed, ${failed} failed\n`);
  process.exit(1);
}
