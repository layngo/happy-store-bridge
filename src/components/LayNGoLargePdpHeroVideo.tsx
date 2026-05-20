import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const LARGE_VIMEO_ID = "1194113086";

type LayNGoLargePdpHeroVideoProps = {
  className?: string;
};

/** 16:9 Vimeo embed with pause control — matches Nailspa / home hero pattern. */
export function LayNGoLargePdpHeroVideo({ className }: LayNGoLargePdpHeroVideoProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl bg-background ring-1 ring-border/40 aspect-video sm:rounded-2xl",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden bg-background">
        <div className="absolute left-1/2 top-1/2 aspect-video h-full -translate-x-1/2 -translate-y-1/2">
          <PausableAutoplayEmbed
            provider="vimeo"
            videoId={LARGE_VIMEO_ID}
            title="Lay-n-Go Large product video"
            className="absolute inset-0 h-full w-full"
            iframeClassName="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
