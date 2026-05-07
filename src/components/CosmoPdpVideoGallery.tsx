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

    let intervalId: ReturnType<typeof window.setInterval>;

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
    <section className="mt-10 sm:mt-12" aria-label="Cosmo lifestyle gallery">
      <h2 className="font-heading text-center text-xl font-bold tracking-tight text-foreground sm:text-left sm:text-2xl">
        Gallery
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-white shadow-inner">
        <div ref={emblaRef} className="touch-pan-y">
          <div className="flex">
            {COSMO_LIFESTYLE_GALLERY.map((item, i) => (
              <div key={item.src} className="min-w-0 shrink-0 grow-0 basis-full">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="block h-auto max-h-[min(72vh,640px)] w-full bg-white object-contain object-center"
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
        aria-label="Gallery images"
      >
        {COSMO_LIFESTYLE_GALLERY.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-label={`Show image ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-[opacity,box-shadow]",
              selected === i
                ? "border-primary opacity-100 shadow-sm ring-2 ring-primary/20"
                : "border-transparent opacity-75 hover:opacity-100",
            )}
          >
            <img src={item.src} alt="" className="h-full w-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </section>
  );
}
