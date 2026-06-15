## Plan: Add Google Analytics (gtag.js) sitewide

Add the GA4 tag for `G-5157VW2ENR` to `index.html` immediately after the opening `<head>` tag. Because it's a single-page React app, one snippet in `index.html` loads on every route — no per-page work needed, and it will automatically track pageviews/customers across the site.

### Change
- **`index.html`** — insert immediately after `<head>`:
  ```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5157VW2ENR"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5157VW2ENR');
  </script>
  ```

### Notes
- SPA route changes: GA4's enhanced measurement auto-tracks history changes, so virtual pageviews on React Router navigation will be captured without extra code. If you'd like explicit `page_view` events fired on every in-app route change instead, I can add a small router listener — let me know.
- Data shows up in GA4 within a few minutes after publishing.
