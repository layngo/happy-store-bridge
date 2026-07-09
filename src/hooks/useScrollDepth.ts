import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 90] as const;

/** Fire scroll_depth at 25/50/75/90% and reset on each SPA route change. */
export function useScrollDepth() {
  const { pathname, search } = useLocation();
  const fired = useRef(new Set<number>());

  useEffect(() => {
    fired.current.clear();

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const percent = Math.round((window.scrollY / max) * 100);
      for (const milestone of MILESTONES) {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          trackEvent("scroll_depth", { percent: milestone });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, search]);
}
