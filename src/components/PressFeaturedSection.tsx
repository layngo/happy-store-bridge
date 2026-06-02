import { PRESS_FEATURED_ITEMS } from "@/lib/pressFeatured";
import { cn } from "@/lib/utils";

function PressFeaturedCard({
  item,
  className,
}: {
  item: (typeof PRESS_FEATURED_ITEMS)[number];
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
        loading="eager"
        decoding="async"
      />

      <div
        className={cn(
          "flex flex-col justify-center gap-5 bg-[#f5f1e9] px-5 py-7 sm:px-8 sm:py-8",
          "md:absolute md:inset-y-0 md:right-0 md:w-[min(52%,34rem)] md:bg-transparent md:px-8 md:py-10 lg:px-12 lg:py-12",
        )}
      >
        <header className="space-y-1.5 font-heading text-sm font-bold uppercase leading-snug tracking-[0.05em] text-foreground sm:text-[0.95rem] md:text-base">
          <p>{item.publication}</p>
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

        <div className="space-y-1 font-heading text-sm font-semibold text-foreground/85 sm:text-[0.95rem]">
          <p>{item.dateLabel}</p>
          <p>{item.productName}</p>
        </div>

        {item.quote ? (
          <blockquote className="border-l-0 p-0 font-heading text-sm font-medium leading-relaxed text-muted-foreground sm:text-[0.9rem] lg:text-[0.95rem]">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        ) : null}
      </div>
    </article>
  );
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
