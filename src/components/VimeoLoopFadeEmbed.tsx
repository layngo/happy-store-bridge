import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";

interface VimeoLoopFadeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

/** Vimeo embed with loop-boundary fade and accessible pause control. */
export function VimeoLoopFadeEmbed({ videoId, title, className }: VimeoLoopFadeEmbedProps) {
  return (
    <PausableAutoplayEmbed
      provider="vimeo"
      videoId={videoId}
      title={title}
      className={className}
      iframeClassName="pointer-events-none absolute inset-0 h-full w-full border-0"
      vimeoLoopFade
    />
  );
}
