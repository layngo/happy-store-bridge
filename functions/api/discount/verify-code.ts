import { corsPreflightResponse, jsonWithCors } from "../../../server/cors";

interface Env {
  DISCOUNT_VERIFY_CODE_WEBHOOK_URL?: string;
}

const DEFAULT_VERIFY_CODE_WEBHOOK =
  "https://layngo.app.n8n.cloud/webhook/layngo-discount-verify";

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
  const code = String(raw.code ?? "").trim().slice(0, 16);

  if (!isValidEmail(email) || !isValidPhone(phone) || code.length < 4 || code.length > 10) {
    return jsonWithCors(req, { ok: false, error: "Invalid verification request." }, 400);
  }

  const webhookUrl = context.env.DISCOUNT_VERIFY_CODE_WEBHOOK_URL || DEFAULT_VERIFY_CODE_WEBHOOK;

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, code }),
    });
    const data = (await upstream.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
      discountCode?: string;
    } | null;

    if (!upstream.ok) {
      return jsonWithCors(
        req,
        { ok: false, error: data?.error ?? "Incorrect or expired code." },
        upstream.status,
      );
    }
    return jsonWithCors(req, {
      ok: true,
      message: data?.message ?? "You're verified! Use your code at checkout.",
      discountCode: data?.discountCode,
    });
  } catch {
    return jsonWithCors(req, { ok: false, error: "Could not verify code." }, 500);
  }
}
