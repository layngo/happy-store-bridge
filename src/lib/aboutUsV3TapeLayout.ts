export type TapePlacement = {
  x: number;
  y: number;
  rotate: number;
};

export type PanelTapeLayout = {
  near: TapePlacement;
  far: TapePlacement;
};

export type AboutUsV3TapeLayoutState = Record<string, PanelTapeLayout>;

export const ABOUT_US_V3_TAPE_LAYOUT_STORAGE_KEY = "about-us-v3-tape-layout-v1";
export const ABOUT_US_V3_TAPE_LAYOUT_SYNC_EVENT = "about-us-v3-tape-layout";

export function panelTapeKey(chapterHeading: string, panelTitle: string) {
  return `${chapterHeading}::${panelTitle}`;
}

export function defaultPanelTapeLayout(textRight: boolean): PanelTapeLayout {
  if (textRight) {
    return {
      near: { x: 91, y: 5.5, rotate: 46 },
      far: { x: 7, y: 91, rotate: 46 },
    };
  }
  return {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  };
}

export function loadAboutUsV3TapeLayout(
  panelKeys: string[],
  textRightByKey: Record<string, boolean>,
): AboutUsV3TapeLayoutState {
  const fallback: AboutUsV3TapeLayoutState = {};
  for (const key of panelKeys) {
    fallback[key] = defaultPanelTapeLayout(textRightByKey[key] ?? false);
  }

  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(ABOUT_US_V3_TAPE_LAYOUT_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as AboutUsV3TapeLayoutState;
    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
}

export function saveAboutUsV3TapeLayout(layout: AboutUsV3TapeLayoutState) {
  localStorage.setItem(ABOUT_US_V3_TAPE_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  window.dispatchEvent(new Event(ABOUT_US_V3_TAPE_LAYOUT_SYNC_EVENT));
}
