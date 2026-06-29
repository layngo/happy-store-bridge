/**
 * Export Defender Mini 16″ diagram callout circles (white rim + drop shadow) as PNG.
 * Run: node scripts/export-defender-mini-16-callouts.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports", "defender-mini-16-callouts");
const PRODUCT_DIR = path.join(ROOT, "public", "products", "lay-n-go-defender-callouts");

/** Matches defender diagram stage (`bg-background`). */
const PAGE_BG = "#fafafa";

/** Matches `DefenderHeroCalloutThumb` at md (`h-28 w-28`) + `defenderThumbClassName`. */
const CALLOUTS = [
  {
    key: "containment-lip",
    file: "callout-lip.png",
    sizePx: 112,
    objectFit: "contain",
    scale: 1,
    objectPosition: "left bottom",
    translateXRatio: -6 / 112,
    translateYRatio: 6 / 112,
  },
  {
    key: "carry-strap",
    file: "callout-strap.png",
    sizePx: 112,
    objectFit: "contain",
    scale: 1.08,
    objectPosition: "center center",
  },
  {
    key: "drawstring-cord-lock",
    file: "callout-drawstring.png",
    sizePx: 112,
    objectFit: "contain",
    scale: 1,
    objectPosition: "center center",
  },
];

function toDataUrl(imgPath) {
  const buf = fs.readFileSync(imgPath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function calloutHtml({
  imgSrc,
  sizePx,
  objectFit = "cover",
  scale,
  objectPosition,
  transformOrigin = "center center",
  translateXRatio = 0,
  translateYRatio = 0,
  outerBg,
}) {
  const translateX = `${translateXRatio * sizePx}px`;
  const translateY = `${translateYRatio * sizePx}px`;
  const transform =
    translateXRatio !== 0 || translateYRatio !== 0
      ? `scale(${scale}) translate(${translateX}, ${translateY})`
      : `scale(${scale})`;
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
        background: #fff;
      ">
        <img
          src="${imgSrc}"
          alt=""
          style="
            display: block;
            width: 100%;
            height: 100%;
            object-fit: ${objectFit};
            object-position: ${objectPosition};
            transform: ${transform};
            transform-origin: ${transformOrigin};
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

async function exportVariant(page, {
  name,
  imgSrc,
  sizePx,
  objectFit,
  scale,
  objectPosition,
  transformOrigin,
  translateXRatio,
  translateYRatio,
  outerBg,
  omitBackground,
}) {
  await page.setContent(
    calloutHtml({
      imgSrc,
      sizePx,
      objectFit,
      scale,
      objectPosition,
      transformOrigin,
      translateXRatio,
      translateYRatio,
      outerBg,
    }),
    { waitUntil: "load" },
  );
  await page.waitForFunction(() => {
    const img = document.querySelector("img");
    return img?.complete && img.naturalWidth > 0;
  });
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
  for (const callout of CALLOUTS) {
    const imgPath = path.join(PRODUCT_DIR, callout.file);
    if (!fs.existsSync(imgPath)) {
      throw new Error(`Missing callout image: ${imgPath}`);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  const exported = [];

  for (const callout of CALLOUTS) {
    const imgPath = path.join(PRODUCT_DIR, callout.file);
    const imgSrc = toDataUrl(imgPath);
    const base = `defender-mini-16-${callout.key}-circle`;

    exported.push(
      await exportVariant(page, {
        name: base,
        imgSrc,
        sizePx: callout.sizePx,
        objectFit: callout.objectFit,
        scale: callout.scale,
        objectPosition: callout.objectPosition,
        transformOrigin: callout.transformOrigin ?? "center center",
        translateXRatio: callout.translateXRatio ?? 0,
        translateYRatio: callout.translateYRatio ?? 0,
        outerBg: PAGE_BG,
        omitBackground: false,
      }),
    );

    exported.push(
      await exportVariant(page, {
        name: `${base}-transparent`,
        imgSrc,
        sizePx: callout.sizePx,
        objectFit: callout.objectFit,
        scale: callout.scale,
        objectPosition: callout.objectPosition,
        transformOrigin: callout.transformOrigin ?? "center center",
        translateXRatio: callout.translateXRatio ?? 0,
        translateYRatio: callout.translateYRatio ?? 0,
        outerBg: "transparent",
        omitBackground: true,
      }),
    );

    exported.push(
      await exportVariant(page, {
        name: `${base}-large`,
        imgSrc,
        sizePx: callout.sizePx * 2,
        objectFit: callout.objectFit,
        scale: callout.scale,
        objectPosition: callout.objectPosition,
        transformOrigin: callout.transformOrigin ?? "center center",
        translateXRatio: callout.translateXRatio ?? 0,
        translateYRatio: callout.translateYRatio ?? 0,
        outerBg: PAGE_BG,
        omitBackground: false,
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
