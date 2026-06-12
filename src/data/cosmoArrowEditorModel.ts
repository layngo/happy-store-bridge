/** Shared control points for Cosmo story dotted arrows (0–100 per image box). */

export type Pt = { x: number; y: number };

/** `tq` = quadratic control from `ce` → `end`; kept on the incoming tangent at `ce` for a smooth (no kink) joint. */
export type EverythingPts = { m: Pt; c1: Pt; c2: Pt; ce: Pt; tq: Pt; end: Pt };
export type PackupPts = { m: Pt; q: Pt; end: Pt };

/** Tail control: `ce + λ(ce − c2)` so Q joins the cubic at `ce` with matching tangent (no sharp corner). */
const EVERYTHING_TAIL_LAMBDA = 0.32;

export const DEFAULT_EVERYTHING_PTS: EverythingPts = (() => {
  const m = { x: 37.66662057522124, y: 10.911223684756882 };
  const c1 = { x: 76.64200774336283, y: 5.320142839347257 };
  const c2 = { x: 80.37472345132744, y: 20.497861562097746 };
  const ce = { x: 52.46128318584071, y: 29.53328073744965 };
  const end = { x: 52.65832411504425, y: 44.40165261802932 };
  const vx = ce.x - c2.x;
  const vy = ce.y - c2.y;
  const tq = {
    x: ce.x + EVERYTHING_TAIL_LAMBDA * vx,
    y: ce.y + EVERYTHING_TAIL_LAMBDA * vy,
  };
  return { m, c1, c2, ce, tq, end };
})();

export const DEFAULT_PACKUP_PTS: PackupPts = {
  m: { x: 32, y: 12 },
  q: { x: 54, y: 7 },
  end: { x: 76, y: 5 },
};

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function everythingPathFromPts(p: EverythingPts) {
  return `M ${p.m.x} ${p.m.y} C ${p.c1.x} ${p.c1.y}, ${p.c2.x} ${p.c2.y}, ${p.ce.x} ${p.ce.y} Q ${p.tq.x} ${p.tq.y}, ${p.end.x} ${p.end.y}`;
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
      const parsed = o as EverythingPts & { s2?: Pt };
      return {
        ...DEFAULT_EVERYTHING_PTS,
        m: parsed.m,
        c1: parsed.c1,
        c2: parsed.c2,
        ce: parsed.ce,
        end: parsed.end,
        tq: parsed.tq ?? DEFAULT_EVERYTHING_PTS.tq,
      };
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
