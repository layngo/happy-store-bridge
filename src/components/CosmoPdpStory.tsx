import { useEffect, useId, useState } from "react";
import { readCosmoStoryArrowPath } from "@/data/cosmoPdpStoryArrows";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Editorial strip below Cosmo PDP hero — flush edges, white field matching photo backs,
 * dotted arrows drawn over images toward bag details.
 */

const COSMO_STORY_HEADLINE = "Forget everything you knew about a makeup bag.";
const MOBILE_EVERYTHING_ARROW_PATH =
  "M 40.2 10.4 C 77.2 6.5, 86.1 17.7, 73.9 27.4 Q 59.8 33.2, 58.2 43.7";

/** Dotted arrow; `pathD` is SVG path in 0–100 viewBox (see `src/data/cosmoPdpStoryArrows.ts`). */
function ArrowOverlay({
  pathD,
  markerId,
  className,
  preserveAspectRatio = "none",
}: {
  pathD: string;
  markerId: string;
  className?: string;
  preserveAspectRatio?: `${string} ${string}` | "none";
}) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] h-full w-full text-foreground",
        className,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden
    >
      <defs>
        <marker
          id={markerId}
          markerUnits="strokeWidth"
          markerWidth="7"
          markerHeight="7"
          refX="5.4"
          refY="3.5"
          orient="auto"
        >
          <path d="M 0 0 L 7 3.5 L 0 7 Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.45}
        strokeDasharray="3 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

/** Packup photo is 589×1024; size overlay like object-contain + bottom-right so 0–100 coords = image %. */
function PackupArrowOverlay({ pathD, markerId }: { pathD: string; markerId: string }) {
  return (
    <ArrowOverlay
      pathD={pathD}
      markerId={markerId}
      className="inset-auto bottom-0 right-0 h-[min(100cqh,calc(100cqw*1024/589))] w-[min(100cqw,calc(100cqh*589/1024))]"
    />
  );
}

function useCosmoStoryArrowPaths() {
  const [paths, setPaths] = useState(() => ({
    everything: readCosmoStoryArrowPath("everything"),
    packup: readCosmoStoryArrowPath("packup"),
  }));

  useEffect(() => {
    const sync = () => {
      setPaths({
        everything: readCosmoStoryArrowPath("everything"),
        packup: readCosmoStoryArrowPath("packup"),
      });
    };
    sync();
    window.addEventListener("cosmo-arrows-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cosmo-arrows-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return paths;
}

function RippleLipImage({
  src,
  className,
  alt = "",
  loading = "lazy",
  scale = 6,
  baseFrequency = 0.012,
}: {
  src: string;
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
  /** Higher = more ripple. Keep subtle. */
  scale?: number;
  /** Lower = larger ripples. */
  baseFrequency?: number;
}) {
  const rawId = useId().replace(/:/g, "");
  const filterId = `lip-ripple-${rawId}`;
  return (
    <>
      <svg width="0" height="0" aria-hidden focusable="false">
        <filter id={filterId} x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        style={{ filter: `url(#${filterId})` }}
      />
    </>
  );
}

export function CosmoPdpStory({ hideIntroImage = false }: { hideIntroImage?: boolean }) {
  const isMobile = useIsMobile();
  const arrowPaths = useCosmoStoryArrowPaths();
  const everythingArrowPath = isMobile ? MOBILE_EVERYTHING_ARROW_PATH : arrowPaths.everything;
  const packupArrowPath = arrowPaths.packup;

  const rawId = useId().replace(/:/g, "");
  const markerEverything = `cosmo-arr-ev-${rawId}`;
  const markerPackup = `cosmo-arr-pu-${rawId}`;

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white text-foreground"
      aria-labelledby="cosmo-story-intro"
    >
      {/* Block 1 — mobile: headline full bleed width; desktop: image | headline + bullets */}
      <div className="py-10 sm:py-12 md:flex md:flex-row md:flex-nowrap md:items-center md:gap-9 lg:gap-10 lg:py-14">
        <p id="cosmo-story-intro" className="sr-only">
          {COSMO_STORY_HEADLINE}
        </p>
        <p
          className="px-4 text-center font-heading text-[clamp(1.85rem,9vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground md:hidden"
          aria-hidden
        >
          {COSMO_STORY_HEADLINE}
        </p>

        <div
          className={cn(
            "mt-6 flex flex-row flex-nowrap items-center gap-4 pr-4 sm:gap-6 md:mt-0 md:flex-1 md:gap-9 md:pr-0 lg:gap-10",
            hideIntroImage && "px-4 md:px-8",
          )}
        >
          {!hideIntroImage ? (
            <div className="w-[clamp(145px,41.8vw,242px)] shrink-0 md:w-[clamp(163px,37.4vw,374px)]">
              <RippleLipImage
                src="/cosmo-pdp/story/image1.png"
                alt="Lay-n-Go Cosmo cosmetic bag opened flat with makeup and brushes visible"
                className="block h-auto w-full max-w-none object-left"
                loading="lazy"
                scale={5}
              />
            </div>
          ) : null}
          <div className={cn("min-w-0 flex-1", !hideIntroImage && "md:pr-8")}>
            <p
              className="hidden font-heading text-[clamp(1.35rem,5.8vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground lg:text-[clamp(1.75rem,5vw,4.75rem)] lg:leading-[0.9] md:block"
              aria-hidden
            >
              {COSMO_STORY_HEADLINE}
            </p>
            <ul className="mt-0 max-w-2xl list-disc space-y-2 pl-4 text-xs leading-snug text-neutral-600 marker:text-neutral-400 max-md:pl-3 md:mt-4 sm:pl-5 sm:text-sm md:text-[0.9375rem] md:leading-relaxed">
              <li>
                <span className="font-medium text-neutral-700">Fast, mess-free cleanup:</span> Lay it flat for full
                visibility, then cinch it closed in seconds so there is no more digging or clutter
              </li>
              <li>
                <span className="font-medium text-neutral-700">Smart travel organization:</span> Built-in pockets,
                brush loops, and raised edges keep everything secure and in place on the go
              </li>
              <li>
                <span className="font-medium text-neutral-700">Durable, water-resistant and machine washable:</span>{" "}
                Made to handle daily use and easy to clean, just toss it in the wash
              </li>
              <li>
                <span className="font-medium text-neutral-700">Perfect gift option:</span> Stylish, practical, and a
                thoughtful choice for any occasion
              </li>
              <li>
                <span className="font-medium text-neutral-700">Designed for everyday use:</span> Holds full-size makeup,
                brushes, skincare, and toiletries with ease
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <article className="relative bg-white">
          <div className="pointer-events-none absolute left-3 top-4 z-10 max-w-[min(92%,320px)] sm:left-6 sm:top-6 md:max-w-[48%]">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Everything in view.
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
              Light and flat. See every brush, balm, and bauble at once.
            </p>
          </div>
          <div className="flex w-full justify-center">
            <div className="relative mx-auto w-full max-w-[min(100%,620px)]">
              <RippleLipImage
                src="/cosmo-pdp/story/image2.png"
                alt="Lay-n-Go Cosmo bag laid flat — every cosmetic visible at once"
                className="block h-auto w-full object-contain object-bottom max-md:max-h-[min(72vh,560px)] md:max-h-[min(68vh,540px)]"
                loading="lazy"
                scale={7}
              />
              <ArrowOverlay pathD={everythingArrowPath} markerId={markerEverything} />
            </div>
          </div>
        </article>

        <article className="relative flex w-full flex-col bg-white md:items-end">
          <div className="pointer-events-none absolute left-3 top-4 z-20 max-w-[11rem] text-left sm:left-4 sm:top-5 sm:max-w-[13rem] md:left-4 md:top-6 md:max-w-[15rem] lg:max-w-[17rem]">
            <h2 className="font-heading text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl md:text-2xl">
              Pack up in seconds.
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
              Cinch the cord and you&apos;re out the door. No digging, no dumping.
            </p>
          </div>
          <div className="flex w-full justify-end self-end pr-0">
            <div className="relative mx-auto mr-0 w-full max-md:max-w-[min(76vw,340px)] [container-type:size] md:max-w-[min(62vw,520px)] lg:max-w-[560px]">
              <RippleLipImage
                src="/cosmo-pdp/story/image3.png"
                alt="Lay-n-Go Cosmo bag cinched closed and ready for travel"
                className="block h-auto w-full object-contain object-bottom object-right max-md:max-h-[min(34vh,320px)] md:max-h-[min(60vh,560px)] lg:max-h-[620px]"
                loading="lazy"
                scale={7}
              />
              <PackupArrowOverlay pathD={packupArrowPath} markerId={markerPackup} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
