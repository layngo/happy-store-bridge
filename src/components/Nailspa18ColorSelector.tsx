import { useMemo, type CSSProperties } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import { cn } from "@/lib/utils";

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export interface Nailspa18SwatchDef {
  shopifyColor: string;
  selectedLabel: string;
  tooltip: string;
  bagImageUrl: string;
  swatchImageUrl?: string;
  swatchHex?: string;
  galleryImageUrls?: string[];
}

/** Transparent PNG heroes on `bg-background` — no white product mat. */
const NAILSPA_18_HERO_BASE = "/products/lay-n-go-nailspa-18/heroes";

/** Curated heroes + swatches for Lay-n-Go NAILSPA (18″). */
export const NAILSPA_18_SWATCHES: Nailspa18SwatchDef[] = [
  {
    shopifyColor: "Violet Femme",
    selectedLabel: "Violet Femme",
    tooltip: "Violet Femme",
    bagImageUrl: `${NAILSPA_18_HERO_BASE}/violet-femme.png`,
    swatchImageUrl: "/swatches/nailspa-18-violet-femme.png",
  },
  {
    /** Archive Shopify option: `Dorothys Slipper` (no apostrophe). */
    shopifyColor: "Dorothys Slipper",
    selectedLabel: "Dorothy's Slipper (Red)",
    tooltip: "Dorothy's Slipper (Red)",
    bagImageUrl: `${NAILSPA_18_HERO_BASE}/dorothys-slipper.png`,
    swatchHex: "#DC2626",
  },
  {
    shopifyColor: "Dot Calm",
    selectedLabel: "Dot Calm",
    tooltip: "Dot Calm",
    bagImageUrl: `${NAILSPA_18_HERO_BASE}/dot-calm.png`,
    swatchImageUrl: "/swatches/nailspa-18-dot-calm.png",
  },
  {
    /** Archive Shopify: `What a Doll` */
    shopifyColor: "What a Doll",
    selectedLabel: "What A Doll (Pink)",
    tooltip: "What A Doll (Pink)",
    bagImageUrl: `${NAILSPA_18_HERO_BASE}/what-a-doll.png`,
    swatchHex: "#E6007E",
  },
  {
    /** Often OOS in storefront — still needs a proper circle swatch when disabled. */
    shopifyColor: "Pretty in Paisley",
    selectedLabel: "Pretty in Paisley",
    tooltip: "Pretty in Paisley",
    bagImageUrl: `${NAILSPA_18_HERO_BASE}/pretty-in-paisley.png`,
    swatchImageUrl: "/swatches/nailspa-18-pretty-in-paisley.png",
  },
];

/** PDP / card product shot — transparent PNG on `bg-background`, no shadow halo. */
export const NAILSPA_PRODUCT_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center";

/** Normalize legacy / shorthand option labels to Shopify’s canonical Color value. */
export const NAILSPA_18_SHOPIFY_ALIASES: Record<string, string> = {
  "Violet Fem": "Violet Femme",
  "Dorothy's Slipper": "Dorothys Slipper",
  "Dorothy's Slipper (Red)": "Dorothys Slipper",
  "Dorothys Slipper (Red)": "Dorothys Slipper",
  "What A Doll": "What a Doll",
  "What A Doll (Pink)": "What a Doll",
  "What a Doll (Pink)": "What a Doll",
};

export function resolveNailspa18SwatchDef(shopifyColor: string): Nailspa18SwatchDef | undefined {
  const key = NAILSPA_18_SHOPIFY_ALIASES[shopifyColor] ?? shopifyColor;
  return NAILSPA_18_SWATCHES.find((s) => s.shopifyColor === key);
}

interface Nailspa18ColorSelectorProps {
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

export function Nailspa18ColorSelector({ product, selectedVariantIdx, onVariantChange }: Nailspa18ColorSelectorProps) {
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
    const def = resolveNailspa18SwatchDef(selectedColor);
    return def?.selectedLabel ?? selectedColor;
  }, [selectedColor]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color</label>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="listbox" aria-label="Color">
        {colorValues.map((shopifyColor) => {
          const def = resolveNailspa18SwatchDef(shopifyColor);
          const entry = variantByColor.get(shopifyColor);
          const variantIdx = entry?.idx ?? -1;
          const variant = entry?.node;
          const unavailable = variant ? !variant.availableForSale : true;
          const isSelected = variantIdx >= 0 && variantIdx === selectedVariantIdx;
          const swatchStyle = getNailspa18SwatchBackgroundStyle(shopifyColor, variant?.image?.url);
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
                  "relative h-9 w-9 shrink-0 rounded-full bg-muted/25 transition-[transform,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  isSelected && "ring-2 ring-foreground ring-offset-2 ring-offset-white",
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

export function getNailspa18SwatchBackgroundStyle(
  shopifyColor: string,
  variantHeroImageUrl: string | null | undefined,
): CSSProperties {
  const def = resolveNailspa18SwatchDef(shopifyColor);
  if (def?.swatchImageUrl) {
    return {
      backgroundImage: `url(${def.swatchImageUrl})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  if (def?.swatchHex) {
    return {
      backgroundColor: def.swatchHex,
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
    };
  }
  if (variantHeroImageUrl) {
    return {
      backgroundImage: `url(${variantHeroImageUrl})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return { backgroundColor: colorNameToApproximateHex(shopifyColor) };
}

export function isNailspa18Product(handle: string): boolean {
  return handle === "lay-n-go-nailspa-18";
}

export function getNailspa18InitialSelection(product: ShopifyProduct["node"]): { variantIdx: number } | null {
  if (!isNailspa18Product(product.handle)) return null;

  for (const sw of NAILSPA_18_SWATCHES) {
    const idx = product.variants.edges.findIndex(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === sw.shopifyColor),
    );
    if (idx >= 0) return { variantIdx: idx };
  }

  if (product.variants.edges.length > 0) return { variantIdx: 0 };
  return null;
}

export function getNailspa18HeroImageUrls(shopifyColor: string, variant?: VariantNode): string[] {
  const def = resolveNailspa18SwatchDef(shopifyColor);
  if (def) return def.galleryImageUrls?.length ? def.galleryImageUrls : [def.bagImageUrl];
  const u = variant?.image?.url;
  return u ? [u] : [];
}
