export type DiscountSendCodePayload = {
  email: string;
  phone: string;
  marketingConsent: boolean;
};

export type DiscountVerifyCodePayload = {
  email: string;
  phone: string;
  code: string;
};

export type DiscountApiResponse =
  | { ok: true; message?: string; discountCode?: string }
  | { ok: false; error: string };

/** Public Cloudflare Worker — proxies /api/discount to n8n (same as reviews). */
const PRODUCTION_DISCOUNT_API_BASE = "https://happy-store-bridge.tommy-4fd.workers.dev";

/** Worker origin in production; local Vite middleware in dev. */
function discountApiBase(): string {
  if (import.meta.env.DEV) return "";
  const fromEnv = (import.meta.env.VITE_DISCOUNT_API_URL as string | undefined)?.trim();
  const base = fromEnv || PRODUCTION_DISCOUNT_API_BASE;
  return base.replace(/\/$/, "");
}

function sendCodeEndpoint(): string {
  return `${discountApiBase()}/api/discount/send-code`;
}

function verifyCodeEndpoint(): string {
  return `${discountApiBase()}/api/discount/verify-code`;
}

async function postJson<T extends DiscountApiResponse>(
  url: string,
  body: unknown,
): Promise<T> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        error: "Discount signup is temporarily unavailable. Please try again later.",
      } as T;
    }

    const data = (await res.json().catch(() => null)) as T | null;

    if (!res.ok) {
      return {
        ok: false,
        error:
          (data && !data.ok && (data as { error: string }).error) ||
          "Something went wrong. Please try again.",
      } as T;
    }

    return (data ?? { ok: true }) as T;
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Check your connection and try again.",
    } as T;
  }
}

export function sendDiscountVerificationCode(
  payload: DiscountSendCodePayload,
): Promise<DiscountApiResponse> {
  return postJson(sendCodeEndpoint(), payload);
}

export function verifyDiscountCode(
  payload: DiscountVerifyCodePayload,
): Promise<DiscountApiResponse> {
  return postJson(verifyCodeEndpoint(), payload);
}
