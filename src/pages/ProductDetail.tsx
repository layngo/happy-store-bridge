import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useParams, Link, useSearchParams, useLocation } from "react-router-dom";
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
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, ChevronRight, Home, Star } from "lucide-react";
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
import {
  Nailspa18ColorSelector,
  getNailspa18HeroImageUrls,
  getNailspa18InitialSelection,
  isNailspa18Product,
} from "@/components/Nailspa18ColorSelector";
import { NailspaPdpStory } from "@/components/NailspaPdpStory";
import { CosmoPdpStory } from "@/components/CosmoPdpStory";
import { CosmoPdpVideoGallery } from "@/components/CosmoPdpVideoGallery";
import { LayNGoLargePdpPlayStrip } from "@/components/LayNGoLargePdpPlayStrip";
import { ProductAmazonReviews } from "@/components/ProductAmazonReviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAmazonReviewsForProduct } from "@/data/productAmazonReviews";
import { isLayNGoPlayMatProduct, layNGoPlayMatSwatchStyle } from "@/lib/layNGoPlayMat";

const COSMO_MINI_CROSSMARKS_HERO = "/products/cosmo-mini-16-crossmarks-hero-v2.png";
const COSMO_MINI_CROSSMARKS_SWATCH = "/swatches/cosmo-mini-16-crossmarks-swatch.png";

const LAY_N_GO_LARGE_SLIDE_1 = "/products/lay-n-go-large-pdp/video-slide-1.png";
const LAY_N_GO_LARGE_SLIDE_2 = "/products/lay-n-go-large-pdp/video-slide-2.png";
const COSMO_AUTOPLAY_YOUTUBE_ID = "G3E80xl9lSM";
const COSMO_AMAZON_REVIEWS_URL =
  "https://www.amazon.com/Lay-n-Go-Cosmo-Cosmetic-Bag-Black/dp/B00B04V3PQ/ref=sr_1_2?crid=319SA2P59OD6R&dib=eyJ2IjoiMSJ9.yZpPmIN6c0isZ7qkwNkUWg.XsRHQlPyJ9UrcTBLmVdjiQ0rxRkojK3Ksfzjf7LjOYg&dib_tag=se&keywords=cosmo%2Blayngo&qid=1778181094&sprefix=cosmo%2Blayng%2Caps%2C106&sr=8-2&th=1#averageCustomerReviewsAnchor";
const COSMO_FAQ_ITEMS = [
  {
    question: "What sizes does the Cosmo come in?",
    answer:
      'The Cosmo comes in three sizes - the Mini (16"), the original Cosmo (20"), and the Deluxe (22") - so there is a perfect fit for every routine.',
  },
  {
    question: "How does it work?",
    answer:
      "Simply pull the drawstring cord and the bag lays completely flat, giving you full access to everything inside. When you're done, pull the cord again and it cinches shut in seconds.",
  },
  {
    question: "What can fit inside?",
    answer:
      "The Cosmo holds full-size makeup, brushes, skincare, and toiletries all at once - ideal for travelers, commuters, makeup artists, and anyone tired of digging through a messy pouch.",
  },
  {
    question: "Is it actually machine washable?",
    answer:
      "Yes - just toss it in the washing machine. It's also made from water-resistant polyester that wipes clean easily for quick cleanups between washes.",
  },
  {
    question: "Is it water resistant?",
    answer:
      "Yes, the Cosmo is made from durable water-resistant polyester fabric that stands up to everyday spills, smudges, and makeup messes.",
  },
  {
    question: "Does it have any pockets?",
    answer:
      "Yes - there is a zippered interior pocket for storing smaller items, plus elastic brush loops to keep brushes secure and in place.",
  },
  {
    question: "Is it good for travel?",
    answer:
      "Absolutely. It lays flat on any surface so your toiletries never touch a hotel counter or gym sink, and it folds flat to fit into any bag, suitcase, or carry-on.",
  },
  {
    question: "Is it a good gift?",
    answer:
      "One of the best - it is practical, stylish, and a thoughtful choice for birthdays, holidays, or any occasion. It is the kind of gift people use every single day and never want to go back from.",
  },
  {
    question: "How is it different from a regular makeup bag?",
    answer:
      "A regular bag forces you to dig. The Cosmo lays completely flat so you can see and reach everything at once, then closes in one pull - no dumping, no rummaging, no mess.",
  },
] as const;

const TRAVELER_20_BLOCKED_IMAGE_URL =
  "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/B00F1TI8T0.PT05.jpg?v=1643213779";

const COSMETIC_BAGS_V2_PATH = "/shop/cosmetic-bags-v2";

type ProductLocationState = { fromCosmeticBagsV2?: boolean };

function getOrderedImagesForProduct(product: ShopifyProduct["node"]) {
  let imgs = product.images.edges;

  if (product.handle.toLowerCase() === "lay-n-go-traveler-20") {
    imgs = imgs.filter((img) => img.node.url !== TRAVELER_20_BLOCKED_IMAGE_URL);
  }

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
  const location = useLocation();
  const fromCosmeticBagsV2 = Boolean((location.state as ProductLocationState | null)?.fromCosmeticBagsV2);
  const slug = productHandle ?? handle;

  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [related, setRelated] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cosmo20GalleryIndex, setCosmo20GalleryIndex] = useState(0);
  const [cosmo22GalleryIndex, setCosmo22GalleryIndex] = useState(0);
  const [nailspa18GalleryIndex, setNailspa18GalleryIndex] = useState(0);
  const [layNGoLargeSlideIndex, setLayNGoLargeSlideIndex] = useState(0);
  const [showStickyAddToCart, setShowStickyAddToCart] = useState(false);
  const [stickyConfirmOpen, setStickyConfirmOpen] = useState(false);
  const primaryAddToCartRef = useRef<HTMLDivElement | null>(null);
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
    setNailspa18GalleryIndex(0);
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
    if (!product || !isNailspa18Product(product.handle)) return;
    const init = getNailspa18InitialSelection(product);
    if (init) setSelectedVariantIdx(init.variantIdx);
  }, [product?.id, product?.handle]);

  useEffect(() => {
    setCosmo20GalleryIndex(0);
    setCosmo22GalleryIndex(0);
    setNailspa18GalleryIndex(0);
  }, [selectedVariantIdx]);

  const backHref = fromCosmeticBagsV2
    ? COSMETIC_BAGS_V2_PATH
    : collectionHandle
      ? `/collections/${collectionHandle}`
      : "/collections";
  const backLabel = fromCosmeticBagsV2
    ? "Back to Cosmetic Bags V2"
    : collectionHandle
      ? "Back to collection"
      : "Back to collections";

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

  const nailspa18HeroUrls = useMemo(() => {
    if (!product || !isNailspa18Product(product.handle)) return [];
    const v = product.variants.edges[selectedVariantIdx]?.node;
    const color = v?.selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
    if (!color) return [];
    return getNailspa18HeroImageUrls(color, v);
  }, [product, selectedVariantIdx]);

  /** Same chrome as Cosmo PDP (grid, typography, buy box); includes Nailspa and classic play mats (LITE, LARGE, …). */
  const isCosmoPdp = Boolean(
    product &&
      (isCosmo20Product(product.handle) ||
        isCosmo22Product(product.handle) ||
        isCosmoMini16Product(product.handle, product.title) ||
        isNailspa18Product(product.handle) ||
        isLayNGoPlayMatProduct(product.handle) ||
        product.handle.toLowerCase() === "lay-n-go-traveler-20"),
  );

  /** Editorial story strip + arrow editor — Cosmo bags only, not Nailspa. */
  const isCosmoStoryPdp = Boolean(
    product &&
      (isCosmo20Product(product.handle) ||
        isCosmo22Product(product.handle) ||
        isCosmoMini16Product(product.handle, product.title)),
  );

  const showCosmoDescriptionBelowHero = Boolean(
    product &&
      isCosmoPdp &&
      !isNailspa18Product(product.handle) &&
      !isCosmoStoryPdp &&
      Boolean(product.description?.trim()),
  );

  const [searchParams] = useSearchParams();
  const cosmoStoryArrowEditMode =
    isCosmoStoryPdp &&
    (searchParams.get("editArrows") === "1" || searchParams.get("editArrows") === "true");

  const cosmoYoutubeId = useMemo(() => {
    if (!product) return null;
    if (isCosmoStoryPdp) return COSMO_AUTOPLAY_YOUTUBE_ID;
    return extractFirstYoutubeVideoId(product.description || "");
  }, [isCosmoStoryPdp, product, product?.description]);

  const amazonReviewsBundle = useMemo(
    () => (product ? getAmazonReviewsForProduct(product.handle) : { reviews: [], amazonListingUrl: undefined }),
    [product],
  );
  const layNGoHandle = product?.handle.toLowerCase() ?? "";
  const isLayNGoLarge60 = layNGoHandle === "lay-n-go-large-60";
  const hasLayNGoLargeStoryLayout =
    layNGoHandle === "lay-n-go-large-60" ||
    layNGoHandle === "lay-n-go-lifestyle-44" ||
    layNGoHandle === "lay-n-go-lite-18" ||
    layNGoHandle === "lay-n-go-defender-mini-16" ||
    layNGoHandle.includes("wired") ||
    layNGoHandle.includes("traveler") ||
    layNGoHandle.includes("travel") ||
    layNGoHandle.includes("tech");
  const isLayNGoTraveler20 = layNGoHandle === "lay-n-go-traveler-20";
  const colorOptionName = useMemo(() => {
    if (!product) return null;
    return product.options.find((opt) => isColorOptionName(opt.name))?.name ?? null;
  }, [product]);

  const colorVariantChoices = useMemo(() => {
    if (!product || !colorOptionName) return [];
    const seen = new Set<string>();
    return product.variants.edges.flatMap((edge, idx) => {
      const rawValue = edge.node.selectedOptions.find((o) => o.name === colorOptionName)?.value ?? "";
      if (!rawValue) return [];
      const key = rawValue.trim().toLowerCase();
      if (seen.has(key)) return [];
      seen.add(key);
      return [
        {
          idx,
          node: edge.node,
          rawValue,
          displayValue: displayOptionValue(product.handle, rawValue),
        },
      ];
    });
  }, [colorOptionName, product]);

  useEffect(() => {
    setLayNGoLargeSlideIndex(0);
  }, [isLayNGoLarge60, product?.id]);

  useEffect(() => {
    if (!isLayNGoLarge60) return;
    const id = window.setInterval(() => {
      setLayNGoLargeSlideIndex((prev) => (prev + 1) % 2);
    }, 5000);
    return () => window.clearInterval(id);
  }, [isLayNGoLarge60]);

  useEffect(() => {
    if (!isCosmoStoryPdp) {
      setShowStickyAddToCart(false);
      return;
    }
    const target = primaryAddToCartRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPastPrimaryCta = entry.boundingClientRect.top < 0;
        setShowStickyAddToCart(!entry.isIntersecting && scrolledPastPrimaryCta);
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isCosmoStoryPdp, product?.id]);

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

  const handleVariantSelection = (variantIdx: number) => {
    setSelectedVariantIdx(variantIdx);
    const variant = product.variants.edges[variantIdx]?.node;
    const variantImageUrl = variant?.image?.url;
    if (variantImageUrl) {
      const imageIdx = orderedImages.findIndex((img) => img.node.url === variantImageUrl);
      if (imageIdx >= 0) setSelectedImage(imageIdx);
    } else if (variant && isCosmoMini16 && !isCosmoBlackVariant(variant)) {
      setSelectedImage(1);
    }
  };

  const mainHeroImage: ReactNode = isCosmoMini16 && selectedVariant && !isCosmoBlackVariant(selectedVariant) ? (
    <img
      src={COSMO_MINI_CROSSMARKS_HERO}
      alt={`${product.title} (CrossMarks)`}
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
  ) : isNailspa18Product(product.handle) && nailspa18HeroUrls.length > 0 ? (
    <img
      src={nailspa18HeroUrls[Math.min(nailspa18GalleryIndex, nailspa18HeroUrls.length - 1)]}
      alt={product.title}
      className="h-full w-full max-h-full object-contain"
    />
  ) : isLayNGoPlayMatProduct(product.handle) && orderedImages[selectedImage]?.node ? (
    <img
      src={orderedImages[selectedImage].node.url}
      alt={orderedImages[selectedImage].node.altText || product.title}
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
      {isNailspa18Product(product.handle) && nailspa18HeroUrls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Variant photo gallery">
          {nailspa18HeroUrls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setNailspa18GalleryIndex(i)}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center bg-muted/15 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                i === nailspa18GalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : "ring-0",
              )}
            >
              <img src={url} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}
      {!isCosmo22Product(product.handle) &&
      !isCosmo20Product(product.handle) &&
      !isNailspa18Product(product.handle) &&
      orderedImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Product photo gallery">
          {orderedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImage(i)}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isCosmoPdp
                  ? cn(
                      "bg-muted/15 focus-visible:ring-offset-white",
                      i === selectedImage ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : "ring-0",
                    )
                  : cn(
                      "flex-shrink-0 overflow-hidden rounded-md border-2",
                      i === selectedImage ? "border-primary" : "border-border",
                    ),
              )}
            >
              <img
                src={img.node.url}
                alt={img.node.altText || ""}
                className={isCosmoPdp ? "max-h-full max-w-full object-contain" : "h-full w-full object-cover"}
              />
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
        if (isNailspa18Product(product.handle) && isColorOption) {
          return (
            <Nailspa18ColorSelector
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
                const displayOptValue = displayOptionValue(product.handle, optValue || "");
                const prevSame = product.variants.edges.findIndex(
                  (pv) => pv.node.selectedOptions.find((o) => o.name === option.name)?.value === optValue,
                );
                if (prevSame !== vIdx) return null;
                const isColor = /color|colour/i.test(option.name);
                return (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => handleVariantSelection(vIdx)}
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
                          : product.handle.toLowerCase() === "lay-n-go-traveler-20"
                            ? travelerSwatchStyle(optValue || "")
                            : isLayNGoPlayMatProduct(product.handle)
                              ? layNGoPlayMatSwatchStyle(optValue || "")
                              : variantImageSwatchStyle(v.node, optValue || "")
                        : undefined
                    }
                    disabled={!v.node.availableForSale}
                    aria-label={displayOptValue}
                    title={displayOptValue}
                  >
                    {isColor ? <span className="sr-only">{displayOptValue}</span> : displayOptValue}
                  </button>
                );
              })}
            </div>
            {isColorOptionName(option.name) ? (
              <p className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">
                  {displayOptionValue(
                    product.handle,
                    selectedVariant?.selectedOptions.find((o) => o.name === option.name)?.value ?? option.values[0],
                  )}
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
      className="font-cosmo-cta w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-base font-semibold tracking-wide text-neutral-50 shadow-none hover:bg-[#1f1f1f] disabled:opacity-50"
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
          {fromCosmeticBagsV2 ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link to={COSMETIC_BAGS_V2_PATH} className="hover:text-foreground transition-colors">
                Cosmetic Bags V2
              </Link>
            </>
          ) : collectionHandle ? (
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
          <span className="text-sm">{backLabel}</span>
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
                      <p className="font-cosmo-cta mt-1 text-3xl font-semibold tabular-nums text-neutral-800 sm:text-[2.125rem]">
                        ${priceDisplay}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Quantity</label>
                      {quantityStepper}
                    </div>
                  </div>

                  <div ref={primaryAddToCartRef}>{addToCartButtonCosmo}</div>
                </div>
              </div>
            </section>

            {hasLayNGoLargeStoryLayout ? (
              <LayNGoLargePdpPlayStrip
                forceHeadlineSingleLine={isLayNGoTraveler20}
                showLowerSections={!isLayNGoTraveler20}
                showTravelerCalloutSection={isLayNGoTraveler20}
                headlineImageSrc={
                  isLayNGoTraveler20 ? "/products/lay-n-go-large-pdp/traveler-hero.png" : undefined
                }
              />
            ) : null}

            {showCosmoDescriptionBelowHero ? (
              <section className="mx-auto mt-12 max-w-3xl sm:mt-14" aria-label="Product details">
                {descHtml ? (
                  <div
                    className="space-y-3 text-sm font-medium leading-relaxed text-neutral-600 [&_a]:text-primary [&_iframe]:hidden [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-neutral-600">
                    {product.description}
                  </p>
                )}
              </section>
            ) : null}

            {isNailspa18Product(product.handle) ? <NailspaPdpStory /> : null}

            {isCosmoStoryPdp ? <CosmoPdpStory editorMode={cosmoStoryArrowEditMode} /> : null}

            <section
              className="mt-14 sm:mt-16"
              aria-label={isLayNGoLarge60 ? "Product image showcase" : cosmoYoutubeId ? "Product video" : "Video placeholder"}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl",
                  isLayNGoLarge60
                    ? "border-0 bg-white pt-[56.34%] shadow-none"
                    : "border border-border bg-muted/40 shadow-inner aspect-video",
                )}
              >
                {isLayNGoLarge60 ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="flex h-full w-[200%] transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${layNGoLargeSlideIndex * 50}%)` }}
                    >
                      <img
                        src={LAY_N_GO_LARGE_SLIDE_1}
                        alt="Lay-n-Go Large blue play mat spread out with family and blocks"
                        className="h-full w-1/2 shrink-0 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src={LAY_N_GO_LARGE_SLIDE_2}
                        alt="Lay-n-Go Large green play mat in living room with kids and building blocks"
                        className="h-full w-1/2 shrink-0 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ) : cosmoYoutubeId ? (
                  <iframe
                    title="Product video"
                    src={`https://www.youtube.com/embed/${cosmoYoutubeId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${cosmoYoutubeId}&rel=0`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/35 bg-muted/30 px-6 py-12 text-center">
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

            {isCosmoStoryPdp ? <CosmoPdpVideoGallery /> : null}

            {isCosmoStoryPdp ? (
              <section className="mx-auto mt-14 w-full max-w-4xl sm:mt-16" aria-label="Cosmo FAQ">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Cosmo FAQ</h2>
                <Accordion type="single" collapsible className="mt-5 rounded-2xl border border-border bg-white px-4 sm:px-6">
                  {COSMO_FAQ_ITEMS.map((item, idx) => (
                    <AccordionItem key={item.question} value={`cosmo-faq-${idx}`}>
                      <AccordionTrigger className="text-left text-[0.95rem] font-semibold text-foreground hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null}

            {isCosmoStoryPdp ? (
              <section className="mx-auto mt-8 w-full max-w-4xl sm:mt-10" aria-label="Cosmo ratings">
                <div className="px-5 py-2 text-center sm:px-7">
                  <div className="mx-auto mb-3 flex items-center justify-center gap-1.5" aria-label="4.5 out of 5 stars">
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <span className="relative block h-5 w-5 sm:h-6 sm:w-6" aria-hidden>
                      <Star className="h-full w-full fill-[#c7c9cf] stroke-none" />
                      <Star className="absolute inset-0 h-full w-full fill-[#f4b400] stroke-none [clip-path:inset(0_50%_0_0)]" />
                    </span>
                  </div>
                  <p className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">4.5 out of 5</p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                    14,817 global ratings
                  </p>
                  <a
                    href={COSMO_AMAZON_REVIEWS_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline sm:text-base"
                  >
                    See reviews
                  </a>
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

        {!isCosmoStoryPdp && amazonReviewsBundle.reviews.length > 0 ? (
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

      {isCosmoStoryPdp && showStickyAddToCart ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <Button
            size="lg"
            onClick={() => setStickyConfirmOpen(true)}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="pointer-events-auto font-cosmo-cta w-full max-w-sm rounded-md border border-neutral-700 bg-[#2c2c2c] text-base font-semibold tracking-wide text-neutral-50 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.45)] hover:bg-[#1f1f1f] disabled:opacity-50"
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
        </div>
      ) : null}

      <Dialog open={stickyConfirmOpen} onOpenChange={setStickyConfirmOpen}>
        <DialogContent className="w-[min(92vw,32rem)] rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-heading text-xl font-bold text-foreground">Confirm your color</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Selected color:{" "}
              <span className="font-semibold text-foreground">
                {displayOptionValue(
                  product.handle,
                  selectedVariant?.selectedOptions.find((o) => isColorOptionName(o.name))?.value ?? selectedVariant?.title ?? "",
                )}
              </span>
            </DialogDescription>
          </DialogHeader>

          {colorVariantChoices.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Edit color</p>
              <div className="flex flex-wrap gap-2">
                {colorVariantChoices.map((choice) => (
                  <button
                    key={`${choice.rawValue}-${choice.idx}`}
                    type="button"
                    onClick={() => handleVariantSelection(choice.idx)}
                    className={cn(
                      "h-9 w-9 rounded-full border border-foreground/25 bg-cover bg-center bg-no-repeat transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      choice.idx === selectedVariantIdx ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "",
                      !choice.node.availableForSale ? "line-through opacity-40" : "",
                    )}
                    style={isCosmoMini16 ? cosmoMiniSwatchStyle(choice.node) : variantImageSwatchStyle(choice.node, choice.rawValue)}
                    disabled={!choice.node.availableForSale}
                    aria-label={choice.displayValue}
                    title={choice.displayValue}
                  >
                    <span className="sr-only">{choice.displayValue}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setStickyConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await handleAddToCart();
                setStickyConfirmOpen(false);
              }}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="font-cosmo-cta border border-neutral-700 bg-[#2c2c2c] text-neutral-50 hover:bg-[#1f1f1f]"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

function travelerSwatchStyle(optionValue: string): CSSProperties {
  const key = optionValue.trim().toLowerCase();
  if (key.includes("black")) return { backgroundColor: "#1a1a1a" };
  return { backgroundColor: "#6f6f6f" };
}

function displayOptionValue(handle: string, rawValue: string): string {
  const value = rawValue.trim();
  const h = handle.toLowerCase();
  const isCosmoMini16 = h.includes("cosmo") && h.includes("mini") && h.includes("16");
  if (isCosmoMini16 && value.toLowerCase() === "crossmarks") {
    return "CrossMarks";
  }
  return value;
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
