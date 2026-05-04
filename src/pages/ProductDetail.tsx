import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
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
import {
  Cosmo20ColorSelector,
  getCosmo20HeroImageUrls,
  getCosmo20InitialSelection,
  isCosmo20Product,
} from "@/components/Cosmo20ColorSelector";
import {
  Cosmo22ColorSelector,
  getCosmo22HeroImageUrls,
  getCosmo22InitialSelection,
  isCosmo22Product,
} from "@/components/Cosmo22ColorSelector";
import { CosmoPdpBenefits } from "@/components/CosmoPdpBenefits";

const COSMO_MINI_CROSSMARKS_HERO = "/products/cosmo-mini-16-crossmarks-hero.png";
const COSMO_MINI_CROSSMARKS_SWATCH = "/swatches/cosmo-mini-16-crossmarks-swatch.png";

function getOrderedImagesForProduct(product: ShopifyProduct["node"]) {
  const imgs = product.images.edges;
  if (!isCosmoMini16Product(product.handle, product.title) || imgs.length < 4) return imgs;
  const next = [...imgs];
  [next[1], next[3]] = [next[3], next[1]];
  return next;
}

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
  const [cosmo20GalleryIndex, setCosmo20GalleryIndex] = useState(0);
  const [cosmo22GalleryIndex, setCosmo22GalleryIndex] = useState(0);
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
    setCosmo20GalleryIndex(0);
    setCosmo22GalleryIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product || !isCosmo20Product(product.handle)) return;
    const init = getCosmo20InitialSelection(product);
    if (init) setSelectedVariantIdx(init.variantIdx);
  }, [product?.id, product?.handle]);

  useEffect(() => {
    if (!product || !isCosmo22Product(product.handle)) return;
    const init = getCosmo22InitialSelection(product);
    if (init) setSelectedVariantIdx(init.variantIdx);
  }, [product?.id, product?.handle]);

  useEffect(() => {
    setCosmo20GalleryIndex(0);
    setCosmo22GalleryIndex(0);
  }, [selectedVariantIdx]);

  const backHref = collectionHandle ? `/collections/${collectionHandle}` : "/collections";

  const isCosmoMini16 = product ? isCosmoMini16Product(product.handle, product.title) : false;
  const orderedImages = useMemo(() => {
    if (!product) return [];
    return getOrderedImagesForProduct(product);
  }, [product]);

  const cosmo20HeroUrls = useMemo(() => {
    if (!product || !isCosmo20Product(product.handle)) return [];
    const v = product.variants.edges[selectedVariantIdx]?.node;
    const color = v?.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
    if (!color) return [];
    return getCosmo20HeroImageUrls(color, v);
  }, [product, selectedVariantIdx]);

  const cosmo22HeroUrls = useMemo(() => {
    if (!product || !isCosmo22Product(product.handle)) return [];
    const v = product.variants.edges[selectedVariantIdx]?.node;
    const color = v?.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
    if (!color) return [];
    return getCosmo22HeroImageUrls(color, v);
  }, [product, selectedVariantIdx]);

  const isCosmoPdp = Boolean(
    product &&
      (isCosmo20Product(product.handle) ||
        isCosmo22Product(product.handle) ||
        isCosmoMini16Product(product.handle, product.title)),
  );

  const cosmoYoutubeId = useMemo(
    () => (product ? extractFirstYoutubeVideoId(product.description || "") : null),
    [product?.description],
  );

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
  const descHtml = /<[a-z][\s\S]*>/i.test(product.description);
  const priceDisplay = parseFloat(
    selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
  ).toFixed(2);

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

  const mainHeroImage: ReactNode = isCosmoMini16 && selectedVariant && !isCosmoBlackVariant(selectedVariant) ? (
    <img
      src={COSMO_MINI_CROSSMARKS_HERO}
      alt={`${product.title} (Crossmarks)`}
      className="h-full w-full object-contain p-6"
    />
  ) : isCosmo22Product(product.handle) && cosmo22HeroUrls.length > 0 ? (
    <img
      src={cosmo22HeroUrls[Math.min(cosmo22GalleryIndex, cosmo22HeroUrls.length - 1)]}
      alt={product.title}
      className="h-full w-full object-cover"
    />
  ) : isCosmo20Product(product.handle) && cosmo20HeroUrls.length > 0 ? (
    <img
      src={cosmo20HeroUrls[Math.min(cosmo20GalleryIndex, cosmo20HeroUrls.length - 1)]}
      alt={product.title}
      className="h-full w-full object-cover"
    />
  ) : orderedImages[selectedImage]?.node ? (
    <img
      src={orderedImages[selectedImage].node.url}
      alt={orderedImages[selectedImage].node.altText || product.title}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
  );

  const heroThumbnails: ReactNode = (
    <>
      {isCosmo22Product(product.handle) && cosmo22HeroUrls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Variant photo gallery">
          {cosmo22HeroUrls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setCosmo22GalleryIndex(i)}
              className={cn(
                "h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === cosmo22GalleryIndex ? "border-primary" : "border-border",
              )}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {isCosmo20Product(product.handle) && cosmo20HeroUrls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Variant photo gallery">
          {cosmo20HeroUrls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setCosmo20GalleryIndex(i)}
              className={cn(
                "h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === cosmo20GalleryIndex ? "border-primary" : "border-border",
              )}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {!isCosmo22Product(product.handle) && !isCosmo20Product(product.handle) && orderedImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {orderedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImage(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
            >
              <img src={img.node.url} alt={img.node.altText || ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );

  const optionPickersAndPurchase: ReactNode = (
    <>
      {(product.options ?? []).map((option, optIdx) => {
        if (option.values.length <= 1) return null;
        const isColorOption = /color|colour/i.test(option.name);
        if (isCosmo22Product(product.handle) && isColorOption) {
          return (
            <Cosmo22ColorSelector
              key={optIdx}
              product={product}
              selectedVariantIdx={selectedVariantIdx}
              onVariantChange={(variantIndex) => {
                setSelectedVariantIdx(variantIndex);
              }}
            />
          );
        }
        if (isCosmo20Product(product.handle) && isColorOption) {
          return (
            <Cosmo20ColorSelector
              key={optIdx}
              product={product}
              selectedVariantIdx={selectedVariantIdx}
              onVariantChange={(variantIndex) => {
                setSelectedVariantIdx(variantIndex);
              }}
            />
          );
        }
        return (
          <div key={optIdx} className="space-y-2">
            <label className="text-sm font-medium text-foreground">{option.name}</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.edges.map((v, vIdx) => {
                const optValue = v.node.selectedOptions.find((o) => o.name === option.name)?.value;
                const prevSame = product.variants.edges.findIndex(
                  (pv) => pv.node.selectedOptions.find((o) => o.name === option.name)?.value === optValue,
                );
                if (prevSame !== vIdx) return null;
                const isColor = /color|colour/i.test(option.name);
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
                      isColor
                        ? "h-9 w-9 rounded-full border border-foreground/25 bg-cover bg-center bg-no-repeat transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        : "rounded-md border px-4 py-2 text-sm transition-colors",
                      isColor
                        ? vIdx === selectedVariantIdx
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : ""
                        : vIdx === selectedVariantIdx
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground",
                      !v.node.availableForSale ? "line-through opacity-40" : "",
                    )}
                    style={
                      isColor
                        ? isCosmoMini16
                          ? cosmoMiniSwatchStyle(v.node)
                          : variantImageSwatchStyle(v.node, optValue || "")
                        : undefined
                    }
                    disabled={!v.node.availableForSale}
                    aria-label={optValue}
                    title={optValue}
                  >
                    {isColor ? <span className="sr-only">{optValue}</span> : optValue}
                  </button>
                );
              })}
            </div>
            {isColorOptionName(option.name) ? (
              <p className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">
                  {selectedVariant?.selectedOptions.find((o) => o.name === option.name)?.value ?? option.values[0]}
                </span>
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-lg font-medium text-foreground">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={isLoading || !selectedVariant?.availableForSale}
        className="w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </>
  );

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

        {isCosmoPdp ? (
          <>
            <section className="-mx-4 rounded-3xl bg-gradient-to-b from-muted/45 via-background to-background px-4 py-8 sm:-mx-6 sm:px-6 lg:py-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
                <div className="space-y-4 lg:col-span-7 xl:col-span-8">
                  <div className="relative aspect-[4/5] max-h-[min(88vh,920px)] overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:aspect-square">
                    {mainHeroImage}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8">
                      <h1 className="font-heading text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl sm:leading-tight">
                        {product.title}
                      </h1>
                      <p className="mt-2 text-xl font-semibold tabular-nums text-white/95 drop-shadow sm:text-2xl">
                        ${priceDisplay}
                      </p>
                    </div>
                  </div>
                  {heroThumbnails}
                </div>
                <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-card/50 p-5 shadow-sm backdrop-blur-sm sm:p-6 lg:col-span-5 xl:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Choose options</p>
                  {optionPickersAndPurchase}
                </div>
              </div>
            </section>

            <section className="mt-14 sm:mt-16">
              <CosmoPdpBenefits />
            </section>

            {cosmoYoutubeId ? (
              <section className="mt-14 sm:mt-16">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Watch</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  See how it opens flat, packs fast, and keeps everything visible.
                </p>
                <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
                  <iframe
                    title="Cosmo product video"
                    src={`https://www.youtube.com/embed/${cosmoYoutubeId}?rel=0`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-card">
                {mainHeroImage}
              </div>
              {heroThumbnails}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">{product.title}</h1>
                <p className="mt-2 text-2xl font-bold text-primary">${priceDisplay}</p>
              </div>

              {descHtml ? (
                <div
                  className="space-y-3 text-sm font-medium leading-relaxed text-muted-foreground [&_a]:text-primary [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : product.description ? (
                <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              ) : null}

              {optionPickersAndPurchase}
            </div>
          </div>
        )}

        {related.length > 0 ? (
          <section className={cn("border-t border-border pt-12", isCosmoPdp ? "mt-20 sm:mt-24" : "mt-20")}>
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

function isColorOptionName(name: string): boolean {
  return /color|colour/i.test(name);
}

function variantImageSwatchStyle(
  variant: ShopifyProduct["node"]["variants"]["edges"][number]["node"],
  fallbackColor: string,
): CSSProperties {
  if (variant.image?.url) {
    return {
      backgroundImage: `url(${variant.image.url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: colorToHex(fallbackColor) };
}

/** Pull first YouTube id from Shopify product HTML (e.g. embedded iframe in description). */
function extractFirstYoutubeVideoId(html: string): string | null {
  if (!html) return null;
  const embed = html.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i);
  if (embed?.[1]) return embed[1];
  const shorts = html.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/i);
  if (shorts?.[1]) return shorts[1];
  const vParam = html.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (vParam?.[1]) return vParam[1];
  return null;
}
