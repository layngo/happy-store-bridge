/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

const HEADLINE = "THE NAIL BAG THAT FINALLY GETS IT";

function CalloutArrow({
  className,
  variant,
}: {
  className?: string;
  variant: "mesh" | "lip";
}) {
  if (variant === "mesh") {
    return (
      <svg
        className={className}
        viewBox="0 0 120 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M8 40 L88 12"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeDasharray="3 4"
          strokeLinecap="round"
          className="text-neutral-800/85"
        />
        <path d="M88 12 L82 8 L84 16 Z" fill="currentColor" className="text-neutral-800/85" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 120 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 8 L96 44"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        strokeLinecap="round"
        className="text-neutral-800/85"
      />
      <path d="M96 44 L94 36 L88 46 Z" fill="currentColor" className="text-neutral-800/85" />
    </svg>
  );
}

export function NailspaPdpStory() {
  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white pt-10 text-foreground sm:pt-12 md:pt-14"
      aria-labelledby="nailspa-story-headline"
    >
      <p id="nailspa-story-headline" className="sr-only">
        {HEADLINE}
      </p>

      {/* Row 1 — image left (edge-aligned), headline right; Cosmo-style bold uppercase */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="relative min-h-[220px] w-full shrink-0 md:w-[min(46vw,560px)] lg:w-[min(44vw,620px)]">
          <img
            src="/nailspa-pdp/story/image1.png"
            alt=""
            className="block h-full min-h-[220px] w-full object-cover object-center md:min-h-[300px]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 md:justify-start md:py-14 md:pl-8 lg:pl-12 lg:pr-16">
          <p
            className="max-w-[22ch] text-center font-heading text-[clamp(1.45rem,4.2vw,3.35rem)] font-black uppercase leading-[1.02] tracking-tight text-foreground sm:max-w-none md:text-left md:text-[clamp(1.65rem,3.5vw,3.75rem)] md:leading-[1.05] xl:whitespace-nowrap"
            aria-hidden
          >
            {HEADLINE}
          </p>
        </div>
      </div>

      {/* Row 2 — hero shot rotated 180°; left-column width (smaller than full-bleed); callouts */}
      <div className="relative w-full shrink-0 md:w-[min(46vw,560px)] lg:w-[min(44vw,620px)]">
        <img
          src="/nailspa-pdp/story/image2.png"
          alt=""
          className="block h-auto w-full rotate-180"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Mesh pockets — upper-left */}
          <div className="absolute left-[2%] top-[6%] flex max-w-[min(46%,240px)] flex-col items-start sm:left-[4%] sm:top-[8%] sm:max-w-[260px] md:left-[5%] md:top-[10%] md:max-w-[280px]">
            <div className="rounded-md bg-white/92 px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-sm sm:px-4 sm:py-3">
              <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
                Mesh pockets
              </h2>
              <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
                Eight elastic mesh pockets to hold your favorite polishes.
              </p>
            </div>
            <CalloutArrow variant="mesh" className="mt-1 ml-8 h-10 w-24 shrink-0 text-neutral-800 sm:ml-12 sm:h-12 sm:w-28 md:ml-16" />
          </div>

          {/* Containment lip — lower-left curve */}
          <div className="absolute bottom-[14%] left-[3%] flex max-w-[min(52%,280px)] flex-col items-start sm:bottom-[16%] sm:left-[4%] md:bottom-[18%] md:left-[6%] md:max-w-[300px]">
            <div className="rounded-md bg-white/92 px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-sm sm:px-4 sm:py-3">
              <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
                Convenient containment lip
              </h2>
              <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
                The raised lip keeps polish and tools from rolling off the counter.
              </p>
            </div>
            <CalloutArrow variant="lip" className="mt-2 ml-6 h-12 w-28 shrink-0 sm:ml-10 sm:h-14 sm:w-32 md:ml-14" />
          </div>
        </div>
      </div>
    </section>
  );
}
