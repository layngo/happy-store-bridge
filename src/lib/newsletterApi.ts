export type NewsletterSignupPayload = {
  email: string;
};

export type NewsletterSignupResponse =
  | { ok: true; message: string }
  | { ok: false; error: string };

const DEFAULT_NEWSLETTER_WEBHOOK_URL =
  "https://layngo.app.n8n.cloud/webhook/layngo-newsletter-signup";

function newsletterEndpoint(): string {
  if (import.meta.env.DEV) {
    return "/api/newsletter";
  }

  return (
    (import.meta.env.VITE_NEWSLETTER_WEBHOOK_URL as string | undefined) ||
    DEFAULT_NEWSLETTER_WEBHOOK_URL
  );
}

export async function subscribeToNewsletter(
  payload: NewsletterSignupPayload,
): Promise<NewsletterSignupResponse> {
  try {
    const res = await fetch(newsletterEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
    } | null;

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error ?? "Could not join the newsletter. Please try again.",
      };
    }

    return {
      ok: true,
      message: data?.message ?? "You are on the list! Watch your inbox for Lay-n-Go updates.",
    };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Check your connection and try again.",
    };
  }
}
