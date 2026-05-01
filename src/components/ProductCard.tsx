import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  variant?: "default" | "imageOverlay";
}

export const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const image = node.images.edges[0]?.node;
  const hoverImage = node.images.edges[1]?.node ?? image;
  const price = node.priceRange.minVariantPrice;
  const firstVariant = node.variants.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: node.title, position: "top-center" });
  };

  const colorValues = getColorValues(node);
  const visibleColors = colorValues.slice(0, 4);
  const remainingColors = Math.max(0, colorValues.length - visibleColors.length);

  if (variant === "imageOverlay") {
    return (
      <Link to={`/product/${node.handle}`} className="group block">
        <article className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {image ? (
              <>
                <img
                  src={image.url}
                  alt={image.altText || node.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  loading="lazy"
                />
                <img
                  src={hoverImage?.url ?? image.url}
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
              <p className="mt-1 text-white/90 font-semibold">${parseFloat(price.amount).toFixed(2)}</p>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-square overflow-hidden bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-[1.05rem] font-medium text-foreground line-clamp-1">{node.title}</h3>
            <span className="shrink-0 text-2xl font-semibold text-foreground">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
          </div>

          {colorValues.length > 0 ? (
            <div className="flex items-center gap-2">
              {visibleColors.map((color) => (
                <span
                  key={color}
                  className="h-6 w-6 rounded-full border border-foreground/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  style={{ backgroundColor: colorToHex(color) }}
                  title={color}
                  aria-label={color}
                />
              ))}
              {remainingColors > 0 ? (
                <span className="text-xs font-medium text-muted-foreground">+{remainingColors} more</span>
              ) : null}
            </div>
          ) : null}

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant?.availableForSale}
            className="h-11 w-full rounded-md border border-foreground/25 bg-transparent text-foreground hover:bg-muted"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

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

function colorToHex(value: string): string {
  const key = value.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "#111111",
    white: "#f5f5f5",
    gray: "#8b8b8b",
    grey: "#8b8b8b",
    silver: "#b6b6b6",
    charcoal: "#44464d",
    navy: "#223049",
    blue: "#4b5f8c",
    red: "#b23b3b",
    pink: "#d58aa4",
    rose: "#cf8ea3",
    green: "#7e9880",
    olive: "#879173",
    tan: "#c0aa8a",
    beige: "#d3c5ad",
    brown: "#7c6653",
    purple: "#7a6e9c",
    teal: "#5e8c8c",
    orange: "#d08a4d",
    yellow: "#d6be67",
    gold: "#c3a86f",
    clear: "#d9d9d9",
  };
  return map[key] ?? "#9aa3b2";
}
