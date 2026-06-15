Add Google Tag Manager (container `GTM-W9K4XNHR`) to `index.html`:

1. Insert the GTM `<script>` snippet high in `<head>`, right after the charset/viewport meta tags and before other scripts so it loads first.
2. Insert the GTM `<noscript><iframe>` snippet immediately after the opening `<body>` tag (per Lovable's rule, noscript pixels go in `<body>`, not `<head>`).

No other files change. Container ID will be exactly `GTM-W9K4XNHR` as provided. Tags/triggers/variables are managed inside the GTM dashboard, not in code.