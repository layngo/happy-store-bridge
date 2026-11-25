import { STOREFRONT_HOME_URL } from "@/lib/siteSeo";

export { STOREFRONT_HOME_URL };

/**
 * Headless architecture:
 * - layngo.com (this app) = storefront, cart UI, product pages
 * - checkout.layngo.com = Shopify primary domain + hosted checkout
 * - layngo-new.myshopify.com = permanent domain, used only for Storefront API calls
 *
 * Storefront API `cart.checkoutUrl` is used as-is for path/query, with the host
 * forced to the Shopify primary domain (checkout.layngo.com).
 */
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "layngo-new.myshopify.com";
export const SHOPIFY_CHECKOUT_DOMAIN = "checkout.layngo.com";

const HOSTED_CHECKOUT_ORIGIN = `https://${SHOPIFY_CHECKOUT_DOMAIN}`;

/** True when the URL is a Shopify web-checkout entry path. */
export function isShopifyCheckoutPath(pathname: string): boolean {
  return pathname.startsWith("/cart/c/") || pathname.startsWith("/checkouts/");
}

/**
 * Normalize a Storefront API checkout URL to hosted Shopify checkout on
 * `layngo-new.myshopify.com` (e.g. `/cart/c/…` or `/checkouts/…`).
 */
export function formatCheckoutUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());

    // Always send checkout to Shopify's hosted domain: never layngo.com.
    url.protocol = "https:";
    url.hostname = SHOPIFY_CHECKOUT_DOMAIN;
    url.port = "";
    url.searchParams.delete("preview_theme_id");
    url.searchParams.set("channel", "online_store");
    // Avoid shop.app Shop Pay hop (often fails / "refused to connect" off-domain).
    url.searchParams.set("skip_shop_pay", "true");
    return url.toString();
  } catch {
    return null;
  }
}

/** True when a URL is already pointed at hosted Shopify checkout. */
export function isHostedCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === SHOPIFY_CHECKOUT_DOMAIN &&
      isShopifyCheckoutPath(parsed.pathname)
    );
  } catch {
    return false;
  }
}

/**
 * Safety net: if a stale checkout link lands on layngo.com, bounce to checkout.layngo.com.
 * Checkout should never be opened on the headless host.
 */
export function redirectHeadlessCheckoutEntry(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === SHOPIFY_CHECKOUT_DOMAIN) return;
  if (!isShopifyCheckoutPath(window.location.pathname)) return;

  const target = new URL(window.location.href);
  target.hostname = SHOPIFY_CHECKOUT_DOMAIN;
  target.protocol = "https:";
  target.port = "";
  target.searchParams.delete("preview_theme_id");
  target.searchParams.set("channel", "online_store");
  target.searchParams.set("skip_shop_pay", "true");
  window.location.replace(target.toString());
}

export { HOSTED_CHECKOUT_ORIGIN };
