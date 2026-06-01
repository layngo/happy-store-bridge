import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const DEFENDER_VIMEO_ID = "1197222889";

type DefenderHeroVideoProps = {
  className?: string;
};

/** Autoplaying muted loop — no controls, no pause button. */
export function DefenderHeroVideo({ className }: DefenderHeroVideoProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden bg-black aspect-[4/3] sm:rounded-2xl",
        className,
      )}
    >
      <PausableAutoplayEmbed
        provider="vimeo"
        videoId={DEFENDER_VIMEO_ID}
        title="Lay-n-Go DEFENDER"
        className="absolute inset-0 h-full w-full"
        iframeClassName="absolute inset-0 h-full w-full border-0"
        showPauseControl={false}
      />
    </div>
  );
}
