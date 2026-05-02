import { useMemo, type CSSProperties } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import { cn } from "@/lib/utils";

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export interface Cosmo20SwatchDef {
  /** Must match Shopify variant Color option value exactly */
  shopifyColor: string;
  /** Label under the grid when this swatch is selected */
  selectedLabel: string;
  /** Hover / native tooltip */
  tooltip: string;
  /** Main hero / bag image (Amazon product image) */
  bagImageUrl: string;
  /** Small selector thumbnail (Amazon `_AC_US40_` or `_SS64_`) */
  swatchImageUrl: string;
  /** Extra PDP gallery images for this color (hero cycles via thumbnails); omit when only `bagImageUrl` applies */
  galleryImageUrls?: string[];
  /** Mark OOS in UI even if Shopify says available */
  forceUnavailable?: boolean;
}

/** Shared Amazon gallery images (same for every Cosmo 20″ color in the source list). */
const COSMO_20_SHARED_GALLERY: string[] = [
  "https://m.media-amazon.com/images/I/71m+V-ck1LL.jpg",
  "https://m.media-amazon.com/images/I/71paLFHiX8L.jpg",
  "https://m.media-amazon.com/images/I/71z1Ynw1M9L.jpg",
  "https://m.media-amazon.com/images/I/61zpCR00cFL.jpg",
];

/** Main `.jpg` + selector `._AC_US40_.jpg` + shared gallery. `stem` = Amazon image id (e.g. `81wVnvcGFtL`). */
function cosmo20AmazonRow(shopifyColor: string, stem: string, label?: string): Cosmo20SwatchDef {
  const base = `https://m.media-amazon.com/images/I/${stem}`;
  const bag = `${base}.jpg`;
  return {
    shopifyColor,
    selectedLabel: label ?? shopifyColor,
    tooltip: label ?? shopifyColor,
    bagImageUrl: bag,
    swatchImageUrl: `${base}._AC_US40_.jpg`,
    galleryImageUrls: [bag, ...COSMO_20_SHARED_GALLERY],
  };
}

const C20_BLACK = "81wVnvcGFtL";

/**
 * Cosmo 20″ — `lay-n-go-cosmo-20`. Source: user Amazon image list (main + selector + shared gallery per color).
 * Rows that share the Black catalog image use stem `81wVnvcGFtL` as in the source document.
 */
export const COSMO_20_SWATCHES: Cosmo20SwatchDef[] = [
  cosmo20AmazonRow("Black", C20_BLACK),
  cosmo20AmazonRow("Grit Grace Gratitude", "81oSkoitXcL"),
  cosmo20AmazonRow("Dogs", "81ARXpL4RlL"),
  cosmo20AmazonRow("Blue Snakeskin", "91+0Oi164eL"),
  cosmo20AmazonRow("Butterfly Small Floral", "81Tzy54bscL"),
  cosmo20AmazonRow("Checked", "81W3A6zgwCL"),
  cosmo20AmazonRow("Comfort (Black)", "81XpiSeXO5L"),
  cosmo20AmazonRow("Black & Gold", C20_BLACK),
  cosmo20AmazonRow("Blue Paisley", C20_BLACK),
  cosmo20AmazonRow("Comfort (Blue Inside)", C20_BLACK),
  cosmo20AmazonRow("Comfort (White Inside)", C20_BLACK),
  cosmo20AmazonRow("Dot (Navy/Green Stripe)", C20_BLACK),
  cosmo20AmazonRow("Elephants", C20_BLACK),
  cosmo20AmazonRow("Evergreen", C20_BLACK),
  cosmo20AmazonRow("Floral Large", C20_BLACK),
  cosmo20AmazonRow("Leopard", C20_BLACK),
  cosmo20AmazonRow("Lips (Black Inside)", C20_BLACK),
  cosmo20AmazonRow("Love", C20_BLACK),
  cosmo20AmazonRow("Metallic Gold", C20_BLACK),
  cosmo20AmazonRow("Metallic Silver", C20_BLACK),
  cosmo20AmazonRow("Navy", C20_BLACK),
  cosmo20AmazonRow("Ocean Blue", C20_BLACK),
  cosmo20AmazonRow("Pink", C20_BLACK),
  cosmo20AmazonRow("Pink Chevron", C20_BLACK),
  cosmo20AmazonRow("Purple", C20_BLACK),
  cosmo20AmazonRow("Purple Paisley", C20_BLACK),
  cosmo20AmazonRow("Quilted Lavender", C20_BLACK),
  cosmo20AmazonRow("Rings Black/White", C20_BLACK),
  cosmo20AmazonRow("Sky Blue", C20_BLACK),
];

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
    const def = COSMO_20_SWATCHES.find((s) => s.shopifyColor === selectedColor);
    return def?.selectedLabel ?? selectedColor;
  }, [selectedColor]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color</label>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="listbox" aria-label="Color">
        {colorValues.map((shopifyColor) => {
          const def = COSMO_20_SWATCHES.find((s) => s.shopifyColor === shopifyColor);
          const entry = variantByColor.get(shopifyColor);
          const variantIdx = entry?.idx ?? -1;
          const variant = entry?.node;
          const unavailable = Boolean(def?.forceUnavailable) || (variant ? !variant.availableForSale : true);
          const isSelected = variantIdx >= 0 && variantIdx === selectedVariantIdx;
          const swatchStyle = getCosmo20SwatchStyle(def, shopifyColor);
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

/** Curated Amazon selector thumbnails — never Shopify variant hero photos in circles. */
function getCosmo20SwatchStyle(def: Cosmo20SwatchDef | undefined, shopifyColor: string): CSSProperties {
  if (def?.swatchImageUrl) {
    return {
      backgroundImage: `url(${def.swatchImageUrl})`,
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
export function getCosmo20InitialSelection(product: ShopifyProduct["node"]): { variantIdx: number } | null {
  if (!isCosmo20Product(product.handle)) return null;

  const matchIdx = (color: string) =>
    product.variants.edges.findIndex(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === color),
    );

  const blackIdx = matchIdx("Black");
  if (blackIdx >= 0) return { variantIdx: blackIdx };

  for (const sw of COSMO_20_SWATCHES) {
    const idx = matchIdx(sw.shopifyColor);
    if (idx >= 0) return { variantIdx: idx };
  }

  if (product.variants.edges.length > 0) return { variantIdx: 0 };
  return null;
}

/** Hero/gallery URLs: curated Amazon set when present, else variant featured image from Shopify. */
export function getCosmo20HeroImageUrls(shopifyColor: string, variant?: VariantNode): string[] {
  const def = COSMO_20_SWATCHES.find((s) => s.shopifyColor === shopifyColor);
  if (def) return def.galleryImageUrls?.length ? def.galleryImageUrls : [def.bagImageUrl];
  const u = variant?.image?.url;
  return u ? [u] : [];
}
