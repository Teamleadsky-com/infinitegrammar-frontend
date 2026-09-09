/**
 * Post-build rendering-integrity check for the canonical site identity graph.
 *
 * Page-level schema (Article publisher/author, LearningResource author,
 * WebApplication publisher) references the Organization entity by `@id` rather
 * than inlining it. That only works if the identity graph actually reaches the
 * emitted HTML. `npm run build` proves the prerender did not crash; this proves
 * the `@id` targets landed and no reference dangles.
 *
 * Run after `node scripts/prerender.js`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../../dist');

const ORGANIZATION_ID = 'https://www.infinitegrammar.de/#organization';
const ORGANIZATION_LOGO_URL = 'https://www.infinitegrammar.de/og-image.png';

/** Representative sample: homepage, a grammar level page, an article page and
 *  an exam-centre page — one per schema-emitting page type. */
const SAMPLE_PAGES = [
  'index.html',
  'deutsche-grammatik/b1-niveau-lernen/index.html',
  'articles/react-spa-seo-postmortem/index.html',
  'pruefungszentren/telc-berlin/index.html',
];

const LD_JSON_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

const decodeEntities = (raw) =>
  raw
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const extractBlocks = (html) => {
  const blocks = [];
  for (const match of html.matchAll(LD_JSON_RE)) {
    const raw = decodeEntities(match[1].trim());
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch (error) {
      blocks.push({ __parseError: error.message, __raw: raw.slice(0, 200) });
    }
  }
  return blocks;
};

/** Walks a JSON-LD value collecting declared `@id`s and `@id`-only references.
 *  An object whose only key is `@id` is a reference; anything else that carries
 *  an `@id` declares that node. */
const walk = (value, declared, referenced) => {
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, declared, referenced));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const keys = Object.keys(value);
  if (typeof value['@id'] === 'string') {
    if (keys.length === 1) {
      referenced.add(value['@id']);
    } else {
      declared.add(value['@id']);
    }
  }

  for (const key of keys) {
    if (key !== '@id') walk(value[key], declared, referenced);
  }
};

const findOrganizationNode = (blocks) => {
  let found = null;
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    if (value['@type'] === 'Organization' && value['@id'] === ORGANIZATION_ID) {
      found = value;
    }
    Object.values(value).forEach(visit);
  };
  blocks.forEach(visit);
  return found;
};

const failures = [];
let checkedPages = 0;

if (!fs.existsSync(DIST_DIR)) {
  console.error(`✗ dist/ not found at ${DIST_DIR}. Run "npm run build" first.`);
  process.exit(1);
}

for (const relativePath of SAMPLE_PAGES) {
  const filePath = path.join(DIST_DIR, relativePath);

  if (!fs.existsSync(filePath)) {
    failures.push(`${relativePath}: prerendered file missing`);
    continue;
  }

  checkedPages += 1;
  const blocks = extractBlocks(fs.readFileSync(filePath, 'utf8'));

  const parseErrors = blocks.filter((block) => block.__parseError);
  for (const block of parseErrors) {
    failures.push(`${relativePath}: unparseable JSON-LD (${block.__parseError})`);
  }

  const declared = new Set();
  const referenced = new Set();
  walk(blocks, declared, referenced);

  const org = findOrganizationNode(blocks);
  if (!org) {
    failures.push(`${relativePath}: no Organization node with @id ${ORGANIZATION_ID}`);
  } else if (org.logo?.url !== ORGANIZATION_LOGO_URL) {
    // SD-009 guard: publisher logo must keep pointing at a real asset.
    failures.push(
      `${relativePath}: Organization logo.url is ${JSON.stringify(org.logo?.url)}, expected ${ORGANIZATION_LOGO_URL}`
    );
  }

  const dangling = [...referenced].filter((id) => !declared.has(id));
  for (const id of dangling) {
    failures.push(`${relativePath}: dangling @id reference "${id}"`);
  }

  if (!dangling.length && org && !parseErrors.length) {
    console.log(
      `✓ ${relativePath} — ${blocks.length} JSON-LD block(s), ${referenced.size} @id reference(s), all resolved`
    );
  }
}

if (failures.length) {
  console.error('\n✗ Prerendered site identity check failed:');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`\n✓ Prerendered site identity check passed across ${checkedPages} page(s).`);
