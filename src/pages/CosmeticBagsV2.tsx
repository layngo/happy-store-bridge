import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { getStaticPageSeo } from "@/lib/staticPageSeo";
import { getCollectionGridSwatchPreview } from "@/components/ProductCard";
import { selectItem, viewItemList } from "@/lib/analytics";
import { productNodeToItem } from "@/lib/analyticsItems";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ChevronRight, Home } from "lucide-react";

const COLLECTION_HANDLE = "cosmetic-bags";

const COSMO_V2_ASSET_V = "7";
const IMG_16 = `/cosmetic-bags-v2/cosmo-16.png?v=${COSMO_V2_ASSET_V}`;
const IMG_20 = `/cosmetic-bags-v2/cosmo-20.png?v=${COSMO_V2_ASSET_V}`;
const IMG_22 = `/cosmetic-bags-v2/cosmo-22.png?v=${COSMO_V2_ASSET_V}`;

/** Largest disk (22″); 16″ and 20″ derive from 16:20:22. */
const COSMO_CIRCLE_BASE_REM = 19.75;

/** Open-mat width ÷ image width (alpha bbox on transparent PNGs). */
const COSMO_MAT_WIDTH_FRACTION: Record<16 | 20 | 22, number> = {
  16: 606 / 672,
  20: 721 / 1024,
  22: 955 / 1024,
};

/** 22″ mat width: target mat scales as (inches / 22) × this. */
const COSMO_MAT_REF_FRACTION = COSMO_MAT_WIDTH_FRACTION[22];

/**
 * Nudge vs literal inches/22: 20″ photo has extra canvas padding; keep 20″ nearer 22″ than 16″.
 */
const COSMO_DISPLAY_SCALE: Record<16 | 20 | 22, number> = {
  16: 1.1,
  20: 1.02,
  22: 1,
};

/** File width ÷ height (natural aspect; do not force square stages). */
const COSMO_IMAGE_ASPECT_W_OVER_H: Record<16 | 20 | 22, number> = {
  16: 672 / 576,
  20: 1024 / 768,
  22: 1,
};

/** Stage width ÷ column cap (before fit). */
function cosmoStageWidthRatio(inches: 16 | 20 | 22): number {
  const matFill = COSMO_MAT_WIDTH_FRACTION[inches];
  return (inches / 22) * (COSMO_MAT_REF_FRACTION / matFill) * COSMO_DISPLAY_SCALE[inches];
}

/**
 * 20″ stage was >100% column width, so every image clamped to full column: mats looked the same size.
 * Scale all stages down uniformly so the largest fits the column; mat ratios stay correct.
 */
const COSMO_MAX_STAGE_WIDTH_RATIO = Math.max(
  cosmoStageWidthRatio(16),
  cosmoStageWidthRatio(20),
  cosmoStageWidthRatio(22),
);
const COSMO_STAGE_FIT = 1 / COSMO_MAX_STAGE_WIDTH_RATIO;

function cosmoStageHeightRatio(inches: 16 | 20 | 22): number {
  return (cosmoStageWidthRatio(inches) * COSMO_STAGE_FIT) / COSMO_IMAGE_ASPECT_W_OVER_H[inches];
}

const COSMO_MAX_BAND_HEIGHT_RATIO = Math.max(
  cosmoStageHeightRatio(16),
  cosmoStageHeightRatio(20),
  cosmoStageHeightRatio(22),
);

type SizeSpec = {
  inches: 16 | 20 | 22;
  /** Upper overlay on the circle: matches Cosmo PDP story headline typography. */
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

const COSMO_20_MAX_SWATCHES_DESKTOP = 5;
const COSMO_20_MAX_SWATCHES_MOBILE = 3;
/** First swatches shown for Cosmo 20″ on this page (mobile shows first 3). */
const COSMO_20_V2_SWATCH_PRIORITY = ["Black", "Leopard", "Sky Blue"] as const;

const CosmeticBagsV2 = () => {
  const [collection, setCollection] = useState<ShopifyCollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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
    const cap = `min(${COSMO_CIRCLE_BASE_REM}rem, (100cqw - 1.5rem) / 3)`;
    const cols = sizedProducts.map(({ spec, product }) => {
      const matFill = COSMO_MAT_WIDTH_FRACTION[spec.inches];
      const displayScale = COSMO_DISPLAY_SCALE[spec.inches];
      const stageWidth = `calc((${spec.inches} / 22) * ${cap} * ${COSMO_MAT_REF_FRACTION} * ${displayScale} / ${matFill} * ${COSMO_STAGE_FIT})`;
      const diameterWidth = `calc((${spec.inches} / 22) * ${cap} * ${COSMO_MAT_REF_FRACTION} * ${displayScale} * ${COSMO_STAGE_FIT})`;
      return {
        spec,
        product,
        preview: getCollectionGridSwatchPreview(
          product,
          spec.inches === 20
            ? {
                maxInteractiveSwatches: isMobile ? COSMO_20_MAX_SWATCHES_MOBILE : COSMO_20_MAX_SWATCHES_DESKTOP,
                cosmo20PriorityColors: [...COSMO_20_V2_SWATCH_PRIORITY],
              }
            : undefined,
        ),
        stageWidth,
        diameterWidth,
      };
    });
    return cols.sort((a, b) => a.spec.inches - b.spec.inches);
  }, [sizedProducts, isMobile]);

  useEffect(() => {
    if (!collection?.products.length) return;
    viewItemList(
      collection.products.map((p, i) => productNodeToItem(p.node, { index: i, item_category: collection.title })),
      collection.title,
    );
  }, [collection]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center py-32">
          <LoadingSpinner label="Loading cosmetic bags" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="container py-20 text-center flex-1">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Collection not found</h1>
          <p className="text-muted-foreground text-lg">We couldn&apos;t find this collection.</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View all collections
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <PageSeo
        title="Cosmetic Bags"
        description={getStaticPageSeo("/shop/cosmetic-bags").description}
        pathname="/shop/cosmetic-bags"
        keywords={getStaticPageSeo("/shop/cosmetic-bags").keywords}
      />
      <Header />
      <main id="main-content" className="container py-8 flex-1">
        <PageBreadcrumb className="mb-8 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link to={`/collections/${COLLECTION_HANDLE}`} className="hover:text-foreground transition-colors">
            {collection.title}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <span className="text-foreground font-medium" aria-current="page">
            Cosmetic Bags
          </span>
        </PageBreadcrumb>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{collection.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-primary sm:text-base">
              Select a size to see all of your color and pattern options!
            </p>
          </div>
        </div>

        <section
          className="mb-12 rounded-2xl border border-border/80 bg-muted/20 px-2 pb-5 pt-3 sm:px-6 sm:pb-7 sm:pt-4"
          aria-label="Cosmo size selector"
        >
          <div
            className="mx-auto grid w-full max-w-7xl grid-cols-3 divide-x divide-border/80"
            style={{
              containerType: "inline-size",
              ["--cosmo-disk-band-min" as string]: `calc(min(${COSMO_CIRCLE_BASE_REM}rem, (100cqw - 1.5rem) / 3) * ${COSMO_MAX_BAND_HEIGHT_RATIO})`,
            }}
          >
            {sizeColumns.map(({ spec, product, preview, stageWidth, diameterWidth }) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                state={{ fromCosmeticBagsV2: true }}
                onClick={() =>
                  selectItem(
                    productNodeToItem(product, { item_category: collection.title }),
                    collection.title,
                  )
                }
                className={cn(
                  "group relative flex min-h-0 min-w-0 cursor-pointer flex-col items-center gap-0 px-0 pb-1 pt-0 sm:px-0.5 sm:pb-2 md:px-1.5 md:pt-0 lg:px-2",
                  "rounded-xl outline-none transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                )}
                style={{
                  ["--cosmo-stage-w" as string]: stageWidth,
                  ["--cosmo-diameter-w" as string]: diameterWidth,
                }}
                aria-label={`${spec.shortName}, ${spec.inches} inch: ${product.title}. Opens product page.`}
              >
                {spec.inches === 20 ? (
                  <span className="pointer-events-none absolute right-2 top-2 hidden shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md md:block">
                    Best Seller
                  </span>
                ) : null}
                <p
                  className={cn(
                    "pointer-events-none mb-0.5 flex min-h-0 w-full max-w-[min(100%,16rem)] origin-center items-center justify-center px-0.5 text-pretty text-center max-md:leading-tight",
                    "min-h-[3.25rem] md:mb-1.5 lg:min-h-[3.5rem]",
                    "font-heading font-black uppercase leading-[0.92] tracking-tight text-foreground",
                    "text-[clamp(0.8125rem,3.2cqw+0.5rem,1.1875rem)] sm:text-[clamp(0.9375rem,2.85cqw+0.55rem,1.4375rem)]",
                    "transition-transform duration-200 ease-out will-change-transform",
                    "group-hover:scale-[1.035] motion-reduce:group-hover:scale-100",
                  )}
                >
                  {spec.shortName}
                </p>
                {/*
                  Shared band height = 22″ diameter (cqw-capped); all disks bottom-align so the trio reads
                  side-by-side on mobile the same way as desktop.
                */}
                <div
                  className={cn(
                    "flex w-full min-w-0 flex-col items-center justify-end",
                    "min-h-[var(--cosmo-disk-band-min)]",
                    "-mt-0.5 md:-mt-1",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto w-[var(--cosmo-stage-w)] shrink-0 transition-[transform,filter] duration-200 ease-out will-change-transform",
                      "group-hover:scale-[1.02] motion-reduce:group-hover:scale-100",
                    )}
                  >
                    <img
                      src={spec.imageSrc}
                      alt={spec.imageAlt}
                      className={cn(
                        "block h-auto w-full object-contain object-bottom",
                        "drop-shadow-[0_3px_10px_rgba(0,0,0,0.28)]",
                        "transition-[filter] duration-200 group-hover:drop-shadow-[0_5px_14px_rgba(0,0,0,0.34)]",
                      )}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-1.5 mx-auto shrink-0 sm:mt-2",
                    "w-[var(--cosmo-diameter-w)] max-w-full",
                  )}
                >
                  <DiameterScale inches={spec.inches} className="!mt-0 !px-0" dense />
                </div>

                <div className="mt-1.5 flex min-h-7 w-full max-w-[min(100%,18rem)] flex-wrap items-center justify-center gap-1 sm:mt-2 sm:gap-2">
                  {preview.swatches.map((s) => (
                    <span
                      key={s.key}
                      className={cn(
                        preview.interactive
                          ? cn(
                              "pointer-events-none shrink-0 rounded-full border border-foreground/25 bg-center bg-no-repeat",
                              "h-6 w-6 sm:h-7 sm:w-7",
                              preview.cosmoMiniInteractive &&
                                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                              preview.cosmoOtherInteractive && "bg-muted/30",
                            )
                          : "pointer-events-none h-5 w-5 shrink-0 rounded-full border border-foreground/20 bg-muted bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:h-6 sm:w-6",
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
                {spec.inches === 20 ? (
                  <span className="mt-1.5 shrink-0 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-md md:hidden">
                    Best Seller
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CosmeticBagsV2;
