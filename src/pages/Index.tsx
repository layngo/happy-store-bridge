import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { testimonials } from "@/lib/siteNav";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";

const HERO_BG =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=80";

const PRESS_LOGOS = [
  {
    name: "BuzzFeed",
    src: "https://www.layngo.com/cdn/shop/files/BuzzFeed-Logo_160x160@2x.png?v=1613754525",
    href: "https://www.buzzfeed.com/jessicaprobus/store-it-good#.bma95m3qjl",
    imageClass: "scale-150",
  },
  {
    name: "Parents",
    src: "https://www.layngo.com/cdn/shop/files/parents-logo_160x160@2x.png?v=1613754525",
    href: "https://www.parents.com/parenting/work/entrepreneurial-moms/#page=2",
  },
  {
    name: "People",
    src: "https://www.layngo.com/cdn/shop/files/58481955cef1014c0b5e49b7_160x160@2x.png?v=1613754525",
    href: "https://people.com/style/youve-never-seen-a-makeup-bag-that-keeps-your-products-this-organized/",
  },
  {
    name: "Today Show",
    src: "https://www.layngo.com/cdn/shop/files/Today_show__2009-13__logo_160x160@2x.png?v=1613754527",
    href: "https://www.today.com/style/bobbies-buzz-3-great-gifts-girlfriends-2D11638370",
  },
  {
    name: "Lifehacker",
    src: "https://www.layngo.com/cdn/shop/files/Lifehacker.svg_05a1286a-376a-431d-9637-56c119ec882b_160x160@2x.png?v=1613754526",
    href: "https://lifehacker.com/lay-n-go-traveler-makes-finding-small-items-in-your-bag-1496408342",
  },
  {
    name: "Elvis Duran",
    src: "https://www.layngo.com/cdn/shop/files/5936f3c13b94cd5f41653cb8_160x160@2x.png?v=1613754526",
    href: "https://elvisduran.iheart.com/articles/whats-trending-461825/whats-trending-december-11th-13055859/",
    imageClass: "scale-125",
  },
  {
    name: "Red Tricycle",
    src: "https://www.layngo.com/cdn/shop/files/image_160x160@2x.jpg?v=1613754527",
    href: "https://redtri.com/ways-to-organize-your-legos/?utm_source=FB&utm_medium=NATL&utm_campaign=FB-NATL#",
    imageClass: "scale-150 mix-blend-darken contrast-125",
  },
  {
    name: "Gizmodo",
    src: "https://www.layngo.com/cdn/shop/files/5847f9a4cef1014c0b5e48c3_160x160@2x.png?v=1613754527",
    href: "https://www.gizmodo.com.au/2013/12/the-perfect-toiletry-bag-for-those-morally-opposed-to-organization/",
  },
];

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="light" />

      {/* Hero */}
      <section className="relative border-b border-border min-h-[420px] md:min-h-[540px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          role="img"
          aria-label="Organized makeup products"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/45 to-slate-800/40" />
        <div className="relative container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-20 md:space-y-24 text-white">
            <h1
              className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight drop-shadow-sm"
              style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
            >
              Organizational Solutions for Life, Play, and Travel
            </h1>
            <Link to="/collections">
              <button
                type="button"
                className="bg-primary text-primary-foreground px-9 py-3 rounded-full text-sm md:text-base font-semibold tracking-wide hover:bg-primary/90 transition-colors shadow-lg"
              >
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-medium uppercase tracking-[0.14em] text-foreground text-center mb-2">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10">
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

      {/* Press logos */}
      <section className="pb-14">
        <div className="container">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-6">
            Featured In
          </p>
          <div className="overflow-hidden rounded-full border border-border bg-card/70 py-4">
            <div className="press-carousel-track">
              {[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
                <a
                  key={`${logo.name}-${i}`}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-5 inline-flex h-20 w-40 sm:h-24 sm:w-44 shrink-0 items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className={`h-10 w-28 sm:h-12 sm:w-32 object-contain opacity-95 transition-transform ${logo.imageClass ?? ""}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="border-y border-border bg-muted/30">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-medium uppercase tracking-[0.12em] text-foreground">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              From toy cleanup to cosmetics, tech, nails, pets, and tactical gear, every Lay-n-Go product opens flat for
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
          <div className="rounded-lg overflow-hidden border border-border shadow-sm aspect-video bg-muted">
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
            <h2 className="font-heading text-3xl font-medium uppercase tracking-[0.12em] text-foreground">Top Selling Products</h2>
            <p className="text-muted-foreground mt-2">Some of our most popular selections</p>
          </div>
          <Link to="/collections" className="text-primary text-sm font-semibold hover:underline shrink-0">
            View all collections
          </Link>
        </div>
        <ProductGrid fetchFirst={8} />
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-background py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-medium uppercase tracking-[0.12em] text-foreground text-center mb-2">
            Testimonials
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">What customers say about Lay-n-Go</p>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-5xl mx-auto relative px-8 md:px-14"
          >
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2">
                  <blockquote className="h-full rounded-lg border border-border bg-card p-6 shadow-sm">
                    <p className="text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                    <footer className="mt-4 text-sm font-semibold text-foreground">{t.name}</footer>
                  </blockquote>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 border-border text-foreground" />
            <CarouselNext className="right-0 border-border text-foreground" />
          </Carousel>
        </div>
      </section>

      <SiteFooter variant="light" />
    </div>
  );
};

export default Index;
