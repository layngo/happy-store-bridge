import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HEADLINE = "Play more clean up less";

const IMG_BLUE = "/products/lay-n-go-large-pdp/play-blue.png";
const IMG_GREEN = "/products/lay-n-go-large-pdp/play-green.png";

export function LayNGoLargePdpPlayStrip() {
  const [showBlue, setShowBlue] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setShowBlue((v) => !v), 3000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white px-4 pb-10 pt-6 text-foreground sm:px-6 sm:pb-12 sm:pt-8"
      aria-labelledby="lay-n-go-large-play-strip-heading"
    >
      <h2
        id="lay-n-go-large-play-strip-heading"
        className="mx-auto max-w-5xl px-2 text-center font-heading text-[clamp(1.85rem,7.5vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:px-4"
      >
        {HEADLINE}
      </h2>

      <div className="mx-auto mt-8 max-w-6xl sm:mt-10">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <img
            src={IMG_BLUE}
            alt="Lay-n-Go Large play mat in royal blue with children playing"
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              !reduceMotion && "transition-opacity duration-1000 ease-in-out",
              reduceMotion || showBlue ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_GREEN}
            alt="Lay-n-Go Large play mat in green with children playing"
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              !reduceMotion && "transition-opacity duration-1000 ease-in-out",
              reduceMotion ? "opacity-0" : showBlue ? "opacity-0" : "opacity-100",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
