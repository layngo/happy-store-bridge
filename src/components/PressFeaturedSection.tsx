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
        "not-prose overflow-hidden rounded-2xl border border-[#e8e2d8] bg-[#f5f1e9] shadow-sm",
        className,
      )}
    >
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_min(280px,36%)] md:items-center md:gap-10 lg:p-10">
        <div className="min-w-0 space-y-5">
          <header className="space-y-2">
            <p className="font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {item.publication}
            </p>
            <h2 className="font-[Cormorant_Garamond,Georgia,serif] text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-foreground">
              {item.headline}
            </h2>
          </header>

          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {item.linkLabel}
          </a>

          <div className="space-y-1 font-heading text-sm font-semibold text-foreground/85 sm:text-base">
            <p>{item.dateLabel}</p>
            <p>{item.productName}</p>
          </div>

          <blockquote className="border-l-0 p-0 font-heading text-sm font-medium leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mx-auto w-full max-w-[min(100%,340px)] md:mx-0 md:max-w-none md:justify-self-end">
          <div className="overflow-hidden rounded-sm border border-white/90 bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="aspect-square w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function PressFeaturedSection() {
  if (PRESS_FEATURED_ITEMS.length === 0) return null;

  return (
    <section className="not-prose mb-12 sm:mb-14" aria-labelledby="press-featured-heading">
      <h2 id="press-featured-heading" className="sr-only">
        Featured press
      </h2>
      <div className="space-y-6">
        {PRESS_FEATURED_ITEMS.map((item) => (
          <PressFeaturedCard key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}
