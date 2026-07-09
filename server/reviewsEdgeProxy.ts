const BOT_UA =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|bingpreview|bytespider|gptbot|semrush|ahrefs|petalbot|yandex|baiduspider|headlesschrome|phantomjs/i;

const CACHE_SECONDS = 3600;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 30;

export function reviewsCacheSeconds(): number {
  return CACHE_SECONDS;
}

export function isLikelyAutomatedClient(request: Request): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua.trim()) return true;
  return BOT_UA.test(ua);
}

export function reviewsJsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": `public, max-age=${reviewsCacheSeconds()}, stale-while-revalidate=300`,
    },
  });
}

/** Cheap per-IP throttle using the edge cache — avoids hammering n8n on cache misses. */
export async function isReviewsRateLimited(request: Request): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip")?.trim();
  if (!ip) return false;

  const cache = caches.default;
  const key = new Request(`https://reviews-rate-limit.layngo.internal/${ip}`);
  const existing = await cache.match(key);
  const count = existing ? Number(await existing.text()) || 0 : 0;

  if (count >= RATE_LIMIT_MAX_REQUESTS) return true;

  await cache.put(key, new Response(String(count + 1)), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
  return false;
}

export function shouldBypassN8nUpstream(request: Request): boolean {
  return isLikelyAutomatedClient(request);
}
