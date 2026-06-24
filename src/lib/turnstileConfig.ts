/**
 * Public Turnstile site key (safe in the client bundle).
 * Override with VITE_TURNSTILE_SITE_KEY in .env / Cloudflare build env when rotating keys.
 */
const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAADp_KNXFTEMIcyNL";

export const TURNSTILE_SITE_KEY = (
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ||
  DEFAULT_TURNSTILE_SITE_KEY
).trim();

export function isTurnstileConfigured(): boolean {
  return TURNSTILE_SITE_KEY.length > 0;
}
