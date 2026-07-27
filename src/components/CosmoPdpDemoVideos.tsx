import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COSMO_OPEN_SRC = "/videos/cosmo-open.mp4";
const COSMO_CLOSE_SRC = "/videos/cosmo-close.mp4";

type CosmoPdpDemoVideosProps = {
  className?: string;
};

function DemoVideo({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    void video.play().catch(() => {
      // Autoplay may be blocked until user gesture; keep muted poster frame.
    });
  }, [prefersReducedMotion]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-border/40 sm:rounded-2xl">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}

/** Open + close demo clips shown under the Cosmo PDP product image. */
export function CosmoPdpDemoVideos({ className }: CosmoPdpDemoVideosProps) {
  return (
    <div className={cn("grid gap-4 sm:gap-5", className)} aria-label="Cosmo open and close demos">
      <DemoVideo src={COSMO_OPEN_SRC} label="Lay-n-Go Cosmo opening flat" />
      <DemoVideo src={COSMO_CLOSE_SRC} label="Lay-n-Go Cosmo cinching closed" />
    </div>
  );
}
