import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { ProductAmazonReview } from "@/data/productAmazonReviews";
import { Button } from "@/components/ui/button";
import { PRODUCT_REVIEWS_SECTION_ID } from "@/components/ProductReviewsSummary";

const REVIEWS_PAGE_SIZE = 7;

type ProductAmazonReviewsProps = {
  reviews: ProductAmazonReview[];
  amazonListingUrl?: string;
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="flex gap-0.5 text-[#de7921]" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-[15px] w-[15px] ${i < rating ? "fill-current" : "fill-none opacity-30"}`}
          strokeWidth={1.1}
        />
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}

export function ProductAmazonReviews({ reviews, amazonListingUrl }: ProductAmazonReviewsProps) {
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(REVIEWS_PAGE_SIZE);
  }, [reviews.length]);

  const visible = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);
  const hasMore = visibleCount < reviews.length;

  if (reviews.length === 0) return null;

  return (
    <section
      id={PRODUCT_REVIEWS_SECTION_ID}
      className="mt-14 scroll-mt-24 border-t border-neutral-200 pt-10 sm:mt-16"
      aria-labelledby="amazon-reviews-heading"
    >
      <div className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
        <h2 id="amazon-reviews-heading" className="text-lg font-normal text-[#0f1111]">
          Customer reviews
        </h2>

        <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
          {visible.map((r, i) => (
            <li key={`${r.author}-${i}`} className="py-4 first:pt-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Stars rating={r.rating} />
                {r.headline ? (
                  <span className="text-[15px] font-bold leading-snug text-[#0f1111]">{r.headline}</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[#565959]">
                Reviewed in the United States · {r.author}
                {r.variantNote ? (
                  <>
                    <br />
                    <span>{r.variantNote}</span>
                  </>
                ) : null}
              </p>
              <blockquote className="mt-2 text-[15px] leading-relaxed text-[#0f1111]">{r.quote}</blockquote>
            </li>
          ))}
        </ul>

        {hasMore ? (
          <div className="flex justify-center border-b border-neutral-200 py-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[10rem] font-medium"
              onClick={() => setVisibleCount((count) => count + REVIEWS_PAGE_SIZE)}
            >
              View more
            </Button>
          </div>
        ) : null}

        {amazonListingUrl ? (
          <div className="pt-3">
            <a
              href={amazonListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              See all reviews on Amazon
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
