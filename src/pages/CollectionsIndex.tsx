import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { CollectionCard } from "@/components/CollectionCard";
import { Loader2, ChevronRight, Home } from "lucide-react";

const CollectionsIndex = () => {
  const [collections, setCollections] = useState<ShopifyCollectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const displayCollections = useMemo(() => {
    return collections.filter((c) => {
      const handle = c.handle.toLowerCase();
      const title = c.title.toLowerCase();
      return handle !== "frontpage" && handle !== "homepage" && title !== "homepage";
    });
  }, [collections]);

  useEffect(() => {
    fetchCollections(50)
      .then((raw) => setCollections(sortCollectionsForDisplay(raw)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container py-8 flex-1">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Collections</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Collections</h1>
        <p className="max-w-2xl mb-10 text-base font-medium leading-normal text-foreground/80">
          Browse Lay-n-Go products by category: cosmetic bags, play mats, travel, pets, and more.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : displayCollections.length === 0 ? (
          <p className="text-muted-foreground text-center py-24">No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((c) => (
              <CollectionCard key={c.id} collection={c} variant="home" />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default CollectionsIndex;
