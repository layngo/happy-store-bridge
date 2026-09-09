# Why Meta isn't counting purchases: investigation plan

Confirmed from the code this turn:
- Two checkout entry points (cart page, cart drawer) both go through one shared function that attaches `fbclid`, `gclid`, `ttclid` and all `utm_*` values, plus Google's `_gl`, onto the Shopify checkout link.
- The click ID is captured on first page load and kept in the browser tab's session storage, so it survives home page to product to cart to checkout in the same tab.
- Our storefront loads the Meta Pixel (dataset 317484505801181) on every page. It does not and cannot run on Shopify's checkout pages.

So the storefront hands off correctly. The purchase itself is recorded on Shopify's side, and that is where the reporting has to come from.

## What to check, in order

1. **Which dataset Shopify sends to.** Read the Meta sales channel setup on the store and note the dataset/pixel ID it is configured with. If it is not 317484505801181, purchases are landing in a different dataset and Ads Manager will show none.
2. **Whether Purchase events arrive at all.** In Meta Events Manager for that dataset, look at recent Purchase activity: none at all, versus arriving but unmatched, are two very different problems and point at different fixes.
3. **Whether arriving purchases carry a click ID.** Shopify's checkout rebuilds the `_fbc` click cookie on its own domain from the `fbclid` we forward. If Purchases arrive without it, the handoff is being dropped at Shopify's end rather than ours.
4. **Customer privacy / consent settings on the store.** If marketing tracking is restricted for the buyer's region, Shopify withholds the event even when everything else is wired.
5. **Live end-to-end test.** One real order placed through a link carrying a test click ID, then watch the dataset for the Purchase within a few minutes.

## If Shopify's channel still sends nothing

Fallback, scoped separately if we get there: report purchases ourselves server-side, from a Shopify order webhook into Meta's Conversions API, sending the stored click ID with each order. That removes the dependency on Shopify's own Meta channel entirely.

## What I need from you

Steps 1, 2 and 4 live inside the Shopify and Meta admin screens, which I can't open. Tell me what you see there (the dataset number, and whether any Purchase events show up), and I'll pinpoint the break and write the fix plan.

## Notes

No code changes are proposed in this plan. One real gap worth fixing later regardless: the click ID lives only in the current browser tab, so it's lost if a shopper opens a product in a new tab or returns the next day.
