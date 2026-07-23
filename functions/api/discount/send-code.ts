import { corsPreflightResponse, jsonWithCors } from "../../../server/cors";

interface Env {
  DISCOUNT_SEND_CODE_WEBHOOK_URL?: string;
}

const DEFAULT_SEND_CODE_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-discount-send-code";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10;
}

export async function onRequestOptions(context: {
  request: Request;
}): Promise<Response> {
  return corsPreflightResponse(context.request);
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const req = context.request;
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(raw.email ?? "").trim().slice(0, 254);
  const phone = String(raw.phone ?? "").trim().slice(0, 40);
  const marketingConsent = raw.marketingConsent === true;

  if (!isValidEmail(email)) {
    return jsonWithCors(req, { ok: false, error: "Please enter a valid email." }, 400);
  }
  if (!isValidPhone(phone)) {
    return jsonWithCors(req, { ok: false, error: "Please enter a valid phone number." }, 400);
  }
  if (!marketingConsent) {
    return jsonWithCors(
      req,
      { ok: false, error: "Please agree to receive texts and marketing emails." },
      400,
    );
  }

  const webhookUrl = context.env.DISCOUNT_SEND_CODE_WEBHOOK_URL || DEFAULT_SEND_CODE_WEBHOOK;

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, marketingConsent }),
    });
    const data = (await upstream.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
    } | null;

    if (!upstream.ok) {
      return jsonWithCors(
        req,
        { ok: false, error: data?.error ?? "Could not send verification code." },
        upstream.status,
      );
    }
    return jsonWithCors(req, {
      ok: true,
      message: data?.message ?? "Verification code sent.",
    });
  } catch {
    return jsonWithCors(req, { ok: false, error: "Could not send verification code." }, 500);
  }
}
