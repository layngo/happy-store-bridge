/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

const HEADLINE = "THE NAIL BAG THAT ACTUALLY GETS IT.";
const IMG_MAIN = "/nailspa-pdp/story/image1.png";
const IMG_BOTTOM = "/nailspa-pdp/story/bottom-hero.png";

const CALLOUT_PANEL = "rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-3";

function CalloutArrow({
  className,
  variant,
}: {
  className?: string;
  variant: "mesh" | "lipRight" | "cord";
}) {
  if (variant === "mesh") {
    return (
      <svg className={className} viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
  if (variant === "lipRight") {
    return (
      <svg className={className} viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M112 12 L28 42"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeDasharray="3 4"
          strokeLinecap="round"
          className="text-neutral-800/85"
        />
        <path d="M28 42 L30 34 L36 46 Z" fill="currentColor" className="text-neutral-800/85" />
      </svg>
    );
  }
  if (variant === "cord") {
    return (
      <svg className={className} viewBox="0 0 120 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M112 46 L22 14"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeDasharray="3 4"
          strokeLinecap="round"
          className="text-neutral-800/85"
        />
        <path d="M22 14 L18 22 L28 18 Z" fill="currentColor" className="text-neutral-800/85" />
      </svg>
    );
  }
  return null;
}

function MainImageCallouts({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Mesh — left */}
      <div className="absolute left-[1%] top-[14%] z-10 flex max-w-[min(48%,220px)] flex-col items-start sm:left-[3%] sm:top-[12%] sm:max-w-[240px] md:left-[4%] md:top-[14%] md:max-w-[260px] lg:max-w-[280px]">
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Mesh pockets
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Eight elastic mesh pockets to hold your favorite polishes.
          </p>
        </div>
        <CalloutArrow variant="mesh" className="mt-1 ml-6 h-10 w-24 shrink-0 sm:ml-10 sm:h-12 sm:w-28 md:ml-14" />
      </div>

      {/* Containment lip — right */}
      <div className="absolute right-[1%] top-[10%] z-10 flex max-w-[min(50%,240px)] flex-col items-end sm:right-[2%] sm:max-w-[260px] md:right-[3%] md:max-w-[280px] lg:max-w-[300px]">
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Convenient containment lip
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            The raised lip keeps polish and tools from falling off the counter.
          </p>
        </div>
        <CalloutArrow variant="lipRight" className="mt-2 mr-8 h-12 w-28 shrink-0 sm:mr-12 sm:h-14 sm:w-32 md:mr-14" />
      </div>

      {/* Cord lock — lower right */}
      <div className="absolute bottom-[8%] right-[2%] z-10 flex max-w-[min(54%,260px)] flex-col items-end sm:bottom-[10%] sm:max-w-[280px] md:bottom-[12%] md:right-[4%] md:max-w-[300px]">
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Sliding cord lock and cord pocket
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed. Grab the handle on the go.
          </p>
        </div>
        <CalloutArrow variant="cord" className="mt-2 mr-6 h-12 w-28 shrink-0 sm:mr-10 sm:h-14 sm:w-32 md:mr-12" />
      </div>
    </div>
  );
}

/** Curved arrow + label over the closed-bag photo. Tweak path in SVG when adjusting. */
function CarryingHandleOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      <div className="absolute bottom-[6%] left-[4%] max-w-[min(78%,280px)] rounded-md bg-white/[0.82] px-3 py-2 shadow-md shadow-black/[0.08] backdrop-blur-md sm:bottom-[8%] sm:max-w-[300px] sm:px-4 sm:py-2.5 md:bottom-[10%] md:left-[5%]">
        <p className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg">
          Carrying handle for easy travel
        </p>
      </div>
      <svg
        className="absolute inset-0 size-full text-neutral-900"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 22 82 Q 42 58 50 38 Q 54 26 53 18"
          stroke="currentColor"
          strokeWidth={0.85}
          strokeDasharray="2 3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-[0.92]"
        />
        <path d="M52 17 L54 21 L56 17 Z" fill="currentColor" className="opacity-[0.92]" />
      </svg>
    </div>
  );
}

function BottomProductImage({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative w-full overflow-visible border-0 bg-transparent shadow-none ring-0", className)}
      aria-label="Lay-n-Go NAILSPA closed with carry handle"
    >
      <div className="relative min-h-[min(52vh,440px)] w-full sm:min-h-[min(54vh,480px)] md:min-h-[min(56vh,560px)] lg:min-h-[min(58vh,620px)]">
        <img
          src={IMG_BOTTOM}
          alt=""
          className="absolute inset-0 size-full object-contain object-center"
          draggable={false}
          loading="lazy"
        />
        <CarryingHandleOverlay />
      </div>
    </div>
  );
}

export function NailspaPdpStory() {
  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white pt-10 text-foreground sm:pt-12 md:pt-14"
      aria-labelledby="nailspa-story-headline"
    >
      <div className="px-5 pb-8 sm:px-8 sm:pb-10 md:pb-12">
        <p
          id="nailspa-story-headline"
          className="text-center font-heading text-[clamp(2rem,7.5vw,4.75rem)] font-black uppercase leading-[1.02] tracking-tight text-foreground md:text-[clamp(2.35rem,5.5vw,5.25rem)] md:leading-[1.03]"
        >
          {HEADLINE}
        </p>
      </div>

      {/* Main hero — image 1 + three callouts */}
      <div className="relative px-4 pb-12 sm:px-6 sm:pb-14 md:px-10 md:pb-16 lg:px-14">
        <Dialog>
          <div className="relative mx-auto max-w-[min(100%,1120px)]">
            <DialogTrigger asChild>
              <button
                type="button"
                className="group relative z-0 block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-transparent p-0 text-left shadow-md shadow-black/[0.07] ring-offset-background transition-shadow hover:shadow-lg hover:shadow-black/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="sr-only">Open larger product photo</span>
                <img
                  src={IMG_MAIN}
                  alt=""
                  className="relative z-0 block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.02]"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            </DialogTrigger>

            <MainImageCallouts className="pointer-events-none absolute inset-0 z-10 max-md:hidden" />

            <DialogContent className="max-h-[95vh] max-w-[min(96vw,1200px)] border-0 bg-transparent p-2 shadow-none sm:max-w-[min(96vw,1200px)] [&>button]:text-white [&>button]:drop-shadow-md">
              <DialogTitle className="sr-only">Nail bag product photo</DialogTitle>
              <img src={IMG_MAIN} alt="" className="mx-auto max-h-[88vh] w-full max-w-full object-contain" />
            </DialogContent>
          </div>
        </Dialog>

        {/* Mobile: stacked callouts under hero (tap targets stay clear) */}
        <div className="mx-auto mt-6 max-w-[min(100%,1120px)] space-y-4 md:hidden">
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Mesh pockets</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Eight elastic mesh pockets to hold your favorite polishes.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Convenient containment lip</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              The raised lip keeps polish and tools from falling off the counter.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
              Sliding cord lock and cord pocket
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed. Grab the handle on the go.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom — closed bag photo + nail mat copy */}
      <div className="px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[min(100%,1200px)] flex-col gap-10 md:flex-row md:items-start md:gap-10 lg:gap-12">
          <div className="w-full shrink-0 md:w-[min(58%,720px)] lg:w-[min(60%,780px)]">
            <BottomProductImage />
          </div>

          <div className="flex flex-1 flex-col md:justify-center md:pt-4">
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                High quality nail mat
              </h3>
              <p className="mt-2 max-w-prose text-sm leading-snug text-neutral-700 sm:text-base">
                The Nailspa is machine washable and wipeable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
