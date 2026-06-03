import { cn } from "@/lib/utils";

const cosmoDisplayHeadlineClass =
  "text-center font-heading font-black leading-[0.88] tracking-tight text-white";

type PressYearRangeHeroProps = {
  /** e.g. `2017-2018` */
  title: string;
};

export const PressYearRangeHero = ({ title }: PressYearRangeHeroProps) => (
  <section
    className="not-prose relative left-1/2 mb-10 w-screen max-w-[100vw] -translate-x-1/2 sm:mb-12"
    aria-labelledby="press-year-range-hero-title"
  >
    <div className="relative flex min-h-[11rem] w-full items-center justify-center overflow-hidden bg-foreground px-6 py-14 sm:min-h-[13rem] sm:px-10 md:min-h-[16rem] lg:min-h-[18rem]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_100%_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_45%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      <h1
        id="press-year-range-hero-title"
        className={cn(
          cosmoDisplayHeadlineClass,
          "relative z-10 text-[clamp(2.75rem,14vw,6.5rem)] sm:text-[clamp(3.25rem,12vw,7.5rem)]",
        )}
      >
        {title}
      </h1>
    </div>
  </section>
);
