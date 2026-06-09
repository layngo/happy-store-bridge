import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { testimonials } from "@/lib/siteNav";
import { Loader2 } from "lucide-react";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";
import { StarRating } from "@/components/StarRating";

const HOME_HERO_VIMEO_ID = "1185281289";
const OUR_STORY_IMAGES = [
  "/our-story-slide-1.png",
  "/our-story-slide-2.png",
] as const;

const LAST_BAG_BANNER = "/home/last-bag-banner.png";

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
    src: "/home/press-logos/red-tricycle-logo.png",
    href: "https://redtri.com/ways-to-organize-your-legos/?utm_source=FB&utm_medium=NATL&utm_campaign=FB-NATL#",
    imageClass: "scale-150",
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

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <Header variant="light" />

      <main id="main-content" className="flex-1">
      {/* Hero — ~20:9 frame reveals more of the 16:9 Vimeo crop; Cosmo brand film */}
      <section className="relative w-full border-b border-border bg-white">
        <div className="relative aspect-[20/9] w-full overflow-hidden">
          <div className="absolute left-0 right-0 top-1/2 z-[5] aspect-video w-full -translate-y-1/2">
            <PausableAutoplayEmbed
              provider="vimeo"
              videoId={HOME_HERO_VIMEO_ID}
              title="Lay-n-Go brand film"
              iframeClassName="absolute inset-0 h-full w-full border-0 select-none"
              showPauseControl={false}
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
      <section className="container bg-white py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-medium uppercase tracking-[0.14em] text-foreground text-center mb-2">
          Shop by Category
        </h2>
        <p className="text-center text-base font-medium text-foreground/80 max-w-xl mx-auto mb-10 leading-normal tracking-normal">
          Cosmetic bags, tech &amp; travel, play, pets, outdoor, tactical, and nail solutions.
        </p>
        {collectionsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((c) => (
              <CollectionCard key={c.id} collection={c} variant="home" />
            ))}
          </div>
        )}
      </section>

      {/* Press logos */}
      <section className="bg-white pb-14">
        <div className="container">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-6">
            Featured In
          </p>
          <div className="overflow-hidden rounded-full border border-border bg-white py-4">
            <div className="press-carousel-track">
              {[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
                <a
                  key={`${logo.name}-${i}`}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2 inline-flex h-12 w-[44vw] max-w-[9rem] sm:mx-5 sm:h-24 sm:w-44 shrink-0 items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className={`h-7 w-20 sm:h-12 sm:w-32 object-contain opacity-95 transition-transform ${logo.imageClass ?? ""}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="border-y border-border bg-white">
        <div className="container py-16">
          <Link to="/pages/about-usV3" className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-border/80 shadow-sm">
              <div className="aspect-[16/8] md:aspect-[21/9] bg-white">
                <img
                  src={OUR_STORY_IMAGES[0]}
                  alt="Lay-n-Go founder story"
                  className="our-story-slide our-story-slide-a h-full w-full object-cover"
                />
                <img
                  src={OUR_STORY_IMAGES[1]}
                  alt="Lay-n-Go founder story alternate"
                  className="our-story-slide our-story-slide-b h-full w-full object-cover"
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

          <p className="mt-5 max-w-3xl text-base font-medium text-foreground/90 leading-normal">
            Lay-n-Go started with a simple idea, &ldquo;There has to be a better way to do this.&rdquo; From solving
            toy cleanup to building patented solutions for cosmetics, tech, travel, pets, and tactical gear, every
            product is designed to open flat for visibility and cinch closed for life on the go.
          </p>
        </div>
      </section>

      {/* Last bag banner — image left, headline beside it */}
      <section className="w-full overflow-hidden border-t border-border bg-white py-6 sm:py-8 md:py-10">
        <div className="flex w-full max-w-[100vw] flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-12 lg:gap-16">
          <img
            src={LAST_BAG_BANNER}
            alt="Lay-n-Go Cosmo Deluxe bag with motion graphic"
            className="block h-auto max-h-[300px] w-auto max-w-[min(100%,63rem)] shrink-0 object-contain object-left sm:max-h-[390px] md:max-h-[450px] lg:max-h-[510px]"
            loading="lazy"
          />
          <p className="font-heading flex min-w-0 flex-1 flex-col items-center px-4 text-center text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[1.08] tracking-[0.04em] text-foreground sm:px-0 sm:pr-6 md:pr-10 lg:pr-16">
            <span className="block whitespace-nowrap">The last</span>
            <span className="block whitespace-nowrap">bag you&apos;ll</span>
            <span className="block whitespace-nowrap">ever need</span>
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-white py-16">
        <div className="container max-w-6xl px-4">
          <p className="brand-eyebrow text-center">Reviews</p>
          <h2 className="brand-display mt-2 text-center text-[clamp(1.5rem,5vw,2.25rem)] text-foreground">
            Don&apos;t just take our word for it.
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name}>
                <article className="brand-review-card flex h-full flex-col bg-white px-5 py-6 sm:px-6 sm:py-7">
                  <blockquote className="font-heading text-base font-normal leading-relaxed tracking-normal text-foreground/90 normal-case sm:text-[1.0625rem]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/10 pt-4">
                    <span className="font-heading text-sm font-medium text-foreground/70 normal-case">
                      {t.name}
                    </span>
                    <StarRating rating={5} size="sm" />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      </main>
      <SiteFooter variant="light" />
    </div>
  );
};

export default Index;
