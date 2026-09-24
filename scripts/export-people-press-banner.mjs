/**
 * Export PEOPLE travel toiletry press page banner (horizontal).
 * Companion to the Instagram post (exports/social/people-travel-toiletry-insta-post-*).
 * Article: https://people.com/travel-toiletry-bag-deals-amazon-july-2026-11990655
 * Run: node scripts/export-people-press-banner.mjs
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

const WIDTH = 2048;
const HEIGHT = 768;
/** Matches public/press/logos/people.png wordmark */
const PEOPLE = "#28a8e0";
const BG = "#ffffff";
const TEXT = "#111111";
const TEXT_MUTED = "rgba(17, 17, 17, 0.48)";

/** Cleaned open Cosmo flat lay — speckles reduced for press export. */
const HERO = path.join(PUBLIC, "press", "cosmo-20-flatlay-clean.png");

function toDataUrl(bufOrPath, mime = "image/png") {
  const buf = Buffer.isBuffer(bufOrPath) ? bufOrPath : fs.readFileSync(bufOrPath);
  if (!Buffer.isBuffer(bufOrPath)) {
    const ext = path.extname(bufOrPath).slice(1).toLowerCase();
    mime =
      ext === "svg"
        ? "image/svg+xml"
        : ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : "image/png";
  }
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function asset(...parts) {
  return toDataUrl(path.join(PUBLIC, ...parts));
}

/** Punch near-white pixels to transparent — no crop. */
async function prepHeroTransparent() {
  const { data, info } = await sharp(HERO)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // Near-white / light gray backdrop (low chroma)
    if (min > 236 && max - min < 18) {
      data[i + 3] = 0;
    } else if (min > 220 && max - min < 22) {
      const t = (min - 220) / 16;
      data[i + 3] = Math.round(data[i + 3] * (1 - t));
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

function bannerHtml({ peopleLogoUrl, heroUrl }) {
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

    .banner {
      position: relative;
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background:
        radial-gradient(ellipse 70% 90% at 18% 50%, #f7f7f8 0%, transparent 68%),
        linear-gradient(115deg, #ffffff 0%, #fafafa 52%, #ffffff 100%);
      overflow: hidden;
    }

    .accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      background: ${PEOPLE};
    }

    .stage {
      position: relative;
      z-index: 1;
      height: 100%;
      display: grid;
      grid-template-columns: 0.78fr 1.22fr;
      align-items: center;
      padding: 32px 48px 32px 44px;
      gap: 20px;
    }

    .visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-width: 0;
    }

    .orb {
      position: relative;
      width: min(768px, 100%);
      max-height: 100%;
      overflow: visible;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .orb img {
      width: 100%;
      height: auto;
      max-height: 840px;
      object-fit: contain;
      object-position: center center;
      display: block;
      transform: none;
      image-rendering: auto;
    }

    .mark {
      position: absolute;
      right: 0;
      bottom: 42px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: ${TEXT_MUTED};
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
    }

    .copy {
      position: relative;
      padding: 4px 8px 4px 40px;
      max-width: 48rem;
      min-width: 0;
    }

    .copy::before {
      content: "";
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 3px;
      background: linear-gradient(
        180deg,
        transparent 0%,
        ${PEOPLE} 14%,
        ${PEOPLE} 86%,
        transparent 100%
      );
      opacity: 0.9;
    }

    .masthead {
      display: flex;
      align-items: center;
      gap: 22px;
      margin-bottom: 20px;
    }

    .masthead__logo {
      height: 92px;
      width: auto;
      display: block;
    }

    .masthead__meta {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${TEXT_MUTED};
      line-height: 1.3;
    }

    .kicker {
      display: inline-block;
      margin-bottom: 14px;
      padding-bottom: 8px;
      color: ${PEOPLE};
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      border-bottom: 3px solid ${PEOPLE};
    }

    .headline {
      color: ${TEXT};
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      font-size: 68px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      max-width: 16ch;
    }

    .quote {
      margin-top: 28px;
    }

    .quote__lead {
      display: inline;
      color: ${TEXT};
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      font-size: 34px;
      font-weight: 600;
      font-style: normal;
      line-height: 1.3;
      letter-spacing: -0.015em;
    }

    .quote__mark {
      color: ${PEOPLE};
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      font-size: 1.35em;
      font-style: normal;
      font-weight: 800;
      line-height: 0;
      vertical-align: -0.08em;
    }

    .quote__mark--open {
      margin-right: 0.08em;
    }

    .quote__mark--close {
      margin-left: 0.08em;
    }

  </style>
</head>
<body>
  <div class="banner" id="export">
    <div class="accent" aria-hidden="true"></div>
    <div class="stage">
      <div class="visual">
        <div class="orb">
          <img src="${heroUrl}" alt="" />
        </div>
        <span class="mark">20" lay-flat</span>
      </div>

      <div class="copy">
        <div class="masthead">
          <img class="masthead__logo" src="${peopleLogoUrl}" alt="" />
          <p class="masthead__meta">Travel Deals<br />July 5, 2026</p>
        </div>

        <p class="kicker">Surprisingly Spacious</p>
        <h1 class="headline">The layflat bag PEOPLE is eyeing for summer getaways</h1>

        <div class="quote">
          <p class="quote__lead"><span class="quote__mark quote__mark--open">“</span>Spread out your whole routine, then cinch it closed.<span class="quote__mark quote__mark--close">”</span></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const peopleLogoUrl = asset("press", "logos", "people.png");
  const heroBuf = await prepHeroTransparent();
  const heroUrl = toDataUrl(heroBuf);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(bannerHtml({ peopleLogoUrl, heroUrl }), {
    waitUntil: "networkidle",
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(800);

  const outPath = path.join(OUT_DIR, `people-travel-toiletry-press-banner-${WIDTH}x${HEIGHT}.png`);
  const publicPath = path.join(PUBLIC, "press", "featured-people-travel-toiletry-banner.png");
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
