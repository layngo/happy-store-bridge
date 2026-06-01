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
}: PausableAutoplayEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerInstance | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const labelId = useId();

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
    if (provider !== "vimeo" || !vimeoLoopFade) return;

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
  }, [provider, vimeoLoopFade, videoId, prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (provider !== "vimeo" || vimeoLoopFade) return;

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
  }, [provider, vimeoLoopFade, videoId, prefersReducedMotion, isPaused]);

  useEffect(() => {
    if (provider !== "youtube") return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      if (prefersReducedMotion || isPaused) {
        postYouTubeCommand(iframe, "pauseVideo");
      }
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [provider, videoId, prefersReducedMotion, isPaused]);

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
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={iframeClassName}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        aria-describedby={labelId}
      />
      {showPauseControl ? (
        <VideoPauseButton isPaused={isPaused} onToggle={togglePause} label={title} />
      ) : null}
    </div>
  );
}
