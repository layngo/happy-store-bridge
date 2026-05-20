import type { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

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
        const stored = await listReviewsForProduct(productHandle);
        sendJson(res, 200, { reviews: stored.map(storedToCustomerReview) });
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        const json = body ? (JSON.parse(body) as Record<string, unknown>) : {};

        if (pathname === "/api/reviews/verify-order") {
          const { verifyShopifyOrder } = await import("./shopifyOrderVerify");
          const result = await verifyShopifyOrder(
            String(json.orderNumber ?? ""),
            json.productHandle ? String(json.productHandle) : undefined,
            env,
          );
          sendJson(res, result.ok ? 200 : 400, result);
          return;
        }

        if (pathname === "/api/reviews/submit") {
          const { submitReview, storedToCustomerReview } = await import("./reviewStore");
          const result = await submitReview({
            productHandle: String(json.productHandle ?? ""),
            name: String(json.name ?? ""),
            verificationToken: String(json.verificationToken ?? ""),
            rating: Number(json.rating),
            title: json.title ? String(json.title) : undefined,
            text: String(json.text ?? ""),
            imageBase64: json.imageBase64 ? String(json.imageBase64) : undefined,
          });
          if (!result.ok) {
            sendJson(res, 400, result);
            return;
          }
          sendJson(res, 200, { ok: true, review: storedToCustomerReview(result.review) });
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
