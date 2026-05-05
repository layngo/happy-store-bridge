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
import { CosmoPdpStory } from "@/components/CosmoPdpStory";
import { ProductAmazonReviews } from "@/components/ProductAmazonReviews";
import { getAmazonReviewsForProduct } from "@/data/productAmazonReviews";

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

  const amazonReviewsBundle = useMemo(
    () => (product ? getAmazonReviewsForProduct(product.handle) : { reviews: [], amazonListingUrl: undefined }),
    [product],
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
      className="h-full w-full max-h-full object-contain"
    />
  ) : isCosmo20Product(product.handle) && cosmo20HeroUrls.length > 0 ? (
    <img
      src={cosmo20HeroUrls[Math.min(cosmo20GalleryIndex, cosmo20HeroUrls.length - 1)]}
      alt={product.title}
      className="h-full w-full max-h-full object-contain"
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
                "flex h-16 w-16 shrink-0 items-center justify-center bg-muted/15 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                i === cosmo22GalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : "ring-0",
              )}
            >
              <img src={url} alt="" className="max-h-full max-w-full object-contain" />
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
                "flex h-16 w-16 shrink-0 items-center justify-center bg-muted/15 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                i === cosmo20GalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : "ring-0",
              )}
            >
              <img src={url} alt="" className="max-h-full max-w-full object-contain" />
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

  const optionPickersOnly: ReactNode = (
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
    </>
  );

  const quantityStepper: ReactNode = (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button
        variant="outline"
        size="icon"
        className="border-neutral-300 text-neutral-800 hover:bg-neutral-100"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-10 text-center text-lg font-medium tabular-nums text-neutral-900 sm:w-12">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="border-neutral-300 text-neutral-800 hover:bg-neutral-100"
        onClick={() => setQuantity(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  const quantityPicker: ReactNode = (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Quantity</label>
      {quantityStepper}
    </div>
  );

  const addToCartButton: ReactNode = (
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
  );

  const addToCartButtonCosmo: ReactNode = (
    <Button
      size="lg"
      onClick={handleAddToCart}
      disabled={isLoading || !selectedVariant?.availableForSale}
      className="w-full rounded-md border border-neutral-700 bg-[#2c2c2c] font-serif text-base font-medium tracking-wide text-neutral-50 shadow-none hover:bg-[#1f1f1f] disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5 opacity-90" />
          Add to cart
        </>
      )}
    </Button>
  );

  const optionPickersAndPurchase: ReactNode = (
    <>
      {optionPickersOnly}
      {quantityPicker}
      {addToCartButton}
    </>
  );

  return (
    <div className={cn("min-h-screen flex flex-col", isCosmoPdp ? "bg-white" : "bg-background")}>
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
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem] md:leading-tight">
                {product.title}
              </h1>
            </header>

            <section className="-mx-4 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:py-10">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12">
                <div className="space-y-4">
                  <div className="relative flex aspect-square w-full items-center justify-center bg-white lg:mx-auto lg:max-h-[min(92vh,920px)]">
                    {mainHeroImage}
                  </div>
                  {heroThumbnails}
                </div>

                <div className="flex flex-col gap-6 px-0 py-0">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Choose colors</p>
                    <div className="mt-3">{optionPickersOnly}</div>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-neutral-200/80 pb-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Price</p>
                      <p className="mt-1 font-serif text-3xl font-semibold tabular-nums text-neutral-800 sm:text-[2.125rem]">
                        ${priceDisplay}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Quantity</label>
                      {quantityStepper}
                    </div>
                  </div>

                  {addToCartButtonCosmo}
                </div>
              </div>
            </section>

            <CosmoPdpStory />

            <p className="mt-4 text-center">
              <Link
                to="/dev/cosmo-arrows"
                className="text-xs text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-800"
              >
                Story arrows — drag points here, then Save (or paste paths into{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] text-neutral-700">
                  cosmoPdpStoryArrows.ts
                </code>
                )
              </Link>
            </p>

            <section className="mt-14 sm:mt-16" aria-label={cosmoYoutubeId ? "Product video" : "Video placeholder"}>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-inner">
                {cosmoYoutubeId ? (
                  <iframe
                    title="Cosmo product video"
                    src={`https://www.youtube.com/embed/${cosmoYoutubeId}?rel=0`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/35 bg-muted/30 px-6 py-12 text-center">
                    <span className="font-heading text-xl font-semibold tracking-tight text-muted-foreground">
                      Video placeholder
                    </span>
                    <span className="max-w-sm text-sm text-muted-foreground">
                      Drop in an embed when you&apos;re ready—the layout is sized for 16×9.
                    </span>
                  </div>
                )}
              </div>
            </section>
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

        {amazonReviewsBundle.reviews.length > 0 ? (
          <ProductAmazonReviews
            reviews={amazonReviewsBundle.reviews}
            amazonListingUrl={amazonReviewsBundle.amazonListingUrl}
          />
        ) : null}

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
