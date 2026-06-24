type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<boolean> {
  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    return false;
  }

  const data = (await res.json()) as TurnstileVerifyResponse;
  return data.success === true;
}

export function clientIpFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): string | undefined {
  const cf = headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf;

  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  return undefined;
}
