#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from Shopify Storefront API + static routes.
 * Run before build: npm run generate:sitemap
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_URL = (process.env.VITE_SITE_URL || "https://www.layngo.com").replace(/\/$/, "");
const SHOPIFY_URL =
  "https://layngo-new.myshopify.com/api/2025-07/graphql.json";
const TOKEN = "2c8a6550838731f6030da2127100d9c9";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/collections", priority: "0.9", changefreq: "weekly" },
  { path: "/search", priority: "0.5", changefreq: "monthly" },
  { path: "/shop/cosmetic-bags-v2", priority: "0.85", changefreq: "weekly" },
  { path: "/pages/about-us", priority: "0.75", changefreq: "monthly" },
  { path: "/pages/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/pages/press", priority: "0.65", changefreq: "monthly" },
  { path: "/pages/return-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/policies/shipping-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/policies/terms-of-service", priority: "0.45", changefreq: "yearly" },
  { path: "/policies/sms-policy", priority: "0.4", changefreq: "yearly" },
  { path: "/pages/lay-n-go-patents", priority: "0.45", changefreq: "yearly" },
  { path: "/pages/business-license-certification", priority: "0.35", changefreq: "yearly" },
  { path: "/pages/small-businesses", priority: "0.4", changefreq: "yearly" },
  { path: "/pages/contact#wholesale", priority: "0.45", changefreq: "yearly" },
];

async function shopifyQuery(query, variables = {}) {
  const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  return json.data;
}

async function fetchAllProducts() {
  const products = [];
  let cursor = null;
  const query = `
    query SitemapProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;
  for (;;) {
    const data = await shopifyQuery(query, { first: 100, after: cursor });
    const conn = data.products;
    for (const { node } of conn.edges) products.push(node);
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return products;
}

async function fetchAllCollections() {
  const data = await shopifyQuery(`
    query { collections(first: 50) { edges { node { handle updatedAt } } } }
  `);
  return data.collections.edges.map((e) => e.node);
}

function urlEntry(path, { priority = "0.7", changefreq = "weekly", lastmod } = {}) {
  const loc = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `  <url><loc>${loc}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority></url>`;
}

async function main() {
  console.log(`Generating sitemap for ${SITE_URL}…`);
  const [products, collections] = await Promise.all([fetchAllProducts(), fetchAllCollections()]);
  console.log(`  ${products.length} products, ${collections.length} collections`);

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r.path, r)),
    ...collections
      .filter((c) => !["frontpage", "homepage"].includes(c.handle))
      .map((c) =>
        urlEntry(`/collections/${c.handle}`, {
          priority: "0.85",
          changefreq: "weekly",
          lastmod: c.updatedAt,
        }),
      ),
    ...products.map((p) =>
      urlEntry(`/product/${p.handle}`, {
        priority: "0.8",
        changefreq: "weekly",
        lastmod: p.updatedAt,
      }),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const out = join(ROOT, "public/sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`Wrote ${out} (${entries.length} URLs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
