# SEO & Functional Regression Foundation

Deterministic foundation for classifying routes and regression-testing them, built for `PILOT-002`. This document is intentionally brief — it covers only what exists in this foundation, not broader SEO strategy.

## Route classes

Every route resolves to exactly one of:

- **`SEO_DRIVER`** — ranking-oriented pages (homepage, grammar reference, articles, testing centres). Expected to be indexable, canonical, titled, described, and to have meaningful content.
- **`APP_FUNCTIONAL`** — application routes (exercise, exercise statistics, auth, profile, admin). Judged on working application behavior, not ranking-page content.
- **`SYSTEM`** — infrastructure routes (`robots.txt`, sitemap, redirects, `/api/*`). Judged with route-specific checks, not page checks.
- **`UNKNOWN`** — the fallback for any route with no explicit rule. **Fails closed**: it is never assumed indexable or non-indexable, and no autonomous SEO-treatment decision is made for it. A route must be explicitly classified before its SEO treatment can change.

## Where the rules and samples live

- `config/seo-route-classes.json` — version-controlled exact-path and wildcard classification rules, plus the documented precedence algorithm (normalize → exact rules → wildcard rules → `UNKNOWN` fallback).
- `scripts/seo/routeClassifier.js` — the deterministic classifier module that loads that config and applies it. No LLM, page content, or runtime heuristic is involved in classification.
- `config/seo-golden-routes.json` — a small, version-controlled set of real repository routes (one per required category: homepage, grammar, article, testing centre, exercise, exercise statistics, auth/account, robots.txt, sitemap, redirect, API/system, nonexistent), each with its expected class and only the expectations valid for that class.
- `scripts/seo/goldenRouteChecker.js` — loads and validates the golden-route config, confirms each sample's declared class agrees with the classifier, and applies class-appropriate checks against injected/fixture responses (no live network calls).

## npm commands

| Command | Scope |
|---|---|
| `npm run test:route-classifier` | Unit tests for the classifier only (`scripts/seo/routeClassifier.test.ts`) |
| `npm run test:seo-routes` | Classifier tests + golden-route contract tests (`routeClassifier.test.ts`, `goldenRouteChecker.test.ts`) |
| `npm run test:browser-harness` | Homepage proof-of-life browser test (`e2e/browser-harness.spec.ts`) |
| `npm run test:functional-smoke` | Fallback-path smoke tests for exercise, exercise-statistics, and auth routes (`e2e/functional-smoke.spec.ts`) — exercised without Netlify Functions running, so these validate the app's existing deterministic fallback/loading behavior |
| `npm run test:functional-data` | API-backed rendering and one in-app navigation test (`e2e/functional-data.spec.ts`), using deterministic Playwright request interception to simulate a successful backend response |
| `npm run test:seo-foundation` | Runs the above in sequence: `test:seo-routes` → `test:browser-harness` → `test:functional-smoke` → `test:functional-data` |

## Fallback vs. API-backed browser tests

- `test:functional-smoke` runs against the plain Vite dev server with no Netlify Functions available, so `/exercise` and `/exercise-stats` are validated against their existing fallback behavior (mock data / empty stable view) rather than live data.
- `test:functional-data` uses Playwright's `page.route()` interception to fulfil the exact API endpoints those pages call with a deterministic successful payload, proving the API-backed rendering path works without a live or shared database.

## What this foundation does not validate

Real deployed backend behavior (actual Netlify Functions, actual database content, actual production robots/indexability state) is out of scope here and is validated later through separate Deploy Preview and production smoke checks, not by this local foundation.
