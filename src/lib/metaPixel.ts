/** Meta Pixel / Dataset ID (Events Manager). */
export const META_PIXEL_ID = "317484505801181";

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

/** Events that should fire at most once per identical payload until route changes. */
const ONCE_PER_NAV_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "ViewItemList",
  "ViewCart",
  "Search",
  "Lead",
  "InitiateCheckout",
]);

/** User-action events: suppress only rapid identical duplicates (double-clicks / remounts). */
const BURST_DEDUPE_MS = 400;

const firedOnceKeys = new Set<string>();
const lastBurstAt = new Map<string, number>();

function fbq(): Fbq | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { fbq?: Fbq }).fbq;
}

function stableParamsKey(params?: Record<string, unknown>): string {
  if (!params) return "";
  try {
    const ids = params.content_ids;
    if (Array.isArray(ids) && ids.length) {
      return `${ids.join(",")}:${String(params.value ?? "")}:${String(params.currency ?? "")}`;
    }
    if (typeof params.search_string === "string") return params.search_string;
    if (typeof params.content_name === "string") {
      return `${params.content_name}:${String(params.value ?? "")}`;
    }
    return JSON.stringify(params);
  } catch {
    return "";
  }
}

function shouldSkipDuplicate(event: string, params?: Record<string, unknown>): boolean {
  const key = `${event}::${stableParamsKey(params)}`;
  const now = Date.now();

  if (ONCE_PER_NAV_EVENTS.has(event)) {
    if (firedOnceKeys.has(key)) return true;
    firedOnceKeys.add(key);
    return false;
  }

  const last = lastBurstAt.get(key) ?? 0;
  if (now - last < BURST_DEDUPE_MS) return true;
  lastBurstAt.set(key, now);
  return false;
}

/** Clear once-per-navigation guards on SPA route changes (keeps AddToCart burst map). */
export function resetMetaPixelNavigationDedupe() {
  firedOnceKeys.clear();
}

/** Fire a Meta standard or custom event when the pixel is available. */
export function trackMeta(event: string, params?: Record<string, unknown>, custom = false) {
  if (shouldSkipDuplicate(event, params)) return;
  const pixel = fbq();
  if (!pixel) return;
  if (custom) {
    pixel("trackCustom", event, params ?? {});
  } else {
    pixel("track", event, params ?? {});
  }
}

/** SPA route change — Meta needs an explicit PageView (base snippet only covers first load). */
export function trackMetaPageView() {
  trackMeta("PageView");
}
