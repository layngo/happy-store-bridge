import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollectionByHandle, type ShopifyCollectionDetail } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { Loader2, ChevronRight, Home } from "lucide-react";

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<ShopifyCollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCollectionByHandle(handle, 48)
      .then(setCollection)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Collection not found</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View all collections
          </Link>
        </div>
      </div>
    );
  }

  const hasHtml = /<[a-z][\s\S]*>/i.test(collection.description);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
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
          <span className="text-foreground font-medium">{collection.title}</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{collection.title}</h1>

        {collection.description ? (
          hasHtml ? (
            <div
              className="text-muted-foreground leading-relaxed max-w-3xl mb-10 space-y-3 [&_a]:text-primary [&_a]:underline [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: collection.description }}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-10 whitespace-pre-wrap">
              {collection.description}
            </p>
          )
        ) : null}

        <ProductGrid prefetchedProducts={collection.products} />
      </div>
    </div>
  );
};

export default Collection;
