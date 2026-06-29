/**
 * Export Defender Mini 16″ and Defender Tactical 20″ diameter measure graphics as PNG.
 * Run: node scripts/export-defender-diameter.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { diameterLabelCss } from "./lib/diameter-export-label.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Matches defender diagram stage (`bg-background`, hsl 0 0% 98%). */
const PAGE_BG = "#fafafa";

const PRODUCTS = [
  {
    key: "defender-mini-16",
    inches: 16,
    hero: path.join(ROOT, "public", "products", "lay-n-go-defender-mini-16", "hero-callout-main.png"),
    outDir: path.join(ROOT, "exports", "defender-mini-16-diameter"),
    /** Desktop hero/measure stage (`max-w-5xl`). */
    heroStageWidthPx: 1024,
    /** Mobile stage for standalone measure (`max-w-[min(96vw,36rem)]`). */
    measureOnlyWidthPx: 576,
    /** `DEFENDER_MINI_DIAMETER_BRACKET_CLASS` at md. */
    bracketWidthPct: 58,
  },
  {
    key: "defender-tactical-20",
    inches: 20,
    hero: path.join(ROOT, "public", "products", "lay-n-go-tactical-bag-20", "hero-callout-main.png"),
    outDir: path.join(ROOT, "exports", "defender-tactical-20-diameter"),
    /** Tactical hero width (`64rem * 600/1024`). */
    heroStageWidthPx: 600,
    measureOnlyWidthPx: 576,
    /** `DEFENDER_TACTICAL_DIAMETER_BRACKET_CLASS` at md/lg. */
    bracketWidthPct: 85,
  },
];

/** Matches `h-14` tick height at md. */
const TICK_HEIGHT_PX = 56;

function toDataUrl(imgPath) {
  const buf = fs.readFileSync(imgPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function diameterHtml({ inches, heroSrc, measureWidthPx, heroStageWidthPx, withHero, bracketWidthPct }) {
  const heroBlock = withHero
    ? `<img src="${heroSrc}" alt="" style="display:block;width:${heroStageWidthPx}px;height:auto;margin:0 auto;" />`
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
      width: ${bracketWidthPct}%;
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
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    },
    omitBackground: false,
  });
  return filePath;
}

async function main() {
  for (const product of PRODUCTS) {
    if (!fs.existsSync(product.hero)) {
      throw new Error(`Missing hero image: ${product.hero}`);
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  const exported = [];

  for (const product of PRODUCTS) {
    fs.mkdirSync(product.outDir, { recursive: true });
    const heroSrc = toDataUrl(product.hero);
    const base = product.key;

    exported.push(
      await exportPng(page, path.join(product.outDir, `${base}-diameter-measure.png`), {
        inches: product.inches,
        heroSrc,
        measureWidthPx: product.measureOnlyWidthPx,
        heroStageWidthPx: product.heroStageWidthPx,
        withHero: false,
        bracketWidthPct: product.bracketWidthPct,
      }),
    );

    exported.push(
      await exportPng(page, path.join(product.outDir, `${base}-hero-with-diameter.png`), {
        inches: product.inches,
        heroSrc,
        measureWidthPx: product.heroStageWidthPx,
        heroStageWidthPx: product.heroStageWidthPx,
        withHero: true,
        bracketWidthPct: product.bracketWidthPct,
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
