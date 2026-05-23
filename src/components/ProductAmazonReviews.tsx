import { useEffect, useMemo, useState } from "react";
import type { ProductAmazonReview } from "@/data/productAmazonReviews";
import { StarRating } from "@/components/StarRating";
import { PRODUCT_REVIEWS_SECTION_ID } from "@/components/ProductReviewsSummary";
import { cn } from "@/lib/utils";

const REVIEWS_PAGE_SIZE = 7;

type ProductAmazonReviewsProps = {
  reviews: ProductAmazonReview[];
  amazonListingUrl?: string;
};

function averageRating(reviews: ProductAmazonReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 5), 0);
  return sum / reviews.length;
}

export function ProductAmazonReviews({ reviews, amazonListingUrl }: ProductAmazonReviewsProps) {
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(REVIEWS_PAGE_SIZE);
  }, [reviews.length]);

  const visible = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);
  const hasMore = visibleCount < reviews.length;
  const avg = averageRating(reviews);

  if (reviews.length === 0) return null;

  return (
    <section
      id={PRODUCT_REVIEWS_SECTION_ID}
      className="brand-reviews-section mt-14 sm:mt-16"
      aria-labelledby="amazon-reviews-heading"
    >
      <div className="px-4 sm:px-0">
        <p className="brand-eyebrow">Reviews</p>
        <h2
          id="amazon-reviews-heading"
          className="brand-display mt-2 text-[clamp(1.625rem,5vw,2.5rem)] text-foreground"
        >
          What customers are saying
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-5">
          <StarRating rating={avg} size="md" />
          <span className="font-heading text-sm font-semibold tabular-nums tracking-tight text-foreground">
            {avg.toFixed(1)} out of 5
          </span>
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-0 border-y-2 border-foreground px-4 sm:px-0">
        {visible.map((r, i) => (
          <li
            key={`${r.author}-${i}`}
            className={cn(
              "brand-review-card px-5 py-6 sm:px-7 sm:py-7",
              i > 0 && "border-t border-foreground/12",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <StarRating rating={r.rating ?? 5} size="sm" />
              {r.headline ? (
                <p className="min-w-0 flex-1 font-heading text-base font-bold uppercase tracking-tight text-foreground sm:text-lg">
                  {r.headline}
                </p>
              ) : null}
            </div>
            <p className="brand-eyebrow mt-3 text-foreground/60">
              {r.author}
              {r.variantNote ? ` · ${r.variantNote}` : null}
            </p>
            <blockquote className="brand-review-body mt-3">{r.quote}</blockquote>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="mt-8 flex justify-center px-4 sm:px-0">
          <button
            type="button"
            className="brand-btn-editorial"
            onClick={() => setVisibleCount((count) => count + REVIEWS_PAGE_SIZE)}
          >
            View more
          </button>
        </div>
      ) : null}

      {amazonListingUrl ? (
        <p className="mt-6 px-4 sm:px-0">
          <a
            href={amazonListingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-eyebrow text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            See all reviews on Amazon
          </a>
        </p>
      ) : null}
    </section>
  );
}
