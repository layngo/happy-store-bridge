import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LayNGoLargeCalloutDiagram } from "@/components/LayNGoLargeCalloutDiagram";

const HEADLINE = "Clean up less, play more.";

const IMG_BLUE = "/products/lay-n-go-large-pdp/play-blue.png";
const IMG_GREEN = "/products/lay-n-go-large-pdp/play-green.png";

const FEATURE_OPEN = "/products/lay-n-go-large-pdp/feature-3-open.png";
const FEATURE_CINCH = "/products/lay-n-go-large-pdp/feature-4-cinch.png";
const FEATURE_CARRY = "/products/lay-n-go-large-pdp/feature-5-carry.png";

/** Same visual language as `NailspaPdpStory` `RenderArrow`: dashed quadratic stroke + solid chevron tip. */
function LargeFeatureArrow({ className }: { className?: string }) {
  const viewBox = "0 0 120 44";
  const start = { x: 4, y: 22 };
  const control = { x: 58, y: 12 };
  const end = { x: 112, y: 22 };
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 6;
  const spread = 3.8;
  const left = { x: end.x - ux * size - uy * spread, y: end.y - uy * size + ux * spread };
  const right = { x: end.x - ux * size + uy * spread, y: end.y - uy * size - ux * spread };

  return (
    <svg
      className={cn("block shrink-0 text-neutral-800/85", className)}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
      <path
        d={`M${end.x} ${end.y} L${left.x} ${left.y} L${right.x} ${right.y} Z`}
        fill="currentColor"
      />
    </svg>
  );
}

function FeatureConnector({ label }: { label: string }) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-center justify-center gap-3 py-3 md:w-[min(100%,8rem)] lg:w-36"
      role="presentation"
    >
      <p className="max-w-[16rem] text-center font-heading text-sm font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-base md:max-w-[13rem] md:text-[0.95rem] lg:text-lg">
        {label}
      </p>
      <LargeFeatureArrow className="h-12 w-[min(100%,7rem)] rotate-90 md:h-11 md:w-32 lg:w-36" />
    </div>
  );
}

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

      <div className="mx-auto mt-8 max-w-[min(100%,46.08rem)] sm:mt-10">
        {/* Natural photo aspect (no fixed 16:10) — avoids gray letterboxing from object-contain */}
        <div className="relative w-full bg-white">
          <img src={IMG_BLUE} alt="" className="invisible block h-auto w-full max-w-full" aria-hidden />
          <div className="absolute inset-0 overflow-hidden bg-white">
            <img
              src={IMG_BLUE}
              alt="Lay-n-Go Large play mat in royal blue with children playing"
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-center",
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
                "absolute inset-0 h-full w-full object-contain object-center",
                !reduceMotion && "transition-opacity duration-1000 ease-in-out",
                reduceMotion ? "opacity-0" : showBlue ? "opacity-0" : "opacity-100",
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-14 max-w-[min(100%,90rem)] border-t border-neutral-200/80 pt-12 sm:mt-16 sm:pt-14"
        aria-label="How Lay-n-Go Large works in three steps"
      >
        <div className="flex flex-col items-stretch md:flex-row md:items-center md:justify-center md:gap-1 lg:gap-2">
          <div className="flex min-w-0 flex-1 justify-center md:basis-0">
            <img
              src={FEATURE_OPEN}
              alt="Lay-n-Go Large open with toys; easy access to play and start cleanup"
              className="h-auto max-h-[min(52vh,380px)] w-full max-w-sm object-contain md:max-h-[min(48vh,420px)] lg:max-h-[460px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <FeatureConnector label="Easy access and cleanup" />

          <div className="flex min-w-0 flex-1 justify-center md:basis-0">
            <img
              src={FEATURE_CINCH}
              alt="Cinching the Lay-n-Go Large drawstring to gather the mat closed"
              className="h-auto max-h-[min(52vh,380px)] w-full max-w-sm object-contain md:max-h-[min(48vh,420px)] lg:max-h-[460px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <FeatureConnector label="Wide strap for easy travel and storage" />

          <div className="flex min-w-0 flex-1 justify-center md:basis-0">
            <img
              src={FEATURE_CARRY}
              alt="Carrying the closed Lay-n-Go Large bag with the wide shoulder strap"
              className="h-auto max-h-[min(52vh,380px)] w-full max-w-sm object-contain md:max-h-[min(48vh,420px)] lg:max-h-[460px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <LayNGoLargeCalloutDiagram />
    </section>
  );
}
