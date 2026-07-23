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
import { acquireVideoLoadSlot, getVideoLoadProfile } from "@/lib/videoLoadProfile";

type PausableAutoplayEmbedProps = {
  provider: "vimeo" | "youtube";
  videoId: string;
  /** Accessible name for the embed and pause control (e.g. "Lay-n-Go brand film"). */
  title: string;
  className?: string;
  iframeClassName?: string;
  /** Vimeo only: soften opacity at loop boundaries (collection cards). */
  vimeoLoopFade?: boolean;
  /** When false, no pause/play button (e.g. home hero). Defaults to true. */
  showPauseControl?: boolean;
  /** Vimeo only: player background hex without # (e.g. `000000`). */
  vimeoBackground?: string;
  /** Defer iframe until near the viewport (category tiles below the fold). */
  loadWhenVisible?: boolean;
  /** Static image shown until the iframe is ready to paint. */
  posterSrc?: string;
  /** Bypass the concurrent-load queue (home hero). */
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

function isNearViewport(el: HTMLElement, marginPx: number) {
  const rect = el.getBoundingClientRect();
  return rect.bottom >= -marginPx && rect.top <= window.innerHeight + marginPx;
}

/**
 * Autoplaying muted Vimeo/YouTube embed with a visible pause/play control (bottom-right).
 * Honors `prefers-reduced-motion` by starting paused and omitting autoplay.
 * Mobile: lower quality, fewer concurrent iframes, posters until ready.
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
  const releaseSlotRef = useRef<(() => void) | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [profile, setProfile] = useState(() => getVideoLoadProfile());
  const labelId = useId();

  const resolvedPoster =
    posterSrc || (provider === "vimeo" ? vimeoPosterUrl(videoId, priority ? 1280 : 640) : undefined);

  const useLoopFade = vimeoLoopFade && !profile.preferLightweight;
  const lightweight = provider === "vimeo" && (profile.preferLightweight || priority || !useLoopFade);

  const src = useMemo(
    () =>
      provider === "vimeo"
        ? buildVimeoEmbedSrc(videoId, {
            autoplay: !prefersReducedMotion,
            background: vimeoBackground,
            quality: profile.quality,
            lightweight,
          })
        : buildYouTubeEmbedSrc(videoId, { autoplay: !prefersReducedMotion }),
    [provider, videoId, prefersReducedMotion, vimeoBackground, profile.quality, lightweight],
  );

  useEffect(() => {
    const update = () => setProfile(getVideoLoadProfile());
    update();
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Gate iframe mount: visibility + optional concurrent slot + save-data.
  useEffect(() => {
    let cancelled = false;

    const armLoad = async () => {
      // Save-Data / 2G: keep posters only — skip all iframes including hero.
      if (profile.postersOnly) return;

      const release = await acquireVideoLoadSlot(priority || !loadWhenVisible);
      if (cancelled) {
        release();
        return;
      }
      releaseSlotRef.current = release;
      setShouldLoad(true);
    };

    if (!loadWhenVisible) {
      void armLoad();
      return () => {
        cancelled = true;
        releaseSlotRef.current?.();
        releaseSlotRef.current = null;
      };
    }

    const el = wrapRef.current;
    if (!el) return;

    const margin = profile.rootMarginPx;
    if (isNearViewport(el, margin)) {
      void armLoad();
      return () => {
        cancelled = true;
        releaseSlotRef.current?.();
        releaseSlotRef.current = null;
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void armLoad();
          io.disconnect();
        }
      },
      { root: null, rootMargin: `${margin}px 0px`, threshold: 0.01 },
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      releaseSlotRef.current?.();
      releaseSlotRef.current = null;
    };
  }, [loadWhenVisible, videoId, profile.rootMarginPx, profile.postersOnly, priority]);

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
    setIframeReady(false);
  }, [prefersReducedMotion, videoId, provider]);

  // Mark ready after iframe load so the poster covers the black Vimeo boot screen.
  useEffect(() => {
    if (!shouldLoad) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let readyTimer: number | undefined;
    const onLoad = () => {
      // Small delay lets the first video frame paint under the poster.
      readyTimer = window.setTimeout(() => setIframeReady(true), profile.isMobile ? 180 : 80);
      releaseSlotRef.current?.();
      releaseSlotRef.current = null;
    };

    iframe.addEventListener("load", onLoad);
    return () => {
      iframe.removeEventListener("load", onLoad);
      if (readyTimer) window.clearTimeout(readyTimer);
    };
  }, [shouldLoad, videoId, profile.isMobile]);

  // Loop-fade only when we intentionally load Player.js (desktop category tiles).
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

  const showPoster = Boolean(resolvedPoster) && !iframeReady;

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
      {resolvedPoster ? (
        <img
          src={resolvedPoster}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            showPoster ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          loading={priority || !loadWhenVisible ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : null}
      {shouldLoad ? (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className={cn(iframeClassName, !iframeReady && "opacity-0")}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          aria-describedby={labelId}
        />
      ) : null}
      {showPauseControl && shouldLoad ? (
        <VideoPauseButton isPaused={isPaused} onToggle={togglePause} label={title} />
      ) : null}
    </div>
  );
}
