import { STOREFRONT_HOME_URL } from "@/lib/siteSeo";

export { STOREFRONT_HOME_URL };

/** Shopify permanent `.myshopify.com` domain (Storefront API + hosted checkout). */
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "layngo-new.myshopify.com";

/**
 * Shopify Plus custom checkout domain. Shopify still hosts checkout, but it is
 * served from this subdomain of layngo.com so buyers stay on the brand.
 * DNS: CNAME checkout.layngo.com -> shops.myshopify.com (set in Shopify Admin
 * → Settings → Domains, then selected under Settings → Checkout).
 */
export const SHOPIFY_CHECKOUT_DOMAIN = "checkout.layngo.com";

/** True when the URL is a Shopify web-checkout entry path. */
export function isShopifyCheckoutPath(pathname: string): boolean {
  return pathname.startsWith("/cart/c/") || pathname.startsWith("/checkouts/");
}

/**
 * Shopify returns checkout on the store primary domain (often www.layngo.com/cart/c/…).
 * The headless host (layngo.com root) doesn't serve those paths, so always
 * rewrite the hostname to the Shopify-managed custom checkout domain.
 */
export function formatCheckoutUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());

    // Always route checkout through the Shopify-hosted custom checkout domain.
    url.hostname = SHOPIFY_CHECKOUT_DOMAIN;

    url.protocol = "https:";
    url.searchParams.set("channel", "online_store");
    // Avoid shop.app Shop Pay hop (often fails / "refused to connect" off-domain).
    url.searchParams.set("skip_shop_pay", "true");
    return url.toString();
  } catch {
    return raw.trim();
  }
}

/** If a checkout link lands on the headless host, bounce to Shopify checkout. */
export function redirectHeadlessCheckoutEntry(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === SHOPIFY_CHECKOUT_DOMAIN) return;
  if (window.location.hostname === SHOPIFY_STORE_PERMANENT_DOMAIN) return;
  if (!isShopifyCheckoutPath(window.location.pathname)) return;

  const target = new URL(window.location.href);
  target.hostname = SHOPIFY_CHECKOUT_DOMAIN;
  target.protocol = "https:";
  target.searchParams.set("channel", "online_store");
  target.searchParams.set("skip_shop_pay", "true");
  window.location.replace(target.toString());
}
