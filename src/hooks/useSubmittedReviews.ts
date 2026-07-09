import { useEffect, useState } from "react";
import type { CustomerReview } from "@/data/customerReviews";
import { fetchSubmittedReviews } from "@/lib/reviewApi";

/** One shared fetch per product page — avoids duplicate `/api/reviews` calls. */
export function useSubmittedReviews(productHandle: string, enabled = true): CustomerReview[] {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    if (!enabled || !productHandle.trim()) {
      setReviews([]);
      return;
    }

    let cancelled = false;
    fetchSubmittedReviews(productHandle).then((list) => {
      if (!cancelled) setReviews(list);
    });

    return () => {
      cancelled = true;
    };
  }, [productHandle, enabled]);

  return reviews;
}
