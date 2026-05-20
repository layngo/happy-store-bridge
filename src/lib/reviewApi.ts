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
): Promise<{ ok: true; review: CustomerReview } | { ok: false; error: string }> {
  const res = await fetch("/api/reviews/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<{ ok: true; review: CustomerReview } | { ok: false; error: string }>;
}

export async function fetchSubmittedReviews(productHandle: string): Promise<CustomerReview[]> {
  const res = await fetch(`/api/reviews?productHandle=${encodeURIComponent(productHandle)}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { reviews?: CustomerReview[] };
  return data.reviews ?? [];
}
