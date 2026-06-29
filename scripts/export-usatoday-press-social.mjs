/**
 * Export USA TODAY 10BEST press feature social graphic (dark theme).
 * Article: https://10best.usatoday.com/lifestyle/layflat-bag-deal-amazon-prime-day/
 * Run: node scripts/export-usatoday-press-social.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "social");
const PUBLIC = path.join(ROOT, "public");

const WIDTH = 1080;
const HEIGHT = 1350;
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
  return toDataUrl(path.join(PUBLIC, ...parts));
}

function postHtml({ logoUrl, heroUrl }) {
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

    .post {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      display: flex;
      flex-direction: column;
      padding: 52px 44px 56px;
      background: ${BG};
    }

    .top {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .top img {
      width: 240px;
      filter: brightness(0) invert(1);
      opacity: 0.92;
    }

    .eyebrow {
      text-align: center;
      color: #fff;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 22px;
      flex-shrink: 0;
    }

    .card {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      border: 2px solid rgba(255, 255, 255, 0.55);
      border-radius: 20px;
      overflow: hidden;
      background: ${BG};
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
    }

    .tenbest-bar {
      display: flex;
      align-items: center;
      min-height: 92px;
      padding: 18px 34px;
      background: ${TENBEST_BROWN};
    }

    .tenbest-bar__logo {
      color: #fff;
      line-height: 1;
    }

    .tenbest-bar__usa {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .tenbest-bar__best {
      margin-top: 2px;
      font-size: 54px;
      font-weight: 800;
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }

    .hero {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: ${BG};
    }

    .hero img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      display: block;
    }

    .copy {
      padding: 28px 36px 34px;
      display: flex;
      flex-direction: column;
      gap: 0;
      background: ${BG};
      flex-shrink: 0;
    }

    .headline {
      color: ${TEXT};
      font-size: 32px;
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      text-align: center;
    }

    .quote {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
      text-align: center;
    }

    .quote__lead {
      color: ${BRAND};
      font-size: 42px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 0.01em;
    }

    .quote__rest {
      margin-top: 10px;
      color: ${TEXT_MUTED};
      font-size: 23px;
      font-weight: 600;
      line-height: 1.42;
      letter-spacing: 0.01em;
    }
  </style>
</head>
<body>
  <div class="post" id="export">
    <header class="top">
      <img src="${logoUrl}" alt="" />
    </header>

    <p class="eyebrow">As Featured In</p>

    <article class="card">
      <div class="tenbest-bar">
        <div class="tenbest-bar__logo">
          <div class="tenbest-bar__usa">USA TODAY</div>
          <div class="tenbest-bar__best">10BEST</div>
        </div>
      </div>

      <div class="hero">
        <img src="${heroUrl}" alt="" />
      </div>

      <div class="copy">
        <h1 class="headline">This Clever Makeup Organizer Has Become My Ultimate Travel Companion</h1>
        <div class="quote">
          <p class="quote__lead">“A total game changer.”</p>
          <p class="quote__rest">It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.</p>
        </div>
      </div>
    </article>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const logoUrl = asset("layngo-logo-outlined.png");
  const heroUrl = asset("press", "usatoday-layflat-feature-hero.png");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(postHtml({ logoUrl, heroUrl }), { waitUntil: "load" });
  const outPath = path.join(OUT_DIR, `usatoday-10best-layflat-feature-dark-${WIDTH}x${HEIGHT}.png`);
  await page.locator("#export").screenshot({ path: outPath, type: "png" });
  await browser.close();

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
