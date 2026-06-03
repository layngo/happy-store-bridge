import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DEFENDER_HERO_VIDEO_SRC = "/videos/defender-hero.mp4?v=1";

type DefenderHeroVideoProps = {
  className?: string;
};

/** Full-bleed autoplaying muted loop (defender3) with tactical title overlay. */
export function DefenderHeroVideo({ className }: DefenderHeroVideoProps) {
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
    <section className={cn("defender-hero-video", className)}>
      <div className="defender-hero-video__embed">
        <div className="defender-hero-video__embed-inner">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={DEFENDER_HERO_VIDEO_SRC}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Lay-n-Go DEFENDER"
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
