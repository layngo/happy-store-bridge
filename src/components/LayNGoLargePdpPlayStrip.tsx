import { cn } from "@/lib/utils";
import { DefenderHeroVideo } from "@/components/DefenderHeroVideo";
import { LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS } from "@/lib/layNGoPlayMat";
import {
  CALLOUT_THUMB_INNER_CLIP,
  CALLOUT_THUMB_SHADOW,
  LayNGoLargeCalloutDiagram,
  LayNGoMatDiameterLine,
  type LayNGoCalloutDiagramVariant,
} from "@/components/LayNGoLargeCalloutDiagram";
import { LayNGoLiteStopMotionStrip } from "@/components/LayNGoLiteStopMotionStrip";
import { VimeoLoopFadeEmbed } from "@/components/VimeoLoopFadeEmbed";

const HEADLINE = "Play for hours, clean up in seconds";
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

const DEFENDER_FLANK_ASSET_V = "1";
const DEFENDER_MINI_16_FLANK_LEFT = `/products/lay-n-go-defender-mini-16/story-flank-left.png?v=${DEFENDER_FLANK_ASSET_V}`;
const DEFENDER_MINI_16_FLANK_RIGHT = `/products/lay-n-go-defender-mini-16/story-flank-right.png?v=${DEFENDER_FLANK_ASSET_V}`;
const DEFENDER_TACTICAL_20_FLANK_LEFT = `/products/lay-n-go-tactical-bag-20/story-flank-left.png?v=${DEFENDER_FLANK_ASSET_V}`;
const DEFENDER_TACTICAL_20_FLANK_RIGHT = `/products/lay-n-go-tactical-bag-20/story-flank-right.png?v=${DEFENDER_FLANK_ASSET_V}`;
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
  headlineVideoId?: string;
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
  const flankUncrop = variant === "lite-18";
  const isDefenderFlank =
    variant === "defender-mini-16" || variant === "defender-tactical-20";

  const flankContainCell = cn(
    "flex min-h-0 w-full items-center justify-center bg-background px-2 py-3 sm:px-3 sm:py-4",
    flankMaxH,
  );
  const flankContainImg = cn(
    "block h-auto w-full max-w-full object-contain",
    flankMaxH,
    variant === "defender-mini-16" || variant === "lite-18" ? "object-left" : "object-center",
  );
  const flankContainImgRight = cn(
    "block h-auto w-full max-w-full object-contain object-right",
    flankMaxH,
  );

  if (variant === "lite-18") {
    const liteFlankSize = cn(
      "block h-auto max-w-none shrink-0 object-contain object-bottom",
      "w-[min(55.2vw,32rem)] sm:w-[min(50.6vw,28rem)] md:w-[min(48vw,30rem)]",
      "max-h-[min(59.8vh,621px)] sm:max-h-[min(66.7vh,713px)] md:max-h-[min(71.3vh,782px)]",
    );
    /** Mobile right flank: 40% smaller than `liteFlankSize`, still pinned to the right edge. */
    const liteFlankSizeRight = cn(
      "block h-auto max-w-none shrink-0 object-contain object-bottom",
      "w-[min(33.12vw,19.2rem)] max-h-[min(35.88vh,373px)]",
      "sm:w-[min(50.6vw,28rem)] sm:max-h-[min(66.7vh,713px)] md:w-[min(48vw,30rem)] md:max-h-[min(71.3vh,782px)]",
    );

    return (
      <div
        className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] mt-6 w-screen max-w-[100vw] overflow-visible bg-background sm:mt-8"
        aria-label={ariaLabel}
      >
        <div className="relative w-screen min-h-0 overflow-visible">
          <img
            src={leftSrc}
            alt={leftAlt}
            className={cn(liteFlankSize, "object-left")}
            loading="lazy"
            decoding="async"
          />
          <img
            src={rightSrc}
            alt={rightAlt}
            className={cn(
              liteFlankSizeRight,
              "absolute bottom-0 right-0 origin-bottom-right object-right sm:scale-110",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  if (isDefenderFlank) {
    return (
      <div
        className="relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip sm:mt-10"
        aria-label={ariaLabel}
      >
        <div className="grid w-full grid-cols-2 gap-0">
          <div
            className={cn(
              "min-h-0 w-full overflow-hidden",
            )}
          >
            <img
              src={leftSrc}
              alt={leftAlt}
              className="block h-auto w-full max-w-none origin-bottom-left -translate-x-1/2 object-contain object-left"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div
            className={cn(
              "flex w-full items-end justify-end",
              variant === "defender-mini-16" && "min-h-0",
            )}
          >
            <img
              src={rightSrc}
              alt={rightAlt}
              className={cn(
                "block h-auto max-w-none object-contain object-right",
                variant === "defender-mini-16"
                  ? "w-[64%]"
                  : variant === "defender-tactical-20"
                    ? "w-[70%]"
                    : "w-full",
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2 bg-background sm:mt-10"
      aria-label={ariaLabel}
    >
      <div className="grid w-full grid-cols-2 gap-0 bg-background">
        {flankUncrop ? (
          <>
            <div className={flankContainCell}>
              <img src={leftSrc} alt={leftAlt} className={flankContainImg} loading="lazy" decoding="async" />
            </div>
            <div className={flankContainCell}>
              <img src={rightSrc} alt={rightAlt} className={flankContainImgRight} loading="lazy" decoding="async" />
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

const TRAVELER_MOBILE_HERO_CLASS = "w-full max-w-[min(96vw,36rem)] object-contain";
const TRAVELER_DIAMETER_CLASS = "w-full max-w-[min(96vw,36rem)]";

const TRAVELER_CALLOUTS = [
  {
    src: TRAVELER_CALLOUT_ZIPPER,
    alt: "Zipper pocket closeup on Lay-n-Go Traveler",
    label: "Zipper Pocket",
    imageClassName:
      "origin-center scale-[1.22] object-cover object-[center_34%] sm:scale-[1.2] sm:object-[center_36%]",
  },
  {
    src: TRAVELER_CALLOUT_CORD,
    alt: "Cord lock, pocket, and handle closeup on Lay-n-Go Traveler",
    label: "Cord Lock/Pocket + Handle",
    imageClassName: "origin-center scale-[1.52] object-cover object-bottom sm:scale-[1.48]",
  },
  {
    src: TRAVELER_CALLOUT_LIP,
    alt: "Convenient containment lip closeup on Lay-n-Go Traveler",
    label: "Convenient containment lip",
    imageClassName:
      "origin-center scale-[1.38] object-cover object-[14%_center] sm:scale-[1.34] sm:object-[12%_center]",
  },
] as const;

function TravelerMobileCallout({
  src,
  alt,
  label,
  imageClassName,
}: {
  src: string;
  alt: string;
  label: string;
  imageClassName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-2">
      <div className={cn("aspect-square h-32 w-32 shrink-0", CALLOUT_THUMB_SHADOW)}>
        <div className={CALLOUT_THUMB_INNER_CLIP}>
          <img
            src={src}
            alt={alt}
            className={cn("h-full w-full object-cover object-center", imageClassName)}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <p className="max-w-xs text-center font-heading text-xs font-bold uppercase leading-snug text-neutral-900">
        {label}
      </p>
    </div>
  );
}

function TravelerDetailCalloutSection() {
  const { w: vbW, h: vbH } = TRAVELER_CALLOUT_VIEWBOX;
  return (
    <section className="mx-auto mt-12 w-full max-w-6xl overflow-visible md:mt-14" aria-label="Traveler feature callouts">
      {/* Mobile — stacked hero, diameter, and callout thumbs (matches Large / Lifestyle diagrams) */}
      <div className="flex flex-col items-center gap-2 pb-8 md:hidden">
        <img
          src={TRAVELER_CALLOUT_MAIN}
          alt="Lay-n-Go Traveler opened flat with travel essentials organized inside"
          className={TRAVELER_MOBILE_HERO_CLASS}
          width={vbW}
          height={vbH}
          loading="lazy"
          decoding="async"
        />
        <LayNGoMatDiameterLine
          inches={20}
          variant="traveler-20"
          className={cn(TRAVELER_DIAMETER_CLASS, "mt-1.5 shrink-0 pb-0")}
        />
        <div className="flex w-full flex-col items-center gap-2">
          {TRAVELER_CALLOUTS.map((callout) => (
            <TravelerMobileCallout key={callout.label} {...callout} />
          ))}
        </div>
      </div>

      {/* Desktop — hero with leader lines and positioned callout thumbs */}
      <div className="mx-auto hidden w-full max-w-4xl md:block">
        <div className="relative overflow-visible">
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
        <LayNGoMatDiameterLine
          inches={20}
          variant="traveler-20"
          className="relative z-20 w-full shrink-0 pb-2 pt-1"
        />
      </div>
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
  productImageClass = LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
  labelClassName,
}: {
  src: string;
  alt: string;
  label: string;
  imgClassName: string;
  productImageClass?: string;
  labelClassName?: string;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[min(100%,42rem)]">
      <img
        src={src}
        alt={alt}
        className={cn("block w-full object-contain", productImageClass, imgClassName)}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="mt-2 px-2 sm:px-3">
        <p
          className={cn(
            "text-center font-heading font-bold uppercase leading-tight tracking-wide text-neutral-900",
            labelClassName ?? "text-[0.62rem] sm:text-xs",
          )}
        >
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
  headlineVideoId,
  showLowerSections = true,
  forceHeadlineSingleLine = false,
  showTravelerCalloutSection = false,
  calloutVariant = "large-60",
}: LayNGoLargePdpPlayStripProps) {
  const isDefenderCalloutVariant =
    calloutVariant === "defender-mini-16" || calloutVariant === "defender-tactical-20";

  const threeStepImageClassName = cn(
    "h-auto w-full max-w-full object-contain",
    calloutVariant === "lifestyle-44" && LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
    calloutVariant === "lifestyle-44"
      ? "max-h-[min(36vh,240px)] sm:max-h-[min(44vh,300px)] md:max-h-[min(50vh,400px)] lg:max-h-[480px]"
      : "max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );

  /** Lifestyle “triangle”: apex + base row — each photo gets more width than a 3-across strip. */
  const lifestyleTriangleApexImg = cn(
    "h-auto w-full max-w-full object-contain",
    LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
    "max-h-[min(50vh,340px)] sm:max-h-[min(56vh,420px)] md:max-h-[min(58vh,520px)] lg:max-h-[580px]",
  );
  const lifestyleTriangleBaseImg = cn(
    "h-auto w-full max-w-full object-contain",
    LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
    "max-h-[min(42vh,280px)] sm:max-h-[min(50vh,380px)] md:max-h-[min(54vh,460px)] lg:max-h-[520px]",
  );

  /** Large 60″ — mobile vertical stack uses the same sizing contract as Lifestyle. */
  const large60MobileApexImg = cn(
    threeStepImageClassName,
    "max-h-[min(50vh,340px)] sm:max-h-[min(56vh,420px)]",
  );
  const large60MobileBaseImg = cn(
    threeStepImageClassName,
    "max-h-[min(42vh,280px)] sm:max-h-[min(50vh,380px)]",
  );
  /** Large carry step — taller on mobile so strap + headline read clearly. */
  const large60MobileCarryImg = cn(
    threeStepImageClassName,
    "max-h-[min(58vh,400px)] sm:max-h-[min(64vh,480px)]",
  );
  const large60MobileCarryLabelClass =
    "max-w-[min(100%,24rem)] text-[0.8125rem] leading-snug sm:text-sm md:text-xs";

  const isLifestyleStrip = calloutVariant === "lifestyle-44";
  const threeStepFeatures = isLifestyleStrip
    ? [
        {
          src: FEATURE_OPEN_LIFESTYLE,
          alt: "Lay-n-Go Lifestyle mat open with building blocks; pulling the drawstring to begin cleanup",
          label: "Easy access and cleanup",
          mobileImgClassName: lifestyleTriangleApexImg,
        },
        {
          src: FEATURE_CINCH_LIFESTYLE,
          alt: "Cinching the Lay-n-Go Lifestyle drawstring to close the black mat bag",
          label: "Cinch it completely closed",
          mobileImgClassName: lifestyleTriangleBaseImg,
        },
        {
          src: FEATURE_CARRY_LIFESTYLE,
          alt: "Person wearing the cinched Lay-n-Go Lifestyle 44 inch mat as a backpack against a white studio background",
          label: "Wide strap for easy travel and storage",
          mobileImgClassName: lifestyleTriangleBaseImg,
        },
      ]
    : [
        {
          src: FEATURE_OPEN,
          alt: "Lay-n-Go Large open with toys; easy access to play and start cleanup",
          label: "Easy access and cleanup",
          mobileImgClassName: large60MobileApexImg,
        },
        {
          src: FEATURE_CINCH,
          alt: "Cinching the Lay-n-Go Large drawstring to gather the mat closed",
          label: "Cinch it completely closed",
          mobileImgClassName: large60MobileBaseImg,
        },
        {
          src: FEATURE_CARRY,
          alt: "Carrying the closed Lay-n-Go Large bag with the wide shoulder strap",
          label: "Wide strap for easy travel and storage",
          mobileImgClassName: large60MobileCarryImg,
          mobileLabelClassName: large60MobileCarryLabelClass,
        },
      ];

  /** Same flex column contract as Large so horizontal mobile row shares width and images scale with `object-contain`. */
  const threeStepImageColClassName = "flex min-h-0 min-w-0 flex-1 basis-0 justify-center";

  return (
    <section
      className={cn(
        "relative left-1/2 -ml-[50vw] w-screen overflow-y-visible overflow-x-clip px-4 pb-10 pt-6 text-foreground sm:px-6 sm:pb-12 sm:pt-8",
        calloutVariant === "lite-18" ||
        calloutVariant === "lifestyle-44" ||
        calloutVariant === "defender-mini-16" ||
        calloutVariant === "defender-tactical-20"
          ? "bg-background"
          : "bg-white",
      )}
      aria-labelledby="lay-n-go-large-play-strip-heading"
    >
      {isDefenderCalloutVariant ? <DefenderHeroVideo className="mb-6 sm:mb-8" /> : null}
      <h2
        id="lay-n-go-large-play-strip-heading"
        className={cn(
          "mx-auto max-w-5xl px-2 text-center font-heading font-black uppercase leading-[0.92] tracking-tight text-foreground sm:px-4",
          isDefenderCalloutVariant
            ? "text-[clamp(1.45rem,7.2vw,3.65rem)] sm:text-[clamp(1.85rem,7.5vw,3.65rem)]"
            : "text-[clamp(1.85rem,7.5vw,3.65rem)]",
          forceHeadlineSingleLine &&
            !isDefenderCalloutVariant &&
            "max-w-none whitespace-nowrap text-[clamp(1rem,4.8vw,3.65rem)]",
          forceHeadlineSingleLine && isDefenderCalloutVariant && "max-w-none whitespace-nowrap",
        )}
      >
        {headline}
      </h2>

      {calloutVariant === "lite-18" ? (
        <>
          {FLANK_STRIPS_BY_VARIANT["lite-18"] ? (
            <DefenderFlankStrip {...FLANK_STRIPS_BY_VARIANT["lite-18"]!} variant="lite-18" />
          ) : null}
          <LayNGoLiteStopMotionStrip />
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            <LayNGoLargeCalloutDiagram variant="lite-18" />
          </div>
        </>
      ) : calloutVariant && FLANK_STRIPS_BY_VARIANT[calloutVariant] ? (
        <DefenderFlankStrip {...FLANK_STRIPS_BY_VARIANT[calloutVariant]!} variant={calloutVariant} />
      ) : null}

      {calloutVariant !== "lite-18" && !calloutVariant.startsWith("defender-") ? (
        <div className="mx-auto mt-8 max-w-[min(100%,64rem)] sm:mt-10">
          {headlineVideoId ? (
            <div className="group relative aspect-video w-full overflow-hidden">
              <VimeoLoopFadeEmbed
                videoId={headlineVideoId}
                title="Lay-n-Go Traveler product video"
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
              <img
                src={headlineImageSrc}
                alt="Lay-n-Go Traveler product hero"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 transition-[opacity,transform] duration-700 ease-out lg:group-hover:opacity-100 lg:group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
                aria-hidden
              />
            </div>
          ) : (
            <img
              src={headlineImageSrc}
              alt="Lay-n-Go product hero image"
              className={cn(
                "block h-auto w-full max-w-full object-contain",
                calloutVariant === "lifestyle-44" && LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
              )}
              loading="lazy"
              decoding="async"
            />
          )}
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
              <>
                {/* Mobile: stacked steps — label on each image, dashed arrows point down */}
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-1 py-1 sm:gap-5 md:hidden">
                  {threeStepFeatures.map((step, index) => (
                    <div key={step.src} className="contents">
                      {index > 0 ? <LifestyleMobileDownArrow /> : null}
                      <LifestyleMobileStoryImage
                        src={step.src}
                        alt={step.alt}
                        label={step.label}
                        imgClassName={step.mobileImgClassName}
                        productImageClass={isLifestyleStrip ? LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS : undefined}
                        labelClassName={"mobileLabelClassName" in step ? step.mobileLabelClassName : undefined}
                      />
                    </div>
                  ))}
                </div>
                {/* Desktop: horizontal strip */}
                <div
                  className={cn(
                    "mx-auto hidden w-full max-w-full flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 md:flex sm:gap-1 sm:px-1 md:gap-2 lg:gap-3",
                    isLifestyleStrip && "md:-mt-[50px]",
                  )}
                >
                  <div className={threeStepImageColClassName}>
                    <img
                      src={threeStepFeatures[0].src}
                      alt={threeStepFeatures[0].alt}
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <FeatureConnector label={threeStepFeatures[0].label} />

                  <div className={threeStepImageColClassName}>
                    <img
                      src={threeStepFeatures[1].src}
                      alt={threeStepFeatures[1].alt}
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <FeatureConnector label={threeStepFeatures[2].label} />

                  <div className={threeStepImageColClassName}>
                    <img
                      src={threeStepFeatures[2].src}
                      alt={threeStepFeatures[2].alt}
                      className={threeStepImageClassName}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </>
            </div>
          ) : null}

          {calloutVariant !== "lite-18" ? (
            <LayNGoLargeCalloutDiagram variant={calloutVariant} />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
