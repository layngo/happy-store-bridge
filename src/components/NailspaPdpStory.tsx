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

/** Large workspace so tips can extend past the label without clipping. */
const MAIN_ARROW_WORKSPACE = "-80 -30 240 110";
const DEFAULT_ARROW_STROKE = 1.25;
const MIN_ARROW_STROKE = 0.75;
const MAX_ARROW_STROKE = 4;
const DEFAULT_HEAD_SCALE = 1;
const MIN_HEAD_SCALE = 0.5;
const MAX_HEAD_SCALE = 2.5;
const MIN_ARROW_ROTATION = -45;
const MAX_ARROW_ROTATION = 45;

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
type ArrowGeom = {
  viewBox: string;
  start: Point;
  control: Point;
  end: Point;
  strokeWidth?: number;
  /** Scales arrowhead size independently of line thickness. */
  headScale?: number;
  /** Degrees around the curve centroid. */
  rotation?: number;
};
type ArrowKey = "mesh" | "lipTop" | "handleRight" | "toolsCenter" | "washSurface" | "cord" | "carry" | "nailMat";
type MainCalloutArrowKey = "mesh" | "lipTop" | "handleRight" | "toolsCenter" | "washSurface" | "cord";
type ArrowMap = Record<ArrowKey, ArrowGeom>;
type ArrowPointKey = keyof Pick<ArrowGeom, "start" | "control" | "end">;
type ArrowGeomUpdater = ArrowGeom | ((prev: ArrowGeom) => ArrowGeom);

function resolveArrowGeom(prev: ArrowGeom, next: ArrowGeomUpdater): ArrowGeom {
  return typeof next === "function" ? next(prev) : next;
}
type CordBoxPos = { right: number; bottom: number };
type BoxPos = { x: number; y: number };

const LEGACY_MAIN_VIEWBOX = "0 0 120 52";
const MAIN_CALLOUT_ARROW_KEYS = ["mesh", "lipTop", "handleRight", "toolsCenter", "washSurface", "cord"] as const;
const EDITOR_ARROW_KEYS: ArrowKey[] = [...MAIN_CALLOUT_ARROW_KEYS, "carry", "nailMat"];

function mapLegacyMainPoint(p: Point): Point {
  const { minX, minY, width, height } = parseViewBox(LEGACY_MAIN_VIEWBOX);
  const ws = parseViewBox(MAIN_ARROW_WORKSPACE);
  return {
    x: ws.minX + ((p.x - minX) / width) * ws.width,
    y: ws.minY + ((p.y - minY) / height) * ws.height,
  };
}

function mainArrowGeom(start: Point, control: Point, end: Point): ArrowGeom {
  return {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: mapLegacyMainPoint(start),
    control: mapLegacyMainPoint(control),
    end: mapLegacyMainPoint(end),
    strokeWidth: DEFAULT_ARROW_STROKE,
  };
}

function migrateMainArrowGeom(geom: ArrowGeom): ArrowGeom {
  const strokeWidth = geom.strokeWidth ?? DEFAULT_ARROW_STROKE;

  if (geom.viewBox === MAIN_ARROW_WORKSPACE) {
    return {
      ...geom,
      strokeWidth,
      headScale: geom.headScale ?? DEFAULT_HEAD_SCALE,
      rotation: geom.rotation ?? 0,
    };
  }

  const vb = parseViewBox(geom.viewBox);
  const ws = parseViewBox(MAIN_ARROW_WORKSPACE);

  if (vb.width >= 200) {
    return { ...geom, viewBox: MAIN_ARROW_WORKSPACE, strokeWidth };
  }

  if (vb.width >= 95 && vb.width <= 105 && vb.minX === 0 && vb.minY === 0) {
    const fromStage = (p: Point) => ({
      x: ws.minX + (p.x / 100) * ws.width,
      y: ws.minY + (p.y / 100) * ws.height,
    });
    return {
      viewBox: MAIN_ARROW_WORKSPACE,
      start: fromStage(geom.start),
      control: fromStage(geom.control),
      end: fromStage(geom.end),
      strokeWidth,
    };
  }

  const { minX, minY, width: w, height: h } = parseViewBox(LEGACY_MAIN_VIEWBOX);
  const map = (p: Point) => ({
    x: ws.minX + ((p.x - minX) / w) * ws.width,
    y: ws.minY + ((p.y - minY) / h) * ws.height,
  });
  return {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: map(geom.start),
    control: map(geom.control),
    end: map(geom.end),
    strokeWidth,
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

const ARROW_STORAGE_KEY = "nailspa-story-arrow-pts-v11";
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

/** Visible SVG area when viewBox is fitted with preserveAspectRatio meet. */
function viewBoxFitRect(container: DOMRect, viewBox: string) {
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

function clientToViewBoxPoint(clientX: number, clientY: number, container: DOMRect, viewBox: string): Point {
  const fit = viewBoxFitRect(container, viewBox);
  const xPct = ((clientX - fit.left) / fit.width) * 100;
  const yPct = ((clientY - fit.top) / fit.height) * 100;
  return pctToPoint(xPct, yPct, viewBox);
}

function viewBoxPointToHandleStyle(point: Point, container: DOMRect, viewBox: string) {
  const fit = viewBoxFitRect(container, viewBox);
  const vb = parseViewBox(viewBox);
  const px = fit.left + ((point.x - vb.minX) / vb.width) * fit.width;
  const py = fit.top + ((point.y - vb.minY) / vb.height) * fit.height;
  return {
    left: `${((px - container.left) / container.width) * 100}%`,
    top: `${((py - container.top) / container.height) * 100}%`,
  };
}

function arrowPivot(geom: Pick<ArrowGeom, "start" | "control" | "end">) {
  return {
    x: (geom.start.x + geom.control.x + geom.end.x) / 3,
    y: (geom.start.y + geom.control.y + geom.end.y) / 3,
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

function ArrowPaths({ geom }: { geom: ArrowGeom }) {
  const { start, control, end } = geom;
  const strokeWidth = geom.strokeWidth ?? DEFAULT_ARROW_STROKE;
  const headScale = (geom.headScale ?? DEFAULT_HEAD_SCALE) * (strokeWidth / DEFAULT_ARROW_STROKE);
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const size = 6 * headScale;
  const spread = 3.8 * headScale;
  const left = { x: end.x - ux * size - uy * spread, y: end.y - uy * size + ux * spread };
  const right = { x: end.x - ux * size + uy * spread, y: end.y - uy * size - ux * spread };
  const pivot = arrowPivot(geom);
  const rotation = geom.rotation ?? 0;
  const transform = rotation !== 0 ? `rotate(${rotation} ${pivot.x} ${pivot.y})` : undefined;

  return (
    <g transform={transform} className="text-neutral-800/85">
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray="3 4"
        strokeLinecap="round"
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
      preserveAspectRatio="xMidYMid meet"
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
  dragLayerRef,
  label,
  mapViewBox = MAIN_ARROW_WORKSPACE,
}: {
  geom: ArrowGeom;
  setGeom: (next: ArrowGeomUpdater) => void;
  dragLayerRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
  mapViewBox?: string;
}) {
  const [dragKey, setDragKey] = useState<ArrowPointKey | null>(null);
  const dragKeyRef = useRef<ArrowPointKey | null>(null);
  const [handleBox, setHandleBox] = useState<DOMRect | null>(null);

  useEffect(() => {
    const sync = () => {
      if (dragLayerRef.current) setHandleBox(dragLayerRef.current.getBoundingClientRect());
    };
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [dragLayerRef, geom]);

  const move = useCallback(
    (ev: React.PointerEvent) => {
      const key = dragKeyRef.current;
      if (!key || !dragLayerRef.current) return;
      const r = dragLayerRef.current.getBoundingClientRect();
      setGeom((prev) => ({
        ...prev,
        [key]: clientToViewBoxPoint(ev.clientX, ev.clientY, r, mapViewBox),
      }));
    },
    [setGeom, dragLayerRef, mapViewBox],
  );

  const endDrag = useCallback(() => {
    dragKeyRef.current = null;
    setDragKey(null);
  }, []);

  if (!handleBox) return null;

  const points = (
    [
      { key: "start" as const, point: geom.start, color: "bg-blue-500", pointLabel: "Start (anchor)" },
      { key: "control" as const, point: geom.control, color: "bg-emerald-500", pointLabel: "Curve" },
      { key: "end" as const, point: geom.end, color: "bg-rose-500", pointLabel: "Tip" },
    ] as const
  ).map(({ key, point, color, pointLabel }) => ({
    key,
    color,
    pointLabel,
    style: viewBoxPointToHandleStyle(point, handleBox, mapViewBox),
  }));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[35] overflow-visible"
      onPointerMove={move}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {label ? (
        <span className="pointer-events-none absolute left-2 top-2 z-50 rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-950 shadow-sm ring-1 ring-amber-300">
          Editing: {label}
        </span>
      ) : null}
      {points.map(({ key, style, color, pointLabel }) => (
        <button
          key={key}
          type="button"
          title={pointLabel}
          aria-label={`Move ${pointLabel}${label ? ` (${label})` : ""}`}
          className={cn(
            "pointer-events-auto absolute z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg cursor-grab touch-none active:cursor-grabbing",
            color,
            dragKey === key && "scale-110 ring-2 ring-amber-400",
          )}
          style={style}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
            dragKeyRef.current = key;
            setDragKey(key);
          }}
        />
      ))}
    </div>
  );
}

/** All main-diagram arrows on one layer so WYSIWYG matches edit handles. */
function MainDiagramArrowLayer({
  arrows,
  editorMode,
  activeKey,
  stageRef,
  onArrowChange,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  activeKey: MainCalloutArrowKey;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onArrowChange?: (key: ArrowKey, next: ArrowGeomUpdater) => void;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-visible",
        editorMode ? "z-[25] pointer-events-auto" : "z-[8] pointer-events-none",
      )}
      aria-hidden={!editorMode}
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox={MAIN_ARROW_WORKSPACE}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {MAIN_CALLOUT_ARROW_KEYS.map((key) => (
          <g key={key} opacity={editorMode && key !== activeKey ? 0.28 : 1}>
            <ArrowPaths geom={arrows[key]} />
          </g>
        ))}
      </svg>
      {editorMode ? (
        <ArrowEditorHandles
          key={activeKey}
          label={activeKey}
          geom={arrows[activeKey]}
          dragLayerRef={stageRef}
          mapViewBox={MAIN_ARROW_WORKSPACE}
          setGeom={(next) => onArrowChange?.(activeKey, next)}
        />
      ) : null}
    </div>
  );
}

function EditableArrow({
  className,
  geom,
  editorMode,
  onChange,
  showHandles = true,
}: {
  className?: string;
  geom: ArrowGeom;
  editorMode?: boolean;
  onChange?: (next: ArrowGeomUpdater) => void;
  showHandles?: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={layerRef} className={cn("relative overflow-visible", className)}>
      <RenderArrow className="h-full w-full overflow-visible" geom={geom} />
      {editorMode && onChange && showHandles ? (
        <ArrowEditorHandles geom={geom} setGeom={onChange} dragLayerRef={layerRef} mapViewBox={geom.viewBox} />
      ) : null}
    </div>
  );
}

function MainImageCallouts({
  className,
  arrows,
  editorMode,
  onArrowChange,
  activeArrowKey,
  mainCalloutBoxes,
  onMainCalloutBoxChange,
  cordBoxPos,
  onCordBoxPosChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeomUpdater) => void;
  activeArrowKey: MainCalloutArrowKey;
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
      <MainDiagramArrowLayer
        arrows={arrows}
        editorMode={editorMode}
        activeKey={activeArrowKey}
        stageRef={boxRef}
        onArrowChange={onArrowChange}
      />

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
    </div>
  );
}

function CarryingHandleOverlay({
  arrows,
  editorMode,
  onArrowChange,
  carryBoxPos,
  onCarryBoxPosChange,
  activeEditKey,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeomUpdater) => void;
  carryBoxPos: BoxPos;
  onCarryBoxPosChange: (next: BoxPos) => void;
  activeEditKey: ArrowKey;
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
        showHandles={editorMode && activeEditKey === "carry"}
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
  activeEditKey,
}: {
  className?: string;
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeomUpdater) => void;
  carryBoxPos: BoxPos;
  onCarryBoxPosChange: (next: BoxPos) => void;
  activeEditKey: ArrowKey;
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
          activeEditKey={activeEditKey}
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
  activeEditKey,
}: {
  arrows: ArrowMap;
  editorMode?: boolean;
  onArrowChange?: (key: ArrowKey, next: ArrowGeomUpdater) => void;
  nailMatBoxPos: BoxPos;
  onNailMatBoxPosChange: (next: BoxPos) => void;
  activeEditKey: ArrowKey;
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
            showHandles={editorMode && activeEditKey === "nailMat"}
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
  const [editArrowKey, setEditArrowKey] = useState<ArrowKey>("lipTop");
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

  const updateArrow = useCallback((key: ArrowKey, next: ArrowGeomUpdater) => {
    setArrows((prev) => ({
      ...prev,
      [key]: resolveArrowGeom(prev[key], next),
    }));
    setEditArrowKey(key);
  }, []);

  const editArrow = arrows[editArrowKey];
  const editArrowStroke = editArrow?.strokeWidth ?? DEFAULT_ARROW_STROKE;
  const editHeadScale = editArrow?.headScale ?? DEFAULT_HEAD_SCALE;
  const editRotation = editArrow?.rotation ?? 0;
  const isMainDiagramArrow = MAIN_CALLOUT_ARROW_KEYS.includes(editArrowKey as MainCalloutArrowKey);

  const patchEditArrow = (patch: Partial<ArrowGeom>) => {
    setArrows((prev) => ({
      ...prev,
      [editArrowKey]: { ...prev[editArrowKey], ...patch },
    }));
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
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                if (next) url.searchParams.set("editArrows", "1");
                else url.searchParams.delete("editArrows");
                window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
              }
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
          <strong>Arrow edit mode</strong> — choose an arrow, drag blue (start), green (curve), and red (tip) on the image. Adjust thickness, head size, and rotation in the panel below. Save when finished.
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
              editorMode ? "pointer-events-auto" : "pointer-events-none md:pointer-events-none max-md:hidden",
            )}
            arrows={arrows}
            editorMode={editorMode}
            onArrowChange={updateArrow}
            activeArrowKey={
              MAIN_CALLOUT_ARROW_KEYS.includes(editArrowKey as MainCalloutArrowKey)
                ? (editArrowKey as MainCalloutArrowKey)
                : "lipTop"
            }
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
              activeEditKey={editArrowKey}
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
              activeEditKey={editArrowKey}
            />
          </div>
        </div>
      </div>
      {editorMode ? (
        <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:left-1/2 md:right-auto md:mx-auto md:w-[min(100%,42rem)] md:-translate-x-1/2 md:rounded-t-xl md:border-x md:border-t">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-800">
              Arrow
              <select
                value={editArrowKey}
                onChange={(e) => setEditArrowKey(e.target.value as ArrowKey)}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs"
              >
                {EDITOR_ARROW_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-[9rem] flex-1 items-center gap-2 text-xs font-medium text-neutral-800">
              Line
              <input
                type="range"
                min={MIN_ARROW_STROKE}
                max={MAX_ARROW_STROKE}
                step={0.25}
                value={editArrowStroke}
                onChange={(e) => patchEditArrow({ strokeWidth: Number(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="flex min-w-[9rem] flex-1 items-center gap-2 text-xs font-medium text-neutral-800">
              Head
              <input
                type="range"
                min={MIN_HEAD_SCALE}
                max={MAX_HEAD_SCALE}
                step={0.1}
                value={editHeadScale}
                onChange={(e) => patchEditArrow({ headScale: Number(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="flex min-w-[9rem] flex-1 items-center gap-2 text-xs font-medium text-neutral-800">
              Rotate
              <input
                type="range"
                min={MIN_ARROW_ROTATION}
                max={MAX_ARROW_ROTATION}
                step={1}
                value={editRotation}
                onChange={(e) => patchEditArrow({ rotation: Number(e.target.value) })}
                className="w-full"
              />
              <span className="tabular-nums text-neutral-600">{editRotation}°</span>
            </label>
            {!isMainDiagramArrow ? (
              <span className="w-full text-center text-[10px] text-neutral-600">
                Drag dots on the bottom section for carry / nailMat arrows.
              </span>
            ) : null}
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
