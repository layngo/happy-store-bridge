/** Defender Mini / Tactical hero diagram — leader lines + callout positions (viewBox + %). */

export type DefenderCalloutAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export type DefenderLeaderEnd = {
  /** Callout-side end of the leader (viewBox units). */
  x1: number;
  y1: number;
  /** Mat-side dot (viewBox units). */
  x2: number;
  y2: number;
};

export type DefenderCalloutPos = {
  x: number;
  y: number;
  anchor: DefenderCalloutAnchor;
};

export type DefenderLayoutState = {
  leaders: Record<string, DefenderLeaderEnd>;
  callouts: Record<string, DefenderCalloutPos>;
};

export const DEFENDER_MINI_LEADER_KEYS = ["lip", "strap", "cord"] as const;
export const DEFENDER_TACTICAL_LEADER_KEYS = ["mesh", "zipper", "strap", "lip", "cord"] as const;

export type DefenderMiniLeaderKey = (typeof DEFENDER_MINI_LEADER_KEYS)[number];
export type DefenderTacticalLeaderKey = (typeof DEFENDER_TACTICAL_LEADER_KEYS)[number];

export const DEFAULT_DEFENDER_MINI_LAYOUT: DefenderLayoutState = {
  leaders: {
    lip: {
      x1: 89.60239609174045,
      y1: 104.96246894028621,
      x2: 245.6723690263267,
      y2: 165.51021855174096,
    },
    strap: {
      x1: 788.7661515089432,
      y1: 130.31873120725825,
      x2: 927.5616134388334,
      y2: 123.36117220931538,
    },
    cord: {
      x1: 122.2851496878312,
      y1: 503.45345462957334,
      x2: 205.51117488472838,
      y2: 427.4063356221169,
    },
  },
  callouts: {
    lip: { x: 1, y: 2.5, anchor: "top-left" },
    strap: { x: 99, y: 2.5, anchor: "top-right" },
    cord: { x: 1, y: 97, anchor: "bottom-left" },
  },
};

export const DEFAULT_DEFENDER_TACTICAL_LAYOUT: DefenderLayoutState = {
  leaders: {
    mesh: {
      x1: 0,
      y1: 868.2940268709121,
      x2: 167.40986615000335,
      y2: 912.8280034969581,
    },
    zipper: {
      x1: 462.98455238916415,
      y1: 718.6474381445531,
      x2: 915.5687982960366,
      y2: 945.3618588647419,
    },
    strap: {
      x1: 0,
      y1: 145.76507432460065,
      x2: 549.2079853855311,
      y2: 202.28440637061613,
    },
    lip: {
      x1: 1024,
      y1: 619.7571424880201,
      x2: 944.1618154884643,
      y2: 612.4829228286785,
    },
    cord: {
      x1: 1024,
      y1: 131.00931430283924,
      x2: 801.8338220624523,
      y2: 84.66788969323083,
    },
  },
  callouts: {
    mesh: { x: 84.72779147810769, y: 102.18318913908465, anchor: "bottom-left" },
    zipper: { x: 12.75192370332498, y: 2.618672368517693, anchor: "top-right" },
    strap: { x: 89.46744327564953, y: -3.820947527521658, anchor: "top-left" },
    lip: { x: 117.47422600708954, y: 75.97332262286504, anchor: "bottom-right" },
    cord: { x: -16.626397292929646, y: 74.82168067206374, anchor: "top-left" },
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseViewBox(viewBox: string) {
  const [minX, minY, width, height] = viewBox.split(" ").map(Number);
  return { minX, minY, width, height };
}

export function viewBoxFitRect(container: DOMRect, viewBox: string) {
  const vb = parseViewBox(viewBox);
  const vbAspect = vb.width / vb.height;
  const cAspect = container.width / container.height;
  if (cAspect > vbAspect) {
    const height = container.height;
    const width = height * vbAspect;
    return {
      left: container.left + (container.width - width) / 2,
      top: container.top,
      width,
      height,
    };
  }
  const width = container.width;
  const height = width / vbAspect;
  return {
    left: container.left,
    top: container.top + (container.height - height) / 2,
    width,
    height,
  };
}

export function clientToViewBoxPoint(
  clientX: number,
  clientY: number,
  container: DOMRect,
  viewBox: string,
): { x: number; y: number } {
  const fit = viewBoxFitRect(container, viewBox);
  const vb = parseViewBox(viewBox);
  const xPct = ((clientX - fit.left) / fit.width) * 100;
  const yPct = ((clientY - fit.top) / fit.height) * 100;
  return {
    x: vb.minX + (clamp(xPct, 0, 100) / 100) * vb.width,
    y: vb.minY + (clamp(yPct, 0, 100) / 100) * vb.height,
  };
}

export function viewBoxPointToStagePos(
  point: { x: number; y: number },
  container: DOMRect,
  viewBox: string,
): { x: number; y: number } {
  const fit = viewBoxFitRect(container, viewBox);
  const vb = parseViewBox(viewBox);
  const px = fit.left + ((point.x - vb.minX) / vb.width) * fit.width;
  const py = fit.top + ((point.y - vb.minY) / vb.height) * fit.height;
  return {
    x: ((px - container.left) / container.width) * 100,
    y: ((py - container.top) / container.height) * 100,
  };
}

export function defenderCalloutTransform(anchor: DefenderCalloutAnchor): string {
  switch (anchor) {
    case "top-right":
      return "translate(-100%, 0)";
    case "bottom-left":
      return "translate(0, -100%)";
    case "bottom-right":
      return "translate(-100%, -100%)";
    case "center":
      return "translate(-50%, -50%)";
    default:
      return "translate(0, 0)";
  }
}

export function loadDefenderLayout(
  storageKey: string,
  fallback: DefenderLayoutState,
): DefenderLayoutState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DefenderLayoutState>;
    const leaders = { ...fallback.leaders };
    const callouts = { ...fallback.callouts };
    if (parsed.leaders) {
      for (const key of Object.keys(fallback.leaders)) {
        if (parsed.leaders[key]) leaders[key] = { ...fallback.leaders[key], ...parsed.leaders[key] };
      }
    }
    if (parsed.callouts) {
      for (const key of Object.keys(fallback.callouts)) {
        if (parsed.callouts[key]) callouts[key] = { ...fallback.callouts[key], ...parsed.callouts[key] };
      }
    }
    return { leaders, callouts };
  } catch {
    return fallback;
  }
}

export function defenderLayoutForVariant(
  variant: "defender-mini-16" | "defender-tactical-20",
): DefenderLayoutState {
  return variant === "defender-mini-16" ? DEFAULT_DEFENDER_MINI_LAYOUT : DEFAULT_DEFENDER_TACTICAL_LAYOUT;
}

export function defenderLeaderKeysForVariant(
  variant: "defender-mini-16" | "defender-tactical-20",
): readonly string[] {
  return variant === "defender-mini-16" ? DEFENDER_MINI_LEADER_KEYS : DEFENDER_TACTICAL_LEADER_KEYS;
}
