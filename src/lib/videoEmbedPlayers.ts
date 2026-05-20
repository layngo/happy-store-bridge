const VIMEO_SCRIPT = "https://player.vimeo.com/api/player.js";
const YOUTUBE_SCRIPT = "https://www.youtube.com/iframe_api";

export type VimeoPlayerInstance = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  getDuration: () => Promise<number>;
  on: (event: string, cb: (payload: { seconds: number }) => void) => void;
  destroy?: () => void | Promise<void>;
};

type VimeoPlayerCtor = new (element: HTMLIFrameElement) => VimeoPlayerInstance;

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

/** PostMessage control for YouTube embed iframes (`enablejsapi=1` required). */
export function postYouTubeCommand(iframe: HTMLIFrameElement, func: "playVideo" | "pauseVideo") {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: "" }),
    "*",
  );
}

export function buildVimeoEmbedSrc(videoId: string, { autoplay }: { autoplay: boolean }) {
  const params = new URLSearchParams({
    badge: "0",
    autopause: "0",
    player_id: "0",
    app_id: "58479",
    autoplay: autoplay ? "1" : "0",
    muted: "1",
    loop: "1",
    controls: "0",
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });
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
