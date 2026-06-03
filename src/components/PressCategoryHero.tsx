import { cn } from "@/lib/utils";

const cosmoDisplayHeadlineClass =
  "text-center font-heading font-black uppercase leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]";

type PressCategoryHeroProps = {
  imageSrc: string;
  imageSrcSet?: string;
  imageAlt: string;
  title: string;
  objectPosition?: string;
  /** Below 1 zooms out within the crop (e.g. 0.88). */
  imageScale?: number;
};

export const PressCategoryHero = ({
  imageSrc,
  imageSrcSet,
  imageAlt,
  title,
  objectPosition = "center",
}: PressCategoryHeroProps) => (
  <section
    className="not-prose relative left-1/2 mb-10 w-screen max-w-[100vw] -translate-x-1/2 sm:mb-12"
    aria-labelledby="press-category-hero-title"
  >
    <div className="relative aspect-[5/2] min-h-[11rem] w-full overflow-hidden bg-black sm:aspect-[21/8] sm:min-h-[13rem] md:min-h-[15rem] lg:aspect-[3/1] lg:min-h-[17rem]">
      <img
        src={imageSrc}
        srcSet={imageSrcSet}
        sizes="100vw"
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition,
          ...(imageScale != null && imageScale < 1
            ? { transform: `scale(${imageScale})`, transformOrigin: objectPosition }
            : {}),
        }}
        loading="eager"
        decoding="async"
      />

      {/* Vignette — darker edges, clearer center for headline */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_95%_at_50%_50%,transparent_0%,transparent_42%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.72)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/40"
        aria-hidden
      />

      <h1
        id="press-category-hero-title"
        className={cn(
          cosmoDisplayHeadlineClass,
          "absolute inset-0 z-10 flex items-center justify-center px-5 py-10 sm:px-10",
          "text-[clamp(1.35rem,5.5vw,2.75rem)] sm:text-[clamp(1.5rem,4.5vw,3.25rem)] lg:text-[clamp(1.75rem,3.8vw,3.75rem)]",
        )}
      >
        <span className="max-w-[min(100%,52rem)]">{title}</span>
      </h1>
    </div>
  </section>
);
