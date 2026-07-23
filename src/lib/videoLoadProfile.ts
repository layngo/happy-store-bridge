import type { VimeoEmbedQuality } from "@/lib/videoEmbedPlayers";

export type VideoLoadProfile = {
  /** Prefer static posters only (Save-Data). */
  postersOnly: boolean;
  quality: VimeoEmbedQuality;
  /** How far ahead of the viewport to start loading category iframes. */
  rootMarginPx: number;
  /** Max simultaneous category Vimeo iframes (hero never consumes a slot). */
  maxConcurrent: number;
  /** Skip Player.js + loop-fade on constrained devices. */
  preferLightweight: boolean;
  isMobile: boolean;
};

function readConnection(): { saveData: boolean } {
  if (typeof navigator === "undefined") return { saveData: false };
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  return { saveData: Boolean(conn?.saveData) };
}

export function getVideoLoadProfile(): VideoLoadProfile {
  if (typeof window === "undefined") {
    return {
      postersOnly: false,
      quality: "720p",
      rootMarginPx: 280,
      maxConcurrent: 3,
      preferLightweight: false,
      isMobile: false,
    };
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const { saveData } = readConnection();

  if (isMobile) {
    return {
      postersOnly: saveData,
      quality: "540p",
      rootMarginPx: 240,
      maxConcurrent: 3,
      preferLightweight: true,
      isMobile: true,
    };
  }

  return {
    postersOnly: saveData,
    quality: "720p",
    rootMarginPx: 280,
    maxConcurrent: 3,
    preferLightweight: false,
    isMobile: false,
  };
}

type Waiter = () => void;

let activeLoads = 0;
const waitQueue: Waiter[] = [];

function pumpQueue() {
  while (waitQueue.length > 0) {
    const max = getVideoLoadProfile().maxConcurrent;
    if (activeLoads >= max) break;
    activeLoads += 1;
    const next = waitQueue.shift();
    next?.();
  }
}

/**
 * Stagger category iframe boots. Priority (hero) never consumes a queue slot
 * so it cannot block Shop-by-Category videos.
 */
export function acquireVideoLoadSlot(priority = false): Promise<() => void> {
  if (priority) {
    return Promise.resolve(() => {});
  }

  const release = () => {
    activeLoads = Math.max(0, activeLoads - 1);
    pumpQueue();
  };

  return new Promise((resolve) => {
    waitQueue.push(() => resolve(release));
    pumpQueue();
  });
}
