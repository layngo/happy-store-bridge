export type SearchSuggestion = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  /** Extra terms for matching — product names, categories, nicknames, etc. */
  keywords: readonly string[];
};

export const SEARCH_CATALOG: readonly SearchSuggestion[] = [
  {
    title: 'Lay-n-Go Cosmo 20"',
    subtitle: "Cosmetic & makeup bag",
    href: "/product/lay-n-go-cosmo-20",
    image: "/cosmetic-bags-v2/cosmo-20.png",
    keywords: ["cosmo", "cosmetic", "cosmetics", "makeup", "make up", "beauty", "bag", "20", "best seller"],
  },
  {
    title: 'Lay-n-Go Cosmo Deluxe 22"',
    subtitle: "Roomier cosmetic bag",
    href: "/product/lay-n-go-cosmo-deluxe-22",
    image: "/cosmetic-bags-v2/cosmo-22.png",
    keywords: ["cosmo", "deluxe", "cosmetic", "makeup", "beauty", "22", "large cosmetic"],
  },
  {
    title: "Cosmetic Bags",
    subtitle: "Compare Cosmo 16\", 20\" & Deluxe 22\"",
    href: "/shop/cosmetic-bags-v2",
    image: "/cosmetic-bags-v2/cosmo-20.png",
    keywords: ["cosmetic", "cosmetics", "cosmo", "makeup", "beauty", "bags", "shop"],
  },
  {
    title: 'Lay-n-Go Large 60"',
    subtitle: "Activity & toy cleanup mat",
    href: "/product/lay-n-go-large-60",
    image: "/products/lay-n-go-large-pdp/hero-callout-main.png",
    keywords: ["large", "60", "play", "lego", "toy", "toys", "mat", "cleanup", "kids", "activity"],
  },
  {
    title: 'Lay-n-Go Lite 18"',
    subtitle: "Lightweight play mat",
    href: "/product/lay-n-go-lite-18",
    image: "/products/lay-n-go-lite-18/hero-callout-main.png",
    keywords: ["lite", "light", "18", "play", "lego", "toy", "mat", "green"],
  },
  {
    title: 'Lay-n-Go Lifestyle 44"',
    subtitle: "Everyday carry & travel",
    href: "/product/lay-n-go-lifestyle-44",
    image: "/products/lay-n-go-lifestyle-44/hero-callout-main.png",
    keywords: ["lifestyle", "44", "travel", "everyday", "carry"],
  },
  {
    title: 'Lay-n-Go Traveler 20"',
    subtitle: "Tech & travel organizer",
    href: "/product/lay-n-go-traveler-20",
    image: "/products/lay-n-go-traveler-20/traveler-gallery-1.png",
    keywords: ["traveler", "travel", "tech", "technology", "laptop", "charger", "cable", "electronic", "20", "traveller"],
  },
  {
    title: 'Lay-n-Go Nailspa 18"',
    subtitle: "Nail polish & manicure organizer",
    href: "/product/lay-n-go-nailspa-18",
    image: "/products/lay-n-go-nailspa-18/heroes/violet-femme.png",
    keywords: ["nailspa", "nail", "nails", "manicure", "polish", "salon", "18", "spa"],
  },
  {
    title: 'Lay-n-Go Defender Mini 16"',
    subtitle: "Compact tactical organizer",
    href: "/product/lay-n-go-defender-mini-16",
    image: "/products/lay-n-go-defender-mini-16/hero-callout-main.png",
    keywords: ["defender", "mini", "16", "tactical", "military", "outdoor", "edc", "duty", "first responder", "army", "green"],
  },
  {
    title: 'Lay-n-Go Tactical Bag 20"',
    subtitle: "Outdoor / duty gear bag",
    href: "/product/lay-n-go-tactical-bag-20",
    image: "/products/lay-n-go-tactical-bag-20/hero-callout-main.png",
    keywords: ["tactical", "defender", "20", "military", "outdoor", "duty", "first responder", "edc", "army", "patch", "flag"],
  },
  {
    title: "Outdoor / Tactical",
    subtitle: "Military & first responder collection",
    href: "/collections/military-first-responder",
    image: "/military-first-responder-v2/defender-tactical-20.png",
    keywords: ["tactical", "defender", "military", "outdoor", "first responder", "duty", "army", "edc", "collection"],
  },
  {
    title: 'Lay-n-Go Travel Dog Bed 44"',
    subtitle: "Portable pet mat & bed",
    href: "/product/lay-n-go-travel-dog-bed-44",
    image: "/products/lay-n-go-travel-dog-bed-44/gallery-1.png",
    keywords: ["pet", "pets", "dog", "dogs", "bed", "travel", "44", "puppy", "animal"],
  },
  {
    title: "Play Mats",
    subtitle: "Toy cleanup & activity mats",
    href: "/collections/play",
    image: "/products/lay-n-go-large-pdp/play-blue.png",
    keywords: ["play", "lego", "toy", "toys", "mat", "kids", "cleanup", "collection"],
  },
] as const;

/** Shown when the field is focused with no query. */
export const DEFAULT_SEARCH_SUGGESTIONS: readonly SearchSuggestion[] = [
  SEARCH_CATALOG[0],
  SEARCH_CATALOG[2],
  SEARCH_CATALOG[3],
  SEARCH_CATALOG[6],
  SEARCH_CATALOG[8],
  SEARCH_CATALOG[9],
];

const MAX_SUGGESTIONS = 8;

function normalize(text: string) {
  return text.toLowerCase().replace(/['"]/g, "").trim();
}

function scoreSuggestion(item: SearchSuggestion, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const haystacks = [
    item.title,
    item.subtitle,
    ...item.keywords,
    item.href.replace(/^\/product\//, "").replace(/^\/collections\//, "").replace(/\//g, " "),
  ].map(normalize);

  let score = 0;

  for (const text of haystacks) {
    if (text === q) score += 100;
    else if (text.startsWith(q)) score += 40;
    else if (text.includes(q)) score += 20;

    for (const word of text.split(/[\s\-_/]+/)) {
      if (!word) continue;
      if (word === q) score += 50;
      else if (word.startsWith(q)) score += 30;
      else if (word.includes(q)) score += 12;
    }
  }

  return score;
}

export function filterSearchSuggestions(query: string, limit = MAX_SUGGESTIONS): SearchSuggestion[] {
  const trimmed = query.trim();
  if (!trimmed) return [...DEFAULT_SEARCH_SUGGESTIONS];

  const ranked = SEARCH_CATALOG.map((item) => ({ item, score: scoreSuggestion(item, trimmed) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map(({ item }) => item);
}
