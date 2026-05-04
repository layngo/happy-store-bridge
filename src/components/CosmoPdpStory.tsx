import { useId } from "react";

/**
 * Editorial strip below Cosmo PDP hero — flush edges, white field matching photo backs,
 * dotted arrows drawn over images toward bag details.
 */

function ArrowOverlay({
  variant,
  markerId,
}: {
  variant: "everything" | "packup";
  markerId: string;
}) {
  const d =
    variant === "everything"
      ? "M 11 22 Q 38 54 52 84"
      : "M 89 21 Q 62 26 51 34";

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
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeDasharray="3 5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

export function CosmoPdpStory() {
  const rawId = useId().replace(/:/g, "");
  const markerEverything = `cosmo-arr-ev-${rawId}`;
  const markerPackup = `cosmo-arr-pu-${rawId}`;

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white text-foreground"
      aria-labelledby="cosmo-story-intro"
    >
      {/* Block 1 — image 1 flush left edge of viewport; headline + bullet subtext beside */}
      <div className="flex flex-row flex-nowrap items-start gap-3 py-10 sm:gap-5 sm:py-12 md:gap-8 lg:py-14">
        <div className="w-[clamp(112px,26vw,260px)] shrink-0">
          <img
            src="/cosmo-pdp/story/image1.png"
            alt=""
            className="block h-auto w-full max-w-none"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1 pr-4 sm:pr-8">
          <p
            id="cosmo-story-intro"
            className="font-heading text-[clamp(1.35rem,5.8vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground lg:text-[clamp(1.75rem,5vw,4.75rem)] lg:leading-[0.9]"
          >
            Forget everything you knew about a makeup bag.
          </p>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-4 text-xs leading-snug text-neutral-600 marker:text-neutral-400 sm:mt-5 sm:pl-5 sm:text-sm md:text-[0.9375rem] md:leading-relaxed">
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

      {/* Blocks 2 & 3 — full width, images flush outer edges (column gutters none at lg) */}
      <div className="grid gap-0 md:grid-cols-2">
        <article className="relative bg-white">
          <div className="pointer-events-none absolute left-3 top-4 z-10 max-w-[min(92%,320px)] sm:left-6 sm:top-6 md:max-w-[48%]">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Everything in view.
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
              Light and flat—see every brush, balm, and bauble at once.
            </p>
          </div>
          <div className="relative w-full">
            <img
              src="/cosmo-pdp/story/image2.png"
              alt=""
              className="block h-auto w-full max-w-none object-contain object-bottom"
              loading="lazy"
            />
            <ArrowOverlay variant="everything" markerId={markerEverything} />
          </div>
        </article>

        <article className="relative bg-white">
          <div className="pointer-events-none absolute right-3 top-4 z-10 max-w-[min(92%,320px)] text-right sm:right-6 sm:top-6 md:max-w-[48%]">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Pack up in seconds.
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
              Cinch the cord and you&apos;re out the door. No digging, no dumping.
            </p>
          </div>
          <div className="relative w-full">
            <img
              src="/cosmo-pdp/story/image3.png"
              alt=""
              className="block h-auto w-full max-w-none object-contain object-bottom"
              loading="lazy"
            />
            <ArrowOverlay variant="packup" markerId={markerPackup} />
          </div>
        </article>
      </div>
    </section>
  );
}
