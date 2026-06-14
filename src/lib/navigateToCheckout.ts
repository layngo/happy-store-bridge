/**
 * Send the buyer to Shopify hosted checkout.
 * Must open in a new top-level tab — Shopify blocks checkout in iframes (preview embeds show "refused to connect").
 */
export function navigateToCheckout(checkoutUrl: string): void {
  const opened = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  if (opened) {
    opened.opener = null;
    return;
  }

  // Popup blocked — try breaking out of an embed, then same-tab fallback.
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = checkoutUrl;
      return;
    }
  } catch {
    /* cross-origin parent */
  }

  window.location.href = checkoutUrl;
}
