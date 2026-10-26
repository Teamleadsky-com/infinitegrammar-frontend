import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logPageView } from "@/lib/pageViews";

/** Logs each page the visitor sees (onboarding funnel; see src/lib/pageViews.ts). */
export function PageViewTracker() {
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    logPageView(pathname, user?.id);
    // the page changes, not the login state: a signup on /auth is not a new page view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLoading]);

  return null;
}
