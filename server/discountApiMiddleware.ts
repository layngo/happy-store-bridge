import type { IncomingMessage, ServerResponse } from "http";
import { generateOtpCode, saveOtp, verifyOtp } from "./discountOtpStore";

const DEFAULT_SEND_CODE_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-discount-send-code";
const DEFAULT_VERIFY_CODE_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-discount-verify";

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

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10;
}

async function proxyToN8n(webhookUrl: string, payload: unknown) {
  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await upstream.json().catch(() => null)) as {
    ok?: boolean;
    message?: string;
    error?: string;
    discountCode?: string;
  } | null;

  return { upstream, data };
}

export function createDiscountApiMiddleware(env: Record<string, string>) {
  const sendWebhook = env.DISCOUNT_SEND_CODE_WEBHOOK_URL || DEFAULT_SEND_CODE_WEBHOOK;
  const verifyWebhook = env.DISCOUNT_VERIFY_CODE_WEBHOOK_URL || DEFAULT_VERIFY_CODE_WEBHOOK;
  const useN8nOtp = env.DISCOUNT_OTP_VIA_N8N === "true";

  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split("?")[0];

    if (req.method !== "POST") {
      next();
      return;
    }

    if (url === "/api/discount/send-code") {
      try {
        const body = await readBody(req);
        const payload = body ? JSON.parse(body) : {};
        const email = String(payload.email ?? "").trim();
        const phone = String(payload.phone ?? "").trim();
        const marketingConsent = payload.marketingConsent === true;

        if (!isValidEmail(email)) {
          sendJson(res, 400, { ok: false, error: "Please enter a valid email." });
          return;
        }
        if (!isValidPhone(phone)) {
          sendJson(res, 400, { ok: false, error: "Please enter a valid phone number." });
          return;
        }
        if (!marketingConsent) {
          sendJson(res, 400, {
            ok: false,
            error: "Please agree to receive texts and marketing emails.",
          });
          return;
        }

        if (useN8nOtp) {
          const { upstream, data } = await proxyToN8n(sendWebhook, {
            email,
            phone,
            marketingConsent,
          });
          if (!upstream.ok) {
            sendJson(res, upstream.status, {
              ok: false,
              error: data?.error ?? "Could not send verification code.",
            });
            return;
          }
          sendJson(res, 200, {
            ok: true,
            message: data?.message ?? "Verification code sent.",
          });
          return;
        }

        const code = generateOtpCode();
        saveOtp(phone, email, marketingConsent, code);

        if (env.NODE_ENV !== "production") {
          console.info(`[discount-otp] ${phone} → ${code}`);
        }

        const { upstream, data } = await proxyToN8n(sendWebhook, {
          email,
          phone,
          marketingConsent,
          code,
          devMode: true,
        }).catch(() => ({ upstream: { ok: true } as Response, data: null }));

        if (!upstream.ok) {
          console.warn("[discount-api] n8n send-code webhook failed; OTP still stored locally");
        }

        sendJson(res, 200, {
          ok: true,
          message: data?.message ?? "Check your email for the code.",
        });
      } catch (err) {
        console.error("[discount-api] send-code", err);
        sendJson(res, 500, { ok: false, error: "Could not send verification code." });
      }
      return;
    }

    if (url === "/api/discount/verify-code") {
      try {
        const body = await readBody(req);
        const payload = body ? JSON.parse(body) : {};
        const email = String(payload.email ?? "").trim();
        const phone = String(payload.phone ?? "").trim();
        const code = String(payload.code ?? "").trim();

        if (!isValidEmail(email) || !isValidPhone(phone) || code.length < 4) {
          sendJson(res, 400, { ok: false, error: "Invalid verification request." });
          return;
        }

        if (!useN8nOtp) {
          const result = verifyOtp(phone, email, code);
          if (!result.ok) {
            sendJson(res, 400, result);
            return;
          }

          const { upstream, data } = await proxyToN8n(verifyWebhook, {
            email: result.record.email,
            phone: result.record.phone,
            marketingConsent: result.record.marketingConsent,
            verified: true,
          });

          if (!upstream.ok) {
            sendJson(res, upstream.status, {
              ok: false,
              error: data?.error ?? "Could not complete signup.",
            });
            return;
          }

          sendJson(res, 200, {
            ok: true,
            message: data?.message ?? "You're verified! Use your code at checkout.",
            discountCode: data?.discountCode,
          });
          return;
        }

        const { upstream, data } = await proxyToN8n(verifyWebhook, {
          email,
          phone,
          code,
        });

        if (!upstream.ok) {
          sendJson(res, upstream.status, {
            ok: false,
            error: data?.error ?? "Incorrect or expired code.",
          });
          return;
        }

        sendJson(res, 200, {
          ok: true,
          message: data?.message ?? "You're verified! Use your code at checkout.",
          discountCode: data?.discountCode,
        });
      } catch (err) {
        console.error("[discount-api] verify-code", err);
        sendJson(res, 500, { ok: false, error: "Could not verify code." });
      }
      return;
    }

    next();
  };
}
