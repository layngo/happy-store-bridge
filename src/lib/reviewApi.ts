import type { CustomerReview } from "@/data/customerReviews";

export type SubmitReviewPayload = {
  productHandle: string;
  name: string;
  rating: number;
  title?: string;
  text: string;
  imageBase64?: string;
};

export type SubmitReviewResponse =
  | { ok: true; pending: true; message: string }
  | { ok: false; error: string };

/** In-memory dedupe + short cache so summary + section share one request. */
const CLIENT_CACHE_TTL_MS = 10 * 60 * 1000;
const reviewCache = new Map<string, { at: number; reviews: CustomerReview[] }>();
const inflight = new Map<string, Promise<CustomerReview[]>>();

function reviewSubmitEndpoint(): string {
  return "/api/reviews/submit";
}

function reviewsListEndpoint(productHandle: string): string {
  return `/api/reviews?productHandle=${encodeURIComponent(productHandle)}`;
}

export async function submitCustomerReview(
  payload: SubmitReviewPayload,
): Promise<SubmitReviewResponse> {
  const res = await fetch(reviewSubmitEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<SubmitReviewResponse>;
}

export async function fetchSubmittedReviews(productHandle: string): Promise<CustomerReview[]> {
  const key = productHandle.trim().toLowerCase();
  if (!key) return [];

  const cached = reviewCache.get(key);
  if (cached && Date.now() - cached.at < CLIENT_CACHE_TTL_MS) {
    return cached.reviews;
  }

  let pending = inflight.get(key);
  if (!pending) {
    pending = (async () => {
      try {
        const res = await fetch(reviewsListEndpoint(key));
        if (!res.ok) return [];
        const data = (await res.json()) as { reviews?: CustomerReview[] };
        const reviews = data.reviews ?? [];
        reviewCache.set(key, { at: Date.now(), reviews });
        return reviews;
      } catch {
        return [];
      }
    })().finally(() => {
      inflight.delete(key);
    });
    inflight.set(key, pending);
  }

  return pending;
}
