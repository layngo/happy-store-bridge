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

/** Open black Cosmo studio flat lay — makeup + jewelry on black background. */
const HERO = path.join(PUBLIC, "cosmetic-bags-v2", "cosmo-20.png");

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
        radial-gradient(ellipse 58% 90% at 18% 52%, #1c1c1c 0%, transparent 68%),
        linear-gradient(115deg, #0e0e0e 0%, #161616 48%, #101010 100%);
      overflow: hidden;
    }

    /* Soft paper grain — keeps it from looking flat / AI-slick */
    .banner::before {
      content: "";
      position: absolute;
      inset: 0;
      opacity: 0.09;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      mix-blend-mode: soft-light;
    }

    .accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      background: ${PEOPLE};
    }

    .stage {
      position: relative;
      z-index: 1;
      height: 100%;
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      align-items: center;
      padding: 48px 64px 48px 52px;
      gap: 18px;
    }

    .visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* Circular crop echoes the lay-flat bag — no border/frame */
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
      transform: scale(1.04);
    }

    /* Soft vignette into dark bg so edge isn’t hard/AI */
    .orb::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      box-shadow: inset 0 0 64px 28px rgba(17, 17, 17, 0.55);
      pointer-events: none;
    }

    .mark {
      position: absolute;
      right: -8px;
      bottom: 58px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: rgba(243, 240, 234, 0.28);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
    }

    .copy {
      position: relative;
      padding: 8px 0 8px 36px;
      max-width: 34rem;
    }

    .copy::before {
      content: "";
      position: absolute;
      left: 0;
      top: 10px;
      bottom: 10px;
      width: 2px;
      background: linear-gradient(
        180deg,
        transparent 0%,
        ${PEOPLE} 18%,
        ${PEOPLE} 82%,
        transparent 100%
      );
      opacity: 0.85;
    }

    .masthead {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 28px;
    }

    .masthead__logo {
      height: 36px;
      width: auto;
      display: block;
    }

    .masthead__meta {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(243, 240, 234, 0.48);
      line-height: 1.35;
    }

    .kicker {
      display: inline-block;
      margin-bottom: 14px;
      padding-bottom: 6px;
      color: ${PEOPLE};
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border-bottom: 2px solid ${PEOPLE};
    }

    .headline {
      color: ${TEXT};
      font-family: "Fraunces", Georgia, serif;
      font-size: 46px;
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.015em;
      max-width: 17ch;
    }

    .quote {
      margin-top: 26px;
    }

    .quote__lead {
      position: relative;
      color: ${TEXT};
      font-family: "Fraunces", Georgia, serif;
      font-size: 28px;
      font-weight: 500;
      font-style: italic;
      line-height: 1.28;
      letter-spacing: -0.01em;
      max-width: 22ch;
    }

    .quote__lead::before {
      content: "“";
      position: absolute;
      left: -0.42em;
      top: -0.15em;
      color: ${PEOPLE};
      font-size: 1.35em;
      font-style: normal;
      font-weight: 700;
      opacity: 0.9;
    }

    .quote__rest {
      margin-top: 18px;
      color: rgba(243, 240, 234, 0.72);
      font-size: 20px;
      font-weight: 500;
      line-height: 1.45;
      max-width: 32rem;
    }

    .date {
      margin-top: 28px;
      color: rgba(243, 240, 234, 0.42);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
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
          <p class="quote__lead">Spread out your whole routine, then cinch it closed.</p>
          <p class="quote__rest">PEOPLE calls out our 20-inch lay-flat circle, raised edges that keep lipsticks from rolling, and a hidden pocket for valuables, plus more travel bags from $13.</p>
        </div>

        <p class="date">Published on Jul. 5, 2026</p>
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
