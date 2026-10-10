#!/usr/bin/env node
/**
 * Builds the static /articles section from the articles prototype.
 *
 * Source (gitignored, kept locally): docs/articles_demo/
 *   _src/<slug>.html          article fragments with a <!--meta {...} --> block
 *   _src/_index.html          hub body          -> /articles/
 *   _src/_about.html          about body        -> /articles/about/
 *   assets/site.css, site.js  design and interactive charts / exercise
 *   images/site, images/diagrams
 * Output (committed): public/articles/**, public/images/articles/{site,diagrams}/*
 *
 * Mirrors docs/articles_demo/_build.py (order, tracks, version chips, cards, reading time), with
 * production URLs (/articles/<slug>/), canonical + Open Graph tags, analytics, and no demo banner.
 * The internal plan page is never published.
 *
 * Run: npm run build:articles   (then commit public/articles and public/images/articles)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = path.join(ROOT, 'docs/articles_demo');
const SRC = path.join(DEMO, '_src');
const OUT = path.join(ROOT, 'public/articles');
const IMG_OUT = path.join(ROOT, 'public/images/articles');

const SITE = 'https://www.infinitegrammar.de';
// Social share card for every /articles page (LinkedIn etc.); kept outside public/images/articles,
// which this script wipes on every run.
const OG_IMAGE = `${SITE}/images/og-articles.png`;
const OG_IMAGE_ALT = 'Building AI Products That Deliver on Their Promise: notes by Aleksandr Zuravliov, InfiniteGrammar.de';
const AUTHOR = 'Aleksandr Zuravliov';
const LINKEDIN = 'https://www.linkedin.com/in/aleksandrz/';

const TRACKS = {
  start: 'Start here',
  quality: 'Quality and evals',
  ops: 'Running it in production',
  product: 'Product and learners',
  agents: 'Building with AI agents',
};

const ORDER = [
  'from-one-in-six-to-three-in-four',
  'testing-the-llm-judge',
  'wrong-answers-are-the-product',
  'deciding-with-evidence',
  'cost-per-clean-exercise',
  'taking-down-my-own-content',
  'a-cockpit-for-ai-content',
  'variety-is-a-sequencing-problem',
  'reminders-that-know-what-you-practised',
  'working-with-an-ai-engineer',
  'seo-agent-cannot-grade-itself',
  'what-fast-frontends-hide',
];

const VERSIONS = [
  { id: 'V1', when: 'until Sep 2026', name: 'Original pipeline',
    short: 'One model writes each exercise and reviews its own work. Failed drafts are rewritten from scratch.',
    long: 'One model writes each exercise and reviews its own work. A draft that fails the review is rewritten '
      + 'from scratch until it passes or runs out of attempts. A separate checker pass flags problems afterwards.' },
  { id: 'V2', when: '28 Sep 2026', name: 'Generate, verify, repair',
    short: 'A mid-sized model writes, a new verifier checks every gap, and only the failing gaps are repaired.',
    long: 'A mid-sized model (gpt-5.6-terra) writes. A new verifier checks every gap: free format rules, two '
      + 'small solvers that must agree on the one right answer, a judge for the German, the topic and the '
      + 'explanations, and an adjudicator when the solvers disagree. Only the gaps that fail are repaired, '
      + 'at most twice.' },
  { id: 'V3', when: '30 Sep 2026', name: '+ coherence check',
    short: 'Adds a separate check that the whole story holds together.',
    long: 'After every gap passes, a separate check reads the whole text: who does what, who a pronoun points '
      + 'to, whether facts contradict each other. A failure gets one text-only repair and a full re-check.' },
  { id: 'V4', when: '2 Oct 2026', name: '+ design rules in the prompt',
    short: 'Moves the rules for good wrong answers from the checks into the writing prompt.',
    long: 'The rules for good wrong answers move from the checks into the writing prompt: each distractor is '
      + 'wrong in one way only, inside the grammar being practised, and no exercise can be solved by a '
      + 'surface pattern.' },
  { id: 'V5', when: '3 Oct 2026', name: '+ stronger writer, editor gate',
    short: 'A frontier model writes and repairs, and an editor gate reads every finished exercise.',
    long: 'A frontier model (gpt-6.1-sol) writes and repairs. The same model then reads every finished exercise '
      + 'like a senior editor and rejects it for any of six named issue types: a second right answer, a '
      + 'double error, an option nobody would choose, a wrong key or explanation, a text problem, or mixed '
      + 'grammar.' },
  { id: 'V6', when: '4 Oct 2026', name: '+ mixed-grammar tolerance',
    short: 'Tolerates up to 30% of gaps touching a neighbouring grammar point. In production today.',
    long: 'Up to 30% of an exercise’s gaps may touch a neighbouring grammar point, and a fixed phrase counts '
      + 'as one choice. A surface pattern across the whole exercise is still fatal. This is the version in '
      + 'production today.' },
];
const VERSION_IDS = new Set(VERSIONS.map((v) => v.id));

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">'
  + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650;700;750'
  + '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">';

// Same counters as the app's index.html
const ANALYTICS = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-569909YP8G"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-569909YP8G');
</script>
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106880972', 'ym');
    ym(106880972, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<!-- /Yandex.Metrika counter -->
`;

const LINKEDIN_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="4" fill="#fff"/>'
  + '<circle cx="7" cy="7" r="1.9" fill="#0a66c2"/><rect x="5.3" y="9.6" width="3.4" height="9.4" fill="#0a66c2"/>'
  + '<path d="M11 9.6h3.2v1.4c.5-.9 1.7-1.7 3.4-1.7 3 0 3.6 1.9 3.6 4.5V19h-3.4v-4.6c0-1.2-.1-2.6-1.7-2.6'
  + '-1.7 0-1.9 1.3-1.9 2.5V19H11z" fill="#0a66c2"/></svg>';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Python html.escape(quote=True)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
// Python json.dumps formatting (", " and ": "), so output matches the prototype byte for byte
const pyJson = (v) => {
  if (Array.isArray(v)) return `[${v.map(pyJson).join(', ')}]`;
  if (v && typeof v === 'object') return `{${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${pyJson(x)}`).join(', ')}}`;
  return JSON.stringify(v);
};
const jsonScript = (data) => pyJson(data).replace(/<\//g, '<\\/');
const fmtDate = (d) => {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ${MONTHS[m - 1]} ${y}`;
};
const articleUrl = (slug) => `/articles/${slug}/`;

const linkedinBadge = () => `<a class="li-badge" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">${LINKEDIN_ICON}`
  + `<span>${AUTHOR} on LinkedIn</span></a>`;

function readSrc(slug) {
  const raw = fs.readFileSync(path.join(SRC, `${slug}.html`), 'utf-8');
  const m = raw.match(/^\s*<!--meta\s*(\{[\s\S]*?\})\s*-->\s*([\s\S]*)$/);
  if (!m) throw new Error(`${slug}: missing <!--meta {...} --> block`);
  const meta = JSON.parse(m[1]);
  meta.slug = slug;
  meta.body = m[2];
  const text = meta.body.replace(/\{\{[^}]+\}\}/g, ' ').replace(/<[^>]+>/g, ' ');
  meta.words = text.split(/\s+/).filter(Boolean).length;
  meta.minutes = Math.max(3, Math.round(meta.words / 230));
  return meta;
}

function head({ title, desc, canonical, ogType, extra = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
${ANALYTICS}<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${AUTHOR}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta property="og:image:alt" content="${OG_IMAGE_ALT}">
<meta property="og:site_name" content="InfiniteGrammar">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta name="twitter:image:alt" content="${OG_IMAGE_ALT}">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg">
${extra}${FONTS}
<link rel="stylesheet" href="/articles/assets/site.css">
</head>
<body>
`;
}

function chromeTop(current) {
  const cur = (name) => (name === current ? ' aria-current="page"' : '');
  return `<header class="site-header"><div class="inner">
  <a class="brand" href="/articles/"><span class="brand-mark">IG</span>Infinite Grammar <small>· Notes</small></a>
  <nav class="nav" aria-label="Main">
    <a href="/articles/"${cur('articles')}>Articles</a>
    <a href="/articles/about/"${cur('about')}>About</a>
    <a href="https://www.infinitegrammar.de/" rel="noopener">The product ↗</a>
    <a class="cta" href="/articles/about/#contact">Contact</a>
  </nav>
</div></header>
`;
}

function chromeBottom() {
  return `<footer class="site-footer"><div class="inner">
  <div>
    <h4>About these notes</h4>
    <p>Written by ${AUTHOR}, who builds <a href="https://www.infinitegrammar.de/">InfiniteGrammar.de</a> alone with LLMs and AI coding agents. Numbers come from the project's own run logs and reports, with sample sizes stated.</p>
  </div>
  <div>
    <h4>Read</h4>
    <ul>
      <li><a href="${articleUrl(ORDER[0])}">Start here: the quality case study</a></li>
      <li><a href="/articles/#tracks">All articles by topic</a></li>
      <li><a href="/articles/about/">About me</a></li>
    </ul>
  </div>
  <div>
    <h4>Contact</h4>
    <ul>
      <li><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
    </ul>
  </div>
  <p class="fineprint">© 2026 Infinite Grammar.</p>
</div></footer>
<script src="/articles/assets/site.js"></script>
</body>
</html>
`;
}

function versionChip(vid) {
  if (!VERSION_IDS.has(vid)) throw new Error(`unknown pipeline version ${vid}`);
  const v = VERSIONS.find((x) => x.id === vid);
  return `<a class="ver" href="#pipeline-versions" data-ver="${vid}" `
    + `aria-label="Pipeline version ${vid}: ${esc(v.name.replace(/^[+ ]+/, ''))}">${vid}</a>`;
}

function versionsBox() {
  const items = VERSIONS.map((v) => `<li><span class="ver static">${v.id}</span><div><strong>${esc(v.name)}</strong>`
    + `<span class="when">${v.when}</span><p>${esc(v.long)}</p></div></li>`).join('');
  const data = Object.fromEntries(VERSIONS.map((v) => [v.id, { name: v.name, when: v.when, short: v.short }]));
  return `<details class="versions" id="pipeline-versions"><summary>Pipeline versions: what V1–V6 mean</summary>`
    + `<ol>${items}</ol><p class="fine">Each version keeps everything before it. Charts and text name the `
    + `version that produced a number.</p></details>`
    + `<script type="application/json" id="ig-versions">${jsonScript(data)}</script>`;
}

function renderBody(meta) {
  let body = meta.body;
  const usesVersions = body.includes('{{v:') || body.includes('"ver":');
  if (usesVersions && !body.includes('{{versions}}')) {
    throw new Error(`${meta.slug}: uses pipeline-version chips but has no {{versions}} box`);
  }
  // keep a chip together with the punctuation around it
  body = body.replace(/(\(?)\{\{v:(V\d)\}\}([).,:;]?)/g, (_, open, vid, close) => {
    const c = versionChip(vid);
    return open || close ? `<span class="nowrap">${open}${c}${close}</span>` : c;
  });
  return body.replace('{{versions}}', versionsBox());
}

// Prototype-relative links -> production URLs
function rewriteLinks(html, where) {
  let out = html
    .replace(/(href|src)="(?:\.\.\/)?images\/(site|diagrams)\/([^"]+)"/g, (_, attr, dir, file) => `${attr}="/images/articles/${dir}/${file}"`)
    .replace(/href="(?:\.\.\/)?articles\/([a-z0-9-]+)\.html(#[^"]*)?"/g, (_, slug, hash = '') => `href="${articleUrl(slug)}${hash}"`)
    .replace(/href="(?:\.\.\/)?about\.html(#[^"]*)?"/g, (_, hash = '') => `href="/articles/about/${hash}"`)
    .replace(/href="(?:\.\.\/)?index\.html(#[^"]*)?"/g, (_, hash = '') => `href="/articles/${hash}"`)
    .replace(/href="([a-z0-9-]+)\.html(#[^"]*)?"/g, (m, slug, hash = '') => (ORDER.includes(slug) ? `href="${articleUrl(slug)}${hash}"` : m));
  const leftover = out.match(/(href|src)="(?!https?:|\/|#|mailto:)[^"]*"/g);
  if (leftover) throw new Error(`${where}: unresolved relative link(s): ${[...new Set(leftover)].join(', ')}`);
  for (const [, ref] of out.matchAll(/(?:href|src)="\/(articles\/[a-z0-9-]+)\/[^"]*"/g)) {
    const slug = ref.split('/')[1];
    if (slug !== 'about' && slug !== 'assets' && !ORDER.includes(slug)) throw new Error(`${where}: link to unknown article ${slug}`);
  }
  return out;
}

function articleJsonLd(meta) {
  const url = `${SITE}${articleUrl(meta.slug)}`;
  const data = {
    '@context': 'https://schema.org', '@type': 'Article', headline: meta.title,
    description: meta.dek, datePublished: meta.date, dateModified: meta.updated || meta.date,
    author: { '@type': 'Person', name: AUTHOR, url: LINKEDIN },
    mainEntityOfPage: url, url, image: OG_IMAGE,
  };
  return `<script type="application/ld+json">${jsonScript(data)}</script>\n`;
}

function buildArticle(meta, prev, next) {
  const track = TRACKS[meta.track];
  if (!track) throw new Error(`${meta.slug}: unknown track ${meta.track}`);
  const tldr = meta.tldr.map((x) => `<li>${x}</li>`).join('');
  let nav = '<nav class="next" aria-label="More articles">';
  nav += prev ? `<a href="${articleUrl(prev.slug)}"><span>← Previous</span><strong>${esc(prev.title)}</strong></a>` : '<span></span>';
  nav += next ? `<a href="${articleUrl(next.slug)}" style="text-align:right"><span>Next →</span><strong>${esc(next.title)}</strong></a>` : '';
  nav += '</nav>';
  let dates = `<time datetime="${meta.date}">${fmtDate(meta.date)}</time>`;
  if (meta.updated) {
    dates += ` <span class="sep">·</span> <span>Updated <time datetime="${meta.updated}">${fmtDate(meta.updated)}</time></span>`;
  }
  const canonical = `${SITE}${articleUrl(meta.slug)}`;
  const body = `<main class="wrap">
<article class="measure">
  <header class="article-header">
    <div class="crumbs"><a href="/articles/">Articles</a> · <a href="/articles/#${meta.track}">${track}</a></div>
    <h1>${meta.title}</h1>
    <p class="dek">${meta.dek}</p>
    <div class="byline"><img src="/images/articles/site/author-alex.jpg" alt="${AUTHOR}"><div><strong>${AUTHOR}</strong> · AI product manager<br>${dates} <span class="sep">·</span> <span>${meta.minutes} min read</span></div></div>
  </header>
  <aside class="tldr" aria-label="The short version"><h2>The short version</h2><ul>${tldr}</ul></aside>
  <div class="article-body">
${renderBody(meta)}
  </div>
  <aside class="author-box"><img src="/images/articles/site/author-alex.jpg" alt=""><div><strong>${AUTHOR}</strong> builds InfiniteGrammar.de end to end: product decisions, LLM pipelines, evals, data and the agents that write most of the code. <a href="/articles/about/">More about Aleksandr</a></div></aside>
  ${nav}
</article>
</main>
`;
  const page = head({ title: `${meta.title} · InfiniteGrammar`, desc: meta.dek, canonical, ogType: 'article', extra: articleJsonLd(meta) })
    + chromeTop('articles') + rewriteLinks(body, meta.slug) + chromeBottom();
  write(path.join(OUT, meta.slug, 'index.html'), page);
}

function buildPage(name, cards) {
  let body = fs.readFileSync(path.join(SRC, `_${name}.html`), 'utf-8');
  body = body.replace(/\{\{card:([a-z0-9-]+)\}\}/g, (_, slug) => {
    const c = cards[slug];
    if (!c) throw new Error(`_${name}: card for unknown article ${slug}`);
    const num = String(ORDER.indexOf(slug) + 1).padStart(2, '0');
    return `<a class="card" href="articles/${slug}.html"><span class="num">${num}</span>`
      + `<span class="t">${c.title}</span><span class="d">${c.card}</span>`
      + `<span class="m"><span>${c.minutes} min read</span><span>${fmtDate(c.date)}</span></span></a>`;
  });
  body = body.replace(/\{\{minutes:([a-z0-9-]+)\}\}/g, (_, slug) => String(cards[slug].minutes));
  body = body.replace(/\{\{linkedin\}\}/g, linkedinBadge());
  const conf = {
    index: { title: 'Articles: Building AI Products That Deliver on Their Promise · InfiniteGrammar',
      desc: 'Notes from building InfiniteGrammar.de: defining quality for LLM output, testing it, paying for it and running it in production.',
      url: '/articles/', current: 'articles', file: path.join(OUT, 'index.html') },
    about: { title: `About ${AUTHOR} · AI product manager who builds`,
      desc: `${AUTHOR}: AI product manager, product owner and hands-on builder.`,
      url: '/articles/about/', current: 'about', file: path.join(OUT, 'about', 'index.html') },
  }[name];
  const page = head({ title: conf.title, desc: conf.desc, canonical: `${SITE}${conf.url}`, ogType: 'website' })
    + chromeTop(conf.current) + rewriteLinks(body, `_${name}`) + chromeBottom();
  write(conf.file, page);
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`built ${path.relative(ROOT, file)}`);
}

function copyReferencedImages() {
  const used = new Set();
  for (const file of walk(OUT).filter((f) => f.endsWith('.html'))) {
    for (const [, dir, name] of fs.readFileSync(file, 'utf-8').matchAll(/\/images\/articles\/(site|diagrams)\/([^"?#]+)/g)) {
      used.add(`${dir}/${name}`);
    }
  }
  fs.rmSync(IMG_OUT, { recursive: true, force: true });
  for (const rel of used) {
    const from = path.join(DEMO, 'images', rel);
    if (!fs.existsSync(from)) throw new Error(`missing image ${rel}`);
    fs.mkdirSync(path.join(IMG_OUT, path.dirname(rel)), { recursive: true });
    fs.copyFileSync(from, path.join(IMG_OUT, rel));
  }
  console.log(`copied ${used.size} images to ${path.relative(ROOT, IMG_OUT)}`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

function main() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`Source not found: ${path.relative(ROOT, SRC)} (the articles prototype is kept locally, not in git)`);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  const metas = ORDER.map(readSrc);
  metas.forEach((m, i) => buildArticle(m, metas[i - 1] || null, metas[i + 1] || null));
  const cards = Object.fromEntries(metas.map((m) => [m.slug, {
    title: m.title, card: m.card || m.dek, track: m.track, minutes: m.minutes, date: m.date,
  }]));
  buildPage('index', cards);
  buildPage('about', cards);
  for (const asset of ['site.css', 'site.js']) {
    fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
    fs.copyFileSync(path.join(DEMO, 'assets', asset), path.join(OUT, 'assets', asset));
  }
  copyReferencedImages();

  // Sitemap entries, for public/sitemap.xml
  const lastmod = (m) => m.updated || m.date;
  const newest = metas.map(lastmod).sort().at(-1);
  console.log('\nsitemap entries:');
  console.log(`  /articles/ ${newest}`);
  console.log(`  /articles/about/ ${newest}`);
  for (const m of metas) console.log(`  ${articleUrl(m.slug)} ${lastmod(m)}`);
}

main();
