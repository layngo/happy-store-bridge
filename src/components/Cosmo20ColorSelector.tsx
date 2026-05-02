import { useMemo, type CSSProperties } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import { cn } from "@/lib/utils";

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export interface Cosmo20SwatchDef {
  /** Canonical catalog key; Shopify may use a shorter alias — see {@link COSMO_20_SHOPIFY_ALIASES} */
  shopifyColor: string;
  /** Label under the grid when this swatch is selected */
  selectedLabel: string;
  /** Hover / native tooltip */
  tooltip: string;
  /** Main hero / bag image (Amazon product image) */
  bagImageUrl: string;
  /** Small circular swatch (Amazon SS64) */
  swatchImageUrl: string;
  /** Extra PDP gallery images for this color (hero cycles via thumbnails); omit when only `bagImageUrl` applies */
  galleryImageUrls?: string[];
  /** Mark OOS in UI even if Shopify says available */
  forceUnavailable?: boolean;
}

/**
 * Cosmo 20" color order + Amazon image URLs.
 * Source: user-provided Amazon _AC_SX679_ (bag) + _SS64_ (swatch) pairs.
 */
export const COSMO_20_SWATCHES: Cosmo20SwatchDef[] = [
  {
    shopifyColor: "Love",
    selectedLabel: "Love",
    tooltip: "Love",
    bagImageUrl: "https://m.media-amazon.com/images/I/812Nk1H5gmL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/61TlQoMP4NL._SS64_.jpg",
  },
  {
    shopifyColor: "Black",
    selectedLabel: "Black",
    tooltip: "Black",
    bagImageUrl: "https://m.media-amazon.com/images/I/81wVnvcGFtL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41z6K5qgpcL._SS64_.jpg",
  },
  {
    shopifyColor: "Black & Gold",
    selectedLabel: "Black & Gold",
    tooltip: "Black & Gold",
    bagImageUrl: "https://m.media-amazon.com/images/I/81dQcabno+L._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31w694P7EpL._SS64_.jpg",
    galleryImageUrls: [
      "https://m.media-amazon.com/images/I/81dQcabno+L._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/81cvilKtZiL._AC_SY879_.jpg",
      "https://m.media-amazon.com/images/I/81oE4aQZqBL._AC_SY879_.jpg",
    ],
  },
  {
    shopifyColor: "Gold Stripe",
    selectedLabel: "Gold Stripe",
    tooltip: "Gold Stripe",
    bagImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/files/COS20STBG7723-OPENANDCLOSED-SquareOverlayVersion_1.jpg?v=1730750218",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31w694P7EpL._SS64_.jpg",
  },
  {
    shopifyColor: "Butterfly",
    selectedLabel: "Butterfly",
    tooltip: "Butterfly",
    bagImageUrl:
      "https://www.layngo.com/cdn/shop/files/COS20BFLY7693-OPEN-AND-CLOSED--Square-Overlay-Version_1_2000x.jpg?v=1730750330",
    swatchImageUrl: "/swatches/cosmo-20-butterfly.jpg",
  },
  {
    shopifyColor: "Checkered",
    selectedLabel: "Checkered",
    tooltip: "Checkered",
    bagImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/files/COS20CHKT7716-OPENANDCLOSED-SquareOverlayVersion_1.jpg?v=1730750516",
    swatchImageUrl: "/swatches/cosmo-20-checkered.jpg",
  },
  {
    shopifyColor: "Blue Snakeskin",
    selectedLabel: "Blue Snakeskin",
    tooltip: "Blue Snakeskin",
    bagImageUrl: "https://m.media-amazon.com/images/I/81Kylbm3KvL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41ZCxiSFbxL._SS64_.jpg",
  },
  {
    shopifyColor: "Comfort (Black)",
    selectedLabel: "Comfort (Black)",
    tooltip: "Comfort (Black)",
    bagImageUrl: "https://m.media-amazon.com/images/I/81qrM443mpL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51mwWbYVhIL._SS64_.jpg",
  },
  {
    shopifyColor: "Comfort (Blue Inside)",
    selectedLabel: "Comfort (Blue Inside)",
    tooltip: "Comfort (Blue Inside)",
    bagImageUrl: "https://m.media-amazon.com/images/I/81ZQcnkIiVL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41dG-9FppzL._SS64_.jpg",
  },
  {
    shopifyColor: "Comfort (White Inside)",
    selectedLabel: "Comfort (White Inside)",
    tooltip: "Comfort (White Inside)",
    bagImageUrl: "https://m.media-amazon.com/images/I/71DpbrW1HKL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31ER-ofrfrL._SS64_.jpg",
  },
  {
    shopifyColor: "Dogs",
    selectedLabel: "Dogs",
    tooltip: "Dogs",
    bagImageUrl: "https://m.media-amazon.com/images/I/81exsfRN82L._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41I-YjS7phL._SS64_.jpg",
  },
  {
    shopifyColor: "Dot (Navy/Green Stripe)",
    selectedLabel: "Dot (Navy/Green Stripe)",
    tooltip: "Dot (Navy/Green Stripe)",
    bagImageUrl: "https://m.media-amazon.com/images/I/81eLGN22ecL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51vg3gVjfmL._SS64_.jpg",
  },
  {
    shopifyColor: "Elephants",
    selectedLabel: "Elephants",
    tooltip: "Elephants",
    bagImageUrl: "https://m.media-amazon.com/images/I/81GyiSowHrL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51ozWKsEUKL._SS64_.jpg",
  },
  {
    shopifyColor: "Grit Grace Gratitude",
    selectedLabel: "Grit Grace Gratitude",
    tooltip: "Grit Grace Gratitude",
    bagImageUrl: "https://m.media-amazon.com/images/I/81gspS956bL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51pXNPBPzvL._SS64_.jpg",
  },
  {
    shopifyColor: "Leopard",
    selectedLabel: "Leopard",
    tooltip: "Leopard",
    bagImageUrl: "https://m.media-amazon.com/images/I/81hHDUt636L._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41Q6W7FwObL._SS64_.jpg",
  },
  {
    shopifyColor: "Metallic Gold",
    selectedLabel: "Metallic Gold",
    tooltip: "Metallic Gold",
    bagImageUrl: "https://m.media-amazon.com/images/I/710MVWNRDiS._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/21VU7yB9IEL._SS64_.jpg",
  },
  {
    shopifyColor: "Metallic Silver",
    selectedLabel: "Metallic Silver",
    tooltip: "Metallic Silver",
    bagImageUrl: "https://m.media-amazon.com/images/I/8173dJHIVVS._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31Hnmsu+RML._SS64_.jpg",
  },
  {
    shopifyColor: "Navy",
    selectedLabel: "Navy",
    tooltip: "Navy",
    bagImageUrl: "https://m.media-amazon.com/images/I/81Ff-ALCZqL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31v7o6uQ4UL._SS64_.jpg",
  },
  {
    shopifyColor: "Ocean Blue",
    selectedLabel: "Ocean Blue",
    tooltip: "Ocean Blue",
    bagImageUrl: "https://m.media-amazon.com/images/I/71w0Z9pjlPS._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/21eybAUvBRL._SS64_.jpg",
  },
  {
    shopifyColor: "Pink",
    selectedLabel: "Pink",
    tooltip: "Pink",
    bagImageUrl: "https://m.media-amazon.com/images/I/71n3bN-KA8S._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31J83-22JUL._SS64_.jpg",
  },
  {
    shopifyColor: "Pink Chevron",
    selectedLabel: "Pink Chevron",
    tooltip: "Pink Chevron",
    bagImageUrl: "https://m.media-amazon.com/images/I/81knuN5RlgL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31ajkRBTDQL._SS64_.jpg",
  },
  {
    shopifyColor: "Purple",
    selectedLabel: "Purple",
    tooltip: "Purple",
    bagImageUrl: "https://m.media-amazon.com/images/I/81NdmHY4fwL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31eTOK3c+SL._SS64_.jpg",
  },
  {
    shopifyColor: "Rings Black/White",
    selectedLabel: "Rings Black/White",
    tooltip: "Rings Black/White",
    bagImageUrl: "https://m.media-amazon.com/images/I/81GAGSx6ArL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41+vAXTl9HL._SS64_.jpg",
  },
  {
    shopifyColor: "Sky Blue",
    selectedLabel: "Sky Blue",
    tooltip: "Sky Blue",
    bagImageUrl: "https://m.media-amazon.com/images/I/81wvznMkNIL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41jDMaLDXHL._SS64_.jpg",
  },
  {
    shopifyColor: "Evergreen",
    selectedLabel: "Evergreen",
    tooltip: "Evergreen",
    bagImageUrl: "https://m.media-amazon.com/images/I/817BajkVj+L._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51l2P+kB71L._SS64_.jpg",
  },
  {
    shopifyColor: "Stars",
    selectedLabel: "Stars",
    tooltip: "Stars",
    bagImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/OPEN_AND_CLOSED_-_PSD_of_a_square_seperated_layout_Square_1000_x_1000.jpg?v=1670419871",
    swatchImageUrl: "/swatches/cosmo-20-stars.jpg",
  },
  {
    shopifyColor: "Paisley",
    selectedLabel: "Paisley",
    tooltip: "Paisley",
    bagImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/lay-n-go-cosmo-20cosmo-20lay-n-golayngo-new-28937644.jpg?v=1670376558",
    swatchImageUrl: "/swatches/cosmo-20-paisley.jpg",
  },
  {
    shopifyColor: "Pink Camo",
    selectedLabel: "Pink Camo",
    tooltip: "Pink Camo",
    bagImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/OPEN_AND_CLOSED_-_PSD_of_a_square_seperated_layout_JPG_Square_1_1000_x_1000.jpg?v=1670419871",
    swatchImageUrl: "/swatches/cosmo-20-pink-camo.jpg",
  },
  {
    shopifyColor: "Floral Large",
    selectedLabel: "Floral Large",
    tooltip: "Floral Large",
    bagImageUrl: "https://m.media-amazon.com/images/I/81LStDwYeIL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51PEb9KgQ-L._SS64_.jpg",
    galleryImageUrls: [
      "https://m.media-amazon.com/images/I/81LStDwYeIL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/81GgU-C3NvL._AC_SY879_.jpg",
      "https://m.media-amazon.com/images/I/81IvmUk-wvL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71aw1Wlxg4L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81yy7nyaCfL._AC_SL1500_.jpg",
    ],
  },
  {
    shopifyColor: "Lips (Black Inside)",
    selectedLabel: "Lips (Black Inside)",
    tooltip: "Lips (Black Inside)",
    bagImageUrl: "https://m.media-amazon.com/images/I/814QvZESILL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/51He83yex3L._SS64_.jpg",
  },
  {
    shopifyColor: "Quilted Lavender",
    selectedLabel: "Quilted Lavender",
    tooltip: "Quilted Lavender",
    bagImageUrl:
      "https://www.layngo.com/cdn/shop/files/COS20QLAV7709-OPENANDCLOSED-SquareOverlayVersion_1_2000x.jpg?v=1730750845",
    swatchImageUrl: "https://m.media-amazon.com/images/I/21JH7De0Y-L._SS64_.jpg",
  },
];

/**
 * Live Shopify Color option → canonical row key in {@link COSMO_20_SWATCHES}.
 * Archive snapshot: `archive/layngo-original/html/products/lay-n-go-cosmo-20.html` meta variants.
 */
export const COSMO_20_SHOPIFY_ALIASES: Record<string, string> = {
  Rings: "Rings Black/White",
  "Fuzzy White": "Comfort (White Inside)",
  "Fuzzy Blue": "Comfort (Blue Inside)",
  Lips: "Lips (Black Inside)",
  Silver: "Metallic Silver",
  Gold: "Metallic Gold",
  Chevron: "Pink Chevron",
  Elephant: "Elephants",
  Lavender: "Quilted Lavender",
  "Floral Fun": "Floral Large",
  "Dot and Stripe": "Dot (Navy/Green Stripe)",
  "Black Sherpa": "Comfort (Black)",
};

/** Resolve curated swatch + hero URLs for the Color string returned by Shopify. */
export function resolveCosmo20SwatchDef(shopifyColor: string): Cosmo20SwatchDef | undefined {
  const key = COSMO_20_SHOPIFY_ALIASES[shopifyColor] ?? shopifyColor;
  return COSMO_20_SWATCHES.find((s) => s.shopifyColor === key);
}

interface Cosmo20ColorSelectorProps {
  product: ShopifyProduct["node"];
  selectedVariantIdx: number;
  onVariantChange: (variantIndex: number) => void;
}

function shopifyColorOptionValues(product: ShopifyProduct["node"]): string[] {
  const opt = product.options?.find((o) => /color|colour/i.test(o.name));
  if (opt?.values?.length) return opt.values;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const { node } of product.variants.edges) {
    const c = node.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
    if (c && !seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

export function Cosmo20ColorSelector({ product, selectedVariantIdx, onVariantChange }: Cosmo20ColorSelectorProps) {
  const variantByColor = useMemo(() => {
    const map = new Map<string, { idx: number; node: VariantNode }>();
    product.variants.edges.forEach((edge, idx) => {
      const color = edge.node.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
      if (color && !map.has(color)) map.set(color, { idx, node: edge.node });
    });
    return map;
  }, [product.variants.edges]);

  const colorValues = useMemo(() => shopifyColorOptionValues(product), [product]);

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const selectedColor =
    selectedVariant?.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value ?? colorValues[0] ?? "";

  const selectedDisplayLabel = useMemo(() => {
    const def = resolveCosmo20SwatchDef(selectedColor);
    return def?.selectedLabel ?? selectedColor;
  }, [selectedColor]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color</label>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="listbox" aria-label="Color">
        {colorValues.map((shopifyColor) => {
          const def = resolveCosmo20SwatchDef(shopifyColor);
          const entry = variantByColor.get(shopifyColor);
          const variantIdx = entry?.idx ?? -1;
          const variant = entry?.node;
          const unavailable = Boolean(def?.forceUnavailable) || (variant ? !variant.availableForSale : true);
          const isSelected = variantIdx >= 0 && variantIdx === selectedVariantIdx;
          const swatchStyle = getCosmo20SwatchBackgroundStyle(shopifyColor, variant?.image?.url);
          const tooltip = def?.tooltip ?? shopifyColor;

          return (
            <div key={shopifyColor} className="flex flex-col items-center gap-1">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={unavailable}
                disabled={unavailable}
                title={tooltip}
                onClick={() => {
                  if (unavailable || variantIdx < 0) return;
                  onVariantChange(variantIdx);
                }}
                className={cn(
                  "relative h-9 w-9 shrink-0 rounded-full border border-foreground/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition-[box-shadow,transform,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSelected && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                  unavailable && "cursor-not-allowed opacity-45 grayscale",
                  !unavailable && "hover:scale-[1.04]",
                )}
                style={swatchStyle}
              >
                {unavailable ? (
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
                    aria-hidden
                  >
                    <span className="h-[2px] w-[140%] rotate-45 bg-foreground/55" />
                  </span>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Color: <span className="font-medium text-foreground">{selectedDisplayLabel}</span>
      </p>
    </div>
  );
}

/**
 * Swatch fill: prefer curated Amazon SS64; if no row for this Shopify Color,
 * use that variant’s Shopify hero image so the circle isn’t a blank hex slot.
 */
export function getCosmo20SwatchBackgroundStyle(
  shopifyColor: string,
  variantHeroImageUrl: string | null | undefined,
): CSSProperties {
  const def = resolveCosmo20SwatchDef(shopifyColor);
  if (def?.swatchImageUrl) {
    return {
      backgroundImage: `url(${def.swatchImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (variantHeroImageUrl) {
    return {
      backgroundImage: `url(${variantHeroImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: colorNameToApproximateHex(shopifyColor) };
}

export function isCosmo20Product(handle: string): boolean {
  return handle === "lay-n-go-cosmo-20";
}

/** Pick initial variant index: prefers Black, else first catalog color that exists in Shopify. */
function variantIndexForCatalogColor(product: ShopifyProduct["node"], catalogShopifyColor: string): number {
  const matchIdx = (color: string) =>
    product.variants.edges.findIndex(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === color),
    );

  const direct = matchIdx(catalogShopifyColor);
  if (direct >= 0) return direct;

  for (const [alias, canonical] of Object.entries(COSMO_20_SHOPIFY_ALIASES)) {
    if (canonical === catalogShopifyColor) {
      const idx = matchIdx(alias);
      if (idx >= 0) return idx;
    }
  }
  return -1;
}

export function getCosmo20InitialSelection(product: ShopifyProduct["node"]): { variantIdx: number } | null {
  if (!isCosmo20Product(product.handle)) return null;

  const blackIdx = variantIndexForCatalogColor(product, "Black");
  if (blackIdx >= 0) return { variantIdx: blackIdx };

  for (const sw of COSMO_20_SWATCHES) {
    const idx = variantIndexForCatalogColor(product, sw.shopifyColor);
    if (idx >= 0) return { variantIdx: idx };
  }

  if (product.variants.edges.length > 0) return { variantIdx: 0 };
  return null;
}

/** Hero/gallery URLs: curated Amazon set when present, else variant featured image from Shopify. */
export function getCosmo20HeroImageUrls(shopifyColor: string, variant?: VariantNode): string[] {
  const def = resolveCosmo20SwatchDef(shopifyColor);
  if (def) return def.galleryImageUrls?.length ? def.galleryImageUrls : [def.bagImageUrl];
  const u = variant?.image?.url;
  return u ? [u] : [];
}
