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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "press");
const PUBLIC = path.join(ROOT, "public");

const WIDTH = 2048;
const HEIGHT = 768;
/** Matches public/press/logos/people.png wordmark */
const PEOPLE = "#28a8e0";
const BG = "#111111";
const TEXT = "#f3f0ea";

/** Cleaned open Cosmo flat lay — speckles reduced for press export. */
const HERO = path.join(PUBLIC, "press", "cosmo-20-flatlay-clean.png");

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

function bannerHtml({ peopleLogoUrl, heroUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,500&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500;1,9..144,650&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif;
      background: ${BG};
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .banner {
      position: relative;
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background:
        radial-gradient(ellipse 62% 88% at 22% 50%, #1c1c1c 0%, transparent 70%),
        linear-gradient(115deg, #0e0e0e 0%, #161616 48%, #101010 100%);
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
      grid-template-columns: 0.88fr 1.12fr;
      align-items: center;
      padding: 36px 56px 36px 48px;
      gap: 28px;
    }

    .visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-width: 0;
    }

    /* Circular crop — filled like before (cover + mild scale) */
    .orb {
      position: relative;
      width: min(620px, 92%);
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      box-shadow:
        0 28px 70px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    }

    .orb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 48%;
      display: block;
      transform: scale(1.02);
      image-rendering: auto;
    }

    .mark {
      position: absolute;
      right: 0;
      bottom: 42px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: rgba(243, 240, 234, 0.38);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
    }

    .copy {
      position: relative;
      padding: 4px 0 4px 40px;
      max-width: 40rem;
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
      gap: 20px;
      margin-bottom: 22px;
    }

    .masthead__logo {
      height: 48px;
      width: auto;
      display: block;
    }

    .masthead__meta {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(243, 240, 234, 0.55);
      line-height: 1.3;
    }

    .kicker {
      display: inline-block;
      margin-bottom: 16px;
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
      font-family: "Fraunces", Georgia, serif;
      font-size: 64px;
      font-weight: 700;
      line-height: 1.02;
      letter-spacing: -0.02em;
      max-width: 16ch;
    }

    .quote {
      margin-top: 24px;
    }

    .quote__lead {
      position: relative;
      color: ${TEXT};
      font-family: "Fraunces", Georgia, serif;
      font-size: 38px;
      font-weight: 500;
      font-style: italic;
      line-height: 1.22;
      letter-spacing: -0.01em;
      max-width: 22ch;
      padding-left: 0.15em;
    }

    .quote__lead::before {
      content: "“";
      position: absolute;
      left: -0.38em;
      top: -0.12em;
      color: ${PEOPLE};
      font-size: 1.4em;
      font-style: normal;
      font-weight: 700;
      opacity: 0.95;
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
          <p class="quote__lead">Spread out your whole routine, then cinch it closed.&rdquo;</p>
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
  const heroUrl = toDataUrl(HERO);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(bannerHtml({ peopleLogoUrl, heroUrl }), { waitUntil: "load" });
  await page.waitForTimeout(500);

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
