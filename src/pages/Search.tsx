import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Search</h1>
        {query ? (
          <p className="text-muted-foreground mb-8">
            Results for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
          </p>
        ) : (
          <p className="text-muted-foreground mb-8">Enter a search term in the header, or browse all products below.</p>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground py-12">
            No products matched. Try a different term or{" "}
            <Link to="/collections" className="text-primary hover:underline">
              view collections
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Search;
