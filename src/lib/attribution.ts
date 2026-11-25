/** Ad click IDs + UTM params captured on landing, kept 30 days in localStorage (newest wins). */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

const STORAGE_KEY = "layngo_attribution_params";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = { params: Record<string, string>; savedAt: number };

function readStored(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.params || typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed.params;
  } catch {
    return {};
  }
}

/** Save attribution params from the landing URL. */
export function captureAttributionParams(): void {
  try {
    const current = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = current.get(key);
      if (value) found[key] = value;
    }
    if (Object.keys(found).length === 0) return;
    const params = { ...readStored(), ...found };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ params, savedAt: Date.now() } satisfies Stored));
  } catch {
    /* storage unavailable */
  }
}

export function getAttributionParams(): Record<string, string> {
  const params = readStored();
  try {
    const current = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const value = current.get(key);
      if (value) params[key] = value;
    }
  } catch {
    /* ignore */
  }
  return params;
}

function readCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/** Attribution params plus Meta _fbp/_fbc cookies, as Shopify cart attributes. */
export function getAttributionAttributes(): Array<{ key: string; value: string }> {
  const attrs = Object.entries(getAttributionParams())
    .filter(([, v]) => !!v)
    .map(([key, value]) => ({ key, value }));
  for (const name of ["_fbp", "_fbc"]) {
    const value = readCookie(name);
    if (value) attrs.push({ key: name, value });
  }
  return attrs;
}
