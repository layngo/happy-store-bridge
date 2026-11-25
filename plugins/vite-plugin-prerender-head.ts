/**
 * After build, writes dist/<route>/index.html copies of the app shell whose
 * <head> already carries that page's own title, description, canonical and
 * og/twitter tags, so crawlers see correct metadata before JavaScript runs.
 */
import type { Plugin } from "vite";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";

const SITE_URL = "https://layngo.com";
const SITE_NAME = "Lay-n-Go";
const SHOPIFY_URL = "https://layngo-new.myshopify.com/api/2025-07/graphql.json";
const TOKEN = "2c8a6550838731f6030da2127100d9c9";

type Meta = { title: string; description: string };

const STATIC_TITLES: Record<string, string> = {
  "/collections": "Shop Collections",
  "/search": "Search Products",
  "/shop/cosmetic-bags": "Cosmetic Bags",
  "/pages/about-us": "About Us",
  "/pages/contact": "Contact Us",
  "/pages/press": "Press",
  "/pages/return-policy": "Return Policy",
  "/policies/shipping-policy": "Shipping Policy",
  "/policies/terms-of-service": "Terms of Service",
  "/policies/privacy-policy": "Privacy Policy",
  "/policies/sms-policy": "SMS Policy",
  "/pages/lay-n-go-patents": "Lay-n-Go Patents",
  "/pages/business-license-certification": "Business License Certification",
  "/pages/small-businesses": "Small Businesses",
};

const COLLECTIONS_DESCRIPTION =
  "Browse all Lay-n-Go collections: Cosmo cosmetic bags, Play toy mats, Tech & Travel, Nail Solutions, Pet gear, and Outdoor / Tactical organizers.";

const pageTitle = (t: string) => (/lay-n-go/i.test(t) ? t : `${t}: ${SITE_NAME}`);
const strip = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
function truncate(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  const s = t.slice(0, max - 1);
  const sp = s.lastIndexOf(" ");
  return `${(sp > 40 ? s.slice(0, sp) : s).trim()}…`;
}
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function shopify(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchProducts() {
  const out: { handle: string; title: string; description: string }[] = [];
  let after: string | null = null;
  for (;;) {
    const d = await shopify(
      `query($after:String){products(first:100,after:$after){pageInfo{hasNextPage endCursor} edges{node{handle title description}}}}`,
      { after },
    );
    out.push(...d.products.edges.map((e: { node: (typeof out)[number] }) => e.node));
    if (!d.products.pageInfo.hasNextPage) break;
    after = d.products.pageInfo.endCursor;
  }
  return out;
}

async function fetchCollections() {
  const d = await shopify(`{collections(first:100){edges{node{handle title description}}}}`);
  return d.collections.edges.map((e: { node: { handle: string; title: string; description: string } }) => e.node);
}

function applyMeta(template: string, path: string, meta: Meta) {
  const url = `${SITE_URL}${path}`;
  const title = esc(pageTitle(meta.title));
  const desc = esc(truncate(meta.description, 160));
  const ogDesc = esc(truncate(meta.description, 200));
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${desc}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${ogDesc}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${ogDesc}" />`);
}

export function prerenderHeadPlugin(): Plugin {
  let outDir = "dist";
  let root = process.cwd();
  return {
    name: "prerender-head",
    apply: "build",
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
      root = c.root;
    },
    async closeBundle() {
      const { createServer } = await import("vite");
      const server = await createServer({
        root,
        configFile: false,
        logLevel: "silent",
        appType: "custom",
        server: { middlewareMode: true, hmr: false },
        resolve: { alias: { "@": join(root, "src") } },
      });
      let getStaticPageSeo: (p: string) => { description: string };
      try {
        ({ getStaticPageSeo } = await server.ssrLoadModule("/src/lib/staticPageSeo.ts"));
      } finally {
        await server.close();
      }

      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const pages = new Map<string, Meta>();
      for (const [path, title] of Object.entries(STATIC_TITLES)) {
        const description = path === "/collections" ? COLLECTIONS_DESCRIPTION : getStaticPageSeo(path).description;
        pages.set(path, { title, description });
      }
      try {
        const [products, collections] = await Promise.all([fetchProducts(), fetchCollections()]);
        for (const c of collections) {
          if (["frontpage", "homepage"].includes(c.handle)) continue;
          const path = `/collections/${c.handle}`;
          const custom = path === "/collections/military-first-responder" ? getStaticPageSeo(path).description : "";
          pages.set(path, {
            title: c.title,
            description:
              custom ||
              strip(c.description || "") ||
              `Shop the ${c.title} collection from Lay-n-Go: patented drawstring mats and organizers that open flat and cinch closed.`,
          });
        }
        for (const p of products) {
          pages.set(`/product/${p.handle}`, {
            title: p.title,
            description:
              strip(p.description || "") ||
              `Shop the ${p.title}: patented Lay-n-Go drawstring organizer that opens flat and cinches closed for travel and storage.`,
          });
        }
      } catch (err) {
        console.warn("[prerender-head] Shopify fetch failed; only static pages prerendered:", err);
      }

      for (const [path, meta] of pages) {
        const dir = join(outDir, path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), applyMeta(template, path, meta), "utf8");
      }
      console.log(`[prerender-head] wrote ${pages.size} page heads`);
    },
  };
}
