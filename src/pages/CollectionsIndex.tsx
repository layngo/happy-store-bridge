import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { Header } from "@/components/Header";
import { CollectionCard } from "@/components/CollectionCard";
import { Loader2, ChevronRight, Home } from "lucide-react";

const CollectionsIndex = () => {
  const [collections, setCollections] = useState<ShopifyCollectionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections(50)
      .then((raw) => setCollections(sortCollectionsForDisplay(raw)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Collections</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Collections</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Browse Lay-n-Go products by category — cosmetic bags, play mats, travel, pets, and more.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : collections.length === 0 ? (
          <p className="text-muted-foreground text-center py-24">No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsIndex;
