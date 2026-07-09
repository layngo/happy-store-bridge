import type { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

import { fetchPublishedReviewsFromN8n } from "./reviewsListUpstream";

const DEFAULT_REVIEW_SUBMIT_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-review-submit";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export function createReviewApiMiddleware(env: Record<string, string>) {
  const submitWebhook = env.REVIEW_SUBMIT_WEBHOOK_URL || DEFAULT_REVIEW_SUBMIT_WEBHOOK;

  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url || !req.url.startsWith("/api/reviews")) {
      next();
      return;
    }

    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = url.pathname;

      if (req.method === "GET" && pathname === "/api/reviews") {
        const productHandle = url.searchParams.get("productHandle") ?? "";
        const { listReviewsForProduct, storedToCustomerReview } = await import("./reviewStore");
        const local = await listReviewsForProduct(productHandle);
        const remote = (await fetchPublishedReviewsFromN8n(productHandle, {
          REVIEWS_LIST_WEBHOOK_URL: env.REVIEWS_LIST_WEBHOOK_URL,
          REVIEWS_LIST_WEBHOOK_SECRET: env.REVIEWS_LIST_WEBHOOK_SECRET,
        })) as ReturnType<typeof storedToCustomerReview>[];
        const merged = [...local.map(storedToCustomerReview), ...remote];
        sendJson(res, 200, { reviews: merged });
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        const json = body ? (JSON.parse(body) as Record<string, unknown>) : {};

        if (pathname === "/api/reviews/submit") {
          const productHandle = String(json.productHandle ?? "");
          const name = String(json.name ?? "").trim();
          const text = String(json.text ?? "").trim();
          const rating = Number(json.rating);
          const title = json.title ? String(json.title).trim() : undefined;
          const imageBase64 = json.imageBase64 ? String(json.imageBase64) : undefined;

          if (name.length < 2) {
            sendJson(res, 400, { ok: false, error: "Please enter your name." });
            return;
          }
          if (text.length < 10) {
            sendJson(res, 400, {
              ok: false,
              error: "Please write at least a few words in your review.",
            });
            return;
          }

          const normalizedRating = Math.round(rating * 2) / 2;
          if (normalizedRating < 1 || normalizedRating > 5) {
            sendJson(res, 400, { ok: false, error: "Rating must be between 1 and 5 stars." });
            return;
          }

          if (imageBase64 && imageBase64.length > 2_500_000) {
            sendJson(res, 400, {
              ok: false,
              error: "Photo is too large. Please use an image under 2MB.",
            });
            return;
          }

          const upstream = await fetch(submitWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productHandle,
              name,
              rating: normalizedRating,
              title,
              text,
              hasImage: Boolean(imageBase64),
            }),
          });

          const data = (await upstream.json().catch(() => null)) as {
            ok?: boolean;
            pending?: boolean;
            message?: string;
            error?: string;
          } | null;

          if (!upstream.ok) {
            sendJson(res, upstream.status, {
              ok: false,
              error: data?.error ?? "Could not submit your review. Please try again.",
            });
            return;
          }

          sendJson(res, 200, {
            ok: true,
            pending: true,
            message:
              data?.message ?? "Thank you! Your review will be published shortly.",
          });
          return;
        }
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      console.error("[review-api]", err);
      sendJson(res, 500, { error: "Something went wrong. Please try again." });
    }
  };
}
