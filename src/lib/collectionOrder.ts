import type { ShopifyCollectionSummary } from "@/lib/shopify";

const PRIMARY_ORDER = [
  "cosmetic-bags",
  "nail-solutions",
  "military-first-responder",
  "pet-solutions",
  "play",
  "technology",
  "frontpage",
];

export function sortCollectionsForDisplay(cols: ShopifyCollectionSummary[]) {
  return [...cols].sort((a, b) => {
    const ia = PRIMARY_ORDER.indexOf(a.handle);
    const ib = PRIMARY_ORDER.indexOf(b.handle);
    if (ia !== -1 || ib !== -1) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    return a.title.localeCompare(b.title);
  });
}
