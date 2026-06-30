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
  const res = await fetch(reviewsListEndpoint(productHandle));
  if (!res.ok) return [];
  const data = (await res.json()) as { reviews?: CustomerReview[] };
  return data.reviews ?? [];
}
