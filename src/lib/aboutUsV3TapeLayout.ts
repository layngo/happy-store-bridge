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

/** Per-panel defaults from manual tape editor alignment. */
export const DEFAULT_ABOUT_US_V3_TAPE_LAYOUT: AboutUsV3TapeLayoutState = {
  "They meet::Love at first sight": {
    near: { x: 2.0081700171380326, y: 3.234904148490445, rotate: -46 },
    far: { x: 98.4493867052623, y: 95.93675880765896, rotate: -46 },
  },
  "They meet::World Travelers": {
    near: { x: 98.43502553875412, y: 2.9607230133950555, rotate: 46 },
    far: { x: 1.18160494450475, y: 95.8582756115269, rotate: 46 },
  },
  "They meet::It's official": {
    near: { x: 1.3180360263325452, y: 3.3269381917880336, rotate: -46 },
    far: { x: 98.67079550203776, y: 95.1762287929327, rotate: -46 },
  },
  "They have a family::They have a family": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They have a family::They have a mess": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They have a family::Our first prototype": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They have a family::The COSMO launches": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They have a mess::Toys spread wall to wall": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They have a mess::Small pieces everywhere": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They have a mess::Cleanup takes forever": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They have an idea::Sketch on the placemat": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They have an idea::First Lay-n-Go prototype": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They have an idea::Family tests the drawstring": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Original LARGE play mat launch": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::LITE personal size ships": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::COSMO cosmetic line grows": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Utility patents awarded": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Retail partners nationwide": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Fans worldwide today": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Early trade-show booth hustle": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::First wholesale catalog spread": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Machine-wash milestone celebrate": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Traveler line meets commuters": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::Pet solutions hit the road": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They start a business, earn 8 patents, and gain the best customers ever::WIRED tech pouch debut": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They give back::Local charity partner spotlight": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "They give back::School supply drive drop-off": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "They give back::Team volunteer day together": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "Then and now… our first models::Andrew — early play-mat days": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "Then and now… our first models::Andrew — testing the cinch": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "Then and now… our first models::Andrew — today": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "Then and now… our first models::Miles — early play-mat days": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "Then and now… our first models::Miles — LEGO cleanup champion": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "Then and now… our first models::Miles — today": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "Then and now… our first models::Caden — early play-mat days": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
  "Then and now… our first models::Caden — weekend adventures": {
    near: { x: 7, y: 5.5, rotate: -46 },
    far: { x: 91, y: 91, rotate: -46 },
  },
  "Then and now… our first models::Caden — today": {
    near: { x: 91, y: 5.5, rotate: 46 },
    far: { x: 7, y: 91, rotate: 46 },
  },
};

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

export function getPanelTapeLayout(key: string, textRight: boolean): PanelTapeLayout {
  return DEFAULT_ABOUT_US_V3_TAPE_LAYOUT[key] ?? defaultPanelTapeLayout(textRight);
}

export function loadAboutUsV3TapeLayout(
  panelKeys: string[],
  textRightByKey: Record<string, boolean>,
): AboutUsV3TapeLayoutState {
  const fallback: AboutUsV3TapeLayoutState = {};
  for (const key of panelKeys) {
    fallback[key] = getPanelTapeLayout(key, textRightByKey[key] ?? false);
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
