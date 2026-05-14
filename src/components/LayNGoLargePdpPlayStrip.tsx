import { cn } from "@/lib/utils";
import {
  CALLOUT_THUMB_SHADOW,
  LayNGoLargeCalloutDiagram,
  LayNGoMatDiameterLine,
  type LayNGoCalloutDiagramVariant,
} from "@/components/LayNGoLargeCalloutDiagram";

const HEADLINE = "Your whole routine. One pull to pack it up.";
const HEADLINE_IMAGE = "/products/lay-n-go-large-pdp/play-blue.png";
const TRAVELER_CALLOUT_MAIN = "/products/lay-n-go-large-pdp/traveler-callout-main.png";
const TRAVELER_CALLOUT_ZIPPER = "/products/lay-n-go-large-pdp/traveler-callout-zipper.png";
const TRAVELER_CALLOUT_CORD = "/products/lay-n-go-large-pdp/traveler-callout-cord.png";
const TRAVELER_CALLOUT_LIP = "/products/lay-n-go-large-pdp/traveler-callout-lip.png";

const FEATURE_OPEN = "/products/lay-n-go-large-pdp/feature-3-open.png";
const FEATURE_OPEN_LIFESTYLE = "/products/lay-n-go-lifestyle-44/feature-3-open.png";
const FEATURE_CINCH = "/products/lay-n-go-large-pdp/feature-4-cinch.png";
const FEATURE_CINCH_LIFESTYLE = "/products/lay-n-go-lifestyle-44/feature-4-cinch.png";
const FEATURE_CARRY = "/products/lay-n-go-large-pdp/feature-5-carry.png";
const FEATURE_CARRY_LIFESTYLE = "/products/lay-n-go-lifestyle-44/feature-5-carry.png";

type LayNGoLargePdpPlayStripProps = {
  headlineImageSrc?: string;
  showLowerSections?: boolean;
  forceHeadlineSingleLine?: boolean;
  showTravelerCalloutSection?: boolean;
  calloutVariant?: LayNGoCalloutDiagramVariant;
};

const travelerCalloutThumbFrame =
  "relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-neutral-100 sm:h-24 sm:w-24 md:h-28 md:w-28";

function TravelerCalloutThumb({
  src,
  alt,
  imageClassName,
}: {
  src: string;
  alt: string;
  imageClassName: string;
}) {
  return (
    <div className={cn(travelerCalloutThumbFrame, CALLOUT_THUMB_SHADOW)}>
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", imageClassName)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function TravelerDetailCalloutSection() {
  return (
    <section className="mx-auto mt-12 w-full max-w-6xl overflow-visible md:mt-14" aria-label="Traveler feature callouts">
      <div className="relative mx-auto w-full max-w-5xl overflow-visible">
        <img
          src={TRAVELER_CALLOUT_MAIN}
          alt="Lay-n-Go Traveler opened flat with travel essentials organized inside"
          className="mx-auto block h-auto w-full max-w-4xl object-contain"
          loading="lazy"
          decoding="async"
        />

        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox="0 0 100 100" aria-hidden>
          <line x1="23" y1="55" x2="13" y2="70" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />
          <circle cx="23" cy="55" r="1.2" fill="#ffffff" stroke="#ffffff" strokeWidth="0.45" />

          <line x1="19" y1="78" x2="19" y2="25" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />
          <line x1="19" y1="25" x2="11" y2="12" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />
          <circle cx="19" cy="78" r="1.2" fill="#ffffff" stroke="#ffffff" strokeWidth="0.45" />

          <line x1="74" y1="27" x2="84" y2="12" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />
          <circle cx="74" cy="27" r="1.2" fill="#ffffff" stroke="#ffffff" strokeWidth="0.45" />
        </svg>

        <div className="absolute left-[2.5%] top-[2.5%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:left-[3%] sm:top-[3%] sm:max-w-[13rem]">
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_ZIPPER}
            alt="Zipper pocket closeup"
            imageClassName="object-cover object-[center_58%]"
          />
          <p className="mt-2 font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
            Zipper Pocket
          </p>
        </div>

        <div className="absolute left-[2.5%] top-[62%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:left-[3%] sm:max-w-[13rem]">
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_CORD}
            alt="Cord lock and handle closeup"
            imageClassName="object-contain object-center scale-[1.14] sm:scale-[1.12]"
          />
          <p className="mt-2 font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
            Cord Lock/Pocket + Handle
          </p>
        </div>

        <div className="absolute right-[2.5%] top-[2.5%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:right-[3%] sm:top-[3%] sm:max-w-[13rem]">
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_LIP}
            alt="Containment lip closeup"
            imageClassName="object-cover object-[26%_center] scale-[1.08] sm:object-[24%_center]"
          />
          <p className="mt-2 font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
            Convenient containment lip
          </p>
        </div>
      </div>
      <LayNGoMatDiameterLine inches={20} variant="traveler-20" className="mx-auto mt-4 w-full max-w-4xl" />
    </section>
  );
}

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

export function LayNGoLargePdpPlayStrip({
  headlineImageSrc = HEADLINE_IMAGE,
  showLowerSections = true,
  forceHeadlineSingleLine = false,
  showTravelerCalloutSection = false,
  calloutVariant = "large-60",
}: LayNGoLargePdpPlayStripProps) {
  const threeStepImageClassName = cn(
    "h-auto w-full object-contain",
    calloutVariant === "lifestyle-44"
      ? "max-w-[min(100%,28rem)] max-h-[min(60vh,500px)] sm:max-w-[min(100%,34rem)] sm:max-h-[min(62vh,540px)] md:max-w-full md:max-h-[min(50vh,400px)] lg:max-h-[480px]"
      : "max-w-full max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );

  const threeStepImageColClassName = cn(
    "flex justify-center",
    calloutVariant === "lifestyle-44"
      ? "w-full shrink-0 md:min-h-0 md:min-w-0 md:w-auto md:flex-1 md:basis-0"
      : "min-h-0 min-w-0 flex-1 basis-0",
  );

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen overflow-x-clip bg-white px-4 pb-10 pt-6 text-foreground sm:px-6 sm:pb-12 sm:pt-8"
      aria-labelledby="lay-n-go-large-play-strip-heading"
    >
      <h2
        id="lay-n-go-large-play-strip-heading"
        className={cn(
          "mx-auto max-w-5xl px-2 text-center font-heading text-[clamp(1.85rem,7.5vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:px-4",
          forceHeadlineSingleLine && "max-w-none whitespace-nowrap text-[clamp(1rem,4.8vw,3.65rem)]",
        )}
      >
        {HEADLINE}
      </h2>

      {calloutVariant !== "lite-18" ? (
        <div className="mx-auto mt-8 max-w-[min(100%,64rem)] sm:mt-10">
          <img
            src={headlineImageSrc}
            alt="Lay-n-Go product hero image"
            className="block h-auto w-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      {showTravelerCalloutSection ? <TravelerDetailCalloutSection /> : null}

      {showLowerSections ? (
        <>
          {calloutVariant !== "lite-18" ? (
            <div
              className="mx-auto mt-14 max-w-[min(100%,90rem)] pt-12 sm:mt-16 sm:pt-14"
              aria-label="How Lay-n-Go Large works in three steps"
            >
              <div
                className={cn(
                  "flex w-full max-w-full items-center justify-center overflow-x-hidden px-0.5 sm:px-1 sm:gap-1 md:gap-2 lg:gap-3",
                  calloutVariant === "lifestyle-44"
                    ? "flex-col gap-8 py-1 md:flex-row md:flex-nowrap md:gap-2 md:py-0"
                    : "flex-row flex-nowrap gap-0.5",
                )}
              >
                <div className={threeStepImageColClassName}>
                  <img
                    src={calloutVariant === "lifestyle-44" ? FEATURE_OPEN_LIFESTYLE : FEATURE_OPEN}
                    alt={
                      calloutVariant === "lifestyle-44"
                        ? "Lay-n-Go Lifestyle mat open with building blocks; pulling the drawstring to begin cleanup"
                        : "Lay-n-Go Large open with toys; easy access to play and start cleanup"
                    }
                    className={threeStepImageClassName}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <FeatureConnector label="Easy access and cleanup" />

                <div className={threeStepImageColClassName}>
                  <img
                    src={calloutVariant === "lifestyle-44" ? FEATURE_CINCH_LIFESTYLE : FEATURE_CINCH}
                    alt={
                      calloutVariant === "lifestyle-44"
                        ? "Cinching the Lay-n-Go Lifestyle drawstring to close the black mat bag"
                        : "Cinching the Lay-n-Go Large drawstring to gather the mat closed"
                    }
                    className={threeStepImageClassName}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <FeatureConnector label="Wide strap for easy travel and storage" />

                <div className={threeStepImageColClassName}>
                  <img
                    src={calloutVariant === "lifestyle-44" ? FEATURE_CARRY_LIFESTYLE : FEATURE_CARRY}
                    alt={
                      calloutVariant === "lifestyle-44"
                        ? "Person wearing the cinched Lay-n-Go Lifestyle 44 inch mat as a backpack against a white studio background"
                        : "Carrying the closed Lay-n-Go Large bag with the wide shoulder strap"
                    }
                    className={threeStepImageClassName}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <LayNGoLargeCalloutDiagram variant={calloutVariant} />
        </>
      ) : null}
    </section>
  );
}
