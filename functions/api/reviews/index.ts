interface Env {
  REVIEWS_LIST_WEBHOOK_URL?: string;
}

const DEFAULT_REVIEWS_LIST_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-reviews-list";

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const url = new URL(context.request.url);
  const productHandle = (url.searchParams.get("productHandle") ?? "").trim().slice(0, 200);
  if (!productHandle) {
    return Response.json({ reviews: [] });
  }

  const base = context.env.REVIEWS_LIST_WEBHOOK_URL || DEFAULT_REVIEWS_LIST_WEBHOOK;
  try {
    const upstream = await fetch(`${base}?productHandle=${encodeURIComponent(productHandle)}`);
    if (!upstream.ok) return Response.json({ reviews: [] });
    const data = (await upstream.json().catch(() => null)) as { reviews?: unknown[] } | null;
    return Response.json({ reviews: data?.reviews ?? [] });
  } catch {
    return Response.json({ reviews: [] });
  }
}