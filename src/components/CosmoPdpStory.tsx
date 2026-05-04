import { useEffect, useId, useState } from "react";
import { readCosmoStoryArrowPath } from "@/data/cosmoPdpStoryArrows";

/**
 * Editorial strip below Cosmo PDP hero — flush edges, white field matching photo backs,
 * dotted arrows drawn over images toward bag details.
 *
 * Arrow paths: edit `src/data/cosmoPdpStoryArrows.ts`, or use the interactive tool at `/dev/cosmo-arrows`
 * (drag handles → Save to this browser to preview on Cosmo PDPs).
 */

const COSMO_STORY_HEADLINE = "Forget everything you knew about a makeup bag.";

/** Dotted arrow; `pathD` is SVG path in 0–100 viewBox (see `src/data/cosmoPdpStoryArrows.ts` and `/dev/cosmo-arrows`). */
function ArrowOverlay({ pathD, markerId }: { pathD: string; markerId: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full text-foreground"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker
          id={markerId}
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeDasharray="3 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
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

export function CosmoPdpStory() {
  const arrowPaths = useCosmoStoryArrowPaths();
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
        {/* Mobile-only: headline uses full row width (large type scales with viewport) */}
        <p
          className="px-4 text-center font-heading text-[clamp(1.85rem,9vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground md:hidden"
          aria-hidden
        >
          {COSMO_STORY_HEADLINE}
        </p>

        <div className="mt-6 flex flex-row flex-nowrap items-center gap-4 px-4 sm:gap-6 md:mt-0 md:flex-1 md:gap-9 md:px-0 lg:gap-10">
          <div className="w-[clamp(132px,38vw,220px)] shrink-0 md:w-[clamp(148px,34vw,340px)]">
            <img
              src="/cosmo-pdp/story/image1.png"
              alt=""
              className="block h-auto w-full max-w-none"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1 md:pr-8">
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

      {/* Blocks 2 & 3 — full width, images flush outer edges (column gutters none at lg) */}
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
              <img
                src="/cosmo-pdp/story/image2.png"
                alt=""
                className="block h-auto w-full object-contain object-bottom max-md:max-h-[min(72vh,560px)] md:max-h-[min(68vh,540px)]"
                loading="lazy"
              />
              <ArrowOverlay pathD={arrowPaths.everything} markerId={markerEverything} />
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
          {/* Image 3: ~50% larger than prior tiny cap; flush to viewport right (same idea as image1 flush left) */}
          <div className="flex w-full justify-end self-end pr-0">
            <div className="relative ml-auto mr-0 w-full max-md:max-w-[min(54vw,226px)] md:max-w-[min(48vw,332px)] lg:max-w-[360px]">
              <img
                src="/cosmo-pdp/story/image3.png"
                alt=""
                className="block h-auto w-full object-contain object-bottom object-right max-md:max-h-[min(17vh,156px)] md:max-h-[min(38vh,312px)] lg:max-h-[336px]"
                loading="lazy"
              />
              <ArrowOverlay pathD={arrowPaths.packup} markerId={markerPackup} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
