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

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const raw = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(raw.email ?? "").trim().slice(0, 254);
  const phone = String(raw.phone ?? "").trim().slice(0, 40);
  const marketingConsent = raw.marketingConsent === true;

  if (!isValidEmail(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return Response.json({ ok: false, error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!marketingConsent) {
    return Response.json(
      { ok: false, error: "Please agree to receive texts and marketing emails." },
      { status: 400 },
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
      return Response.json(
        { ok: false, error: data?.error ?? "Could not send verification code." },
        { status: upstream.status },
      );
    }
    return Response.json({
      ok: true,
      message: data?.message ?? "Verification code sent.",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not send verification code." },
      { status: 500 },
    );
  }
}