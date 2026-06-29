/**
 * Export vertical social post graphic — new website launch.
 * Hero = homepage brand-film Vimeo frame; categories = matching product stills.
 * Run: node scripts/export-website-launch-social.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "social");
const CAPTURE_DIR = path.join(OUT_DIR, "_captures");
const PUBLIC = path.join(ROOT, "public");

const WIDTH = 1080;
const BRAND = "#3a9fb0";
const INK = "#171717";
const MUTED = "#5c6570";

const HOME_HERO_VIMEO_ID = "1185281289";

/** Homepage category Vimeo stills (same IDs as `homeCategoryCards.ts`). */
const CATEGORIES = [
  { label: "Cosmetics", videoId: "1188306142" },
  { label: "Nailspa", videoId: "1188306129" },
  { label: "Tech + Travel", videoId: "1198186125" },
  { label: "Play", videoId: "1198184216" },
  { label: "Outdoor / Tactical", videoId: "1188297111" },
  { label: "Pets", videoId: "1188297775" },
];

function toDataUrl(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function asset(...parts) {
  return toDataUrl(path.join(PUBLIC, ...parts));
}

async function downloadImage(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${url}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  return outPath;
}

async function fetchVimeoThumbnail(videoId) {
  const res = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
  if (!res.ok) throw new Error(`Vimeo ${videoId}: ${res.status}`);
  const [meta] = await res.json();
  const url = String(meta.thumbnail_large || meta.thumbnail_medium).replace(/-d_\d+/, "-d_1280");
  const out = path.join(CAPTURE_DIR, `vimeo-${videoId}.jpg`);
  return downloadImage(url, out);
}

async function loadAssets() {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });

  const heroPath = await fetchVimeoThumbnail(HOME_HERO_VIMEO_ID);

  const categoryPaths = [];
  for (const cat of CATEGORIES) {
    categoryPaths.push({ label: cat.label, path: await fetchVimeoThumbnail(cat.videoId) });
  }

  return { heroPath, categoryPaths };
}

function postHtml({ heroUrl, logoUrl, storyUrl, categories, pressLogos }) {
  const categoryTiles = categories
    .map(
      (cat) => `
      <figure class="cat">
        <div class="cat__frame">
          <img src="${cat.src}" alt="" />
        </div>
        <figcaption>${cat.label}</figcaption>
      </figure>`,
    )
    .join("");

  const pressRow = pressLogos.map((src) => `<img class="press-logo" src="${src}" alt="" />`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: ${WIDTH}px;
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      background: #fff;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .post {
      position: relative;
      width: ${WIDTH}px;
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      filter: blur(2.5px);
    }

    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 76px;
      padding: 0 40px;
      background: #fff;
    }

    .top img {
      width: 260px;
      mix-blend-mode: multiply;
    }

    .menubar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
      padding: 10px 40px 12px;
      border-top: 1px solid rgba(23, 23, 23, 0.1);
      background: #fff;
    }

    .menubar__item {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${MUTED};
      text-decoration: none;
      white-space: nowrap;
    }

    .menubar__item--active {
      color: ${INK};
    }

    .menubar__item--active::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: ${INK};
      border-radius: 1px;
    }

    .menubar__chevron {
      width: 10px;
      height: 10px;
      opacity: 0.7;
    }

    .hero {
      position: relative;
      height: 368px;
      overflow: hidden;
      background: #eef6f8;
      flex-shrink: 0;
    }

    .hero__media {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 42%;
      display: block;
    }

    .hero__shade {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.22) 0%,
        rgba(0, 0, 0, 0.04) 42%,
        rgba(255, 255, 255, 0) 100%
      );
      pointer-events: none;
    }

    .headline-front {
      position: absolute;
      left: 50%;
      top: 48%;
      transform: translate(-50%, -50%);
      z-index: 100;
      width: min(1040px, 98%);
      text-align: center;
      pointer-events: none;
    }

    .headline-front h1 {
      color: #fff;
      font-size: 108px;
      font-weight: 800;
      line-height: 0.94;
      letter-spacing: 0.035em;
      text-transform: uppercase;
      text-shadow:
        0 2px 0 rgba(0, 0, 0, 0.9),
        0 4px 10px rgba(0, 0, 0, 0.8),
        0 8px 24px rgba(0, 0, 0, 0.65),
        0 0 48px rgba(0, 0, 0, 0.4);
    }

    .body {
      display: flex;
      flex-direction: column;
      padding: 28px 40px 32px;
    }

    .cats {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
    }

    .cat {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .cat__frame {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 10px;
      background: #f4f7f8;
      border: 1px solid rgba(23, 23, 23, 0.06);
    }

    .cat__frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }

    .cat figcaption {
      color: ${MUTED};
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.2;
    }

    .press {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid rgba(23,23,23,0.08);
    }

    .press__label {
      text-align: center;
      color: ${MUTED};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .press__logos {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 22px;
      border-bottom: 1px solid rgba(23,23,23,0.08);
    }

    .press-logo {
      height: 22px;
      width: auto;
      max-width: 88px;
      object-fit: contain;
      opacity: 0.88;
    }

    .story {
      margin-top: 24px;
    }

    .story__label {
      text-align: center;
      color: ${MUTED};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .story__card {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      background: #111;
      box-shadow: 0 10px 28px rgba(23, 23, 23, 0.1);
    }

    .story__card img {
      display: block;
      width: 100%;
      height: 280px;
      object-fit: cover;
      object-position: center 36%;
    }

    .story__shade {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.08) 100%);
    }

    .story__copy {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 22px 24px 24px;
      color: #fff;
    }

    .story__copy h2 {
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .story__copy p {
      margin-top: 8px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.92);
    }
  </style>
</head>
<body>
  <div class="post" id="export">
    <div class="content">
      <header class="top">
        <img src="${logoUrl}" alt="" />
      </header>

      <nav class="menubar" aria-label="Main navigation">
        <span class="menubar__item menubar__item--active">Home</span>
        <span class="menubar__item">
          Shop
          <svg class="menubar__chevron" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="menubar__item">Press</span>
        <span class="menubar__item">About Us</span>
        <span class="menubar__item">Contact</span>
      </nav>

      <section class="hero">
        <img class="hero__media" src="${heroUrl}" alt="" />
        <div class="hero__shade" aria-hidden="true"></div>
      </section>

      <section class="body">
        <div class="cats">${categoryTiles}</div>

        <div class="press">
          <p class="press__label">Featured In</p>
          <div class="press__logos">${pressRow}</div>
        </div>

        <div class="story">
          <p class="story__label">About Us</p>
          <div class="story__card">
            <img src="${storyUrl}" alt="" />
            <div class="story__shade" aria-hidden="true"></div>
            <div class="story__copy">
              <h2>Our Story</h2>
              <p>16+ years in business</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="headline-front" aria-hidden="true">
      <h1>Our New Website<br />Is Live</h1>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("Loading hero + category assets…");
  const { heroPath, categoryPaths } = await loadAssets();

  const logoUrl = asset("layngo-logo-outlined.png");
  const heroUrl = toDataUrl(heroPath);
  const storyUrl = asset("our-story-slide-1.png");
  const categories = categoryPaths.map((cat) => ({
    label: cat.label,
    src: toDataUrl(cat.path),
  }));
  const pressLogos = [
    asset("press", "logos", "buzzfeed.png"),
    asset("press", "logos", "parents.png"),
    asset("press", "logos", "people.png"),
    asset("press", "logos", "today.png"),
    asset("press", "logos", "cntraveler.png"),
    asset("press", "logos", "oprah-daily.png"),
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: 1600 },
    deviceScaleFactor: 1,
  });

  await page.setContent(postHtml({ heroUrl, logoUrl, storyUrl, categories, pressLogos }), { waitUntil: "load" });
  const exportHeight = await page.locator("#export").evaluate((el) => Math.ceil(el.getBoundingClientRect().height));
  const outPath = path.join(OUT_DIR, `website-launch-post-${WIDTH}x${exportHeight}.png`);
  await page.locator("#export").screenshot({ path: outPath, type: "png" });
  await browser.close();

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
