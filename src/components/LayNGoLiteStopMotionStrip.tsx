import { useEffect, useState } from "react";
import { LAY_NGO_LITE_PRODUCT_IMAGE_CLASS } from "@/lib/layNGoPlayMat";
import { cn } from "@/lib/utils";

const BASE = "/products/lay-n-go-lite-18/stop-motion";

const COLOR_A_FRAMES = [
  { src: `${BASE}/frame-01.png`, alt: "Lay-n-Go Lite cinched closed, green side" },
  { src: `${BASE}/frame-02.png`, alt: "Lay-n-Go Lite partially open with toys, green side" },
  { src: `${BASE}/frame-03.png`, alt: "Lay-n-Go Lite mat open flat with building tiles, green side" },
  { src: `${BASE}/frame-04.png`, alt: "Lay-n-Go Lite fully open play mat, green side" },
] as const;

const COLOR_B_FRAMES = [
  { src: `${BASE}/frame-05.png`, alt: "Lay-n-Go Lite cinched closed, blue side" },
  { src: `${BASE}/frame-06.png`, alt: "Lay-n-Go Lite gathering closed with drawstring, blue side" },
  { src: `${BASE}/frame-07.png`, alt: "Lay-n-Go Lite bowl shape while cinching, blue side" },
  { src: `${BASE}/frame-08.png`, alt: "Lay-n-Go Lite fully open play mat, blue side" },
] as const;

/** 1 → 2 → 3 → 4 → 3 → 2 → 1 */
const MOTION_SEQUENCE = [0, 1, 2, 3, 2, 1, 0] as const;

const FRAME_MS = 550;

/** Shared stage: both colorways must match pixel-for-pixel in layout. */
const STOP_MOTION_STAGE_CLASS =
  "relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] origin-bottom sm:max-w-xs md:max-w-sm";

type StopMotionPlayerProps = {
  frames: readonly { src: string; alt: string }[];
  frameIndex: number;
  className?: string;
};

function StopMotionPlayer({ frames, frameIndex, className }: StopMotionPlayerProps) {
  return (
    <div className={cn(STOP_MOTION_STAGE_CLASS, className)}>
      {frames.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-[center_100%] transition-opacity duration-200",
            LAY_NGO_LITE_PRODUCT_IMAGE_CLASS,
            i === frameIndex ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          decoding="async"
          draggable={false}
          aria-hidden={i !== frameIndex}
        />
      ))}
    </div>
  );
}

export function LayNGoLiteStopMotionStrip({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const frameIndex = MOTION_SEQUENCE[step];

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % MOTION_SEQUENCE.length);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2 bg-background sm:mt-10",
        className,
      )}
      aria-label="Lay-n-Go Lite opens and closes on both reversible colorways"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-7xl">
        <div className="grid w-full max-w-3xl grid-cols-2 items-end gap-6 sm:max-w-4xl sm:gap-10 lg:max-w-5xl">
          <StopMotionPlayer frames={COLOR_A_FRAMES} frameIndex={frameIndex} className="w-full" />
          <StopMotionPlayer frames={COLOR_B_FRAMES} frameIndex={frameIndex} className="w-full" />
        </div>

        <div className="relative z-30 mt-8 mb-14 text-center sm:mt-10 sm:mb-16 md:mb-20 lg:mb-24">
          <p className="brand-eyebrow text-foreground">Reversible colors</p>
          <p className="brand-display mx-auto mt-2 max-w-none text-[clamp(1rem,4.2vw,2rem)] leading-tight text-foreground whitespace-nowrap">
            Two colors in one... fully reversible.
          </p>
        </div>
      </div>
    </div>
  );
}
