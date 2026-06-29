import type { PressFeaturedItem } from "@/lib/pressFeatured";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/press/usatoday-layflat-feature-hero-trimmed.png";

type PressUsatoday10BestBannerProps = {
  item: PressFeaturedItem;
  className?: string;
};

/** USA TODAY 10BEST featured strip — live HTML copy for SEO and selection. */
export function PressUsatoday10BestBanner({ item, className }: PressUsatoday10BestBannerProps) {
  const headline =
    item.headline ||
    "This Clever Makeup Organizer Has Become My Ultimate Travel Companion";
  const quote = item.quote || "A total game changer.";
  const excerpt =
    item.productName ||
    "It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.";
  const dateLabel = item.dateLabel || "Published on Jun. 26, 2026";

  return (
    <article
      className={cn(
        "not-prose mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-black bg-[#0a0a0a] font-heading sm:max-w-4xl",
        className,
      )}
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      <header className="bg-[#322e08] px-5 py-3 sm:px-7 sm:py-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-white sm:text-xs">
          USA TODAY
        </p>
        <p className="mt-0.5 text-2xl font-extrabold uppercase leading-none text-white sm:text-3xl">
          10BEST
        </p>
      </header>

      <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-[0.95fr_1.05fr] md:items-center md:p-6">
        <div className="overflow-hidden rounded-xl border-2 border-white/55 bg-[#0a0a0a] shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
          <img
            src={item.imageSrc || HERO_IMAGE}
            alt={
              item.imageAlt ||
              "Lay-n-Go Cosmo makeup organizer open with cosmetics inside"
            }
            className="aspect-[5/4] w-full max-h-44 object-cover object-[center_22%] sm:max-h-48 md:aspect-auto md:max-h-52 md:min-h-0"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="flex flex-col justify-center text-[#f5f5f2]">
          <h2
            className="text-base font-extrabold uppercase leading-[1.12] tracking-[0.02em] sm:text-lg md:text-xl"
            itemProp="headline"
          >
            {headline}
          </h2>

          <div className="mt-3 border-t border-white/15 pt-3 sm:mt-3.5 sm:pt-3.5">
            <blockquote className="border-0 p-0" cite={item.href}>
              <p
                className="text-lg font-extrabold leading-[1.15] text-primary sm:text-xl md:text-2xl"
                itemProp="description"
              >
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
            <p className="mt-2.5 text-sm font-semibold leading-relaxed text-[#f5f5f2] sm:text-[0.95rem] md:text-base md:leading-snug">
              {excerpt}
            </p>
          </div>

          <time
            dateTime="2026-06-26"
            className="mt-3 text-xs font-bold uppercase tracking-[0.04em] text-white sm:text-sm md:mt-3.5"
            itemProp="datePublished"
          >
            {dateLabel}
          </time>
        </div>
      </div>

      <div className="flex justify-center px-4 pb-4 pt-0 sm:px-6 sm:pb-5">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-5 py-2 font-heading text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:px-6 sm:py-2.5 sm:text-sm"
          itemProp="url"
        >
          {item.linkLabel}
        </a>
      </div>
    </article>
  );
}
