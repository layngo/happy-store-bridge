import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { Loader2, ChevronRight, Home } from "lucide-react";
import { filterProductsBySlug, sortProductsList, type ProductSortKey } from "@/lib/productSort";
import { shopCollectionLinks } from "@/lib/siteNav";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const Collection = () => {
  const { handle, filterSlug } = useParams<{ handle: string; filterSlug?: string }>();
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

  const tagFilters = useMemo(() => {
    if (!collection) return [];
    const set = new Set<string>();
    collection.products.forEach((p) => p.node.tags.forEach((t) => t && set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [collection]);

  const displayProducts = useMemo(() => {
    if (!collection) return [];
    const base = filterSlug ? filterProductsBySlug(collection.products, filterSlug) : collection.products;
    return sortProductsList(base, sortKey);
  }, [collection, filterSlug, sortKey]);

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

  const hasHtml = /<[a-z][\s\S]*>/i.test(collection.description);

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
          {filterSlug ? (
            <>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-foreground font-medium capitalize">{filterSlug.replace(/-/g, " ")}</span>
            </>
          ) : null}
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

        {collection.description ? (
          hasHtml ? (
            <div
              className="text-muted-foreground leading-relaxed max-w-3xl mb-8 space-y-3 [&_a]:text-primary [&_a]:underline [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: collection.description }}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8 whitespace-pre-wrap">
              {collection.description}
            </p>
          )
        ) : null}

        <div className="grid lg:grid-cols-[minmax(0,200px)_1fr] gap-10 items-start">
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Filter by</h2>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    to={`/collections/${handle}`}
                    className={cn(
                      "block py-1.5 hover:text-primary transition-colors",
                      !filterSlug ? "text-primary font-medium" : "text-muted-foreground",
                    )}
                  >
                    Everything in {collection.title}
                  </Link>
                </li>
                {tagFilters.slice(0, 20).map((tag) => {
                  const s = slugifyTag(tag);
                  const active = filterSlug && filterSlug.toLowerCase() === s;
                  return (
                    <li key={tag}>
                      <Link
                        to={`/collections/${handle}/${encodeURIComponent(s)}`}
                        className={cn(
                          "block py-1.5 hover:text-primary transition-colors",
                          active ? "text-primary font-medium" : "text-muted-foreground",
                        )}
                      >
                        {tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Collections</h2>
              <ul className="space-y-1 text-sm">
                {shopCollectionLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={cn(
                        "block py-1.5 hover:text-primary transition-colors text-muted-foreground",
                        l.to === `/collections/${handle}` && "text-primary font-medium",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""} found
              {filterSlug ? (
                <>
                  {" "}
                  in <span className="text-foreground">{collection.title}</span>
                </>
              ) : null}
            </p>
            <ProductGrid prefetchedProducts={displayProducts} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Collection;
