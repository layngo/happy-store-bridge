/**
 * Export Nailspa PDP story diagram arrows as transparent PNGs.
 * Run: node scripts/export-nailspa-arrows.mjs
 */

import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "exports", "nailspa-diagram-arrows");

const MAIN_ARROW_WORKSPACE = "-170 -85 380 210";
const DEFAULT_ARROW_STROKE = 1.25;
const DEFAULT_HEAD_SCALE = 1;
const EXPORT_SCALE = 4;
const PADDING = 24;

/** Shipped defaults from NailspaPdpStory.tsx */
const ARROWS = {
  mesh: {
    start: { x: -113.209395136152, y: -36.65659849984306 },
    control: { x: -69.5764322280884, y: -4.810273034232026 },
    end: { x: -22.44458539145333, y: -30.63073594229561 },
    strokeWidth: 1.5,
    headScale: 1,
    rotation: 0,
  },
  lipTop: {
    start: { x: -35.89967441558838, y: -125.90612084524975 },
    control: { x: -80.60910946982249, y: -118.88331658499584 },
    end: { x: -54.19076524462018, y: -95.56332560947966 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  handleRight: {
    start: { x: 130.21632180895125, y: -124.41143308367052 },
    control: { x: 176.54855687277666, y: -133.12183380126956 },
    end: { x: 162.82251971108576, y: -95.9373599461147 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  toolsCenter: {
    start: { x: 176.85781547001432, y: 56.63961369650704 },
    control: { x: 156.4800470897129, y: 77.52690083639962 },
    end: { x: 66.67977046966553, y: 15.510052953447612 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: -20,
  },
  washSurface: {
    start: { x: 144.66688224247525, y: 118.49593816484725 },
    control: { x: 115.12371948787143, y: 147.95223971775604 },
    end: { x: 82.02714770180842, y: 107.99634061540874 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  cord: {
    start: { x: -136.86957263946533, y: 126.18140983581549 },
    control: { x: -127.92061683109827, y: 162.5000103541783 },
    end: { x: -103.78185367584229, y: 154.2137219565255 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
};

function arrowPivot(geom) {
  return {
    x: (geom.start.x + geom.control.x + geom.end.x) / 3,
    y: (geom.start.y + geom.control.y + geom.end.y) / 3,
  };
}

function rotatePoint(p, pivot, deg) {
  if (!deg) return p;
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - pivot.x;
  const dy = p.y - pivot.y;
  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos,
  };
}

function quadPoint(start, control, end, t) {
  const u = 1 - t;
  return {
    x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y,
  };
}

function arrowCurveEnd(start, control, end, trimT = 0.94) {
  return quadPoint(start, control, end, trimT);
}

function arrowHeadMetrics(geom) {
  const strokeWidth = geom.strokeWidth ?? DEFAULT_ARROW_STROKE;
  const headScale = (geom.headScale ?? DEFAULT_HEAD_SCALE) * (strokeWidth / DEFAULT_ARROW_STROKE);
  const { start, control, end } = geom;
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 6 * headScale;
  const spread = 3.8 * headScale;
  return {
    strokeWidth,
    start,
    control,
    end,
    size,
    left: { x: end.x - ux * size - uy * spread, y: end.y - uy * size + ux * spread },
    right: { x: end.x - ux * size + uy * spread, y: end.y - uy * size - ux * spread },
    curveEnd: arrowCurveEnd(start, control, end),
  };
}

function arrowGeomPoints(geom) {
  const { start, control, end } = geom;
  const { left, right } = arrowHeadMetrics(geom);
  const pivot = arrowPivot(geom);
  const rotation = geom.rotation ?? 0;

  const curvePts = [];
  for (let i = 0; i <= 20; i++) {
    curvePts.push(rotatePoint(quadPoint(start, control, end, i / 20), pivot, rotation));
  }

  return [
    ...curvePts,
    rotatePoint(end, pivot, rotation),
    rotatePoint(left, pivot, rotation),
    rotatePoint(right, pivot, rotation),
  ];
}

function viewBoxForPoints(points, padding) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;
  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
    string: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
  };
}

function arrowPathsMarkup(geom) {
  const { start, control, end } = geom;
  const { strokeWidth, left, right, curveEnd } = arrowHeadMetrics(geom);
  const pivot = arrowPivot(geom);
  const rotation = geom.rotation ?? 0;
  const transform = rotation !== 0 ? ` transform="rotate(${rotation} ${pivot.x} ${pivot.y})"` : "";

  return `<g${transform} fill="#262626" stroke="#262626">
    <path d="M${start.x} ${start.y} Q${control.x} ${control.y} ${curveEnd.x} ${curveEnd.y}"
      fill="none" stroke-width="${strokeWidth}" stroke-dasharray="3 4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${end.x} ${end.y} L${left.x} ${left.y} L${right.x} ${right.y} Z" stroke="none"/>
  </g>`;
}

function svgDocument({ viewBox, inner, width, height }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" fill="none">${inner}</svg>`;
}

function buildSingleArrowSvg(key, geom) {
  const vb = viewBoxForPoints(arrowGeomPoints(geom), PADDING);
  const width = Math.round(vb.width * EXPORT_SCALE);
  const height = Math.round(vb.height * EXPORT_SCALE);
  const inner = arrowPathsMarkup(geom);
  return {
    key,
    html: svgDocument({ viewBox: vb.string, inner, width, height }),
    width,
    height,
  };
}

function buildAllArrowsSvg() {
  const allPoints = Object.values(ARROWS).flatMap((geom) => arrowGeomPoints(geom));
  const vb = viewBoxForPoints(allPoints, PADDING);
  const width = Math.round(vb.width * EXPORT_SCALE);
  const height = Math.round(vb.height * EXPORT_SCALE);
  const inner = Object.entries(ARROWS)
    .map(([, geom]) => arrowPathsMarkup(geom))
    .join("\n");
  return {
    key: "all-arrows",
    html: svgDocument({ viewBox: vb.string, inner, width, height }),
    width,
    height,
  };
}

async function exportPng(page, { key, html, width, height }) {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!DOCTYPE html><html><body style="margin:0;background:transparent;">${html}</body></html>`,
    { waitUntil: "load" },
  );
  const filePath = path.join(OUT_DIR, `${key}.png`);
  await page.locator("svg").screenshot({ path: filePath, omitBackground: true });
  return filePath;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const exported = [];

  for (const [key, geom] of Object.entries(ARROWS)) {
    const spec = buildSingleArrowSvg(key, geom);
    exported.push(await exportPng(page, spec));
  }

  exported.push(await exportPng(page, buildAllArrowsSvg()));

  // Full workspace reference (same coords as live diagram overlay)
  const [wsMinX, wsMinY, wsW, wsH] = MAIN_ARROW_WORKSPACE.split(/\s+/).map(Number);
  const fullInner = Object.entries(ARROWS)
    .map(([, geom]) => arrowPathsMarkup(geom))
    .join("\n");
  exported.push(
    await exportPng(page, {
      key: "all-arrows-full-workspace",
      html: svgDocument({
        viewBox: MAIN_ARROW_WORKSPACE,
        inner: fullInner,
        width: Math.round(wsW * EXPORT_SCALE),
        height: Math.round(wsH * EXPORT_SCALE),
      }),
      width: Math.round(wsW * EXPORT_SCALE),
      height: Math.round(wsH * EXPORT_SCALE),
    }),
  );

  await browser.close();

  console.log("Exported Nailspa diagram arrows:");
  for (const file of exported) {
    console.log(`  ${file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
