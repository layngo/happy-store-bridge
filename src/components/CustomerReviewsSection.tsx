import { useEffect, useMemo, useState } from "react";
import {
  averageReviewRating,
  isLayNGoPlayReviewsPdp,
  PLAY_CUSTOMER_REVIEWS_DISCLAIMER,
  type CustomerReview,
} from "@/data/customerReviews";
import { fetchSubmittedReviews } from "@/lib/reviewApi";
import { StarRating } from "@/components/StarRating";
import { SubmitReviewDialog } from "@/components/SubmitReviewDialog";
import { Button } from "@/components/ui/button";
import { PRODUCT_REVIEWS_SECTION_ID } from "@/components/ProductReviewsSummary";
import { cn } from "@/lib/utils";

const REVIEWS_PAGE_SIZE = 7;

type CustomerReviewsSectionProps = {
  reviews: CustomerReview[];
  /** Required for order verification and saving new reviews */
  productHandle: string;
  heading?: string;
  className?: string;
};

function reviewsWithImagesFirst(reviews: CustomerReview[]): CustomerReview[] {
  return [...reviews].sort((a, b) => {
    const aHasImages = Boolean(a.images?.length);
    const bHasImages = Boolean(b.images?.length);
    if (aHasImages === bHasImages) return 0;
    return aHasImages ? -1 : 1;
  });
}

function ReviewCard({ review }: { review: CustomerReview }) {
  const hasImages = Boolean(review.images?.length);

  return (
    <article className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <StarRating rating={review.rating} size="sm" />
      <p className="mt-3 font-heading text-base font-semibold tracking-tight text-foreground">{review.name}</p>
      {review.title ? (
        <p className="mt-1 text-sm font-medium leading-snug text-foreground/90">{review.title}</p>
      ) : null}
      <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</blockquote>
      {hasImages ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Photos from this review">
          {review.images!.map((src) => (
            <li key={src} className="shrink-0">
              <img
                src={src}
                alt=""
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
                className="h-[4.5rem] w-[4.5rem] rounded-lg border border-border object-cover sm:h-20 sm:w-20"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function CustomerReviewsSection({
  reviews: staticReviews,
  productHandle,
  heading = "What Our Customers Are Saying",
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
      className={cn("mx-auto mt-14 w-full max-w-4xl scroll-mt-24 border-t border-border pt-10 sm:mt-16", className)}
      aria-labelledby="customer-reviews-heading"
    >
      <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-0">
        <div>
          <h2
            id="customer-reviews-heading"
            className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {heading}
          </h2>
          {isLayNGoPlayReviewsPdp(productHandle) ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {PLAY_CUSTOMER_REVIEWS_DISCLAIMER}
            </p>
          ) : null}
          {reviews.length > 0 ? (
            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={averageRating} size="lg" />
            </div>
          ) : null}
        </div>
        <SubmitReviewDialog productHandle={productHandle} onReviewSubmitted={handleReviewSubmitted} />
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="mt-6 flex flex-col gap-4 px-4 sm:px-0">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-6 flex justify-center px-4 sm:px-0">
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
        </>
      ) : (
        <p className="mt-6 px-4 text-sm text-muted-foreground sm:px-0">
          No reviews yet—be the first to share your experience.
        </p>
      )}
    </section>
  );
}
