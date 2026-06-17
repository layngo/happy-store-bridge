import { decorateCheckoutUrlWithGaLinker } from "@/lib/gaLinker";
import { toast } from "sonner";

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

  // Popup blocked — fall back to a user-initiated anchor click which keeps
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

/**
 * Send the buyer to Shopify hosted checkout in a new top-level tab.
 * Never navigates the current frame when embedded — Shopify blocks iframes
 * (browser shows "refused to connect" for layngo-new.myshopify.com).
 *
 * Appends GA4 cross-domain `_gl` linker params before opening the tab.
 */
export async function navigateToCheckout(checkoutUrl: string): Promise<void> {
  const linkedUrl = await decorateCheckoutUrlWithGaLinker(checkoutUrl);
  openCheckoutInNewTab(linkedUrl);
}
