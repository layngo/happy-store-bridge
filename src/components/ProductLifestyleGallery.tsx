import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";

export type LifestyleGallerySlide = {
  src: string;
  alt: string;
};

const AUTOPLAY_MS = 5500;

const GALLERY_ARROW_BTN =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-black p-0 text-white hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:h-11 sm:w-11";

const GALLERY_ARROW_ICON = "block h-5 w-5 shrink-0 stroke-[2.25]";

type ProductLifestyleGalleryProps = {
  slides: readonly LifestyleGallerySlide[];
  /** Accessible name for the gallery region */
  ariaLabel: string;
  className?: string;
  /** Main stage + thumb strip background (e.g. `bg-background` on Nailspa) */
  surfaceClassName?: string;
};

export function ProductLifestyleGallery({
  slides,
  ariaLabel,
  className,
  surfaceClassName = "bg-neutral-50",
}: ProductLifestyleGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slides.length < 2) return;

    let intervalId: number;

    const start = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        emblaApi.scrollNext();
      }, AUTOPLAY_MS);
    };

    start();

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else window.clearInterval(intervalId);
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [emblaApi, slides.length]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  if (slides.length === 0) return null;

  return (
    <div className={cn("w-full", className)} aria-label={ariaLabel}>
      <div
        className={cn(
          "relative mx-auto flex aspect-square w-full max-w-[min(100%,42rem)] flex-col overflow-hidden rounded-2xl border border-border shadow-inner",
          surfaceClassName,
        )}
        aria-roledescription="carousel"
      >
        <span className="sr-only" aria-live="polite">
          Photo {selected + 1} of {slides.length}
        </span>

        <div className="relative min-h-0 flex-1 px-2 pt-2 sm:px-3 sm:pt-3">
          <div ref={emblaRef} className="h-full min-h-0 touch-pan-y overflow-hidden">
            <div className="flex h-full">
              {slides.map((item, i) => (
                <div
                  key={item.src}
                  className={cn(
                    "flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center p-1 sm:p-2",
                    surfaceClassName,
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain object-center"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={cn(GALLERY_ARROW_BTN, "absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-4")}
            onClick={scrollPrev}
            aria-label="Show previous photo"
          >
            <ChevronLeft className={GALLERY_ARROW_ICON} aria-hidden />
          </button>

          <button
            type="button"
            className={cn(GALLERY_ARROW_BTN, "absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-4")}
            onClick={scrollNext}
            aria-label="Show next photo"
          >
            <ChevronRight className={GALLERY_ARROW_ICON} aria-hidden />
          </button>
        </div>

        <div
          className={cn(
            "flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-border/60 px-2 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-start sm:px-3 sm:py-3 [&::-webkit-scrollbar]:hidden",
            surfaceClassName,
          )}
          role="tablist"
          aria-label="Select photo"
        >
          {slides.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "pointer-events-auto flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-white p-0.5 shadow-sm transition-[opacity,box-shadow] sm:w-11",
                selected === i
                  ? "border-primary opacity-100 shadow-sm ring-2 ring-primary/20"
                  : "border-border/60 opacity-90 hover:border-border hover:opacity-100",
              )}
            >
              <img src={item.src} alt="" className="h-full w-full object-contain" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
