import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageSeo } from "@/components/PageSeo";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { searchEvent } from "@/lib/analytics";

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() || "";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => q, [q]);

  useEffect(() => {
    setLoading(true);
    fetchProducts(48, query || undefined)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    if (!query || loading) return;
    searchEvent(query);
  }, [query, loading]);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <PageSeo
        title={query ? `Search: ${query}` : "Search Products"}
        description={
          query
            ? `Search results for "${query}" on Lay-n-Go: patented drawstring cosmetic bags, play mats, travel organizers, and more.`
            : "Search Lay-n-Go products: Cosmo makeup bags, Play mats, Traveler tech bags, pet beds, and tactical gear."
        }
        pathname={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
        noindex={Boolean(query)}
      />
      <Header />
      <main id="main-content" className="flex-1 container py-10">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Search</h1>

        <section aria-label="Product search" className="mb-8 max-w-md">
          <SearchBar defaultQuery={query} />
        </section>

        {query ? (
          <p className="text-muted-foreground mb-8" role="status">
            Results for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
          </p>
        ) : (
          <p className="text-muted-foreground mb-8">
            Search by product name or browse all products below.
          </p>
        )}

        {loading ? (
          <LoadingSpinner label="Loading search results" />
        ) : products.length === 0 ? (
          <p className="text-muted-foreground py-12" role="status">
            No products matched. Try a different term or{" "}
            <Link to="/collections" className="text-primary hover:underline">
              view collections
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} listName={`Search: ${query}`} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Search;
