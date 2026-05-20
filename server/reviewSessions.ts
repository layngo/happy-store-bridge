import { randomUUID } from "crypto";

type Session = {
  orderName: string;
  productHandle: string;
  expiresAt: number;
};

const sessions = new Map<string, Session>();
const TTL_MS = 30 * 60 * 1000;

export function createVerificationToken(payload: { orderName: string; productHandle: string }): string {
  const token = randomUUID();
  sessions.set(token, {
    ...payload,
    expiresAt: Date.now() + TTL_MS,
  });
  return token;
}

export function consumeVerificationToken(
  token: string,
  productHandle: string,
): { ok: true; orderName: string } | { ok: false; error: string } {
  const session = sessions.get(token);
  if (!session) {
    return { ok: false, error: "Please verify your order number again." };
  }
  sessions.delete(token);

  if (Date.now() > session.expiresAt) {
    return { ok: false, error: "Verification expired. Please verify your order again." };
  }

  if (session.productHandle && session.productHandle !== productHandle) {
    return { ok: false, error: "This verification is for a different product." };
  }

  return { ok: true, orderName: session.orderName };
}
