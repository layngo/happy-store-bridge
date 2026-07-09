import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageSeo } from "@/components/PageSeo";
import { breadcrumbJsonLd, absoluteUrl, itemListJsonLd, stripHtml, truncateText, webPageJsonLd } from "@/lib/siteSeo";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { sortProductsList, type ProductSortKey } from "@/lib/productSort";
import { viewItemList } from "@/lib/analytics";
import { productNodeToItem } from "@/lib/analyticsItems";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Home } from "lucide-react";

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

  useEffect(() => {
    if (!collection || displayProducts.length === 0) return;
    viewItemList(
      displayProducts.map((p, i) => productNodeToItem(p.node, { index: i, item_category: collection.title })),
      collection.title,
    );
  }, [collection, displayProducts]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center py-32">
          <LoadingSpinner label="Loading collection" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <Header />
        <main id="main-content" className="container py-20 text-center flex-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">Collection Not Found</h1>
          <p className="text-muted-foreground text-lg mt-2">We couldn't find that collection.</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View all collections
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <PageSeo
        title={collection.title}
        description={
          truncateText(stripHtml(collection.description || ""), 160) ||
          `Shop the ${collection.title} collection from Lay-n-Go: patented drawstring mats and organizers that open flat and cinch closed.`
        }
        pathname={`/collections/${handle}`}
        image={collection.image?.url}
        imageAlt={collection.image?.altText || `${collection.title} collection: Lay-n-Go`}
        keywords={`${collection.title}, Lay-n-Go collection, drawstring organizer`}
        jsonLd={[
          webPageJsonLd(
            collection.title,
            truncateText(stripHtml(collection.description || ""), 300) ||
              `Shop the ${collection.title} collection from Lay-n-Go.`,
            `/collections/${handle}`,
          ),
          itemListJsonLd(
            `${collection.title} products`,
            displayProducts.slice(0, 24).map((p) => ({
              name: p.node.title,
              url: `/product/${p.node.handle}`,
            })),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.title, path: `/collections/${handle}` },
          ]),
        ]}
      />
      <Header />
      <main id="main-content" className="container py-8 flex-1">
        <PageBreadcrumb className="mb-8 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
          <Link to={`/collections/${handle}`} className="hover:text-foreground transition-colors">
            {collection.title}
          </Link>
        </PageBreadcrumb>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{collection.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
            <Label htmlFor="collection-sort" className="text-muted-foreground whitespace-nowrap sr-only sm:not-sr-only sm:inline">
              Sort by
            </Label>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as ProductSortKey)}>
              <SelectTrigger id="collection-sort" className="w-full sm:w-[220px]" aria-label="Sort products">
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
          <ProductGrid prefetchedProducts={displayProducts} listName={collection.title} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Collection;
