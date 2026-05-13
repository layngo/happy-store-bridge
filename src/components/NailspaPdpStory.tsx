/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const HEADLINE = "THE NAIL BAG THAT ACTUALLY GETS IT.";
const IMG_MAIN = "/nailspa-pdp/story/image1.png";
const IMG_BOTTOM = "/nailspa-pdp/story/bottom-hero.png";

const CALLOUT_PANEL = "rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-3";

/** Bordered cards for the two stacked NAILSPA copy blocks under the closed-bag still (mobile). */
const NAILSPA_STACKED_CALLOUT =
  "rounded-lg border-2 border-neutral-300 bg-white px-3 py-2.5 shadow-md shadow-black/[0.08] sm:px-4 sm:py-3";

/** Mobile-only: softens the rounded image frame so the border reads less harsh against white. */
const MOBILE_BOTTOM_HERO_EDGE_FADE =
  "inset 0 0 0 1px rgba(255,255,255,0.92), inset 0 1.25rem 1.75rem rgba(255,255,255,0.65), inset 0 -1.25rem 1.75rem rgba(255,255,255,0.65), inset 0.85rem 0 1.25rem rgba(255,255,255,0.5), inset -0.85rem 0 1.25rem rgba(255,255,255,0.5)";

const CARRY_CALLOUT_TITLE = "High quality nail mat";
const CARRY_CALLOUT_BODY =
  "Machine washable and wipeable. spilled polish? no problem, just clean it off with polish remover";

type Point = { x: number; y: number };
type ArrowGeom = { viewBox: string; start: Point; control: Point; end: Point };
type ArrowKey = "mesh" | "lipRight" | "cord" | "carry" | "nailMat";
type ArrowMap = Record<ArrowKey, ArrowGeom>;
type ArrowPointKey = keyof Pick<ArrowGeom, "start" | "control" | "end">;
type CordBoxPos = { right: number; bottom: number };
type BoxPos = { x: number; y: number };

// Reverted to pre-drag coordinates.
const ARROWS: ArrowMap = {
  mesh: {
    viewBox: "0 0 120 48",
    start: { x: 51.10607315690805, y: 1.1182095625635808 },
    control: { x: 61.828486724506256, y: 48 },
    end: { x: 120, y: 48 },
  },
  lipRight: {
    viewBox: "0 0 120 56",
    start: { x: 88.21240558480201, y: 0 },
    control: { x: 109.49416342412451, y: 22.980118590861533 },
    end: { x: 101.21309224078736, y: 56 },
  },
  cord: {
    viewBox: "0 0 120 52",
    start: { x: 81.57602163461539, y: 0 },
    control: { x: 60.98257211538461, y: 28.715496778569005 },
    end: { x: 89.48617788461539, y: 50.33014581213971 },
  },
  carry: {
    viewBox: "0 0 100 100",
    start: { x: 97.5, y: 30 },
    control: { x: 84, y: 40 },
    end: { x: 66.5, y: 38 },
  },
  nailMat: {
    viewBox: "-120 -80 360 220",
    start: { x: 118, y: 12 },
    control: { x: 52, y: 28 },
    end: { x: -102.65920651068159, y: 393.37890625 },
  },
};

const ARROW_STORAGE_KEY = "nailspa-story-arrow-pts-v1";
const CORD_BOX_STORAGE_KEY = "nailspa-story-cord-box-v1";
const CARRY_BOX_STORAGE_KEY = "nailspa-story-carry-box-v1";
const NAIL_MAT_BOX_STORAGE_KEY = "nailspa-story-nailmat-box-v1";
const DEFAULT_CORD_BOX_POS: CordBoxPos = { right: 68.19598858173077, bottom: 5.593950320512818 };
const DEFAULT_CARRY_BOX_POS: BoxPos = { x: 91, y: 86 };
/** Right column; shifted down/left so copy sits closer to the nailMat arrow toward the product photo. */
const DEFAULT_NAIL_MAT_BOX_POS: BoxPos = { x: 44, y: 66 };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseViewBox(viewBox: string) {
  const [minX, minY, width, height] = viewBox.split(" ").map(Number);
  return { minX, minY, width, height };
}

function pointToPct(point: Point, viewBox: string) {
  const { minX, minY, width, height } = parseViewBox(viewBox);
  return {
    x: clamp(((point.x - minX) / width) * 100, 0, 100),
    y: clamp(((point.y - minY) / height) * 100, 0, 100),
  };
}

function pctToPoint(xPct: number, yPct: number, viewBox: string) {
  const { minX, minY, width, height } = parseViewBox(viewBox);
  return {
    x: minX + (xPct / 100) * width,
    y: minY + (yPct / 100) * height,
  };
}

function loadArrowsFromStorage(): ArrowMap | null {
  try {
    const raw = localStorage.getItem(ARROW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ArrowMap;
    return parsed;
  } catch {
    return null;
  }
}

function loadCordBoxFromStorage(): CordBoxPos | null {
  try {
    const raw = localStorage.getItem(CORD_BOX_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CordBoxPos;
  } catch {
    return null;
  }
}

function loadBoxPosFromStorage(key: string): BoxPos | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as BoxPos;
  } catch {
    return null;
  }
}

function RenderArrow({
  className,
  geom,
}: {
  className?: string;
  geom: ArrowGeom;
}) {
  const { start, control, end, viewBox } = geom;
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 6;
  const spread = 3.8;
  const left = { x: end.x - ux * size - uy * spread, y: end.y - uy * size + ux * spread };
  const right = { x: end.x - ux * size + uy * spread, y: end.y - uy * size - ux * spread };

  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        strokeLinecap="round"
        className="text-neutral-800/85"
      />
      <path d={`M${end.x} ${end.y} L${left.x} ${left.y} L${right.x} ${right.y} Z`} fill="currentColor" className="text-neutral-800/85" />
    </svg>
  );
}

function ArrowEditorHandles({
  geom,
  setGeom,
}: {
  geom: ArrowGeom;
  setGeom: (next: ArrowGeom) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragKey, setDragKey] = useState<ArrowPointKey | null>(null);

  const move = useCallback(
    (ev: React.PointerEvent) => {
      if (!dragKey || !boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect();
      const xPct = ((ev.clientX - r.left) / r.width) * 100;
      const yPct = ((ev.clientY - r.top) / r.height) * 100;
      setGeom({ ...geom, [dragKey]: pctToPoint(xPct, yPct, geom.viewBox) });
    },
    [dragKey, geom, setGeom],
  );

  const startPct = pointToPct(geom.start, geom.viewBox);
  const controlPct = pointToPct(geom.control, geom.viewBox);
  const endPct = pointToPct(geom.end, geom.viewBox);
  const points = [
    { key: "start" as const, pt: startPct, color: "bg-blue-500", label: "Start" },
    { key: "control" as const, pt: controlPct, color: "bg-emerald-500", label: "Curve" },
    { key: "end" as const, pt: endPct, color: "bg-rose-500", label: "Tip" },
  ];

  return (
    <div
      ref={boxRef}
      className="pointer-events-none absolute inset-0 z-20"
      onPointerMove={move}
      onPointerUp={() => setDragKey(null)}
      onPointerCancel={() => setDragKey(null)}
    >
      {points.map(({ key, pt, color, label }) => (
        <button
          key={key}
          type="button"
          title={label}
          aria-label={`Move ${label}`}
          className={cn(
            "pointer-events-auto absolute z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md cursor-grab touch-none active:cursor-grabbing",
            color,
          )}
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            boxRef.current?.setPointerCapture(e.pointerId);
            setDragKey(key);
          }}
        />
      ))}
    </div>
  );
}

function EditableArrow({
  className,
  geom,
  editorMode,
  onChange,
}: {
  className?: string;
  geom: ArrowGeom;
  editorMode?: boolean;
  onChange?: (next: ArrowGeom) => void;
}) {
  return (
    <div className={cn("relative", className)}>
      <RenderArrow className="h-full w-full" geom={geom} />
      {editorMode && onChange ? <ArrowEditorHandles geom={geom} setGeom={onChange} /> : null}
    </div>
  );
}

function CalloutArrow({
  className,
  variant,
  arrows,
  editorMode,
  onArrowChange,
}: {
  className?: string;
  variant: "mesh" | "lipRight" | "cord";
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  if (variant === "mesh") {
    return <EditableArrow className={className} geom={arrows.mesh} editorMode={editorMode} onChange={(next) => onArrowChange?.("mesh", next)} />;
  }
  if (variant === "lipRight") {
    return <EditableArrow className={className} geom={arrows.lipRight} editorMode={editorMode} onChange={(next) => onArrowChange?.("lipRight", next)} />;
  }
  if (variant === "cord") {
    return <EditableArrow className={className} geom={arrows.cord} editorMode={editorMode} onChange={(next) => onArrowChange?.("cord", next)} />;
  }
  return null;
}

function MainImageCallouts({
  className,
  arrows,
  editorMode,
  onArrowChange,
  cordBoxPos,
  onCordBoxPosChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
  cordBoxPos: CordBoxPos;
  onCordBoxPosChange: (next: CordBoxPos) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragCordBox, setDragCordBox] = useState(false);

  const moveCordBox = useCallback(
    (ev: React.PointerEvent) => {
      if (!editorMode || !dragCordBox || !boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect();
      const xPct = ((ev.clientX - r.left) / r.width) * 100;
      const yPct = ((ev.clientY - r.top) / r.height) * 100;
      onCordBoxPosChange({ right: 100 - xPct, bottom: 100 - yPct });
    },
    [dragCordBox, editorMode, onCordBoxPosChange],
  );

  return (
    <div
      ref={boxRef}
      className={className}
      onPointerMove={moveCordBox}
      onPointerUp={() => setDragCordBox(false)}
      onPointerCancel={() => setDragCordBox(false)}
    >
      {/* Mesh — left */}
      <div className="absolute left-[1%] top-[14%] z-10 flex max-w-[min(48%,220px)] flex-col items-start sm:left-[3%] sm:top-[12%] sm:max-w-[240px] md:left-[4%] md:top-[14%] md:max-w-[260px] lg:max-w-[280px]">
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Mesh pockets
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Eight elastic mesh pockets to hold your favorite polishes.
          </p>
        </div>
        <CalloutArrow
          variant="mesh"
          arrows={arrows}
          editorMode={editorMode}
          onArrowChange={onArrowChange}
          className="mt-1 ml-6 h-16 w-40 shrink-0 sm:ml-10 sm:h-[4.8rem] sm:w-[11.2rem] md:ml-14"
        />
      </div>

      {/* Containment lip — right */}
      <div className="absolute right-[1%] top-[10%] z-10 flex max-w-[min(50%,240px)] flex-col items-end sm:right-[2%] sm:max-w-[260px] md:right-[3%] md:max-w-[280px] lg:max-w-[300px]">
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Convenient containment lip
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            The raised lip keeps polish and tools from falling off the counter.
          </p>
        </div>
        <CalloutArrow
          variant="lipRight"
          arrows={arrows}
          editorMode={editorMode}
          onArrowChange={onArrowChange}
          className="mt-2 mr-8 h-[4.8rem] w-44 shrink-0 sm:mr-12 sm:h-[5.6rem] sm:w-[12.8rem] md:mr-14"
        />
      </div>

      {/* Cord lock — lower right */}
      <div
        className="absolute z-10 flex max-w-[min(54%,260px)] cursor-move touch-none flex-col items-end sm:max-w-[280px] md:max-w-[300px]"
        style={{ bottom: `${cordBoxPos.bottom}%`, right: `${cordBoxPos.right}%` }}
        onPointerDown={(e) => {
          if (!editorMode) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragCordBox(true);
        }}
      >
        <div className={CALLOUT_PANEL}>
          {editorMode ? <p className="mb-1 text-[10px] font-semibold text-neutral-700">Drag box</p> : null}
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Sliding cord lock and cord pocket
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed. Grab the handle on the go.
          </p>
        </div>
        <CalloutArrow
          variant="cord"
          arrows={arrows}
          editorMode={editorMode}
          onArrowChange={onArrowChange}
          className="mt-2 mr-6 h-[6.6rem] w-[18rem] shrink-0 sm:mr-10 sm:h-[7.2rem] sm:w-[19.5rem] md:mr-12"
        />
      </div>
    </div>
  );
}

function CarryingHandleOverlay({
  arrows,
  editorMode,
  onArrowChange,
  carryBoxPos,
  onCarryBoxPosChange,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
  carryBoxPos: BoxPos;
  onCarryBoxPosChange: (next: BoxPos) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragCarryBox, setDragCarryBox] = useState(false);

  const moveCarryBox = useCallback(
    (ev: React.PointerEvent) => {
      if (!editorMode || !dragCarryBox || !boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect();
      const xPct = ((ev.clientX - r.left) / r.width) * 100;
      const yPct = ((ev.clientY - r.top) / r.height) * 100;
      onCarryBoxPosChange({ x: xPct, y: yPct });
    },
    [dragCarryBox, editorMode, onCarryBoxPosChange],
  );

  return (
    <div
      ref={boxRef}
      className={cn(
        "absolute inset-0 z-20 overflow-visible",
        editorMode ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden
      onPointerMove={moveCarryBox}
      onPointerUp={() => setDragCarryBox(false)}
      onPointerCancel={() => setDragCarryBox(false)}
    >
      <div
        className={cn(
          "absolute cursor-move touch-none rounded-lg border border-neutral-200/60 bg-white/[0.9] px-3 py-2 shadow-md shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-2.5",
          "inline-flex min-w-0 max-w-[min(20rem,calc(100vw-2rem))] flex-col items-start gap-1",
        )}
        style={{ left: `${carryBoxPos.x}%`, top: `${carryBoxPos.y}%`, transform: "translate(-50%, -50%)" }}
        onPointerDown={(e) => {
          if (!editorMode) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragCarryBox(true);
        }}
        onPointerMove={(e) => {
          if (!editorMode || !dragCarryBox || !boxRef.current) return;
          const r = boxRef.current.getBoundingClientRect();
          const xPct = ((e.clientX - r.left) / r.width) * 100;
          const yPct = ((e.clientY - r.top) / r.height) * 100;
          onCarryBoxPosChange({ x: xPct, y: yPct });
        }}
        onPointerUp={() => setDragCarryBox(false)}
        onPointerCancel={() => setDragCarryBox(false)}
      >
        {editorMode ? <p className="mb-0.5 text-[10px] font-semibold text-neutral-700">Drag box</p> : null}
        <p className="font-heading text-balance text-base font-bold tracking-tight text-foreground md:text-lg">
          {CARRY_CALLOUT_TITLE}
        </p>
        <p className="text-pretty text-sm leading-snug text-neutral-700 md:text-[0.95rem] md:leading-snug">
          {CARRY_CALLOUT_BODY}
        </p>
      </div>
      <EditableArrow
        className="absolute inset-0 size-full text-neutral-900"
        geom={arrows.carry}
        editorMode={editorMode}
        onChange={(next) => onArrowChange?.("carry", next)}
      />
    </div>
  );
}

function BottomProductImage({
  className,
  arrows,
  editorMode,
  onArrowChange,
  carryBoxPos,
  onCarryBoxPosChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
  carryBoxPos: BoxPos;
  onCarryBoxPosChange: (next: BoxPos) => void;
}) {
  return (
    <div
      className={cn("relative w-full overflow-visible border-0 bg-transparent shadow-none ring-0", className)}
      aria-label="Lay-n-Go NAILSPA closed with carry handle"
    >
      {/* Clip only art + vignette; callouts sit in a sibling layer so wide panels are not cut off */}
      <div className="relative min-h-[min(38vh,300px)] w-full overflow-hidden rounded-2xl sm:min-h-[min(54vh,480px)] md:min-h-[min(56vh,560px)] lg:min-h-[min(58vh,620px)]">
        <img
          src={IMG_BOTTOM}
          alt=""
          className="absolute inset-0 size-full object-contain object-[30%_center] max-md:object-[32%_center]"
          draggable={false}
          loading="lazy"
        />
        {/* Mobile: top edge only — tight fade into hand; no radial tail bleeding over cards below */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[18%] md:hidden"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.92) 14%, rgba(255,255,255,0.45) 32%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden
        />
        {/* Mobile: inset light wash to soften the rounded photo border against the page */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] rounded-2xl md:hidden"
          style={{ boxShadow: MOBILE_BOTTOM_HERO_EDGE_FADE }}
          aria-hidden
        />
        {/* Desktop: top band + right + left/bottom rails (unchanged) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[14%] z-[2] hidden h-[30%] md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.38) 62%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden
        />
        {/* Right: fade — desktop only */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden w-[30%] md:block"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 35%, rgba(255,255,255,0) 100%)" }}
          aria-hidden
        />
        {/* Left + bottom rails — desktop only */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 100%), linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
      <div className={cn("pointer-events-none absolute inset-0 z-20 overflow-visible", editorMode ? "block" : "hidden md:block")}>
        <CarryingHandleOverlay
          arrows={arrows}
          editorMode={editorMode}
          onArrowChange={onArrowChange}
          carryBoxPos={carryBoxPos}
          onCarryBoxPosChange={onCarryBoxPosChange}
        />
      </div>
    </div>
  );
}

function NailMatCalloutEditor({
  arrows,
  editorMode,
  onArrowChange,
  nailMatBoxPos,
  onNailMatBoxPosChange,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
  nailMatBoxPos: BoxPos;
  onNailMatBoxPosChange: (next: BoxPos) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dragBox, setDragBox] = useState(false);

  const moveBox = useCallback(
    (ev: React.PointerEvent) => {
      if (!editorMode || !dragBox || !wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const xPct = ((ev.clientX - r.left) / r.width) * 100;
      const yPct = ((ev.clientY - r.top) / r.height) * 100;
      onNailMatBoxPosChange({ x: xPct, y: yPct });
    },
    [dragBox, editorMode, onNailMatBoxPosChange],
  );

  return (
    <>
      <div
        ref={wrapRef}
        className={cn(
          "relative min-h-[min(320px,52vh)] w-full",
          editorMode ? "pointer-events-auto block" : "pointer-events-none hidden md:block",
        )}
        onPointerMove={moveBox}
        onPointerUp={() => setDragBox(false)}
        onPointerCancel={() => setDragBox(false)}
      >
        <div
          className="absolute z-10 w-[min(90%,360px)] max-w-full cursor-move touch-none"
          style={{ left: `${nailMatBoxPos.x}%`, top: `${nailMatBoxPos.y}%`, transform: "translate(-50%, -50%)" }}
          onPointerDown={(e) => {
            if (!editorMode) return;
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragBox(true);
          }}
        >
          <div className={CALLOUT_PANEL}>
            {editorMode ? <p className="mb-1 text-[10px] font-semibold text-neutral-700">Drag box</p> : null}
            <h3 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Carrying handle for easy travel
            </h3>
            <p className="mt-2 text-sm leading-snug text-neutral-700 sm:text-base">
              The Nailspa is machine washable and wipeable.
            </p>
          </div>
          <EditableArrow
            className="mt-2 h-10 w-[7.25rem] text-neutral-800 sm:h-11 sm:w-[9.6rem]"
            geom={arrows.nailMat}
            editorMode={editorMode}
            onChange={(next) => onArrowChange?.("nailMat", next)}
          />
        </div>
      </div>
    </>
  );
}

export function NailspaPdpStory() {
  const [arrows, setArrows] = useState<ArrowMap>(ARROWS);
  const [editorMode, setEditorMode] = useState(false);
  const [cordBoxPos, setCordBoxPos] = useState<CordBoxPos>(DEFAULT_CORD_BOX_POS);
  const [carryBoxPos, setCarryBoxPos] = useState<BoxPos>(DEFAULT_CARRY_BOX_POS);
  const [nailMatBoxPos, setNailMatBoxPos] = useState<BoxPos>(DEFAULT_NAIL_MAT_BOX_POS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const enabled = params.get("editArrows") === "1";
    setEditorMode(enabled);
    if (enabled) {
      setArrows(loadArrowsFromStorage() ?? ARROWS);
      setCordBoxPos(loadCordBoxFromStorage() ?? DEFAULT_CORD_BOX_POS);
      setCarryBoxPos(loadBoxPosFromStorage(CARRY_BOX_STORAGE_KEY) ?? DEFAULT_CARRY_BOX_POS);
      setNailMatBoxPos(loadBoxPosFromStorage(NAIL_MAT_BOX_STORAGE_KEY) ?? DEFAULT_NAIL_MAT_BOX_POS);
    }
  }, []);

  const updateArrow = (key: ArrowKey, next: ArrowGeom) => {
    setArrows((prev) => ({ ...prev, [key]: next }));
  };

  const save = () => {
    try {
      localStorage.setItem(ARROW_STORAGE_KEY, JSON.stringify(arrows));
      localStorage.setItem(CORD_BOX_STORAGE_KEY, JSON.stringify(cordBoxPos));
      localStorage.setItem(CARRY_BOX_STORAGE_KEY, JSON.stringify(carryBoxPos));
      localStorage.setItem(NAIL_MAT_BOX_STORAGE_KEY, JSON.stringify(nailMatBoxPos));
      window.dispatchEvent(new Event("nailspa-arrows-updated"));
    } catch {
      // no-op
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          {
            arrows,
            cordBoxPos,
            carryBoxPos,
            nailMatBoxPos,
          },
          null,
          2,
        ),
      );
    } catch {
      // no-op
    }
  };

  const done = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("editArrows");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setEditorMode(false);
  };

  const arrowJson = useMemo(
    () =>
      JSON.stringify(
        {
          arrows,
          cordBoxPos,
            carryBoxPos,
            nailMatBoxPos,
        },
        null,
        2,
      ),
    [arrows, cordBoxPos, carryBoxPos, nailMatBoxPos],
  );

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white pt-10 text-foreground sm:pt-12 md:pt-14"
      aria-labelledby="nailspa-story-headline"
    >
      <div className="fixed right-3 top-3 z-[320]">
        <button
          type="button"
          onClick={() => setEditorMode((v) => !v)}
          className="rounded-md border border-neutral-300 bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm"
        >
          {editorMode ? "Stop editing arrows" : "Edit arrows"}
        </button>
      </div>
      {editorMode ? (
        <div className="sticky top-0 z-[250] border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Arrow edit mode</strong> - drag dots on arrows, then Save/Copy.
        </div>
      ) : null}
      <div className="px-5 pb-8 sm:px-8 sm:pb-10 md:pb-12">
        <p
          id="nailspa-story-headline"
          className="text-center font-heading text-[clamp(2rem,7.5vw,4.75rem)] font-black uppercase leading-[1.02] tracking-tight text-foreground md:text-[clamp(2.35rem,5.5vw,5.25rem)] md:leading-[1.03]"
        >
          {HEADLINE}
        </p>
      </div>

      {/* Main hero — image 1 + three callouts */}
      <div className="relative px-4 pb-6 sm:px-6 sm:pb-10 md:px-10 md:pb-16 lg:px-14">
        <div className="relative mx-auto max-w-[min(100%,1120px)]">
          <img src={IMG_MAIN} alt="" className="relative z-0 block h-auto w-full" loading="lazy" draggable={false} />
          {/* Vignette on the main story still — desktop + mobile */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 10%, rgba(255,255,255,0) 90%, rgba(255,255,255,0.98) 100%), linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 90%, rgba(255,255,255,0.96) 100%)",
            }}
          />
          <MainImageCallouts
            className={cn("absolute inset-0 z-10", editorMode ? "pointer-events-auto" : "pointer-events-none max-md:hidden")}
            arrows={arrows}
            editorMode={editorMode}
            onArrowChange={updateArrow}
            cordBoxPos={cordBoxPos}
            onCordBoxPosChange={setCordBoxPos}
          />
        </div>

        {/* Mobile: stacked callouts under hero (tap targets stay clear) */}
        <div className="mx-auto mt-4 max-w-[min(100%,1120px)] space-y-3 md:hidden">
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Mesh pockets</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Eight elastic mesh pockets to hold your favorite polishes.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Convenient containment lip</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              The raised lip keeps polish and tools from falling off the counter.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
              Sliding cord lock and cord pocket
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed. Grab the handle on the go.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: tiny spacer — bottom hero + cards sit closer to cord callouts */}
      <div className="pointer-events-none h-1 w-full shrink-0 bg-white md:hidden" aria-hidden />

      {/* Bottom — closed bag photo + nail mat copy (desktop: cluster centered as one unit) */}
      <div className="px-4 pb-14 pt-0 sm:px-6 sm:pb-16 sm:pt-8 md:px-10 md:pt-12 lg:px-14">
        <div className="mx-auto flex w-full max-w-[min(100%,1200px)] flex-col gap-1 overflow-visible max-md:-mt-3 md:flex-row md:items-start md:justify-center md:mt-0 md:gap-10 md:pt-0 lg:gap-12">
          <div className="relative z-10 w-full shrink-0 md:w-[min(46%,560px)] lg:w-[min(48%,600px)]">
            <BottomProductImage
              arrows={arrows}
              editorMode={editorMode}
              onArrowChange={updateArrow}
              carryBoxPos={carryBoxPos}
              onCarryBoxPosChange={setCarryBoxPos}
            />
            {!editorMode ? (
              <div className="relative z-10 mx-auto mt-0 flex w-full max-w-none flex-col gap-2 px-0 pt-1 md:hidden">
                <div className={cn(NAILSPA_STACKED_CALLOUT, "w-full px-3 py-2")}>
                  <p className="font-heading text-balance text-base font-bold tracking-tight text-foreground">
                    {CARRY_CALLOUT_TITLE}
                  </p>
                  <p className="mt-1 text-pretty text-sm leading-snug text-neutral-700">{CARRY_CALLOUT_BODY}</p>
                </div>
                <div className={cn(NAILSPA_STACKED_CALLOUT, "px-3 py-2")}>
                  <h3 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                    Carrying handle for easy travel
                  </h3>
                  <p className="mt-2 text-xs leading-snug text-neutral-700 sm:text-sm">
                    The Nailspa is machine washable and wipeable.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative z-30 flex w-full shrink-0 flex-col overflow-visible md:w-[min(44%,520px)] md:max-w-lg md:justify-center md:pt-4">
            <NailMatCalloutEditor
              arrows={arrows}
              editorMode={editorMode}
              onArrowChange={updateArrow}
              nailMatBoxPos={nailMatBoxPos}
              onNailMatBoxPosChange={setNailMatBoxPos}
            />
          </div>
        </div>
      </div>
      {editorMode ? (
        <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:left-1/2 md:right-auto md:mx-auto md:w-[min(100%,42rem)] md:-translate-x-1/2 md:rounded-t-xl md:border-x md:border-t">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={save} className="rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white">
              Save to this browser
            </button>
            <button type="button" onClick={copy} className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900">
              Copy Coordinates
            </button>
            <button type="button" onClick={done} className="rounded-md border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-900">
              Done editing
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Use `?editArrows=1` in URL, drag dots, then Save or Copy.</p>
          <textarea readOnly value={arrowJson} className="mt-2 h-24 w-full rounded border border-neutral-300 p-2 font-mono text-[10px]" />
        </div>
      ) : null}
    </section>
  );
}
