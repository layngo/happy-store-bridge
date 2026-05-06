import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { getCollectionGridSwatchPreview } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { Loader2, ChevronRight, Home } from "lucide-react";

const COLLECTION_HANDLE = "cosmetic-bags";

const IMG_16 = "/cosmetic-bags-v2/cosmo-16.png";
const IMG_20 = "/cosmetic-bags-v2/cosmo-20.png";
const IMG_22 = "/cosmetic-bags-v2/cosmo-22.png";

/** Largest circle (22″) width; 16″ and 20″ derive from 16:20:22. */
const COSMO_CIRCLE_BASE_REM = 18.25;

type SizeSpec = {
  inches: 16 | 20 | 22;
  /** Upper overlay on the circle — matches Cosmo PDP story headline typography. */
  shortName: string;
  imageSrc: string;
  imageAlt: string;
  match: (handle: string, title: string) => boolean;
};

const SIZE_SPECS: SizeSpec[] = [
  {
    inches: 16,
    shortName: "Cosmo Mini",
    imageSrc: IMG_16,
    imageAlt: "Lay-n-Go Cosmo Mini 16 inch open flat",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return (h.includes("cosmo") && h.includes("mini") && h.includes("16")) || (t.includes("cosmo") && t.includes("mini") && t.includes("16"));
    },
  },
  {
    inches: 20,
    shortName: "Cosmo",
    imageSrc: IMG_20,
    imageAlt: "Lay-n-Go Cosmo 20 inch open flat",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return h.includes("cosmo-20") || h.endsWith("cosmo-20") || (t.includes("cosmo") && t.includes("20"));
    },
  },
  {
    inches: 22,
    shortName: "Cosmo Deluxe",
    imageSrc: IMG_22,
    imageAlt: "Lay-n-Go Cosmo Deluxe 22 inch open flat",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return h.includes("deluxe-22") || (h.includes("cosmo") && h.includes("22")) || (t.includes("cosmo") && t.includes("22"));
    },
  },
];

function DiameterScale({ inches, className, dense }: { inches: number; className?: string; dense?: boolean }) {
  return (
    <div className={cn("mt-3 flex w-full flex-col items-center px-1", className)}>
      <div className="flex w-full items-end justify-center">
        <div className={cn(dense ? "h-2.5" : "h-4", "w-px shrink-0 bg-neutral-900")} aria-hidden />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div className={cn(dense ? "h-2.5" : "h-4", "w-px shrink-0 bg-neutral-900")} aria-hidden />
      </div>
      <p
        className={cn(
          "font-heading font-semibold tabular-nums text-neutral-900",
          dense ? "mt-1 text-sm sm:text-base" : "mt-2 text-base sm:text-lg",
        )}
      >
        {inches}&quot;
      </p>
    </div>
  );
}

const CosmeticBagsV2 = () => {
  const [collection, setCollection] = useState<ShopifyCollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCollectionByHandle(COLLECTION_HANDLE, 250)
      .then(setCollection)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sizedProducts = useMemo(() => {
    if (!collection) return [];
    return SIZE_SPECS.map((spec) => {
      const match = collection.products.find((p) => spec.match(p.node.handle, p.node.title));
      return match ? { spec, product: match.node } : null;
    }).filter((x): x is { spec: SizeSpec; product: ShopifyCollectionDetail["products"][number]["node"] } => Boolean(x));
  }, [collection]);

  const sizeColumns = useMemo(() => {
    const cols = sizedProducts.map(({ spec, product }) => {
      // Cap the 22″ diameter at one grid column so min() never uses equal cell % widths
      // (which made 16/20/22 circles identical). Ratios stay 16:20:22 via inches/22.
      const cap = `min(${COSMO_CIRCLE_BASE_REM}rem, (100cqw - 1.5rem) / 3)`;
      const circleWidth = `calc((${spec.inches} / 22) * ${cap})`;
      return {
        spec,
        product,
        preview: getCollectionGridSwatchPreview(
          product,
          spec.inches === 20 ? { maxInteractiveSwatches: 5 } : undefined,
        ),
        circleWidth,
      };
    });
    return cols.sort((a, b) => a.spec.inches - b.spec.inches);
  }, [sizedProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <p className="text-muted-foreground text-lg">Collection not found</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View all collections
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to={`/collections/${COLLECTION_HANDLE}`} className="hover:text-foreground transition-colors">
            {collection.title}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground font-medium">Cosmetic Bags V2</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{collection.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
              Tap a column (image through colors) to open that size&apos;s product.
            </p>
          </div>
        </div>

        <section
          className="mb-12 rounded-2xl border border-border/80 bg-muted/20 px-3 pb-5 pt-3 sm:px-6 sm:pb-7 sm:pt-4"
          aria-label="Cosmo size selector"
        >
          <div
            className="mx-auto grid w-full max-w-7xl grid-cols-3 divide-x divide-border/80"
            style={{
              containerType: "inline-size",
              ["--cosmo-disk-band-min" as string]: `${COSMO_CIRCLE_BASE_REM}rem`,
            }}
          >
            {sizeColumns.map(({ spec, product, preview, circleWidth }) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className={cn(
                  "group relative flex min-h-0 min-w-0 cursor-pointer flex-col items-center gap-0 px-0.5 pb-1 pt-0 sm:pb-2 md:px-1.5 md:pt-0 lg:px-2",
                  "rounded-xl outline-none transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                )}
                aria-label={`${spec.shortName}, ${spec.inches} inch — ${product.title}. Opens product page.`}
              >
                <p
                  className={cn(
                    "pointer-events-none mb-0.5 flex min-h-0 w-full max-w-[min(100%,16rem)] items-center justify-center px-0.5 text-pretty text-center max-md:leading-tight",
                    "md:mb-1.5 md:min-h-[3rem] lg:min-h-[3.5rem]",
                    "font-heading font-black uppercase leading-[0.92] tracking-tight text-foreground",
                    "text-[clamp(0.8125rem,3.2cqw+0.5rem,1.1875rem)] sm:text-[clamp(0.9375rem,2.85cqw+0.55rem,1.4375rem)]",
                  )}
                >
                  {spec.shortName}
                </p>
                {/*
                  Below md: no tall baseline band — labels sit directly above disks so 16/20/22 stay
                  a tight horizontal trio for size comparison. md+: shared min-height + bottom-align.
                */}
                <div
                  className={cn(
                    "flex w-full flex-col items-center max-md:min-h-0 max-md:justify-start",
                    "md:min-h-[var(--cosmo-disk-band-min)] md:justify-end",
                    "-mt-0.5 md:-mt-1",
                  )}
                >
                  {/*
                    Fixed square disks (aspect 1) so 16″:20″:22″ widths read as real size steps.
                    Slight img scale crops baked-in light/dark matting at the file edge inside the circle.
                  */}
                  <div
                    className={cn(
                      "mx-auto max-w-full rounded-full transition-[transform,box-shadow] duration-200 ease-out will-change-transform",
                      "group-hover:scale-[1.02] motion-reduce:group-hover:scale-100",
                      "shadow-none group-hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.2),0_4px_10px_-4px_rgba(0,0,0,0.1)]",
                    )}
                    style={{ width: circleWidth, aspectRatio: "1" }}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-neutral-950">
                      <img
                        src={spec.imageSrc}
                        alt={spec.imageAlt}
                        className="block h-full w-full min-h-full min-w-full origin-center scale-[1.14] object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 w-full max-w-[min(100%,11rem)] sm:mt-2 sm:max-w-[13rem]">
                  <DiameterScale inches={spec.inches} className="!mt-0" dense />
                </div>

                <div className="mt-1.5 flex min-h-7 w-full max-w-[min(100%,18rem)] flex-wrap items-center justify-center gap-2 sm:mt-2">
                  {preview.swatches.map((s) => (
                    <span
                      key={s.key}
                      className={cn(
                        preview.interactive
                          ? cn(
                              "pointer-events-none shrink-0 rounded-full border border-foreground/25 bg-center bg-no-repeat",
                              "h-7 w-7",
                              preview.cosmoMiniInteractive &&
                                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                              preview.cosmoOtherInteractive && "bg-muted/30",
                            )
                          : "pointer-events-none h-6 w-6 shrink-0 rounded-full border border-foreground/20 bg-muted bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                      )}
                      style={s.style}
                      title={s.label}
                      aria-hidden
                    />
                  ))}
                  {preview.remaining > 0 ? (
                    <span className="text-xs font-medium text-primary">+{preview.remaining} more</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CosmeticBagsV2;
