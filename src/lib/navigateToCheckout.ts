import { decorateCheckoutUrlWithGaLinker } from "@/lib/gaLinker";

/** True when this page is inside another site's iframe (e.g. Lovable preview). */
export function isEmbeddedInFrame(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function openCheckoutInNewTab(checkoutUrl: string): boolean {
  const popup = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  if (popup) {
    popup.opener = null;
    return true;
  }

  // Popup blocked: fall back to a user-initiated anchor click which keeps
  // the current tab on the storefront.
  const link = document.createElement("a");
  link.href = checkoutUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

const ATTRIBUTION_KEYS = [
  "fbclid",
  "gclid",
  "ttclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_id",
  "utm_term",
] as const;

const STORAGE_KEY = "layngo_attribution_params";

/** Capture attribution params from the landing URL so they survive in-app navigation. */
export function captureAttributionParams(): void {
  try {
    const current = new URLSearchParams(window.location.search);
    const stored: Record<string, string> = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) || "{}",
    );
    let changed = false;
    for (const key of ATTRIBUTION_KEYS) {
      const value = current.get(key);
      if (value) {
        stored[key] = value;
        changed = true;
      }
    }
    if (changed) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* storage unavailable */
  }
}

function getAttributionParams(): Record<string, string> {
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  const current = new URLSearchParams(window.location.search);
  for (const key of ATTRIBUTION_KEYS) {
    const value = current.get(key);
    if (value) stored[key] = value;
  }
  return stored;
}

/** Append fbclid / utm_* attribution params onto the Shopify checkout URL. */
export function withAttributionParams(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    for (const [key, value] of Object.entries(getAttributionParams())) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Send the buyer to Shopify hosted checkout in a new top-level tab.
 * Never navigates the current frame when embedded: Shopify blocks iframes
 * (browser shows "refused to connect" for layngo-new.myshopify.com).
 *
 * Appends GA4 cross-domain `_gl` linker params plus fbclid/utm_* attribution
 * before opening the tab.
 */
export async function navigateToCheckout(checkoutUrl: string): Promise<void> {
  const linkedUrl = await decorateCheckoutUrlWithGaLinker(
    withAttributionParams(checkoutUrl),
  );
  openCheckoutInNewTab(linkedUrl);
}

