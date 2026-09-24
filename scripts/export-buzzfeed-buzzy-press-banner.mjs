/**
 * BuzzFeed 2026 Buzzy Awards — Cosmo press banner.
 * Orange frame left, League Spartan title right, white background.
 * Article: https://www.buzzfeed.com/buzzfeedshopping/2026-buzzy-awards#141167987
 * Run: node scripts/export-buzzfeed-buzzy-press-banner.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "press");
const PUBLIC = path.join(ROOT, "public");
const ASSETS =
  "/Users/tombro/.cursor/projects/Users-tombro-happy-store-bridge-1/assets";

const WIDTH = 2048;
const HEIGHT = 768;
const SOURCE = path.join(ASSETS, "image-dde8a5b6-3551-4571-b16a-8fdac69d0f80.png");
const LOGO = path.join(PUBLIC, "press", "logos", "buzzfeed.png");

async function prepHero() {
  const left = 70;
  const top = 124;
  const width = 580;
  const height = 598;

  return sharp(SOURCE)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
}

function toDataUrl(buf, mime = "image/png") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function bannerHtml({ heroUrl, logoUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      overflow: hidden;
      background: #fff;
      -webkit-font-smoothing: antialiased;
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
    }
    #export {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background: #fff;
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      align-items: center;
      gap: 36px;
      padding: 40px 56px 40px 48px;
    }
    .visual {
      height: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .visual img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      background: #fff;
    }
    .copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 22px;
    }
    .masthead {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .masthead__logo {
      height: 48px;
      width: auto;
      display: block;
    }
    .masthead__meta {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(17, 17, 17, 0.45);
      line-height: 1.3;
    }
    .kicker {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #111;
    }
    .headline {
      font-size: 68px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      color: #111;
    }
  </style>
</head>
<body>
  <div id="export">
    <div class="visual"><img src="${heroUrl}" alt="" /></div>
    <div class="copy">
      <div class="masthead">
        <img class="masthead__logo" src="${logoUrl}" alt="" />
        <p class="masthead__meta">2026 Buzzy Awards<br />Shopping</p>
      </div>
      <p class="kicker">Featured pick</p>
      <h1 class="headline">Lay-n-Go Cosmo<br/>Layflat Drawstring<br/>Cosmetic Organizer</h1>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const [heroBuf, logoBuf] = await Promise.all([
    prepHero(),
    fs.promises.readFile(LOGO),
  ]);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    bannerHtml({
      heroUrl: toDataUrl(heroBuf),
      logoUrl: toDataUrl(logoBuf),
    }),
    { waitUntil: "networkidle" },
  );
  await page.waitForTimeout(450);

  const exportPath = path.join(
    OUT_DIR,
    "buzzfeed-buzzy-awards-2026-banner-2048x768.png",
  );
  const publicPath = path.join(
    PUBLIC,
    "press",
    "featured-buzzfeed-buzzy-awards-2026-banner.png",
  );
  await page.locator("#export").screenshot({ path: exportPath, type: "png" });
  await browser.close();
  await fs.promises.copyFile(exportPath, publicPath);

  console.log(`Wrote ${exportPath}`);
  console.log(`Wrote ${publicPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
