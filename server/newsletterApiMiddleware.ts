import type { IncomingMessage, ServerResponse } from "http";

const DEFAULT_NEWSLETTER_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-newsletter-signup";

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      const email = String(payload.email ?? "").trim();

      if (!isValidEmail(email)) {
        sendJson(res, 400, { ok: false, error: "Please enter a valid email address." });
        return;
      }

      const webhookUrl = env.NEWSLETTER_WEBHOOK_URL || DEFAULT_NEWSLETTER_WEBHOOK_URL;
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await upstream.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!upstream.ok) {
        sendJson(res, upstream.status, {
          ok: false,
          error: data?.error ?? "Could not join the newsletter. Please try again.",
        });
        return;
      }

      sendJson(res, 200, {
        ok: true,
        message: data?.message ?? "You are on the list! Watch your inbox for Lay-n-Go updates.",
      });
    } catch (err) {
      console.error("[newsletter-api]", err);
      sendJson(res, 500, {
        ok: false,
        error: "Could not join the newsletter. Please try again.",
      });
    }
  };
}
