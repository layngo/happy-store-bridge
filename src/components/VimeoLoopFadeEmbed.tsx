import { useEffect, useRef } from "react";

const VIMEO_SCRIPT = "https://player.vimeo.com/api/player.js";

const VIMEO_QUERY =
  "badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1";

function loadVimeoScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { Vimeo?: { Player?: unknown } }).Vimeo?.Player) return Promise.resolve();
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

type VimeoPlayer = {
  getDuration: () => Promise<number>;
  on: (event: string, cb: (payload: { seconds: number }) => void) => void;
  destroy?: () => void | Promise<void>;
};

type VimeoPlayerCtor = new (element: HTMLIFrameElement) => VimeoPlayer;

interface VimeoLoopFadeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Vimeo iframe with gentle opacity dip at loop boundaries so restarts feel less abrupt.
 */
export function VimeoLoopFadeEmbed({ videoId, title, className }: VimeoLoopFadeEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    let player: VimeoPlayer | null = null;

    const run = async () => {
      await loadVimeoScript();
      if (cancelled || !iframeRef.current || !wrapRef.current) return;

      const Vimeo = (window as unknown as { Vimeo?: { Player: VimeoPlayerCtor } }).Vimeo;
      if (!Vimeo?.Player) return;

      const el = wrapRef.current;
      const iframe = iframeRef.current;

      try {
        player = new Vimeo.Player(iframe);
      } catch {
        return;
      }

      let duration = 0;
      try {
        duration = await player.getDuration();
      } catch {
        duration = 0;
      }

      const fadeSeconds = Math.min(0.65, Math.max(0.35, duration ? duration * 0.12 : 0.5));
      const minOpacity = 0.18;
      let prevSeconds = 0;

      player.on("timeupdate", ({ seconds }) => {
        if (cancelled || !duration) {
          el.style.opacity = "1";
          return;
        }

        const wrapped = prevSeconds > 1 && seconds < prevSeconds - 0.25;
        if (wrapped) {
          const k = Math.min(1, Math.max(0, seconds / fadeSeconds));
          el.style.opacity = String(minOpacity + (1 - minOpacity) * k);
        } else if (duration - seconds <= fadeSeconds) {
          const k = Math.min(1, Math.max(0, (duration - seconds) / fadeSeconds));
          el.style.opacity = String(minOpacity + (1 - minOpacity) * k);
        } else {
          el.style.opacity = "1";
        }

        prevSeconds = seconds;
      });
    };

    void run();

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [videoId]);

  const src = `https://player.vimeo.com/video/${videoId}?${VIMEO_QUERY}`;

  return (
    <div ref={wrapRef} className={`transition-opacity duration-150 ease-out ${className ?? ""}`} style={{ opacity: 1 }}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        frameBorder={0}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="pointer-events-none absolute inset-0 h-full w-full"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
