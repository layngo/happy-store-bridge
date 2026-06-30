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

function sendCodeEndpoint(): string {
  return "/api/discount/send-code";
}

function verifyCodeEndpoint(): string {
  return "/api/discount/verify-code";
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
