import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections, type ShopifyCollectionSummary } from "@/lib/shopify";
import { sortCollectionsForDisplay } from "@/lib/collectionOrder";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { testimonials } from "@/lib/siteNav";
import { PausableAutoplayEmbed } from "@/components/PausableAutoplayEmbed";
import { StarRating } from "@/components/StarRating";
import { faqJsonLd, HOME_FAQS, itemListJsonLd, SITE_TAGLINE, siteNavigationJsonLd, webPageJsonLd } from "@/lib/siteSeo";
import { shopCollectionLinks } from "@/lib/siteNav";

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
      <PageSeo
        title={`${SITE_TAGLINE}`}
        description="Shop Lay-n-Go patented drawstring organizers — Cosmo cosmetic bags, Play toy mats, Traveler tech bags, pet beds, and tactical gear. Open flat, cinch closed in seconds."
        pathname="/"
        keywords="Lay-n-Go, Cosmo makeup bag, drawstring organizer, toy cleanup mat, travel toiletry bag, patented cosmetic bag"
        jsonLd={[
          webPageJsonLd(
            SITE_TAGLINE,
            "Shop Lay-n-Go patented drawstring organizers — Cosmo cosmetic bags, Play toy mats, Traveler tech bags, pet beds, and tactical gear.",
            "/",
          ),
          faqJsonLd([...HOME_FAQS]),
          itemListJsonLd("Shop by category", [
            { name: "Cosmetic Bags", url: "/shop/cosmetic-bags-v2" },
            { name: "Nail Solutions", url: "/product/lay-n-go-nailspa-18" },
            { name: "Play", url: "/collections/play" },
            { name: "Tech & Travel", url: "/product/lay-n-go-traveler-20" },
            { name: "Pet Solutions", url: "/product/lay-n-go-travel-dog-bed-44" },
            { name: "Outdoor / Tactical", url: "/collections/military-first-responder" },
          ]),
          siteNavigationJsonLd([
            { name: "Home", url: "/" },
            { name: "Collections", url: "/collections" },
            ...shopCollectionLinks.map((l) => ({ name: l.label, url: l.to })),
            { name: "Press", url: "/pages/press" },
            { name: "About Us", url: "/pages/about-us" },
            { name: "Contact", url: "/pages/contact" },
          ]),
        ]}
      />
      <Header variant="light" />

      <main id="main-content" className="flex-1">
      {/* Hero — ~20:9 frame reveals more of the 16:9 Vimeo crop; Cosmo brand film */}
      <section className="relative w-full bg-white">
        <div className="relative aspect-[20/9] w-full overflow-hidden">
          <div className="absolute left-0 right-0 top-1/2 z-[5] aspect-video w-full -translate-y-1/2">
            <PausableAutoplayEmbed
              provider="vimeo"
              videoId={HOME_HERO_VIMEO_ID}
              title="Lay-n-Go brand film"
              iframeClassName="absolute inset-0 h-full w-full border-0 select-none"
              showPauseControl
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/25 to-black/15"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-5 text-center sm:gap-5 sm:px-8">
            <h1 className="font-heading text-2xl font-extrabold uppercase leading-[1.08] tracking-[0.04em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-3xl md:text-4xl lg:text-5xl">
              Organizational Solutions
              <br />
              for Life, Play, and Travel
            </h1>
            <div className="pointer-events-auto">
              <Link
                to="/collections"
                className="inline-flex rounded-full bg-primary px-8 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 md:px-9 md:py-3 md:text-base"
              >
                Shop Now
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
          <LoadingSpinner label="Loading categories" className="py-16" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((c) => (
              <CollectionCard key={c.id} collection={c} variant="home" />
            ))}
          </div>
        )}
      </section>

      {/* Press logos */}
      <section className="bg-white pb-14" aria-labelledby="featured-in-heading">
        <div className="container">
          <p id="featured-in-heading" className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-6">
            Featured In
          </p>
          <div className="overflow-hidden rounded-full border border-border bg-white py-4" aria-label="Press and media logos">
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
      <section className="bg-white">
        <div className="container py-16">
          <Link to="/pages/about-us" className="group block">
            <article className="relative overflow-hidden rounded-2xl shadow-sm">
              <div className="aspect-[16/8] md:aspect-[21/9] bg-white">
                <img
                  src={OUR_STORY_IMAGES[0]}
                  alt="Lay-n-Go founder story"
                  className="our-story-slide our-story-slide-a h-full w-full object-cover"
                />
                <img
                  src={OUR_STORY_IMAGES[1]}
                  alt=""
                  aria-hidden
                  className="our-story-slide our-story-slide-b h-full w-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-white/50" />
              <div className="absolute inset-0 flex items-end">
                <div className="p-6 sm:p-8 md:p-10">
                  <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-[0.08em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:-translate-y-1 group-hover:tracking-[0.11em] group-hover:text-slate-900 group-hover:drop-shadow-none">
                    Our Story
                  </h2>
                  <p className="mt-2 font-heading text-lg font-semibold uppercase tracking-[0.14em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] transition-colors duration-500 sm:mt-3 sm:text-xl md:text-2xl group-hover:text-slate-700 group-hover:drop-shadow-none">
                    16+ years in business
                  </p>
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
      <section className="w-full overflow-hidden bg-white py-6 sm:py-8 md:py-10">
        <div className="flex w-full max-w-[100vw] flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-12 lg:gap-16">
          <div className="relative inline-block max-w-[min(100%,63rem)] shrink-0">
            <img
              src={LAST_BAG_BANNER}
              alt="Lay-n-Go Cosmo Deluxe bag with motion graphic"
              className="block h-auto max-h-[300px] w-auto max-w-full object-contain object-left sm:max-h-[390px] md:max-h-[450px] lg:max-h-[510px]"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white via-white/70 to-transparent sm:h-10 md:h-12"
              aria-hidden
            />
          </div>
          <div className="font-heading flex min-w-0 flex-1 flex-col items-center gap-5 px-4 text-center sm:gap-6 sm:px-0 sm:pr-6 md:pr-10 lg:pr-16">
            <p className="text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[1.08] tracking-[0.04em] text-foreground">
              <span className="block whitespace-nowrap">The last</span>
              <span className="block whitespace-nowrap">bag you&apos;ll</span>
              <span className="block whitespace-nowrap">ever need</span>
            </p>
            <Link
              to="/collections"
              className="inline-flex rounded-full bg-primary px-8 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 md:px-9 md:py-3 md:text-base"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="home-reviews-section relative overflow-hidden bg-white py-16 sm:py-20">
        <div className="container relative max-w-6xl px-4">
          <p className="brand-eyebrow text-center">Reviews</p>
          <h2 className="brand-display mt-2 text-center text-[clamp(1.5rem,5vw,2.25rem)] text-foreground">
            Don&apos;t just take our word for it.
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((t) => (
              <li key={t.name} className="h-full">
                <article className="home-review-card group flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <StarRating rating={5} size="sm" className="text-[#ff9f0a]" />
                    <span className="rounded-full border border-white/80 bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-sm">
                      Verified
                    </span>
                  </div>
                  <blockquote className="flex-1 text-[0.98rem] font-normal leading-[1.65] tracking-[-0.01em] text-[#1d1d1f] sm:text-[1.05rem]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-[#d2d2d7]/60 pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e8e8ed] to-[#d2d2d7] text-sm font-semibold text-[#1d1d1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f]">
                        <cite className="not-italic">{t.name}</cite>
                      </p>
                      <p className="text-xs text-[#86868b]">Lay-n-Go customer</p>
                    </div>
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
