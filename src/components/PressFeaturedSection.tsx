import { PRESS_FEATURED_ITEMS, type PressFeaturedItem } from "@/lib/pressFeatured";
import { cn } from "@/lib/utils";

const featuredTextBlockClass =
  "space-y-1.5 font-heading text-sm font-bold uppercase leading-snug tracking-[0.05em] text-foreground sm:text-[0.95rem] md:text-base";

function FeaturedCopy({
  item,
  className,
  align = "left",
}: {
  item: PressFeaturedItem;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <header className={cn(featuredTextBlockClass, align === "center" && "items-center")}>
        {item.publication ? <p>{item.publication}</p> : null}
        <h2>{item.headline}</h2>
      </header>

      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {item.linkLabel}
      </a>

      <div
        className={cn(
          "space-y-1 font-heading text-sm font-semibold text-foreground/85 sm:text-[0.95rem]",
          align === "center" && "max-w-md",
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
  return (
    <article
      className={cn(
        "not-prose relative w-full overflow-hidden rounded-2xl border border-[#e8e2d8] shadow-sm",
        className,
      )}
    >
      <img
        src={item.imageSrc}
        srcSet={item.imageSrcSet}
        sizes={item.imageSrcSet ? "(min-width: 1280px) 80rem, 100vw" : undefined}
        alt={item.imageAlt}
        className="block w-full object-contain object-left"
        style={{
          aspectRatio: (item.imageAspect ?? "1024/403").replace("/", " / "),
        }}
        loading="lazy"
        decoding="async"
      />

      <div
        className={cn(
          "flex flex-col justify-center gap-5 bg-[#f5f1e9] px-5 py-7 sm:px-8 sm:py-8",
          "md:absolute md:inset-y-0 md:right-0 md:w-[min(52%,34rem)] md:bg-transparent md:px-8 md:py-10 lg:px-12 lg:py-12",
        )}
      >
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
        "not-prose mx-auto w-full max-w-[min(100%,28rem)] overflow-hidden rounded-2xl border border-[#e8e2d8] bg-[#f5f1e9] shadow-sm sm:max-w-[min(100%,32rem)]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-7 px-6 py-8 sm:gap-8 sm:px-10 sm:py-10">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          className={cn(
            "w-full max-w-[min(17.5rem,78%)] object-contain",
            item.cardImageAspect ? "" : "aspect-square",
          )}
          style={
            item.cardImageAspect
              ? { aspectRatio: item.cardImageAspect.replace("/", " / ") }
              : undefined
          }
          loading="lazy"
          decoding="async"
        />
        <FeaturedCopy item={item} align="center" className="w-full" />
      </div>
    </article>
  );
}

function PressFeaturedCard({
  item,
  className,
}: {
  item: PressFeaturedItem;
  className?: string;
}) {
  if (item.layout === "card") {
    return <PressFeaturedCardCard item={item} className={className} />;
  }
  return <PressFeaturedBannerCard item={item} className={className} />;
}

export function PressFeaturedSection() {
  if (PRESS_FEATURED_ITEMS.length === 0) return null;

  return (
    <section
      className="not-prose relative left-1/2 mb-12 w-screen max-w-[100vw] -translate-x-1/2 sm:mb-14"
      aria-labelledby="press-featured-heading"
    >
      <h2 id="press-featured-heading" className="sr-only">
        Featured press
      </h2>
      <div className="mx-auto w-full max-w-[min(100%,80rem)] px-4 sm:px-6">
        <div className="space-y-8 sm:space-y-10">
          {PRESS_FEATURED_ITEMS.map((item) => (
            <PressFeaturedCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
