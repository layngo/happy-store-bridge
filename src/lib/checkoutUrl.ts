/** Shopify permanent `.myshopify.com` domain (Storefront API). */
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "layngo-new.myshopify.com";

/**
 * Hostname that serves Shopify checkout (not the headless storefront).
 * Set `VITE_SHOPIFY_CHECKOUT_HOST` after adding this subdomain in Shopify Admin → Domains.
 */
export const SHOPIFY_CHECKOUT_HOST =
  import.meta.env.VITE_SHOPIFY_CHECKOUT_HOST?.trim() || "checkout.layngo.com";

const STOREFRONT_HOSTS = new Set(["layngo.com", "www.layngo.com"]);

/** True when the URL is a Shopify web-checkout entry path. */
export function isShopifyCheckoutPath(pathname: string): boolean {
  return pathname.startsWith("/cart/c/") || pathname.startsWith("/checkouts/");
}

/**
 * Shopify returns checkout on the store primary domain (`www.layngo.com/cart/c/...`).
 * The headless site owns `layngo.com`, so those paths 404 — send checkout to `checkout.layngo.com`.
 */
export function formatCheckoutUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());

    if (
      isShopifyCheckoutPath(url.pathname) &&
      (STOREFRONT_HOSTS.has(url.hostname) || url.hostname === SHOPIFY_STORE_PERMANENT_DOMAIN)
    ) {
      url.hostname = SHOPIFY_CHECKOUT_HOST;
    }

    url.protocol = "https:";
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return raw.trim();
  }
}

/** Redirect legacy checkout links that land on the headless host before React boots. */
export function redirectHeadlessCheckoutEntry(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === SHOPIFY_CHECKOUT_HOST) return;
  if (!isShopifyCheckoutPath(window.location.pathname)) return;

  const target = new URL(window.location.href);
  target.hostname = SHOPIFY_CHECKOUT_HOST;
  target.protocol = "https:";
  window.location.replace(target.toString());
}
