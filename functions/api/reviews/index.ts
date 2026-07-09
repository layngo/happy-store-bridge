import { fetchPublishedReviewsFromN8n } from "../../../server/reviewsListUpstream";
import {
  isReviewsRateLimited,
  reviewsJsonResponse,
  shouldBypassN8nUpstream,
} from "../../../server/reviewsEdgeProxy";

interface Env {
  REVIEWS_LIST_WEBHOOK_URL?: string;
  REVIEWS_LIST_WEBHOOK_SECRET?: string;
}

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const url = new URL(context.request.url);
  const productHandle = (url.searchParams.get("productHandle") ?? "").trim().slice(0, 200);
  if (!productHandle) {
    return reviewsJsonResponse({ reviews: [] });
  }

  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // Bots and crawlers get an empty list from the edge — never call n8n.
  if (shouldBypassN8nUpstream(context.request)) {
    return reviewsJsonResponse({ reviews: [] });
  }

  if (await isReviewsRateLimited(context.request)) {
    return reviewsJsonResponse({ reviews: [] });
  }

  try {
    const reviews = await fetchPublishedReviewsFromN8n(productHandle, context.env);
    const response = reviewsJsonResponse({ reviews });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return reviewsJsonResponse({ reviews: [] });
  }
}
