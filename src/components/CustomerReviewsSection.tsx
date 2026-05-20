import { useMemo } from "react";
import { averageReviewRating, type CustomerReview } from "@/data/customerReviews";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";

type CustomerReviewsSectionProps = {
  reviews: CustomerReview[];
  heading?: string;
  className?: string;
};

function ReviewCard({ review }: { review: CustomerReview }) {
  const hasImages = Boolean(review.images?.length);

  return (
    <article
      className={cn(
        "flex h-full shrink-0 snap-start flex-col",
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        hasImages ? "w-[min(100%,21.5rem)] sm:w-[24rem]" : "w-[min(100%,19.5rem)] sm:w-[22rem]",
      )}
    >
      <StarRating rating={review.rating} size="sm" />
      <p className="mt-3 font-heading text-base font-semibold tracking-tight text-foreground">{review.name}</p>
      {review.title ? (
        <p className="mt-1 text-sm font-medium leading-snug text-foreground/90">{review.title}</p>
      ) : null}
      <blockquote className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm leading-relaxed text-muted-foreground [scrollbar-width:thin]">
        {review.text}
      </blockquote>
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
  reviews,
  heading = "What Our Customers Are Saying",
  className,
}: CustomerReviewsSectionProps) {
  const averageRating = useMemo(() => averageReviewRating(reviews), [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section
      className={cn("mx-auto mt-14 w-full max-w-4xl border-t border-border pt-10 sm:mt-16", className)}
      aria-labelledby="customer-reviews-heading"
    >
      <div className="px-4 sm:px-0">
        <h2
          id="customer-reviews-heading"
          className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <StarRating rating={averageRating} size="lg" />
        </div>
      </div>

      <div
        className={cn(
          "mt-6 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-3 sm:px-0",
          "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
          "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5",
        )}
        tabIndex={0}
        role="region"
        aria-label="Customer reviews"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
