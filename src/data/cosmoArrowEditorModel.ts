/** Shared control points for Cosmo story dotted arrows (0–100 per image box). */

export type Pt = { x: number; y: number };

/** `s2` = second control of the smooth cubic (`S`) from `ce` to `end` (first `S` control is implicit, reflected from `c2`). */
export type EverythingPts = { m: Pt; c1: Pt; c2: Pt; ce: Pt; s2: Pt; end: Pt };
export type PackupPts = { m: Pt; q: Pt; end: Pt };

export const DEFAULT_EVERYTHING_PTS: EverythingPts = {
  m: { x: 37.66662057522124, y: 10.911223684756882 },
  c1: { x: 76.64200774336283, y: 5.320142839347257 },
  c2: { x: 80.37472345132744, y: 20.497861562097746 },
  ce: { x: 52.46128318584071, y: 29.53328073744965 },
  s2: { x: 53.8, y: 36.5 },
  end: { x: 52.65832411504425, y: 44.40165261802932 },
};

export const DEFAULT_PACKUP_PTS: PackupPts = {
  m: { x: 1.8272569444444446, y: 11.412992931547619 },
  q: { x: 30.409071180555557, y: 0 },
  end: { x: 47.17339409722222, y: 4.2596726190476195 },
};

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function everythingPathFromPts(p: EverythingPts) {
  return `M ${p.m.x} ${p.m.y} C ${p.c1.x} ${p.c1.y}, ${p.c2.x} ${p.c2.y}, ${p.ce.x} ${p.ce.y} S ${p.s2.x} ${p.s2.y}, ${p.end.x} ${p.end.y}`;
}

export function packupPathFromPts(p: PackupPts) {
  return `M ${p.m.x} ${p.m.y} Q ${p.q.x} ${p.q.y}, ${p.end.x} ${p.end.y}`;
}

export const LS_EVERYTHING_PTS = "cosmo-story-arrow-editor-pts-everything";
export const LS_PACKUP_PTS = "cosmo-story-arrow-editor-pts-packup";

export function loadEverythingPtsFromStorage(): EverythingPts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_EVERYTHING_PTS);
    if (!raw) return null;
    const o = JSON.parse(raw) as EverythingPts;
    if (o?.m && o?.c1 && o?.c2 && o?.ce && o?.end) {
      return { ...DEFAULT_EVERYTHING_PTS, ...o, s2: o.s2 ?? DEFAULT_EVERYTHING_PTS.s2 };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function loadPackupPtsFromStorage(): PackupPts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PACKUP_PTS);
    if (!raw) return null;
    const o = JSON.parse(raw) as PackupPts;
    if (o?.m && o?.q && o?.end) return o;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveEditorPtsToStorage(everything: EverythingPts, packup: PackupPts) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_EVERYTHING_PTS, JSON.stringify(everything));
    localStorage.setItem(LS_PACKUP_PTS, JSON.stringify(packup));
  } catch {
    /* ignore */
  }
}
