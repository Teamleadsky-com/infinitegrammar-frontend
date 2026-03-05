# SEO-Optimized React + Vite + Netlify: Day 1 Setup Guide

> How to build a React SPA on Netlify that doesn't need months of SEO fixes.
> Stack: React 18, Vite, React Router v6, react-helmet-async, Netlify.

---

## 1. Project Structure

### DO from day 1:
- **Split your site into two surfaces:**
  - **Indexable content**: `/content/...` (must be prerendered to real HTML files)
  - **Non-indexable app**: `/app/...` (auth/profile/exercises/admin; SPA-only)
- Decide on a trailing slash convention (`/page/` or `/page`) and enforce it **everywhere** — routes, links, sitemap, canonical tags, prerender list
- Put all SEO-critical content pages on static, descriptive URL paths (not behind query params)
- Keep user/dynamic pages on separate paths from content pages (**prefer `/app/...`**)

### DON'T:
- Don't use query parameters for indexable content (`/exercise?level=...` creates URL variations that pollute indexes)
- Don't use a site-wide SPA fallback (`/* -> /index.html 200`) if you also care about SEO content: it turns unknown URLs into **soft-404s** (200 status with "not found" UI)

---

## 2. Prerendering

> SPAs leave HTML mostly empty; many crawlers/tools/AI agents don't run JavaScript, so prerendering matters from day 1.

### DO from day 1:
- Set up Puppeteer prerendering as part of `npm run build` from the start (or use Netlify's Prerender extension if you want a managed solution)
- **Auto-generate the prerender page list from your data source** — never hardcode it. It drifts from reality as soon as you add new content. Generate the list from the same data source that defines your routes (e.g., topics, city pages)
- **Add a "prerender readiness" signal** so Puppeteer snapshots *after* data + UI are actually rendered
- Validate prerender output:
  - `<title>` exists and is unique
  - `<meta name="description">` exists
  - `<link rel="canonical">` exists
  - exactly one `<h1>` exists
  - page does **not** contain skeleton text like "Loading..."
- Prerender every page that appears in your sitemap — no exceptions
- Output a real `404.html` page in `dist/404.html`

```js
// GOOD: auto-generated from the same data that defines your routes
import { topics } from '../src/data/topics';

const PAGES = [
  '/',
  ...topics.map(t => `/content/${t.level}/${t.slug}/`),
];
```

### "Prerender Ready" contract (must-have)
On every prerendered content page, set an explicit marker once content is rendered:

```jsx
useEffect(() => {
  // when data is loaded + UI is ready:
  document.documentElement.dataset.prerenderReady = 'true';
}, [isReady]);
```

Then in Puppeteer, wait for `html[data-prerender-ready="true"]` instead of `networkidle0` + arbitrary timeouts.

### Netlify + Chromium note
Puppeteer often needs Chromium available in the Netlify build environment. A common approach is installing Netlify's Chromium build plugin/integration (sets `CHROME_PATH`).

### DON'T:
- Don't maintain a hardcoded list of pages to prerender — it drifts immediately
- Don't assume "I'll add prerendering later" — by then Google may have indexed empty/skeleton HTML
- Don't snapshot before async data renders (you'll prerender "Loading...")

---

## 3. React Router

### DO from day 1:
- Put routes with static path segments BEFORE parameterized routes (even though v6 uses specificity scoring, clarity wins)
- Put the `*` catch-all route LAST
- Use a `<ScrollToTop />` component inside `<BrowserRouter>`
- Every `<Link to=...>` must use the canonical URL form (with your chosen trailing slash)

```jsx
// Clear, explicit ordering: static segments first, params second, catch-all last
<Route path="/content/category/:cat" />
<Route path="/content/:level/:slug" />
<Route path="/content/:level" />
<Route path="*" element={<NotFound />} />
```

### DON'T:
- Don't rely on "it probably matches the right one" — keep routing unambiguous
- Don't let the `/app/*` surface leak into `/content/*` (keep SEO and app concerns separate)
- Don't forget that `/content/category/topic` matches BOTH `/content/category/:cat` and `/content/:level/:slug`

---

## 4. Auth Guards in Protected Pages

### DO from day 1:
- Always check `isLoading` from your auth context BEFORE checking auth state
- Guard both the `useEffect` AND the render return

```jsx
const { user, isLoading } = useAuth();

useEffect(() => {
  if (isLoading) return;           // wait for auth to load
  if (!user) navigate('/app/auth/');  // only redirect after loading done
}, [user, isLoading]);

if (isLoading || !user) return null;  // don't flash content
return <ProtectedContent />;
```

### DON'T:
- Don't check `user`/`isAuthenticated` without first checking `isLoading` — on initial render, `user` is always `null` while auth restores from localStorage, causing an immediate false redirect
- Don't apply this pattern to only some protected pages — every page that checks auth has the same race condition

---

## 5. React Helmet (Meta Tags)

### DO from day 1:
- Use `react-helmet-async` (not `react-helmet`) with `<HelmetProvider>` wrapping your app
- Every **indexable content page** sets:
  - unique `<title>`
  - `<meta name="description">`
  - `<link rel="canonical">`
  - OG tags (at least `og:title`, `og:description`, `og:url`)
- Build canonical URLs from route data + your known base URL — not `window.location`
- Add `<meta name="robots" content="noindex,follow">` to **non-indexable app pages** (`/app/*`) as a backup
- Set `<html lang="de">` (or correct language) in Helmet

### Must-have: base URL must be environment-aware
- Use production domain for production builds
- Use deploy-preview/branch URL for previews (so canonical/OG are correct when QA shares preview links)

```jsx
const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://www.example.com';

// On every content page:
<Helmet>
  <title>{topic.title} | Brand</title>
  <meta name="description" content={topic.description} />
  <link rel="canonical" href={`${BASE_URL}/content/${topic.level}/${topic.slug}/`} />
  <meta property="og:title" content={topic.title} />
  <meta property="og:url" content={`${BASE_URL}/content/${topic.level}/${topic.slug}/`} />
</Helmet>

// On every NON-indexable page:
<Helmet>
  <meta name="robots" content="noindex,follow" />
</Helmet>
```

### DON'T:
- Don't put static OG/meta tags in `index.html` that Helmet will also set — you'll get duplicates
- Don't use `window.location.href` as canonical — it reflects whatever URL the user typed, including non-canonical variants
- Don't forget to set Helmet on EVERY page — SPA navigation from Page A to Page B keeps Page A's tags if Page B has no Helmet
- Don't rely on Helmet `noindex` alone for `/app/*` — some crawlers won't execute JS. Use HTTP headers too (see section 12)

---

## 6. useEffect & Strict Mode

### DO from day 1:
- Use a `useRef` guard for one-time side effects (tracking, analytics pings)
- Make backend endpoints idempotent (`COALESCE`, `ON CONFLICT`, idempotency keys)

```jsx
const sentRef = useRef(false);

useEffect(() => {
  if (token && !sentRef.current) {
    sentRef.current = true;
    fetch('/api/track', { method: 'POST', body: JSON.stringify({ token }) });
  }
}, [token]);
```

### DON'T:
- Don't fire-and-forget API calls in `useEffect` without a guard — React 18 Strict Mode double-invokes effects in development

---

## 7. Hydration

### DO from day 1:
- Read `localStorage` / `sessionStorage` in `useEffect`, never during initial render
- Ensure prerendered HTML matches the first client render (no auth-dependent structural differences)

```jsx
// GOOD: consistent initial render, then update
const [user, setUser] = useState(null);
useEffect(() => {
  setUser(JSON.parse(localStorage.getItem('user')));
}, []);

// BAD: hydration mismatch — prerender has null, client has user immediately
const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
```

### DON'T:
- Don't conditionally render major DOM structures based on state that differs between prerender (Puppeteer) and client (real browser with localStorage)

---

## 8. netlify.toml Redirects (SEO-safe)

### DO from day 1:
- **Rewrite only your app surface** (`/app/*`) to `index.html` — not the entire site
- Keep content surface (`/content/*`) as **real HTML files** (prerendered)
- Order redirects: **domain canonicalization → API routes → static files → specific redirects → wildcard redirects → app-only SPA fallback**
- Use `status = 301` for permanent redirects, `status = 200` for rewrites
- Every old URL maps to its final destination in ONE hop (no chains)
- Use `force = true` only for domain canonicalization (where redirect must override static files)

```toml
# 1. Domain canonical (force=true overrides static files)
[[redirects]]
  from = "https://example.com/*"
  to = "https://www.example.com/:splat"
  status = 301
  force = true

# 2. API proxy
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# 3. Static files that must not fall through
[[redirects]]
  from = "/sitemap.xml"
  to = "/sitemap.xml"
  status = 200
  force = true

[[redirects]]
  from = "/robots.txt"
  to = "/robots.txt"
  status = 200
  force = true

# 4. Specific URL redirects (old → new)
[[redirects]]
  from = "/old/specific/page"
  to = "/content/new/specific/page/"
  status = 301

# 5. Wildcard redirects
[[redirects]]
  from = "/old/*"
  to = "/content/new/:splat"
  status = 301

# 6. SPA fallback — APP ONLY (not global!)
[[redirects]]
  from = "/app/*"
  to = "/index.html"
  status = 200
```

### DON'T:
- Don't use a global `/* -> /index.html 200` — it turns unknown URLs into soft-404s (200 status with "not found" UI), which Google penalizes
- Don't put SPA fallback before specific redirects — first match wins, it will swallow everything
- Don't create redirect chains (A → B → C) — combine into A → C
- Don't use `force = true` on the SPA fallback — it would override prerendered static files

---

## 9. Netlify Scheduled Functions

### DO from day 1:
- Prefer the modern pattern: `export const config = { schedule: "..." }` in the function file itself
- Keep work within synchronous function limits; use background functions for long-running tasks

```ts
import type { Config } from '@netlify/functions';

export default async () => {
  // do work
};

export const config: Config = {
  schedule: "0 * * * *",
};
```

### DON'T:
- Don't import `schedule` from `@netlify/functions` as a wrapper — it requires the package to be explicitly installed and bundled, which can fail on Netlify's esbuild
- Don't `sleep()` in loops — redesign as batch work or use background functions
- Don't assume a fixed timeout limit — limits vary by function type/runtime/plan. Design for short, reliable execution

---

## 10. Sitemap

### DO from day 1:
- Auto-generate `sitemap.xml` during build from your data source
- Use real `<lastmod>` dates per URL (not the same date for all)
- Sitemap URLs must exactly match canonical URLs (protocol, domain, trailing slash)
- Only list pages that are indexable (not blocked by `robots.txt` or `noindex`)

### DON'T:
- Don't maintain sitemap.xml by hand — it drifts immediately
- Don't set all `<lastmod>` to today — Google learns to ignore your lastmod values

---

## 11. robots.txt

### DO from day 1:
- Block all app-only pages (best: block the entire `/app/` surface in one rule)
- Include the sitemap location
- Allow social media crawlers for OG tag previews

```
User-agent: *
Disallow: /app/

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

### DON'T:
- Don't assume robots.txt prevents indexing — it primarily prevents crawling. Use `noindex` (Helmet + HTTP headers) for pages that might be discovered via external links
- Don't forget to block `/app/exercise` or equivalent — query params create infinite URL variations that waste crawl budget

---

## 12. Headers (`_headers` file or `netlify.toml`)

### DO from day 1:
- Create `public/_headers` with caching, security, and indexing rules:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache, must-revalidate

/app/*
  X-Robots-Tag: noindex

/sitemap.xml
  Cache-Control: public, max-age=3600
  Content-Type: application/xml

/robots.txt
  Cache-Control: public, max-age=3600
  Content-Type: text/plain

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### DON'T:
- Don't cache HTML aggressively — deploys won't take effect until cache expires
- Don't rely only on Helmet for `noindex` in `/app/*` — HTTP header `X-Robots-Tag: noindex` is crawler-proof (works even when JS doesn't execute)
- Don't set `X-Robots-Tag: noindex` on `sitemap.xml` — the sitemap is not a page, and noindexing it can confuse some crawlers about whether to trust its contents

---

## 13. index.html

### DO from day 1:
- Set `<html lang="de">` (or correct language)
- Keep it minimal — let Helmet handle per-page meta tags
- Put third-party `<noscript>` tags with `<div>`/`<img>` in `<body>`, not `<head>`

### DON'T:
- Don't put `<noscript><div>...</div></noscript>` inside `<head>` — Vite's HTML parser (parse5) rejects flow content in `<head>`, even inside `<noscript>`. Build fails with `disallowed-content-in-noscript-in-head`
- Don't put static OG tags in `index.html` that every page will also set via Helmet

---

## 14. Structured Data (JSON-LD)

### DO from day 1:
- Add JSON-LD schema to content pages (Article, BreadcrumbList, FAQPage, etc.)
- Use real dates for `datePublished` / `dateModified` — pull from data, not hardcoded
- Add BreadcrumbList to ALL content pages consistently

### DON'T:
- Don't hardcode stale publish dates — they become wrong and Google notices
- Don't add schema to some content pages but not others — inconsistency weakens the signal

---

## Quick Reference: The Mistakes That Cost Weeks

| # | Mistake | Symptom | Prevention |
|---|---------|---------|------------|
| 1 | Global SPA fallback `/* -> /index.html 200` | Soft-404s in Google Search Console | Rewrite **only** `/app/*` |
| 2 | Hardcoded prerender page list | New pages not indexed | Auto-generate from data |
| 3 | No "prerender ready" signal | Prerender captures "Loading..." | Wait for explicit marker |
| 4 | `<noscript><div>` in `<head>` | Vite build fails | Put flow content in `<body>` |
| 5 | All sitemap `<lastmod>` identical | Google ignores lastmod | Use real per-page dates |
| 6 | Relying on Helmet `noindex` only | App pages still indexed by non-JS crawlers | Add `X-Robots-Tag: noindex` header for `/app/*` |
| 7 | Canonical URL from `window.location` | Non-canonical variants indexed | Build from route data + base URL |
| 8 | Trailing slash inconsistency | Duplicate content | Pick one convention, enforce everywhere |
| 9 | `X-Robots-Tag: noindex` on sitemap.xml | Crawlers distrust sitemap | Don't noindex the sitemap |
| 10 | Auth guard without `isLoading` check | Protected page redirects on load | Check `isLoading` before `user` |
| 11 | Redirect chains (A → B → C) | Wasted crawl budget | One-hop redirects only |
| 12 | `schedule()` import from `@netlify/functions` | Build fails on Netlify | Use `export const config` pattern |
| 13 | `sleep()` in Netlify function loops | Function times out | Remove delays or use background functions |
