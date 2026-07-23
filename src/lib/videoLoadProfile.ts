import type { VimeoEmbedQuality } from "@/lib/videoEmbedPlayers";

export type VideoLoadProfile = {
  /** Prefer static posters only (Save-Data / very slow networks). */
  postersOnly: boolean;
  quality: VimeoEmbedQuality;
  /** How far ahead of the viewport to start loading category iframes. */
  rootMarginPx: number;
  /** Max simultaneous Vimeo iframes (hero is exempt / priority). */
  maxConcurrent: number;
  /** Skip Player.js + loop-fade on constrained devices. */
  preferLightweight: boolean;
  isMobile: boolean;
};

function readConnection(): { saveData: boolean; slow: boolean } {
  if (typeof navigator === "undefined") return { saveData: false, slow: false };
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const effective = conn?.effectiveType ?? "";
  return {
    saveData: Boolean(conn?.saveData),
    slow: effective === "slow-2g" || effective === "2g",
  };
}

export function getVideoLoadProfile(): VideoLoadProfile {
  if (typeof window === "undefined") {
    return {
      postersOnly: false,
      quality: "720p",
      rootMarginPx: 200,
      maxConcurrent: 2,
      preferLightweight: false,
      isMobile: false,
    };
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const { saveData, slow } = readConnection();
  const postersOnly = saveData || slow;

  if (isMobile) {
    return {
      postersOnly,
      quality: "540p",
      rootMarginPx: 96,
      maxConcurrent: 1,
      preferLightweight: true,
      isMobile: true,
    };
  }

  return {
    postersOnly,
    quality: "720p",
    rootMarginPx: 220,
    maxConcurrent: 2,
    preferLightweight: false,
    isMobile: false,
  };
}

type Waiter = () => void;

let activeLoads = 0;
const waitQueue: Waiter[] = [];

function pumpQueue() {
  while (waitQueue.length > 0) {
    // Cap is re-read each time so mobile/desktop switches stay correct.
    const max = getVideoLoadProfile().maxConcurrent;
    if (activeLoads >= max) break;
    activeLoads += 1;
    const next = waitQueue.shift();
    next?.();
  }
}

/**
 * Limit how many Vimeo iframes boot at once so mobile bandwidth isn’t saturated.
 * Hero should pass `priority` to bypass the queue.
 */
export function acquireVideoLoadSlot(priority = false): Promise<() => void> {
  const release = () => {
    activeLoads = Math.max(0, activeLoads - 1);
    pumpQueue();
  };

  if (priority) {
    activeLoads += 1;
    return Promise.resolve(release);
  }

  return new Promise((resolve) => {
    waitQueue.push(() => resolve(release));
    pumpQueue();
  });
}
