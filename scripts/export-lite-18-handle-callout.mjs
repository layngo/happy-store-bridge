/**
 * Export Lite 18" "Built in handle" diagram callout circle as PNG.
 * Run: node scripts/export-lite-18-handle-callout.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "lite-18-handle-callout");
const HANDLE_IMG = path.join(ROOT, "public", "products", "lay-n-go-lite-18", "litestrap.png");

/** Matches LayNGoLargeCalloutDiagram lite-18 handle thumb (md stage). */
function calloutHtml({ sizePx, outerBg }) {
  const src = `file://${HANDLE_IMG}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: ${outerBg};
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    #export {
      padding: 48px;
      background: ${outerBg};
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="export">
    <div class="thumb" style="
      width: ${sizePx}px;
      height: ${sizePx}px;
      border-radius: 9999px;
      background: #fff;
      padding: 2px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.32), 0 5px 16px rgba(0,0,0,0.26);
      flex-shrink: 0;
    ">
      <div style="
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 9999px;
      ">
        <img
          src="${src}"
          alt=""
          style="
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transform: scale(1.55);
            transform-origin: center center;
            max-width: none;
            max-height: none;
          "
        />
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function exportVariant(page, { name, sizePx, outerBg, omitBackground }) {
  await page.setContent(calloutHtml({ sizePx, outerBg }), { waitUntil: "load" });
  const box = await page.locator("#export").boundingBox();
  if (!box) throw new Error(`Could not measure ${name}`);
  const filePath = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({
    path: filePath,
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    omitBackground,
  });
  return filePath;
}

async function main() {
  if (!fs.existsSync(HANDLE_IMG)) {
    throw new Error(`Missing handle image: ${HANDLE_IMG}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  const exported = [];

  // Matches attached reference: circle on black
  exported.push(
    await exportVariant(page, {
      name: "lite-18-built-in-handle-circle",
      sizePx: 160,
      outerBg: "#000000",
      omitBackground: false,
    }),
  );

  // Larger @2x diagram size (md h-40)
  exported.push(
    await exportVariant(page, {
      name: "lite-18-built-in-handle-circle-large",
      sizePx: 320,
      outerBg: "#000000",
      omitBackground: false,
    }),
  );

  // Transparent outer (circle + shadow only)
  exported.push(
    await exportVariant(page, {
      name: "lite-18-built-in-handle-circle-transparent",
      sizePx: 160,
      outerBg: "transparent",
      omitBackground: true,
    }),
  );

  await browser.close();

  console.log("Exported:");
  for (const file of exported) console.log(`  ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
