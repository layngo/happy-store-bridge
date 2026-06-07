type OtpRecord = {
  email: string;
  phone: string;
  marketingConsent: boolean;
  code: string;
  expiresAt: number;
};

const store = new Map<string, OtpRecord>();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

function otpKey(phone: string): string {
  return normalizePhone(phone);
}

export function saveOtp(
  phone: string,
  email: string,
  marketingConsent: boolean,
  code: string,
  ttlMs = 10 * 60 * 1000,
): void {
  const key = otpKey(phone);
  store.set(key, {
    email: email.trim().toLowerCase(),
    phone: key,
    marketingConsent,
    code,
    expiresAt: Date.now() + ttlMs,
  });
}

export function verifyOtp(
  phone: string,
  email: string,
  code: string,
): { ok: true; record: OtpRecord } | { ok: false; error: string } {
  const key = otpKey(phone);
  const record = store.get(key);

  if (!record) {
    return { ok: false, error: "No verification code found. Request a new code." };
  }

  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { ok: false, error: "That code expired. Request a new one." };
  }

  if (record.email !== email.trim().toLowerCase()) {
    return { ok: false, error: "Email does not match this verification." };
  }

  if (record.code !== code.trim()) {
    return { ok: false, error: "Incorrect code. Try again." };
  }

  store.delete(key);
  return { ok: true, record };
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
