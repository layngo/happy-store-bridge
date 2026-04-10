Lay-n-Go live site snapshot (rebrand reference)
===============================================

Source: https://www.layngo.com (Shopify)
Captured from sitemap URLs plus /collections (not always in sitemap). See manifest.json and URLS.txt for the full list.

Folders:
  html/        Raw HTML as returned by the live store (35 files: home, all collections incl. listing at /collections, pages, blog index, products, 4 policies).
  sitemaps/    Shopify sitemap XML at time of capture (used to discover URLs).

Files:
  URLS.txt     Every live URL and the matching file path under html/ (easy to scan).
  manifest.json  Same list with byte size and fetch metadata.

Notes:
  - Opening these .html files locally will still request CSS/JS/images from Shopify/CDN URLs inside the markup.
  - This is a content/layout reference snapshot, not an offline-browsable mirror.
  - robots.txt disallows /policies/ for crawlers; privacy, terms, refund, and shipping policy HTML were still fetched and saved under html/policies/.
