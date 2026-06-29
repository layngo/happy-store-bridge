/**
 * Export USA TODAY 10BEST press page banner (horizontal).
 * Run: node scripts/export-usatoday-press-banner.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "press");

const WIDTH = 2048;
const HEIGHT = 768;
const BRAND = "#3a9fb0";
const TENBEST_BROWN = "#322e08";
const BG = "#0a0a0a";
const TEXT = "#f5f5f2";
const TEXT_MUTED = "rgba(245, 245, 242, 0.78)";

function toDataUrl(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime =
    ext === "svg"
      ? "image/svg+xml"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function asset(...parts) {
  return toDataUrl(path.join(ROOT, "public", ...parts));
}

function bannerHtml({ heroUrl }) {
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
      height: ${HEIGHT}px;
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      background: ${BG};
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .banner {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      display: flex;
      flex-direction: column;
      background: ${BG};
    }

    .tenbest-bar {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 88px;
      padding: 16px 42px;
      background: ${TENBEST_BROWN};
      flex-shrink: 0;
    }

    .tenbest-bar__usa {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1;
    }

    .tenbest-bar__best {
      margin-top: 2px;
      color: #fff;
      font-size: 50px;
      font-weight: 800;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      line-height: 1;
    }

    .main {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 1.02fr 0.98fr;
      gap: 34px;
      align-items: stretch;
      padding: 28px 42px 34px;
    }

    .hero-card {
      display: flex;
      flex-direction: column;
      min-height: 0;
      border: 2px solid rgba(255, 255, 255, 0.55);
      border-radius: 18px;
      overflow: hidden;
      background: ${BG};
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.42);
    }

    .hero {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: ${BG};
    }

    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 22%;
      display: block;
    }

    .copy {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0;
      padding: 4px 6px 4px 0;
      min-height: 0;
    }

    .headline {
      color: ${TEXT};
      font-size: 42px;
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: 0.025em;
      text-transform: uppercase;
    }

    .quote {
      margin-top: 22px;
      padding-top: 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
    }

    .quote__lead {
      color: ${BRAND};
      font-size: 46px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: 0.01em;
    }

    .quote__rest {
      margin-top: 14px;
      color: ${TEXT};
      font-size: 24px;
      font-weight: 600;
      line-height: 1.38;
      letter-spacing: 0.01em;
      max-width: 34rem;
    }

    .date {
      margin-top: 22px;
      color: rgba(245, 245, 242, 0.62);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="banner" id="export">
    <header class="tenbest-bar">
      <div>
        <div class="tenbest-bar__usa">USA TODAY</div>
        <div class="tenbest-bar__best">10BEST</div>
      </div>
    </header>

    <div class="main">
      <article class="hero-card">
        <div class="hero">
          <img src="${heroUrl}" alt="" />
        </div>
      </article>

      <div class="copy">
        <h1 class="headline">This Clever Makeup Organizer Has Become My Ultimate Travel Companion</h1>
        <div class="quote">
          <p class="quote__lead">“A total game changer.”</p>
          <p class="quote__rest">It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.</p>
        </div>
        <p class="date">Published on Jun. 26, 2026</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const heroUrl = asset("press", "usatoday-layflat-feature-hero-trimmed.png");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(bannerHtml({ heroUrl }), { waitUntil: "load" });

  const outPath = path.join(OUT_DIR, `usatoday-10best-press-banner-${WIDTH}x${HEIGHT}.png`);
  const publicPath = path.join(ROOT, "public", "press", "featured-usatoday-10best-banner.png");
  await page.locator("#export").screenshot({ path: outPath, type: "png" });
  fs.copyFileSync(outPath, publicPath);
  await browser.close();

  console.log(`Wrote ${outPath}`);
  console.log(`Wrote ${publicPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
