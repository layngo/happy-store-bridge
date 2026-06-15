## Goal

Move the checkout URL from `layngo-new.myshopify.com/checkouts/...` to `checkout.layngo.com/checkouts/...` so buyers stay on the layngo.com brand end-to-end. Shopify still hosts and processes checkout (PCI, Shop Pay, Apple/Google Pay, taxes, shipping, discounts all keep working).

## Step 1 — Configure the custom checkout domain in Shopify (you do this)

In Shopify Admin:

1. Settings → Domains → click **Connect existing domain**, enter `checkout.layngo.com`.
2. Shopify will show DNS records to add. They'll be a **CNAME** for `checkout` pointing to `shops.myshopify.com` (Shopify provides the exact target — use whatever they show).
3. Add that CNAME at the DNS provider where `layngo.com` is managed (Lovable's DNS manager if the domain was bought through Lovable: Project Settings → Domains → ⋯ → Configure → Manage DNS records; otherwise your registrar).
4. Wait for verification + SSL provisioning (usually 15 min – a few hours).
5. Once verified, in Shopify: Settings → Checkout → **Checkout domain** → select `checkout.layngo.com`.

After this, `cartCreate` from the Storefront API will return checkout URLs on `checkout.layngo.com` automatically. No app code change is required for new carts.

## Step 2 — Code changes in this repo

Small, defensive updates so old persisted carts and any hard-coded references migrate cleanly:

1. **`src/lib/checkoutUrl.ts`**
   - Add a constant `SHOPIFY_CHECKOUT_DOMAIN = 'checkout.layngo.com'`.
   - Change `formatCheckoutUrl` so it rewrites `url.hostname` to `SHOPIFY_CHECKOUT_DOMAIN` instead of `SHOPIFY_STORE_PERMANENT_DOMAIN`. Keep `channel=online_store` and `skip_shop_pay=true` query params.
   - Update `redirectHeadlessCheckoutEntry` so any visitor who lands on `layngo.com/cart/c/...` or `/checkouts/...` (e.g. from an old email link) is bounced to `checkout.layngo.com` with the same path + params, instead of to `layngo-new.myshopify.com`.

2. **`src/stores/cartStore.ts`** — no change needed; the existing `onRehydrateStorage` already runs persisted URLs through `formatCheckoutUrl`, so old `layngo-new.myshopify.com` URLs in buyers' localStorage will be auto-corrected to `checkout.layngo.com` on next page load.

3. **`src/lib/shopify.ts`** — sanity scan for any other hard-coded `myshopify.com` checkout references; rewrite to the new domain if found.

## Step 3 — Verify

After DNS + Shopify config is live and code is deployed:

1. Add an item to cart on layngo.com → click Checkout → confirm new tab opens at `https://checkout.layngo.com/checkouts/...?channel=online_store&skip_shop_pay=true`.
2. Confirm Shop Pay, Apple Pay, Google Pay buttons still appear.
3. Place a test order to confirm payment + order confirmation email work.
4. Customize logo/colors/favicon in Shopify Admin → Settings → Checkout → Branding so the checkout matches layngo.com.

## Notes

- The custom checkout domain only affects the checkout flow. Order status pages and customer account pages will also serve from `checkout.layngo.com` automatically.
- DNS for `checkout.layngo.com` must be a **CNAME**, not an A record. If `layngo.com` is proxied through Cloudflare, set the CNAME to **DNS-only** (gray cloud) — Shopify manages SSL on its end.
- This change does not affect the rest of `layngo.com` (Lovable hosting) — only the `checkout` subdomain is delegated to Shopify.
