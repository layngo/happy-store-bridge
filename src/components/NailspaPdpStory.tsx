/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const HEADLINE = "THE NAIL BAG THAT ACTUALLY GETS IT.";
const IMG_MAIN = "/nailspa-pdp/story/image1.png";
const IMG_BOTTOM = "/nailspa-pdp/story/bottom-hero.png";

const CALLOUT_PANEL = "rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-3";

/** Local arrow box under a single callout (nail mat section). */
const CALLOUT_ARROW_BOX = "mt-2 h-[6.6rem] w-[18rem] shrink-0 sm:h-[7.2rem] sm:w-[19.5rem]";

/** Main diagram arrows use stage % coords (0–100) on a full-bleed overlay — not per-label boxes. */
const MAIN_ARROW_VIEWBOX = "0 0 100 100";
const ARROW_STROKE_WIDTH = 2.35;
const ARROW_DASH = "5 5";
const ARROW_HEAD_SIZE = 7.5;
const ARROW_HEAD_SPREAD = 4.5;

/** Lip + handle callout — wide panel so title/body wrap on fewer lines. */
const LIP_HANDLE_CALLOUT_PANEL =
  "w-[min(92vw,28rem)] min-w-[min(72%,18rem)] max-w-none shrink-0 rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:w-[26rem] sm:px-4 sm:py-3 md:w-[30rem]";

/** Bordered cards for the two stacked NAILSPA copy blocks under the closed-bag still (mobile). */
const NAILSPA_STACKED_CALLOUT =
  "rounded-lg border-2 border-neutral-300 bg-white px-3 py-2.5 shadow-md shadow-black/[0.08] sm:px-4 sm:py-3";

/** Mobile-only: softens the rounded image frame so the border reads less harsh against white. */
const MOBILE_BOTTOM_HERO_EDGE_FADE =
  "inset 0 0 0 1px rgba(255,255,255,0.92), inset 0 1.25rem 1.75rem rgba(255,255,255,0.65), inset 0 -1.25rem 1.75rem rgba(255,255,255,0.65), inset 0.85rem 0 1.25rem rgba(255,255,255,0.5), inset -0.85rem 0 1.25rem rgba(255,255,255,0.5)";

const CARRY_CALLOUT_TITLE = "High quality nail mat";
const CARRY_CALLOUT_BODY =
  "Machine washable and wipeable. spilled polish? no problem, just clean it off with polish remover";

const LIP_HANDLE_CALLOUT_TITLE = "Convenient Containment Lip & Carrying Handle";
const LIP_HANDLE_CALLOUT_BODY =
  "The raised lip keeps polish and tools from falling off the counter, while the built-in handle makes it easy to grab and go after you cinch it closed.";

type Point = { x: number; y: number };
type ArrowGeom = { viewBox: string; start: Point; control: Point; end: Point };
type ArrowKey = "mesh" | "lipTop" | "handleRight" | "toolsCenter" | "washSurface" | "cord" | "carry" | "nailMat";
type MainCalloutArrowKey = "mesh" | "lipTop" | "handleRight" | "toolsCenter" | "washSurface" | "cord";
type ArrowMap = Record<ArrowKey, ArrowGeom>;
type ArrowPointKey = keyof Pick<ArrowGeom, "start" | "control" | "end">;
type CordBoxPos = { right: number; bottom: number };
type BoxPos = { x: number; y: number };

const MAIN_CALLOUT_ARROW_KEYS = ["mesh", "lipTop", "handleRight", "toolsCenter", "washSurface", "cord"] as const;

/** Map original 120×52 editor coords to stage percentages (matches callout box % positions). */
function legacyMainToStage(p: Point): Point {
  return { x: (p.x / 120) * 100, y: (p.y / 52) * 100 };
}

function mainArrowGeom(start: Point, control: Point, end: Point): ArrowGeom {
  return {
    viewBox: MAIN_ARROW_VIEWBOX,
    start: legacyMainToStage(start),
    control: legacyMainToStage(control),
    end: legacyMainToStage(end),
  };
}

function migrateMainArrowGeom(geom: ArrowGeom): ArrowGeom {
  const vb = parseViewBox(geom.viewBox);
  if (vb.width >= 95 && vb.width <= 105 && vb.minX === 0 && vb.minY === 0) {
    return { ...geom, viewBox: MAIN_ARROW_VIEWBOX };
  }
  const toStage = (p: Point) => ({
    x: ((p.x - vb.minX) / vb.width) * 100,
    y: ((p.y - vb.minY) / vb.height) * 100,
  });
  return {
    viewBox: MAIN_ARROW_VIEWBOX,
    start: toStage(geom.start),
    control: toStage(geom.control),
    end: toStage(geom.end),
  };
}

function normalizeArrowMap(map: ArrowMap): ArrowMap {
  const next = { ...map };
  for (const key of MAIN_CALLOUT_ARROW_KEYS) {
    next[key] = migrateMainArrowGeom(next[key]);
  }
  return next;
}

// Shipped defaults (match saved browser layout when no localStorage).
const ARROWS: ArrowMap = {
  mesh: mainArrowGeom(
    { x: 52, y: 2 },
    { x: 62, y: 50 },
    { x: 118, y: 50 },
  ),
  lipTop: mainArrowGeom(
    { x: 105, y: 3 },
    { x: 74, y: 12 },
    { x: 22, y: 9 },
  ),
  handleRight: mainArrowGeom(
    { x: 105, y: 3 },
    { x: 90, y: 26 },
    { x: 116, y: 44 },
  ),
  toolsCenter: mainArrowGeom(
    { x: 103.51176891130173, y: 3.912429658033902 },
    { x: 63.83284476954719, y: 31.734448605743918 },
    { x: -39.900950779786537, y: 5.036993003056402 },
  ),
  washSurface: mainArrowGeom(
    { x: 84.58127121398606, y: 1.7299204937928203 },
    { x: 54.532862170627816, y: 18.766787929361666 },
    { x: -5.408713627804482, y: 6.768883369924071 },
  ),
  cord: mainArrowGeom(
    { x: 81.57602163461539, y: 0 },
    { x: 60.98257211538461, y: 28.715496778569005 },
    { x: 89.48617788461539, y: 50.33014581213971 },
  ),
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

const ARROW_STORAGE_KEY = "nailspa-story-arrow-pts-v8";
const CORD_BOX_STORAGE_KEY = "nailspa-story-cord-box-v1";
const CARRY_BOX_STORAGE_KEY = "nailspa-story-carry-box-v1";
const NAIL_MAT_BOX_STORAGE_KEY = "nailspa-story-nailmat-box-v1";
const MAIN_CALLOUT_BOXES_STORAGE_KEY = "nailspa-story-main-callout-boxes-v3";
const DEFAULT_CORD_BOX_POS: CordBoxPos = { right: 68.19598858173077, bottom: 5.593950320512818 };
const DEFAULT_CARRY_BOX_POS: BoxPos = { x: 91, y: 86 };
const DEFAULT_NAIL_MAT_BOX_POS: BoxPos = { x: 27.992304437924677, y: 46.79633617401123 };

type MainCalloutBoxKey = "mesh" | "lipHandle" | "tools" | "wash";
type MainCalloutAnchor = "start" | "end" | "end-center" | "end-bottom";

type MainCalloutBoxes = Record<MainCalloutBoxKey, BoxPos>;

const DEFAULT_MAIN_CALLOUT_BOXES: MainCalloutBoxes = {
  mesh: { x: 4, y: 14 },
  lipHandle: { x: 78.33745918117191, y: -10 },
  tools: { x: 100, y: 55.64265213016666 },
  wash: { x: 100, y: 100 },
};

const MAIN_CALLOUT_ANCHOR: Record<MainCalloutBoxKey, MainCalloutAnchor> = {
  mesh: "start",
  lipHandle: "end",
  tools: "end-center",
  wash: "end-bottom",
};

function anchorTransform(anchor: MainCalloutAnchor): string | undefined {
  if (anchor === "end") return "translate(-100%, 0)";
  if (anchor === "end-center") return "translate(-100%, -50%)";
  if (anchor === "end-bottom") return "translate(-100%, -100%)";
  return undefined;
}

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
    x: ((point.x - minX) / width) * 100,
    y: ((point.y - minY) / height) * 100,
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
    return normalizeArrowMap(parsed);
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

function loadMainCalloutBoxesFromStorage(): MainCalloutBoxes | null {
  try {
    const raw = localStorage.getItem(MAIN_CALLOUT_BOXES_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MainCalloutBoxes;
  } catch {
    return null;
  }
}

function DraggableMainCallout({
  boxKey,
  pos,
  anchor,
  editorMode,
  stageRef,
  onPosChange,
  alignItems,
  yClampMin = 0,
  yClampMax = 100,
  boxClassName,
  children,
}: {
  boxKey: MainCalloutBoxKey;
  pos: BoxPos;
  anchor: MainCalloutAnchor;
  editorMode?: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onPosChange: (key: MainCalloutBoxKey, next: BoxPos) => void;
  alignItems: "items-start" | "items-end";
  /** Allow dragging above the diagram (e.g. lip/handle callout). Percent of stage height. */
  yClampMin?: number;
  yClampMax?: number;
  boxClassName?: string;
  children: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={cn(
        "absolute z-10 flex max-w-[min(54%,340px)] touch-none flex-col overflow-visible sm:max-w-[360px]",
        alignItems,
        editorMode && "cursor-move",
        boxClassName,
      )}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: anchorTransform(anchor),
      }}
      onPointerDown={(e) => {
        if (!editorMode) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!editorMode || !dragging || !stageRef.current) return;
        const r = stageRef.current.getBoundingClientRect();
        const xPct = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
        const yPct = clamp(((e.clientY - r.top) / r.height) * 100, yClampMin, yClampMax);
        onPosChange(boxKey, { x: xPct, y: yPct });
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {editorMode ? (
        <p className="mb-1 self-stretch text-[10px] font-semibold text-neutral-700">Drag box — {boxKey}</p>
      ) : null}
      {children}
    </div>
  );
}

function arrowHeadPoints(end: Point, control: Point) {
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    left: {
      x: end.x - ux * ARROW_HEAD_SIZE - uy * ARROW_HEAD_SPREAD,
      y: end.y - uy * ARROW_HEAD_SIZE + ux * ARROW_HEAD_SPREAD,
    },
    right: {
      x: end.x - ux * ARROW_HEAD_SIZE + uy * ARROW_HEAD_SPREAD,
      y: end.y - uy * ARROW_HEAD_SIZE - ux * ARROW_HEAD_SPREAD,
    },
  };
}

function ArrowPaths({ geom }: { geom: ArrowGeom }) {
  const { start, control, end } = geom;
  const { left, right } = arrowHeadPoints(end, control);
  return (
    <g className="text-neutral-800/90">
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={ARROW_STROKE_WIDTH}
        strokeDasharray={ARROW_DASH}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path d={`M${end.x} ${end.y} L${left.x} ${left.y} L${right.x} ${right.y} Z`} fill="currentColor" />
    </g>
  );
}

function RenderArrow({
  className,
  geom,
}: {
  className?: string;
  geom: ArrowGeom;
}) {
  return (
    <svg
      className={cn(className, "overflow-visible")}
      viewBox={geom.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      overflow="visible"
    >
      <ArrowPaths geom={geom} />
    </svg>
  );
}

function ArrowEditorHandles({
  geom,
  setGeom,
  layerRef,
  label,
}: {
  geom: ArrowGeom;
  setGeom: (next: ArrowGeom) => void;
  layerRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
}) {
  const [dragKey, setDragKey] = useState<ArrowPointKey | null>(null);

  const move = useCallback(
    (ev: React.PointerEvent) => {
      if (!dragKey || !layerRef.current) return;
      const r = layerRef.current.getBoundingClientRect();
      const xPct = ((ev.clientX - r.left) / r.width) * 100;
      const yPct = ((ev.clientY - r.top) / r.height) * 100;
      setGeom({ ...geom, [dragKey]: pctToPoint(xPct, yPct, geom.viewBox) });
    },
    [dragKey, geom, setGeom, layerRef],
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
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      onPointerMove={move}
      onPointerUp={() => setDragKey(null)}
      onPointerCancel={() => setDragKey(null)}
    >
      {label ? (
        <span className="pointer-events-none absolute left-1 top-1 rounded bg-white/90 px-1 py-0.5 text-[9px] font-semibold text-neutral-600 shadow-sm">
          {label}
        </span>
      ) : null}
      {points.map(({ key, pt, color, label: pointLabel }) => (
        <button
          key={key}
          type="button"
          title={pointLabel}
          aria-label={`Move ${pointLabel}${label ? ` (${label})` : ""}`}
          className={cn(
            "pointer-events-auto absolute z-40 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md cursor-grab touch-none active:cursor-grabbing",
            color,
          )}
          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            layerRef.current?.setPointerCapture(e.pointerId);
            setDragKey(key);
          }}
        />
      ))}
    </div>
  );
}

function MainDiagramArrowsOverlay({
  arrows,
  editorMode,
  onArrowChange,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute inset-0 overflow-visible",
        editorMode ? "z-[25] pointer-events-auto" : "z-[8] pointer-events-none",
      )}
      aria-hidden={!editorMode}
    >
      <svg
        className="h-full w-full overflow-visible text-neutral-800/90"
        viewBox={MAIN_ARROW_VIEWBOX}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {MAIN_CALLOUT_ARROW_KEYS.map((key) => (
          <ArrowPaths key={key} geom={arrows[key]} />
        ))}
      </svg>
      {editorMode
        ? MAIN_CALLOUT_ARROW_KEYS.map((key) => (
            <ArrowEditorHandles
              key={key}
              label={key}
              geom={arrows[key]}
              layerRef={layerRef}
              setGeom={(next) => onArrowChange?.(key, next)}
            />
          ))
        : null}
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
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={layerRef} className={cn("relative overflow-visible", className)}>
      <RenderArrow className="h-full w-full overflow-visible" geom={geom} />
      {editorMode && onChange ? <ArrowEditorHandles geom={geom} setGeom={onChange} layerRef={layerRef} /> : null}
    </div>
  );
}

function MainImageCallouts({
  className,
  arrows,
  editorMode,
  onArrowChange,
  mainCalloutBoxes,
  onMainCalloutBoxChange,
  cordBoxPos,
  onCordBoxPosChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeom) => void;
  mainCalloutBoxes: MainCalloutBoxes;
  onMainCalloutBoxChange: (key: MainCalloutBoxKey, next: BoxPos) => void;
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
      <DraggableMainCallout
        boxKey="mesh"
        pos={mainCalloutBoxes.mesh}
        anchor={MAIN_CALLOUT_ANCHOR.mesh}
        editorMode={editorMode}
        stageRef={boxRef}
        onPosChange={onMainCalloutBoxChange}
        alignItems="items-start"
      >
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Mesh pockets
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Eight elastic mesh pockets to hold your favorite polishes.
          </p>
        </div>
      </DraggableMainCallout>

      {/* Containment lip + carrying handle — compact box, two arrows (lip rim + handle) */}
      <DraggableMainCallout
        boxKey="lipHandle"
        pos={mainCalloutBoxes.lipHandle}
        anchor={MAIN_CALLOUT_ANCHOR.lipHandle}
        editorMode={editorMode}
        stageRef={boxRef}
        onPosChange={onMainCalloutBoxChange}
        alignItems="items-end"
        yClampMin={-28}
        yClampMax={100}
        boxClassName="!max-w-[min(92%,560px)] sm:!max-w-none w-max"
      >
        <div className={LIP_HANDLE_CALLOUT_PANEL}>
          <h2 className="font-heading text-sm font-bold leading-snug tracking-tight text-foreground sm:text-base md:text-lg">
            {LIP_HANDLE_CALLOUT_TITLE}
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            {LIP_HANDLE_CALLOUT_BODY}
          </p>
        </div>
      </DraggableMainCallout>

      <DraggableMainCallout
        boxKey="tools"
        pos={mainCalloutBoxes.tools}
        anchor={MAIN_CALLOUT_ANCHOR.tools}
        editorMode={editorMode}
        stageRef={boxRef}
        onPosChange={onMainCalloutBoxChange}
        alignItems="items-end"
      >
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Room for every tool
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            A convenient area for all your nail tools in the middle.
          </p>
        </div>
      </DraggableMainCallout>

      <DraggableMainCallout
        boxKey="wash"
        pos={mainCalloutBoxes.wash}
        anchor={MAIN_CALLOUT_ANCHOR.wash}
        editorMode={editorMode}
        stageRef={boxRef}
        onPosChange={onMainCalloutBoxChange}
        alignItems="items-end"
      >
        <div className={CALLOUT_PANEL}>
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            Washable application surface
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-neutral-700 sm:text-xs md:text-sm">
            Mess-free manicures on a wipeable surface—spills clean up in seconds.
          </p>
        </div>
      </DraggableMainCallout>

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
            Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed.
          </p>
        </div>
      </div>

      <MainDiagramArrowsOverlay arrows={arrows} editorMode={editorMode} onArrowChange={onArrowChange} />
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
          "absolute cursor-move touch-none rounded-lg border border-neutral-200/60 bg-white/[0.9] px-3 py-2 shadow-md shadow-black/[0.06] backdrop-blur-md sm:px-5 sm:py-3",
          "inline-flex min-w-0 w-max max-w-[min(40rem,calc(100vw-2rem))] flex-col items-start gap-1.5 sm:max-w-[min(42rem,calc(100vw-2.5rem))]",
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
        <p className="font-heading text-base font-bold leading-tight tracking-tight text-foreground sm:text-lg md:text-xl">
          {CARRY_CALLOUT_TITLE}
        </p>
        <p className="max-w-none text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
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
            className={cn(CALLOUT_ARROW_BOX, "text-neutral-800")}
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
  const [mainCalloutBoxes, setMainCalloutBoxes] = useState<MainCalloutBoxes>(DEFAULT_MAIN_CALLOUT_BOXES);
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
      setMainCalloutBoxes(loadMainCalloutBoxesFromStorage() ?? DEFAULT_MAIN_CALLOUT_BOXES);
      setCordBoxPos(loadCordBoxFromStorage() ?? DEFAULT_CORD_BOX_POS);
      setCarryBoxPos(loadBoxPosFromStorage(CARRY_BOX_STORAGE_KEY) ?? DEFAULT_CARRY_BOX_POS);
      setNailMatBoxPos(loadBoxPosFromStorage(NAIL_MAT_BOX_STORAGE_KEY) ?? DEFAULT_NAIL_MAT_BOX_POS);
    }
  }, []);

  const updateArrow = (key: ArrowKey, next: ArrowGeom) => {
    setArrows((prev) => ({ ...prev, [key]: next }));
  };

  const updateMainCalloutBox = (key: MainCalloutBoxKey, next: BoxPos) => {
    setMainCalloutBoxes((prev) => ({ ...prev, [key]: next }));
  };

  const save = () => {
    try {
      localStorage.setItem(ARROW_STORAGE_KEY, JSON.stringify(arrows));
      localStorage.setItem(MAIN_CALLOUT_BOXES_STORAGE_KEY, JSON.stringify(mainCalloutBoxes));
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
            mainCalloutBoxes,
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
          mainCalloutBoxes,
          cordBoxPos,
          carryBoxPos,
          nailMatBoxPos,
        },
        null,
        2,
      ),
    [arrows, mainCalloutBoxes, cordBoxPos, carryBoxPos, nailMatBoxPos],
  );

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white pt-10 text-foreground sm:pt-12 md:pt-14"
      aria-labelledby="nailspa-story-headline"
    >
      <div className="fixed right-3 top-3 z-[320]">
        <button
          type="button"
          onClick={() => {
            setEditorMode((v) => {
              const next = !v;
              if (next) {
                setArrows(loadArrowsFromStorage() ?? ARROWS);
                setMainCalloutBoxes(loadMainCalloutBoxesFromStorage() ?? DEFAULT_MAIN_CALLOUT_BOXES);
                setCordBoxPos(loadCordBoxFromStorage() ?? DEFAULT_CORD_BOX_POS);
                setCarryBoxPos(loadBoxPosFromStorage(CARRY_BOX_STORAGE_KEY) ?? DEFAULT_CARRY_BOX_POS);
                setNailMatBoxPos(loadBoxPosFromStorage(NAIL_MAT_BOX_STORAGE_KEY) ?? DEFAULT_NAIL_MAT_BOX_POS);
              }
              return next;
            });
          }}
          className="rounded-md border border-neutral-300 bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm"
        >
          {editorMode ? "Stop editing" : "Edit diagram"}
        </button>
      </div>
      {editorMode ? (
        <div className="sticky top-0 z-[250] border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Arrow edit mode</strong> — drag callout boxes; drag arrow dots anywhere on the diagram (blue start, green curve, red tip), then Save/Copy.
        </div>
      ) : null}
      <div className="px-5 pb-12 sm:px-8 sm:pb-14 md:pb-16 lg:pb-20">
        <p
          id="nailspa-story-headline"
          className="text-center font-heading text-[clamp(2rem,7.5vw,4.75rem)] font-black uppercase leading-[1.02] tracking-tight text-foreground md:text-[clamp(2.35rem,5.5vw,5.25rem)] md:leading-[1.03]"
        >
          {HEADLINE}
        </p>
      </div>

      {/* Main hero — image 1 + callouts */}
      <div className="relative mt-6 px-4 pb-6 sm:mt-8 sm:px-6 sm:pb-10 md:mt-10 md:px-10 md:pb-16 lg:mt-12 lg:px-14">
        <div className="relative mx-auto max-w-[min(100%,1120px)] overflow-visible">
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
            className={cn(
              "absolute inset-0 z-10 overflow-visible",
              editorMode ? "pointer-events-auto" : "pointer-events-none max-md:hidden",
            )}
            arrows={arrows}
            editorMode={editorMode}
            onArrowChange={updateArrow}
            mainCalloutBoxes={mainCalloutBoxes}
            onMainCalloutBoxChange={updateMainCalloutBox}
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
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{LIP_HANDLE_CALLOUT_TITLE}</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">{LIP_HANDLE_CALLOUT_BODY}</p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Room for every tool</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              A convenient area for all your nail tools in the middle.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">Washable application surface</h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Mess-free manicures on a wipeable surface—spills clean up in seconds.
            </p>
          </div>
          <div className={CALLOUT_PANEL}>
            <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
              Sliding cord lock and cord pocket
            </h2>
            <p className="mt-1 text-xs leading-snug text-neutral-700">
              Pull the drawstring cord and Lay-n-Go NAILSPA cinches completely closed.
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
                  <p className="font-heading text-base font-bold leading-tight tracking-tight text-foreground sm:text-lg">
                    {CARRY_CALLOUT_TITLE}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">{CARRY_CALLOUT_BODY}</p>
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
