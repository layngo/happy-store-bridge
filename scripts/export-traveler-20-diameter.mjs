/**
 * Export Lay-n-Go Traveler 20" diameter measure graphic as PNG.
 * Run: node scripts/export-traveler-20-diameter.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { diameterLabelCss } from "./lib/diameter-export-label.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "traveler-20-diameter");
const HERO = path.join(ROOT, "public", "products", "lay-n-go-large-pdp", "traveler-callout-main.png");

/** Desktop hero stage (`max-w-4xl`) — used when hero is included. */
const HERO_STAGE_WIDTH_PX = 896;
/** Standalone measure width (`max-w-[min(96vw,36rem)]` mobile stage). */
const MEASURE_ONLY_WIDTH_PX = 576;
/** Matches `TRAVELER_DIAMETER_BRACKET_CLASS` (black mat ~928/1024 of hero width). */
const BRACKET_WIDTH_PCT = 90.625;
/** Matches `h-14` tick height at md. */
const TICK_HEIGHT_PX = 56;

function toDataUrl(imgPath) {
  const buf = fs.readFileSync(imgPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function diameterHtml({ heroSrc, withHero }) {
  const measureWidthPx = withHero ? HERO_STAGE_WIDTH_PX : MEASURE_ONLY_WIDTH_PX;
  const heroBlock = withHero
    ? `<img src="${heroSrc}" alt="" style="display:block;width:${HERO_STAGE_WIDTH_PX}px;height:auto;margin:0 auto;" />`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; }
    #export {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: ${withHero ? "24px 16px 32px" : "32px 24px"};
      background: #fff;
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
      <p class="label">20″</p>
    </div>
  </div>
</body>
</html>`;
}

async function exportPng(page, name, { heroSrc, withHero }) {
  await page.setContent(diameterHtml({ heroSrc, withHero }), { waitUntil: "networkidle" });
  const box = await page.locator("#export").boundingBox();
  if (!box) throw new Error(`Could not measure ${name}`);
  const filePath = path.join(OUT_DIR, `${name}.png`);
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
  if (!fs.existsSync(HERO)) {
    throw new Error(`Missing hero image: ${HERO}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const heroSrc = toDataUrl(HERO);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  const exported = [];

  exported.push(
    await exportPng(page, "traveler-20-diameter-measure", { heroSrc, withHero: false }),
  );
  exported.push(
    await exportPng(page, "traveler-20-hero-with-diameter", { heroSrc, withHero: true }),
  );

  await browser.close();

  console.log("Exported:");
  for (const file of exported) console.log(`  ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
