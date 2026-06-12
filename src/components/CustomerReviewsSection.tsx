import { useEffect, useMemo, useState } from "react";
import {
  averageReviewRating,
  isLayNGoPlayReviewsPdp,
  PLAY_CUSTOMER_REVIEWS_DISCLAIMER,
  type CustomerReview,
} from "@/data/customerReviews";
import { fetchSubmittedReviews } from "@/lib/reviewApi";
import { StarRating } from "@/components/StarRating";
import { ReviewPhotoGallery } from "@/components/ReviewPhotoGallery";
import { SubmitReviewDialog } from "@/components/SubmitReviewDialog";
import { PRODUCT_REVIEWS_SECTION_ID } from "@/components/ProductReviewsSummary";
import { cn } from "@/lib/utils";

const REVIEWS_PAGE_SIZE = 7;

type CustomerReviewsSectionProps = {
  reviews: CustomerReview[];
  /** Required for saving new reviews */
  productHandle: string;
  heading?: string;
  className?: string;
};

function reviewsWithImagesFirst(reviews: CustomerReview[]): CustomerReview[] {
  return [...reviews].sort((a, b) => {
    const aHasImages = Boolean(a.images?.length) && !a.deferImagesFirst;
    const bHasImages = Boolean(b.images?.length) && !b.deferImagesFirst;
    if (aHasImages === bHasImages) return 0;
    return aHasImages ? -1 : 1;
  });
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="brand-review-card px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <StarRating rating={review.rating} size="sm" />
        <p className="brand-eyebrow text-foreground/70">{review.name}</p>
      </div>
      {review.title ? (
        <p className="mt-4 font-heading text-base font-bold uppercase tracking-tight text-foreground sm:text-lg">
          {review.title}
        </p>
      ) : null}
      <blockquote className={cn("brand-review-body", review.title ? "mt-2" : "mt-4")}>{review.text}</blockquote>
      {review.images?.length ? (
        <ReviewPhotoGallery images={review.images} photoLabel={review.name} />
      ) : null}
    </article>
  );
}

export function CustomerReviewsSection({
  reviews: staticReviews,
  productHandle,
  heading = "What customers are saying",
  className,
}: CustomerReviewsSectionProps) {
  const [submittedReviews, setSubmittedReviews] = useState<CustomerReview[]>([]);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetchSubmittedReviews(productHandle).then((list) => {
      if (!cancelled) setSubmittedReviews(list);
    });
    return () => {
      cancelled = true;
    };
  }, [productHandle]);

  const reviews = useMemo(
    () => reviewsWithImagesFirst([...staticReviews, ...submittedReviews]),
    [staticReviews, submittedReviews],
  );

  useEffect(() => {
    setVisibleCount(REVIEWS_PAGE_SIZE);
  }, [productHandle, reviews.length]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const averageRating = useMemo(() => averageReviewRating(reviews), [reviews]);

  const handleReviewSubmitted = (review: CustomerReview) => {
    setSubmittedReviews((prev) => [...prev, review]);
  };

  return (
    <section
      id={PRODUCT_REVIEWS_SECTION_ID}
      className={cn("brand-reviews-section mt-14 sm:mt-16", className)}
      aria-labelledby="customer-reviews-heading"
    >
      <div className="flex flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-0">
        <div className="min-w-0">
          <p className="brand-eyebrow">Reviews</p>
          <h2
            id="customer-reviews-heading"
            className="brand-display mt-2 text-[clamp(1.625rem,5vw,2.5rem)] text-foreground"
          >
            {heading}
          </h2>
          {isLayNGoPlayReviewsPdp(productHandle) ? (
            <p className="brand-review-body mt-4 max-w-2xl">{PLAY_CUSTOMER_REVIEWS_DISCLAIMER}</p>
          ) : null}
          {reviews.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-5">
              <StarRating rating={averageRating} size="md" />
              <span className="font-heading text-sm font-semibold tabular-nums tracking-tight text-foreground">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
          ) : null}
        </div>
        <SubmitReviewDialog productHandle={productHandle} onReviewSubmitted={handleReviewSubmitted} />
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="mt-8 flex flex-col gap-0 border-y-2 border-foreground px-4 sm:px-0">
            {visibleReviews.map((review, index) => (
              <div
                key={review.id}
                className={cn(index > 0 && "border-t border-foreground/12")}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
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
        </>
      ) : (
        <p className="brand-review-body mt-8 px-4 sm:px-0">No reviews yet—be the first to share your experience.</p>
      )}
    </section>
  );
}
