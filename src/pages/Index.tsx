import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { testimonials } from "@/lib/siteNav";
import { Loader2 } from "lucide-react";

const VIMEO_PLAYER_SCRIPT = "https://player.vimeo.com/api/player.js";

const VIMEO_EMBED_SRC =
  "https://player.vimeo.com/video/1191237502?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1";
const OUR_STORY_IMAGES = [
  "/our-story-slide-1.png",
  "/our-story-slide-2.png",
] as const;

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

      {/* Nailspa — chromeless Vimeo, 4:3 responsive frame (75% padding ratio); no hero overlay */}
      <section className="relative w-full border-b border-border bg-black">
        <div className="relative w-full overflow-hidden pt-[75%]">
          <iframe
            src={VIMEO_EMBED_SRC}
            title=""
            frameBorder={0}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            aria-hidden
          />
        </div>
      </section>

      {/* Category grid */}
      <section className="container py-16">
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
      <section className="border-y border-border bg-muted/20">
        <div className="container py-16">
          <Link to="/pages/about-us" className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-border/80 shadow-sm">
              <div className="aspect-[16/8] md:aspect-[21/9] bg-muted">
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

      <section className="border-t border-border bg-background py-16">
        <div className="container max-w-xl px-4">
          <h2 className="font-heading text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Don&apos;t just take our word for it.
          </h2>

          <div className="relative mx-auto mt-10">
            <div
              className="testimonial-conveyor-viewport relative overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm"
              style={{
                height: "calc(5 * (5rem + 0.75rem) - 0.75rem)",
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-background to-transparent" />
              <div className="testimonial-conveyor-track px-3 py-3">
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <article
                    key={`${t.name}-${idx}`}
                    className="flex h-20 shrink-0 items-center gap-3 rounded-xl border border-border/80 bg-card px-4 py-2.5 shadow-sm"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                      aria-hidden
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm leading-snug text-foreground">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t.name}</span>
                        <span
                          className="text-[11px] leading-none tracking-[0.06em] text-amber-700"
                          aria-label="5 out of 5 stars"
                        >
                          ★★★★★
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter variant="light" />
    </div>
  );
};

export default Index;
