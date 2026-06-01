import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const DEFENDER_VIMEO_ID = "1197222889";

type DefenderHeroVideoProps = {
  className?: string;
};

/** Full-bleed autoplaying muted loop with tactical title overlay. */
export function DefenderHeroVideo({ className }: DefenderHeroVideoProps) {
  return (
    <div
      className={cn(
        "relative left-1/2 aspect-[4/3] w-screen max-w-none -translate-x-1/2 overflow-hidden",
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
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="home-cat-label home-cat-label--tactical defender-hero-overlay__title">DEFENDER</h2>
        <p className="defender-hero-overlay__subtext mt-3 max-w-md sm:mt-4">Your next adventure awaits</p>
      </div>
    </div>
  );
}
