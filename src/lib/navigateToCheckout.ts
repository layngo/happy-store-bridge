import { decorateCheckoutUrlWithGaLinker } from "@/lib/gaLinker";
import {
  captureAttributionParams,
  getAttributionAttributes,
  getAttributionParams,
} from "@/lib/attribution";
import { giftAttributes, updateCartAttributes } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export { captureAttributionParams };

/** True when this page is inside another site's iframe (e.g. Lovable preview). */
export function isEmbeddedInFrame(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/** Append saved utm_* / fbclid / gclid onto the Shopify checkout URL. */
export function withAttributionParams(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    for (const [key, value] of Object.entries(getAttributionParams())) {
      if (value) url.searchParams.set(key, value);
    }
    url.searchParams.delete("preview_theme_id");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/** Write attribution + _fbp/_fbc (and gift details) to the Shopify cart attributes. */
async function saveAttributionToCart(): Promise<void> {
  const { cartId, isGift, giftMessage } = useCartStore.getState();
  if (!cartId) return;
  const attributes = [
    ...giftAttributes(isGift ? giftMessage : ""),
    ...getAttributionAttributes(),
  ];
  await updateCartAttributes(cartId, attributes);
}

/**
 * Send the buyer to Shopify hosted checkout (checkout.layngo.com) in the same tab.
 * Inside an iframe (Lovable preview) Shopify refuses to load, so open a new tab there only.
 */
export async function navigateToCheckout(checkoutUrl: string): Promise<void> {
  await saveAttributionToCart();
  const linkedUrl = await decorateCheckoutUrlWithGaLinker(withAttributionParams(checkoutUrl));
  if (isEmbeddedInFrame()) {
    window.open(linkedUrl, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(linkedUrl);
}
