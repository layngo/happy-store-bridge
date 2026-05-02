import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getCosmo20SwatchBackgroundStyle, isCosmo20Product } from "@/components/Cosmo20ColorSelector";
import { COSMO_22_SWATCHES, isCosmo22Product } from "@/components/Cosmo22ColorSelector";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";

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
  const isCosmoMiniInteractive = isCosmoMini16Product(node.handle, node.title) && cosmoMiniVariants.length >= 2;

  const [selectedCosmoIdx, setSelectedCosmoIdx] = useState(0);

  useEffect(() => {
    setSelectedCosmoIdx(0);
  }, [node.id]);

  const cosmo22DefaultVariant = useMemo(() => selectCosmo22CardVariant(node), [node]);

  const selectedVariant = isCosmoMiniInteractive
    ? cosmoMiniVariants[selectedCosmoIdx]
    : isCosmo22Product(node.handle)
      ? cosmo22DefaultVariant
      : node.variants.edges[0]?.node;

  const defaultImage = node.images.edges[0]?.node;
  const hoverImage = node.images.edges[1]?.node ?? defaultImage;

  const displayImage = useMemo(() => {
    if (isCosmoMiniInteractive && selectedVariant) {
      if (!isCosmoBlackVariant(selectedVariant)) {
        return {
          url: COSMO_MINI_CROSSMARKS_HERO,
          altText: `${node.title} (Crossmarks)`,
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
    return defaultImage;
  }, [isCosmoMiniInteractive, selectedVariant, selectedCosmoIdx, node.images.edges, node.title, defaultImage]);

  const priceAmount =
    (isCosmoMiniInteractive || isCosmo22Product(node.handle)) && selectedVariant
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
        className="group relative block aspect-square w-full shrink-0 overflow-hidden bg-muted"
      >
        {displayImage ? (
          <img
            src={displayImage.url}
            alt={displayImage.altText || node.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
          {isCosmoMiniInteractive ? (
            <div className="flex items-center gap-2" role="radiogroup" aria-label="Color">
              {cosmoMiniVariants.slice(0, 2).map((v, i) => {
                const colorLabel = getVariantColorValue(v) ?? v.title;
                const selected = i === selectedCosmoIdx;
                const swatch = cosmoMiniSwatchStyle(v);
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    title={colorLabel}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCosmoIdx(i);
                    }}
                    className={cn(
                      "h-7 w-7 shrink-0 rounded-full border border-foreground/25 bg-center bg-no-repeat outline-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selected && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                    )}
                    style={swatch}
                  />
                );
              })}
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
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Cart"}
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

/** Cosmo Mini 16″: solid black vs official Crossmarks circle swatch asset. */
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
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  }
  if (isCosmo20Product(product.handle)) {
    const variantImg = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some((o) => /color|colour/i.test(o.name) && o.value === colorValue),
    )?.node.image?.url;
    return getCosmo20SwatchBackgroundStyle(colorValue, variantImg);
  }
  return { backgroundColor: colorNameToApproximateHex(colorValue) };
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

