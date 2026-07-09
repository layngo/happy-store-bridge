import { useEffect, useState } from "react";
import { fetchCollectionByHandle, fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  /** When set, grid does not fetch: uses this list (e.g. collection page after one query). */
  prefetchedProducts?: ShopifyProduct[];
  /** Load products belonging to this collection handle (Storefront API). */
  collectionHandle?: string;
  /** When fetching all products (home / search-style), limit count. */
  fetchFirst?: number;
  /** Product card visual treatment. */
  cardVariant?: "default" | "imageOverlay";
  /** Override default grid layout classes. */
  gridClassName?: string;
  /** GA4 item_list_name passed to product cards. */
  listName?: string;
}

export const ProductGrid = ({
  prefetchedProducts,
  collectionHandle,
  fetchFirst,
  cardVariant = "default",
  gridClassName,
  listName,
}: ProductGridProps = {}) => {
  const [products, setProducts] = useState<ShopifyProduct[]>(prefetchedProducts ?? []);
  const [loading, setLoading] = useState(prefetchedProducts === undefined);

  useEffect(() => {
    if (prefetchedProducts !== undefined) {
      setProducts(prefetchedProducts);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const run = async () => {
      try {
        if (collectionHandle) {
          const col = await fetchCollectionByHandle(collectionHandle, 48);
          if (!cancelled) setProducts(col?.products ?? []);
        } else {
          const list = await fetchProducts(fetchFirst ?? 20);
          if (!cancelled) setProducts(list);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [prefetchedProducts, collectionHandle, fetchFirst]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-muted-foreground text-sm mt-2">Add products in the chat to get started.</p>
      </div>
    );
  }

  return (
    <div
      className={
        gridClassName ??
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch auto-rows-fr"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.node.id} product={product} variant={cardVariant} listName={listName} />
      ))}
    </div>
  );
};
