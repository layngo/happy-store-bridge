import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { DefenderHeroVideo } from "@/components/DefenderHeroVideo";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { getStaticPageSeo } from "@/lib/staticPageSeo";
import { getCollectionGridSwatchPreview } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ChevronRight, Home } from "lucide-react";

export const MILITARY_FIRST_RESPONDER_PATH = "/collections/military-first-responder";
export const OUTDOOR_TACTICAL_COLLECTION_TITLE = "Outdoor and Tactical";

const COLLECTION_HANDLE = "military-first-responder";

const DEFENDER_V2_ASSET_V = "8";
const IMG_16 = `/military-first-responder-v2/defender-mini-16.png?v=${DEFENDER_V2_ASSET_V}`;
const IMG_20 = `/military-first-responder-v2/defender-tactical-20.png?v=${DEFENDER_V2_ASSET_V}`;

/** Largest disk (20″); 16″ derives from 16:20 — same cap pattern as Cosmo V2 (2 columns). */
const DEFENDER_CIRCLE_BASE_REM = 19.75;

/** Open-mat width ÷ image width (olive-fabric bbox on collection PNGs). */
const DEFENDER_MAT_WIDTH_FRACTION: Record<16 | 20, number> = {
  16: 545 / 578,
  20: 443 / 477,
};

/** 20″ mat width — target mat scales as (inches / 20) × this. */
const DEFENDER_MAT_REF_FRACTION = DEFENDER_MAT_WIDTH_FRACTION[20];

/**
 * Nudge vs literal inches/20 — same idea as Cosmo V2 (20″ photo has extra canvas padding).
 */
const DEFENDER_DISPLAY_SCALE: Record<16 | 20, number> = {
  16: 1.1,
  20: 1.02,
};

/** File width ÷ height (natural aspect; do not force square stages). */
const DEFENDER_IMAGE_ASPECT_W_OVER_H: Record<16 | 20, number> = {
  16: 578 / 553,
  20: 477 / 511,
};

/** Stage width ÷ column cap (before fit). */
function defenderStageWidthRatio(inches: 16 | 20): number {
  const matFill = DEFENDER_MAT_WIDTH_FRACTION[inches];
  return (inches / 20) * (DEFENDER_MAT_REF_FRACTION / matFill) * DEFENDER_DISPLAY_SCALE[inches];
}

/** If any stage >100% column width, every image clamps to full width — mats look the same size. */
const DEFENDER_MAX_STAGE_WIDTH_RATIO = Math.max(defenderStageWidthRatio(16), defenderStageWidthRatio(20));
const DEFENDER_STAGE_FIT = 1 / DEFENDER_MAX_STAGE_WIDTH_RATIO;

function defenderStageHeightRatio(inches: 16 | 20): number {
  return (defenderStageWidthRatio(inches) * DEFENDER_STAGE_FIT) / DEFENDER_IMAGE_ASPECT_W_OVER_H[inches];
}

/** Shared band height (20″ frame) — all mats bottom-align like Cosmo V2. */
const DEFENDER_MAX_BAND_HEIGHT_RATIO = Math.max(
  defenderStageHeightRatio(16),
  defenderStageHeightRatio(20),
);

type SizeSpec = {
  inches: 16 | 20;
  /** Upper overlay on the circle — matches Cosmo PDP story headline typography. */
  shortName: string;
  imageSrc: string;
  imageAlt: string;
  match: (handle: string, title: string) => boolean;
};

const SIZE_SPECS: SizeSpec[] = [
  {
    inches: 16,
    shortName: "Defender Mini",
    imageSrc: IMG_16,
    imageAlt: "Lay-n-Go DEFENDER mini 16 inch open flat with personal gear organized on the mat",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return (
        h.includes("defender-mini") ||
        h.includes("defender-mini-16") ||
        (t.includes("defender") && t.includes("mini") && t.includes("16"))
      );
    },
  },
  {
    inches: 20,
    shortName: "Defender Tactical",
    imageSrc: IMG_20,
    imageAlt: "Lay-n-Go DEFENDER Tactical 20 inch open flat with mesh pockets and personal gear",
    match: (handle, title) => {
      const h = handle.toLowerCase();
      const t = title.toLowerCase();
      return (
        h.includes("tactical-bag-20") || (t.includes("defender") && t.includes("tactical") && t.includes("20"))
      );
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

const MilitaryFirstResponder = () => {
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
    const cap = `min(${DEFENDER_CIRCLE_BASE_REM}rem, (100cqw - 1rem) / 2)`;
    const cols = sizedProducts.map(({ spec, product }) => {
      const matFill = DEFENDER_MAT_WIDTH_FRACTION[spec.inches];
      const displayScale = DEFENDER_DISPLAY_SCALE[spec.inches];
      const stageWidth = `calc((${spec.inches} / 20) * ${cap} * ${DEFENDER_MAT_REF_FRACTION} * ${displayScale} / ${matFill} * ${DEFENDER_STAGE_FIT})`;
      const diameterWidth = `calc((${spec.inches} / 20) * ${cap} * ${DEFENDER_MAT_REF_FRACTION} * ${displayScale} * ${DEFENDER_STAGE_FIT})`;
      return {
        spec,
        product,
        preview: getCollectionGridSwatchPreview(product),
        stageWidth,
        diameterWidth,
      };
    });
    return cols.sort((a, b) => a.spec.inches - b.spec.inches);
  }, [sizedProducts]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center py-32">
          <LoadingSpinner label="Loading outdoor and tactical collection" />
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
        title={OUTDOOR_TACTICAL_COLLECTION_TITLE}
        description={getStaticPageSeo("/collections/military-first-responder").description}
        pathname="/collections/military-first-responder"
        keywords={getStaticPageSeo("/collections/military-first-responder").keywords}
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
          <span className="text-foreground font-medium" aria-current="page">
            {OUTDOOR_TACTICAL_COLLECTION_TITLE}
          </span>
        </PageBreadcrumb>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {OUTDOOR_TACTICAL_COLLECTION_TITLE}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-primary sm:text-base">
              Select a size
            </p>
          </div>
        </div>

        <DefenderHeroVideo className="mb-10 sm:mb-12" />

        <section
          className="mb-12 rounded-2xl border border-border/80 bg-muted/20 px-2 pb-5 pt-3 sm:px-6 sm:pb-7 sm:pt-4"
          aria-label="DEFENDER size selector"
        >
          <div
            className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-border/80"
            style={{
              containerType: "inline-size",
              ["--defender-disk-band-min" as string]: `calc(min(${DEFENDER_CIRCLE_BASE_REM}rem, (100cqw - 1rem) / 2) * ${DEFENDER_MAX_BAND_HEIGHT_RATIO})`,
            }}
          >
            {sizeColumns.map(({ spec, product, preview, stageWidth, diameterWidth }) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                state={{ fromMilitaryFirstResponder: true }}
                className={cn(
                  "group relative flex min-h-0 min-w-0 cursor-pointer flex-col items-center gap-0 px-0 pb-1 pt-0 sm:px-0.5 sm:pb-2 md:px-1.5 md:pt-0 lg:px-2",
                  "rounded-xl outline-none transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                )}
                style={{
                  ["--defender-stage-w" as string]: stageWidth,
                  ["--defender-diameter-w" as string]: diameterWidth,
                }}
                aria-label={`${spec.shortName}, ${spec.inches} inch — ${product.title}. Opens product page.`}
              >
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
                  Shared band height = 20″ frame (cqw-capped); disks bottom-align like Cosmo V2.
                */}
                <div
                  className={cn(
                    "flex w-full min-w-0 flex-col items-center justify-end",
                    "min-h-[var(--defender-disk-band-min)]",
                    "-mt-0.5 md:-mt-1",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto w-[var(--defender-stage-w)] shrink-0 transition-[transform,filter] duration-200 ease-out will-change-transform",
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
                    "w-[var(--defender-diameter-w)] max-w-full",
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
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default MilitaryFirstResponder;
