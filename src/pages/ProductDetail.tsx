import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { PageSeo } from "@/components/PageSeo";
import { breadcrumbJsonLd, absoluteUrl, itemListJsonLd, productJsonLd, faqJsonLd, stripHtml, truncateText } from "@/lib/siteSeo";
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
import { LoadingSpinner, ButtonSpinner } from "@/components/LoadingSpinner";
import { ArrowLeft, ShoppingCart, Minus, Plus, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Cosmo20ColorSelector,
  getCosmo20HeroImageUrls,
  getCosmo20InitialSelection,
  getCosmo20SwatchBackgroundStyle,
  isCosmo20Product,
} from "@/components/Cosmo20ColorSelector";
import {
  Cosmo22ColorSelector,
  COSMO_22_SWATCHES,
  getCosmo22HeroImageUrls,
  getCosmo22InitialSelection,
  getCosmo22SwatchStyle,
  isCosmo22Product,
} from "@/components/Cosmo22ColorSelector";
import {
  Nailspa18ColorSelector,
  getNailspa18HeroImageUrls,
  getNailspa18InitialSelection,
  getNailspa18SwatchBackgroundStyle,
  isNailspa18Product,
  NAILSPA_PRODUCT_IMAGE_CLASS,
} from "@/components/Nailspa18ColorSelector";
import { colorNameToApproximateHex } from "@/lib/colorSwatch";
import { LayNGoLargePdpHeroVideo } from "@/components/LayNGoLargePdpHeroVideo";
import { NailspaPdpHeroVideo } from "@/components/NailspaPdpHeroVideo";
import { LayNGoPlayAwardsSection } from "@/components/LayNGoPlayAwardsSection";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";
import { NailspaPdpStory } from "@/components/NailspaPdpStory";
import { CosmoPdpStory } from "@/components/CosmoPdpStory";
import { CosmoPdpVideoGallery } from "@/components/CosmoPdpVideoGallery";
import { ProductLifestyleGallery } from "@/components/ProductLifestyleGallery";
import { LayNGoLargePdpPlayStrip } from "@/components/LayNGoLargePdpPlayStrip";
import { LayNGoTravelDogBedPdpStrip } from "@/components/LayNGoTravelDogBedPdpStrip";
import { ProductAmazonReviews } from "@/components/ProductAmazonReviews";
import { CustomerReviewsSection } from "@/components/CustomerReviewsSection";
import { ProductReviewsSummary } from "@/components/ProductReviewsSummary";
import {
  COSMO_CUSTOMER_REVIEWS,
  NAILSPA_CUSTOMER_REVIEWS,
  TRAVELER_CUSTOMER_REVIEWS,
  PLAY_CUSTOMER_REVIEWS,
  isLayNGoPlayReviewsPdp,
  DEFENDER_CUSTOMER_REVIEWS,
  isLayNGoDefenderReviewsPdp,
  type CustomerReview,
} from "@/data/customerReviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAmazonReviewsForProduct } from "@/data/productAmazonReviews";
import {
  isLayNGoPlayMatProduct,
  LAY_NGO_DEFENDER_SHOPIFY_HERO_IMAGE_CLASS,
  LAY_NGO_LITE_SHOPIFY_HERO_IMAGE_CLASS,
  LAY_NGO_LIFESTYLE_SHOPIFY_HERO_IMAGE_CLASS,
  layNGoPlayMatSwatchStyle,
} from "@/lib/layNGoPlayMat";
import { MILITARY_FIRST_RESPONDER_PATH, OUTDOOR_TACTICAL_COLLECTION_TITLE } from "@/pages/MilitaryFirstResponder";

const COSMETIC_BAGS_V2_PATH = "/shop/cosmetic-bags";

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

const LAY_N_GO_NAILSPA_18_GALLERY_SLIDES = [
  {
    src: "/nailspa-pdp/gallery/03.png",
    alt: "Hands painting nails over an open pink NAILSPA mat with supplies",
  },
  {
    src: "/nailspa-pdp/gallery/04.png",
    alt: "Smiling person using a patterned NAILSPA mat on a marble bathroom counter",
  },
  {
    src: "/nailspa-pdp/gallery/05.png",
    alt: "Top-down view of manicure tools and polish on a bright pink NAILSPA mat",
  },
  {
    src: "/nailspa-pdp/gallery/06.png",
    alt: "Woman painting nails at a kitchen counter with an open patterned Lay-n-Go NAILSPA mat and polish bottles",
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
  {
    src: "/products/lay-n-go-travel-dog-bed-44/gallery-4.png",
    alt: "Two dogs on blue and brown Lay-n-Go pet mats secured to the back seat of a car",
  },
] as const;

const LAY_N_GO_DEFENDER_MINI_16_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-defender-mini-16/gallery-1.png",
    alt: "Lay-n-Go Defender Mini cinched bag with American flag patch on a military vehicle hood",
  },
  {
    src: "/products/lay-n-go-defender-mini-16/gallery-2.png",
    alt: "Person in olive flight suit cinching a Lay-n-Go Defender Mini bag on a vehicle hood",
  },
  {
    src: "/products/lay-n-go-defender-mini-16/gallery-3.png",
    alt: "Lay-n-Go Defender Mini open as an organizer mat with everyday carry gear beside backpacks and a Jeep tire",
  },
] as const;

const LAY_N_GO_DEFENDER_TACTICAL_20_GALLERY_SLIDES = [
  {
    src: "/products/lay-n-go-tactical-bag-20/gallery-1.png",
    alt: "Lay-n-Go Defender Tactical 20 cinched bag with American flag patch on a military vehicle hood",
  },
  {
    src: "/products/lay-n-go-tactical-bag-20/gallery-2.png",
    alt: "Person in olive flight jacket cinching a Lay-n-Go Defender Tactical 20 bag on a vehicle hood",
  },
  {
    src: "/products/lay-n-go-tactical-bag-20/gallery-3.png",
    alt: "Lay-n-Go Defender Tactical 20 open in a vehicle trunk with tactical gear organized on the mat",
  },
] as const;

const LAY_N_GO_LARGE_60_BULLETS = [
  `Lay-n-Go Large 60" diameter activity play mat with patented raised lip to keep LEGOs and small toys contained`,
  "Play for hours, clean up in seconds: just pull the drawstring and it closes completely",
  "4 mesh pockets for storing special pieces",
  "Wide strap for easy carrying, hanging, and storage",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_LIFESTYLE_44_BULLETS = [
  `44" diameter backpack activity play mat with patented raised lip to keep toys contained`,
  "Play for hours, clean up in seconds: just pull the drawstring and it cinches completely closed",
  "Convenient backpack straps plus an extra handle for carrying, hanging, or storing",
  "4 mesh velcroed interior pockets for storing special pieces",
  "Additional purple inner rip-stop liner",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_LITE_18_BULLETS = [
  `18" diameter personal activity play mat: compact enough to take anywhere`,
  "Perfect for airplanes, car rides, restaurants, or any on-the-go adventure",
  "Patented raised lip keeps LEGOs and small pieces contained on the mat",
  "Pull the drawstring and it cinches completely closed for storage and travel",
  "Convenient handle for easy carrying",
  "Reversible play mat color",
  "Machine washable",
  "4-in-1: activity mat, cleanup, storage, and carry-all in one",
  "Toys not included",
] as const;

const LAY_N_GO_NAILSPA_18_BULLETS = [
  `Patented 18" portable nail station that opens flat for a clean, contained work surface`,
  "See all your polishes and tools at once: no more digging through a traditional bag or shoebox",
  "Eight elastic mesh pockets hold your favorite polishes, plus a large circular center pocket for tools and accessories",
  "Raised containment lip keeps polish and tools from rolling off the counter",
  "Machine washable and wipeable for easy cleaning and everyday use",
  "Pull the drawstring to cinch completely closed for storage or travel",
  "Compact enough to pack in a suitcase or overnight bag: fits anywhere",
  "Built-in carrying handle for easy grab-and-go",
  "Smart 4-in-1 solution: clean surface, quick cleanup, carry-all, and storage in one",
  "Protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298",
  "Nail polish, cosmetics, and accessories not included",
] as const;

const LAY_N_GO_TRAVELER_20_BULLETS = [
  `20" diameter men's Dopp Kit that lays completely flat for full access to all your toiletries`,
  "No more digging through a traditional kit or putting your toothbrush on a hotel counter",
  "Patented raised lip keeps everything contained on a clean, dry surface: at home, on the road, or at the gym",
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
  "External drawstring pocket with Velcro® strip ready",
  "Cord lock closure and carrying handle for secure, easy transport",
  "Washable and durable textiles designed for heavy duty activity",
  "Designed specifically to support Warfighters packing personal essentials for deployment",
] as const;

const LAY_N_GO_DEFENDER_TACTICAL_20_BULLETS = [
  `Compact 20" design converts from an open organizing mat into a fully sealed carrying bag in seconds`,
  "Patented design lays completely flat with a raised edge to contain all contents",
  "Built-in interior pockets keep personal essentials organized and easy to access",
  "Clean, dry work surface lets you see and reach all items at once",
  "External drawstring pocket with Velcro® strip ready",
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

const HOW_IT_WORKS_FAQ_ANSWER =
  "It's a patented drawstring organizer that opens flat so you can see and reach every item. When you're finished, one pull of the drawstring cinches it closed into a compact bag for travel or storage.";
const RETURN_POLICY_FAQ_ANSWER =
  "Returns are accepted within 14 days of delivery. Items must be unused with original packaging. Email info@layngo.com with your order number for a Return Authorization before shipping items back.";
const SHIPPING_FAQ_ANSWER =
  "Economy shipping is 5–8 business days and Standard is 3–4 business days after the order ships. We ship within the United States.";
const PATENT_FAQ_ANSWER =
  "Yes. The open-flat, cinch-closed drawstring design is protected by U.S. utility patents. See layngo.com/pages/lay-n-go-patents for details.";

type ProductFaqItem = { question: string; answer: string };

function getGenericProductFaqItems(productTitle: string): ProductFaqItem[] {
  return [
    { question: `How does the ${productTitle} work?`, answer: HOW_IT_WORKS_FAQ_ANSWER },
    { question: `What is the return policy for the ${productTitle}?`, answer: RETURN_POLICY_FAQ_ANSWER },
    { question: "How long does shipping take?", answer: SHIPPING_FAQ_ANSWER },
    { question: "Is the Lay-n-Go design patented?", answer: PATENT_FAQ_ANSWER },
  ];
}

/** Append return/shipping/patent FAQs without duplicating product-specific questions. */
function mergeProductFaqItems(
  productItems: readonly ProductFaqItem[],
  productTitle: string,
): ProductFaqItem[] {
  const extras = getGenericProductFaqItems(productTitle);
  const merged = [...productItems];
  const seen = new Set(productItems.map((item) => item.question.toLowerCase()));

  for (const item of extras) {
    const key = item.question.toLowerCase();
    if (seen.has(key)) continue;
    if (key.includes("patent") && productItems.some((p) => p.question.toLowerCase().includes("patent"))) continue;
    if (key.startsWith("how does") && productItems.some((p) => p.question.toLowerCase().includes("how does"))) continue;
    merged.push(item);
    seen.add(key);
  }

  return merged;
}

type ProductFaqSectionConfig = {
  heading: string;
  ariaLabel: string;
  items: ProductFaqItem[];
  idPrefix: string;
};

function resolveProductFaqSection(
  handle: string,
  productTitle: string,
): ProductFaqSectionConfig {
  const h = handle.toLowerCase();

  if (h === "lay-n-go-nailspa-18") {
    return {
      heading: "Nailspa FAQ",
      ariaLabel: "Nailspa FAQ",
      items: mergeProductFaqItems(NAILSPA_FAQ_ITEMS, productTitle),
      idPrefix: "nailspa-faq",
    };
  }
  if (isCosmo20Product(handle) || isCosmo22Product(handle) || isCosmoMini16Product(handle, productTitle)) {
    return {
      heading: "Cosmo FAQ",
      ariaLabel: "Cosmo FAQ",
      items: mergeProductFaqItems(COSMO_FAQ_ITEMS, productTitle),
      idPrefix: "cosmo-faq",
    };
  }
  if (h === "lay-n-go-defender-mini-16") {
    return {
      heading: "Defender mini FAQ",
      ariaLabel: "Defender mini FAQ",
      items: mergeProductFaqItems(DEFENDER_MINI_FAQ_ITEMS, productTitle),
      idPrefix: "defender-mini-faq",
    };
  }
  if (h === "lay-n-go-tactical-bag-20") {
    return {
      heading: "Defender Tactical FAQ",
      ariaLabel: "Defender Tactical FAQ",
      items: mergeProductFaqItems(DEFENDER_TACTICAL_FAQ_ITEMS, productTitle),
      idPrefix: "defender-tactical-faq",
    };
  }
  if (h === "lay-n-go-travel-dog-bed-44") {
    return {
      heading: "DogBed FAQ",
      ariaLabel: "DogBed FAQ",
      items: mergeProductFaqItems(DOG_BED_44_FAQ_ITEMS, productTitle),
      idPrefix: "dog-bed-44-faq",
    };
  }
  if (h === "lay-n-go-traveler-20") {
    return {
      heading: "Traveler FAQ",
      ariaLabel: "Traveler FAQ",
      items: mergeProductFaqItems(TRAVELER_20_FAQ_ITEMS, productTitle),
      idPrefix: "traveler-20-faq",
    };
  }
  if (h === "lay-n-go-lite-18") {
    return {
      heading: "Lite FAQ",
      ariaLabel: "Lite FAQ",
      items: mergeProductFaqItems(LITE_18_FAQ_ITEMS, productTitle),
      idPrefix: "lite-18-faq",
    };
  }
  if (h === "lay-n-go-lifestyle-44") {
    return {
      heading: "Lifestyle FAQ",
      ariaLabel: "Lifestyle FAQ",
      items: mergeProductFaqItems(LIFESTYLE_44_FAQ_ITEMS, productTitle),
      idPrefix: "lifestyle-44-faq",
    };
  }
  if (h === "lay-n-go-large-60") {
    return {
      heading: "Large FAQ",
      ariaLabel: "Large FAQ",
      items: mergeProductFaqItems(LARGE_60_FAQ_ITEMS, productTitle),
      idPrefix: "large-60-faq",
    };
  }

  return {
    heading: "Frequently asked questions",
    ariaLabel: "Product FAQ",
    items: getGenericProductFaqItems(productTitle),
    idPrefix: "product-faq",
  };
}

const COSMO_FAQ_ITEMS = [
  {
    question: "What sizes does the Cosmo come in?",
    answer:
      'The Cosmo comes in three sizes - the Mini (16"), the original Cosmo (20"), and the Deluxe (22") - so there is a perfect fit for every routine.',
  },
  {
    question: "How does it work?",
    answer:
      "Open the bag flat to see and reach everything inside. When you're done, pull the drawstring cord to cinch it closed in seconds: no dumping, no rummaging, no mess.",
  },
  {
    question: "What can fit inside?",
    answer:
      "The Cosmo holds full-size makeup, brushes, skincare, and toiletries all at once - ideal for travelers, commuters, makeup artists, and anyone tired of digging through a messy pouch.",
  },
  {
    question: "Is it actually machine washable?",
    answer:
      "Yes: just toss it in the washing machine. It's also made from water-resistant fabric that wipes clean easily for quick cleanups between washes.",
  },
  {
    question: "Is it water resistant?",
    answer:
      "Yes, the Cosmo is made from durable water-resistant fabric that stands up to everyday spills, smudges, and makeup messes.",
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
      "Open the drawstring so the mat lies flat. Mesh pockets and elastic keep bottles and tools visible and upright while you work. When you are finished, pull the cord to gather everything closed: no more bottles rolling off the towel.",
  },
  {
    question: "What can fit inside?",
    answer:
      "Typical manicure kits: multiple polish bottles, files, buffers, clippers, small jars, and brushes. The 18\" size is sized for home vanities and travel bathrooms alike.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes: follow care instructions on the product label. Between washes, the water-resistant fabric wipes clean for polish smudges and spills.",
  },
  {
    question: "Is it good for travel?",
    answer:
      "Yes. It gives you a dedicated clean surface away from hotel counters, then cinches into a compact bundle that fits in a tote or suitcase.",
  },
  {
    question: "How is it different from a zippered pouch?",
    answer:
      "A zip pouch hides everything in a pile. The NAILSPA stays open and flat so you see every item at once, with pockets that keep polish from tipping: then closes in seconds when you are done.",
  },
] as const;

const DEFENDER_MINI_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go DEFENDER mini?",
    answer:
      'The DEFENDER mini is a 16" patented mat-to-bag system that opens flat as a containment mat and cinches closed into a fully sealed bag in seconds: ideal for organizing personal essentials at home, at work, or on the go.',
  },
  {
    question: "How does it work?",
    answer:
      "The DEFENDER mini lays completely flat, forming a raised edge to keep all contents contained and visible. Once you're ready to move, simply pull the drawstring to cinch it closed into a secure, sealed bag.",
  },
  {
    question: "What can I store in it?",
    answer:
      "It's designed to hold personal mission essentials: tools, first aid items, snacks, batteries, lights, knives, and more.",
  },
  {
    question: "What pockets does it include?",
    answer:
      "The DEFENDER mini includes an external drawstring pocket with a Velcro® strip for attaching your own patch (patch not included).",
  },
  {
    question: "Is it washable?",
    answer:
      "Yes. The DEFENDER mini is made with washable, durable textiles built to withstand the demands of repeated use and deployment conditions.",
  },
  {
    question: "Does it come with a patch?",
    answer:
      "No. A Velcro® strip is included on the external pocket for attaching your own patch (patch not included).",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The DEFENDER is protected by five U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298 · #11,910,900.",
  },
  {
    question: "Who is this product designed for?",
    answer:
      "The DEFENDER mini was specifically designed for Warfighters and military personnel, though it is also well suited for first responders, outdoor enthusiasts, campers, and anyone who needs a fast, organized pack-and-go solution.",
  },
  {
    question: "How do I carry it when packed?",
    answer:
      "The DEFENDER mini includes a convenient carrying handle for easy transport once cinched closed.",
  },
  {
    question: "What size is the DEFENDER mini?",
    answer:
      'The DEFENDER mini measures 16" and is compact enough to pack alongside other deployment gear without taking up unnecessary space.',
  },
] as const;

const DEFENDER_TACTICAL_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go DEFENDER Tactical?",
    answer:
      "The DEFENDER Tactical is a patented utility bag developed with input from active duty and retired service members. It opens flat as a containment mat and cinches closed into a fully sealed bag in seconds: built for anyone who needs fast, organized pack-and-go storage.",
  },
  {
    question: "How does it work?",
    answer:
      "The DEFENDER opens completely flat, forming a raised edge to keep all contents contained and visible. When it's time to move, simply pull the drawstring to cinch it closed into a fully sealed bag in seconds.",
  },
  {
    question: "What makes it different from the DEFENDER mini?",
    answer:
      "The DEFENDER Tactical is available in multiple configurations, textiles, and sizes and features two large mesh pockets and a zippered storage pocket for expanded organization options.",
  },
  {
    question: "What pockets does it include?",
    answer:
      "The DEFENDER Tactical includes two large interior mesh pockets for visible, easy-access storage, a zippered storage pocket for securing smaller items, and an external drawstring pocket with a Velcro® strip for attaching your own patch (patch not included).",
  },
  {
    question: "What can I store in it?",
    answer:
      "It's designed to hold personal mission essentials: tools, first aid supplies, food, batteries, lights, and more. The mesh pockets keep items visible at a glance while the zippered pocket secures valuables or smaller items.",
  },
  {
    question: "Is it washable?",
    answer:
      "Yes. The DEFENDER Tactical is made with washable, durable textiles built to handle the demands of deployment and repeated use.",
  },
  {
    question: "Does it come with a patch?",
    answer:
      "No. A Velcro® strip is included on the external pocket for attaching your own patch (patch not included).",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The DEFENDER is protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298.",
  },
  {
    question: "Who is this product designed for?",
    answer:
      "The DEFENDER Tactical was designed for Warfighters and military personnel, developed with direct input from active duty and retired service members. It is also a strong fit for first responders, law enforcement, outdoor enthusiasts, and anyone needing a fast, organized pack-and-go solution.",
  },
  {
    question: "How do I carry it when packed?",
    answer:
      "The DEFENDER Tactical includes a convenient carrying handle for easy transport once cinched closed.",
  },
] as const;

const DOG_BED_44_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go DogBed?",
    answer:
      'The Lay-n-Go DogBed is a 44" quilted, fleece-lined mat that converts into a portable carrying bag in seconds. It functions as a traditional dog bed at home and doubles as a travel bag for everything your pet needs on the go.',
  },
  {
    question: "How does it convert into a bag?",
    answer:
      "The mat folds quickly and cinches closed using the cord lock and handle system, transforming into a sealed bag that can carry bowls, food, toys, treats, and more.",
  },
  {
    question: "What is the containment lip?",
    answer:
      "When laid flat, the DogBed forms a raised edge around the perimeter that keeps your pet's toys, bowls, and belongings contained in one place: perfect for keeping things organized at home or on the go.",
  },
  {
    question: "Is it comfortable for my dog?",
    answer:
      "Yes. The DogBed features soft, comfortable quilted padding with a fleece lining for added warmth and comfort, making it a cozy resting spot whether at home or traveling.",
  },
  {
    question: "Can it protect my furniture and car seats?",
    answer:
      "Yes. The mat is designed to protect car seats, sofas, and cushions from dirt, fur, and scratches, making it a practical barrier between your pet and your upholstery.",
  },
  {
    question: "Where can I use it?",
    answer:
      "The DogBed is designed to go anywhere your dog goes: at home, in the car, on vacation, at outdoor restaurants, or any pet-friendly destination.",
  },
  {
    question: "What fits in the zipper pocket?",
    answer:
      "The oversized zippered exterior pocket is large enough to fit a retractable leash, phone, keys, and other small essentials for easy access while on the move.",
  },
  {
    question: "What can the bag carry?",
    answer:
      "Once folded into a bag, it easily carries your dog's bowls, food, toys, treats, and everyday essentials all in one place.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes. The DogBed is fully machine washable, making cleanup easy after muddy adventures or everyday use.",
  },
  {
    question: "What is included with the DogBed?",
    answer:
      "The DogBed includes a wide carry strap for easy travel and storage, a cord lock, cord pocket, carrying handle, and an oversized zippered exterior pocket.",
  },
  {
    question: "What size is the DogBed?",
    answer:
      'The DogBed mat measures 44", making it large enough for most dog breeds to stretch out comfortably.',
  },
] as const;

const TRAVELER_20_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go TRAVELER?",
    answer:
      'The Lay-n-Go TRAVELER is a patented 20" men\'s Dopp kit that opens completely flat into a contained work surface for toiletries and bath essentials, then cinches closed into a fully sealed, handled pack in seconds.',
  },
  {
    question: "How does it work?",
    answer:
      "Simply open the TRAVELER flat to spread out all your toiletries on a clean, dry, contained surface. When you're done, pull the drawstring to cinch everything closed and pack it away: no sorting, no digging, no mess.",
  },
  {
    question: "What is the containment lip?",
    answer:
      "When laid flat, the TRAVELER forms a raised edge around the perimeter that keeps all your items from rolling away or falling off the surface, whether you're at home, in a hotel, or at the gym.",
  },
  {
    question: "Will I have to dig through it to find things?",
    answer:
      "No. That's the whole point. Everything lays out flat and visible at once, eliminating the need to dig through a traditional toiletry bag to find what you need.",
  },
  {
    question: "Can I put my toothbrush directly on it?",
    answer:
      "Yes. The TRAVELER provides a clean, dry surface to place your toothbrush, razor, and other essentials: no more setting items on a hotel bathroom counter.",
  },
  {
    question: "What pockets does it include?",
    answer:
      "The TRAVELER includes an interior pocket for small items and a zippered storage pocket for securing essentials, along with a convenient carrying handle.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes. The TRAVELER is fully machine washable for easy cleaning after travel or everyday use.",
  },
  {
    question: "What size is it?",
    answer:
      'The TRAVELER measures 20" in diameter, providing ample space to lay out all your daily toiletries and bath basics.',
  },
  {
    question: "Where can I use it?",
    answer:
      "The TRAVELER is designed for use at home, in hotels, on the road, or at the gym: anywhere you need a clean, organized surface for your essentials.",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The TRAVELER is protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298.",
  },
] as const;

const LITE_18_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go LITE?",
    answer:
      'The Lay-n-Go LITE is a patented 18" personal activity play mat that converts into a carry-all storage bag in seconds. It\'s designed for kids to play, clean up, store, and travel with their small toys: all in one product.',
  },
  {
    question: "How does it work?",
    answer:
      "Lay the mat flat for playtime, then simply pull the drawstring to cinch everything closed into a fully sealed bag for storage or travel. No dumping bins, no chasing pieces: cleanup takes seconds.",
  },
  {
    question: "What is the containment lip?",
    answer:
      "The LITE features a raised edge around the perimeter that keeps small toys, Lego® bricks, and other tiny pieces contained on the mat during play so nothing rolls away or gets lost.",
  },
  {
    question: "What size is it?",
    answer:
      'The LITE measures 18" in diameter, including the cord channel edge, making it the perfect personal-sized play space for one child.',
  },
  {
    question: "Is it good for Lego®?",
    answer:
      "Yes. The raised containment lip is ideal for keeping Lego® bricks and other small pieces corralled in one place during play, making cleanup fast and easy.",
  },
  {
    question: "Where can I use it?",
    answer:
      "The LITE is designed to go anywhere: on an airplane, in the car, at a restaurant, or at home. Its compact size makes it easy to bring along wherever your child goes.",
  },
  {
    question: "What does the 4-in-1 solution mean?",
    answer:
      "The LITE serves as an activity mat, cleanup tool, storage bag, and carry-all: four functions in one product, replacing the need for separate toy bins, bags, and mats.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes. The LITE is fully machine washable for easy cleaning after play.",
  },
  {
    question: "Does it have a handle?",
    answer:
      "Yes. The LITE includes a convenient carrying handle for easy transport once cinched closed.",
  },
  {
    question: "Is it reversible?",
    answer:
      "Yes. The LITE features a reversible play mat with two colors, giving kids options for their play surface.",
  },
  {
    question: "Are toys included?",
    answer:
      "No. Toys are not included with the Lay-n-Go LITE.",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The LITE is protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298.",
  },
] as const;

const LIFESTYLE_44_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go LIFESTYLE?",
    answer:
      'The Lay-n-Go LIFESTYLE is a patented 44" high-quality backpack activity play mat designed for quick, effortless toy cleanup. Play for hours, then pull the drawstring to cinch it completely closed for storage and travel: no more dumping bins and baskets.',
  },
  {
    question: "How does it work?",
    answer:
      "Lay the mat flat for playtime with the patented raised lip keeping toys contained. When you're done, pull the drawstring and the machine-washable LIFESTYLE cinches completely closed into a sealed backpack you can carry, hang, or store.",
  },
  {
    question: "What is the containment lip?",
    answer:
      "The patented raised lip around the perimeter keeps toys on the mat during play so pieces stay contained for hours without rolling away or getting lost.",
  },
  {
    question: "What size is it?",
    answer:
      'The LIFESTYLE measures 44" in diameter, providing a spacious activity surface for extended play.',
  },
  {
    question: "What does the 4-in-1 solution mean?",
    answer:
      "The LIFESTYLE is a smart all-in-one solution: activity mat, cleanup tool, storage bag, and carry-all: four functions in one product.",
  },
  {
    question: "What pockets does it include?",
    answer:
      "The LIFESTYLE includes four mesh velcroed interior pockets for storing special pieces and smaller items.",
  },
  {
    question: "Does it have backpack straps?",
    answer:
      "Yes. Convenient backpack straps make it easy to carry once cinched closed, plus an extra handle between the straps for hanging or carrying.",
  },
  {
    question: "What is the inner liner?",
    answer:
      "The LIFESTYLE includes an additional inner rip-stop liner for added durability.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes. The LIFESTYLE is fully machine washable for easy cleaning after play.",
  },
  {
    question: "Are toys included?",
    answer:
      "No. Toys are not included with the Lay-n-Go LIFESTYLE.",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The LIFESTYLE is protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298.",
  },
] as const;

const LARGE_60_FAQ_ITEMS = [
  {
    question: "What is the Lay-n-Go LARGE?",
    answer:
      'The Lay-n-Go LARGE is a patented 60" activity play mat that converts into a fully cinched carry-all in seconds. It\'s designed for kids to play, clean up, store, and travel with their toys: all in one product.',
  },
  {
    question: "How does it work?",
    answer:
      "Lay the mat flat for playtime, then simply pull the drawstring to cinch all the toys closed into a fully sealed bag for storage or travel. No dumping bins, no chasing pieces: cleanup takes seconds.",
  },
  {
    question: "What is the containment lip?",
    answer:
      "The LARGE features a raised edge around the perimeter that keeps Lego® bricks, toys, and other small pieces contained on the mat during play so nothing rolls away or gets lost.",
  },
  {
    question: "What size is it?",
    answer:
      'The LARGE measures 60" in diameter, making it the biggest play surface in the Lay-n-Go lineup: ideal for large toy collections or multiple children playing together.',
  },
  {
    question: "Does it have pockets?",
    answer:
      "Yes. The LARGE includes four interior mesh pockets to store special pieces, figures, or accessories separately so they stay organized and easy to find.",
  },
  {
    question: "How do I carry it?",
    answer:
      "The LARGE includes a wide carry strap, cord lock, cord pocket, and handle making it easy to carry over the shoulder, hang on a hook, or store out of the way when not in use.",
  },
  {
    question: "Where can I use it?",
    answer:
      "The LARGE is designed for use at home, outdoors, at the beach, on vacation, or anywhere kids want to play. Its generous 60\" size gives kids plenty of room to spread out.",
  },
  {
    question: "What does the 4-in-1 solution mean?",
    answer:
      "The LARGE serves as an activity mat, cleanup tool, storage bag, and carry-all: four functions in one product, replacing the need for separate toy bins, bags, and mats.",
  },
  {
    question: "Is it good for Lego®?",
    answer:
      "Yes. The raised containment lip is ideal for keeping Lego® bricks and other small pieces corralled in one place during play, making cleanup fast and effortless.",
  },
  {
    question: "Is it machine washable?",
    answer:
      "Yes. The LARGE is fully machine washable for easy cleaning after play.",
  },
  {
    question: "Are toys included?",
    answer:
      "No. Toys are not included with the Lay-n-Go LARGE.",
  },
  {
    question: "Is the design patented?",
    answer:
      "Yes. The LARGE is protected by four U.S. patents: #9,084,459 · #10,016,036 · #10,561,213 · #11,116,298.",
  },
] as const;

/** Shopify “PT##” art for Traveler: feature/sizing/travel diagrams, not product photography. */
function isLayNGoTraveler20InfographicImageUrl(url: string): boolean {
  return /B00F1TI8T0\.PT\d+/i.test(url);
}

function getOrderedImagesForProduct(product: ShopifyProduct["node"]) {
  let imgs = product.images.edges;

  if (product.handle.toLowerCase() === "lay-n-go-traveler-20") {
    imgs = imgs.filter((img) => !isLayNGoTraveler20InfographicImageUrl(img.node.url));
  }

  return imgs;
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
    if (!product || product.handle.toLowerCase() !== "lay-n-go-travel-dog-bed-44") return;
    const colorName = product.options.find((opt) => isColorOptionName(opt.name))?.name;
    if (!colorName) return;
    const navyIdx = product.variants.edges.findIndex((edge) => {
      const val = edge.node.selectedOptions.find((o) => o.name === colorName)?.value ?? "";
      return val.trim().toLowerCase().includes("navy");
    });
    if (navyIdx < 0) return;
    setSelectedVariantIdx(navyIdx);
    const variant = product.variants.edges[navyIdx]?.node;
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
    ? "Back to Cosmetic Bags"
    : fromMilitaryFirstResponder
      ? `Back to ${OUTDOOR_TACTICAL_COLLECTION_TITLE}`
      : collectionHandle
        ? "Back to collection"
        : "Back to collections";

  const isCosmoMini16 = product ? isCosmoMini16Product(product.handle, product.title) : false;
  const stickyConfirmPreviewUrl = useMemo(() => {
    if (!product) return null;
    const variant = product.variants.edges[selectedVariantIdx]?.node;
    if (!variant) return null;
    return pdpColorHeroPreviewUrl(product, variant, isCosmoMini16);
  }, [product, selectedVariantIdx, isCosmoMini16]);

  /** Cosmo Mini: variant heroes only (Black / CrossMarks): no Shopify PT/lifestyle/features strip. */
  const cosmoMiniHeroUrl = isCosmoMini16 ? stickyConfirmPreviewUrl : null;

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
    const urls = getCosmo22HeroImageUrls(color, v);
    return urls[0] ? [urls[0]] : [];
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

  /** Editorial story strip + arrow editor: Cosmo bags only, not Nailspa. */
  const isCosmoStoryPdp = Boolean(
    product &&
      (isCosmo20Product(product.handle) ||
        isCosmo22Product(product.handle) ||
        isCosmoMini16Product(product.handle, product.title)),
  );

  const isNailspaPdp = Boolean(product && isNailspa18Product(product.handle));

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
      product.handle.toLowerCase() !== "lay-n-go-defender-mini-16" &&
      product.handle.toLowerCase() !== "lay-n-go-tactical-bag-20" &&
      Boolean(product.description?.trim()),
  );


  const cosmoYoutubeId = useMemo(() => {
    if (!product) return null;
    if (isCosmoStoryPdp) return COSMO_AUTOPLAY_YOUTUBE_ID;
    return extractFirstYoutubeVideoId(product.description || "");
  }, [isCosmoStoryPdp, product, product?.description]);

  const amazonReviewsBundle = useMemo(
    () => (product ? getAmazonReviewsForProduct(product.handle) : { reviews: [], amazonListingUrl: undefined }),
    [product],
  );

  const nativeCustomerReviews = useMemo((): CustomerReview[] | null => {
    if (!product) return null;
    const handle = product.handle;
    if (
      isCosmo20Product(handle) ||
      isCosmo22Product(handle) ||
      isCosmoMini16Product(handle, product.title)
    ) {
      return COSMO_CUSTOMER_REVIEWS;
    }
    if (isNailspa18Product(handle)) return NAILSPA_CUSTOMER_REVIEWS;
    if (handle.toLowerCase() === "lay-n-go-traveler-20") return TRAVELER_CUSTOMER_REVIEWS;
    if (isLayNGoPlayReviewsPdp(handle)) return PLAY_CUSTOMER_REVIEWS;
    if (isLayNGoDefenderReviewsPdp(handle)) return DEFENDER_CUSTOMER_REVIEWS;
    return null;
  }, [product]);

  const layNGoHandle = product?.handle.toLowerCase() ?? "";
  const isLayNGoLarge60 = layNGoHandle === "lay-n-go-large-60";
  const isLayNGoLifestyle44 = layNGoHandle === "lay-n-go-lifestyle-44";
  const isLayNGoLite18 = layNGoHandle === "lay-n-go-lite-18";
  const isLayNGoDefenderMini16 = layNGoHandle === "lay-n-go-defender-mini-16";
  const isLayNGoDefenderTactical20 = layNGoHandle === "lay-n-go-tactical-bag-20";
  const isLayNGoDefender = isLayNGoDefenderMini16 || isLayNGoDefenderTactical20;
  /** Nailspa, Lifestyle, Lite, and Defender PDPs use site `bg-background` (not Cosmo white panels). */
  const pdpUsesSiteBackground =
    isNailspaPdp || isLayNGoLifestyle44 || isLayNGoLite18 || isLayNGoDefender;
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
  const productFaqSection = useMemo(
    () => (product ? resolveProductFaqSection(product.handle, product.title) : null),
    [product],
  );
  const isLayNGoNailspa18 = layNGoHandle === "lay-n-go-nailspa-18";
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
    if (product.handle.toLowerCase() === "lay-n-go-travel-dog-bed-44") {
      return [...choices].sort((a, b) => dogBedColorSortKey(a.rawValue) - dogBedColorSortKey(b.rawValue));
    }
    return choices;
  }, [colorOptionName, product]);

  useEffect(() => {
    if (!product) return;
    const h = product.handle.toLowerCase();
    if (
      h !== "lay-n-go-large-60" &&
      h !== "lay-n-go-lifestyle-44" &&
      h !== "lay-n-go-lite-18" &&
      h !== "lay-n-go-traveler-20" &&
      h !== "lay-n-go-travel-dog-bed-44" &&
      h !== "lay-n-go-defender-mini-16" &&
      h !== "lay-n-go-tactical-bag-20" &&
      h !== "lay-n-go-nailspa-18"
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
              : h === "lay-n-go-travel-dog-bed-44"
                ? LAY_N_GO_TRAVEL_DOG_BED_44_GALLERY_SLIDES
                : h === "lay-n-go-defender-mini-16"
                  ? LAY_N_GO_DEFENDER_MINI_16_GALLERY_SLIDES
                  : h === "lay-n-go-tactical-bag-20"
                    ? LAY_N_GO_DEFENDER_TACTICAL_20_GALLERY_SLIDES
                    : LAY_N_GO_NAILSPA_18_GALLERY_SLIDES;
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
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center py-32">
          <LoadingSpinner label="Loading product" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="container py-20 text-center flex-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">Product Not Found</h1>
          <p className="text-muted-foreground text-lg mt-2">We couldn't find that product.</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View collections
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const layNGoLifestyleGallery = isLayNGoLarge60
    ? { slides: LAY_N_GO_LARGE_60_GALLERY_SLIDES, ariaLabel: "Lay-n-Go Large lifestyle photos" }
    : isLayNGoLifestyle44
      ? { slides: LAY_N_GO_LIFESTYLE_44_GALLERY_SLIDES, ariaLabel: "Lay-n-Go Lifestyle photos" }
      : isLayNGoLite18
        ? { slides: LAY_N_GO_LITE_18_GALLERY_SLIDES, ariaLabel: "Lay-n-Go Lite lifestyle photos" }
        : isLayNGoTraveler20
          ? { slides: LAY_N_GO_TRAVELER_20_GALLERY_SLIDES, ariaLabel: "Lay-n-Go Traveler product photos" }
          : isLayNGoTravelDogBed44
            ? {
                slides: LAY_N_GO_TRAVEL_DOG_BED_44_GALLERY_SLIDES,
                ariaLabel: "Lay-n-Go Travel Dog Bed lifestyle photos",
              }
            : isLayNGoDefenderMini16
              ? {
                  slides: LAY_N_GO_DEFENDER_MINI_16_GALLERY_SLIDES,
                  ariaLabel: "Lay-n-Go Defender Mini lifestyle photos",
                }
              : isLayNGoDefenderTactical20
                ? {
                    slides: LAY_N_GO_DEFENDER_TACTICAL_20_GALLERY_SLIDES,
                    ariaLabel: "Lay-n-Go Defender Tactical lifestyle photos",
                  }
                : isLayNGoNailspa18
                  ? { slides: LAY_N_GO_NAILSPA_18_GALLERY_SLIDES, ariaLabel: "Lay-n-Go NAILSPA lifestyle photos" }
                  : null;
  const descHtml = /<[a-z][\s\S]*>/i.test(product.description);
  const priceDisplay = parseFloat(
    selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
  ).toFixed(2);
  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    // Use the hero image currently displayed on the PDP for this color/variant,
    // not Shopify's default first image (which is often the color-selector composite).
    const currentHeroUrl: string | null =
      cosmoMiniHeroUrl ||
      (isCosmo22Product(product.handle) && cosmo22HeroUrls.length > 0
        ? cosmo22HeroUrls[Math.min(cosmo22GalleryIndex, cosmo22HeroUrls.length - 1)]
        : null) ||
      (isCosmo20Product(product.handle) && cosmo20HeroUrls.length > 0
        ? cosmo20HeroUrls[Math.min(cosmo20GalleryIndex, cosmo20HeroUrls.length - 1)]
        : null) ||
      (isNailspa18Product(product.handle) && nailspa18HeroUrls.length > 0
        ? nailspa18HeroUrls[0]
        : null) ||
      orderedImages[selectedImage]?.node?.url ||
      null;
    const productWithHero = currentHeroUrl
      ? {
          ...product,
          images: {
            ...product.images,
            edges: [
              { node: { url: currentHeroUrl, altText: product.title } },
              ...(product.images?.edges ?? []),
            ],
          },
        }
      : product;
    const shopifyProduct: ShopifyProduct = { node: productWithHero };
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
    if (isCosmoMini16) return;
    if (variantImageUrl) {
      const imageIdx = orderedImages.findIndex((img) => img.node.url === variantImageUrl);
      if (imageIdx >= 0) setSelectedImage(imageIdx);
    }
  };

  const mainHeroImage: ReactNode = cosmoMiniHeroUrl ? (
    <img
      src={cosmoMiniHeroUrl}
      alt={product.title}
      className="h-full w-full max-h-full object-contain p-6"
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
      className={cn("h-full w-full", NAILSPA_PRODUCT_IMAGE_CLASS)}
    />
  ) : isLayNGoPlayMatProduct(product.handle) && orderedImages[selectedImage]?.node ? (
    <img
      src={orderedImages[selectedImage].node.url}
      alt={orderedImages[selectedImage].node.altText || product.title}
      className={cn(
        "h-full w-full max-h-full object-contain",
        isLayNGoLite18 && LAY_NGO_LITE_SHOPIFY_HERO_IMAGE_CLASS,
        isLayNGoLifestyle44 && LAY_NGO_LIFESTYLE_SHOPIFY_HERO_IMAGE_CLASS,
        isLayNGoDefender && LAY_NGO_DEFENDER_SHOPIFY_HERO_IMAGE_CLASS,
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
      {isCosmo20Product(product.handle) && cosmo20HeroUrls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Variant photo gallery">
          {cosmo20HeroUrls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setCosmo20GalleryIndex(i)}
              aria-label={`View ${product.title} variant photo ${i + 1} of ${cosmo20HeroUrls.length}`}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center bg-muted/15 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                i === cosmo20GalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : "ring-0",
              )}
            >
              <img src={url} alt={`${product.title}: photo ${i + 1}`} className="max-h-full max-w-full object-contain" />
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
              aria-label={`View ${product.title} variant photo ${i + 1} of ${nailspa18HeroUrls.length}`}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center bg-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === nailspa18GalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-0",
              )}
            >
              <img src={url} alt={`${product.title}: photo ${i + 1}`} className={NAILSPA_PRODUCT_IMAGE_CLASS} />
            </button>
          ))}
        </div>
      ) : null}
      {!isCosmoMini16 &&
      !isCosmo22Product(product.handle) &&
      !isCosmo20Product(product.handle) &&
      !isNailspa18Product(product.handle) &&
      !(
        isLayNGoLarge60 ||
        isLayNGoLifestyle44 ||
        isLayNGoLite18 ||
        isLayNGoTraveler20 ||
        isLayNGoTravelDogBed44 ||
        isLayNGoDefenderMini16 ||
        isLayNGoDefenderTactical20
      ) &&
      orderedImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Product photo gallery">
          {orderedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImage(i)}
              aria-label={img.node.altText || `View ${product.title} photo ${i + 1} of ${orderedImages.length}`}
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
              {(isColorOption && colorVariantChoices.length > 0
                ? colorVariantChoices.map((choice) => ({
                    vIdx: choice.idx,
                    node: choice.node,
                    optValue: choice.rawValue,
                    displayOptValue: choice.displayValue,
                  }))
                : product.variants.edges
                    .map((v, vIdx) => {
                      const optValue = v.node.selectedOptions.find((o) => o.name === option.name)?.value;
                      const displayOptValue = displayOptionValue(product.handle, optValue || "");
                      const prevSame = product.variants.edges.findIndex(
                        (pv) => pv.node.selectedOptions.find((o) => o.name === option.name)?.value === optValue,
                      );
                      if (prevSame !== vIdx) return null;
                      return { vIdx, node: v.node, optValue: optValue || "", displayOptValue };
                    })
                    .filter((item): item is NonNullable<typeof item> => item !== null)
              ).map(({ vIdx, node, optValue, displayOptValue }) => {
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
                      !node.availableForSale ? "line-through opacity-40" : "",
                    )}
                    style={
                      isColor
                        ? pdpColorCircleSwatchStyle(product.handle, isCosmoMini16, optValue || "", node)
                        : undefined
                    }
                    disabled={!node.availableForSale}
                    aria-label={
                      !node.availableForSale ? `${displayOptValue}, unavailable` : displayOptValue
                    }
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
        <ButtonSpinner label="Adding to cart" />
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
        <ButtonSpinner label="Adding to cart" />
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5 opacity-90" />
          Add to cart
        </>
      )}
    </Button>
  );

  const showChooseColorsUi = !isLayNGoDefender;
  const hasColorChoices = colorVariantChoices.length > 0;
  const showReviewsSummary =
    Boolean(nativeCustomerReviews?.length) || amazonReviewsBundle.reviews.length > 0;

  const productReviewsSummary: ReactNode = showReviewsSummary ? (
    <ProductReviewsSummary
      productHandle={product.handle}
      staticNativeReviews={nativeCustomerReviews ?? undefined}
      amazonReviews={nativeCustomerReviews ? undefined : amazonReviewsBundle.reviews}
    />
  ) : null;

  const optionPickersAndPurchase: ReactNode = (
    <>
      {hasColorChoices ? productReviewsSummary : null}
      {optionPickersOnly}
      {quantityPicker}
      <div ref={primaryAddToCartRef}>{addToCartButton}</div>
    </>
  );

  return (
    <div
      className={cn(
        "min-h-dvh flex flex-col",
        pdpUsesSiteBackground
          ? "bg-background"
          : isCosmoPdp
            ? "bg-white"
            : "bg-background",
      )}
    >
      <PageSeo
        title={product.title}
        description={
          truncateText(stripHtml(product.description || ""), 160) ||
          `Shop the ${product.title}: patented Lay-n-Go drawstring organizer that opens flat and cinches closed for travel and storage.`
        }
        pathname={`/product/${product.handle}`}
        type="product"
        image={product.images?.edges?.[0]?.node?.url ?? undefined}
        imageAlt={`${product.title}: Lay-n-Go product photo`}
        keywords={`${product.title}, Lay-n-Go, drawstring bag, ${product.tags?.[0] || "organizer"}`}
        jsonLd={[
          productJsonLd({
            name: product.title,
            description: stripHtml(product.description || "") || product.title,
            handle: product.handle,
            images: product.images?.edges?.map((e) => e.node.url).filter(Boolean) ?? [],
            price: String(priceDisplay),
            currency: selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode || "USD",
            inStock: Boolean(selectedVariant?.availableForSale),
            sku: selectedVariant?.id?.split("/").pop() ?? product.handle,
            tags: product.tags,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: product.title, path: `/product/${product.handle}` },
          ]),
          faqJsonLd(resolveProductFaqSection(product.handle, product.title).items),
        ]}
      />
      <Header />
      <main id="main-content" className="container py-8 flex-1">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          {fromCosmeticBagsV2 ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
              <Link to={COSMETIC_BAGS_V2_PATH} className="hover:text-foreground transition-colors">
                Cosmetic Bags
              </Link>
            </>
          ) : fromMilitaryFirstResponder ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
              <Link to={MILITARY_FIRST_RESPONDER_PATH} className="hover:text-foreground transition-colors">
                {OUTDOOR_TACTICAL_COLLECTION_TITLE}
              </Link>
            </>
          ) : collectionHandle ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
              <Link to={`/collections/${collectionHandle}`} className="hover:text-foreground transition-colors capitalize">
                {collectionHandle.replace(/-/g, " ")}
              </Link>
            </>
          ) : null}
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
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

            <section
              className={cn(
                "-mx-4 overflow-x-hidden px-4 py-8 sm:-mx-6 sm:px-6 lg:py-10",
                pdpUsesSiteBackground ? "bg-background" : "bg-white",
              )}
            >
              <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12">
                <div className="min-w-0 space-y-4">
                  <div
                    className={cn(
                      "relative flex aspect-square w-full min-w-0 items-center justify-center overflow-hidden lg:mx-auto lg:max-h-[min(92vh,920px)]",
                      pdpUsesSiteBackground ? "bg-background" : "bg-white",
                      isLayNGoLarge60 &&
                        "max-md:aspect-auto max-md:max-h-[min(62vmin,430px)] max-md:min-h-[200px] max-md:py-2",
                    )}
                  >
                    {mainHeroImage}
                  </div>
                  {heroThumbnails}
                </div>

                <div className="flex flex-col gap-6 px-0 py-0">
                  {showChooseColorsUi ? (
                    <div>
                      {hasColorChoices ? productReviewsSummary : null}
                      {hasColorChoices ? (
                        <p
                          className={cn(
                            "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
                            showReviewsSummary ? "mt-4" : undefined,
                          )}
                        >
                          Choose colors
                        </p>
                      ) : null}
                      <div className={cn(hasColorChoices && "mt-3")}>{optionPickersOnly}</div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-neutral-200/80 pb-6">
                    {(!showChooseColorsUi || !hasColorChoices) && productReviewsSummary ? (
                      <div className="mb-2 w-full basis-full">{productReviewsSummary}</div>
                    ) : null}
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
                  isLayNGoDefenderTactical20 ||
                  isLayNGoNailspa18 ? (
                    <ul
                      className="mt-5 list-disc space-y-2.5 pl-5 text-left text-sm font-medium leading-relaxed text-neutral-700 marker:text-neutral-900"
                      aria-label={
                        isLayNGoNailspa18
                          ? "Lay-n-Go NAILSPA highlights"
                          : isLayNGoTraveler20
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
                      {(isLayNGoNailspa18
                        ? LAY_N_GO_NAILSPA_18_BULLETS
                        : isLayNGoTraveler20
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
                  isLayNGoTraveler20
                    ? "Packed for wherever work takes you."
                    : isLayNGoDefenderMini16 || isLayNGoDefenderTactical20
                      ? "Mission-Ready in Seconds"
                      : undefined
                }
                forceHeadlineSingleLine={isLayNGoDefenderMini16 || isLayNGoDefenderTactical20}
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
                  isLayNGoDefenderMini16
                    ? "defender-mini-16"
                    : isLayNGoDefenderTactical20
                      ? "defender-tactical-20"
                      : isLayNGoLifestyle44
                        ? "lifestyle-44"
                        : isLayNGoLite18
                          ? "lite-18"
                          : "large-60"
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

            {isCosmoStoryPdp ? (
              <CosmoPdpStory hideIntroImage={isCosmo22Product(product.handle)} />
            ) : null}

            <section
              className="mt-14 sm:mt-16"
              aria-label={
                layNGoLifestyleGallery
                  ? isLayNGoLarge60
                    ? "Lay-n-Go Large product video and lifestyle gallery"
                    : isNailspa18Product(product.handle)
                      ? "NAILSPA product video and lifestyle gallery"
                      : "Product image showcase"
                  : isNailspa18Product(product.handle)
                    ? "NAILSPA product video"
                    : cosmoYoutubeId
                      ? "Product video"
                      : "Video placeholder"
              }
            >
              <div className="w-full">
                {layNGoLifestyleGallery ? (
                  <div className="mx-auto w-full max-w-full md:w-[80%]">
                    {isNailspaPdp ? (
                      <div className="mb-8 w-full sm:mb-10">
                        <NailspaPdpHeroVideo />
                      </div>
                    ) : null}
                    {isLayNGoLarge60 ? (
                      <div className="mb-8 w-full sm:mb-10">
                        <LayNGoLargePdpHeroVideo />
                      </div>
                    ) : null}
                    <ProductLifestyleGallery
                      key={product.id}
                      slides={layNGoLifestyleGallery.slides}
                      ariaLabel={layNGoLifestyleGallery.ariaLabel}
                      surfaceClassName={pdpUsesSiteBackground ? "bg-background" : "bg-neutral-50"}
                      frameClassName={
                        isLayNGoLite18 || isLayNGoLifestyle44
                          ? "rounded-none border-0 shadow-none"
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl border border-border bg-white shadow-inner aspect-video",
                      !cosmoYoutubeId && "bg-muted/40",
                    )}
                  >
                    {cosmoYoutubeId ? (
                      <PausableAutoplayEmbed
                        provider="youtube"
                        videoId={cosmoYoutubeId}
                        title="Product video"
                        iframeClassName="absolute inset-0 h-full w-full border-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/35 bg-muted/30 px-6 py-12 text-center">
                        <span className="font-heading text-xl font-semibold tracking-tight text-muted-foreground">
                          Video placeholder
                        </span>
                        <span className="max-w-sm text-sm text-muted-foreground">
                          Drop in an embed when you&apos;re ready: the layout is sized for 16×9.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {isLayNGoPlayReviewsPdp(product.handle) ? <LayNGoPlayAwardsSection /> : null}

            {isCosmoStoryPdp ? <CosmoPdpVideoGallery /> : null}

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
                {!hasColorChoices && productReviewsSummary ? (
                  <div className="mt-3">{productReviewsSummary}</div>
                ) : null}
                <p className={cn("text-2xl font-bold text-primary", productReviewsSummary && !hasColorChoices ? "mt-3" : "mt-2")}>
                  ${priceDisplay}
                </p>
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

        {productFaqSection ? (
          <section
            className="mx-auto mt-14 w-full max-w-4xl sm:mt-16"
            aria-label={productFaqSection.ariaLabel}
          >
            <h2
              id="product-faq-heading"
              className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {productFaqSection.heading}
            </h2>
            <Accordion
              type="single"
              collapsible
              className={cn(
                "mt-5 rounded-2xl border border-border px-4 sm:px-6",
                isLayNGoLite18 ? "bg-background" : "bg-white",
              )}
            >
              {productFaqSection.items.map((item, idx) => (
                <AccordionItem
                  key={item.question}
                  value={`${productFaqSection.idPrefix}-${idx}`}
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

        {nativeCustomerReviews && product ? (
          <CustomerReviewsSection reviews={nativeCustomerReviews} productHandle={product.handle} />
        ) : null}

        {!nativeCustomerReviews && amazonReviewsBundle.reviews.length > 0 ? (
          <ProductAmazonReviews
            reviews={amazonReviewsBundle.reviews}
            amazonListingUrl={amazonReviewsBundle.amazonListingUrl}
          />
        ) : null}

      </main>

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
              <ButtonSpinner label="Adding to cart" />
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

          {stickyConfirmPreviewUrl ? (
            <div className="mx-auto flex w-full max-w-[220px] justify-center sm:max-w-[260px]">
              <img
                src={stickyConfirmPreviewUrl}
                alt={`${product.title} color preview`}
                className="h-auto max-h-[min(42vh,280px)] w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ) : null}

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
                      "relative h-10 w-10 shrink-0 rounded-full bg-muted/25 transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      choice.idx === selectedVariantIdx
                        ? "ring-2 ring-neutral-900 ring-offset-[3px] ring-offset-white"
                        : "ring-0",
                      !choice.node.availableForSale ? "opacity-40" : "",
                    )}
                    style={pdpColorCircleSwatchStyle(product.handle, isCosmoMini16, choice.rawValue, choice.node)}
                    disabled={!choice.node.availableForSale}
                    aria-label={
                      !choice.node.availableForSale
                        ? `${choice.displayValue}, unavailable`
                        : choice.displayValue
                    }
                    title={choice.displayValue}
                    aria-pressed={choice.idx === selectedVariantIdx}
                  >
                    {!choice.node.availableForSale ? (
                      <span
                        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
                        aria-hidden
                      >
                        <span className="h-[2px] w-[140%] rotate-45 bg-foreground/55" />
                      </span>
                    ) : null}
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
                <ButtonSpinner label="Adding to cart" />
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

type VariantNode = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

/** Color circles for PDP pickers: fabric swatch or solid fill, never the variant hero photo. */
function pdpColorCircleSwatchStyle(
  handle: string,
  isCosmoMini16Product: boolean,
  rawValue: string,
  variant: VariantNode,
): CSSProperties {
  if (isCosmoMini16Product) return cosmoMiniSwatchStyle(variant);
  const h = handle.toLowerCase();
  if (isCosmo20Product(handle)) return getCosmo20SwatchBackgroundStyle(rawValue, undefined);
  if (isCosmo22Product(handle)) {
    const def = COSMO_22_SWATCHES.find((s) => s.shopifyColor === rawValue);
    return getCosmo22SwatchStyle(def, rawValue);
  }
  if (isNailspa18Product(handle)) return getNailspa18SwatchBackgroundStyle(rawValue, undefined);
  if (h === "lay-n-go-travel-dog-bed-44") return dogBedSwatchStyle(rawValue);
  if (h === "lay-n-go-traveler-20") return travelerSwatchStyle(rawValue);
  if (isLayNGoPlayMatProduct(handle)) return layNGoPlayMatSwatchStyle(rawValue);
  return { backgroundColor: colorNameToApproximateHex(rawValue) };
}

function pdpColorHeroPreviewUrl(
  product: ShopifyProduct["node"],
  variant: VariantNode,
  isCosmoMini16Product: boolean,
): string | null {
  const color = variant.selectedOptions.find((o) => isColorOptionName(o.name))?.value ?? "";
  if (isCosmoMini16Product) {
    if (isCosmoBlackVariant(variant)) return variant.image?.url ?? null;
    return COSMO_MINI_CROSSMARKS_HERO;
  }
  if (isCosmo20Product(product.handle)) return getCosmo20HeroImageUrls(color, variant)[0] ?? null;
  if (isCosmo22Product(product.handle)) return getCosmo22HeroImageUrls(color, variant)[0] ?? null;
  if (isNailspa18Product(product.handle)) return getNailspa18HeroImageUrls(color, variant)[0] ?? null;
  return variant.image?.url ?? null;
}

function cosmoMiniSwatchStyle(
  v: VariantNode,
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

/** Pet Solutions dog bed: Navy before Burgundy Chocolate (red) in swatch order. */
function dogBedColorSortKey(optionValue: string): number {
  return optionValue.trim().toLowerCase().includes("navy") ? 0 : 1;
}

/** Lay-n-Go Travel Dog Bed (44″): solid swatches aligned to product fabric (Burgundy Chocolate / Navy). */
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

function isColorOptionName(name: string): boolean {
  return /color|colour/i.test(name);
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
