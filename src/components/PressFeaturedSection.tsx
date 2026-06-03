import { PRESS_FEATURED_ITEMS, type PressFeaturedItem } from "@/lib/pressFeatured";
import { cn } from "@/lib/utils";

const featuredTextBlockClass =
  "space-y-1.5 font-heading text-sm font-bold uppercase leading-snug tracking-[0.05em] text-foreground sm:text-[0.95rem] md:text-base";

/** Mobile banner titles — readable on busy photos (first 3 featured). */
const mobileBannerTitlePanelClass =
  "w-full max-w-[min(100%,22rem)] rounded-lg bg-white px-4 py-2.5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/10";

const pressFeaturedBorderClass = "rounded-2xl border-2 border-black bg-white";
const pressFeaturedClipClass = "overflow-hidden rounded-2xl";

/** Faint background on square press cards (was 7%; +15% visibility). */
const pressFeaturedCardBgOpacityClass = "opacity-[0.081]";

function FeaturedCopy({
  item,
  className,
  align = "left",
  compactOnMobile = false,
}: {
  item: PressFeaturedItem;
  className?: string;
  align?: "left" | "center";
  /** Tighter spacing and hide pull quote below md (banner layout on phones). */
  compactOnMobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        compactOnMobile ? "gap-3 md:gap-5" : "gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <header
        className={cn(
          featuredTextBlockClass,
          (align === "center" || compactOnMobile) && "flex w-full flex-col items-center text-center",
          compactOnMobile && "gap-2.5",
        )}
      >
        {(() => {
          const publication = item.publication?.trim() ?? "";
          const headline = item.headline?.trim() ?? "";
          if (publication && headline && publication === headline) {
            return (
              <h2 className={cn(compactOnMobile && mobileBannerTitlePanelClass)}>{headline}</h2>
            );
          }
          return (
            <>
              {publication ? (
                <p className={cn(compactOnMobile && mobileBannerTitlePanelClass)}>{publication}</p>
              ) : null}
              {headline ? (
                <h2 className={cn(compactOnMobile && mobileBannerTitlePanelClass)}>{headline}</h2>
              ) : null}
            </>
          );
        })()}
      </header>

      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          compactOnMobile && "mx-auto",
        )}
      >
        {item.linkLabel}
      </a>

      <div
        className={cn(
          "space-y-1 font-heading text-sm font-semibold sm:text-[0.95rem]",
          align === "center" && "max-w-md",
          compactOnMobile
            ? "w-full max-w-[min(100%,22rem)] text-center text-foreground"
            : "text-foreground/85",
        )}
      >
        {item.dateLabel ? <p>{item.dateLabel}</p> : null}
        {item.productName ? <p>{item.productName}</p> : null}
      </div>

      {item.quote ? (
        <blockquote
          className={cn(
            "border-l-0 p-0 font-heading text-sm font-medium leading-relaxed text-muted-foreground sm:text-[0.9rem] lg:text-[0.95rem]",
            align === "center" && "max-w-md",
            compactOnMobile && "hidden md:block",
          )}
        >
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      ) : null}
    </div>
  );
}

function PressFeaturedBannerCard({
  item,
  className,
}: {
  item: PressFeaturedItem;
  className?: string;
}) {
  const desktopAspect = (item.imageAspect ?? "2048/768").replace("/", " / ");

  return (
    <article
      className={cn(
        "not-prose relative flex w-full flex-col",
        pressFeaturedBorderClass,
        className,
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden max-md:rounded-t-2xl md:rounded-2xl", pressFeaturedClipClass)}>
        <div className="relative max-md:aspect-[4/3] md:aspect-auto">
          <img
            src={item.imageSrc}
            srcSet={item.imageSrcSet}
            sizes={item.imageSrcSet ? "(min-width: 768px) 80rem, 100vw" : undefined}
            alt={item.imageAlt}
            className={cn(
              "object-cover object-left",
              "absolute inset-0 size-full object-[14%_42%]",
              "md:relative md:block md:h-auto md:w-full md:object-left",
            )}
            style={{
              aspectRatio: desktopAspect,
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {item.bannerDiagonalDividers ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[47%] z-30 hidden -translate-x-1/2 md:block"
        >
          <span className="absolute inset-y-0 -left-[11px] w-[3px] -translate-x-1/2 rotate-[11deg] bg-black" />
          <span className="absolute inset-y-0 left-[11px] w-[3px] -translate-x-1/2 rotate-[11deg] bg-black" />
        </div>
      ) : null}

      {/* Mobile: image on top, copy on solid white (no overlay) */}
      <div className="relative z-10 flex flex-col items-center bg-white px-5 py-6 text-center max-md:rounded-b-2xl md:hidden">
        <FeaturedCopy item={item} compactOnMobile align="center" />
      </div>

      {/* Desktop: copy over the right blank area of the banner */}
      <div className="relative z-10 hidden flex-col justify-center md:absolute md:inset-y-0 md:right-0 md:flex md:w-[min(52%,34rem)] md:bg-transparent md:px-8 md:py-10 lg:px-12 lg:py-12">
        <FeaturedCopy item={item} />
      </div>
    </article>
  );
}

function PressFeaturedCardCard({
  item,
  className,
}: {
  item: PressFeaturedItem;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "not-prose relative flex h-full w-full flex-col",
        pressFeaturedBorderClass,
        pressFeaturedClipClass,
        className,
      )}
    >
      {item.cardBackgroundSrc ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
          <img
            src={item.cardBackgroundSrc}
            alt=""
            className={cn("h-full w-full object-cover", pressFeaturedCardBgOpacityClass)}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="relative z-10 flex h-full min-h-0 flex-col items-center px-6 py-8 sm:px-8 sm:py-9 md:py-10">
        <div
          className={cn(
            "flex w-full items-center justify-center md:min-h-[10.5rem] lg:min-h-[11rem]",
            item.cardLogoSize === "large" && "md:min-h-[12rem] lg:min-h-[12.5rem]",
          )}
        >
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className={cn(
              "mx-auto block h-auto w-auto object-contain object-center",
              item.cardLogoSize === "large"
                ? "max-h-[min(9.5rem,42vw)] max-w-[min(100%,22rem)] sm:max-h-[10rem] sm:max-w-[23rem] md:max-h-[10.75rem] md:max-w-[21rem] lg:max-h-[11.25rem]"
                : "max-h-[min(7.25rem,34vw)] max-w-[min(100%,14rem)] sm:max-h-[7.75rem] sm:max-w-[15rem] md:max-h-[8.25rem] md:max-w-[13.5rem] lg:max-h-[8.75rem]",
              item.cardLogoDropShadow &&
                "[filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.18))_drop-shadow(0_8px_20px_rgba(0,0,0,0.22))]",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
        <FeaturedCopy
          item={item}
          align="center"
          className="mt-6 w-full max-w-[min(100%,22rem)] shrink-0 md:mt-7"
        />
      </div>
    </article>
  );
}

export function PressFeaturedSection() {
  if (PRESS_FEATURED_ITEMS.length === 0) return null;

  const bannerItems = PRESS_FEATURED_ITEMS.filter((item) => item.layout !== "card");
  const cardItems = PRESS_FEATURED_ITEMS.filter((item) => item.layout === "card");

  return (
    <section
      className="not-prose relative left-1/2 mb-12 w-screen max-w-[100vw] -translate-x-1/2 sm:mb-14"
      aria-labelledby="press-featured-heading"
    >
      <h2 id="press-featured-heading" className="sr-only">
        Featured press
      </h2>
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {bannerItems.map((item) => (
            <PressFeaturedBannerCard key={item.href} item={item} />
          ))}

          {cardItems.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-8">
              {cardItems.map((item) => (
                <PressFeaturedCardCard key={item.href} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
