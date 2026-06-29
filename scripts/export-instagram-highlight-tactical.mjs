/**
 * Export Outdoor / Tactical Instagram story highlight cover (1080×1080).
 * Run: node scripts/export-instagram-highlight-tactical.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "instagram-story-highlights");
const ICON_SVG = path.join(ROOT, "assets", "instagram-highlight-tactical-icon.svg");

const CANVAS = 1080;
const SCALE = 0.36;
const BG = "#ffffff";

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = fs.readFileSync(ICON_SVG, "utf8");
  const artwork = Math.round(CANVAS * SCALE);
  const offset = Math.round((CANVAS - artwork) / 2);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: ${CANVAS}px;
      height: ${CANVAS}px;
      background: ${BG};
      overflow: hidden;
    }
    .art {
      position: absolute;
      left: ${offset}px;
      top: ${offset}px;
      width: ${artwork}px;
      height: ${artwork}px;
    }
    .art svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <div class="art">${svg}</div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: CANVAS, height: CANVAS });
  await page.setContent(html, { waitUntil: "load" });
  const outPath = path.join(OUT_DIR, "instagram-highlight-tactical.png");
  await page.locator("body").screenshot({ path: outPath, type: "png" });
  await browser.close();
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
