import { handleNewsletterSignup } from "../../server/newsletterHandler";

interface Env {
  NEWSLETTER_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const payload = (await context.request.json().catch(() => ({}))) as {
    email?: unknown;
    turnstileToken?: unknown;
  };

  const headers: Record<string, string> = {};
  context.request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const result = await handleNewsletterSignup(
    payload,
    {
      NEWSLETTER_WEBHOOK_URL: context.env.NEWSLETTER_WEBHOOK_URL,
      TURNSTILE_SECRET_KEY: context.env.TURNSTILE_SECRET_KEY,
    },
    headers,
  );

  return Response.json(result.body, { status: result.status });
};
