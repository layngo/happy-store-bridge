import { useEffect } from "react";
import { cn } from "@/lib/utils";

const VIMEO_PLAYER_SCRIPT = "https://player.vimeo.com/api/player.js";

/** Chromeless Vimeo nailspa clip (PDP bottom video slot). */
const NAILSPA_VIMEO_EMBED_SRC =
  "https://player.vimeo.com/video/1191237502?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1";

const SCRIPT_ID = "vimeo-player-api";

type NailspaPdpHeroVideoProps = {
  /** Fills a parent `relative aspect-video` box (bottom PDP embed). */
  variant?: "bottom" | "card";
  className?: string;
};

export function NailspaPdpHeroVideo({ variant = "card", className }: NailspaPdpHeroVideoProps) {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = VIMEO_PLAYER_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const iframe = (
    <iframe
      src={NAILSPA_VIMEO_EMBED_SRC}
      title=""
      className={cn(
        "h-full w-full border-0 select-none",
        variant === "bottom"
          ? "absolute inset-0 pointer-events-auto"
          : "pointer-events-none absolute inset-0",
      )}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-hidden
    />
  );

  if (variant === "bottom") {
    return iframe;
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/15 sm:rounded-2xl",
        "aspect-[4/3]",
        className,
      )}
    >
      {iframe}
    </div>
  );
}
