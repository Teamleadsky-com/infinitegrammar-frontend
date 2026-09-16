import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_HTML_PATH = path.resolve(__dirname, '../../index.html');

/**
 * `index.html` is the single HTML shell for the whole site: scripts/prerender.js
 * boots each route in a headless browser and writes the resulting DOM verbatim to
 * `dist/**\/index.html`, so every prerendered page inherits this head. React Helmet
 * only injects per-page title/description/OG tags; charset and viewport exist
 * nowhere else.
 *
 * That makes the shell head a contract rather than a detail. These tests pin it so
 * a future analytics snippet, tag-manager container, or Helmet change cannot push
 * the responsive viewport declaration behind render-blocking scripts, duplicate it,
 * or disable pinch-zoom.
 */
const html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const head = headMatch ? headMatch[1] : '';

const viewportTags = head.match(/<meta[^>]*name=["']viewport["'][^>]*>/gi) ?? [];
const charsetTags = head.match(/<meta[^>]*\scharset=["'][^"']*["'][^>]*>/gi) ?? [];

function contentOf(tag: string): string {
  const match = tag.match(/content=["']([^"']*)["']/i);
  return match ? match[1] : '';
}

describe('index.html shell <head> contract', () => {
  it('has a <head> block', () => {
    expect(headMatch).not.toBeNull();
  });

  describe('viewport meta', () => {
    it('declares exactly one viewport meta', () => {
      expect(viewportTags).toHaveLength(1);
    });

    it('declares width=device-width', () => {
      expect(contentOf(viewportTags[0])).toContain('width=device-width');
    });

    // `initial-scale=1.0` renders identically but fails naive token-equality
    // predicates, so the canonical `1` form is pinned. The negative lookahead keeps
    // `1.0`, `1.5` and `10` from passing.
    it('declares the canonical initial-scale=1', () => {
      expect(contentOf(viewportTags[0])).toMatch(/initial-scale=1(?![\d.])/);
    });

    it('does not disable pinch-zoom', () => {
      const content = contentOf(viewportTags[0]);
      expect(content).not.toContain('user-scalable=no');
      expect(content).not.toContain('maximum-scale');
    });
  });

  describe('charset meta', () => {
    // Asserted symmetrically with viewport: the fix that moved both tags to the top
    // of <head> was a move, and a copy-instead-of-move slip would otherwise leave a
    // second charset declaration undetected.
    it('declares exactly one charset meta', () => {
      expect(charsetTags).toHaveLength(1);
    });

    it('declares UTF-8', () => {
      expect(charsetTags[0]).toMatch(/charset=["']utf-8["']/i);
    });
  });

  describe('declaration order', () => {
    const firstScriptIndex = head.search(/<script[\s>]/i);

    it('has at least one script in <head> (otherwise this guard is vacuous)', () => {
      expect(firstScriptIndex).toBeGreaterThan(-1);
    });

    it('declares charset before the first script', () => {
      expect(head.indexOf(charsetTags[0])).toBeLessThan(firstScriptIndex);
    });

    it('declares viewport before the first script', () => {
      expect(head.indexOf(viewportTags[0])).toBeLessThan(firstScriptIndex);
    });
  });
});
