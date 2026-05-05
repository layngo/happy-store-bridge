/** Shared control points for Cosmo story dotted arrows (0–100 per image box). */

export type Pt = { x: number; y: number };

export type EverythingPts = { m: Pt; c1: Pt; c2: Pt; ce: Pt; end: Pt };
export type PackupPts = { m: Pt; q: Pt; end: Pt };

export const DEFAULT_EVERYTHING_PTS: EverythingPts = {
  m: { x: 47, y: 9 },
  c1: { x: 8, y: 14 },
  c2: { x: 2, y: 32 },
  ce: { x: 10, y: 44 },
  end: { x: 50, y: 25 },
};

export const DEFAULT_PACKUP_PTS: PackupPts = {
  m: { x: 50, y: 15 },
  q: { x: 53, y: 24 },
  end: { x: 50, y: 33 },
};

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function everythingPathFromPts(p: EverythingPts) {
  return `M ${p.m.x} ${p.m.y} C ${p.c1.x} ${p.c1.y}, ${p.c2.x} ${p.c2.y}, ${p.ce.x} ${p.ce.y} L ${p.end.x} ${p.end.y}`;
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
    if (o?.m && o?.c1 && o?.c2 && o?.ce && o?.end) return o;
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
