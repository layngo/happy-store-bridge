import type { CSSProperties } from "react";

/** Lay-n-Go play mat trim / nylon — tuned to read like the real Blue & Green accents. */
const PLAY_MAT_BLUE = "#0b6ec9";
const PLAY_MAT_GREEN = "#2a8f3a";

export function isLayNGoPlayMatProduct(handle: string): boolean {
  const h = handle.toLowerCase();
  return (
    h === "lay-n-go-lite-18" ||
    h === "lay-n-go-large-60" ||
    h === "lay-n-go-lifestyle-44" ||
    h === "lay-n-go-defender-mini-16"
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
