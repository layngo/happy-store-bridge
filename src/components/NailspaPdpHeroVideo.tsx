import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const NAILSPA_VIMEO_ID = "1191237502";

/** Crop Vimeo letterboxing — video is ~16:9 inside our 4:3 frame. */
const NAILSPA_IFRAME_COVER =
  "absolute left-1/2 top-1/2 h-full w-[133.333%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0";

type NailspaPdpHeroVideoProps = {
  /** Fills a parent `relative aspect-video` box (bottom PDP embed). */
  variant?: "bottom" | "card";
  className?: string;
};

export function NailspaPdpHeroVideo({ variant = "card", className }: NailspaPdpHeroVideoProps) {
  const embed = (
    <PausableAutoplayEmbed
      provider="vimeo"
      videoId={NAILSPA_VIMEO_ID}
      title="Lay-n-Go NAILSPA product video"
      className="h-full w-full"
      iframeClassName={NAILSPA_IFRAME_COVER}
    />
  );

  if (variant === "bottom") {
    return embed;
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl bg-white ring-1 ring-border/40 sm:rounded-2xl",
        "aspect-[4/3]",
        className,
      )}
    >
      {embed}
    </div>
  );
}
