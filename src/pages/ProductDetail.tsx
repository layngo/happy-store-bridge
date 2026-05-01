import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchProductByHandle,
  fetchRelatedProducts,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COSMO_MINI_CROSSMARKS_HERO = "/products/cosmo-mini-16-crossmarks-hero.png";
const COSMO_MINI_CROSSMARKS_SWATCH = "/swatches/cosmo-mini-16-crossmarks-swatch.png";

const ProductDetail = () => {
  const { handle, collectionHandle, productHandle } = useParams<{
    handle?: string;
    collectionHandle?: string;
    productHandle?: string;
  }>();
  const slug = productHandle ?? handle;

  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [related, setRelated] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductByHandle(slug)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    fetchRelatedProducts(product.handle, 4).then(setRelated).catch(console.error);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setSelectedVariantIdx(0);
    setSelectedImage(0);
    setQuantity(1);
  }, [product?.id]);

  const backHref = collectionHandle ? `/collections/${collectionHandle}` : "/collections";

  const isCosmoMini16 = product ? isCosmoMini16Product(product.handle, product.title) : false;
  const orderedImages = useMemo(() => {
    const imgs = product?.images.edges ?? [];
    if (!isCosmoMini16 || imgs.length < 4) return imgs;
    const next = [...imgs];
    [next[1], next[3]] = [next[3], next[1]];
    return next;
  }, [product, isCosmoMini16]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View collections
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const descHtml = /<[a-z][\s\S]*>/i.test(product.description);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: `${product.title} × ${quantity}`, position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          {collectionHandle ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link to={`/collections/${collectionHandle}`} className="hover:text-foreground transition-colors capitalize">
                {collectionHandle.replace(/-/g, " ")}
              </Link>
            </>
          ) : null}
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
        </nav>

        <Link
          to={backHref}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{collectionHandle ? "Back to collection" : "Back to collections"}</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
              {isCosmoMini16 && selectedVariant && !isCosmoBlackVariant(selectedVariant) ? (
                <img
                  src={COSMO_MINI_CROSSMARKS_HERO}
                  alt={`${product.title} (Crossmarks)`}
                  className="w-full h-full object-contain p-6"
                />
              ) : orderedImages[selectedImage]?.node ? (
                <img
                  src={orderedImages[selectedImage].node.url}
                  alt={orderedImages[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
            {orderedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {orderedImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                ${parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
            </div>

            {descHtml ? (
              <div
                className="text-muted-foreground leading-normal font-medium space-y-3 [&_a]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-muted-foreground leading-normal font-medium whitespace-pre-wrap">{product.description}</p>
            )}

            {(product.options ?? []).map((option, optIdx) =>
              option.values.length > 1 ? (
                <div key={optIdx} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v, vIdx) => {
                      const optValue = v.node.selectedOptions.find((o) => o.name === option.name)?.value;
                      const prevSame = product.variants.edges.findIndex(
                        (pv) => pv.node.selectedOptions.find((o) => o.name === option.name)?.value === optValue,
                      );
                      if (prevSame !== vIdx) return null;
                      const isColorOption = /color|colour/i.test(option.name);
                      return (
                        <button
                          key={vIdx}
                          type="button"
                          onClick={() => {
                            setSelectedVariantIdx(vIdx);
                            const variantImageUrl = v.node.image?.url;
                            if (variantImageUrl) {
                              const imageIdx = orderedImages.findIndex((img) => img.node.url === variantImageUrl);
                              if (imageIdx >= 0) setSelectedImage(imageIdx);
                            } else if (isCosmoMini16 && !isCosmoBlackVariant(v.node)) {
                              setSelectedImage(1);
                            }
                          }}
                          className={cn(
                            isColorOption
                              ? "h-9 w-9 rounded-full border border-foreground/25 bg-center bg-cover bg-no-repeat transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              : "px-4 py-2 rounded-md text-sm border transition-colors",
                            isColorOption
                              ? vIdx === selectedVariantIdx
                                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                : ""
                              : vIdx === selectedVariantIdx
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-foreground",
                            !v.node.availableForSale ? "opacity-40 line-through" : "",
                          )}
                          style={
                            isColorOption
                              ? isCosmoMini16
                                ? cosmoMiniSwatchStyle(v.node)
                                : { backgroundColor: colorToHex(optValue || "") }
                              : undefined
                          }
                          disabled={!v.node.availableForSale}
                          aria-label={optValue}
                          title={optValue}
                        >
                          {isColorOption ? <span className="sr-only">{optValue}</span> : optValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null,
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-lg font-medium text-foreground">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <SiteFooter />
    </div>
  );
};

export default ProductDetail;

function isCosmoMini16Product(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  const mentionsMini = h.includes("cosmo-mini") || (t.includes("cosmo") && t.includes("mini"));
  const mentions16 = h.includes("16") || t.includes("16");
  return mentionsMini && mentions16;
}

function isCosmoBlackVariant(v: ShopifyProduct["node"]["variants"]["edges"][number]["node"]): boolean {
  const colorOption = v.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value?.toLowerCase() ?? "";
  const title = v.title.toLowerCase();
  return colorOption.includes("black") || title.includes("black");
}

function cosmoMiniSwatchStyle(
  v: ShopifyProduct["node"]["variants"]["edges"][number]["node"],
): CSSProperties {
  if (isCosmoBlackVariant(v)) {
    return { backgroundColor: "#111111" };
  }
  return {
    backgroundImage: `url(${COSMO_MINI_CROSSMARKS_SWATCH})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
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
