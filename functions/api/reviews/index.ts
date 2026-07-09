import {
  fetchPublishedReviewsFromN8n,
  reviewsListAuthHeaders,
} from "../../../server/reviewsListUpstream";

interface Env {
  REVIEWS_LIST_WEBHOOK_URL?: string;
  REVIEWS_LIST_WEBHOOK_SECRET?: string;
}

const CACHE_SECONDS = 600;

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=60`,
    },
  });
}

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const url = new URL(context.request.url);
  const productHandle = (url.searchParams.get("productHandle") ?? "").trim().slice(0, 200);
  if (!productHandle) {
    return jsonResponse({ reviews: [] });
  }

  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const reviews = await fetchPublishedReviewsFromN8n(productHandle, context.env);
    const response = jsonResponse({ reviews });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return jsonResponse({ reviews: [] });
  }
}

// Re-export for tests / typing — header name used when proxying to n8n.
export { reviewsListAuthHeaders };
