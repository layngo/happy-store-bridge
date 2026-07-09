import { useMemo } from "react";
import { averageReviewRating, type CustomerReview } from "@/data/customerReviews";
import type { ProductAmazonReview } from "@/data/productAmazonReviews";
import { useSubmittedReviews } from "@/hooks/useSubmittedReviews";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";

export const PRODUCT_REVIEWS_SECTION_ID = "product-customer-reviews";

type ProductReviewsSummaryProps = {
  productHandle: string;
  staticNativeReviews?: CustomerReview[];
  amazonReviews?: ProductAmazonReview[];
  className?: string;
};

function averageAmazonReviewRating(reviews: ProductAmazonReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 5), 0);
  return sum / reviews.length;
}

function scrollToReviewsSection() {
  const target = document.getElementById(PRODUCT_REVIEWS_SECTION_ID);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProductReviewsSummary({
  productHandle,
  staticNativeReviews,
  amazonReviews = [],
  className,
}: ProductReviewsSummaryProps) {
  const submittedReviews = useSubmittedReviews(
    productHandle,
    staticNativeReviews !== undefined,
  );

  const { averageRating, reviewCount } = useMemo(() => {
    if (staticNativeReviews?.length) {
      const all = [...staticNativeReviews, ...submittedReviews];
      return { averageRating: averageReviewRating(all), reviewCount: all.length };
    }
    if (amazonReviews.length > 0) {
      return { averageRating: averageAmazonReviewRating(amazonReviews), reviewCount: amazonReviews.length };
    }
    return { averageRating: 0, reviewCount: 0 };
  }, [staticNativeReviews, submittedReviews, amazonReviews]);

  if (reviewCount === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <StarRating rating={averageRating} size="sm" label={`${averageRating.toFixed(1)} out of 5 stars`} />
      <span className="font-heading text-sm font-semibold tabular-nums tracking-tight text-foreground/80">
        {averageRating.toFixed(1)} out of 5
      </span>
      <button
        type="button"
        onClick={scrollToReviewsSection}
        className="brand-eyebrow text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        See reviews
      </button>
    </div>
  );
}
