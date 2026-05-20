import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const NAILSPA_VIMEO_ID = "1191237502";

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
      iframeClassName={cn(
        "h-full w-full border-0",
        variant === "bottom" ? "absolute inset-0" : "absolute inset-0",
      )}
    />
  );

  if (variant === "bottom") {
    return embed;
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/15 sm:rounded-2xl",
        "aspect-[4/3]",
        className,
      )}
    >
      {embed}
    </div>
  );
}
