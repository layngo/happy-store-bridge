/**
 * Export PEOPLE travel toiletry bag roundup Instagram post (1080×1350).
 * Article: https://people.com/travel-toiletry-bag-deals-amazon-july-2026-11990655
 * Published July 5, 2026
 * Run: node scripts/export-people-travel-toiletry-insta-post.mjs
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
const PEOPLE_RED = "#e4002b";
const BG = "#0a0a0a";
const TEXT = "#f5f5f2";
const TEXT_MUTED = "rgba(245, 245, 242, 0.78)";

/** Open lay-flat cosmo — matches article “spreads into a 20-inch circle”. */
const HERO = path.join(PUBLIC, "cosmo-pdp", "gallery", "01.png");

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

function postHtml({ logoUrl, peopleLogoUrl, heroUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
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
      padding: 48px 44px 52px;
      background: ${BG};
    }

    .top {
      display: flex;
      justify-content: center;
      margin-bottom: 18px;
      flex-shrink: 0;
    }

    .top img {
      width: 168px;
      filter: brightness(0) invert(1);
      opacity: 0.94;
    }

    .eyebrow {
      text-align: center;
      color: ${BRAND};
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .card {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      overflow: hidden;
      background: ${BG};
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
    }

    .people-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 88px;
      padding: 16px 32px;
      background: #fff;
      border-bottom: 4px solid ${PEOPLE_RED};
    }

    .people-bar__logo {
      height: 38px;
      width: auto;
      display: block;
    }

    .people-bar__date {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #555;
      text-align: right;
      line-height: 1.35;
    }

    .hero {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
    }

    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 58%;
      display: block;
    }

    .hero__badge {
      position: absolute;
      top: 22px;
      right: 22px;
      padding: 10px 18px;
      border-radius: 999px;
      background: ${PEOPLE_RED};
      color: #fff;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .copy {
      padding: 26px 34px 32px;
      display: flex;
      flex-direction: column;
      background: ${BG};
      flex-shrink: 0;
    }

    .kicker {
      color: ${BRAND};
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 10px;
    }

    .headline {
      color: ${TEXT};
      font-size: 34px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      text-align: center;
    }

    .product {
      margin-top: 14px;
      color: ${TEXT_MUTED};
      font-size: 21px;
      font-weight: 600;
      line-height: 1.35;
      text-align: center;
      letter-spacing: 0.01em;
    }

    .quote {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.14);
      text-align: center;
    }

    .quote__lead {
      color: #fff;
      font-size: 28px;
      font-weight: 800;
      line-height: 1.2;
      font-style: italic;
    }

    .quote__rest {
      margin-top: 10px;
      color: ${TEXT_MUTED};
      font-size: 20px;
      font-weight: 600;
      line-height: 1.42;
    }

    .deal {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 10px;
    }

    .deal__now {
      color: #fff;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }

    .deal__was {
      color: rgba(245, 245, 242, 0.45);
      font-size: 22px;
      font-weight: 700;
      text-decoration: line-through;
    }

    .deal__label {
      margin-top: 6px;
      color: ${BRAND};
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-align: center;
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
      <div class="people-bar">
        <img class="people-bar__logo" src="${peopleLogoUrl}" alt="" />
        <p class="people-bar__date">Travel Deals<br />July 5, 2026</p>
      </div>

      <div class="hero">
        <img src="${heroUrl}" alt="" />
        <span class="hero__badge">On Sale</span>
      </div>

      <div class="copy">
        <p class="kicker">Surprisingly Spacious</p>
        <h1 class="headline">The Layflat Bag PEOPLE Is Eyeing for Summer Getaways</h1>
        <p class="product">Lay-n-Go Cosmo Layflat Drawstring Cosmetic Organizer</p>

        <div class="quote">
          <p class="quote__lead">“Spread out your whole routine — then cinch it closed.”</p>
          <p class="quote__rest">PEOPLE calls out our 20-inch lay-flat circle, raised edges that keep lipsticks from rolling, and a hidden pocket for valuables — plus more travel bags from $13.</p>
        </div>

        <div class="deal">
          <span class="deal__now">$25</span>
          <span class="deal__was">$30</span>
        </div>
        <p class="deal__label">On Amazon now</p>
      </div>
    </article>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const logoUrl = asset("layngo-logo-outlined.png");
  const peopleLogoUrl = asset("press", "logos", "people.png");
  const heroUrl = toDataUrl(HERO);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(postHtml({ logoUrl, peopleLogoUrl, heroUrl }), { waitUntil: "load" });
  await page.waitForTimeout(400);

  const outPath = path.join(OUT_DIR, `people-travel-toiletry-insta-post-${WIDTH}x${HEIGHT}.png`);
  await page.locator("#export").screenshot({ path: outPath, type: "png" });
  await browser.close();

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
