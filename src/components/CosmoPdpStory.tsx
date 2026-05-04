/**
 * Editorial storytelling strip below the Cosmo PDP hero (image 1–3 + headlines).
 * Assets: `public/cosmo-pdp/story/image*.png`
 */

function DottedArrowDown({ variant }: { variant: "left" | "right" }) {
  const id = variant === "left" ? "cosmo-arr-l" : "cosmo-arr-r";
  const d =
    variant === "left"
      ? "M 18 6 Q 42 52 50 94"
      : "M 82 6 Q 58 52 50 94";

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none -my-1 h-[4.5rem] w-full max-w-[220px] text-foreground md:h-[6rem] md:max-w-none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <marker id={id} markerUnits="strokeWidth" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="6 10"
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

export function CosmoPdpStory() {
  return (
    <section className="mt-14 space-y-14 sm:mt-16 sm:space-y-16 lg:space-y-20" aria-labelledby="cosmo-story-intro">
      {/* Block 1 — image 1 + headline */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="w-full max-w-[240px] justify-self-center overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-lg sm:max-w-[300px] lg:max-w-[340px] lg:justify-self-start">
          <img
            src="/cosmo-pdp/story/image1.png"
            alt=""
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
        <p
          id="cosmo-story-intro"
          className="font-heading text-balance text-2xl font-bold uppercase leading-[1.15] tracking-wide text-foreground sm:text-3xl md:text-4xl lg:py-4 lg:text-[2.35rem] lg:leading-[1.12]"
        >
          Forget everything you knew about a makeup bag.
        </p>
      </div>

      {/* Blocks 2 & 3 — side by side */}
      <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-14">
        <article className="flex flex-col">
          <div className="space-y-2 px-0.5">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Everything in view.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Light and flat—see every brush, balm, and bauble at once.
            </p>
          </div>
          <div className="flex justify-center md:justify-start lg:pl-[min(12vw,4rem)]">
            <DottedArrowDown variant="left" />
          </div>
          <div className="mt-1 overflow-hidden rounded-2xl border border-border bg-muted/15 shadow-md">
            <img
              src="/cosmo-pdp/story/image2.png"
              alt=""
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </article>

        <article className="flex flex-col">
          <div className="space-y-2 px-0.5 md:text-right">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Pack up in seconds.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base md:ml-auto md:text-right">
              Cinch the cord and you&apos;re out the door. No digging, no dumping.
            </p>
          </div>
          <div className="flex justify-center md:justify-end lg:pr-[min(12vw,4rem)]">
            <DottedArrowDown variant="right" />
          </div>
          <div className="mt-1 overflow-hidden rounded-2xl border border-border bg-muted/15 shadow-md">
            <img
              src="/cosmo-pdp/story/image3.png"
              alt=""
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
