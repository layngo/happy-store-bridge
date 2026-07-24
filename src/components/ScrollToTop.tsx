import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GA_MEASUREMENT_ID } from "@/lib/gaAnalytics";
import { resetMetaPixelNavigationDedupe, trackMetaPageView } from "@/lib/metaPixel";

function trackGaPageView(path: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}

/** Scroll window to top and notify GA4 + Meta Pixel on client-side navigation. */
export function ScrollToTop() {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const path = `${pathname}${search}`;
    trackGaPageView(path);

    if (isFirst.current) {
      isFirst.current = false;
      // Base pixel snippet already fired PageView — seed dedupe so SPA doesn't double it.
      resetMetaPixelNavigationDedupe();
      return;
    }

    resetMetaPixelNavigationDedupe();
    trackMetaPageView();
  }, [pathname, search]);

  return null;
}
