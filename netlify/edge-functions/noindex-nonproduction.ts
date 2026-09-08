import type { Context } from "@netlify/edge-functions";

// TECH-010: the Netlify deploy is reachable on more than one host. Only the
// custom domain is canonical; the default `*.netlify.app` subdomain, Deploy
// Previews and branch deploys serve a byte-identical duplicate of production
// (scripts/prerender.js emits one host-agnostic artifact), so without an
// explicit signal they are independently indexable.
//
// This is expressed as a DENYLIST of non-production hosts rather than an
// allowlist of production ones so that it fails safe: a host that matches
// nothing here -- a newly added custom domain, an apex/www variant, a domain
// migration -- is treated as production and left untouched. The inverse would
// silently `noindex` the real site the moment the list went stale.
const NON_PRODUCTION_HOST_SUFFIXES = [".netlify.app"];

// Exact hosts used by `netlify dev` / local edge-function runs.
const NON_PRODUCTION_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function isNonProductionHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (NON_PRODUCTION_HOSTS.has(host)) {
    return true;
  }

  return NON_PRODUCTION_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

// `Response.redirect()` returns a response with immutable headers (the
// trailing-slash edge function returns exactly that), so the directive is
// applied to a copy rather than mutated in place.
export function withNoindex(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async (request: Request, context: Context) => {
  const response = await context.next();

  // Production hosts get the upstream response object back untouched -- the
  // rewrap below is unreachable for the canonical domain.
  if (!isNonProductionHost(new URL(request.url).hostname)) {
    return response;
  }

  return withNoindex(response);
};

export const config = {
  path: "/*",
  excludedPath: ["/api/*", "/.netlify/*"],
};
