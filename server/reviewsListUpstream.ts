/** Shared secret header — only Cloudflare `/api/reviews` should send this to n8n. */
export const REVIEWS_LIST_AUTH_HEADER = "X-Layngo-Reviews-Token";

const DEFAULT_REVIEWS_LIST_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-reviews-list";

export function reviewsListWebhookUrl(env: { REVIEWS_LIST_WEBHOOK_URL?: string }): string {
  return env.REVIEWS_LIST_WEBHOOK_URL || DEFAULT_REVIEWS_LIST_WEBHOOK;
}

export function reviewsListAuthHeaders(
  secret: string | undefined,
): Record<string, string> | undefined {
  const token = secret?.trim();
  if (!token) return undefined;
  return { [REVIEWS_LIST_AUTH_HEADER]: token };
}

export async function fetchPublishedReviewsFromN8n(
  productHandle: string,
  env: { REVIEWS_LIST_WEBHOOK_URL?: string; REVIEWS_LIST_WEBHOOK_SECRET?: string },
): Promise<unknown[]> {
  const url = `${reviewsListWebhookUrl(env)}?productHandle=${encodeURIComponent(productHandle)}`;
  const headers = reviewsListAuthHeaders(env.REVIEWS_LIST_WEBHOOK_SECRET);

  const upstream = await fetch(url, { headers });
  if (!upstream.ok) return [];

  const data = (await upstream.json().catch(() => null)) as { reviews?: unknown[] } | null;
  return data?.reviews ?? [];
}
