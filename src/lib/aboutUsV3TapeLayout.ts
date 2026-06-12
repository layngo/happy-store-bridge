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

export const ABOUT_US_V3_TAPE_LAYOUT_STORAGE_KEY = "about-us-v3-tape-layout-v2";
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
    near: { x: 99.4877859961797, y: 1.539459344869929, rotate: 46 },
    far: { x: 1.2226941492271055, y: 95.85150103944893, rotate: 46 },
  },
  "They have a family::They have a mess": {
    near: { x: 98.47452295402464, y: 4.127185795755746, rotate: 46 },
    far: { x: 1.2330660249020382, y: 95.75171659958852, rotate: 46 },
  },
  "They have a family::Our first prototype": {
    near: { x: 98.48489412847073, y: 3.5555808509244002, rotate: 46 },
    far: { x: 1.5797283159007844, y: 95.6209186524099, rotate: 46 },
  },
  "They have a family::The COSMO launches": {
    near: { x: 1.5023378969305812, y: 2.363940775049193, rotate: -46 },
    far: { x: 98.49207471172483, y: 96.26809635001452, rotate: -46 },
  },
  "They have a family::Lay-n-Go named to the Inc 5000": {
    near: { x: 98.921316515061, y: 3.329846932137248, rotate: 46 },
    far: { x: 1.936364184597088, y: 94.83811667849918, rotate: 46 },
  },
  "They have a family::FIERCE ADVOCATES FOR SMALL BUSINESS": {
    near: { x: 99.60746191626205, y: 1.8620774782161236, rotate: 46 },
    far: { x: 0.7212489166014524, y: 95.86505869865273, rotate: 46 },
  },
  "They have a family::THE NEXT GENERATION OF FOUNDERS": {
    near: { x: 1.9128274388037596, y: 3.831696604893741, rotate: -46 },
    far: { x: 98.51720254574116, y: 95.70035723691193, rotate: -46 },
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
