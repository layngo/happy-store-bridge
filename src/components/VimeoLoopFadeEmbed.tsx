import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

interface VimeoLoopFadeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  /** Static image until the card is near the viewport / iframe is ready. */
  posterSrc?: string;
  /** Defer iframe until near viewport (default true for home category tiles). */
  loadWhenVisible?: boolean;
}

/** Vimeo embed with loop-boundary fade (desktop) and accessible pause control. */
export function VimeoLoopFadeEmbed({
  videoId,
  title,
  className,
  posterSrc,
  loadWhenVisible = true,
}: VimeoLoopFadeEmbedProps) {
  return (
    <PausableAutoplayEmbed
      provider="vimeo"
      videoId={videoId}
      title={title}
      className={className}
      iframeClassName="pointer-events-none absolute inset-0 h-full w-full border-0"
      vimeoLoopFade
      // Pause control is redundant on pointer-events-none category tiles.
      showPauseControl={false}
      loadWhenVisible={loadWhenVisible}
      posterSrc={posterSrc}
    />
  );
}
