import { STOREFRONT_HOME_URL } from "@/lib/siteSeo";

export { STOREFRONT_HOME_URL };

/**
 * Headless architecture:
 * - layngo.com (this app) = storefront, cart UI, product pages
 * - layngo-new.myshopify.com = Shopify primary + hosted checkout only
 *
 * Storefront API `cart.checkoutUrl` may reference www.layngo.com or the primary
 * domain. Always rewrite to the permanent .myshopify.com host before sending
 * customers to checkout.
 */
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "layngo-new.myshopify.com";

<<<<<<< HEAD
const HOSTED_CHECKOUT_ORIGIN = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}`;
=======
/**
 * Shopify Plus custom checkout domain. Shopify still hosts checkout, but it is
 * served from this subdomain of layngo.com so buyers stay on the brand.
 * DNS: CNAME checkout.layngo.com -> shops.myshopify.com (set in Shopify Admin
 * → Settings → Domains, then selected under Settings → Checkout).
 */
export const SHOPIFY_CHECKOUT_DOMAIN = "checkout.layngo.com";
>>>>>>> f105b90d4ed9b1b1048bc2b34393c3f35ab83402

/** True when the URL is a Shopify web-checkout entry path. */
export function isShopifyCheckoutPath(pathname: string): boolean {
  return pathname.startsWith("/cart/c/") || pathname.startsWith("/checkouts/");
}

/**
<<<<<<< HEAD
 * Normalize a Storefront API checkout URL to hosted Shopify checkout on
 * `layngo-new.myshopify.com` (e.g. `/cart/c/…` or `/checkouts/…`).
=======
 * Shopify returns checkout on the store primary domain (often www.layngo.com/cart/c/…).
 * The headless host (layngo.com root) doesn't serve those paths, so always
 * rewrite the hostname to the Shopify-managed custom checkout domain.
>>>>>>> f105b90d4ed9b1b1048bc2b34393c3f35ab83402
 */
export function formatCheckoutUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());

<<<<<<< HEAD
    // Always send checkout to Shopify's hosted domain — never layngo.com.
=======
    // If Shopify returned a hostname that points at the headless storefront
    // (layngo.com / www.layngo.com), rewrite to the Shopify-hosted permanent
    // domain so checkout actually loads. The custom checkout subdomain
    // (checkout.layngo.com) is only used if it's already on the URL.
    const host = url.hostname.toLowerCase();
    const isHeadlessHost =
      host === "layngo.com" ||
      host === "www.layngo.com" ||
      host.endsWith(".lovable.app") ||
      host.endsWith(".lovableproject.com");
    const isShopifyHost =
      host === SHOPIFY_STORE_PERMANENT_DOMAIN ||
      host === SHOPIFY_CHECKOUT_DOMAIN ||
      host.endsWith(".myshopify.com") ||
      host.endsWith(".shopify.com");
    if (isHeadlessHost || !isShopifyHost) {
      url.hostname = SHOPIFY_STORE_PERMANENT_DOMAIN;
    }

>>>>>>> f105b90d4ed9b1b1048bc2b34393c3f35ab83402
    url.protocol = "https:";
    url.hostname = SHOPIFY_STORE_PERMANENT_DOMAIN;
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
      parsed.hostname === SHOPIFY_STORE_PERMANENT_DOMAIN &&
      isShopifyCheckoutPath(parsed.pathname)
    );
  } catch {
    return false;
  }
}

/**
 * Safety net: if a stale checkout link lands on layngo.com, bounce to myshopify.com.
 * Checkout should never be opened on the headless host.
 */
export function redirectHeadlessCheckoutEntry(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === SHOPIFY_CHECKOUT_DOMAIN) return;
  if (window.location.hostname === SHOPIFY_STORE_PERMANENT_DOMAIN) return;
  if (!isShopifyCheckoutPath(window.location.pathname)) return;

  const target = new URL(window.location.href);
  target.hostname = SHOPIFY_STORE_PERMANENT_DOMAIN;
  target.protocol = "https:";
  target.searchParams.set("channel", "online_store");
  target.searchParams.set("skip_shop_pay", "true");
  window.location.replace(target.toString());
}

export { HOSTED_CHECKOUT_ORIGIN };
