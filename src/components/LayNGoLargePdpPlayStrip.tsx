import { cn } from "@/lib/utils";
import { LayNGoLargeCalloutDiagram } from "@/components/LayNGoLargeCalloutDiagram";

const HEADLINE = "Your whole routine. One pull to pack it up.";
const HEADLINE_IMAGE = "/products/lay-n-go-large-pdp/traveler-hero.png";

const FEATURE_OPEN = "/products/lay-n-go-large-pdp/feature-3-open.png";
const FEATURE_CINCH = "/products/lay-n-go-large-pdp/feature-4-cinch.png";
const FEATURE_CARRY = "/products/lay-n-go-large-pdp/feature-5-carry.png";

/** Dashed curve + solid tip (Nailspa family), always drawn left → right; stroke scaled up for stage-to-stage strip. */
function LargeFeatureArrow({ className }: { className?: string }) {
  const viewBox = "0 0 140 52";
  const start = { x: 6, y: 28 };
  const control = { x: 72, y: 10 };
  const end = { x: 128, y: 28 };
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 9;
  const spread = 5.5;
  const left = { x: end.x - ux * size - uy * spread, y: end.y - uy * size + ux * spread };
  const right = { x: end.x - ux * size + uy * spread, y: end.y - uy * size - ux * spread };

  return (
    <svg
      className={cn("block shrink-0 text-neutral-900", className)}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={2.85}
        strokeDasharray="5 7"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      className="flex w-16 shrink-0 flex-col items-center justify-center gap-1.5 self-center py-1 sm:w-24 sm:gap-2 md:w-32 lg:w-36"
      role="presentation"
    >
      <p className="w-full max-w-[9rem] text-center font-heading text-[0.58rem] font-bold uppercase leading-tight tracking-wide text-neutral-900 sm:max-w-[11rem] sm:text-xs md:max-w-[13rem] md:text-sm lg:text-[0.95rem]">
        {label}
      </p>
      <LargeFeatureArrow className="h-9 w-full max-w-full sm:h-12 md:h-[3.5rem]" />
    </div>
  );
}

export function LayNGoLargePdpPlayStrip() {
  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen overflow-x-clip bg-white px-4 pb-10 pt-6 text-foreground sm:px-6 sm:pb-12 sm:pt-8"
      aria-labelledby="lay-n-go-large-play-strip-heading"
    >
      <h2
        id="lay-n-go-large-play-strip-heading"
        className="mx-auto max-w-5xl px-2 text-center font-heading text-[clamp(1.85rem,7.5vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:px-4"
      >
        {HEADLINE}
      </h2>

      <div className="mx-auto mt-8 max-w-[min(100%,64rem)] sm:mt-10">
        <img
          src={HEADLINE_IMAGE}
          alt="Lay-n-Go Traveler cinched closed next to daily essentials like phone, sunglasses, and watch"
          className="block h-auto w-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className="mx-auto mt-14 max-w-[min(100%,90rem)] border-t border-neutral-200/80 pt-12 sm:mt-16 sm:pt-14"
        aria-label="How Lay-n-Go Large works in three steps"
      >
        <div className="flex w-full max-w-full flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 sm:gap-1 md:gap-2 lg:gap-3">
          <div className="flex min-h-0 min-w-0 flex-1 basis-0 justify-center">
            <img
              src={FEATURE_OPEN}
              alt="Lay-n-Go Large open with toys; easy access to play and start cleanup"
              className="h-auto max-h-[min(34vh,220px)] w-full max-w-full object-contain sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <FeatureConnector label="Easy access and cleanup" />

          <div className="flex min-h-0 min-w-0 flex-1 basis-0 justify-center">
            <img
              src={FEATURE_CINCH}
              alt="Cinching the Lay-n-Go Large drawstring to gather the mat closed"
              className="h-auto max-h-[min(34vh,220px)] w-full max-w-full object-contain sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <FeatureConnector label="Wide strap for easy travel and storage" />

          <div className="flex min-h-0 min-w-0 flex-1 basis-0 justify-center">
            <img
              src={FEATURE_CARRY}
              alt="Carrying the closed Lay-n-Go Large bag with the wide shoulder strap"
              className="h-auto max-h-[min(34vh,220px)] w-full max-w-full object-contain sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]"
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
