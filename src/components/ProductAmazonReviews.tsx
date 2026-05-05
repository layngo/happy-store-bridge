import { useMemo, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { ProductAmazonReview } from "@/data/productAmazonReviews";

const INITIAL_VISIBLE = 5;

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
  const [expanded, setExpanded] = useState(false);

  const { visible, restCount } = useMemo(() => {
    const visible = expanded ? reviews : reviews.slice(0, INITIAL_VISIBLE);
    const restCount = Math.max(0, reviews.length - INITIAL_VISIBLE);
    return { visible, restCount };
  }, [reviews, expanded]);

  if (reviews.length === 0) return null;

  return (
    <section className="mt-14 border-t border-neutral-200 pt-10 sm:mt-16" aria-labelledby="amazon-reviews-heading">
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

        {restCount > 0 && !expanded ? (
          <div className="border-b border-neutral-200 py-3">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 text-sm font-normal text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              See more reviews
              <span className="text-[#565959]">({restCount} more)</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            </button>
          </div>
        ) : null}

        {expanded && restCount > 0 ? (
          <div className="border-b border-neutral-200 py-3">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Show fewer reviews
            </button>
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
