import type { IncomingMessage, ServerResponse } from "http";

const DEFAULT_CONTACT_FORM_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-contact-form";

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

export function createContactApiMiddleware(env: Record<string, string>) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url !== "/api/contact" || req.method !== "POST") {
      next();
      return;
    }

    try {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      const webhookUrl = env.CONTACT_FORM_WEBHOOK_URL || DEFAULT_CONTACT_FORM_WEBHOOK_URL;

      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await upstream.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!upstream.ok) {
        sendJson(res, upstream.status, {
          ok: false,
          error: data?.error ?? "Could not send your message. Please try again or email info@layngo.com.",
        });
        return;
      }

      sendJson(res, 200, {
        ok: true,
        message: data?.message ?? "Thanks — we received your message and will get back to you soon.",
      });
    } catch (err) {
      console.error("[contact-api]", err);
      sendJson(res, 500, {
        ok: false,
        error: "Could not send your message. Please try again or email info@layngo.com.",
      });
    }
  };
}
