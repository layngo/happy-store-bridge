import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  LAY_NGO_LITE_PRODUCT_IMAGE_CLASS,
  LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS,
} from "@/lib/layNGoPlayMat";
import { cn } from "@/lib/utils";
import {
  clientToViewBoxPoint,
  defenderCalloutTransform,
  defenderLayoutForVariant,
  defenderLeaderKeysForVariant,
  loadDefenderLayout,
  viewBoxPointToStagePos,
  type DefenderLayoutState,
  type DefenderLeaderEnd,
} from "@/lib/defenderCalloutLayout";

const HERO_CALLOUT_MAIN = "/products/lay-n-go-large-pdp/hero-callout-main.png";
const HERO_CALLOUT_LIFESTYLE = "/products/lay-n-go-lifestyle-44/hero-callout-main.png";
const HERO_CALLOUT_LITE = "/products/lay-n-go-lite-18/hero-callout-main.png";
const HERO_CALLOUT_DEFENDER_MINI = "/products/lay-n-go-defender-mini-16/hero-callout-main.png?v=3";
const HERO_CALLOUT_DEFENDER_TACTICAL = "/products/lay-n-go-tactical-bag-20/hero-callout-main.png?v=1";
const CALLOUT_CORD = "/products/lay-n-go-large-pdp/callout-cord-pocket.png";
const CALLOUT_CORD_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-cord-pocket.png";
const CALLOUT_MESH = "/products/lay-n-go-large-pdp/callout-mesh-pockets.png";
const CALLOUT_MESH_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-mesh-pockets.png";
const CALLOUT_LIP = "/products/lay-n-go-large-pdp/callout-containment-lip.png";
const CALLOUT_LIP_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-containment-lip.png";
const CALLOUT_LIP_LITE = "/products/lay-n-go-lite-18/callout-containment-lip.png";
const CALLOUT_CORD_LITE = "/products/lay-n-go-lite-18/callout-cord-pocket-handle.png";
const CALLOUT_HANDLE_LITE = "/products/lay-n-go-lite-18/litestrap.png";
/** Circular callout thumbs — Defender Tactical 20″ diagram (cropped from hero). */
const DEFENDER_TACTICAL_CALLOUT_ASSET_V = "2";
const DEFENDER_TACTICAL_CALLOUT_MESH = `/products/lay-n-go-tactical-bag-20/callout-mesh.png?v=${DEFENDER_TACTICAL_CALLOUT_ASSET_V}`;
const DEFENDER_TACTICAL_CALLOUT_ZIPPER = `/products/lay-n-go-tactical-bag-20/callout-zipper.png?v=${DEFENDER_TACTICAL_CALLOUT_ASSET_V}`;
/** Circular callout thumbs — Defender Mini + Tactical lip/cord/strap (trimmed PNGs). */
const DEFENDER_CALLOUT_ASSET_V = "5";
const DEFENDER_CALLOUT_STRAP = `/products/lay-n-go-defender-callouts/callout-strap.png?v=${DEFENDER_CALLOUT_ASSET_V}`;
const DEFENDER_CALLOUT_LIP = `/products/lay-n-go-defender-callouts/callout-lip.png?v=${DEFENDER_CALLOUT_ASSET_V}`;
const DEFENDER_CALLOUT_DRAWSTRING = `/products/lay-n-go-defender-callouts/callout-drawstring.png?v=${DEFENDER_CALLOUT_ASSET_V}`;

/** Show full thumb art in circles (not `object-cover`, which crops padded PNGs). */
const DEFENDER_THUMB_IMG_CLASS = "object-contain object-center";

function defenderThumbClassName(key: string): string {
  if (key === "strap" || key === "lip") {
    return cn(DEFENDER_THUMB_IMG_CLASS, "scale-[1.08]");
  }
  if (key === "zipper") {
    return cn(DEFENDER_THUMB_IMG_CLASS, "scale-[1.12] object-[center_42%]");
  }
  return DEFENDER_THUMB_IMG_CLASS;
}

/** Defender Tactical hero callout stage — matches `hero-callout-main.png` (1024×1024). */
const DEFENDER_TACTICAL_CALLOUT_VB = { w: 1024, h: 1024 } as const;
const DEFENDER_TACTICAL_DOT_R = 6.5;
const DEFENDER_TACTICAL_DOT_STROKE = 2.25;
const DEFENDER_TACTICAL_LEADER_OUTER = (1.02 * 1024) / 100;
const DEFENDER_TACTICAL_LEADER_INNER = (0.58 * 1024) / 100;

type DefenderHeroCalloutItem = {
  key: string;
  label: string;
  thumbSrc: string;
  thumbAlt: string;
  thumbClassName: string;
  labelAbove: boolean;
};

const DEFENDER_TACTICAL_CALLOUTS: readonly DefenderHeroCalloutItem[] = [
  {
    key: "mesh",
    label: "Dual mesh pockets",
    thumbSrc: DEFENDER_TACTICAL_CALLOUT_MESH,
    thumbAlt: "Mesh pockets on the Defender Tactical interior",
    thumbClassName: defenderThumbClassName("mesh"),
    labelAbove: true,
  },
  {
    key: "zipper",
    label: "Zipper pocket",
    thumbSrc: DEFENDER_TACTICAL_CALLOUT_ZIPPER,
    thumbAlt: "Zipper pocket closeup on Defender Tactical",
    thumbClassName: defenderThumbClassName("zipper"),
    labelAbove: true,
  },
  {
    key: "strap",
    label: "Reinforced carry strap",
    thumbSrc: DEFENDER_CALLOUT_STRAP,
    thumbAlt: "Reinforced carry strap on Defender Tactical",
    thumbClassName: defenderThumbClassName("strap"),
    labelAbove: true,
  },
  {
    key: "lip",
    label: "Raised containment lip",
    thumbSrc: DEFENDER_CALLOUT_LIP,
    thumbAlt: "Raised containment lip on Defender Tactical",
    thumbClassName: defenderThumbClassName("lip"),
    labelAbove: false,
  },
  {
    key: "cord",
    label: "Drawstring & cord lock",
    thumbSrc: DEFENDER_CALLOUT_DRAWSTRING,
    thumbAlt: "Drawstring and cord lock on Defender Tactical",
    thumbClassName: defenderThumbClassName("cord"),
    labelAbove: false,
  },
];

/** Defender Mini hero callout stage — matches `hero-callout-main.png` (1024×600). */
const DEFENDER_MINI_CALLOUT_VB = { w: 1024, h: 600 } as const;

/** Shared callout stage width; Tactical inner stage scales to match Mini height. */
const DEFENDER_CALLOUT_STAGE_MAX_W = "max-w-5xl";
/** Mini is 600/1024 tall at full stage width; Tactical PNG is square — same footprint when width = this fraction. */
const DEFENDER_TACTICAL_STAGE_WIDTH_FRAC = DEFENDER_MINI_CALLOUT_VB.h / DEFENDER_MINI_CALLOUT_VB.w;

const DEFENDER_MINI_CALLOUTS: readonly DefenderHeroCalloutItem[] = [
  {
    key: "lip",
    label: "Raised containment lip",
    thumbSrc: DEFENDER_CALLOUT_LIP,
    thumbAlt: "Raised containment lip on Defender Mini",
    thumbClassName: defenderThumbClassName("lip"),
    labelAbove: true,
  },
  {
    key: "strap",
    label: "Reinforced carry strap",
    thumbSrc: DEFENDER_CALLOUT_STRAP,
    thumbAlt: "Reinforced carry strap on Defender Mini",
    thumbClassName: defenderThumbClassName("strap"),
    labelAbove: true,
  },
  {
    key: "cord",
    label: "Drawstring & cord lock",
    thumbSrc: DEFENDER_CALLOUT_DRAWSTRING,
    thumbAlt: "Drawstring and cord lock on Defender Mini",
    thumbClassName: defenderThumbClassName("cord"),
    labelAbove: false,
  },
];

const STORAGE_KEY_LARGE = "lay-n-go-large-callout-layout-v5";
const STORAGE_KEY_LIFESTYLE = "lay-n-go-lifestyle-44-callout-layout-v14";

const LAYOUT_SYNC_EVENT_LARGE = "lay-n-go-large-callout-layout";
const LAYOUT_SYNC_EVENT_LIFESTYLE = "lay-n-go-lifestyle-44-callout-layout";

const STORAGE_KEY_LITE = "lay-n-go-lite-18-callout-layout-v19";
const LAYOUT_SYNC_EVENT_LITE = "lay-n-go-lite-18-callout-layout";

const STORAGE_KEY_DEFENDER_MINI = "lay-n-go-defender-mini-16-callout-layout-v3";
const LAYOUT_SYNC_EVENT_DEFENDER_MINI = "lay-n-go-defender-mini-16-callout-layout";

const STORAGE_KEY_DEFENDER_TACTICAL = "lay-n-go-tactical-bag-20-callout-layout-v4";
const LAYOUT_SYNC_EVENT_DEFENDER_TACTICAL = "lay-n-go-tactical-bag-20-callout-layout";

/** Circular diagram callouts: thin white rim + black drop shadow. Use on outer wrapper; inner needs `overflow-hidden rounded-full` for the image. */
export const CALLOUT_THUMB_SHADOW =
  "rounded-full bg-white p-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.32),0_5px_16px_rgba(0,0,0,0.26)]";

export const CALLOUT_THUMB_INNER_CLIP = "relative h-full w-full overflow-hidden rounded-full";

export type LayNGoCalloutDiagramVariant =
  | "large-60"
  | "lifestyle-44"
  | "lite-18"
  | "defender-mini-16"
  | "defender-tactical-20";

/** ~20px on a typical md stage, as 0–100 viewBox deltas (see `preserveAspectRatio="none"`). */
const LIFESTYLE_MESH_POCKET_DX_20PX = 2.65;
/** ~20px × 2 closer vertically on ~768px stage (y half-delta per pocket dot, 0–100 space). */
const LIFESTYLE_MESH_POCKET_DY_HALF_20PX = 1.33 + (20 / 768) * 100 * 0.5;

type CalloutKey = "cord" | "lip" | "mesh" | "handle";

/** Lite 18″ detail assets have extra padding — zoom so handle, cord/pocket, and lip fill the circle. */
const LITE_18_THUMB_CROP: Partial<Record<CalloutKey, string>> = {
  handle: "origin-center scale-[1.55] object-cover object-center",
  cord: "origin-center scale-[1.4] object-cover object-[50%_58%]",
  lip: "origin-center scale-[1.42] object-cover object-[34%_center]",
};

function lite18ThumbCropClass(calloutKey: CalloutKey) {
  return LITE_18_THUMB_CROP[calloutKey] ?? "object-cover object-center";
}

function matProductImgClass(variant: LayNGoCalloutDiagramVariant, ...extra: (string | false | undefined)[]) {
  if (variant === "lite-18") return cn(LAY_NGO_LITE_PRODUCT_IMAGE_CLASS, ...extra);
  if (variant === "lifestyle-44") return cn(LAY_NGO_LIFESTYLE_PRODUCT_IMAGE_CLASS, ...extra);
  return cn(...extra);
}

type Pt = { x: number; y: number };

type LayoutState = {
  dots: Record<CalloutKey, Pt>;
  anchors: Record<CalloutKey, Pt>;
};

const DEFAULT_LAYOUT: LayoutState = {
  dots: {
    cord: { x: 50, y: 23 },
    lip: { x: 27, y: 49 },
    mesh: { x: 52, y: 70 },
    handle: { x: 50, y: 14 },
  },
  anchors: {
    cord: { x: 50, y: 10 },
    lip: { x: 12, y: 48 },
    mesh: { x: 86, y: 46 },
    handle: { x: 50, y: 4 },
  },
};

/** ~75px vertically on a ~768px-tall stage, as 0–100 y delta. */
const LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY = (75 / 768) * 100;

/** ~50px left on a typical md stage, as 0–100 viewBox x delta. */
const LIFESTYLE_LIP_DOT_DX_50PX = 5.55;

/**
 * Lifestyle desktop stage is wider than the hero mat (mat centered in stage).
 * Defaults use stage-space 0–100; mat-local x converts via `lifestyleStageXFromMatPercent`.
 */
const LIFESTYLE_STAGE_MAT_WIDTH_PCT = (624 / 1280) * 100;
const LIFESTYLE_STAGE_MAT_MARGIN_PCT = (100 - LIFESTYLE_STAGE_MAT_WIDTH_PCT) / 2;

function lifestyleStageXFromMatPercent(matX: number) {
  return LIFESTYLE_STAGE_MAT_MARGIN_PCT + (matX / 100) * LIFESTYLE_STAGE_MAT_WIDTH_PCT;
}

/** Lip / mesh callout centers — deep in left/right whitespace (≈28% into each gutter at max stage). */
const LIFESTYLE_LIP_ANCHOR_X = LIFESTYLE_STAGE_MAT_MARGIN_PCT * 0.28;
const LIFESTYLE_MESH_ANCHOR_X = 100 - LIFESTYLE_STAGE_MAT_MARGIN_PCT * 0.28;

/** Lifestyle defaults: cord/lip/mesh tuned for 44″ hero + callout edit mode. */
const DEFAULT_LAYOUT_LIFESTYLE: LayoutState = {
  dots: {
    cord: { x: 50, y: -4 + LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY },
    lip: {
      x: lifestyleStageXFromMatPercent(24 - LIFESTYLE_LIP_DOT_DX_50PX + LIFESTYLE_MESH_POCKET_DX_20PX),
      y: 49,
    },
    mesh: { x: lifestyleStageXFromMatPercent(52), y: 50 },
    handle: DEFAULT_LAYOUT.dots.handle,
  },
  anchors: {
    cord: { x: 50, y: -26 + LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY },
    lip: { x: LIFESTYLE_LIP_ANCHOR_X, y: 48 },
    mesh: { x: LIFESTYLE_MESH_ANCHOR_X, y: 46 },
    handle: DEFAULT_LAYOUT.anchors.handle,
  },
};

/** ~10px left on the same width scale as `LIFESTYLE_MESH_POCKET_DX_20PX`, for Lite lip mat dot. */
const LITE_LIP_DOT_DX_10PX = (LIFESTYLE_MESH_POCKET_DX_20PX / 20) * 10;

/** Lite 18″: cord/mesh thumbnail anchors swapped vs Lifestyle; lip mat dot nudged for 18″ hero. Cord dot on 6 o'clock drawstring (container %, not image file %). */
const DEFAULT_LAYOUT_LITE: LayoutState = {
  dots: {
    handle: { x: 50, y: 28 },
    cord: { x: 50, y: 79 },
    mesh: { ...DEFAULT_LAYOUT_LIFESTYLE.dots.mesh },
    lip: { x: 31 - LITE_LIP_DOT_DX_10PX, y: 49 },
  },
  anchors: {
    handle: { x: 50, y: 8 },
    cord: { x: DEFAULT_LAYOUT_LIFESTYLE.anchors.mesh.x, y: DEFAULT_LAYOUT_LIFESTYLE.anchors.lip.y },
    mesh: { ...DEFAULT_LAYOUT_LIFESTYLE.anchors.cord },
    lip: { x: DEFAULT_LAYOUT_LIFESTYLE.anchors.lip.x, y: DEFAULT_LAYOUT_LIFESTYLE.anchors.lip.y + 6 },
  },
};

const ALL_CALLOUT_KEYS: CalloutKey[] = ["cord", "lip", "mesh"];
const MOBILE_CALLOUT_KEYS: CalloutKey[] = ["cord", "mesh", "lip"];

/** Defender PDPs use fixed hero callout stages instead of draggable cord/lip/mesh layout. */
function usesFixedDefenderCalloutStage(variant: LayNGoCalloutDiagramVariant) {
  return variant === "defender-mini-16" || variant === "defender-tactical-20";
}

function isDefenderDiagramVariant(variant: LayNGoCalloutDiagramVariant) {
  return usesFixedDefenderCalloutStage(variant);
}

function calloutKeysForVariant(variant: LayNGoCalloutDiagramVariant): CalloutKey[] {
  if (isDefenderDiagramVariant(variant)) return [];
  return variant === "lite-18" ? ["handle", "cord", "lip"] : ALL_CALLOUT_KEYS;
}

function mobileCalloutKeysForVariant(variant: LayNGoCalloutDiagramVariant): CalloutKey[] {
  if (isDefenderDiagramVariant(variant)) return [];
  return variant === "lite-18" ? ["cord", "lip"] : MOBILE_CALLOUT_KEYS;
}

function diagramUsesLifestyleChrome(variant: LayNGoCalloutDiagramVariant) {
  return variant === "lifestyle-44" || variant === "lite-18" || usesFixedDefenderCalloutStage(variant);
}

/** Mat/diagram stage — Lifestyle, Lite, and Defender match site `bg-background`. */
function diagramMatSurfaceBg(variant: LayNGoCalloutDiagramVariant) {
  return variant === "lifestyle-44" ||
    variant === "lite-18" ||
    variant === "defender-mini-16" ||
    variant === "defender-tactical-20"
    ? "bg-background"
    : "bg-white";
}

const CALLOUT_META: Record<
  CalloutKey,
  { imageSrc: string; imageAlt: string; label: string; textAbove: boolean }
> = {
  cord: {
    imageSrc: CALLOUT_CORD,
    imageAlt: "Cord lock, braided drawstring, and handle on Lay-n-Go",
    label: "Cord lock, cord pocket, and handle",
    textAbove: true,
  },
  lip: {
    imageSrc: CALLOUT_LIP,
    imageAlt: "Reinforced strap and raised containment edge on Lay-n-Go",
    label: "Convenient containment lip",
    textAbove: false,
  },
  mesh: {
    imageSrc: CALLOUT_MESH,
    imageAlt: "Mesh pockets on the Lay-n-Go mat interior",
    label: "4 mesh pockets to hold special pieces",
    textAbove: false,
  },
  handle: {
    imageSrc: CALLOUT_HANDLE_LITE,
    imageAlt: "Built-in carry handle on Lay-n-Go Lite",
    label: "Built in handle",
    textAbove: true,
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sanitizeLiteLayout(layout: LayoutState, fallback: LayoutState): LayoutState {
  const clampY = (pt: Pt, min: number, max: number) => ({
    ...pt,
    y: Math.max(min, Math.min(max, pt.y)),
  });
  return {
    dots: {
      ...layout.dots,
      handle: clampY(layout.dots.handle ?? fallback.dots.handle, 24, 34),
    },
    anchors: {
      ...layout.anchors,
      handle: clampY(layout.anchors.handle ?? fallback.anchors.handle, 6, 11),
    },
  };
}

function loadLayout(storageKey: string, fallback: LayoutState = DEFAULT_LAYOUT): LayoutState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LayoutState>;
    const dots: Partial<Record<CalloutKey, Pt>> = parsed.dots ?? {};
    const anchors: Partial<Record<CalloutKey, Pt>> = parsed.anchors ?? {};
    const merged: LayoutState = {
      dots: {
        cord: dots.cord ?? fallback.dots.cord,
        lip: dots.lip ?? fallback.dots.lip,
        mesh: dots.mesh ?? fallback.dots.mesh,
        handle: dots.handle ?? fallback.dots.handle,
      },
      anchors: {
        cord: anchors.cord ?? fallback.anchors.cord,
        lip: anchors.lip ?? fallback.anchors.lip,
        mesh: anchors.mesh ?? fallback.anchors.mesh,
        handle: anchors.handle ?? fallback.anchors.handle,
      },
    };
    return storageKey === STORAGE_KEY_LITE ? sanitizeLiteLayout(merged, fallback) : merged;
  } catch {
    return fallback;
  }
}

/** Shorten line end toward dot so it meets the circle edge (0–100 space, ~approx). */
function shortenToward(ax: number, ay: number, tx: number, ty: number, radius: number) {
  const dx = tx - ax;
  const dy = ty - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return { x: ax + ux * radius, y: ay + uy * radius };
}

/** Unit vector from A toward B (viewBox 0–100). */
function unitToward(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function rotateVec(ux: number, uy: number, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return { x: ux * c - uy * s, y: ux * s + uy * c };
}

function diagramConfig(variant: LayNGoCalloutDiagramVariant) {
  if (variant === "lifestyle-44") {
    return {
      storageKey: STORAGE_KEY_LIFESTYLE,
      layoutEvent: LAYOUT_SYNC_EVENT_LIFESTYLE,
      heroSrc: HERO_CALLOUT_LIFESTYLE,
      heroAlt:
        "Lay-n-Go Lifestyle 44 inch backpack activity play mat from above with building blocks, mesh pockets, and straps",
      diameterInches: 44,
      containerMinHClass: "min-h-[min(62vh,624px)]",
      heroWidthClass: "w-[min(64vw,624px)]",
      /** Below hero in document flow on desktop (see lifestyle stage layout). */
      dimensionWrapClass:
        "relative z-30 mx-auto mt-3 w-[min(64vw,624px)] pb-8 sm:mt-4 md:pb-10",
      mobileHeroMaxClass: "max-w-[min(82vw,23rem)]",
      meshCalloutSrc: CALLOUT_MESH_LIFESTYLE,
      lipCalloutSrc: CALLOUT_LIP_LIFESTYLE,
      cordCalloutSrc: CALLOUT_CORD_LIFESTYLE,
      handleCalloutSrc: undefined,
    };
  }
  if (variant === "defender-mini-16") {
    return {
      storageKey: STORAGE_KEY_DEFENDER_MINI,
      layoutEvent: LAYOUT_SYNC_EVENT_DEFENDER_MINI,
      heroSrc: HERO_CALLOUT_DEFENDER_MINI,
      heroAlt:
        "Lay-n-Go Defender Mini 16 inch tactical mat from above with everyday carry gear organized on olive drab fabric",
      diameterInches: 16,
      containerMinHClass: "min-h-[min(92vh,920px)]",
      heroWidthClass: "w-[min(94vw,920px)]",
      /** Below hero — positive margin so 16″ bracket clears the mat/drawstring. */
      dimensionWrapClass:
        "relative z-20 mx-auto mt-5 w-full max-w-5xl pt-1 pb-4 sm:mt-6 sm:pb-5 md:mt-8 md:pb-6",
      mobileHeroMaxClass: "max-w-[min(96vw,36rem)]",
      meshCalloutSrc: CALLOUT_MESH,
      lipCalloutSrc: CALLOUT_LIP,
      cordCalloutSrc: CALLOUT_CORD,
      handleCalloutSrc: undefined,
    };
  }
  if (variant === "defender-tactical-20") {
    return {
      storageKey: STORAGE_KEY_DEFENDER_TACTICAL,
      layoutEvent: LAYOUT_SYNC_EVENT_DEFENDER_TACTICAL,
      heroSrc: HERO_CALLOUT_DEFENDER_TACTICAL,
      heroAlt:
        "Lay-n-Go Defender Tactical 20 inch bag from above, open flat with mesh pockets and everyday carry gear on olive drab fabric",
      diameterInches: 20,
      containerMinHClass: "min-h-[min(92vh,920px)]",
      heroWidthClass: "w-[min(94vw,920px)]",
      /** Below hero — same spacing as Defender Mini. */
      dimensionWrapClass:
        "relative z-20 mx-auto mt-5 w-full max-w-5xl pt-1 pb-4 sm:mt-6 sm:pb-5 md:mt-8 md:pb-6",
      mobileHeroMaxClass: "max-w-[min(96vw,36rem)]",
      meshCalloutSrc: CALLOUT_MESH,
      lipCalloutSrc: CALLOUT_LIP,
      cordCalloutSrc: CALLOUT_CORD,
      handleCalloutSrc: undefined,
    };
  }
  if (variant === "lite-18") {
    return {
      storageKey: STORAGE_KEY_LITE,
      layoutEvent: LAYOUT_SYNC_EVENT_LITE,
      heroSrc: HERO_CALLOUT_LITE,
      heroAlt:
        'Lay-n-Go Lite 18" green activity mat from above with magnetic tiles, drawstring, and Lay-n-Go Lite pocket on white',
      diameterInches: 18,
      containerMinHClass: "min-h-[min(76.8vh,768px)]",
      heroWidthClass: "w-[min(75.2vw,736px)]",
      /** Bracket sits just under the mat (no overlap on drawstring); width tracks hero. */
      dimensionWrapClass:
        "relative z-20 mx-auto flex w-[min(75.2vw,736px)] flex-col items-center -mt-[1.5rem] pt-2 pb-2 sm:-mt-[1.75rem] sm:pt-3 sm:pb-3 md:-mt-[2.5rem] md:pt-4 md:pb-4 lg:-mt-[3rem] lg:pt-5 lg:pb-5",
      mobileHeroMaxClass: "max-w-[min(90vw,25.5rem)]",
      meshCalloutSrc: CALLOUT_MESH,
      lipCalloutSrc: CALLOUT_LIP_LITE,
      cordCalloutSrc: CALLOUT_CORD_LITE,
      handleCalloutSrc: CALLOUT_HANDLE_LITE,
    };
  }
  return {
    storageKey: STORAGE_KEY_LARGE,
    layoutEvent: LAYOUT_SYNC_EVENT_LARGE,
    heroSrc: HERO_CALLOUT_MAIN,
    heroAlt: "Lay-n-Go Large 60 inch activity mat from above, filled with building blocks",
    diameterInches: 60,
    containerMinHClass: "min-h-[min(96vh,960px)]",
    heroWidthClass: "w-[min(94vw,920px)]",
    dimensionWrapClass:
      "relative z-20 mx-auto -mt-[9.5rem] w-[min(94vw,920px)] pt-0 sm:-mt-40 md:-mt-48 lg:-mt-52",
    mobileHeroMaxClass: "max-w-lg",
    meshCalloutSrc: CALLOUT_MESH,
    lipCalloutSrc: CALLOUT_LIP,
    cordCalloutSrc: CALLOUT_CORD,
    handleCalloutSrc: undefined,
  };
}

/** Diameter tick + label (used on full callout diagrams and standalone, e.g. Traveler PDP). */
export type LayNGoMatDiameterVariant = LayNGoCalloutDiagramVariant | "traveler-20";

function DiameterLine({
  inches,
  className,
  variant = "large-60",
}: {
  inches: number;
  className?: string;
  variant?: LayNGoMatDiameterVariant;
}) {
  const lifestyle44 = variant === "lifestyle-44";
  const lite18 = variant === "lite-18";
  const defenderMini16 = variant === "defender-mini-16";
  const defenderTactical20 = variant === "defender-tactical-20";
  const traveler20 = variant === "traveler-20";
  const large60 = variant === "large-60";
  const lifestyleChrome =
    variant === "lifestyle-44" ||
    variant === "lite-18" ||
    defenderMini16 ||
    defenderTactical20 ||
    variant === "traveler-20";

  const bracketWidthClass = lifestyle44
    ? /** Lifestyle hero: mat fills most of the frame — bracket tracks the blue disc, not PNG width */
      "mx-auto w-[min(100%,90%)] sm:w-[min(100%,88%)] md:w-[min(100%,86%)] lg:w-[min(100%,84%)]"
    : lite18
      ? /** Lite hero: mat fills the frame — bracket spans the green disc (centered under product). */
        "mx-auto w-[min(100%,94%)] sm:w-[min(100%,93%)] md:w-[min(100%,92%)]"
      : defenderMini16
        ? /** Defender 16″ hero: mat nearly fills the frame — bracket tracks the olive disc. */
          "mx-auto w-[min(100%,88%)] sm:w-[min(100%,86%)] md:w-[min(100%,84%)] lg:w-[min(100%,82%)]"
        : defenderTactical20
          ? /** Defender 20″ hero: mat nearly fills the frame — bracket tracks the olive disc. */
            "mx-auto w-[min(100%,90%)] sm:w-[min(100%,88%)] md:w-[min(100%,86%)] lg:w-[min(100%,84%)]"
    : traveler20
      ? /** Traveler callout hero — mat nearly full width; mobile vs md+ tuned separately */
        "mx-auto w-[min(100%,93%)] sm:w-[min(100%,91%)] md:w-[min(100%,88%)] lg:w-[min(100%,85%)]"
    : large60
      ? /** Large hero: mat is inset in the PNG — bracket must match the blue disc, not the full image width */
        "mx-auto w-[min(100%,58%)] sm:w-[min(100%,60%)] md:w-[min(100%,62%)] lg:w-[min(100%,61%)]"
      : "w-full max-w-md sm:max-w-lg";

  return (
    <div className={cn("flex w-full flex-col items-center px-2", className)}>
      <div className={cn("flex items-end justify-center", bracketWidthClass)}>
        <div
          className={cn(
            "w-px shrink-0 bg-neutral-900",
            lifestyle44 ? "h-7 sm:h-8 md:h-9" : "h-10 sm:h-12 md:h-14",
          )}
          aria-hidden
        />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div
          className={cn(
            "w-px shrink-0 bg-neutral-900",
            lifestyle44 ? "h-7 sm:h-8 md:h-9" : "h-10 sm:h-12 md:h-14",
          )}
          aria-hidden
        />
      </div>
      <p
        className={cn(
          "relative z-30 shrink-0 font-heading font-semibold tabular-nums text-neutral-900",
          lifestyle44 && "mt-3 text-xl sm:mt-3.5 sm:text-2xl",
          lifestyleChrome &&
            !lifestyle44 &&
            !lite18 &&
            !defenderMini16 &&
            !defenderTactical20 &&
            "mt-2 text-xl sm:text-2xl",
          lite18 && "mt-3 text-2xl sm:mt-3.5 sm:text-[1.65rem]",
          (defenderMini16 || defenderTactical20) && "mt-1.5 text-xl sm:mt-2 sm:text-2xl",
          !lifestyleChrome && "mt-1 text-lg sm:text-xl",
        )}
      >
        {`${inches}\u2033`}
      </p>
    </div>
  );
}

/** Standalone mat diameter graphic (open flat), matching diagram styling. */
export function LayNGoMatDiameterLine({
  inches,
  className,
  variant = "traveler-20",
}: {
  inches: number;
  className?: string;
  variant?: LayNGoMatDiameterVariant;
}) {
  return (
    <div aria-label={`${inches} inch diameter when laid flat`}>
      <DiameterLine inches={inches} className={className} variant={variant} />
    </div>
  );
}

function DefenderTacticalLeaderPair({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#0a0a0a"
        strokeWidth={DEFENDER_TACTICAL_LEADER_OUTER}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={DEFENDER_TACTICAL_LEADER_INNER}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

function DefenderTacticalMatDot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={DEFENDER_TACTICAL_DOT_R}
      fill="#ffffff"
      stroke="#0a0a0a"
      strokeWidth={DEFENDER_TACTICAL_DOT_STROKE}
      vectorEffect="non-scaling-stroke"
    />
  );
}

const DEFENDER_CALLOUT_THUMB_FRAME = "relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 md:h-28 md:w-28";

function DefenderHeroCalloutThumb({
  src,
  alt,
  imageClassName,
}: {
  src: string;
  alt: string;
  imageClassName: string;
}) {
  return (
    <div className={cn(DEFENDER_CALLOUT_THUMB_FRAME, CALLOUT_THUMB_SHADOW)}>
      <div className={CALLOUT_THUMB_INNER_CLIP}>
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full", imageClassName)}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function DefenderHeroCalloutCluster({
  label,
  labelAbove,
  thumbSrc,
  thumbAlt,
  thumbClassName,
  className,
  style,
  editorMode,
  onPointerDown,
}: DefenderHeroCalloutItem & {
  className?: string;
  style?: React.CSSProperties;
  editorMode?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  const labelEl = (
    <p className="font-heading text-[0.62rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.72rem] md:text-xs">
      {label}
    </p>
  );

  return (
    <div
      className={cn(
        "absolute z-20 flex flex-col items-center text-center",
        className,
        editorMode && "z-[100] cursor-grab touch-none rounded-lg ring-2 ring-amber-400/90 ring-offset-2 ring-offset-background",
      )}
      style={style}
      onPointerDown={onPointerDown}
    >
      {labelAbove ? (
        <>
          <div className="mb-2">{labelEl}</div>
          <DefenderHeroCalloutThumb src={thumbSrc} alt={thumbAlt} imageClassName={thumbClassName} />
        </>
      ) : (
        <>
          <DefenderHeroCalloutThumb src={thumbSrc} alt={thumbAlt} imageClassName={thumbClassName} />
          <div className="mt-2">{labelEl}</div>
        </>
      )}
    </div>
  );
}

type DefenderLeaderDragJoint = "callout" | "mat" | null;

function DefenderArrowEditorOverlay({
  activeLeaderKey,
  leader,
  stageRef,
  viewBox,
  onPatchLeader,
}: {
  activeLeaderKey: string;
  leader: DefenderLeaderEnd;
  stageRef: React.RefObject<HTMLDivElement | null>;
  viewBox: string;
  onPatchLeader: (patch: Partial<DefenderLeaderEnd>) => void;
}) {
  const dragJointRef = useRef<DefenderLeaderDragJoint>(null);
  const [stageTick, setStageTick] = useState(0);

  useLayoutEffect(() => {
    const sync = () => setStageTick((n) => n + 1);
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [stageRef, leader, viewBox]);

  const applyClientPointer = useCallback(
    (clientX: number, clientY: number) => {
      const joint = dragJointRef.current;
      if (!joint || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const p = clientToViewBoxPoint(clientX, clientY, r, viewBox);
      if (joint === "callout") onPatchLeader({ x1: p.x, y1: p.y });
      else onPatchLeader({ x2: p.x, y2: p.y });
    },
    [onPatchLeader, stageRef, viewBox],
  );

  void stageTick;
  const stageRect = stageRef.current?.getBoundingClientRect();
  if (!stageRect) return null;

  const joints: { joint: DefenderLeaderDragJoint; label: string; point: { x: number; y: number }; dotClass: string }[] =
    [
      { joint: "callout", label: "Callout end (1)", point: { x: leader.x1, y: leader.y1 }, dotClass: "bg-blue-500" },
      { joint: "mat", label: "Mat dot (2)", point: { x: leader.x2, y: leader.y2 }, dotClass: "bg-rose-500" },
    ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[80] overflow-visible">
      <span className="pointer-events-none absolute left-2 top-2 z-[90] rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-950 shadow-sm ring-1 ring-amber-300">
        Editing: {activeLeaderKey} — drag blue and rose handles
      </span>
      {joints.map(({ joint, label, point, dotClass }) => {
        const pos = viewBoxPointToStagePos(point, stageRect, viewBox);
        return (
          <div
            key={joint}
            role="button"
            tabIndex={0}
            title={label}
            aria-label={label}
            className="pointer-events-auto absolute z-[90] flex touch-none cursor-grab flex-col items-center p-3 active:cursor-grabbing"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragJointRef.current = joint;
              const move = (ev: PointerEvent) => applyClientPointer(ev.clientX, ev.clientY);
              const up = () => {
                dragJointRef.current = null;
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
              applyClientPointer(e.clientX, e.clientY);
            }}
          >
            <span className="mb-0.5 whitespace-nowrap rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-800 shadow-sm ring-1 ring-neutral-200">
              {label}
            </span>
            <span
              className={cn(
                "block h-9 w-9 shrink-0 rounded-full border-2 border-white shadow-lg ring-2 ring-amber-400/80",
                dotClass,
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

function EditableDefenderCalloutStage({
  variant,
  heroSrc,
  heroAlt,
  layout,
  onLayoutChange,
  editorMode,
  activeLeaderKey,
}: {
  variant: "defender-mini-16" | "defender-tactical-20";
  heroSrc: string;
  heroAlt: string;
  layout: DefenderLayoutState;
  onLayoutChange: (next: DefenderLayoutState) => void;
  editorMode: boolean;
  activeLeaderKey: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const vb =
    variant === "defender-mini-16" ? DEFENDER_MINI_CALLOUT_VB : DEFENDER_TACTICAL_CALLOUT_VB;
  const viewBox = `0 0 ${vb.w} ${vb.h}`;
  const calloutSpecs =
    variant === "defender-mini-16" ? DEFENDER_MINI_CALLOUTS : DEFENDER_TACTICAL_CALLOUTS;

  const patchLeader = (key: string, patch: Partial<DefenderLeaderEnd>) => {
    onLayoutChange({
      ...layout,
      leaders: { ...layout.leaders, [key]: { ...layout.leaders[key], ...patch } },
    });
  };

  const patchCallout = (key: string, x: number, y: number) => {
    onLayoutChange({
      ...layout,
      callouts: {
        ...layout.callouts,
        [key]: { ...layout.callouts[key], x, y },
      },
    });
  };

  const activeLeader = layout.leaders[activeLeaderKey];

  return (
    <div
      className={cn(
        "mx-auto w-full bg-background",
        DEFENDER_CALLOUT_STAGE_MAX_W,
        editorMode && "overflow-visible",
      )}
    >
      <div
        ref={stageRef}
        className={cn(
          "relative mx-auto overflow-visible",
          variant === "defender-tactical-20" ? "w-[58.59375%]" : "w-full",
        )}
      >
      <img
        src={heroSrc}
        alt={heroAlt}
        className={cn("block h-auto w-full object-contain mix-blend-multiply")}
        width={vb.w}
        height={vb.h}
        loading="lazy"
        decoding="async"
      />

      <svg
        className={cn(
          "absolute inset-0 z-10 h-full w-full",
          editorMode ? "pointer-events-none" : "pointer-events-none",
        )}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {Object.entries(layout.leaders).map(([key, leader]) => (
          <g key={key} opacity={editorMode && key !== activeLeaderKey ? 0.28 : 1}>
            <DefenderTacticalLeaderPair x1={leader.x1} y1={leader.y1} x2={leader.x2} y2={leader.y2} />
            <DefenderTacticalMatDot cx={leader.x2} cy={leader.y2} />
          </g>
        ))}
      </svg>

      {editorMode && activeLeader ? (
        <DefenderArrowEditorOverlay
          activeLeaderKey={activeLeaderKey}
          leader={activeLeader}
          stageRef={stageRef}
          viewBox={viewBox}
          onPatchLeader={(patch) => patchLeader(activeLeaderKey, patch)}
        />
      ) : null}

      {calloutSpecs.map((spec) => {
        const pos = layout.callouts[spec.key];
        if (!pos) return null;
        return (
          <DefenderHeroCalloutCluster
            key={spec.key}
            {...spec}
            editorMode={editorMode}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: defenderCalloutTransform(pos.anchor),
            }}
            onPointerDown={
              editorMode
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const stage = stageRef.current;
                    if (!stage) return;
                    const move = (ev: PointerEvent) => {
                      const r = stage.getBoundingClientRect();
                      const x = ((ev.clientX - r.left) / r.width) * 100;
                      const y = ((ev.clientY - r.top) / r.height) * 100;
                      patchCallout(spec.key, x, y);
                    };
                    const up = () => {
                      window.removeEventListener("pointermove", move);
                      window.removeEventListener("pointerup", up);
                    };
                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                  }
                : undefined
            }
          />
        );
      })}
      </div>
    </div>
  );
}

function FloatingCallout({
  calloutKey,
  layout,
  editorMode,
  onAnchorPointerDown,
  imageSrcOverride,
  variant = "large-60",
}: {
  calloutKey: CalloutKey;
  layout: LayoutState;
  editorMode: boolean;
  onAnchorPointerDown: (e: React.PointerEvent, key: CalloutKey) => void;
  imageSrcOverride?: string;
  variant?: LayNGoCalloutDiagramVariant;
}) {
  const { imageSrc, textAbove: metaTextAbove } = CALLOUT_META[calloutKey];
  const label = CALLOUT_META[calloutKey].label;
  const thumbAlt = CALLOUT_META[calloutKey].imageAlt;
  const thumbSrc = imageSrcOverride ?? imageSrc;
  const { x, y: anchorY } = layout.anchors[calloutKey];
  const liteHandle = variant === "lite-18" && calloutKey === "handle";
  const y = liteHandle ? Math.max(6, Math.min(11, anchorY)) : anchorY;
  const lifestyleThumb = diagramUsesLifestyleChrome(variant);
  /** Lifestyle 44″ only — Lite uses full-size cord thumb and lip-like stacking (see `textAbove`). */
  const cordLifestyleCompact = lifestyleThumb && calloutKey === "cord" && variant !== "lite-18";
  const lite18Thumb = variant === "lite-18";
  const textAbove = variant === "lite-18" && calloutKey === "cord" ? false : metaTextAbove;
  const lipLifestyleTightCrop = lifestyleThumb && calloutKey === "lip" && variant !== "lite-18";
  const meshLifestyleTightCrop = lifestyleThumb && calloutKey === "mesh";

  const thumbCropClass = (() => {
    if (lite18Thumb) return lite18ThumbCropClass(calloutKey);
    if (cordLifestyleCompact) return "origin-center scale-[1.26] object-[center_18%]";
    if (lipLifestyleTightCrop) return "origin-center scale-[1.24] object-[30%_center]";
    if (meshLifestyleTightCrop) return "origin-center scale-[1.24] object-[58%_center]";
    return "";
  })();

  const text = (
    <p className="max-w-[13rem] text-center font-heading text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:max-w-[15rem] sm:text-xs md:text-sm">
      {label}
    </p>
  );

  const thumb = (
    <div
      className={cn(
        "aspect-square shrink-0",
        cordLifestyleCompact
          ? "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
          : "h-[7.25rem] w-[7.25rem] sm:h-32 sm:w-32 md:h-40 md:w-40",
        CALLOUT_THUMB_SHADOW,
      )}
    >
      <div className={CALLOUT_THUMB_INNER_CLIP}>
        <img
          src={thumbSrc}
          alt={thumbAlt}
          className={cn(
            "h-full w-full object-cover object-center",
            matProductImgClass(variant),
            thumbCropClass,
          )}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "absolute z-20 flex flex-col items-center",
        liteHandle ? "-translate-x-1/2" : "-translate-x-1/2 -translate-y-1/2",
        cordLifestyleCompact ? "gap-1" : "gap-2",
        editorMode
          ? "cursor-grab touch-none pointer-events-auto active:cursor-grabbing"
          : "pointer-events-none",
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
      onPointerDown={(e) => editorMode && onAnchorPointerDown(e, calloutKey)}
    >
      {textAbove ? (
        <>
          {text}
          {cordLifestyleCompact ? (
            <>
              <div className="h-2.5 w-px shrink-0 bg-neutral-900 sm:h-3" aria-hidden />
              <div className="relative shrink-0">
                {thumb}
                <div
                  className="pointer-events-none absolute left-1/2 top-0 z-[5] w-px -translate-x-1/2 bg-neutral-900"
                  style={{ bottom: "calc(14% + 10px)" }}
                  aria-hidden
                />
              </div>
            </>
          ) : (
            thumb
          )}
        </>
      ) : (
        <>
          {thumb}
          {text}
        </>
      )}
      {editorMode ? (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-950">Drag callout</span>
      ) : null}
    </div>
  );
}

function DefenderCalloutEditorToolbar({
  getLayout,
  storageKey,
  layoutSyncEvent,
  leaderKeys,
  activeLeaderKey,
  onActiveLeaderKeyChange,
}: {
  getLayout: () => DefenderLayoutState;
  storageKey: string;
  layoutSyncEvent: string;
  leaderKeys: readonly string[];
  activeLeaderKey: string;
  onActiveLeaderKeyChange: (key: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(getLayout()));
      window.dispatchEvent(new Event(layoutSyncEvent));
      toast.success("Saved Defender diagram in this browser");
    } catch {
      toast.error("Could not save");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getLayout(), null, 2));
      toast.success("Copied layout JSON");
    } catch {
      toast.error("Clipboard unavailable");
    }
  };

  const done = () => {
    const params = new URLSearchParams(location.search);
    params.delete("editLargeCallouts");
    const s = params.toString();
    navigate({ pathname: location.pathname, search: s ? `?${s}` : "" }, { replace: true });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-amber-200/90 bg-amber-50/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:left-1/2 md:right-auto md:mx-auto md:w-[min(100%,42rem)] md:-translate-x-1/2 md:rounded-t-xl md:border-x md:border-t">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <label className="flex items-center gap-2 text-xs font-medium text-neutral-800">
          Arrow
          <select
            value={activeLeaderKey}
            onChange={(e) => onActiveLeaderKeyChange(e.target.value)}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs"
          >
            {leaderKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" size="sm" onClick={save}>
          Save layout
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={copy}>
          Copy JSON
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={done}>
          Done editing
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag callout circles (amber ring) to reposition. Pick an arrow to adjust leader lines with blue/rose handles.
        Save layout or copy JSON to bake into defaults.
      </p>
    </div>
  );
}

function LargeCalloutEditorToolbar({
  getLayout,
  storageKey,
  layoutSyncEvent,
}: {
  getLayout: () => LayoutState;
  storageKey: string;
  layoutSyncEvent: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(getLayout()));
      window.dispatchEvent(new Event(layoutSyncEvent));
      toast.success("Saved layout in this browser");
    } catch {
      toast.error("Could not save");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getLayout(), null, 2));
      toast.success("Copied layout JSON");
    } catch {
      toast.error("Clipboard unavailable");
    }
  };

  const done = () => {
    const params = new URLSearchParams(location.search);
    params.delete("editLargeCallouts");
    const s = params.toString();
    navigate({ pathname: location.pathname, search: s ? `?${s}` : "" }, { replace: true });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-amber-200/90 bg-amber-50/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:left-1/2 md:right-auto md:mx-auto md:w-[min(100%,42rem)] md:-translate-x-1/2 md:rounded-t-xl md:border-x md:border-t">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" size="sm" onClick={save}>
          Save layout
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={copy}>
          Copy JSON
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={done}>
          Done editing
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag white dots on the mat and drag callout photos. Save, or paste JSON into the codebase later.
      </p>
    </div>
  );
}

type LayNGoLargeCalloutDiagramProps = {
  variant?: LayNGoCalloutDiagramVariant;
};

export function LayNGoLargeCalloutDiagram({ variant = "large-60" }: LayNGoLargeCalloutDiagramProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editorMode = searchParams.get("editLargeCallouts") === "1" || searchParams.get("editLargeCallouts") === "true";

  const config = useMemo(() => diagramConfig(variant), [variant]);
  const lite18 = variant === "lite-18";
  const lifestyle44 = variant === "lifestyle-44";
  const isDefenderVariant = isDefenderDiagramVariant(variant);
  const defenderVariant = variant as "defender-mini-16" | "defender-tactical-20";
  const defenderLeaderKeys = useMemo(
    () => (isDefenderVariant ? defenderLeaderKeysForVariant(defenderVariant) : []),
    [isDefenderVariant, defenderVariant],
  );
  const defenderFallback = useMemo(
    () => (isDefenderVariant ? defenderLayoutForVariant(defenderVariant) : null),
    [isDefenderVariant, defenderVariant],
  );

  const [defenderLayout, setDefenderLayout] = useState<DefenderLayoutState>(
    () => defenderFallback ?? defenderLayoutForVariant("defender-mini-16"),
  );
  const [defenderEditKey, setDefenderEditKey] = useState(defenderLeaderKeys[0] ?? "lip");
  const defenderLayoutRef = useRef(defenderLayout);
  defenderLayoutRef.current = defenderLayout;

  const fallbackLayout = useMemo(
    () =>
      variant === "lifestyle-44"
        ? DEFAULT_LAYOUT_LIFESTYLE
        : variant === "lite-18"
          ? DEFAULT_LAYOUT_LITE
          : DEFAULT_LAYOUT,
    [variant],
  );

  const [layout, setLayout] = useState<LayoutState>(() =>
    loadLayout(diagramConfig(variant).storageKey, fallbackLayout),
  );
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: "dot" | "anchor"; key: CalloutKey } | null>(null);

  useEffect(() => {
    const sync = () => setLayout(loadLayout(config.storageKey, fallbackLayout));
    sync();
    window.addEventListener(config.layoutEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(config.layoutEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, [config.storageKey, config.layoutEvent, fallbackLayout]);

  useEffect(() => {
    if (!isDefenderVariant || !defenderFallback) return;
    const sync = () => setDefenderLayout(loadDefenderLayout(config.storageKey, defenderFallback));
    sync();
    window.addEventListener(config.layoutEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(config.layoutEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, [config.storageKey, config.layoutEvent, defenderFallback, isDefenderVariant]);

  useEffect(() => {
    if (defenderLeaderKeys.length && !defenderLeaderKeys.includes(defenderEditKey)) {
      setDefenderEditKey(defenderLeaderKeys[0]);
    }
  }, [defenderLeaderKeys, defenderEditKey]);

  const lineEnds = useMemo(() => {
    const R = 5.5;
    return calloutKeysForVariant(variant).map((k) => {
      const d = layout.dots[k];
      const a = layout.anchors[k];
      const end = shortenToward(a.x, a.y, d.x, d.y, R);
      if (k === "mesh") {
        // Two pocket touch-points on the mat → two rim points on the callout circle.
        let meshUpperStart: Pt;
        let meshLowerStart: Pt;
        if (diagramUsesLifestyleChrome(variant)) {
          meshUpperStart = {
            x: d.x - 5 + LIFESTYLE_MESH_POCKET_DX_20PX,
            y: d.y - 36 + LIFESTYLE_MESH_POCKET_DY_HALF_20PX,
          };
          meshLowerStart = {
            x: d.x - 5 + LIFESTYLE_MESH_POCKET_DX_20PX,
            y: d.y + 36 - LIFESTYLE_MESH_POCKET_DY_HALF_20PX,
          };
        } else {
          meshUpperStart = { x: d.x + 0.25, y: d.y - 42 };
          meshLowerStart = { x: d.x + 1.2, y: d.y - 2 };
        }
        const toward = unitToward(a.x, a.y, d.x, d.y);
        const spread = (7 * Math.PI) / 180;
        const uU = rotateVec(toward.x, toward.y, spread);
        const uL = rotateVec(toward.x, toward.y, -spread);
        const meshUpperEnd = { x: a.x + uU.x * R, y: a.y + uU.y * R };
        const meshLowerEnd = { x: a.x + uL.x * R, y: a.y + uL.y * R };
        return {
          k,
          x1: d.x,
          y1: d.y,
          x2: end.x,
          y2: end.y,
          meshUpperStart,
          meshLowerStart,
          meshUpperEnd,
          meshLowerEnd,
        };
      }
      return { k, x1: d.x, y1: d.y, x2: end.x, y2: end.y };
    });
  }, [layout, variant]);

  const onPointerMove = useCallback(
    (ev: React.PointerEvent) => {
      const drag = dragRef.current;
      const el = containerRef.current;
      if (!drag || !el) return;
      const r = el.getBoundingClientRect();
      const x = clamp(((ev.clientX - r.left) / r.width) * 100, 0, 100);
      const y = clamp(((ev.clientY - r.top) / r.height) * 100, 0, 100);
      setLayout((prev) => {
        if (drag.kind === "dot") {
          return { ...prev, dots: { ...prev.dots, [drag.key]: { x, y } } };
        }
        return { ...prev, anchors: { ...prev.anchors, [drag.key]: { x, y } } };
      });
    },
    [],
  );

  const endDrag = useCallback((e?: React.PointerEvent) => {
    if (e?.pointerId != null && containerRef.current?.releasePointerCapture) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        /* not capturing */
      }
    }
    dragRef.current = null;
  }, []);

  const onDotPointerDown = (e: React.PointerEvent, key: CalloutKey) => {
    if (!editorMode) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { kind: "dot", key };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onAnchorPointerDown = (e: React.PointerEvent, key: CalloutKey) => {
    if (!editorMode) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { kind: "anchor", key };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const toggleDefenderEditor = () => {
    const params = new URLSearchParams(location.search);
    const next = !editorMode;
    if (next) params.set("editLargeCallouts", "1");
    else params.delete("editLargeCallouts");
    const s = params.toString();
    navigate({ pathname: location.pathname, search: s ? `?${s}` : "" }, { replace: true });
    if (next && defenderFallback) {
      setDefenderLayout(loadDefenderLayout(config.storageKey, defenderFallback));
    }
  };

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl",
        variant === "lite-18" ? "pt-4 sm:pt-6" : "pt-12 sm:pt-14",
        variant === "defender-mini-16" || variant === "defender-tactical-20"
          ? cn("mt-8 rounded-2xl bg-background px-0 sm:mt-10 sm:px-2", editorMode && "overflow-visible")
          : variant === "lite-18"
            ? cn(
                "mt-20 rounded-2xl px-2 sm:mt-24 sm:px-4 md:mt-32 lg:mt-40",
                diagramMatSurfaceBg(variant),
              )
          : diagramUsesLifestyleChrome(variant)
            ? cn(
                "mt-[calc(3.5rem+100px)] rounded-2xl px-2 sm:mt-[calc(4rem+100px)] sm:px-4",
                diagramMatSurfaceBg(variant),
              )
            : "mt-14 sm:mt-16",
      )}
      aria-label={
        variant === "lifestyle-44"
          ? "Lay-n-Go Lifestyle product details"
          : variant === "lite-18"
            ? "Lay-n-Go Lite product details"
            : variant === "defender-mini-16"
              ? "Lay-n-Go Defender Mini product details"
              : variant === "defender-tactical-20"
                ? "Lay-n-Go Defender Tactical product details"
                : "Lay-n-Go Large product details"
      }
    >
      {editorMode && isDefenderVariant ? (
        <div className="sticky top-0 z-[250] mb-4 border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Defender diagram edit mode</strong> — drag any amber-ringed callout circle to reposition it; use
          Arrow below to pick a leader, then drag blue/rose handles. Save when finished.
        </div>
      ) : null}

      {editorMode && !usesFixedDefenderCalloutStage(variant) ? (
        <div className="sticky top-0 z-[250] mb-4 border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Callout edit mode</strong> — drag dots on the mat and drag detail photos. Then Save layout.
        </div>
      ) : null}

      {isDefenderVariant ? (
        <div className={cn("relative px-1 pb-8 sm:px-2 md:pb-10", editorMode && "overflow-visible")}>
          <div className="absolute right-2 top-2 z-[330] sm:right-3 sm:top-3">
            <button
              type="button"
              onClick={toggleDefenderEditor}
              className="rounded-md border border-neutral-300 bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm"
            >
              {editorMode ? "Stop editing" : "Edit diagram"}
            </button>
          </div>
          <EditableDefenderCalloutStage
            variant={defenderVariant}
            heroSrc={config.heroSrc}
            heroAlt={config.heroAlt}
            layout={defenderLayout}
            onLayoutChange={setDefenderLayout}
            editorMode={editorMode}
            activeLeaderKey={defenderEditKey}
          />
          <div className={config.dimensionWrapClass}>
            <DiameterLine inches={config.diameterInches} variant={variant} />
          </div>
        </div>
      ) : null}

      {/* Mobile */}
      {!isDefenderVariant ? (
      <div
        className={cn(
          "flex flex-col items-center md:hidden",
          variant === "lite-18" ? "gap-0 pb-14 pt-2 sm:pt-4" : "gap-2",
          diagramUsesLifestyleChrome(variant) &&
            variant !== "lite-18" &&
            (variant === "lifestyle-44" ? "gap-2 pb-8" : "gap-3 pb-6"),
        )}
      >
        {variant === "lite-18" && config.handleCalloutSrc ? (
          <div className="mb-10 flex w-full flex-col items-center gap-2 px-2 sm:mb-12">
            <p className="max-w-xs text-center font-heading text-xs font-bold uppercase leading-snug text-neutral-900">
              {CALLOUT_META.handle.label}
            </p>
            <div className={cn("aspect-square h-32 w-32 shrink-0", CALLOUT_THUMB_SHADOW)}>
              <div className={CALLOUT_THUMB_INNER_CLIP}>
                <img
                  src={config.handleCalloutSrc}
                  alt={CALLOUT_META.handle.imageAlt}
                  className={cn(
                    "h-full w-full object-cover object-center",
                    matProductImgClass(variant),
                    lite18ThumbCropClass("handle"),
                  )}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        ) : null}
        <img
          src={config.heroSrc}
          alt={config.heroAlt}
          className={cn(
            "w-full object-contain",
            config.mobileHeroMaxClass,
            matProductImgClass(variant),
            variant === "lite-18" && "mt-6 sm:mt-10",
              diagramUsesLifestyleChrome(variant) &&
                variant !== "lite-18" &&
                variant !== "lifestyle-44" &&
                cn("rounded-xl", diagramMatSurfaceBg(variant)),
            )}
          loading="lazy"
          decoding="async"
        />
        <DiameterLine
          inches={config.diameterInches}
          variant={variant}
          className={cn(
            variant === "lite-18"
              ? "relative z-30 mx-auto w-full max-w-[min(90vw,25.5rem)]"
              : cn("w-full", config.mobileHeroMaxClass),
            variant === "large-60" && "-mt-2 shrink-0 pb-0",
            variant === "lifestyle-44" && "mt-4 shrink-0 pb-2 sm:mt-5 sm:pb-3",
            variant === "lite-18" && "mt-6 shrink-0 pb-0 sm:mt-7",
          )}
        />
        <div
          className={cn(
            "flex w-full flex-col items-center",
            variant === "lite-18" && "mt-10 gap-12 sm:mt-12 sm:gap-14",
          )}
        >
        {mobileCalloutKeysForVariant(variant).map((k) => {
          const m = CALLOUT_META[k];
          const mobileThumbCrop = cn(
            variant === "lite-18" && lite18ThumbCropClass(k),
            diagramUsesLifestyleChrome(variant) &&
              k === "cord" &&
              variant !== "lite-18" &&
              "origin-center scale-[1.26] object-[center_18%]",
            diagramUsesLifestyleChrome(variant) &&
              k === "lip" &&
              variant !== "lite-18" &&
              "origin-center scale-[1.24] object-[30%_center]",
            diagramUsesLifestyleChrome(variant) && k === "mesh" && "origin-center scale-[1.24] object-[58%_center]",
          );
          const thumb = (
            <div
              className={cn(
                "aspect-square shrink-0",
                CALLOUT_THUMB_SHADOW,
                diagramUsesLifestyleChrome(variant) && k === "cord" && variant !== "lite-18" ? "h-28 w-28" : "h-32 w-32",
              )}
            >
              <div className={CALLOUT_THUMB_INNER_CLIP}>
                <img
                  src={
                    k === "handle"
                      ? config.handleCalloutSrc
                      : k === "cord"
                        ? config.cordCalloutSrc
                        : k === "lip"
                          ? config.lipCalloutSrc
                          : config.meshCalloutSrc
                  }
                  alt={m.imageAlt}
                  className={cn(
                    "h-full w-full object-cover object-center",
                    matProductImgClass(variant),
                    mobileThumbCrop,
                  )}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          );
          const label = (
            <p className="max-w-xs text-center font-heading text-xs font-bold uppercase leading-snug text-neutral-900">
              {m.label}
            </p>
          );

          if (diagramUsesLifestyleChrome(variant) && k === "cord" && variant !== "lite-18") {
            return (
              <div key={k} className="flex w-full flex-col items-center gap-1.5 px-2">
                {label}
                <div className="h-5 w-px shrink-0 bg-neutral-900 sm:h-6" aria-hidden />
                <div className="relative shrink-0">
                  {thumb}
                  <div
                    className="pointer-events-none absolute left-1/2 top-0 z-[1] w-px -translate-x-1/2 bg-neutral-900"
                    style={{ bottom: "calc(14% + 10px)" }}
                    aria-hidden
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={k}
              className={cn(
                "flex flex-col items-center px-2",
                variant === "lite-18" ? "gap-3" : "gap-2",
              )}
            >
              {thumb}
              {label}
            </div>
          );
        })}
        </div>
      </div>
      ) : null}

      {/* Desktop */}
      {!isDefenderVariant ? (
      <div
        className={cn(
          "mx-auto hidden w-full md:block md:px-2",
          variant === "lifestyle-44"
            ? "max-w-[min(100%,1280px)]"
            : "max-w-[1100px]",
          variant === "lifestyle-44" ? "pb-14 md:pb-16" : diagramUsesLifestyleChrome(variant) && "pb-10 md:pb-12",
        )}
      >
        <div className={cn(lifestyle44 && "overflow-visible")}>
        <div
          ref={containerRef}
          className={cn(
            "relative mx-auto",
            lifestyle44
              ? "w-full max-w-[min(100%,80rem)] min-h-0 overflow-visible"
              : cn(
                  "w-full",
                  config.containerMinHClass,
                  variant === "lite-18" &&
                    "overflow-visible pt-[11rem] md:pt-[13rem] lg:pt-[15rem]",
                ),
            diagramUsesLifestyleChrome(variant) &&
              variant !== "lite-18" &&
              !lifestyle44 &&
              cn("rounded-xl", diagramMatSurfaceBg(variant)),
          )}
          onPointerMove={editorMode ? onPointerMove : undefined}
          onPointerUp={editorMode ? (e) => endDrag(e) : undefined}
          onPointerCancel={editorMode ? (e) => endDrag(e) : undefined}
        >
          <svg
            className={cn(
              "pointer-events-none absolute inset-0 z-[12] h-full w-full text-neutral-900/85",
              lifestyle44 && "h-full min-h-full w-full",
            )}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {lineEnds
              .filter((le) => variant !== "lite-18" || le.k === "lip" || le.k === "cord" || le.k === "handle")
              .map(({ k, x1, y1, x2, y2, meshUpperStart, meshLowerStart, meshUpperEnd, meshLowerEnd }) =>
              k === "mesh" && meshUpperStart && meshLowerStart && meshUpperEnd && meshLowerEnd ? (
                <g key={k}>
                  <>
                    <line
                      x1={meshUpperStart.x}
                      y1={meshUpperStart.y}
                      x2={meshUpperEnd.x}
                      y2={meshUpperEnd.y}
                      stroke="black"
                      strokeWidth="1.02"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={meshUpperStart.x}
                      y1={meshUpperStart.y}
                      x2={meshUpperEnd.x}
                      y2={meshUpperEnd.y}
                      stroke="white"
                      strokeWidth="0.58"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                  <line
                    x1={meshLowerStart.x}
                    y1={meshLowerStart.y}
                    x2={meshLowerEnd.x}
                    y2={meshLowerEnd.y}
                    stroke="black"
                    strokeWidth="1.02"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={meshLowerStart.x}
                    y1={meshLowerStart.y}
                    x2={meshLowerEnd.x}
                    y2={meshLowerEnd.y}
                    stroke="white"
                    strokeWidth="0.58"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ) : (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.34"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}
          </svg>

          {(() => {
            if (editorMode) return null;
            if (variant !== "large-60" && variant !== "lifestyle-44") return null;
            const meshLe = lineEnds.find((le) => le.k === "mesh" && le.meshUpperStart);
            if (!meshLe?.meshUpperStart || !meshLe.meshLowerStart) return null;
            const pocketDotCls = cn(
              "absolute z-[25] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-md ring-1 ring-white",
              "h-3 w-3 pointer-events-none",
            );
            return (
              <>
                <span
                  className={pocketDotCls}
                  style={{ left: `${meshLe.meshUpperStart.x}%`, top: `${meshLe.meshUpperStart.y}%` }}
                  aria-hidden
                />
                <span
                  className={pocketDotCls}
                  style={{ left: `${meshLe.meshLowerStart.x}%`, top: `${meshLe.meshLowerStart.y}%` }}
                  aria-hidden
                />
              </>
            );
          })()}

          <div
            className={cn(
              lifestyle44
                ? "relative z-10 mx-auto w-[min(64vw,624px)]"
                : cn(
                    "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
                    variant === "lite-18" ? "top-[66%]" : "top-1/2",
                    config.heroWidthClass,
                  ),
              diagramUsesLifestyleChrome(variant) &&
                variant !== "lite-18" &&
                !lifestyle44 &&
                cn("rounded-lg", diagramMatSurfaceBg(variant)),
            )}
          >
            <img
              src={config.heroSrc}
              alt={config.heroAlt}
              className={cn(
                "relative z-10 w-full object-contain",
                matProductImgClass(variant),
                diagramUsesLifestyleChrome(variant) &&
                  variant !== "lite-18" &&
                  !lifestyle44 &&
                  cn("rounded-lg", diagramMatSurfaceBg(variant)),
              )}
              loading="lazy"
              decoding="async"
            />
          </div>

          {calloutKeysForVariant(variant).map((k) => {
            const { x, y } = layout.dots[k];
            const dotCls = cn(
              "absolute z-[25] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-md ring-1 ring-white",
              editorMode ? "h-4 w-4 cursor-grab ring-2 ring-amber-400 touch-none active:cursor-grabbing" : "h-3 w-3",
            );
            if (k === "mesh" && !editorMode) return null;
            return editorMode ? (
              <button
                key={k}
                type="button"
                className={dotCls}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`Move ${k} anchor dot on mat`}
                onPointerDown={(e) => onDotPointerDown(e, k)}
              />
            ) : (
              <span
                key={k}
                className={cn(dotCls, "pointer-events-none")}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-hidden
              />
            );
          })}

          {calloutKeysForVariant(variant).map((k) => (
            <FloatingCallout
              key={k}
              calloutKey={k}
              layout={layout}
              editorMode={editorMode}
              onAnchorPointerDown={onAnchorPointerDown}
              variant={variant}
              imageSrcOverride={
                k === "handle"
                  ? config.handleCalloutSrc
                  : k === "cord"
                    ? config.cordCalloutSrc
                    : k === "lip"
                      ? config.lipCalloutSrc
                      : k === "mesh"
                        ? config.meshCalloutSrc
                        : undefined
              }
            />
          ))}
        </div>
        <div className={config.dimensionWrapClass}>
          <DiameterLine inches={config.diameterInches} variant={variant} />
        </div>
        </div>
      </div>
      ) : null}

      {editorMode && isDefenderVariant ? (
        <DefenderCalloutEditorToolbar
          getLayout={() => defenderLayoutRef.current}
          storageKey={config.storageKey}
          layoutSyncEvent={config.layoutEvent}
          leaderKeys={defenderLeaderKeys}
          activeLeaderKey={defenderEditKey}
          onActiveLeaderKeyChange={setDefenderEditKey}
        />
      ) : null}

      {editorMode && !usesFixedDefenderCalloutStage(variant) ? (
        <LargeCalloutEditorToolbar
          getLayout={() => layoutRef.current}
          storageKey={config.storageKey}
          layoutSyncEvent={config.layoutEvent}
        />
      ) : null}
    </div>
  );
}
