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

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const raw = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(raw.email ?? "").trim().slice(0, 254);
  const phone = String(raw.phone ?? "").trim().slice(0, 40);
  const code = String(raw.code ?? "").trim().slice(0, 16);

  if (!isValidEmail(email) || !isValidPhone(phone) || code.length < 4 || code.length > 10) {
    return Response.json({ ok: false, error: "Invalid verification request." }, { status: 400 });
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
      return Response.json(
        { ok: false, error: data?.error ?? "Incorrect or expired code." },
        { status: upstream.status },
      );
    }
    return Response.json({
      ok: true,
      message: data?.message ?? "You're verified! Use your code at checkout.",
      discountCode: data?.discountCode,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not verify code." },
      { status: 500 },
    );
  }
}