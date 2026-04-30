import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { testimonials } from "@/lib/siteNav";
import { Loader2 } from "lucide-react";

const VIMEO_PLAYER_SCRIPT = "https://player.vimeo.com/api/player.js";

const VIMEO_EMBED_SRC =
  "https://player.vimeo.com/video/1185281289?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1";
const OUR_STORY_IMAGE =
  "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/19146/images/S8Fu3O6AS2qM9Et6DQQ0__114727158_5b0d4ae5-b34a-4ac9-ba03-d81b128ed670.jpg";

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
  const displayCollections = collections.filter((c) => {
    const handle = c.handle.toLowerCase();
    const title = c.title.toLowerCase();
    return handle !== "frontpage" && handle !== "homepage" && title !== "homepage";
  });

  useEffect(() => {
    fetchCollections(50)
      .then((raw) => setCollections(sortCollectionsForDisplay(raw)))
      .catch(console.error)
      .finally(() => setCollectionsLoading(false));
  }, []);

  useEffect(() => {
    const id = "vimeo-player-api";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = VIMEO_PLAYER_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="light" />

      {/* Hero — ~20:9 frame (slightly taller than 21:9) reveals more of the 16:9 Vimeo crop; full width */}
      <section className="relative w-full border-b border-border bg-black">
        <div className="relative aspect-[20/9] w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 aspect-video w-full -translate-y-1/2">
            <iframe
              src={VIMEO_EMBED_SRC}
              title="Lay-n-Go"
              frameBorder={0}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex={-1}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              aria-hidden
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/25 to-black/15"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-5 text-center sm:gap-5 sm:px-8">
            <h1 className="font-heading text-xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-2xl md:text-3xl lg:text-4xl">
              Organizational Solutions
              <br />
              for Life, Play, and Travel
            </h1>
            <div className="pointer-events-auto">
              <Link to="/collections">
                <button
                  type="button"
                  className="bg-primary text-primary-foreground rounded-full px-8 py-2.5 text-sm font-semibold tracking-wide shadow-lg transition-colors hover:bg-primary/90 md:px-9 md:py-3 md:text-base"
                >
                  Shop Now
                </button>
              </Link>
            </div>
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
            {displayCollections.map((c) => (
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
      <section className="border-y border-border bg-muted/20">
        <div className="container py-16">
          <Link to="/pages/about-us" className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-border/80 shadow-sm">
              <div className="aspect-[16/8] md:aspect-[21/9] bg-muted">
                <img
                  src={OUR_STORY_IMAGE}
                  alt="Lay-n-Go founder story"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-white/50" />
              <div className="absolute inset-0 flex items-end">
                <div className="p-6 sm:p-8 md:p-10">
                  <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-[0.08em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:-translate-y-1 group-hover:tracking-[0.11em] group-hover:text-slate-900 group-hover:drop-shadow-none">
                    Our Story
                  </h2>
                </div>
              </div>
            </article>
          </Link>

          <p className="mt-5 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            From toy cleanup to cosmetics, tech, nails, pets, and tactical gear, every Lay-n-Go product opens flat for
            full visibility and cinches closed for travel. Women-owned, built on utility patents, and trusted by
            customers who are tired of digging through dark bags.
          </p>
        </div>
      </section>

      {/* Top selling */}
      <section id="products" className="py-16">
        <div className="container rounded-2xl border border-border bg-card/45 px-5 py-8 sm:px-7 sm:py-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-medium uppercase tracking-[0.1em] text-foreground">Top Selling Products</h2>
              <p className="text-muted-foreground mt-2">Best sellers, curated for a cleaner shopping view.</p>
            </div>
            <Link to="/collections" className="text-primary text-sm font-semibold hover:underline shrink-0">
              View all collections
            </Link>
          </div>
          <ProductGrid
            fetchFirst={6}
            cardVariant="imageOverlay"
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-background py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-medium uppercase tracking-[0.12em] text-foreground text-center mb-2">
            Testimonials
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Real customer reviews on an infinite loop.
          </p>
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-muted/25 py-4 sm:py-6">
            <div className="testimonial-slider-track">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <article
                  key={`${t.name}-${idx}`}
                  className="w-[20rem] sm:w-[24rem] shrink-0 rounded-3xl border border-border/90 bg-background/90 px-5 py-4 shadow-sm"
                >
                  <p className="text-foreground leading-relaxed">{t.quote}</p>
                  <footer className="mt-3 text-sm font-semibold text-foreground/80">{t.name}</footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter variant="light" />
    </div>
  );
};

export default Index;
