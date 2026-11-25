# Project rules

- Gift messages are saved to the Shopify cart as both the cart note and cart attributes (`Gift order`, `Gift message`), and saved again right before checkout opens; Shopify hosts checkout, so the cart is the only place the storefront can attach order details.
- Per-page title/description/canonical/og tags are baked into dist/<route>/index.html at build time by plugins/vite-plugin-prerender-head.ts (products and collections from Shopify), because the SPA has no SSR and crawlers read the first HTML; keep its route list in step with the sitemap generator.
