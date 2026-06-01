import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const DEFENDER_VIMEO_ID = "1197222889";

type DefenderHeroVideoProps = {
  className?: string;
};

/** Full-bleed autoplaying muted loop with tactical title overlay. */
export function DefenderHeroVideo({ className }: DefenderHeroVideoProps) {
  return (
    <section className={cn("defender-hero-video", className)}>
      <div className="defender-hero-video__embed">
        <div className="defender-hero-video__embed-inner">
          <PausableAutoplayEmbed
            provider="vimeo"
            videoId={DEFENDER_VIMEO_ID}
            title="Lay-n-Go DEFENDER"
            className="absolute inset-0 h-full w-full"
            iframeClassName="absolute inset-0 h-full w-full border-0"
            showPauseControl={false}
            vimeoBackground="000000"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.28)_100%)]"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="home-cat-label home-cat-label--tactical defender-hero-overlay__title">DEFENDER</h2>
        <p className="defender-hero-overlay__subtext mt-3 max-w-md sm:mt-4">Your next adventure awaits</p>
      </div>
    </section>
  );
}
