import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { heroCategories, pressFeatures, testimonials } from "@/lib/siteNav";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";

const HERO_BG =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=80";

const Index = () => {
  const [collections, setCollections] = useState<ShopifyCollectionSummary[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    fetchCollections(50)
      .then((raw) => setCollections(sortCollectionsForDisplay(raw)))
      .catch(console.error)
      .finally(() => setCollectionsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <div className="bg-primary text-primary-foreground text-center text-xs sm:text-sm py-2.5 px-4 font-medium">
        SPRING DISCOUNT — 15% off with code <span className="font-mono tracking-wide">SPRING2026</span> at checkout on{" "}
        <a href="https://www.layngo.com" className="underline hover:opacity-90">
          layngo.com
        </a>
        . Thank you for supporting Lay-n-Go!
      </div>

      <Header variant="light" />

      {/* Hero */}
      <section className="relative border-b border-sky-200/80 min-h-[420px] md:min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          role="img"
          aria-label="Lifestyle background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/55 to-slate-900/35" />
        <div className="relative container py-16 md:py-24">
          <div className="max-w-2xl space-y-6 text-white">
            <p className="text-primary-foreground/90 text-sm font-semibold tracking-widest uppercase">
              Innovative organizational solutions
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight drop-shadow-sm">
              For Life, Play &amp; Travel
            </h1>
            <p className="text-lg text-white/90 max-w-md drop-shadow-sm">
              Lay-n-Go is a patented activity mat, cleanup, storage and carryall in one — perfect at home, durable on the
              road.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {heroCategories.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-semibold tracking-wide transition-colors"
                >
                  <span className="block text-xs text-white/80">{c.hint}</span>
                  {c.label}
                </Link>
              ))}
            </div>
            <Link to="/collections">
              <button
                type="button"
                className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-lg"
              >
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">Shop by category</h2>
        <p className="text-slate-600 text-center max-w-xl mx-auto mb-10">
          Cosmetic bags, tech &amp; travel, play, pets, outdoor / tactical, and nail solutions.
        </p>
        {collectionsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </section>

      {/* Our story */}
      <section className="border-y border-sky-200/80 bg-sky-50/80">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold text-slate-900">Our story</h2>
            <p className="text-slate-600 leading-relaxed">
              From toy cleanup to cosmetics, tech, nails, pets, and tactical gear — every Lay-n-Go product opens flat for
              full visibility and cinches closed for travel. Women-owned, built on utility patents, and trusted by
              customers who are tired of digging through dark bags.
            </p>
            <Link
              to="/pages/about-us"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Learn more
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden border border-sky-200 shadow-sm aspect-video bg-muted">
            <img
              src="https://images.unsplash.com/photo-1596462505698-0996edbe7a88?auto=format&fit=crop&w=1200&q=80"
              alt="Organized cosmetics flat lay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Top selling */}
      <section id="products" className="container py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">Top selling products</h2>
            <p className="text-slate-600 mt-2">Some of our most popular selections</p>
          </div>
          <Link to="/collections" className="text-primary text-sm font-semibold hover:underline shrink-0">
            View all collections →
          </Link>
        </div>
        <ProductGrid fetchFirst={8} />
      </section>

      {/* Testimonials */}
      <section className="border-t border-sky-200/80 bg-white/40 py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Testimonials</h2>
          <p className="text-slate-600 text-center mb-10 max-w-lg mx-auto">What customers say about Lay-n-Go</p>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-5xl mx-auto relative px-8 md:px-14"
          >
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2">
                  <blockquote className="h-full rounded-lg border border-sky-200 bg-sky-50/90 p-6 shadow-sm">
                    <p className="text-slate-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                    <footer className="mt-4 text-sm font-semibold text-slate-900">— {t.name}</footer>
                  </blockquote>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 border-sky-300 text-slate-800" />
            <CarouselNext className="right-0 border-sky-300 text-slate-800" />
          </Carousel>
        </div>
      </section>

      {/* Press */}
      <section className="container py-16">
        <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Featured press</h2>
        <p className="text-slate-600 text-center mb-10">Keep up with what Lay-n-Go is up to</p>
        <div className="grid md:grid-cols-3 gap-6">
          {pressFeatures.map((p) => (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-sky-200 bg-white/60 p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.source}</p>
              <h3 className="font-heading text-lg font-semibold text-slate-900 mt-2">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{p.description}</p>
              <span className="text-sm text-primary font-medium mt-4 inline-block">Read →</span>
            </a>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link to="/pages/press" className="text-primary font-semibold hover:underline">
            View all press
          </Link>
        </p>
      </section>

      <SiteFooter variant="light" />
    </div>
  );
};

export default Index;
