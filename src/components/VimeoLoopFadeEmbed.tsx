import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

interface VimeoLoopFadeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  /** Static image until the card is near the viewport. */
  posterSrc?: string;
  /** Defer iframe until near viewport (default true for home category tiles). */
  loadWhenVisible?: boolean;
}

/** Vimeo embed with loop-boundary fade and accessible pause control. */
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
      loadWhenVisible={loadWhenVisible}
      posterSrc={posterSrc}
    />
  );
}
