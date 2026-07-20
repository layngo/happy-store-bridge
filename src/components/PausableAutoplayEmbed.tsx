import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { VideoPauseButton } from "@/components/VideoPauseButton";
import {
  buildVimeoEmbedSrc,
  buildYouTubeEmbedSrc,
  createVimeoPlayer,
  loadVimeoPlayerScript,
  postYouTubeCommand,
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
  /** When false, no pause/play button (e.g. home hero). Defaults to true. */
  showPauseControl?: boolean;
  /** Vimeo only: player background hex without # (e.g. `000000`). */
  vimeoBackground?: string;
  /**
   * Defer iframe src until the embed is near the viewport.
   * Use for below-fold category videos so the hero isn't competing with 6 streams.
   */
  loadWhenVisible?: boolean;
  /** Shown until the iframe is allowed to load (poster / collection image). */
  posterSrc?: string;
  /** Extra IntersectionObserver rootMargin (default 240px). */
  rootMargin?: string;
  /** Delay iframe mount even when eager (hero first-paint win). */
  deferMs?: number;
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

/**
 * Autoplaying muted Vimeo/YouTube embed with a visible pause/play control (bottom-right).
 * Honors `prefers-reduced-motion` by starting paused and omitting autoplay.
 * Optional viewport gating keeps off-screen embeds from loading until needed.
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
  rootMargin = "240px 0px",
  deferMs = 0,
}: PausableAutoplayEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerInstance | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [isNearViewport, setIsNearViewport] = useState(!loadWhenVisible);
  const [deferReady, setDeferReady] = useState(deferMs <= 0);
  const labelId = useId();

  const allowIframe = isNearViewport && deferReady;

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

  useEffect(() => {
    if (!loadWhenVisible) {
      setIsNearViewport(true);
      return;
    }

    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          // Keep loaded once revealed — avoids reload thrash while scrolling the grid.
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadWhenVisible, rootMargin, videoId]);

  useEffect(() => {
    if (deferMs <= 0) {
      setDeferReady(true);
      return;
    }

    let cancelled = false;
    let timeoutId = 0;
    const start = () => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) setDeferReady(true);
      }, deferMs);
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: deferMs + 400 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
        window.clearTimeout(timeoutId);
      };
    }

    start();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [deferMs, videoId]);

  // Pause when scrolled far away (after load) to free CPU/decode.
  useEffect(() => {
    if (!allowIframe) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (!visible) {
          setIsPaused(true);
          void syncPausedRef.current(true);
        } else if (!prefersReducedMotion) {
          setIsPaused(false);
          void syncPausedRef.current(false);
        }
      },
      { root: null, rootMargin: "80px 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [allowIframe, prefersReducedMotion, videoId]);

  const syncPaused = useCallback(
    async (paused: boolean) => {
      if (provider === "vimeo" && vimeoPlayerRef.current) {
        try {
          if (paused) await vimeoPlayerRef.current.pause();
          else await vimeoPlayerRef.current.play();
        } catch {
          /* ignore */
        }
        return;
      }
      if (provider === "youtube" && iframeRef.current) {
        postYouTubeCommand(iframeRef.current, paused ? "pauseVideo" : "playVideo");
      }
    },
    [provider],
  );

  const syncPausedRef = useRef(syncPaused);
  syncPausedRef.current = syncPaused;

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      void syncPaused(next);
      return next;
    });
  }, [syncPaused]);

  useEffect(() => {
    setIsPaused(prefersReducedMotion);
  }, [prefersReducedMotion, videoId, provider]);

  useEffect(() => {
    if (!allowIframe || provider !== "vimeo" || !vimeoLoopFade) return;

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
  }, [allowIframe, provider, vimeoLoopFade, videoId, prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (!allowIframe || provider !== "vimeo" || vimeoLoopFade) return;

    let cancelled = false;
    let player: VimeoPlayerInstance | null = null;

    const run = async () => {
      await loadVimeoPlayerScript();
      if (cancelled || !iframeRef.current) return;

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
  }, [allowIframe, provider, vimeoLoopFade, videoId, prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (!allowIframe || provider !== "youtube") return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      if (prefersReducedMotion || isPaused) {
        postYouTubeCommand(iframe, "pauseVideo");
      }
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [allowIframe, provider, videoId, prefersReducedMotion, isPaused]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative h-full w-full",
        vimeoLoopFade && "transition-opacity duration-150 ease-out",
        className,
      )}
      style={vimeoLoopFade ? { opacity: 1 } : undefined}
    >
      <p id={labelId} className="sr-only">
        {showPauseControl
          ? `${title}. Autoplaying background video. Use the pause button to stop playback.`
          : `${title}. Autoplaying background video.`}
      </p>
      {posterSrc ? (
        <img
          src={posterSrc}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            allowIframe ? "opacity-0" : "opacity-100",
          )}
          loading={loadWhenVisible ? "lazy" : "eager"}
          decoding="async"
        />
      ) : null}
      {allowIframe ? (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className={iframeClassName}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          aria-describedby={labelId}
        />
      ) : null}
      {showPauseControl && allowIframe ? (
        <VideoPauseButton isPaused={isPaused} onToggle={togglePause} label={title} />
      ) : null}
    </div>
  );
}
