/**
 * Cosmo PDP story dotted-arrow SVG paths (`d` attribute).
 * Coordinates are in a 0–100 viewBox (stretched with each photo).
 *
 * Customize:
 * 1. Edit the defaults below and deploy, or
 * 2. Open `/dev/cosmo-arrows`, drag the handles, click **Save to this browser** — overrides
 *    `localStorage` until cleared (same device only).
 */

export const COSMO_STORY_ARROW_PATH_DEFAULT = {
  everything: "M 47 9 C 8 14, 2 32, 10 44 L 50 25",
  packup: "M 50 15 Q 53 24, 50 33",
} as const;

export type CosmoStoryArrowVariant = keyof typeof COSMO_STORY_ARROW_PATH_DEFAULT;

const LS_EVERYTHING = "cosmo-story-arrow-everything-d";
const LS_PACKUP = "cosmo-story-arrow-packup-d";

export function readCosmoStoryArrowPath(variant: CosmoStoryArrowVariant): string {
  if (typeof window === "undefined") return COSMO_STORY_ARROW_PATH_DEFAULT[variant];
  try {
    const raw = localStorage.getItem(variant === "everything" ? LS_EVERYTHING : LS_PACKUP)?.trim();
    if (raw) return raw;
  } catch {
    /* ignore */
  }
  return COSMO_STORY_ARROW_PATH_DEFAULT[variant];
}

export function clearCosmoStoryArrowOverrides(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LS_EVERYTHING);
    localStorage.removeItem(LS_PACKUP);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("cosmo-arrows-updated"));
}
