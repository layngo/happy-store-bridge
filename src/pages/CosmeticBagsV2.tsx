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
const COSMO_CIRCLE_BASE_REM = 17.5;

type SizeSpec = {
  inches: 16 | 20 | 22;
  imageSrc: string;
  imageAlt: string;
  match: (handle: string, title: string) => boolean;
};

const SIZE_SPECS: SizeSpec[] = [
  {
    inches: 16,
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
    imageSrc: IMG_22,
    imageAlt: "Lay-n-Go Cosmo Deluxe 22 inch open flat",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return h.includes("deluxe-22") || (h.includes("cosmo") && h.includes("22")) || (t.includes("cosmo") && t.includes("22"));
    },
  },
];

function DiameterScale({ inches, className }: { inches: number; className?: string }) {
  return (
    <div className={`mt-3 flex w-full flex-col items-center px-1 ${className ?? ""}`}>
      <div className="flex w-full items-end justify-center">
        <div className="h-4 w-px shrink-0 bg-neutral-900" aria-hidden />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div className="h-4 w-px shrink-0 bg-neutral-900" aria-hidden />
      </div>
      <p className="mt-2 font-heading text-base font-semibold tabular-nums text-neutral-900 sm:text-lg">{inches}&quot;</p>
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
      const cap = `min(${COSMO_CIRCLE_BASE_REM}rem, (100cqw - 3rem) / 3)`;
      const circleWidth = `calc((${spec.inches} / 22) * ${cap})`;
      return {
        spec,
        product,
        preview: getCollectionGridSwatchPreview(product),
        circleWidth,
      };
    });
    return cols.sort((a, b) => a.spec.inches - b.spec.inches);
  }, [sizedProducts]);

  const gridGap = "gap-x-2 sm:gap-x-4 md:gap-x-6";

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
              Tap a size to open that product — colors for each size are shown below.
            </p>
          </div>
        </div>

        <section
          className="mb-12 rounded-2xl border border-border/80 bg-muted/20 px-3 py-8 sm:px-6 sm:py-10"
          aria-label="Cosmo size selector"
        >
          <div
            className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5"
            style={{ containerType: "inline-size" }}
          >
            {/* Row 1: circles share one baseline (bottom-aligned) so height differences read clearly */}
            <div className={cn("grid w-full grid-cols-3 items-end justify-items-center", gridGap)}>
              {sizeColumns.map(({ spec, product, circleWidth }) => (
                <Link
                  key={product.id}
                  to={`/product/${product.handle}`}
                  className="group mx-auto block max-w-full outline-none focus-visible:outline-none"
                  style={{ width: circleWidth }}
                  aria-label={`${product.title} — ${spec.inches} inch`}
                >
                  <div
                    className={cn(
                      "relative aspect-square w-full overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-[box-shadow,ring] duration-300",
                      "group-hover:shadow-[0_0_0_2px_hsl(var(--primary)_/_0.55),0_0_22px_hsl(var(--primary)_/_0.35)]",
                      "group-focus-visible:ring-2 group-focus-visible:ring-ring",
                    )}
                  >
                    <img
                      src={spec.imageSrc}
                      alt={spec.imageAlt}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2: diameter scales — same column tracks */}
            <div className={cn("grid w-full grid-cols-3 justify-items-center", gridGap)}>
              {sizeColumns.map(({ spec, product }) => (
                <div key={`d-${product.id}`} className="w-full max-w-[min(100%,11rem)] sm:max-w-[13rem]">
                  <DiameterScale inches={spec.inches} className="!mt-0" />
                </div>
              ))}
            </div>

            {/* Row 3: swatches — same column tracks */}
            <div className={cn("grid w-full grid-cols-3 justify-items-center", gridGap)}>
              {sizeColumns.map(({ product, preview }) => (
                <div
                  key={`s-${product.id}`}
                  className="flex min-h-7 w-full max-w-[min(100%,18rem)] flex-wrap items-center justify-center gap-2"
                >
                  {preview.swatches.map((s) => (
                    <span
                      key={s.key}
                      className={cn(
                        preview.interactive
                          ? cn(
                              "shrink-0 rounded-full border border-foreground/25 bg-center bg-no-repeat",
                              "h-7 w-7",
                              preview.cosmoMiniInteractive &&
                                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                              preview.cosmoOtherInteractive && "bg-muted/30",
                            )
                          : "h-6 w-6 shrink-0 rounded-full border border-foreground/20 bg-muted bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                      )}
                      style={s.style}
                      title={s.label}
                      aria-label={s.label}
                    />
                  ))}
                  {preview.remaining > 0 ? (
                    <Link
                      to={`/product/${product.handle}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      +{preview.remaining} more
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CosmeticBagsV2;
