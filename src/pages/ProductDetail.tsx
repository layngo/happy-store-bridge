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
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, ChevronLeft, ChevronRight, Home, Star } from "lucide-react";
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
import { NailspaPdpHeroVideo } from "@/components/NailspaPdpHeroVideo";
import { NailspaPdpStory } from "@/components/NailspaPdpStory";
import { CosmoPdpStory } from "@/components/CosmoPdpStory";
import { CosmoPdpVideoGallery } from "@/components/CosmoPdpVideoGallery";
import { NailspaPdpLifestyleGallery } from "@/components/NailspaPdpLifestyleGallery";
import { LayNGoLargePdpPlayStrip } from "@/components/LayNGoLargePdpPlayStrip";
import { LayNGoTravelDogBedPdpStrip } from "@/components/LayNGoTravelDogBedPdpStrip";
import { ProductAmazonReviews } from "@/components/ProductAmazonReviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAmazonReviewsForProduct } from "@/data/productAmazonReviews";
import { isLayNGoPlayMatProduct, layNGoPlayMatSwatchStyle } from "@/lib/layNGoPlayMat";
import { MILITARY_FIRST_RESPONDER_PATH } from "@/pages/MilitaryFirstResponder";

const COSMETIC_BAGS_V2_PATH = "/shop/cosmetic-bags-v2";

type ProductLocationState = {
  fromCosmeticBagsV2?: boolean;
  fromMilitaryFirstResponder?: boolean;
};

const COSMO_MINI_CROSSMARKS_HERO = "/products/cosmo-mini-16-crossmarks-hero-v2.png";
const COSMO_MINI_CROSSMARKS_SWATCH = "/swatches/cosmo-mini-16-crossmarks-swatch.png";

const LAY_N_GO_LARGE_SLIDE_1 = "/products/lay-n-go-large-pdp/video-slide-1.png";
const LAY_N_GO_LARGE_SLIDE_2 = "/products/lay-n-go-large-pdp/video-slide-2.png";

const LAY_N_GO_LARGE_60_GALLERY_SLIDES = [
  {
    src: LAY_N_GO_LARGE_SLIDE_1,
    alt: "Lay-n-Go Large blue play mat spread out with family and blocks",
  },
  {
    src: LAY_N_GO_LARGE_SLIDE_2,
    alt: "Lay-n-Go Large green play mat in living room with kids and building blocks",
  },
  {
    src: "/products/lay-n-go-large-pdp/large-gallery-3.png",
    alt: "Lay-n-Go Large navy bag cinched shut, worn on the back with a child at a front door",
  },
  {
    src: "/products/lay-n-go-large-pdp/large-gallery-4.png",
    alt: "Lay-n-Go Large navy bag cinched closed and hanging from a door handle",
  },
] as const;

const LAY_N_GO_LIFESTYLE_44_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-lifestyle-44/lifestyle-gallery-1.png",
    alt: "Lay-n-Go Lifestyle mat on a dock by a lake with children playing with building bricks",
  },
  {
    src: "/products/lay-n-go-lifestyle-44/lifestyle-gallery-2.png",
    alt: "Lay-n-Go Lifestyle mat by a pool with children playing with building bricks",
  },
  {
    src: "/products/lay-n-go-lifestyle-44/lifestyle-gallery-3.png",
    alt: "Lay-n-Go Lifestyle backpack cinched closed, worn at the lake",
  },
] as const;

const LAY_N_GO_LITE_18_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-1.png",
    alt: "Lay-n-Go Lite bags cinched closed with embroidered logo in warm sunlight",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-2.png",
    alt: "Children playing with small toys on a blue Lay-n-Go Lite mat at the beach",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-3.png",
    alt: "Green Lay-n-Go Lite mat with checkered rim on a table filled with LEGO bricks",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-4.png",
    alt: "Pink Lay-n-Go Lite mat with checkered exterior on a table with small toys",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-5.png",
    alt: "Two children playing UNO on a blue Lay-n-Go Lite mat at a wooden table",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-6.png",
    alt: "Child building with LEGO pieces on a blue Lay-n-Go Lite mat on a wooden table",
  },
  {
    src: "/products/lay-n-go-lite-18/lite-gallery-7.png",
    alt: "Two children playing with LEGO on a pink-and-blue Lay-n-Go Lite at a kitchen counter",
  },
] as const;

const LAY_N_GO_TRAVELER_20_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-traveler-20/traveler-gallery-1.png",
    alt: "Lay-n-Go Traveler black and gray kits on white: one laid flat with toiletries, one cinched closed behind",
  },
  {
    src: "/products/lay-n-go-traveler-20/traveler-gallery-4.png",
    alt: "Lay-n-Go Traveler black and gray kits on white, alternate studio product view",
  },
] as const;

const LAY_N_GO_TRAVEL_DOG_BED_44_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-travel-dog-bed-44/gallery-1.png",
    alt: "Two dogs resting on Lay-n-Go quilted pet mats on a lawn in front of a white house",
  },
  {
    src: "/products/lay-n-go-travel-dog-bed-44/gallery-2.png",
    alt: "Small dog sitting on a brown and red Lay-n-Go pet mat at home with plush toys",
  },
  {
    src: "/products/lay-n-go-travel-dog-bed-44/gallery-3.png",
    alt: "Dog on a Lay-n-Go mat draped over a car back seat with red straps on the headrest",
  },
] as const;

const LAY_N_GO_LARGE_60_BULLETS = [
  `Lay-n-Go Large 60" diameter activity play mat with patented raised lip to keep LEGOs and small toys contained`,
  "Play for hours, clean up in seconds — just pull the drawstring and it closes completely",
  "4 mesh pockets for storing special pieces",
  "Wide strap for easy carrying, hanging, and storage",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_LIFESTYLE_44_BULLETS = [
  `44" diameter backpack activity play mat with patented raised lip to keep toys contained`,
  "Play for hours, clean up in seconds — just pull the drawstring and it cinches completely closed",
  "Convenient backpack straps plus an extra handle for carrying, hanging, or storing",
  "4 mesh velcroed interior pockets for storing special pieces",
  "Additional purple inner rip-stop liner",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_LITE_18_BULLETS = [
  `18" diameter personal activity play mat — compact enough to take anywhere`,
  "Perfect for airplanes, car rides, restaurants, or any on-the-go adventure",
  "Patented raised lip keeps LEGOs and small pieces contained on the mat",
  "Pull the drawstring and it cinches completely closed for storage and travel",
  "Convenient handle for easy carrying",
  "Reversible play mat color",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_TRAVELER_20_BULLETS = [
  `20" diameter men's Dopp Kit that lays completely flat for full access to all your toiletries`,
  "No more digging through a traditional kit or putting your toothbrush on a hotel counter",
  "Patented raised lip keeps everything contained on a clean, dry surface — at home, on the road, or at the gym",
  "Zippered interior pocket for storing smaller items",
  "Pull the drawstring and it cinches back into a completely sealed, handled pack",
  "Machine washable",
  "4-in-1: use, cleanup, store, and go",
  "Accessories not included",
] as const;

const LAY_N_GO_DEFENDER_MINI_16_BULLETS = [
  `Compact 16" design converts from an open organizing mat into a fully sealed carrying bag in seconds`,
  "Patented design lays completely flat with a raised edge to contain all contents",
  "Built-in interior pockets keep personal essentials organized and easy to access",
  "Clean, dry work surface lets you see and reach all items at once",
  "External drawstring pocket with Velcro® patch ready",
  "Cord lock closure and carrying handle for secure, easy transport",
  "Washable and durable textiles designed for heavy duty activity",
  "Designed specifically to support Warfighters packing personal essentials for deployment",
] as const;

const LAY_N_GO_DEFENDER_TACTICAL_20_BULLETS = [
  `Compact 20" design converts from an open organizing mat into a fully sealed carrying bag in seconds`,
  "Patented design lays completely flat with a raised edge to contain all contents",
  "Built-in interior pockets keep personal essentials organized and easy to access",
  "Clean, dry work surface lets you see and reach all items at once",
  "External drawstring pocket with Velcro® patch ready",
  "Cord lock closure and carrying handle for secure, easy transport",
  "Washable and durable textiles designed for heavy duty activity",
  "Designed specifically to support Warfighters packing personal essentials for deployment",
] as const;

const LAY_N_GO_TRAVEL_DOG_BED_44_BULLETS = [
  "Converts from a cozy dog bed into a portable carrying bag in seconds",
  `Large 44" quilted mat with soft fleece lining for added comfort`,
  "Machine washable for easy cleaning and everyday use",
  "Great for home, car seats, couches, travel, vacations, and outdoor dining",
  "Protects furniture and car interiors from dirt, fur, and scratches",
  "Built-in storage carries bowls, food, toys, treats, and essentials",
  "Oversized zippered pocket fits a retractable leash, phone, keys, and more",
  "Lightweight and easy to transport wherever your dog goes",
  "Durable design made for everyday adventures with your pet",
  "Smart all-in-one dog bed and travel bag solution",
] as const;

const COSMO_AUTOPLAY_YOUTUBE_ID = "G3E80xl9lSM";
const COSMO_AMAZON_REVIEWS_URL =
  "https://www.amazon.com/Lay-n-Go-Cosmo-Cosmetic-Bag-Black/dp/B00B04V3PQ/ref=sr_1_2?crid=319SA2P59OD6R&dib=eyJ2IjoiMSJ9.yZpPmIN6c0isZ7qkwNkUWg.XsRHQlPyJ9UrcTBLmVdjiQ0rxRkojK3Ksfzjf7LjOYg&dib_tag=se&keywords=cosmo%2Blayngo&qid=1778181094&sprefix=cosmo%2Blayng%2Caps%2C106&sr=8-2&th=1#averageCustomerReviewsAnchor";
const NAILSPA_AMAZON_REVIEWS_URL =
  "https://www.amazon.com/Lay-n-Go-NailSpa-Manicure-Pedicure-Pattern/dp/B082M13J4H#averageCustomerReviewsAnchor";
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

const NAILSPA_FAQ_ITEMS = [
  {
    question: "What is the NAILSPA?",
    answer:
      'The NAILSPA is an 18" lay-flat manicure mat and organizer: spread it on a counter for a clean workspace, then cinch the drawstring to pack polish, tools, and accessories in one portable bundle.',
  },
  {
    question: "How does it work?",
    answer:
      "Open the drawstring so the mat lies flat. Mesh pockets and elastic keep bottles and tools visible and upright while you work. When you are finished, pull the cord to gather everything closed—no more bottles rolling off the towel.",
  },
  {
    question: "What can fit inside?",
    answer:
      "Typical manicure kits: multiple polish bottles, files, buffers, clippers, small jars, and brushes. The 18\" size is sized for home vanities and travel bathrooms alike.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes—follow care instructions on the product label. Between washes, the water-resistant fabric wipes clean for polish smudges and spills.",
  },
  {
    question: "Is it good for travel?",
    answer:
      "Yes. It gives you a dedicated clean surface away from hotel counters, then cinches into a compact bundle that fits in a tote or suitcase.",
  },
  {
    question: "How is it different from a zippered pouch?",
    answer:
      "A zip pouch hides everything in a pile. The NAILSPA stays open and flat so you see every item at once, with pockets that keep polish from tipping—then closes in seconds when you are done.",
  },
] as const;

/** Shopify “PT##” art for Traveler — feature/sizing/travel diagrams, not product photography. */
function isLayNGoTraveler20InfographicImageUrl(url: string): boolean {
  return /B00F1TI8T0\.PT\d+/i.test(url);
}

function getOrderedImagesForProduct(product: ShopifyProduct["node"]) {
  let imgs = product.images.edges;

  if (product.handle.toLowerCase() === "lay-n-go-traveler-20") {
    imgs = imgs.filter((img) => !isLayNGoTraveler20InfographicImageUrl(img.node.url));
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
  const fromMilitaryFirstResponder = Boolean(
    (location.state as ProductLocationState | null)?.fromMilitaryFirstResponder,
  );
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
  const [layNGoLifestyle44SlideIndex, setLayNGoLifestyle44SlideIndex] = useState(0);
  const [layNGoLite18SlideIndex, setLayNGoLite18SlideIndex] = useState(0);
  const [layNGoTraveler20SlideIndex, setLayNGoTraveler20SlideIndex] = useState(0);
  const [layNGoTravelDogBed44SlideIndex, setLayNGoTravelDogBed44SlideIndex] = useState(0);
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
    if (!product || product.handle.toLowerCase() !== "lay-n-go-lite-18") return;
    const colorName = product.options.find((opt) => isColorOptionName(opt.name))?.name;
    if (!colorName) return;
    const greenIdx = product.variants.edges.findIndex((edge) => {
      const val = edge.node.selectedOptions.find((o) => o.name === colorName)?.value ?? "";
      return /\bgreen\b/i.test(val.trim().toLowerCase());
    });
    if (greenIdx < 0) return;
    setSelectedVariantIdx(greenIdx);
    const variant = product.variants.edges[greenIdx]?.node;
    const variantImageUrl = variant?.image?.url;
    if (variantImageUrl) {
      const imgs = getOrderedImagesForProduct(product);
      const imageIdx = imgs.findIndex((img) => img.node.url === variantImageUrl);
      if (imageIdx >= 0) setSelectedImage(imageIdx);
    }
  }, [product?.id, product?.handle]);

  useEffect(() => {
    setCosmo20GalleryIndex(0);
    setCosmo22GalleryIndex(0);
    setNailspa18GalleryIndex(0);
  }, [selectedVariantIdx]);

  const backHref = fromCosmeticBagsV2
    ? COSMETIC_BAGS_V2_PATH
    : fromMilitaryFirstResponder
      ? MILITARY_FIRST_RESPONDER_PATH
      : collectionHandle
        ? `/collections/${collectionHandle}`
        : "/collections";
  const backLabel = fromCosmeticBagsV2
    ? "Back to Cosmetic Bags V2"
    : fromMilitaryFirstResponder
      ? "Back to Outdoor / Tactical"
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
        product.handle.toLowerCase() === "lay-n-go-traveler-20" ||
        product.handle.toLowerCase() === "lay-n-go-travel-dog-bed-44"),
  );

  /** Editorial story strip + arrow editor — Cosmo bags only, not Nailspa. */
  const isCosmoStoryPdp = Boolean(
    product &&
      (isCosmo20Product(product.handle) ||
        isCosmo22Product(product.handle) ||
        isCosmoMini16Product(product.handle, product.title)),
  );

  const isNailspaPdp = Boolean(product && isNailspa18Product(product.handle));
  /** Bottom gallery, FAQ, ratings summary, sticky cart — Cosmo story PDPs and NAILSPA. */
  const showCosmoStyleBottomExtras = isCosmoStoryPdp || isNailspaPdp;

  const showCosmoDescriptionBelowHero = Boolean(
    product &&
      isCosmoPdp &&
      !isNailspa18Product(product.handle) &&
      !isCosmoStoryPdp &&
      product.handle.toLowerCase() !== "lay-n-go-large-60" &&
      product.handle.toLowerCase() !== "lay-n-go-lifestyle-44" &&
      product.handle.toLowerCase() !== "lay-n-go-lite-18" &&
      product.handle.toLowerCase() !== "lay-n-go-traveler-20" &&
      product.handle.toLowerCase() !== "lay-n-go-travel-dog-bed-44" &&
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
  const isLayNGoLifestyle44 = layNGoHandle === "lay-n-go-lifestyle-44";
  const isLayNGoLite18 = layNGoHandle === "lay-n-go-lite-18";
  const hasLayNGoLargeStoryLayout =
    layNGoHandle === "lay-n-go-large-60" ||
    layNGoHandle === "lay-n-go-lifestyle-44" ||
    layNGoHandle === "lay-n-go-lite-18" ||
    layNGoHandle === "lay-n-go-defender-mini-16" ||
    layNGoHandle === "lay-n-go-tactical-bag-20" ||
    layNGoHandle.includes("wired") ||
    layNGoHandle.includes("traveler") ||
    layNGoHandle.includes("tech");
  const isLayNGoTraveler20 = layNGoHandle === "lay-n-go-traveler-20";
  const isLayNGoTravelDogBed44 = layNGoHandle === "lay-n-go-travel-dog-bed-44";
  const isLayNGoDefenderMini16 = layNGoHandle === "lay-n-go-defender-mini-16";
  const isLayNGoDefenderTactical20 = layNGoHandle === "lay-n-go-tactical-bag-20";
  const isLayNGoDefender = isLayNGoDefenderMini16 || isLayNGoDefenderTactical20;
  const colorOptionName = useMemo(() => {
    if (!product) return null;
    return product.options.find((opt) => isColorOptionName(opt.name))?.name ?? null;
  }, [product]);

  const colorVariantChoices = useMemo(() => {
    if (!product || !colorOptionName) return [];
    const seen = new Set<string>();
    const choices = product.variants.edges.flatMap((edge, idx) => {
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
    if (product.handle.toLowerCase() === "lay-n-go-lite-18") {
      return [...choices].sort((a, b) => {
        const ag = /\bgreen\b/i.test(a.rawValue.trim());
        const bg = /\bgreen\b/i.test(b.rawValue.trim());
        if (ag !== bg) return ag ? -1 : 1;
        return 0;
      });
    }
    return choices;
  }, [colorOptionName, product]);

  useEffect(() => {
    setLayNGoLargeSlideIndex(0);
  }, [isLayNGoLarge60, product?.id]);

  useEffect(() => {
    setLayNGoLifestyle44SlideIndex(0);
  }, [isLayNGoLifestyle44, product?.id]);

  useEffect(() => {
    setLayNGoLite18SlideIndex(0);
  }, [isLayNGoLite18, product?.id]);

  useEffect(() => {
    setLayNGoTraveler20SlideIndex(0);
  }, [isLayNGoTraveler20, product?.id]);

  useEffect(() => {
    setLayNGoTravelDogBed44SlideIndex(0);
  }, [isLayNGoTravelDogBed44, product?.id]);

  useEffect(() => {
    if (!product) return;
    const h = product.handle.toLowerCase();
    if (
      h !== "lay-n-go-large-60" &&
      h !== "lay-n-go-lifestyle-44" &&
      h !== "lay-n-go-lite-18" &&
      h !== "lay-n-go-traveler-20" &&
      h !== "lay-n-go-travel-dog-bed-44"
    )
      return;
    const slides =
      h === "lay-n-go-large-60"
        ? LAY_N_GO_LARGE_60_GALLERY_SLIDES
        : h === "lay-n-go-lifestyle-44"
          ? LAY_N_GO_LIFESTYLE_44_GALLERY_SLIDES
          : h === "lay-n-go-lite-18"
            ? LAY_N_GO_LITE_18_GALLERY_SLIDES
            : h === "lay-n-go-traveler-20"
              ? LAY_N_GO_TRAVELER_20_GALLERY_SLIDES
              : LAY_N_GO_TRAVEL_DOG_BED_44_GALLERY_SLIDES;
    const origin = window.location.origin;
    const links: HTMLLinkElement[] = [];
    for (const slide of slides) {
      const href = slide.src.startsWith("/") ? `${origin}${slide.src}` : slide.src;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    }
    return () => {
      links.forEach((el) => el.remove());
    };
  }, [product?.id, product?.handle]);

  useEffect(() => {
    setShowStickyAddToCart(false);
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
  }, [product?.id, isCosmoPdp]);

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
  const layNGoHeroGallery = isLayNGoLarge60
    ? {
        slides: [...LAY_N_GO_LARGE_60_GALLERY_SLIDES],
        slideIndex: layNGoLargeSlideIndex,
        setSlideIndex: setLayNGoLargeSlideIndex,
        galleryAriaLabel: "Lay-n-Go Large lifestyle photos",
      }
    : isLayNGoLifestyle44
      ? {
          slides: [...LAY_N_GO_LIFESTYLE_44_GALLERY_SLIDES],
          slideIndex: layNGoLifestyle44SlideIndex,
          setSlideIndex: setLayNGoLifestyle44SlideIndex,
          galleryAriaLabel: "Lay-n-Go Lifestyle photos",
        }
      : isLayNGoLite18
        ? {
            slides: [...LAY_N_GO_LITE_18_GALLERY_SLIDES],
            slideIndex: layNGoLite18SlideIndex,
            setSlideIndex: setLayNGoLite18SlideIndex,
            galleryAriaLabel: "Lay-n-Go Lite lifestyle photos",
          }
        : isLayNGoTraveler20
          ? {
              slides: [...LAY_N_GO_TRAVELER_20_GALLERY_SLIDES],
              slideIndex: layNGoTraveler20SlideIndex,
              setSlideIndex: setLayNGoTraveler20SlideIndex,
              galleryAriaLabel: "Lay-n-Go Traveler product photos",
            }
          : isLayNGoTravelDogBed44
            ? {
                slides: [...LAY_N_GO_TRAVEL_DOG_BED_44_GALLERY_SLIDES],
                slideIndex: layNGoTravelDogBed44SlideIndex,
                setSlideIndex: setLayNGoTravelDogBed44SlideIndex,
                galleryAriaLabel: "Lay-n-Go Travel Dog Bed lifestyle photos",
              }
            : null;
  const layNGoGalleryArrowBtnClassName =
    "h-10 w-10 shrink-0 self-center rounded-full border-0 bg-black text-white hover:bg-neutral-900 hover:text-white focus-visible:ring-white/40 sm:h-11 sm:w-11";
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
      className={cn(
        "h-full w-full max-h-full object-contain",
        isLayNGoLarge60 &&
          "max-md:h-auto max-md:max-h-[min(62vmin,410px)] max-md:w-full max-md:min-w-0 max-md:max-w-full max-md:object-contain",
      )}
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
      !(isLayNGoLarge60 || isLayNGoLifestyle44 || isLayNGoLite18 || isLayNGoTraveler20 || isLayNGoTravelDogBed44) &&
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
                            : product.handle.toLowerCase() === "lay-n-go-travel-dog-bed-44"
                              ? dogBedSwatchStyle(optValue || "")
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
        aria-label="Decrease quantity"
        className="border-neutral-300 text-neutral-800 hover:bg-neutral-100"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        <Minus className="h-4 w-4" aria-hidden />
      </Button>
      <span className="w-10 text-center text-lg font-medium tabular-nums text-neutral-900 sm:w-12" aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase quantity"
        className="border-neutral-300 text-neutral-800 hover:bg-neutral-100"
        onClick={() => setQuantity(quantity + 1)}
      >
        <Plus className="h-4 w-4" aria-hidden />
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
      <div ref={primaryAddToCartRef}>{addToCartButton}</div>
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
          ) : fromMilitaryFirstResponder ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link to={MILITARY_FIRST_RESPONDER_PATH} className="hover:text-foreground transition-colors">
                Outdoor / Tactical
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

            <section className="-mx-4 overflow-x-hidden bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:py-10">
              <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12">
                <div className="min-w-0 space-y-4">
                  <div
                    className={cn(
                      "relative flex aspect-square w-full min-w-0 items-center justify-center overflow-hidden bg-white lg:mx-auto lg:max-h-[min(92vh,920px)]",
                      isLayNGoLarge60 &&
                        "max-md:aspect-auto max-md:max-h-[min(62vmin,430px)] max-md:min-h-[200px] max-md:py-2",
                    )}
                  >
                    {mainHeroImage}
                  </div>
                  {heroThumbnails}
                </div>

                <div className="flex flex-col gap-6 px-0 py-0">
                  {!isLayNGoDefender ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Choose colors</p>
                      <div className="mt-3">{optionPickersOnly}</div>
                    </div>
                  ) : null}

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
                  {isLayNGoLarge60 ||
                  isLayNGoLifestyle44 ||
                  isLayNGoLite18 ||
                  isLayNGoTraveler20 ||
                  isLayNGoTravelDogBed44 ||
                  isLayNGoDefenderMini16 ||
                  isLayNGoDefenderTactical20 ? (
                    <ul
                      className="mt-5 list-disc space-y-2.5 pl-5 text-left text-sm font-medium leading-relaxed text-neutral-700 marker:text-neutral-900"
                      aria-label={
                        isLayNGoTraveler20
                          ? "Lay-n-Go Traveler highlights"
                          : isLayNGoTravelDogBed44
                            ? "Lay-n-Go Travel Dog Bed highlights"
                            : isLayNGoDefenderMini16
                              ? "Lay-n-Go DEFENDER mini highlights"
                              : isLayNGoDefenderTactical20
                                ? "Lay-n-Go DEFENDER Tactical highlights"
                                : isLayNGoLarge60
                                  ? "Lay-n-Go Large highlights"
                                  : isLayNGoLifestyle44
                                    ? "Lay-n-Go Lifestyle highlights"
                                    : "Lay-n-Go Lite highlights"
                      }
                    >
                      {(isLayNGoTraveler20
                        ? LAY_N_GO_TRAVELER_20_BULLETS
                        : isLayNGoTravelDogBed44
                          ? LAY_N_GO_TRAVEL_DOG_BED_44_BULLETS
                          : isLayNGoDefenderMini16
                            ? LAY_N_GO_DEFENDER_MINI_16_BULLETS
                            : isLayNGoDefenderTactical20
                              ? LAY_N_GO_DEFENDER_TACTICAL_20_BULLETS
                              : isLayNGoLarge60
                                ? LAY_N_GO_LARGE_60_BULLETS
                                : isLayNGoLifestyle44
                                  ? LAY_N_GO_LIFESTYLE_44_BULLETS
                                  : LAY_N_GO_LITE_18_BULLETS
                      ).map((line) => (
                        <li key={line} className="pl-0.5">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>

            {hasLayNGoLargeStoryLayout ? (
              <LayNGoLargePdpPlayStrip
                headline={
                  isLayNGoDefenderMini16 || isLayNGoDefenderTactical20 ? "Mission-Ready in Seconds" : undefined
                }
                forceHeadlineSingleLine={isLayNGoTraveler20 || isLayNGoDefenderMini16 || isLayNGoDefenderTactical20}
                showLowerSections={!isLayNGoTraveler20}
                showTravelerCalloutSection={isLayNGoTraveler20}
                headlineImageSrc={
                  isLayNGoTraveler20
                    ? "/products/lay-n-go-large-pdp/traveler-hero.png"
                    : isLayNGoLifestyle44
                      ? "/products/lay-n-go-lifestyle-44/play-strip-headline.png"
                      : undefined
                }
                calloutVariant={
                  isLayNGoLifestyle44 ? "lifestyle-44" : isLayNGoLite18 ? "lite-18" : "large-60"
                }
              />
            ) : null}

            {isLayNGoTravelDogBed44 ? <LayNGoTravelDogBedPdpStrip /> : null}

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
              aria-label={
                layNGoHeroGallery
                  ? "Product image showcase"
                  : isNailspa18Product(product.handle)
                    ? "NAILSPA product video"
                    : cosmoYoutubeId
                      ? "Product video"
                      : "Video placeholder"
              }
            >
              <div
                className={cn(
                  "w-full",
                  isNailspa18Product(product.handle) && "mx-auto md:max-w-[60%] md:shrink-0",
                )}
              >
                {layNGoHeroGallery ? (
                  <div className="mx-auto w-full max-w-full md:w-[80%]">
                    <div
                      className="flex flex-col gap-3 rounded-2xl bg-white p-2 shadow-sm sm:gap-3 sm:p-3 md:flex-row md:items-stretch"
                      aria-roledescription="carousel"
                      aria-label={layNGoHeroGallery.galleryAriaLabel}
                    >
                      <span className="sr-only" aria-live="polite">
                        Photo {layNGoHeroGallery.slideIndex + 1} of {layNGoHeroGallery.slides.length}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={cn(layNGoGalleryArrowBtnClassName, "hidden md:inline-flex")}
                        onClick={() =>
                          layNGoHeroGallery.setSlideIndex(
                            (prev) =>
                              (prev - 1 + layNGoHeroGallery.slides.length) % layNGoHeroGallery.slides.length,
                          )
                        }
                        aria-label="Show previous photo"
                      >
                        <ChevronLeft className="h-5 w-5 shrink-0 text-white" aria-hidden />
                      </Button>
                      <div className="relative min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-xl bg-white pt-[56.34%]">
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            className="flex h-full transition-transform duration-700 ease-in-out"
                            style={{
                              width: `${layNGoHeroGallery.slides.length * 100}%`,
                              transform: `translateX(-${(layNGoHeroGallery.slideIndex * 100) / layNGoHeroGallery.slides.length}%)`,
                            }}
                          >
                            {layNGoHeroGallery.slides.map((slide, slideIdx) => (
                              <img
                                key={slide.src}
                                src={slide.src}
                                alt={slide.alt}
                                className="h-full shrink-0 object-contain"
                                style={{ width: `${100 / layNGoHeroGallery.slides.length}%` }}
                                loading="eager"
                                decoding="async"
                                fetchPriority={slideIdx === 0 ? "high" : "low"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={cn(layNGoGalleryArrowBtnClassName, "hidden md:inline-flex")}
                        onClick={() =>
                          layNGoHeroGallery.setSlideIndex((prev) => (prev + 1) % layNGoHeroGallery.slides.length)
                        }
                        aria-label="Show next photo"
                      >
                        <ChevronRight className="h-5 w-5 shrink-0 text-white" aria-hidden />
                      </Button>
                      <div className="flex justify-center gap-6 md:hidden">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={layNGoGalleryArrowBtnClassName}
                          onClick={() =>
                            layNGoHeroGallery.setSlideIndex(
                              (prev) =>
                                (prev - 1 + layNGoHeroGallery.slides.length) % layNGoHeroGallery.slides.length,
                            )
                          }
                          aria-label="Show previous photo"
                        >
                          <ChevronLeft className="h-5 w-5 shrink-0 text-white" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={layNGoGalleryArrowBtnClassName}
                          onClick={() =>
                            layNGoHeroGallery.setSlideIndex((prev) => (prev + 1) % layNGoHeroGallery.slides.length)
                          }
                          aria-label="Show next photo"
                        >
                          <ChevronRight className="h-5 w-5 shrink-0 text-white" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-inner aspect-video",
                    )}
                  >
                    {isNailspa18Product(product.handle) ? (
                      <NailspaPdpHeroVideo variant="bottom" />
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
                )}
              </div>
            </section>

            {showCosmoStyleBottomExtras ? (
              isCosmoStoryPdp ? (
                <CosmoPdpVideoGallery />
              ) : (
                <NailspaPdpLifestyleGallery />
              )
            ) : null}

            {showCosmoStyleBottomExtras ? (
              <section
                className="mx-auto mt-14 w-full max-w-4xl sm:mt-16"
                aria-label={isNailspaPdp ? "Nailspa FAQ" : "Cosmo FAQ"}
              >
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {isNailspaPdp ? "Nailspa FAQ" : "Cosmo FAQ"}
                </h2>
                <Accordion type="single" collapsible className="mt-5 rounded-2xl border border-border bg-white px-4 sm:px-6">
                  {(isNailspaPdp ? NAILSPA_FAQ_ITEMS : COSMO_FAQ_ITEMS).map((item, idx) => (
                    <AccordionItem
                      key={item.question}
                      value={isNailspaPdp ? `nailspa-faq-${idx}` : `cosmo-faq-${idx}`}
                    >
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

            {showCosmoStyleBottomExtras ? (
              <section
                className="mx-auto mt-8 w-full max-w-4xl sm:mt-10"
                aria-label={isNailspaPdp ? "Nailspa ratings" : "Cosmo ratings"}
              >
                <div className="px-5 py-2 text-center sm:px-7">
                  <div
                    className="mx-auto mb-3 flex items-center justify-center gap-1.5"
                    aria-label={isNailspaPdp ? "4.2 out of 5 stars" : "4.5 out of 5 stars"}
                  >
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <Star className="h-5 w-5 fill-[#f4b400] stroke-none sm:h-6 sm:w-6" aria-hidden />
                    <span className="relative block h-5 w-5 sm:h-6 sm:w-6" aria-hidden>
                      <Star className="h-full w-full fill-[#c7c9cf] stroke-none" />
                      <Star
                        className={cn(
                          "absolute inset-0 h-full w-full fill-[#f4b400] stroke-none",
                          isNailspaPdp ? "[clip-path:inset(0_68%_0_0)]" : "[clip-path:inset(0_50%_0_0)]",
                        )}
                      />
                    </span>
                  </div>
                  <p className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {isNailspaPdp ? "4.2 out of 5" : "4.5 out of 5"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                    {isNailspaPdp ? "Highly rated on Amazon" : "14,817 global ratings"}
                  </p>
                  <a
                    href={isNailspaPdp ? NAILSPA_AMAZON_REVIEWS_URL : COSMO_AMAZON_REVIEWS_URL}
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

        {!showCosmoStyleBottomExtras && amazonReviewsBundle.reviews.length > 0 ? (
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

      {showStickyAddToCart ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <Button
            size="lg"
            onClick={() => {
              if (colorVariantChoices.length > 0) setStickyConfirmOpen(true);
              else void handleAddToCart();
            }}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className={cn(
              "pointer-events-auto w-full max-w-sm text-base font-semibold shadow-[0_10px_28px_-10px_rgba(0,0,0,0.45)] disabled:opacity-50",
              isCosmoPdp
                ? "font-cosmo-cta rounded-md border border-neutral-700 bg-[#2c2c2c] tracking-wide text-neutral-50 hover:bg-[#1f1f1f]"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className={cn("mr-2 h-5 w-5", isCosmoPdp && "opacity-90")} />
                {isCosmoPdp ? "Add to cart" : "Add to Cart"}
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
                    style={
                      isCosmoMini16
                        ? cosmoMiniSwatchStyle(choice.node)
                        : product.handle.toLowerCase() === "lay-n-go-travel-dog-bed-44"
                          ? dogBedSwatchStyle(choice.rawValue)
                          : variantImageSwatchStyle(choice.node, choice.rawValue)
                    }
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

/** Lay-n-Go Travel Dog Bed (44″) — solid swatches aligned to product fabric (Burgundy Chocolate / Navy). */
function dogBedSwatchStyle(optionValue: string): CSSProperties {
  const key = optionValue.trim().toLowerCase();
  if (key.includes("navy")) return { backgroundColor: "#1e2445" };
  if (key.includes("burgundy") || key.includes("chocolate")) return { backgroundColor: "#722626" };
  return { backgroundColor: "#94a3b8" };
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
