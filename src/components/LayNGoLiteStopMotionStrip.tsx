import { useEffect, useState } from "react";
import { LAY_NGO_LITE_PRODUCT_IMAGE_CLASS } from "@/lib/layNGoPlayMat";
import { cn } from "@/lib/utils";

const BASE = "/products/lay-n-go-lite-18/stop-motion";

/** Opening sequence — animates 1 → 2 → 3 → 4 → 3 → 2 → 1. */
const OPEN_FRAMES = [
  { src: `${BASE}/frame-01.png`, alt: "Lay-n-Go Lite cinched closed" },
  { src: `${BASE}/frame-02.png`, alt: "Lay-n-Go Lite partially open with toys inside" },
  { src: `${BASE}/frame-03.png`, alt: "Lay-n-Go Lite mat open flat with building tiles" },
  { src: `${BASE}/frame-04.png`, alt: "Lay-n-Go Lite fully open play mat" },
] as const;

/** Closing sequence — shown beside the animation (frames 5–8). */
const CLOSE_FRAMES = [
  { src: `${BASE}/frame-05.png`, alt: "Lay-n-Go Lite cinched into a carry pouch" },
  { src: `${BASE}/frame-06.png`, alt: "Lay-n-Go Lite gathering closed with drawstring" },
  { src: `${BASE}/frame-07.png`, alt: "Lay-n-Go Lite bowl shape while cinching" },
  { src: `${BASE}/frame-08.png`, alt: "Lay-n-Go Lite open flat from above" },
] as const;

/** Indices into OPEN_FRAMES: 1 → 2 → 3 → 4 → 3 → 2 → 1 */
const MOTION_SEQUENCE = [0, 1, 2, 3, 2, 1, 0] as const;

const FRAME_MS = 550;

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
      aria-label="Lay-n-Go Lite opens and closes in seconds"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 sm:gap-8 sm:px-6 md:grid-cols-2 md:gap-10 lg:max-w-7xl">
        <div className="flex flex-col items-center">
          <p className="brand-eyebrow mb-3 text-center text-foreground/70">Open &amp; play</p>
          <div className="relative flex aspect-square w-full max-w-[min(100%,22rem)] items-center justify-center sm:max-w-md">
            {OPEN_FRAMES.map((frame, i) => (
              <img
                key={frame.src}
                src={frame.src}
                alt={frame.alt}
                className={cn(
                  "absolute inset-0 m-auto h-full w-full object-contain transition-opacity duration-200",
                  LAY_NGO_LITE_PRODUCT_IMAGE_CLASS,
                  i === frameIndex ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                decoding="async"
                draggable={false}
                aria-hidden={i !== frameIndex}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="brand-eyebrow mb-3 text-center text-foreground/70">Cinch &amp; go</p>
          <div className="grid w-full max-w-lg grid-cols-4 gap-1.5 sm:gap-2">
            {CLOSE_FRAMES.map((frame, i) => (
              <div
                key={frame.src}
                className="relative flex aspect-square min-w-0 items-center justify-center"
              >
                <span className="absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-foreground font-heading text-[10px] font-bold text-background sm:h-6 sm:w-6 sm:text-xs">
                  {i + 5}
                </span>
                <img
                  src={frame.src}
                  alt={frame.alt}
                  className={cn(
                    "h-full w-full object-contain",
                    LAY_NGO_LITE_PRODUCT_IMAGE_CLASS,
                  )}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
