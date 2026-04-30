import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
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
      <div className="overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
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
        <div className="p-4 space-y-2">
          <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-1">{node.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{node.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-primary">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant?.availableForSale}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4 mr-1" />Add</>}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
