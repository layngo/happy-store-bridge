# Checkout attribution: what I found, and what to do next

## 1. Where the redirect is built

Two files, one shared path:

- `src/lib/checkoutUrl.ts` → `formatCheckoutUrl()` rewrites the Shopify cart URL onto `layngo-new.myshopify.com` and adds `channel=online_store` + `skip_shop_pay=true`.
- `src/lib/navigateToCheckout.ts` → `navigateToCheckout()` adds the GA `_gl` linker, then `withAttributionParams()` appends `fbclid`, `gclid`, `ttclid` and `utm_source/medium/campaign/content/id/term`, and opens the new tab.

The forwarding code is present right now. Params are also captured on landing (`captureAttributionParams()` in `src/App.tsx`) and kept in session storage, so they survive browsing before checkout.

## 2. Checkout entry points

There are exactly two, and both call the same `navigateToCheckout()`:

- `src/components/CartDrawer.tsx` (slide-out cart)
- `src/pages/Cart.tsx` (`/cart` page)

There is no separate "Buy Now" button and no other link to a myshopify checkout anywhere in the app. So there is no second, unpatched path.

## 3. Is it live on layngo.com?

Yes. I downloaded the JavaScript file that layngo.com is currently serving and searched inside it: it contains the attribution storage key, `fbclid`, `ttclid`, `utm_campaign` and `skip_shop_pay`. The fix is on production, not just preview. Nothing needs deploying, and this is not a CDN cache issue.

## 4. So why is Meta not attributing?

Since the code is live on all paths, the cause is very likely downstream of our site, and I have not yet confirmed which. The most probable one: Meta attributes checkout/purchase events using the `_fbc` and `_fbp` browser cookies read **on the domain where the purchase happens**. Those cookies are set by our pixel on `layngo.com` and cannot be read on `layngo-new.myshopify.com`. Passing `fbclid` in the URL only helps if something on the Shopify side reads it and rebuilds `_fbc` — Shopify's Facebook channel normally does this only when the click lands directly on the Shopify domain.

Proposed next steps, in order:

1. Do the live test below and confirm `fbclid` really arrives at the checkout URL for a real customer (rules out our side completely).
2. Check the Shopify side: is the Facebook & Instagram channel connected, and is the pixel/dataset ID there the same `317484505801181` we use on layngo.com? A different or missing dataset would explain zero attribution regardless of parameters.
3. If the dataset matches and clicks still don't attribute, the fix is to send a server-side Purchase event with the click ID we already carry, rather than relying on cookies crossing domains. That is a separate build; I'd scope it after steps 1-2.

## 5. Live re-verification URL

Open this in a fresh browser profile (no preview, no `preview_theme_id`):

```text
https://layngo.com/product/lay-n-go-cosmo-20?fbclid=TEST_LIVE_0909&utm_source=meta&utm_medium=paid&utm_campaign=attrib_check
```

Add to cart, open the cart, press Checkout, then look at the address bar of the new tab. It should be on `layngo-new.myshopify.com` and contain `fbclid=TEST_LIVE_0909`, the three `utm_` values, and a `_gl` value.

## Notes

No code changes are proposed in this plan. The requested fix is already implemented, live, and applied to every checkout button. Approving this plan means I proceed to steps 1-2 above (verifying the live checkout URL in a real browser and reporting exactly what I see).
