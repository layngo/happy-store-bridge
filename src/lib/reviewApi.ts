import type { CustomerReview } from "@/data/customerReviews";

export type VerifyOrderResponse =
  | { ok: true; orderName: string; verificationToken: string }
  | { ok: false; error: string };

export type SubmitReviewPayload = {
  productHandle: string;
  name: string;
  verificationToken: string;
  rating: number;
  title?: string;
  text: string;
  imageBase64?: string;
};

export type SubmitReviewResponse =
  | { ok: true; pending: true; message: string }
  | { ok: false; error: string };

const DEFAULT_REVIEW_SUBMIT_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-review-submit";
const DEFAULT_REVIEWS_LIST_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-reviews-list";

function reviewSubmitEndpoint(): string {
  if (import.meta.env.DEV) return "/api/reviews/submit";
  return (
    (import.meta.env.VITE_REVIEW_SUBMIT_WEBHOOK_URL as string | undefined) ||
    DEFAULT_REVIEW_SUBMIT_WEBHOOK
  );
}

function reviewsListEndpoint(productHandle: string): string {
  const query = `productHandle=${encodeURIComponent(productHandle)}`;
  if (import.meta.env.DEV) return `/api/reviews?${query}`;
  const base =
    (import.meta.env.VITE_REVIEWS_LIST_WEBHOOK_URL as string | undefined) ||
    DEFAULT_REVIEWS_LIST_WEBHOOK;
  return `${base}?${query}`;
}

export async function verifyOrderForReview(
  orderNumber: string,
  productHandle: string,
): Promise<VerifyOrderResponse> {
  const res = await fetch("/api/reviews/verify-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderNumber, productHandle }),
  });
  return res.json() as Promise<VerifyOrderResponse>;
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
  const res = await fetch(reviewsListEndpoint(productHandle));
  if (!res.ok) return [];
  const data = (await res.json()) as { reviews?: CustomerReview[] };
  return data.reviews ?? [];
}
