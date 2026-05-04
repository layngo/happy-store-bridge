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
  /* Paths in 0–100 coords (stretch with photo via preserveAspectRatio="none").
   * "everything": starts ~after “Everything in view.” ends; ends ~rim midpoint between mirrors.
   * "packup": starts under centered headline; ends ~drawstring / cinch line. */
  const d =
    variant === "everything"
      ? "M 44 12 Q 44 54 50 83"
      : "M 50 19 Q 51 28 50 36";

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
      {/* Block 1 — larger image 1 flush left; text column vertically centered for easier pairing */}
      <div className="flex flex-row flex-nowrap items-center gap-4 py-10 sm:gap-6 sm:py-12 md:gap-9 lg:gap-10 lg:py-14">
        <div className="w-[clamp(148px,34vw,340px)] shrink-0">
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
              <ArrowOverlay variant="everything" markerId={markerEverything} />
            </div>
          </div>
        </article>

        <article className="relative bg-white">
          <div className="pointer-events-none absolute left-1/2 top-4 z-10 w-[min(94%,380px)] -translate-x-1/2 text-center sm:top-6">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Pack up in seconds.
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
              Cinch the cord and you&apos;re out the door. No digging, no dumping.
            </p>
          </div>
          <div className="flex w-full justify-center">
            <div className="relative mx-auto w-full max-w-[min(100%,620px)]">
              <img
                src="/cosmo-pdp/story/image3.png"
                alt=""
                className="block h-auto w-full object-contain object-bottom max-md:max-h-[min(72vh,560px)] md:max-h-[min(68vh,540px)]"
                loading="lazy"
              />
              <ArrowOverlay variant="packup" markerId={markerPackup} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
