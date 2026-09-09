# Why Meta isn't counting purchases, and how to fix it on Shopify

## The short answer

We do not own the checkout page. When someone presses Checkout, they leave our
site and land on Shopify's own checkout. Our site's tracking stops at that
moment, so our site can never report a purchase: only Shopify can.

I checked our code: there is no purchase tracking anywhere in it, which is
correct and expected. Everything up to checkout is already working. We verified
earlier that the ad click ID survives the handoff and arrives at Shopify's
checkout intact.

So the missing piece sits entirely on the Shopify side: Shopify has to be
sending the Purchase event to your Meta dataset, and today it either isn't, or
it's sending it somewhere else.

## What to fix, in your Shopify admin

You confirmed you have both Shopify and Meta admin access, so this is all
settings work: no code changes on our side.

1. **Confirm the sales channel exists.** In Shopify admin, look for the
   Facebook & Instagram channel under Sales channels. If it isn't there, install
   it from the Shopify App Store and connect it to your business account.
2. **Check which dataset it sends to.** Open that channel's settings and find
   the data-sharing / pixel section. The dataset must be `317484505801181`,
   the same one our site uses. A different or blank one explains zero purchases
   perfectly.
3. **Set data sharing to the maximum level.** The channel offers standard /
   enhanced / maximum. Maximum turns on the server-side purchase reporting that
   survives browser tracking blockers.
4. **Confirm customer privacy settings aren't blocking it.** In Shopify's
   customer privacy settings, check whether a consent banner or region rule is
   suppressing marketing tracking for the regions your buyers are in.
5. **Verify in Meta Events Manager.** Open dataset `317484505801181`, place one
   real test order, and watch for a Purchase event to appear within a few
   minutes. It should show a source of "server" or "browser" and carry a click
   ID.

## What I will do

Once you've walked through the above, tell me what you find at each step,
especially the dataset number in step 2 and what shows up in step 5. I'll read
that back against what our site sends and tell you exactly where the break is.

If Shopify's channel turns out to be unusable for your setup, the fallback is
building our own server-side reporting: our backend receives each completed
order from Shopify and reports it to Meta with the click ID we already store.
That is real build work and needs access tokens, so it's a separate plan I'd
write only if step 5 still shows nothing.

## Notes

This plan proposes no code changes. Approving it means I stand by and help you
interpret what you find in Shopify and Meta, then scope the server-side
fallback if it's needed.
