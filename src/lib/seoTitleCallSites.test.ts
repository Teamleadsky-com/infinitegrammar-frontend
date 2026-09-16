import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { BRAND_SUFFIX } from './seoTitle';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(HERE, '../pages');
const REPO_ROOT = path.resolve(HERE, '../..');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return tsxFiles(full);
    return full.endsWith('.tsx') && !full.endsWith('.test.tsx') ? [full] : [];
  });
}

describe('page title call sites', () => {
  // Pages must build titles through buildPageTitle() so the brand suffix is
  // appended by one rule instead of being hard-coded per page — hard-coding is
  // how the suffix ended up on every title in the first place.
  it('no page hard-codes the brand suffix', () => {
    const offenders = tsxFiles(PAGES_DIR).filter((file) =>
      readFileSync(file, 'utf8').includes(BRAND_SUFFIX)
    );

    expect(offenders.map((f) => path.relative(REPO_ROOT, f))).toEqual([]);
  });
});

describe('deliberate brand-suffix exceptions', () => {
  // These two are intentionally left branded and are NOT covered by the scan
  // above, which only reads src/pages/**/*.tsx: the homepage keeps the brand in
  // its title, and index.html is the SPA fallback <title> for routes that are
  // not prerendered. Asserted here so the exception is explicit rather than an
  // accidental gap in the guard.
  it('the homepage i18n titles keep the brand', () => {
    for (const locale of ['de', 'en']) {
      const bundle = JSON.parse(
        readFileSync(path.join(REPO_ROOT, 'src/i18n/locales', `${locale}.json`), 'utf8')
      );
      expect(bundle.levelSelection.metaTitle.endsWith(BRAND_SUFFIX)).toBe(true);
    }
  });

  it('the index.html fallback title keeps the brand', () => {
    const html = readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    expect(title?.endsWith(BRAND_SUFFIX)).toBe(true);
  });
});
