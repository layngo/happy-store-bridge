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
  overlay,
}: {
  src: string;
  label: string;
  overlay: string;
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
    <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-neutral-100">
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/15 to-transparent"
      />
      <p className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-3 text-center font-heading text-[clamp(1rem,3.2vw,1.85rem)] font-black uppercase leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] sm:px-4 sm:pb-4 md:text-[clamp(1.15rem,2.4vw,2.1rem)]">
        {overlay}
      </p>
    </div>
  );
}

/** Side-by-side open + close demos under the Cosmo story headline. */
export function CosmoPdpDemoVideos({ className }: CosmoPdpDemoVideosProps) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-2 sm:gap-3 md:gap-4", className)}
      aria-label="Cosmo open and close demos"
    >
      <DemoVideo src={COSMO_OPEN_SRC} label="Lay-n-Go Cosmo opening flat" overlay="Fast open" />
      <DemoVideo src={COSMO_CLOSE_SRC} label="Lay-n-Go Cosmo cinching closed" overlay="Fast close" />
    </div>
  );
}
