import { useMemo, type CSSProperties } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export type Cosmo20SwatchKind = "solid" | "metallicSilver" | "metallicGold" | "pattern";

export interface Cosmo20SwatchDef {
  /** Must match Shopify variant Color option value exactly */
  shopifyColor: string;
  /** Label under the grid when this swatch is selected */
  selectedLabel: string;
  /** Hover / native tooltip */
  tooltip: string;
  kind: Cosmo20SwatchKind;
  /** Solid / metallic base */
  hex?: string;
  /** Force unavailable (used with Shopify availability) */
  forceUnavailable?: boolean;
  /** If pattern image missing on variant, use this Shopify CDN URL */
  // TODO: replace any stale URLs if Lay-n-Go updates product photography
  fallbackImageUrl?: string;
}

/** Order and styling spec for Lay-n-Go COSMO (20") PDP — see product handle `lay-n-go-cosmo-20`. */
export const COSMO_20_SWATCHES: Cosmo20SwatchDef[] = [
  { shopifyColor: "Black", selectedLabel: "Black", tooltip: "Black", kind: "solid", hex: "#1a1a1a" },
  { shopifyColor: "Navy", selectedLabel: "Navy", tooltip: "Navy", kind: "solid", hex: "#1b2a4a" },
  { shopifyColor: "Pink", selectedLabel: "Pink", tooltip: "Pink", kind: "solid", hex: "#f4a7b9" },
  { shopifyColor: "Purple", selectedLabel: "Purple", tooltip: "Purple", kind: "solid", hex: "#7b5ea7" },
  { shopifyColor: "Ocean Blue", selectedLabel: "Ocean Blue", tooltip: "Ocean Blue", kind: "solid", hex: "#2a7fba" },
  { shopifyColor: "Silver", selectedLabel: "Silver", tooltip: "Silver", kind: "metallicSilver" },
  { shopifyColor: "Gold", selectedLabel: "Gold", tooltip: "Gold", kind: "metallicGold" },
  {
    shopifyColor: "Leopard",
    selectedLabel: "Leopard",
    tooltip: "Leopard",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/lay-n-go-cosmo-20cosmo-20lay-n-golayngo-new-28937643.jpg?v=1670376558",
  },
  {
    shopifyColor: "Chevron",
    selectedLabel: "Chevron",
    tooltip: "Chevron",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/lay-n-go-cosmo-20cosmo-20lay-n-golayngo-new-28937653.jpg?v=1670376558",
  },
  {
    shopifyColor: "Paisley",
    selectedLabel: "Paisley",
    tooltip: "Paisley",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/lay-n-go-cosmo-20cosmo-20lay-n-golayngo-new-28937644.jpg?v=1670376558",
  },
  {
    shopifyColor: "Rings",
    selectedLabel: "Rings (Black & Pink)",
    tooltip: "Rings (Black & Pink)",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/lay-n-go-cosmo-20cosmo-20lay-n-golayngo-new-28937654.jpg?v=1670376558",
  },
  {
    shopifyColor: "ZigZag",
    selectedLabel: "ZigZag",
    tooltip: "ZigZag (Out of Stock)",
    kind: "pattern",
    forceUnavailable: true,
    fallbackImageUrl: "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/ZIG_ZAG.png?v=1670419871",
  },
  { shopifyColor: "Evergreen", selectedLabel: "Evergreen", tooltip: "Evergreen", kind: "solid", hex: "#2d5a3d" },
  {
    shopifyColor: "Stars",
    selectedLabel: "Stars",
    tooltip: "Stars (Out of Stock)",
    kind: "pattern",
    forceUnavailable: true,
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/OPEN_AND_CLOSED_-_PSD_of_a_square_seperated_layout_Square_1000_x_1000.jpg?v=1670419871",
  },
  {
    shopifyColor: "Pink Camo",
    selectedLabel: "Pink Camo",
    tooltip: "Pink Camo",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/OPEN_AND_CLOSED_-_PSD_of_a_square_seperated_layout_JPG_Square_1_1000_x_1000.jpg?v=1670419871",
  },
  {
    shopifyColor: "Dot and Stripe",
    selectedLabel: "Dot/Stripe",
    tooltip: "Dot/Stripe",
    kind: "pattern",
    fallbackImageUrl:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/OPEN_AND_CLOSED_-_PSD_of_a_square_seperated_layout_Square_1_1000_x_1000.jpg?v=1670419871",
  },
];

interface Cosmo20ColorSelectorProps {
  product: ShopifyProduct["node"];
  selectedVariantIdx: number;
  onVariantChange: (variantIndex: number) => void;
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

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const selectedColor =
    selectedVariant?.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value ?? COSMO_20_SWATCHES[0].shopifyColor;

  const selectedDisplayLabel = useMemo(() => {
    const def = COSMO_20_SWATCHES.find((s) => s.shopifyColor === selectedColor);
    return def?.selectedLabel ?? selectedColor;
  }, [selectedColor]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color</label>

      <div
        className="grid grid-cols-4 gap-2 sm:grid-cols-6"
        role="listbox"
        aria-label="Color"
      >
        {COSMO_20_SWATCHES.map((def) => {
          const entry = variantByColor.get(def.shopifyColor);
          const variantIdx = entry?.idx ?? -1;
          const variant = entry?.node;
          const unavailable = def.forceUnavailable || (variant ? !variant.availableForSale : true);
          const isSelected = variantIdx >= 0 && variantIdx === selectedVariantIdx;

          const patternUrl = variant?.image?.url ?? def.fallbackImageUrl;
          const swatchStyle = getSwatchSurfaceStyle(def, patternUrl);

          return (
            <div key={def.shopifyColor} className="flex flex-col items-center gap-1">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={unavailable}
                disabled={unavailable}
                title={def.tooltip}
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

function getSwatchSurfaceStyle(def: Cosmo20SwatchDef, patternUrl?: string): CSSProperties {
  switch (def.kind) {
    case "solid":
      return { backgroundColor: def.hex ?? "#ccc" };
    case "metallicSilver":
      return {
        background:
          "linear-gradient(135deg, #ececec 0%, #b4b4c4 32%, #f8f8f8 48%, #9a9aac 62%, #e4e4ee 100%)",
      };
    case "metallicGold":
      return {
        background:
          "linear-gradient(135deg, #f3e6b8 0%, #c9a84c 38%, #ffe9a8 52%, #a88430 68%, #e8d49a 100%)",
      };
    case "pattern":
      if (patternUrl) {
        return {
          backgroundImage: `url(${patternUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      }
      return { backgroundColor: "#e5e5e5" };
    default:
      return {};
  }
}

export function isCosmo20Product(handle: string): boolean {
  return handle === "lay-n-go-cosmo-20";
}
