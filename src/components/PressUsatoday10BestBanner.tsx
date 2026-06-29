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
        "not-prose overflow-hidden rounded-2xl border-2 border-black bg-[#0a0a0a] font-heading",
        className,
      )}
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      <header className="bg-[#322e08] px-6 py-4 sm:px-10 sm:py-5">
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-white sm:text-base">
          USA TODAY
        </p>
        <p className="mt-0.5 text-3xl font-extrabold uppercase leading-none text-white sm:text-4xl md:text-[3.125rem]">
          10BEST
        </p>
      </header>

      <div className="grid gap-6 p-6 sm:gap-8 sm:p-8 md:grid-cols-[1.02fr_0.98fr] md:items-stretch lg:gap-10 lg:p-10">
        <div className="overflow-hidden rounded-[18px] border-2 border-white/55 bg-[#0a0a0a] shadow-[0_16px_40px_rgba(0,0,0,0.42)]">
          <img
            src={item.imageSrc || HERO_IMAGE}
            alt={
              item.imageAlt ||
              "Lay-n-Go Cosmo makeup organizer open with cosmetics inside"
            }
            className="aspect-[4/3] w-full object-cover object-[center_22%] md:aspect-auto md:min-h-[17.5rem] md:h-full lg:min-h-[20rem]"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="flex flex-col justify-center text-[#f5f5f2]">
          <h2
            className="text-xl font-extrabold uppercase leading-[1.1] tracking-[0.025em] sm:text-2xl lg:text-[2.625rem] lg:leading-[1.08]"
            itemProp="headline"
          >
            {headline}
          </h2>

          <div className="mt-5 border-t border-white/15 pt-5 lg:mt-6 lg:pt-6">
            <blockquote className="border-0 p-0" cite={item.href}>
              <p
                className="text-2xl font-extrabold leading-[1.12] text-primary sm:text-3xl lg:text-[2.875rem] lg:leading-[1.1]"
                itemProp="description"
              >
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-[#f5f5f2] sm:text-xl lg:mt-5 lg:text-[1.75rem] lg:leading-[1.38]">
              {excerpt}
            </p>
          </div>

          <time
            dateTime="2026-06-26"
            className="mt-5 text-base font-bold uppercase tracking-[0.04em] text-white sm:text-lg lg:mt-6 lg:text-xl"
            itemProp="datePublished"
          >
            {dateLabel}
          </time>
        </div>
      </div>

      <div className="flex justify-center px-6 pb-6 pt-1 sm:px-8 sm:pb-8">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          itemProp="url"
        >
          {item.linkLabel}
        </a>
      </div>
    </article>
  );
}
