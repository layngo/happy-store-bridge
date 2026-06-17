import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GA_MEASUREMENT_ID } from "@/lib/gaAnalytics";

function trackPageView(path: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}

/** Scroll window to top and notify GA4 on client-side navigation. */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
