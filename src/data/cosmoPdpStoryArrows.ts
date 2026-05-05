/**
 * Cosmo PDP story dotted-arrow SVG paths (`d` attribute).
 * Coordinates are in a 0–100 viewBox (stretched with each photo).
 *
 * **Where to tune arrows (drag handles):** open this site at **`/dev/cosmo-arrows`**
 * (full URL: `https://yoursite.com/dev/cosmo-arrows`). On Cosmo product pages there is also a link
 * under the story strip. Drag the dots → **Save both to this browser** to preview on PDPs; for
 * permanent paths, copy the `d` strings into `COSMO_STORY_ARROW_PATH_DEFAULT` below.
 */

export const COSMO_STORY_ARROW_PATH_DEFAULT = {
  everything:
    "M 37.66662057522124 10.911223684756882 C 76.64200774336283 5.320142839347257, 80.37472345132744 20.497861562097746, 52.46128318584071 29.53328073744965 S 53.8 36.5, 52.65832411504425 44.40165261802932",
  packup:
    "M 1.8272569444444446 11.412992931547619 Q 30.409071180555557 0, 47.17339409722222 4.2596726190476195",
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
