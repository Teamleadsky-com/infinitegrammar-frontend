/**
 * Client side of /api/page-view: which pages of the app a visitor sees, in the same tab session as the
 * exercise events (src/lib/exerciseEvents.ts), for the onboarding funnel. Pathname only (no query
 * string); no cookie or storage. Fire-and-forget. Not sent for the admin area or automated browsers.
 */
import { getSessionId, isAutomated } from "./exerciseEvents";

export type PageClass = "home" | "grammar" | "exam_centers" | "exercise" | "exercise_stats" | "auth" | "account" | "other";

const API_BASE = import.meta.env.DEV ? "http://localhost:8888/api" : "/api";

/** The kind of page a pathname shows; null for pages that aren't tracked (the admin area). */
export function pageClass(pathname: string): PageClass | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/admin" || p.startsWith("/admin/")) return null;
  if (p === "/") return "home";
  if (p === "/deutsche-grammatik" || p.startsWith("/deutsche-grammatik/")) return "grammar";
  if (p === "/pruefungszentren" || p.startsWith("/pruefungszentren/")) return "exam_centers";
  if (p === "/exercise") return "exercise";
  if (p === "/exercise-stats") return "exercise_stats";
  if (p === "/auth" || p === "/verify-magic-link") return "auth";
  if (p === "/profile" || p === "/statistics" || p === "/email-preferences") return "account";
  return "other";
}

export function pageViewBody(pathname: string, userId: string | null | undefined, sessionId: string = getSessionId()) {
  const page = pageClass(pathname);
  if (!page) return null;
  return { session_id: sessionId, page, path: pathname.slice(0, 300) || "/", user_id: userId || null };
}

export function logPageView(pathname: string, userId?: string | null): void {
  if (isAutomated()) return;
  const body = pageViewBody(pathname, userId);
  if (!body) return;
  fetch(`${API_BASE}/page-view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}
