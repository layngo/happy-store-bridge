/**
 * Export Cosmo lifestyle Instagram post with depth typography.
 * Text sits behind foreground elements (sink + bag) via masked overlay.
 * Run: node scripts/export-cosmo-lifestyle-insta-post.mjs
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
const INK = "#171717";

/** Pink Cosmo on vanity — strong foreground for depth layering. */
const LIFESTYLE = path.join(PUBLIC, "cosmo-pdp", "gallery", "02.png");

function toDataUrl(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function postHtml({ photoUrl, logoUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=League+Spartan:wght@600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      background: #0a0a0a;
    }

    #export {
      position: relative;
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      overflow: hidden;
      background: #111;
    }

    .photo-base {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .photo-base img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 42%;
      filter: brightness(0.82) saturate(1.05) contrast(1.04);
    }

    .photo-base::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(8, 8, 8, 0.72) 0%, rgba(8, 8, 8, 0.38) 28%, rgba(8, 8, 8, 0.08) 44%, rgba(8, 8, 8, 0.02) 52%, rgba(8, 8, 8, 0.42) 100%),
        radial-gradient(ellipse 88% 48% at 32% 24%, rgba(0, 0, 0, 0.55) 0%, transparent 72%);
      pointer-events: none;
    }

    .type-layer {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 56px 52px 0;
      pointer-events: none;
    }

    .type-layer::before {
      content: "";
      position: absolute;
      left: 28px;
      top: 118px;
      width: 640px;
      height: 420px;
      background: radial-gradient(ellipse 100% 100% at 20% 30%, rgba(0, 0, 0, 0.52) 0%, transparent 72%);
      pointer-events: none;
    }

    .type-copy {
      position: relative;
      z-index: 1;
      max-width: 700px;
    }

    .logo {
      position: relative;
      z-index: 1;
      width: 168px;
      height: auto;
      margin-bottom: 44px;
      opacity: 0.98;
      filter: brightness(0) invert(1) drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45));
    }

    .eyebrow {
      font-family: "League Spartan", ui-sans-serif, sans-serif;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: #7fd4e3;
      margin-bottom: 16px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.65);
    }

    .headline {
      font-family: "League Spartan", ui-sans-serif, sans-serif;
      font-size: 136px;
      font-weight: 900;
      line-height: 0.88;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #fff;
      text-shadow:
        0 0 1px rgba(0, 0, 0, 0.8),
        0 3px 0 rgba(0, 0, 0, 0.25),
        0 10px 32px rgba(0, 0, 0, 0.55),
        0 24px 64px rgba(0, 0, 0, 0.35);
      max-width: 92%;
    }

    .headline .accent {
      display: block;
      color: #fff;
      -webkit-text-stroke: 0;
      margin-top: 2px;
    }

    .subline {
      margin-top: 22px;
      max-width: 480px;
      padding: 14px 18px 14px 0;
      font-family: "Cormorant Garamond", Georgia, serif;
      font-size: 38px;
      font-weight: 600;
      font-style: italic;
      line-height: 1.2;
      color: #fff;
      text-shadow:
        0 0 1px rgba(0, 0, 0, 0.9),
        0 4px 20px rgba(0, 0, 0, 0.75),
        0 10px 36px rgba(0, 0, 0, 0.55);
    }

    .rule {
      width: 88px;
      height: 3px;
      margin-top: 34px;
      background: linear-gradient(90deg, ${BRAND}, rgba(58, 159, 176, 0.15));
      border-radius: 999px;
    }

    .photo-foreground {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }

    .photo-foreground img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 42%;
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.2) 54%,
        black 60%,
        black 100%
      );
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.2) 54%,
        black 60%,
        black 100%
      );
    }

    .footer {
      position: absolute;
      left: 56px;
      right: 56px;
      bottom: 48px;
      z-index: 4;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
    }

    .product-tag {
      font-family: "League Spartan", ui-sans-serif, sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #fff;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.55);
    }

    .product-tag span {
      display: block;
      margin-top: 6px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.28em;
      color: ${BRAND};
    }

    .cta {
      padding: 14px 22px;
      border: 2px solid rgba(255, 255, 255, 0.72);
      border-radius: 999px;
      font-family: "League Spartan", ui-sans-serif, sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #fff;
      background: rgba(10, 10, 10, 0.28);
      backdrop-filter: blur(6px);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    }
  </style>
</head>
<body>
  <div id="export">
    <div class="photo-base">
      <img src="${photoUrl}" alt="" />
    </div>

    <div class="type-layer">
      <img class="logo" src="${logoUrl}" alt="" />
      <div class="type-copy">
        <p class="eyebrow">Cosmo</p>
        <h1 class="headline">
          Open
          <span class="accent">Flat</span>
        </h1>
        <p class="subline">Your whole routine, laid out beautifully.</p>
        <div class="rule"></div>
      </div>
    </div>

    <div class="photo-foreground">
      <img src="${photoUrl}" alt="" />
    </div>

    <div class="footer">
      <div class="product-tag">
        Lay-n-Go Cosmo
        <span>layngo.com</span>
      </div>
      <div class="cta">Shop Now</div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const photoUrl = toDataUrl(LIFESTYLE);
  const logoUrl = toDataUrl(path.join(PUBLIC, "layngo-logo-outlined.png"));

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(postHtml({ photoUrl, logoUrl }), { waitUntil: "load" });
  await page.waitForTimeout(400);

  const outPath = path.join(OUT_DIR, `cosmo-lifestyle-insta-post-${WIDTH}x${HEIGHT}.png`);
  await page.locator("#export").screenshot({ path: outPath, type: "png" });
  await browser.close();

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
