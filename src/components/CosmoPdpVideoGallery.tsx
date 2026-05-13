import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";

export const COSMO_LIFESTYLE_GALLERY = [
  {
    src: "/cosmo-pdp/gallery/01.png",
    alt: "Lay-n-Go Cosmo cosmetic bag in a tiled shower niche with toiletries",
  },
  {
    src: "/cosmo-pdp/gallery/02.png",
    alt: "Pink Lay-n-Go Cosmo open flat on a bathroom vanity with makeup inside",
  },
  {
    src: "/cosmo-pdp/gallery/03.png",
    alt: "Pink Lay-n-Go Cosmo hanging from a hook in a tiled bathroom",
  },
  {
    src: "/cosmo-pdp/gallery/04.png",
    alt: "Close-up of pink Lay-n-Go Cosmo bag with Lay-n-Go branding visible",
  },
  {
    src: "/cosmo-pdp/gallery/05.png",
    alt: "Black Lay-n-Go Cosmo open flat on a marble counter with makeup and brushes",
  },
  {
    src: "/cosmo-pdp/gallery/06.png",
    alt: "Group photo around an open black Lay-n-Go Cosmo filled with cosmetics",
  },
] as const;

const AUTOPLAY_MS = 5500;

export function CosmoPdpVideoGallery() {
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
    if (!emblaApi) return;

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
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <section className="mt-10 sm:mt-12" aria-label="Cosmo lifestyle photos">
      <div className="relative mx-auto aspect-square w-full max-w-[min(100%,42rem)] overflow-hidden rounded-2xl border border-border bg-neutral-50 shadow-inner">
        <div ref={emblaRef} className="h-full w-full touch-pan-y overflow-hidden">
          <div className="flex h-full">
            {COSMO_LIFESTYLE_GALLERY.map((item, i) => (
              <div
                key={item.src}
                className="flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center bg-neutral-50 p-2 sm:p-3"
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
      </div>

      <div
        className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-start"
        role="tablist"
        aria-label="Select lifestyle photo"
      >
        {COSMO_LIFESTYLE_GALLERY.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-label={`Show photo ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "flex aspect-square w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-muted/90 p-0.5 transition-[opacity,box-shadow] sm:w-12",
              selected === i
                ? "border-primary opacity-100 shadow-sm ring-2 ring-primary/20"
                : "border-border/50 opacity-80 hover:border-border hover:opacity-100",
            )}
          >
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-contain"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
