import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/LoadingSpinner";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  COSMO_20_SWATCHES,
  getCosmo20HeroImageUrls,
  getCosmo20SwatchBackgroundStyle,
  isCosmo20Product,
  resolveCosmo20SwatchDef,
} from "@/components/Cosmo20ColorSelector";
import { COSMO_22_SWATCHES, getCosmo22HeroImageUrls, isCosmo22Product } from "@/components/Cosmo22ColorSelector";
import {
  getNailspa18HeroImageUrls,
  getNailspa18SwatchBackgroundStyle,
  isNailspa18Product,
  NAILSPA_18_SWATCHES,
  NAILSPA_PRODUCT_IMAGE_CLASS,
} from "@/components/Nailspa18ColorSelector";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import {
  isLayNGoLite18Product,
  isLayNGoPlayMatProduct,
  LAY_NGO_LITE_SHOPIFY_HERO_IMAGE_CLASS,
  layNGoPlayMatSwatchStyle,
} from "@/lib/layNGoPlayMat";

interface ProductCardProps {
  product: ShopifyProduct;
  variant?: "default" | "imageOverlay";
}

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

const COSMO_MINI_CROSSMARKS_HERO = "/products/cosmo-mini-16-crossmarks-hero.png";
const COSMO_MINI_CROSSMARKS_SWATCH = "/swatches/cosmo-mini-16-crossmarks-swatch.png";

export const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  const cosmoMiniVariants = useMemo(() => orderCosmoMiniColorVariants(node), [node]);
  const cosmo20CardVariants = useMemo(() => orderCosmo20CardVariants(node), [node]);
  const cosmo22CardVariants = useMemo(() => orderCosmo22CardVariants(node), [node]);
  const nailspa18CardVariants = useMemo(() => orderNailspa18CardVariants(node), [node]);

  const isCosmoMiniInteractive = isCosmoMini16Product(node.handle, node.title) && cosmoMiniVariants.length >= 2;
  const isCosmo20Interactive = isCosmo20Product(node.handle) && cosmo20CardVariants.length >= 2;
  const isCosmo22Interactive = isCosmo22Product(node.handle) && cosmo22CardVariants.length >= 2;
  const isNailspa18Interactive = isNailspa18Product(node.handle) && nailspa18CardVariants.length >= 2;
  const isLite18Interactive = isLayNGoLite18Product(node.handle) && node.variants.edges.length >= 2;

  const [selectedCosmoIdx, setSelectedCosmoIdx] = useState(0);

  useEffect(() => {
    if (isCosmoMiniInteractive) {
      setSelectedCosmoIdx(0);
      return;
    }
    if (isCosmo20Interactive) {
      const i = cosmo20CardVariants.findIndex((v) => isCosmoBlackVariant(v));
      setSelectedCosmoIdx(i >= 0 ? i : 0);
      return;
    }
    if (isCosmo22Interactive) {
      const i = cosmo22CardVariants.findIndex((v) => isCosmoBlackVariant(v));
      setSelectedCosmoIdx(i >= 0 ? i : 0);
      return;
    }
    if (isNailspa18Interactive) {
      const i = nailspa18CardVariants.findIndex((v) => getVariantColorValue(v) === "Violet Femme");
      setSelectedCosmoIdx(i >= 0 ? i : 0);
      return;
    }
    setSelectedCosmoIdx(0);
  }, [
    node.id,
    isCosmoMiniInteractive,
    isCosmo20Interactive,
    isCosmo22Interactive,
    isNailspa18Interactive,
    cosmo20CardVariants,
    cosmo22CardVariants,
    nailspa18CardVariants,
  ]);

  const interactiveCosmoVariants = isCosmoMiniInteractive
    ? cosmoMiniVariants
    : isCosmo20Interactive
      ? cosmo20CardVariants
      : isCosmo22Interactive
        ? cosmo22CardVariants
        : isNailspa18Interactive
          ? nailspa18CardVariants
          : [];

  const selectedVariant = isCosmoMiniInteractive
    ? cosmoMiniVariants[Math.min(selectedCosmoIdx, cosmoMiniVariants.length - 1)]
    : isCosmo20Interactive
      ? cosmo20CardVariants[Math.min(selectedCosmoIdx, cosmo20CardVariants.length - 1)]
      : isCosmo22Interactive
        ? cosmo22CardVariants[Math.min(selectedCosmoIdx, cosmo22CardVariants.length - 1)]
        : isNailspa18Interactive
          ? nailspa18CardVariants[Math.min(selectedCosmoIdx, nailspa18CardVariants.length - 1)]
          : isCosmo22Product(node.handle)
            ? selectCosmo22CardVariant(node)
            : node.variants.edges[0]?.node;

  const defaultImage = node.images.edges[0]?.node;
  const hoverImage = node.images.edges[1]?.node ?? defaultImage;

  const displayImage = useMemo(() => {
    if (isCosmoMiniInteractive && selectedVariant) {
      if (!isCosmoBlackVariant(selectedVariant)) {
        return {
          url: COSMO_MINI_CROSSMARKS_HERO,
          altText: `${node.title} (CrossMarks)`,
        };
      }
      if (selectedVariant.image?.url) {
        return {
          url: selectedVariant.image.url,
          altText: selectedVariant.image.altText ?? node.title,
        };
      }
      const idx = Math.min(selectedCosmoIdx, node.images.edges.length - 1);
      return node.images.edges[idx]?.node ?? defaultImage;
    }
    if (isCosmo20Interactive && selectedVariant) {
      const color = getVariantColorValue(selectedVariant) ?? "";
      const urls = getCosmo20HeroImageUrls(color, selectedVariant);
      const url = urls[0] ?? selectedVariant.image?.url ?? defaultImage?.url;
      if (url) {
        return { url, altText: selectedVariant.image?.altText ?? node.title };
      }
    }
    if (isCosmo22Interactive && selectedVariant) {
      const color = getVariantColorValue(selectedVariant) ?? "";
      const urls = getCosmo22HeroImageUrls(color, selectedVariant);
      const url = urls[0] ?? selectedVariant.image?.url ?? defaultImage?.url;
      if (url) {
        return { url, altText: selectedVariant.image?.altText ?? node.title };
      }
    }
    if (isNailspa18Interactive && selectedVariant) {
      const color = getVariantColorValue(selectedVariant) ?? "";
      const urls = getNailspa18HeroImageUrls(color, selectedVariant);
      const url = urls[0] ?? selectedVariant.image?.url ?? defaultImage?.url;
      if (url) {
        return { url, altText: selectedVariant.image?.altText ?? node.title };
      }
    }
    return defaultImage;
  }, [
    isCosmoMiniInteractive,
    isCosmo20Interactive,
    isCosmo22Interactive,
    isNailspa18Interactive,
    selectedVariant,
    selectedCosmoIdx,
    node.images.edges,
    node.title,
    defaultImage,
  ]);

  const priceAmount =
    (isCosmoMiniInteractive || isCosmo20Interactive || isCosmo22Interactive || isNailspa18Interactive) &&
    selectedVariant
      ? selectedVariant.price.amount
      : node.priceRange.minVariantPrice.amount;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: node.title, position: "top-center" });
  };

  const colorValues = useMemo(() => {
    const all = getColorValues(node);
    if (!isCosmo22Product(node.handle)) return all;
    const allow = new Set(COSMO_22_SWATCHES.map((s) => s.shopifyColor));
    return all.filter((c) => allow.has(c));
  }, [node]);
  const visibleColors = colorValues.slice(0, 4);
  const remainingColors = Math.max(0, colorValues.length - visibleColors.length);

  if (variant === "imageOverlay") {
    return (
      <Link to={`/product/${node.handle}`} className="group block">
        <article className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {defaultImage ? (
              <>
                <img
                  src={defaultImage.url}
                  alt={defaultImage.altText || node.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  loading="lazy"
                />
                <img
                  src={hoverImage?.url ?? defaultImage.url}
                  alt={hoverImage?.altText || node.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:opacity-100 group-hover:scale-105"
                  loading="lazy"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-heading text-lg font-bold text-white drop-shadow-md line-clamp-2">{node.title}</h3>
              <p className="mt-1 text-white/90 font-semibold">${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}</p>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Link
        to={`/product/${node.handle}`}
          className={cn(
            "group relative block aspect-square w-full shrink-0 overflow-hidden",
            isNailspa18Interactive || isLite18Interactive
              ? "bg-background"
              : isCosmo20Interactive || isCosmo22Interactive
                ? "bg-white"
                : "bg-muted",
          )}
      >
        {displayImage ? (
          <img
            src={displayImage.url}
            alt={displayImage.altText || node.title}
            className={cn(
              "h-full w-full transition-transform duration-500 group-hover:scale-[1.02]",
              isNailspa18Interactive
                ? cn(NAILSPA_PRODUCT_IMAGE_CLASS, "h-full w-full p-3 sm:p-4")
                : isLite18Interactive
                  ? cn(LAY_NGO_LITE_SHOPIFY_HERO_IMAGE_CLASS, "h-full w-full p-3 sm:p-4")
                  : isCosmo20Interactive || isCosmo22Interactive
                    ? "object-contain object-center p-3 sm:p-4"
                    : "object-cover object-center",
            )}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 bg-background p-4">
        <div className="flex min-h-[3rem] items-start justify-between gap-2">
          <Link
            to={`/product/${node.handle}`}
            className="font-heading text-[1.05rem] font-medium leading-snug text-foreground line-clamp-2 hover:text-primary min-w-0"
          >
            {node.title}
          </Link>
          <span className="shrink-0 text-xl font-semibold tabular-nums text-foreground">
            ${parseFloat(priceAmount).toFixed(2)}
          </span>
        </div>

        <div className="flex min-h-7 flex-wrap items-center gap-2">
          {isCosmoMiniInteractive || isCosmo20Interactive || isCosmo22Interactive || isNailspa18Interactive ? (
            <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Color">
              {interactiveCosmoVariants.slice(0, 8).map((v, i) => {
                const colorLabel = getVariantColorValue(v) ?? v.title;
                const selected = i === selectedCosmoIdx;
                const swatch = isCosmoMiniInteractive
                  ? cosmoMiniSwatchStyle(v)
                  : collectionSwatchStyleFromVariant(node, v);
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={colorLabel}
                    title={colorLabel}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCosmoIdx(i);
                    }}
                    className={cn(
                      "h-7 w-7 shrink-0 rounded-full border border-foreground/25 bg-center bg-no-repeat outline-none transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isCosmoMiniInteractive && "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                      (isCosmo20Interactive || isCosmo22Interactive || isNailspa18Interactive) && "bg-muted/30",
                      selected && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                    )}
                    style={swatch}
                  />
                );
              })}
              {interactiveCosmoVariants.length > 8 ? (
                <Link to={`/product/${node.handle}`} className="text-xs font-medium text-primary hover:underline">
                  +{interactiveCosmoVariants.length - 8} more
                </Link>
              ) : null}
            </div>
          ) : colorValues.length > 0 ? (
            <>
              {visibleColors.map((color) => (
                <span
                  key={color}
                  className="h-6 w-6 rounded-full border border-foreground/20 bg-muted bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  style={collectionSwatchStyle(node, color)}
                  title={color}
                  aria-label={color}
                />
              ))}
              {remainingColors > 0 ? (
                <Link to={`/product/${node.handle}`} className="text-xs font-medium text-primary hover:underline">
                  +{remainingColors} more
                </Link>
              ) : null}
            </>
          ) : (
            <span className="sr-only">No swatches</span>
          )}
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant?.availableForSale}
          className="mt-auto h-11 w-full rounded-md border border-foreground/25 bg-transparent text-foreground hover:bg-muted"
        >
          {isLoading ? <ButtonSpinner label="Adding to cart" /> : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
};

function isCosmoMini16Product(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  const mentionsMini = h.includes("cosmo-mini") || (t.includes("cosmo") && t.includes("mini"));
  const mentions16 = h.includes("16") || t.includes("16");
  return mentionsMini && mentions16;
}

/** First matching SKU among the three curated 22″ colors (prefer Black). */
function selectCosmo22CardVariant(product: ShopifyProduct["node"]): VariantNode | undefined {
  const matchColor = (color: string) =>
    product.variants.edges.find(({ node: v }) =>
      v.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === color),
    )?.node;
  const black = matchColor("Black");
  if (black) return black;
  for (const sw of COSMO_22_SWATCHES) {
    const v = matchColor(sw.shopifyColor);
    if (v) return v;
  }
  return product.variants.edges[0]?.node;
}

function getVariantColorValue(v: VariantNode): string | undefined {
  const opt = v.selectedOptions.find(o => /color|colour/i.test(o.name));
  return opt?.value;
}

function isCosmoBlackVariant(v: VariantNode): boolean {
  const label = (getVariantColorValue(v) ?? v.title).toLowerCase();
  return label.includes("black");
}

function orderCosmoMiniColorVariants(product: ShopifyProduct["node"]): VariantNode[] {
  let variants = product.variants.edges.map(e => e.node);
  let colored = variants.filter((v) => v.selectedOptions.some(o => /color|colour/i.test(o.name)));

  if (
    colored.length < 2 &&
    variants.length >= 2 &&
    isCosmoMini16Product(product.handle, product.title)
  ) {
    colored = variants.slice(0, 2);
  }

  if (colored.length === 0) return [];

  return [...colored].sort((a, b) => {
    const ca = (getVariantColorValue(a) ?? a.title).toLowerCase();
    const cb = (getVariantColorValue(b) ?? b.title).toLowerCase();
    const aBlack = ca.includes("black");
    const bBlack = cb.includes("black");
    if (aBlack && !bBlack) return -1;
    if (!aBlack && bBlack) return 1;
    return ca.localeCompare(cb);
  });
}

/** Cosmo Mini 16″: solid black vs official CrossMarks circle swatch asset. */
function cosmoMiniSwatchStyle(v: VariantNode): CSSProperties {
  if (isCosmoBlackVariant(v)) {
    return { backgroundColor: "#111111" };
  }
  return {
    backgroundImage: `url(${COSMO_MINI_CROSSMARKS_SWATCH})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Collection grid: Cosmo 22 uses SS64 only; Cosmo 20 prefers SS64 then variant hero for uncatalogued colors. */
function collectionSwatchStyle(product: ShopifyProduct["node"], colorValue: string): CSSProperties {
  if (isCosmo22Product(product.handle)) {
    const def = COSMO_22_SWATCHES.find((s) => s.shopifyColor === colorValue);
    if (def?.swatchImageUrl) {
      return {
        backgroundImage: `url(${def.swatchImageUrl})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
  }
  if (isCosmo20Product(product.handle)) {
    const variantImg = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === colorValue),
    )?.node.image?.url;
    return getCosmo20SwatchBackgroundStyle(colorValue, variantImg);
  }
  if (isNailspa18Product(product.handle)) {
    const variantImg = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === colorValue),
    )?.node.image?.url;
    return getNailspa18SwatchBackgroundStyle(colorValue, variantImg);
  }
  if (isLayNGoPlayMatProduct(product.handle)) {
    return layNGoPlayMatSwatchStyle(colorValue);
  }
  return { backgroundColor: colorNameToApproximateHex(colorValue) };
}

function collectionSwatchStyleFromVariant(product: ShopifyProduct["node"], v: VariantNode): CSSProperties {
  const c = getVariantColorValue(v);
  if (!c) return { backgroundColor: "#e5e5e5" };
  return collectionSwatchStyle(product, c);
}

function cosmo20CanonicalColor(colorValue: string): string {
  return resolveCosmo20SwatchDef(colorValue)?.shopifyColor ?? colorValue;
}

function prioritizeCosmo20Variants(variants: VariantNode[], priority: string[]): VariantNode[] {
  const rank = new Map(priority.map((c, i) => [c, i]));
  return variants
    .map((v, i) => ({ v, i }))
    .sort((a, b) => {
      const ca = getVariantColorValue(a.v);
      const cb = getVariantColorValue(b.v);
      const ra = ca ? (rank.get(cosmo20CanonicalColor(ca)) ?? 999) : 999;
      const rb = cb ? (rank.get(cosmo20CanonicalColor(cb)) ?? 999) : 999;
      if (ra !== rb) return ra - rb;
      return a.i - b.i;
    })
    .map(({ v }) => v);
}

function orderCosmo20CardVariants(product: ShopifyProduct["node"]): VariantNode[] {
  const out: VariantNode[] = [];
  const used = new Set<string>();
  for (const sw of COSMO_20_SWATCHES) {
    const m = product.variants.edges.find(({ node }) => {
      const c = getVariantColorValue(node);
      if (!c) return false;
      const def = resolveCosmo20SwatchDef(c);
      if (def?.shopifyColor === sw.shopifyColor) return true;
      return c === sw.shopifyColor;
    });
    if (m) {
      out.push(m.node);
      const c = getVariantColorValue(m.node);
      if (c) used.add(c);
    }
  }
  for (const { node } of product.variants.edges) {
    const c = getVariantColorValue(node);
    if (c && !used.has(c)) {
      out.push(node);
      used.add(c);
    }
  }
  return out;
}

function orderCosmo22CardVariants(product: ShopifyProduct["node"]): VariantNode[] {
  const out: VariantNode[] = [];
  for (const sw of COSMO_22_SWATCHES) {
    const m = product.variants.edges.find(({ node }) => getVariantColorValue(node) === sw.shopifyColor);
    if (m) out.push(m.node);
  }
  return out;
}

function orderNailspa18CardVariants(product: ShopifyProduct["node"]): VariantNode[] {
  const out: VariantNode[] = [];
  const used = new Set<string>();
  for (const sw of NAILSPA_18_SWATCHES) {
    const m = product.variants.edges.find(({ node }) => getVariantColorValue(node) === sw.shopifyColor);
    if (m) {
      out.push(m.node);
      const c = getVariantColorValue(m.node);
      if (c) used.add(c);
    }
  }
  for (const { node } of product.variants.edges) {
    const c = getVariantColorValue(node);
    if (c && !used.has(c)) {
      out.push(node);
      used.add(c);
    }
  }
  return out;
}

function getColorValues(product: ShopifyProduct["node"]): string[] {
  const option = product.options.find((o) => o.name.toLowerCase().includes("color") || o.name.toLowerCase().includes("colour"));
  if (option?.values?.length) return option.values;

  const fromVariants = new Set<string>();
  product.variants.edges.forEach(({ node }) => {
    node.selectedOptions.forEach((opt) => {
      if (opt.name.toLowerCase().includes("color") || opt.name.toLowerCase().includes("colour")) {
        fromVariants.add(opt.value);
      }
    });
  });
  return [...fromVariants];
}

export type CollectionGridSwatchPreviewOptions = {
  /** Default 8. Useful on dense layouts (e.g. Cosmo 20″ column). */
  maxInteractiveSwatches?: number;
  /** Pin these Cosmo 20″ colors first (canonical names, e.g. Sky Blue). */
  cosmo20PriorityColors?: string[];
};

/** Swatch row matching default collection `ProductCard`: up to 8 variant swatches (+N) or 4 color dots (+N). */
export function getCollectionGridSwatchPreview(
  node: ShopifyProduct["node"],
  options?: CollectionGridSwatchPreviewOptions,
): {
  swatches: { style: CSSProperties; label: string; key: string }[];
  remaining: number;
  interactive: boolean;
  cosmoMiniInteractive: boolean;
  cosmoOtherInteractive: boolean;
} {
  const cosmoMiniVariants = orderCosmoMiniColorVariants(node);
  const cosmo20CardVariants = orderCosmo20CardVariants(node);
  const cosmo22CardVariants = orderCosmo22CardVariants(node);
  const nailspa18CardVariants = orderNailspa18CardVariants(node);

  const isCosmoMiniInteractive = isCosmoMini16Product(node.handle, node.title) && cosmoMiniVariants.length >= 2;
  const isCosmo20Interactive = isCosmo20Product(node.handle) && cosmo20CardVariants.length >= 2;
  const isCosmo22Interactive = isCosmo22Product(node.handle) && cosmo22CardVariants.length >= 2;
  const isNailspa18Interactive = isNailspa18Product(node.handle) && nailspa18CardVariants.length >= 2;

  if (isCosmoMiniInteractive || isCosmo20Interactive || isCosmo22Interactive || isNailspa18Interactive) {
    let variants = isCosmoMiniInteractive
      ? cosmoMiniVariants
      : isCosmo20Interactive
        ? cosmo20CardVariants
        : isCosmo22Interactive
          ? cosmo22CardVariants
          : nailspa18CardVariants;
    if (isCosmo20Interactive && options?.cosmo20PriorityColors?.length) {
      variants = prioritizeCosmo20Variants(variants, options.cosmo20PriorityColors);
    }
    const interactiveLimit = options?.maxInteractiveSwatches ?? 8;
    const visible = variants.slice(0, interactiveLimit);
    const swatches = visible.map((v) => ({
      style: isCosmoMiniInteractive ? cosmoMiniSwatchStyle(v) : collectionSwatchStyleFromVariant(node, v),
      label: getVariantColorValue(v) ?? v.title,
      key: v.id,
    }));
    return {
      swatches,
      remaining: Math.max(0, variants.length - visible.length),
      interactive: true,
      cosmoMiniInteractive: isCosmoMiniInteractive,
      cosmoOtherInteractive: isCosmo20Interactive || isCosmo22Interactive || isNailspa18Interactive,
    };
  }

  let colorValues = getColorValues(node);
  if (isCosmo22Product(node.handle)) {
    const allow = new Set(COSMO_22_SWATCHES.map((s) => s.shopifyColor));
    colorValues = colorValues.filter((c) => allow.has(c));
  }
  const visible = colorValues.slice(0, 4);
  const swatches = visible.map((color) => ({
    style: collectionSwatchStyle(node, color),
    label: color,
    key: color,
  }));
  return {
    swatches,
    remaining: Math.max(0, colorValues.length - visible.length),
    interactive: false,
    cosmoMiniInteractive: false,
    cosmoOtherInteractive: false,
  };
}

