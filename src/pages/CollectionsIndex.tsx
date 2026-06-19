import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageSeo } from "@/components/PageSeo";
import { breadcrumbJsonLd, itemListJsonLd, webPageJsonLd } from "@/lib/siteSeo";
import { shopCollectionLinks } from "@/lib/siteNav";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { CollectionCard } from "@/components/CollectionCard";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ChevronRight, Home } from "lucide-react";

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
    <div className="min-h-dvh bg-background flex flex-col">
      <PageSeo
        title="Shop Collections"
        description="Browse all Lay-n-Go collections: Cosmo cosmetic bags, Play toy mats, Tech & Travel, Nail Solutions, Pet gear, and Outdoor / Tactical organizers."
        pathname="/collections"
        keywords="Lay-n-Go collections, shop cosmetic bags, play mats, travel organizers"
        jsonLd={[
          webPageJsonLd(
            "Shop Collections",
            "Browse all Lay-n-Go collections: Cosmo cosmetic bags, Play toy mats, Tech & Travel, Nail Solutions, Pet gear, and Outdoor / Tactical organizers.",
            "/collections",
          ),
          itemListJsonLd(
            "Lay-n-Go collections",
            shopCollectionLinks.map((l) => ({ name: l.label, url: l.to })),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
          ]),
        ]}
      />
      <Header />
      <main id="main-content" className="container py-8 flex-1">
        <PageBreadcrumb className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden />
          <span className="text-foreground font-medium" aria-current="page">
            Collections
          </span>
        </PageBreadcrumb>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Collections</h1>
        <p className="max-w-2xl mb-10 text-base font-medium leading-normal text-foreground/80">
          Browse Lay-n-Go products by category: cosmetic bags, play mats, travel, pets, and more.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading collections" />
        ) : displayCollections.length === 0 ? (
          <p className="text-muted-foreground text-center py-24">No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((c) => (
              <CollectionCard key={c.id} collection={c} variant="home" />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default CollectionsIndex;
