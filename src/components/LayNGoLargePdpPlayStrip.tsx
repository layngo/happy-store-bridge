import { cn } from "@/lib/utils";
import {
  CALLOUT_THUMB_INNER_CLIP,
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

const DEFENDER_MINI_16_FLANK_LEFT = "/products/lay-n-go-defender-mini-16/story-flank-left.png";
const DEFENDER_MINI_16_FLANK_RIGHT = "/products/lay-n-go-defender-mini-16/story-flank-right.png";
const DEFENDER_TACTICAL_20_FLANK_LEFT = "/products/lay-n-go-tactical-bag-20/story-flank-left.png";
const DEFENDER_TACTICAL_20_FLANK_RIGHT = "/products/lay-n-go-tactical-bag-20/story-flank-right.png";
const LITE_18_FLANK_LEFT = "/products/lay-n-go-lite-18/story-flank-left.png";
const LITE_18_FLANK_RIGHT = "/products/lay-n-go-lite-18/story-flank-right.png";

const FLANK_STRIPS_BY_VARIANT: Partial<
  Record<
    LayNGoCalloutDiagramVariant,
    { leftSrc: string; rightSrc: string; leftAlt: string; rightAlt: string; ariaLabel: string }
  >
> = {
  "defender-mini-16": {
    leftSrc: DEFENDER_MINI_16_FLANK_LEFT,
    rightSrc: DEFENDER_MINI_16_FLANK_RIGHT,
    leftAlt: "Lay-n-Go Defender Mini open flat with everyday carry gear organized on the mat",
    rightAlt: "Cinched Lay-n-Go Defender Mini with American flag patch on olive drab fabric",
    ariaLabel: "Defender Mini lifestyle photos",
  },
  "defender-tactical-20": {
    leftSrc: DEFENDER_TACTICAL_20_FLANK_LEFT,
    rightSrc: DEFENDER_TACTICAL_20_FLANK_RIGHT,
    leftAlt:
      "Lay-n-Go Defender Tactical 20 open flat with mesh pockets, drawstring, and everyday carry gear on the mat",
    rightAlt: "Cinched Lay-n-Go Defender Tactical 20 with American flag patch on olive drab fabric",
    ariaLabel: "Defender Tactical lifestyle photos",
  },
  "lite-18": {
    leftSrc: LITE_18_FLANK_LEFT,
    rightSrc: LITE_18_FLANK_RIGHT,
    leftAlt:
      "Lay-n-Go Lite 18 inch mat open flat with magnetic tiles, drawstring cord lock, and Lay-n-Go Lite pocket",
    rightAlt: "Cinched Lay-n-Go Lite 18 inch bag with green and blue panels and carry strap",
    ariaLabel: "Lay-n-Go Lite lifestyle photos",
  },
};

type LayNGoLargePdpPlayStripProps = {
  /** Story-strip headline (rendered with `uppercase` in the h2). Defaults to Large/Lifestyle copy. */
  headline?: string;
  headlineImageSrc?: string;
  showLowerSections?: boolean;
  forceHeadlineSingleLine?: boolean;
  showTravelerCalloutSection?: boolean;
  calloutVariant?: LayNGoCalloutDiagramVariant;
};

function DefenderFlankStrip({
  leftSrc,
  rightSrc,
  leftAlt,
  rightAlt,
  ariaLabel,
  variant,
}: {
  leftSrc: string;
  rightSrc: string;
  leftAlt: string;
  rightAlt: string;
  ariaLabel: string;
  variant?: LayNGoCalloutDiagramVariant;
}) {
  const flankMaxH = "max-h-[min(52vh,540px)] sm:max-h-[min(58vh,620px)] md:max-h-[min(62vh,680px)]";
  const flankCoverClass = cn(
    "block h-auto w-full max-w-none object-cover",
    flankMaxH,
  );
  const defenderFlankUncrop =
    variant === "defender-mini-16" || variant === "defender-tactical-20";

  const flankContainCell = cn(
    "flex min-h-0 w-full items-center justify-center bg-white px-2 py-3 sm:px-3 sm:py-4",
    flankMaxH,
  );
  const flankContainImg = cn(
    "block h-auto w-full max-w-full object-contain object-center",
    flankMaxH,
  );

  return (
    <div
      className="relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2 bg-white sm:mt-10"
      aria-label={ariaLabel}
    >
      <div className="grid w-full grid-cols-2 gap-0 bg-white">
        {defenderFlankUncrop ? (
          <>
            <div className={flankContainCell}>
              <img src={leftSrc} alt={leftAlt} className={flankContainImg} loading="lazy" decoding="async" />
            </div>
            <div className={flankContainCell}>
              <img src={rightSrc} alt={rightAlt} className={flankContainImg} loading="lazy" decoding="async" />
            </div>
          </>
        ) : (
          <>
            <img
              src={leftSrc}
              alt={leftAlt}
              className={cn(flankCoverClass, "object-left")}
              loading="lazy"
              decoding="async"
            />
            <img
              src={rightSrc}
              alt={rightAlt}
              className={cn(flankCoverClass, "object-right")}
              loading="lazy"
              decoding="async"
            />
          </>
        )}
      </div>
    </div>
  );
}

const travelerCalloutThumbFrame = "relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 md:h-28 md:w-28";

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
      <div className={CALLOUT_THUMB_INNER_CLIP}>
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full", imageClassName)}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/** Hero `traveler-callout-main.png` is 1024×768; viewBox matches so leaders align with `object-contain` art. */
const TRAVELER_CALLOUT_VIEWBOX = { w: 1024, h: 768 } as const;

/** Same black/white pair as `LayNGoLargeCalloutDiagram` mesh leaders: `1.02` / `0.58` in 0–100 viewBox → Traveler 1024-wide space. */
const TRAVELER_VB = 1024 / 100;
const TRAVELER_LEADER_OUTER = 1.02 * TRAVELER_VB;
const TRAVELER_LEADER_INNER = 0.58 * TRAVELER_VB;
/** Mat-end dots: match Large diagram HTML dots (~h-3 w-3, border-2) in user units + non-scaling stroke. */
const TRAVELER_DOT_MAT_R = 6.5;
const TRAVELER_DOT_MAT_STROKE = 2.25;

function TravelerLeaderPair({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#0a0a0a"
        strokeWidth={TRAVELER_LEADER_OUTER}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={TRAVELER_LEADER_INNER}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

function TravelerDetailCalloutSection() {
  const { w: vbW, h: vbH } = TRAVELER_CALLOUT_VIEWBOX;
  return (
    <section className="mx-auto mt-12 w-full max-w-6xl overflow-visible md:mt-14" aria-label="Traveler feature callouts">
      {/* One box for image + SVG + thumbs so % and viewBox share the same geometry as the photo */}
      <div className="relative mx-auto w-full max-w-4xl overflow-visible">
        <img
          src={TRAVELER_CALLOUT_MAIN}
          alt="Lay-n-Go Traveler opened flat with travel essentials organized inside"
          className="block h-auto w-full object-contain"
          width={vbW}
          height={vbH}
          loading="lazy"
          decoding="async"
        />

        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Zipper: bottom-center of top-left thumb → zipper pull (y1 follows thumb; label sits above thumb) */}
          <TravelerLeaderPair x1={78} y1={150} x2={334} y2={450} />
          <circle
            cx="334"
            cy="450"
            r={TRAVELER_DOT_MAT_R}
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth={TRAVELER_DOT_MAT_STROKE}
            vectorEffect="non-scaling-stroke"
          />

          {/* Lip: bottom-center of top-right thumb → raised rim on outer edge (x1 tracks thumb; x2,y2 on bag perimeter) */}
          <TravelerLeaderPair x1={1012} y1={122} x2={812} y2={158} />
          <circle
            cx="812"
            cy="158"
            r={TRAVELER_DOT_MAT_R}
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth={TRAVELER_DOT_MAT_STROKE}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-[2.5%] top-[2.5%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:left-[3%] sm:top-[3%] sm:max-w-[13rem]">
          <p className="mb-2 font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
            Zipper Pocket
          </p>
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_ZIPPER}
            alt="Zipper pocket closeup"
            imageClassName="origin-center scale-[1.22] object-cover object-[center_34%] sm:scale-[1.2] sm:object-[center_36%]"
          />
        </div>

        <div className="absolute left-[-2.75rem] top-[62%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:left-[-3.5rem] sm:max-w-[13rem] md:left-[-4.25rem] lg:left-[-5rem]">
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_CORD}
            alt="Cord lock and handle closeup"
            imageClassName="origin-center scale-[1.52] object-cover object-bottom sm:scale-[1.48]"
          />
          <p className="mt-2 font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
            Cord Lock/Pocket + Handle
          </p>
        </div>

        <div className="absolute right-[-2rem] top-[2.5%] z-20 flex max-w-[11rem] flex-col items-center text-center sm:right-[-2.75rem] sm:top-[3%] sm:max-w-[13rem] md:right-[-3.5rem] lg:right-[-4.25rem]">
          <TravelerCalloutThumb
            src={TRAVELER_CALLOUT_LIP}
            alt="Containment lip closeup"
            imageClassName="origin-center scale-[1.38] object-cover object-[14%_center] sm:scale-[1.34] sm:object-[12%_center]"
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

/** Curved dashed leader with arrowhead pointing down (mobile Lifestyle steps). */
function LifestyleMobileDownArrow({ className }: { className?: string }) {
  return (
    <svg
      className={cn("mx-auto block h-14 w-11 shrink-0 text-neutral-900 sm:h-16 sm:w-12", className)}
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 6 C24 22 24 38 24 50"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path d="M15 44 L24 60 L33 44" fill="currentColor" />
    </svg>
  );
}

function LifestyleMobileStoryImage({
  src,
  alt,
  label,
  imgClassName,
}: {
  src: string;
  alt: string;
  label: string;
  imgClassName: string;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[min(100%,42rem)]">
      <img src={src} alt={alt} className={cn("block w-full object-contain", imgClassName)} loading="lazy" decoding="async" />
      <figcaption className="mt-2 px-2 sm:px-3">
        <p className="text-center font-heading text-[0.62rem] font-bold uppercase leading-tight tracking-wide text-neutral-900 sm:text-xs">
          {label}
        </p>
      </figcaption>
    </figure>
  );
}

/** Dashed curve + solid tip (Nailspa family), always drawn left → right; stroke scaled up for stage-to-stage strip. */
export function LargeFeatureArrow({ className }: { className?: string }) {
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

export function FeatureConnector({ label, arrowDirection = "right" }: { label: string; arrowDirection?: "right" | "down" }) {
  const isDown = arrowDirection === "down";
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center gap-1.5 py-1",
        isDown
          ? "w-full max-w-md self-center sm:max-w-lg"
          : "w-16 self-center sm:w-24 sm:gap-2 md:w-32 lg:w-36",
      )}
      role="presentation"
    >
      <p
        className={cn(
          "w-full text-center font-heading font-bold uppercase leading-tight tracking-wide text-neutral-900",
          isDown ? "max-w-[11rem] text-[0.58rem] sm:max-w-[14rem] sm:text-xs md:text-sm" : "max-w-[9rem] text-[0.58rem] sm:max-w-[11rem] sm:text-xs md:max-w-[13rem] md:text-sm lg:text-[0.95rem]",
        )}
      >
        {label}
      </p>
      <LargeFeatureArrow
        className={cn(
          "shrink-0 text-neutral-900",
          isDown
            ? "h-10 w-28 origin-center -rotate-90 sm:h-11 sm:w-32 md:h-12 md:w-36"
            : "h-9 w-full max-w-full sm:h-12 md:h-[3.5rem]",
        )}
      />
    </div>
  );
}

export function LayNGoLargePdpPlayStrip({
  headline = HEADLINE,
  headlineImageSrc = HEADLINE_IMAGE,
  showLowerSections = true,
  forceHeadlineSingleLine = false,
  showTravelerCalloutSection = false,
  calloutVariant = "large-60",
}: LayNGoLargePdpPlayStripProps) {
  const threeStepImageClassName = cn(
    "h-auto w-full max-w-full object-contain",
    calloutVariant === "lifestyle-44"
      ? "max-h-[min(36vh,240px)] sm:max-h-[min(44vh,300px)] md:max-h-[min(50vh,400px)] lg:max-h-[480px]"
      : "max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );

  /** Lifestyle “triangle”: apex + base row — each photo gets more width than a 3-across strip. */
  const lifestyleTriangleApexImg = cn(
    "h-auto w-full max-w-full object-contain",
    "max-h-[min(50vh,340px)] sm:max-h-[min(56vh,420px)] md:max-h-[min(58vh,520px)] lg:max-h-[580px]",
  );
  const lifestyleTriangleBaseImg = cn(
    "h-auto w-full max-w-full object-contain",
    "max-h-[min(42vh,280px)] sm:max-h-[min(50vh,380px)] md:max-h-[min(54vh,460px)] lg:max-h-[520px]",
  );

  /** Same flex column contract as Large so horizontal mobile row shares width and images scale with `object-contain`. */
  const threeStepImageColClassName = "flex min-h-0 min-w-0 flex-1 basis-0 justify-center";

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
        {headline}
      </h2>

      {calloutVariant && FLANK_STRIPS_BY_VARIANT[calloutVariant] ? (
        <DefenderFlankStrip {...FLANK_STRIPS_BY_VARIANT[calloutVariant]!} variant={calloutVariant} />
      ) : null}

      {calloutVariant !== "lite-18" && !calloutVariant.startsWith("defender-") ? (
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
          {calloutVariant !== "lite-18" && !calloutVariant.startsWith("defender-") ? (
            <div
              className="mx-auto mt-14 max-w-[min(100%,90rem)] pt-12 sm:mt-16 sm:pt-14"
              aria-label={
                calloutVariant === "lifestyle-44"
                  ? "How Lay-n-Go Lifestyle works in three steps"
                  : "How Lay-n-Go Large works in three steps"
              }
            >
              {calloutVariant === "lifestyle-44" ? (
                <>
                  {/* Mobile: stacked steps — label on each image, dashed arrows point down */}
                  <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-1 py-1 sm:gap-5 md:hidden">
                    <LifestyleMobileStoryImage
                      src={FEATURE_OPEN_LIFESTYLE}
                      alt="Lay-n-Go Lifestyle mat open with building blocks; pulling the drawstring to begin cleanup"
                      label="Easy access and cleanup"
                      imgClassName={lifestyleTriangleApexImg}
                    />
                    <LifestyleMobileDownArrow />
                    <LifestyleMobileStoryImage
                      src={FEATURE_CINCH_LIFESTYLE}
                      alt="Cinching the Lay-n-Go Lifestyle drawstring to close the black mat bag"
                      label="Cinch it completely closed"
                      imgClassName={lifestyleTriangleBaseImg}
                    />
                    <LifestyleMobileDownArrow />
                    <LifestyleMobileStoryImage
                      src={FEATURE_CARRY_LIFESTYLE}
                      alt="Person wearing the cinched Lay-n-Go Lifestyle 44 inch mat as a backpack against a white studio background"
                      label="Wide strap for easy travel and storage"
                      imgClassName={lifestyleTriangleBaseImg}
                    />
                  </div>
                  {/* Desktop: same horizontal strip as Large */}
                  <div
                    className={cn(
                      "mx-auto hidden w-full max-w-full flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 md:flex sm:gap-1 sm:px-1 md:gap-2 lg:gap-3",
                      "md:-mt-[50px]",
                    )}
                  >
                    <div className={threeStepImageColClassName}>
                      <img
                        src={FEATURE_OPEN_LIFESTYLE}
                        alt="Lay-n-Go Lifestyle mat open with building blocks; pulling the drawstring to begin cleanup"
                        className={threeStepImageClassName}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <FeatureConnector label="Easy access and cleanup" />

                    <div className={threeStepImageColClassName}>
                      <img
                        src={FEATURE_CINCH_LIFESTYLE}
                        alt="Cinching the Lay-n-Go Lifestyle drawstring to close the black mat bag"
                        className={threeStepImageClassName}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <FeatureConnector label="Wide strap for easy travel and storage" />

                    <div className={threeStepImageColClassName}>
                      <img
                        src={FEATURE_CARRY_LIFESTYLE}
                        alt="Person wearing the cinched Lay-n-Go Lifestyle 44 inch mat as a backpack against a white studio background"
                        className={threeStepImageClassName}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    "flex w-full max-w-full flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 sm:gap-1 sm:px-1 md:gap-2 lg:gap-3",
                  )}
                >
                  <div className={threeStepImageColClassName}>
                    <img
                      src={FEATURE_OPEN}
                      alt="Lay-n-Go Large open with toys; easy access to play and start cleanup"
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <FeatureConnector label="Easy access and cleanup" />

                  <div className={threeStepImageColClassName}>
                    <img
                      src={FEATURE_CINCH}
                      alt="Cinching the Lay-n-Go Large drawstring to gather the mat closed"
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <FeatureConnector label="Wide strap for easy travel and storage" />

                  <div className={threeStepImageColClassName}>
                    <img
                      src={FEATURE_CARRY}
                      alt="Carrying the closed Lay-n-Go Large bag with the wide shoulder strap"
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <LayNGoLargeCalloutDiagram variant={calloutVariant} />
        </>
      ) : null}
    </section>
  );
}
