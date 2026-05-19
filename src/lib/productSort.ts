import type { ShopifyProduct } from "@/lib/shopify";

export type ProductSortKey =
  | "featured"
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "date-new"
  | "date-old";

/** Play collection featured order: smallest mat first, largest last. */
const PLAY_COLLECTION_FEATURED_ORDER = [
  "lay-n-go-lite-18",
  "lay-n-go-lifestyle-44",
  "lay-n-go-large-60",
] as const;

export function sortPlayCollectionFeatured(products: ShopifyProduct[]): ShopifyProduct[] {
  const rank = new Map<string, number>(
    PLAY_COLLECTION_FEATURED_ORDER.map((handle, index) => [handle, index]),
  );
  return [...products].sort((a, b) => {
    const ra = rank.get(a.node.handle.toLowerCase()) ?? PLAY_COLLECTION_FEATURED_ORDER.length;
    const rb = rank.get(b.node.handle.toLowerCase()) ?? PLAY_COLLECTION_FEATURED_ORDER.length;
    if (ra !== rb) return ra - rb;
    return a.node.title.localeCompare(b.node.title);
  });
}

export function sortProductsList(
  products: ShopifyProduct[],
  key: ProductSortKey,
  collectionHandle?: string,
): ShopifyProduct[] {
  const list = [...products];
  const price = (p: ShopifyProduct) => parseFloat(p.node.priceRange.minVariantPrice.amount);

  switch (key) {
    case "title-asc":
      return list.sort((a, b) => a.node.title.localeCompare(b.node.title));
    case "title-desc":
      return list.sort((a, b) => b.node.title.localeCompare(a.node.title));
    case "price-asc":
      return list.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return list.sort((a, b) => price(b) - price(a));
    case "date-new":
      return list.sort(
        (a, b) =>
          new Date(b.node.createdAt || 0).getTime() - new Date(a.node.createdAt || 0).getTime(),
      );
    case "date-old":
      return list.sort(
        (a, b) =>
          new Date(a.node.createdAt || 0).getTime() - new Date(b.node.createdAt || 0).getTime(),
      );
    default:
      if (collectionHandle?.toLowerCase() === "play") {
        return sortPlayCollectionFeatured(list);
      }
      return list;
  }
}

export function filterProductsBySlug(products: ShopifyProduct[], filterSlug: string): ShopifyProduct[] {
  const raw = filterSlug.toLowerCase();
  const spaced = raw.replace(/-/g, " ");

  return products.filter((p) => {
    if (p.node.handle.toLowerCase().includes(raw)) return true;
    return p.node.tags.some((t) => {
      const tl = t.toLowerCase();
      const slug = tl.replace(/\s+/g, "-");
      return tl.includes(spaced) || slug === raw || tl.includes(raw);
    });
  });
}
