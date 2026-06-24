import { clientIpFromHeaders, verifyTurnstileToken } from "./turnstileVerify";

const DEFAULT_NEWSLETTER_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-newsletter-signup";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type NewsletterHandlerEnv = {
  NEWSLETTER_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
};

export type NewsletterHandlerResult =
  | { status: number; body: { ok: true; message: string } }
  | { status: number; body: { ok: false; error: string } };

export async function handleNewsletterSignup(
  payload: { email?: unknown; turnstileToken?: unknown },
  env: NewsletterHandlerEnv,
  requestHeaders?: Record<string, string | string[] | undefined>,
): Promise<NewsletterHandlerResult> {
  const email = String(payload.email ?? "").trim();
  const turnstileToken = String(payload.turnstileToken ?? "").trim();
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();

  if (!isValidEmail(email)) {
    return { status: 400, body: { ok: false, error: "Please enter a valid email address." } };
  }

  if (turnstileSecret) {
    if (!turnstileToken) {
      return { status: 400, body: { ok: false, error: "Please complete the security check." } };
    }

    const valid = await verifyTurnstileToken(
      turnstileToken,
      turnstileSecret,
      requestHeaders ? clientIpFromHeaders(requestHeaders) : undefined,
    );

    if (!valid) {
      return {
        status: 400,
        body: { ok: false, error: "Security check failed. Please try again." },
      };
    }
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
    return {
      status: upstream.status,
      body: {
        ok: false,
        error: data?.error ?? "Could not join the newsletter. Please try again.",
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: data?.message ?? "You are on the list! Watch your inbox for Lay-n-Go updates.",
    },
  };
}
