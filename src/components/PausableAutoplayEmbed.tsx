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
  /** Vimeo only: player background hex without # (e.g. `000000`). */
  vimeoBackground?: string;
  /** Defer iframe until near the viewport (category tiles below the fold). */
  loadWhenVisible?: boolean;
  /** Static image shown until the iframe is ready to paint. */
  posterSrc?: string;
  /** Prefer eager load (home hero). */
  priority?: boolean;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
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
 * Poster sits above the iframe until playback can start; iframe is never opacity-0
 * (iOS often skips iframe `load`, which previously left videos invisible).
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
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [shouldLoad, setShouldLoad] = useState(() => !loadWhenVisible);
  const [showPoster, setShowPoster] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const labelId = useId();

  const resolvedPoster =
    posterSrc || (provider === "vimeo" ? vimeoPosterUrl(videoId, priority ? 1280 : 640) : undefined);

  // Ambient / background mode on mobile + hero — faster and more reliable autoplay.
  const lightweight = provider === "vimeo" && (priority || isMobile || !vimeoLoopFade);
  const useLoopFade = vimeoLoopFade && !isMobile && !priority;

  const src = useMemo(
    () =>
      provider === "vimeo"
        ? buildVimeoEmbedSrc(videoId, {
            autoplay: !prefersReducedMotion,
            background: vimeoBackground,
            // Let Vimeo pick quality — forcing 540p can break playback on some clips.
            lightweight,
          })
        : buildYouTubeEmbedSrc(videoId, { autoplay: !prefersReducedMotion }),
    [provider, videoId, prefersReducedMotion, vimeoBackground, lightweight],
  );

  useEffect(() => {
    setIsMobile(isMobileViewport());
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lazy-load category tiles when near viewport; hero mounts immediately.
  useEffect(() => {
    if (!loadWhenVisible) {
      setShouldLoad(true);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const rootMargin = isMobile ? "180px 0px" : "280px 0px";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
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

  // Reveal video: prefer iframe load, always fall back so iOS never sticks on the poster.
  useEffect(() => {
    if (!shouldLoad) return;

    let loadTimer: number | undefined;
    let fallbackTimer: number | undefined;
    const iframe = iframeRef.current;

    const reveal = () => setShowPoster(false);

    const onLoad = () => {
      loadTimer = window.setTimeout(reveal, isMobile ? 120 : 60);
    };

    iframe?.addEventListener("load", onLoad);
    fallbackTimer = window.setTimeout(reveal, isMobile ? 1200 : 900);

    return () => {
      iframe?.removeEventListener("load", onLoad);
      if (loadTimer) window.clearTimeout(loadTimer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [shouldLoad, videoId, isMobile]);

  // Loop-fade only on desktop category tiles (needs Player.js).
  useEffect(() => {
    if (!shouldLoad || provider !== "vimeo" || !useLoopFade) return;

    let cancelled = false;
    let player: VimeoPlayerInstance | null = null;
    const el = wrapRef.current;

    const run = async () => {
      await loadVimeoPlayerScript();
      if (cancelled || !iframeRef.current || !el) return;

      player = createVimeoPlayer(iframeRef.current);
      if (!player) return;
      vimeoPlayerRef.current = player;

      if (prefersReducedMotion || isPaused) {
        try {
          await player.pause();
        } catch {
          /* ignore */
        }
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
