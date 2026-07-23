const VIMEO_SCRIPT = "https://player.vimeo.com/api/player.js";
const YOUTUBE_SCRIPT = "https://www.youtube.com/iframe_api";

export type VimeoPlayerInstance = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  getPaused: () => Promise<boolean>;
  getDuration: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  on: (event: string, cb: (payload: { seconds: number }) => void) => void;
  off?: (event: string, cb?: (payload: { seconds: number }) => void) => void;
  destroy?: () => void | Promise<void>;
};

type VimeoPlayerCtor = new (element: HTMLIFrameElement) => VimeoPlayerInstance;

export type VimeoEmbedQuality = "auto" | "360p" | "540p" | "720p";

export function loadVimeoPlayerScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { Vimeo?: { Player?: VimeoPlayerCtor } }).Vimeo?.Player) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${VIMEO_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Vimeo script failed")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = VIMEO_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Vimeo script failed"));
    document.body.appendChild(s);
  });
}

export function createVimeoPlayer(iframe: HTMLIFrameElement): VimeoPlayerInstance | null {
  const Vimeo = (window as unknown as { Vimeo?: { Player: VimeoPlayerCtor } }).Vimeo;
  if (!Vimeo?.Player) return null;
  try {
    return new Vimeo.Player(iframe);
  } catch {
    return null;
  }
}

/** Lightweight pause/play without loading player.js (hero / mobile). */
export function postVimeoCommand(iframe: HTMLIFrameElement, method: "play" | "pause") {
  iframe.contentWindow?.postMessage(JSON.stringify({ method }), "https://player.vimeo.com");
}

/** PostMessage control for YouTube embed iframes (`enablejsapi=1` required). */
export function postYouTubeCommand(iframe: HTMLIFrameElement, func: "playVideo" | "pauseVideo") {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: "" }),
    "*",
  );
}

/** Fast static poster while the Vimeo iframe boots. */
export function vimeoPosterUrl(videoId: string, width = 1280): string {
  return `https://vumbnail.com/${videoId}.jpg?width=${width}`;
}

/**
 * Build a free-account-safe Vimeo embed URL.
 *
 * Do NOT use `background=1` — that requires a paid Vimeo plan. This account is free
 * (`account_type: free`), so background mode can fail or no-op on real mobile devices.
 */
export function buildVimeoEmbedSrc(
  videoId: string,
  {
    autoplay,
    background,
    quality,
  }: {
    autoplay: boolean;
    /** Hex without #: player chrome color (ignored on free plans). */
    background?: string;
    quality?: VimeoEmbedQuality;
  },
) {
  const params = new URLSearchParams({
    // Unique id so Player.js / postMessage can target this iframe among many.
    player_id: videoId,
    api: "1",
    app_id: "58479",
    badge: "0",
    autopause: "0",
    autoplay: autoplay ? "1" : "0",
    muted: "1",
    loop: "1",
    playsinline: "1",
    // Best-effort chromeless; free plans may ignore this.
    controls: "0",
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
  if (background) params.set("color", background);
  if (quality && quality !== "auto") params.set("quality", quality);
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

export function buildYouTubeEmbedSrc(videoId: string, { autoplay }: { autoplay: boolean }) {
  const params = new URLSearchParams({
    enablejsapi: "1",
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    rel: "0",
    controls: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/** Optional: load YT API if postMessage is unreliable (not used by default). */
export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { YT?: { Player?: unknown } }).YT?.Player) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${YOUTUBE_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const prior = (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady;
    (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
      prior?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = YOUTUBE_SCRIPT;
    s.async = true;
    document.body.appendChild(s);
  });
}
