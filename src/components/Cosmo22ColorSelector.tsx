import { useMemo, type CSSProperties } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import { cn } from "@/lib/utils";

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export interface Cosmo22SwatchDef {
  shopifyColor: string;
  selectedLabel: string;
  tooltip: string;
  bagImageUrl: string;
  /** Amazon `_SS64_.jpg` fabric circle; omit when not yet provided (UI falls back to approximate color). */
  swatchImageUrl?: string;
  galleryImageUrls?: string[];
  forceUnavailable?: boolean;
}

/**
 * COSMO Deluxe (22") — `lay-n-go-cosmo-deluxe-22`. `shopifyColor` must match Shopify Color option.
 *
 * Bag hero + `_AC_*` galleries + `_SS64_` circles:
 * - Black / Paisley / Pink: user-supplied Amazon URLs for the 22″ listing.
 * - Leopard / Purple: same Amazon assets as Cosmo 20″ for that print (shared fabric).
 * - Tan Check: Lay-n-Go storefront gallery until Amazon `_SS64_` is supplied (swatch uses hex fallback).
 */
export const COSMO_22_SWATCHES: Cosmo22SwatchDef[] = [
  {
    shopifyColor: "Leopard",
    selectedLabel: "Leopard",
    tooltip: "Leopard",
    bagImageUrl: "https://m.media-amazon.com/images/I/61cKWYc+iZL._AC_SL1080_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41Q6W7FwObL._SS64_.jpg",
    galleryImageUrls: [
      "https://m.media-amazon.com/images/I/61cKWYc+iZL._AC_SL1080_.jpg",
      "https://m.media-amazon.com/images/I/617sqbmll9L._AC_SL1080_.jpg",
      "https://m.media-amazon.com/images/I/619XNuTzMAL._AC_SX679_.jpg",
    ],
  },
  {
    shopifyColor: "Black",
    selectedLabel: "Black",
    tooltip: "Black",
    bagImageUrl: "https://m.media-amazon.com/images/I/81Xfs+biBCL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/41z6K5qgpcL._SS64_.jpg",
    galleryImageUrls: [
      "https://m.media-amazon.com/images/I/81Xfs+biBCL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/51NDY1iywwL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/61PBvX-NQeL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/51KciV3PddL._AC_SX679_.jpg",
    ],
  },
  {
    shopifyColor: "Purple",
    selectedLabel: "Purple",
    tooltip: "Purple",
    bagImageUrl: "https://m.media-amazon.com/images/I/81NdmHY4fwL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31eTOK3c+SL._SS64_.jpg",
  },
  {
    shopifyColor: "Pink",
    selectedLabel: "Pink",
    tooltip: "Pink",
    bagImageUrl: "https://m.media-amazon.com/images/I/8182IPeHmIL._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/31J83-22JUL._SS64_.jpg",
  },
  {
    shopifyColor: "Paisley",
    selectedLabel: "Blue Paisley",
    tooltip: "Blue Paisley",
    bagImageUrl: "https://m.media-amazon.com/images/I/81VrMzQnvoS._AC_SX679_.jpg",
    swatchImageUrl: "https://m.media-amazon.com/images/I/61ge28PK9SL._SS64_.jpg",
    galleryImageUrls: [
      "https://m.media-amazon.com/images/I/81VrMzQnvoS._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/61tcnDPWpDL._AC_SX679_.jpg",
    ],
  },
  {
    shopifyColor: "Tan Check",
    selectedLabel: "Tan Check",
    tooltip: "Tan Check",
    bagImageUrl:
      "https://www.layngo.com/cdn/shop/products/B00B04V3PQ.PT05_9759822f-2663-432c-8d06-1fca5be1a436_1200x1200.jpg?v=1626119416",
  },
];

interface Cosmo22ColorSelectorProps {
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

export function Cosmo22ColorSelector({ product, selectedVariantIdx, onVariantChange }: Cosmo22ColorSelectorProps) {
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
    const def = COSMO_22_SWATCHES.find((s) => s.shopifyColor === selectedColor);
    return def?.selectedLabel ?? selectedColor;
  }, [selectedColor]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color</label>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="listbox" aria-label="Color">
        {colorValues.map((shopifyColor) => {
          const def = COSMO_22_SWATCHES.find((s) => s.shopifyColor === shopifyColor);
          const entry = variantByColor.get(shopifyColor);
          const variantIdx = entry?.idx ?? -1;
          const variant = entry?.node;
          const unavailable = Boolean(def?.forceUnavailable) || (variant ? !variant.availableForSale : true);
          const isSelected = variantIdx >= 0 && variantIdx === selectedVariantIdx;
          const swatchStyle = getCosmo22SwatchStyle(def, shopifyColor);
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

/** Only curated SS64 fabric circles — never variant hero photos (those read as “bag” in a tiny circle). */
function getCosmo22SwatchStyle(def: Cosmo22SwatchDef | undefined, shopifyColor: string): CSSProperties {
  if (def?.swatchImageUrl) {
    return {
      backgroundImage: `url(${def.swatchImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: colorNameToApproximateHex(shopifyColor) };
}

export function isCosmo22Product(handle: string): boolean {
  return handle === "lay-n-go-cosmo-deluxe-22";
}

export function getCosmo22InitialSelection(product: ShopifyProduct["node"]): { variantIdx: number } | null {
  if (!isCosmo22Product(product.handle)) return null;

  const matchIdx = (color: string) =>
    product.variants.edges.findIndex(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === color),
    );

  const blackIdx = matchIdx("Black");
  if (blackIdx >= 0) return { variantIdx: blackIdx };

  for (const sw of COSMO_22_SWATCHES) {
    const idx = matchIdx(sw.shopifyColor);
    if (idx >= 0) return { variantIdx: idx };
  }

  if (product.variants.edges.length > 0) return { variantIdx: 0 };
  return null;
}

/** Hero/gallery URLs: curated Amazon set when present, else variant featured image from Shopify. */
export function getCosmo22HeroImageUrls(shopifyColor: string, variant?: VariantNode): string[] {
  const def = COSMO_22_SWATCHES.find((s) => s.shopifyColor === shopifyColor);
  if (def) return def.galleryImageUrls?.length ? def.galleryImageUrls : [def.bagImageUrl];
  const u = variant?.image?.url;
  return u ? [u] : [];
}
