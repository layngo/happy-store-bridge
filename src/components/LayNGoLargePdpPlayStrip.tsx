import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HEADLINE = "Clean up less, play more.";

const IMG_BLUE = "/products/lay-n-go-large-pdp/play-blue.png";
const IMG_GREEN = "/products/lay-n-go-large-pdp/play-green.png";

const FEATURE_OPEN = "/products/lay-n-go-large-pdp/feature-3-open.png";
const FEATURE_CINCH = "/products/lay-n-go-large-pdp/feature-4-cinch.png";
const FEATURE_CARRY = "/products/lay-n-go-large-pdp/feature-5-carry.png";
const ARROW_THICK = "/products/lay-n-go-large-pdp/arrow-thick.png";

const HERO_CALLOUT_MAIN = "/products/lay-n-go-large-pdp/hero-callout-main.png";
const CALLOUT_CORD = "/products/lay-n-go-large-pdp/callout-cord-pocket.png";
const CALLOUT_MESH = "/products/lay-n-go-large-pdp/callout-mesh-pockets.png";
const CALLOUT_LIP = "/products/lay-n-go-large-pdp/callout-containment-lip.png";

function CalloutCard({
  imageSrc,
  imageAlt,
  label,
  className,
}: {
  imageSrc: string;
  imageAlt: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-[17.5rem] items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 shadow-md sm:max-w-xs sm:gap-3.5 sm:p-3.5",
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-neutral-200 sm:h-[4.5rem] sm:w-[4.5rem]"
        loading="lazy"
        decoding="async"
      />
      <p className="font-heading text-left text-xs font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function DimensionSixtyInch({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col items-center px-2", className)}>
      <div className="flex w-full max-w-md items-end justify-center sm:max-w-lg">
        <div className="h-5 w-px shrink-0 bg-neutral-900" aria-hidden />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div className="h-5 w-px shrink-0 bg-neutral-900" aria-hidden />
      </div>
      <p className="mt-2 font-heading text-lg font-semibold tabular-nums text-neutral-900 sm:text-xl">60&quot;</p>
    </div>
  );
}

function LayNGoLargeCalloutDiagram() {
  return (
    <div
      className="mx-auto mt-14 max-w-6xl border-t border-neutral-200/80 pt-12 sm:mt-16 sm:pt-14"
      aria-label="Lay-n-Go Large product details"
    >
      {/* Mobile: stacked, no connector lines */}
      <div className="flex flex-col items-center gap-8 md:hidden">
        <img
          src={HERO_CALLOUT_MAIN}
          alt="Lay-n-Go Large 60 inch activity mat from above, filled with building blocks"
          className="w-full max-w-md object-contain"
          loading="lazy"
          decoding="async"
        />
        <CalloutCard
          imageSrc={CALLOUT_CORD}
          imageAlt="Cord lock, braided drawstring, and handle on Lay-n-Go"
          label="Cord lock, cord pocket, and handle"
        />
        <CalloutCard
          imageSrc={CALLOUT_MESH}
          imageAlt="Mesh pockets on the Lay-n-Go mat interior"
          label="4 mesh pockets to hold special pieces"
        />
        <CalloutCard
          imageSrc={CALLOUT_LIP}
          imageAlt="Reinforced strap and raised containment edge on Lay-n-Go"
          label="Convenient containment lip"
        />
        <DimensionSixtyInch className="mt-2" />
      </div>

      {/* Desktop: diagram with leader lines (layout ref: notebook sketch) */}
      <div className="mx-auto hidden w-full max-w-5xl md:block md:px-4">
        <div className="relative mx-auto h-[min(92vh,820px)] w-full max-w-5xl">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-neutral-900"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1="50"
              y1="12"
              x2="50"
              y2="32"
              stroke="currentColor"
              strokeWidth="0.32"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="19"
              y1="47"
              x2="36"
              y2="51"
              stroke="currentColor"
              strokeWidth="0.32"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="49"
              y1="71"
              x2="45"
              y2="87"
              stroke="currentColor"
              strokeWidth="0.32"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="absolute left-1/2 top-[1%] z-20 w-[min(92%,17.5rem)] -translate-x-1/2 sm:w-80">
            <CalloutCard
              imageSrc={CALLOUT_CORD}
              imageAlt="Cord lock, braided drawstring, and handle on Lay-n-Go"
              label="Cord lock, cord pocket, and handle"
              className="w-full"
            />
          </div>

          <div className="absolute left-[0.5%] top-[41%] z-20 w-[min(44%,17rem)] -translate-y-1/2 sm:left-[1%] sm:w-72">
            <CalloutCard
              imageSrc={CALLOUT_LIP}
              imageAlt="Reinforced strap and raised containment edge on Lay-n-Go"
              label="Convenient containment lip"
              className="w-full"
            />
          </div>

          <div className="absolute bottom-[6%] left-[20%] z-20 w-[min(50%,17.5rem)] sm:bottom-[7%] sm:left-[24%]">
            <CalloutCard
              imageSrc={CALLOUT_MESH}
              imageAlt="Mesh pockets on the Lay-n-Go mat interior"
              label="4 mesh pockets to hold special pieces"
              className="w-full"
            />
          </div>

          <div className="absolute left-1/2 top-[20%] z-10 w-[min(88%,28rem)] -translate-x-1/2 lg:w-[min(90%,32rem)]">
            <div className="relative">
              <img
                src={HERO_CALLOUT_MAIN}
                alt="Lay-n-Go Large 60 inch activity mat from above, filled with building blocks"
                className="relative z-10 w-full object-contain drop-shadow-sm"
                loading="lazy"
                decoding="async"
              />
              <span
                className="absolute left-1/2 top-[24%] z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-sm ring-1 ring-white"
                aria-hidden
              />
              <span
                className="absolute left-[30%] top-[50%] z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-sm ring-1 ring-white"
                aria-hidden
              />
              <span
                className="absolute left-[47%] top-[69%] z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-sm ring-1 ring-white"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="mx-auto w-[min(88%,28rem)] lg:w-[min(90%,32rem)]">
          <DimensionSixtyInch className="pt-2" />
        </div>
      </div>
    </div>
  );
}

function ThickArrow({ className }: { className?: string }) {
  return (
    <img
      src={ARROW_THICK}
      alt=""
      width={200}
      height={200}
      className={cn("h-auto w-[min(100%,7.5rem)] object-contain md:w-[min(100%,9.25rem)] lg:w-40", className)}
      loading="lazy"
      decoding="async"
      aria-hidden
    />
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
      <ThickArrow className="rotate-90 md:rotate-0" />
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
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
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
