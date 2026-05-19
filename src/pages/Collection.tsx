import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { Loader2, ChevronRight, Home } from "lucide-react";
import { sortProductsList, type ProductSortKey } from "@/lib/productSort";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Collection = () => {
  const { handle } = useParams<{ handle: string; filterSlug?: string }>();
  const [collection, setCollection] = useState<ShopifyCollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<ProductSortKey>("featured");

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCollectionByHandle(handle, 250)
      .then(setCollection)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  const displayProducts = useMemo(() => {
    if (!collection) return [];
    return sortProductsList(collection.products, sortKey, handle);
  }, [collection, sortKey, handle]);

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

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-20 text-center flex-1">
          <p className="text-muted-foreground text-lg">Collection not found</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View all collections
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to={`/collections/${handle}`} className="hover:text-foreground transition-colors">
            {collection.title}
          </Link>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{collection.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
            <Label className="text-muted-foreground whitespace-nowrap sr-only sm:not-sr-only sm:inline">
              Sort by
            </Label>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as ProductSortKey)}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="title-asc">Alphabetically, A–Z</SelectItem>
                <SelectItem value="title-desc">Alphabetically, Z–A</SelectItem>
                <SelectItem value="price-asc">Price, low to high</SelectItem>
                <SelectItem value="price-desc">Price, high to low</SelectItem>
                <SelectItem value="date-new">Date, new to old</SelectItem>
                <SelectItem value="date-old">Date, old to new</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""} found
          </p>
          <ProductGrid prefetchedProducts={displayProducts} />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Collection;
