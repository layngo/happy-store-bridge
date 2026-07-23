import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { VideoPauseButton } from "@/components/VideoPauseButton";
import {
  buildVimeoEmbedSrc,
  buildYouTubeEmbedSrc,
  createVimeoPlayer,
  loadVimeoPlayerScript,
  postVimeoCommand,
  postYouTubeCommand,
  vimeoPosterUrl,
  type VimeoPlayerInstance,
} from "@/lib/videoEmbedPlayers";

type PausableAutoplayEmbedProps = {
  provider: "vimeo" | "youtube";
  videoId: string;
  /** Accessible name for the embed and pause control (e.g. "Lay-n-Go brand film"). */
  title: string;
  className?: string;
  iframeClassName?: string;
  /** Vimeo only: soften opacity at loop boundaries (collection cards). */
  vimeoLoopFade?: boolean;
  /** When false, no pause/play button. Defaults to true. */
  showPauseControl?: boolean;
  /** Vimeo only: player chrome hex without # (e.g. `000000`). */
  vimeoBackground?: string;
  /** Defer iframe until near the viewport (category tiles below the fold). */
  loadWhenVisible?: boolean;
  /** Static image shown until the iframe is ready to paint. */
  posterSrc?: string;
  /** Prefer eager load (home hero). */
  priority?: boolean;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/**
 * Autoplaying muted Vimeo/YouTube embed.
 * Uses free-account-safe Vimeo params (no paid-only `background=1`) and Player.js
 * to re-trigger play on iOS after the iframe is ready.
 */
export function PausableAutoplayEmbed({
  provider,
  videoId,
  title,
  className,
  iframeClassName = "absolute inset-0 h-full w-full border-0",
  vimeoLoopFade = false,
  showPauseControl = true,
  vimeoBackground,
  loadWhenVisible = false,
  posterSrc,
  priority = false,
}: PausableAutoplayEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerInstance | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Init from matchMedia immediately — flipping later used to rebuild the iframe src
  // after mount, which kills iOS autoplay.
  const [isMobile] = useState(() => isMobileViewport());
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [shouldLoad, setShouldLoad] = useState(() => !loadWhenVisible);
  const [showPoster, setShowPoster] = useState(true);
  const labelId = useId();

  const resolvedPoster =
    posterSrc || (provider === "vimeo" ? vimeoPosterUrl(videoId, priority ? 1280 : 640) : undefined);

  const useLoopFade = vimeoLoopFade && !isMobile && !priority;

  const src = useMemo(
    () =>
      provider === "vimeo"
        ? buildVimeoEmbedSrc(videoId, {
            autoplay: !prefersReducedMotion,
            background: vimeoBackground,
          })
        : buildYouTubeEmbedSrc(videoId, { autoplay: !prefersReducedMotion }),
    [provider, videoId, prefersReducedMotion, vimeoBackground],
  );

  // Lazy-load category tiles when near viewport; hero mounts immediately.
  useEffect(() => {
    if (!loadWhenVisible) {
      setShouldLoad(true);
      return;
    }

    const marginPx = isMobile ? 220 : 280;

    const isNearViewport = (node: HTMLElement) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom >= -marginPx && rect.top <= window.innerHeight + marginPx;
    };

    let io: IntersectionObserver | undefined;
    let raf = 0;

    const arm = (el: HTMLElement) => {
      // Sync check first — IntersectionObserver sometimes skips already-visible nodes
      // (esp. absolute-positioned tiles after late collection data mounts).
      if (isNearViewport(el)) {
        setShouldLoad(true);
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setShouldLoad(true);
            io?.disconnect();
          }
        },
        { root: null, rootMargin: `${marginPx}px 0px`, threshold: 0 },
      );
      io.observe(el);
    };

    const el = wrapRef.current;
    if (el) {
      arm(el);
    } else {
      // Ref can be unset for one frame when cards mount after async collection fetch.
      raf = requestAnimationFrame(() => {
        if (wrapRef.current) arm(wrapRef.current);
        else setShouldLoad(true);
      });
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [loadWhenVisible, videoId, isMobile]);

  const syncPaused = useCallback(
    async (paused: boolean) => {
      if (provider === "vimeo") {
        if (vimeoPlayerRef.current) {
          try {
            if (paused) await vimeoPlayerRef.current.pause();
            else await vimeoPlayerRef.current.play();
          } catch {
            /* ignore */
          }
          return;
        }
        if (iframeRef.current) {
          postVimeoCommand(iframeRef.current, paused ? "pause" : "play");
        }
        return;
      }
      if (provider === "youtube" && iframeRef.current) {
        postYouTubeCommand(iframeRef.current, paused ? "pauseVideo" : "playVideo");
      }
    },
    [provider],
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      void syncPaused(next);
      return next;
    });
  }, [syncPaused]);

  useEffect(() => {
    setIsPaused(prefersReducedMotion);
    setShowPoster(true);
  }, [prefersReducedMotion, videoId, provider]);

  // Reveal poster on a timer so we never stick on a frozen poster if load never fires.
  useEffect(() => {
    if (!shouldLoad) return;

    let loadTimer: number | undefined;
    let fallbackTimer: number | undefined;
    const iframe = iframeRef.current;

    const reveal = () => setShowPoster(false);

    const onLoad = () => {
      loadTimer = window.setTimeout(reveal, isMobile ? 180 : 80);
    };

    iframe?.addEventListener("load", onLoad);
    fallbackTimer = window.setTimeout(reveal, isMobile ? 1800 : 1000);

    return () => {
      iframe?.removeEventListener("load", onLoad);
      if (loadTimer) window.clearTimeout(loadTimer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [shouldLoad, videoId, isMobile]);

  // Player.js: force muted play (iOS often ignores URL autoplay alone) + optional loop fade.
  useEffect(() => {
    if (!shouldLoad || provider !== "vimeo") return;

    let cancelled = false;
    let player: VimeoPlayerInstance | null = null;
    let retryTimer: number | undefined;
    const el = wrapRef.current;

    const run = async () => {
      try {
        await loadVimeoPlayerScript();
      } catch {
        return;
      }
      if (cancelled || !iframeRef.current) return;

      player = createVimeoPlayer(iframeRef.current);
      if (!player) return;
      vimeoPlayerRef.current = player;

      try {
        await player.setVolume(0);
      } catch {
        /* ignore */
      }

      const tryPlay = async () => {
        if (cancelled || prefersReducedMotion || isPaused) return;
        try {
          await player!.play();
          setShowPoster(false);
        } catch {
          // iOS sometimes rejects the first play(); retry once shortly after.
          retryTimer = window.setTimeout(() => {
            void player
              ?.play()
              .then(() => setShowPoster(false))
              .catch(() => {
                /* leave poster / first frame */
              });
          }, 350);
        }
      };

      if (prefersReducedMotion || isPaused) {
        try {
          await player.pause();
        } catch {
          /* ignore */
        }
      } else {
        await tryPlay();
      }

      if (!useLoopFade || !el) return;

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
        if (cancelled || !duration || isPaused) {
          if (el) el.style.opacity = "1";
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
      if (retryTimer) window.clearTimeout(retryTimer);
      vimeoPlayerRef.current = null;
      try {
        player?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [shouldLoad, provider, useLoopFade, videoId, prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (!shouldLoad || provider !== "youtube") return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      if (prefersReducedMotion || isPaused) {
        postYouTubeCommand(iframe, "pauseVideo");
      }
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [shouldLoad, provider, videoId, prefersReducedMotion, isPaused]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative h-full w-full",
        useLoopFade && "transition-opacity duration-150 ease-out",
        className,
      )}
      style={useLoopFade ? { opacity: 1 } : undefined}
    >
      <p id={labelId} className="sr-only">
        {showPauseControl
          ? `${title}. Autoplaying background video. Use the pause button to stop playback.`
          : `${title}. Autoplaying background video.`}
      </p>
      {shouldLoad ? (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className={cn(iframeClassName, "z-0")}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share; accelerometer; gyroscope"
          referrerPolicy="strict-origin-when-cross-origin"
          aria-describedby={labelId}
        />
      ) : null}
      {resolvedPoster ? (
        <img
          src={resolvedPoster}
          alt=""
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300",
            showPoster || !shouldLoad ? "opacity-100" : "opacity-0",
          )}
          loading={priority || !loadWhenVisible ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : null}
      {showPauseControl && shouldLoad ? (
        <VideoPauseButton isPaused={isPaused} onToggle={togglePause} label={title} />
      ) : null}
    </div>
  );
}
