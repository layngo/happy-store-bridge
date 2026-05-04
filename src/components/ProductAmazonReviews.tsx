import { Star } from "lucide-react";
import type { ProductAmazonReview } from "@/data/productAmazonReviews";

type ProductAmazonReviewsProps = {
  reviews: ProductAmazonReview[];
  amazonListingUrl?: string;
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="flex gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-none opacity-35"}`}
          strokeWidth={1.25}
        />
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}

export function ProductAmazonReviews({ reviews, amazonListingUrl }: ProductAmazonReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border/70 pt-12 sm:mt-16 sm:pt-14" aria-labelledby="amazon-reviews-heading">
      <div className="mb-8 space-y-2">
        <h2 id="amazon-reviews-heading" className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Amazon customer reviews
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Short excerpts from verified buyer feedback on Amazon—shown here instead of embedding Amazon&apos;s widgets.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {reviews.map((r, i) => (
          <li
            key={`${r.author}-${i}`}
            className="flex flex-col rounded-xl border border-border/60 bg-muted/20 px-4 py-4 sm:px-5 sm:py-5"
          >
            {r.headline ? (
              <p className="font-heading text-sm font-semibold leading-snug tracking-tight text-foreground">{r.headline}</p>
            ) : null}
            <div className={r.headline ? "mt-2" : ""}>
              <Stars rating={r.rating} />
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{r.quote}&rdquo;</blockquote>
            <footer className="mt-3 text-xs font-medium text-muted-foreground">
              — {r.author}
              <span className="sr-only">, Amazon customer</span>
              <span aria-hidden className="text-muted-foreground/80">
                {" "}
                · Amazon customer
              </span>
              {r.variantNote ? (
                <>
                  <span className="mt-1 block font-normal text-muted-foreground/85">{r.variantNote}</span>
                </>
              ) : null}
            </footer>
          </li>
        ))}
      </ul>

      {amazonListingUrl ? (
        <p className="mt-8">
          <a
            href={amazonListingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Read more reviews on Amazon
          </a>
        </p>
      ) : null}

      <p className="mt-6 text-[11px] leading-snug text-muted-foreground/90">
        Lay-n-Go is not affiliated with Amazon.com, Inc. Quotes are shortened for readability.
      </p>
    </section>
  );
}
