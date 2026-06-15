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
  const link = document.createElement("a");
  link.href = checkoutUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();

  const popup = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  if (popup) {
    popup.opener = null;
    return true;
  }

  return false;
}

/**
 * Send the buyer to Shopify hosted checkout in a new top-level tab.
 * Never navigates the current frame when embedded — Shopify blocks iframes
 * (browser shows "refused to connect" for layngo-new.myshopify.com).
 */
export function navigateToCheckout(checkoutUrl: string): void {
  if (openCheckoutInNewTab(checkoutUrl)) return;

  if (isEmbeddedInFrame()) {
    toast.info("Open checkout in a new tab", {
      description:
        "Checkout cannot load inside the site preview. Use the button below or open www.layngo.com in your browser.",
      action: {
        label: "Open checkout",
        onClick: () => openCheckoutInNewTab(checkoutUrl),
      },
      duration: 15000,
    });
    return;
  }

  // Top-level window with popups blocked — same-tab navigation is allowed.
  window.location.assign(checkoutUrl);
}
