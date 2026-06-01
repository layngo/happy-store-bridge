import { cn } from "@/lib/utils";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

const DEFENDER_VIMEO_ID = "1197222889";

type DefenderHeroVideoProps = {
  className?: string;
};

/** Full-bleed autoplaying muted loop — no chrome, no controls. */
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
    </div>
  );
}
