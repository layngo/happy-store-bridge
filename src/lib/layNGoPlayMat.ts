import type { CSSProperties } from "react";

/** PDP product shot on `bg-background` — transparent PNG, no drop shadow (avoids halo on #fafafa). */
export const LAY_NGO_PDP_PRODUCT_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center";

/** Lite local PNGs on `bg-background` (diagram, flanks, callouts). */
export const LAY_NGO_LITE_PRODUCT_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center";

/** Lite Shopify variant heroes — white studio mats blend into `bg-background`. */
export const LAY_NGO_LITE_SHOPIFY_HERO_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center mix-blend-multiply";

/** Lifestyle 44″ Shopify heroes — same mat treatment as Lite. */
export const LAY_NGO_LIFESTYLE_SHOPIFY_HERO_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center mix-blend-multiply";

/** Lifestyle 44″ local PNGs (diagram, play strip, callouts). */
export const LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS =
  "max-h-full max-w-full object-contain object-center";

export function isLayNGoLite18Product(handle: string): boolean {
  return handle.toLowerCase() === "lay-n-go-lite-18";
}

/** Lay-n-Go play mat trim / nylon — tuned to read like the real Blue & Green accents. */
const PLAY_MAT_BLUE = "#0b6ec9";
const PLAY_MAT_GREEN = "#2a8f3a";

export function isLayNGoPlayMatProduct(handle: string): boolean {
  const h = handle.toLowerCase();
  return (
    h === "lay-n-go-lite-18" ||
    h === "lay-n-go-large-60" ||
    h === "lay-n-go-lifestyle-44" ||
    h === "lay-n-go-defender-mini-16" ||
    h === "lay-n-go-tactical-bag-20"
  );
}

/** Solid circles only — matches “Blue”, “Blue Accent”, “Green Accent”, etc. */
export function layNGoPlayMatSwatchStyle(optionValue: string): CSSProperties {
  const key = optionValue.trim().toLowerCase();
  if (key.includes("blue")) return { backgroundColor: PLAY_MAT_BLUE };
  if (key.includes("green")) return { backgroundColor: PLAY_MAT_GREEN };
  if (key.includes("orange")) return { backgroundColor: "#e86818" };
  if (key.includes("pink")) return { backgroundColor: "#e14d8a" };
  if (key.includes("purple")) return { backgroundColor: "#5f3d9e" };
  if (key.includes("red")) return { backgroundColor: "#c12f2f" };
  if (key.includes("black")) return { backgroundColor: "#1a1a1a" };
  if (key.includes("gray") || key.includes("grey")) return { backgroundColor: "#6f6f6f" };
  return { backgroundColor: "#94a3b8" };
}
