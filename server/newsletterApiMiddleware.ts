import type { IncomingMessage, ServerResponse } from "http";
import { handleNewsletterSignup } from "./newsletterHandler";

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

export function createNewsletterApiMiddleware(env: Record<string, string>) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url !== "/api/newsletter" || req.method !== "POST") {
      next();
      return;
    }

    try {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      const result = await handleNewsletterSignup(payload, env, req.headers as Record<string, string | string[] | undefined>);
      sendJson(res, result.status, result.body);
    } catch (err) {
      console.error("[newsletter-api]", err);
      sendJson(res, 500, {
        ok: false,
        error: "Could not join the newsletter. Please try again.",
      });
    }
  };
}
