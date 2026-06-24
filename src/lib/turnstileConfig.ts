/** Public Turnstile site key — set VITE_TURNSTILE_SITE_KEY in .env / Cloudflare Pages build env. */
export const TURNSTILE_SITE_KEY = (
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? ""
).trim();

export function isTurnstileConfigured(): boolean {
  return TURNSTILE_SITE_KEY.length > 0;
}
