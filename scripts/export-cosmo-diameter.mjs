/**
 * Export Cosmo 16″ / 20″ / 22″ diameter measure graphics as PNG.
 * Run: node scripts/export-cosmo-diameter.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { diameterLabelCss } from "./lib/diameter-export-label.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Bracket width scales with mat size (22″ reference ≈ 440px). */
const PRODUCTS = [
  {
    key: "cosmo-16",
    inches: 16,
    hero: path.join(ROOT, "public", "cosmetic-bags-v2", "cosmo-16.png"),
    outDir: path.join(ROOT, "exports", "cosmo-16-diameter"),
    measureWidthPx: 320,
    heroWidthPx: 360,
  },
  {
    key: "cosmo-20",
    inches: 20,
    hero: path.join(ROOT, "public", "cosmetic-bags-v2", "cosmo-20.png"),
    outDir: path.join(ROOT, "exports", "cosmo-20-diameter"),
    measureWidthPx: 400,
    heroWidthPx: 448,
  },
  {
    key: "cosmo-22",
    inches: 22,
    hero: path.join(ROOT, "public", "cosmetic-bags-v2", "cosmo-22.png"),
    outDir: path.join(ROOT, "exports", "cosmo-22-diameter"),
    measureWidthPx: 440,
    heroWidthPx: 480,
  },
];

const PAGE_BG = "#ffffff";
const BRACKET_WIDTH_PCT = 100;
const TICK_HEIGHT_PX = 40;

function heroPath(inches) {
  return path.join(ROOT, "public", "cosmetic-bags-v2", `cosmo-${inches}.png`);
}

function toDataUrl(imgPath) {
  const buf = fs.readFileSync(imgPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function diameterHtml({ inches, heroSrc, measureWidthPx, heroWidthPx, withHero }) {
  const heroBlock = withHero
    ? `<img src="${heroSrc}" alt="" style="display:block;width:${heroWidthPx}px;height:auto;margin:0 auto;" />`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: ${PAGE_BG}; }
    #export {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: ${withHero ? "24px 16px 32px" : "32px 24px"};
      background: ${PAGE_BG};
    }
    .measure {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: ${measureWidthPx}px;
      padding: 0 8px;
      margin-top: ${withHero ? "12px" : "0"};
    }
    .bracket {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      width: ${BRACKET_WIDTH_PCT}%;
      margin: 0 auto;
    }
    .tick {
      width: 1px;
      height: ${TICK_HEIGHT_PX}px;
      background: #171717;
      flex-shrink: 0;
    }
    .line {
      height: 1px;
      background: #171717;
      flex: 1;
      min-width: 0;
    }
    ${diameterLabelCss()}
  </style>
</head>
<body>
  <div id="export">
    ${heroBlock}
    <div class="measure">
      <div class="bracket" aria-hidden="true">
        <div class="tick"></div>
        <div class="line"></div>
        <div class="tick"></div>
      </div>
      <p class="label">${inches}″</p>
    </div>
  </div>
</body>
</html>`;
}

async function exportPng(page, filePath, options) {
  await page.setContent(diameterHtml(options), { waitUntil: "networkidle" });
  const box = await page.locator("#export").boundingBox();
  if (!box) throw new Error(`Could not measure ${filePath}`);
  await page.screenshot({
    path: filePath,
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    omitBackground: false,
  });
  return filePath;
}

async function main() {
  for (const product of PRODUCTS) {
    const heroFile = heroPath(product.inches);
    if (!fs.existsSync(heroFile)) {
      throw new Error(`Missing hero image: ${heroFile}`);
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  const exported = [];

  for (const product of PRODUCTS) {
    fs.mkdirSync(product.outDir, { recursive: true });
    const heroSrc = toDataUrl(heroPath(product.inches));
    const base = product.key;

    exported.push(
      await exportPng(page, path.join(product.outDir, `${base}-diameter-measure.png`), {
        inches: product.inches,
        heroSrc,
        measureWidthPx: product.measureWidthPx,
        heroWidthPx: product.heroWidthPx,
        withHero: false,
      }),
    );

    exported.push(
      await exportPng(page, path.join(product.outDir, `${base}-hero-with-diameter.png`), {
        inches: product.inches,
        heroSrc,
        measureWidthPx: product.heroWidthPx,
        heroWidthPx: product.heroWidthPx,
        withHero: true,
      }),
    );
  }

  await browser.close();

  console.log("Exported:");
  for (const file of exported) console.log(`  ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
