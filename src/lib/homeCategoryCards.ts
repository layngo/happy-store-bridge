/** Home “Shop by Category” tile copy + typography (matches brand mockups). */
export type HomeCategoryFont = "cosmo" | "nailspa" | "tech" | "play" | "tactical" | "pet";

export type HomeCategoryCardConfig = {
  label: string;
  /** When set, renders as stacked lines (e.g. OUTDOOR / TACTICAL). */
  labelLines?: readonly [string, string];
  font: HomeCategoryFont;
  videoId?: string;
  hoverSrc?: string;
  linkTo?: string;
};

export const HOME_CATEGORY_FONT_CLASS: Record<HomeCategoryFont, string> = {
  cosmo: "home-cat-label--cosmo",
  nailspa: "home-cat-label--nailspa",
  tech: "home-cat-label--tech",
  play: "home-cat-label--play",
  tactical: "home-cat-label--tactical",
  pet: "home-cat-label--pet",
};

const NAILSPA_PRODUCT_PATH = "/product/lay-n-go-nailspa-18";
const TRAVELER_PRODUCT_PATH = "/product/lay-n-go-traveler-20";
const TRAVEL_DOG_BED_PRODUCT_PATH = "/product/lay-n-go-travel-dog-bed-44";

export const HOME_CATEGORY_BY_HANDLE: Record<string, HomeCategoryCardConfig> = {
  "cosmetic-bags": {
    label: "COSMETICS",
    font: "cosmo",
    videoId: "1188306142",
    hoverSrc:
      "https://www.layngo.com/cdn/shop/products/B00B04V3PQ.PT01_1200x1200.jpg?v=1670376558",
  },
  "nail-solutions": {
    label: "NAILSPA",
    font: "nailspa",
    videoId: "1188306129",
    hoverSrc:
      "https://www.layngo.com/cdn/shop/products/B082LQ788D.PT01_1200x1200.jpg?v=1626120523",
    linkTo: NAILSPA_PRODUCT_PATH,
  },
  "technology": {
    label: "TECH + TRAVEL",
    font: "tech",
    linkTo: TRAVELER_PRODUCT_PATH,
  },
  "play": {
    label: "PLAY",
    font: "play",
  },
  "military-first-responder": {
    label: "Outdoor / Tactical",
    labelLines: ["OUTDOOR", "TACTICAL"],
    font: "tactical",
    videoId: "1188297111",
    hoverSrc:
      "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/B08SKHPY36.PT06.jpg?v=1626119977",
  },
  "pet-solutions": {
    label: "PETS",
    font: "pet",
    videoId: "1188297775",
    hoverSrc:
      "https://www.layngo.com/cdn/shop/products/B08MV2JM98.PT01_1200x1200.jpg?v=1626120624",
    linkTo: TRAVEL_DOG_BED_PRODUCT_PATH,
  },
};

export function getHomeCategoryConfig(handle: string): HomeCategoryCardConfig | undefined {
  return HOME_CATEGORY_BY_HANDLE[handle];
}
