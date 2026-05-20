/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const HEADLINE = "THE NAIL BAG THAT ACTUALLY GETS IT.";
const IMG_MAIN = "/nailspa-pdp/story/image1.png";
const IMG_BOTTOM = "/nailspa-pdp/story/bottom-hero.png";

const CALLOUT_PANEL = "rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-3";

/** Large workspace — must fit dragged joints; old saves used points outside -80..160. */
const MAIN_ARROW_WORKSPACE = "-170 -85 380 210";
const LEGACY_MAIN_ARROW_WORKSPACE_OLD = "-80 -30 240 110";
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

/** Tools + wash — compact; drag point is the right edge of the text (end anchor). */
const COMPACT_EDGE_CALLOUT_PANEL =
  "w-max max-w-[min(46vw,12rem)] shrink-0 rounded-md bg-white/[0.82] px-2.5 py-2 text-right shadow-lg shadow-black/[0.06] backdrop-blur-md sm:max-w-[13rem] sm:px-3 sm:py-2.5";

const COMPACT_EDGE_CALLOUT_WRAPPER = "w-max max-w-[min(54%,280px)]";

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
type ArrowKey = "mesh" | "lipTop" | "handleRight" | "toolsCenter" | "washSurface" | "cord";
type MainCalloutArrowKey = ArrowKey;
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
const EDITOR_ARROW_KEYS: ArrowKey[] = [...MAIN_CALLOUT_ARROW_KEYS];

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
  const headScale = geom.headScale ?? DEFAULT_HEAD_SCALE;
  const rotation = geom.rotation ?? 0;

  if (geom.viewBox === MAIN_ARROW_WORKSPACE) {
    return { ...geom, strokeWidth, headScale, rotation };
  }

  const vb = parseViewBox(geom.viewBox);
  const ws = parseViewBox(MAIN_ARROW_WORKSPACE);

  if (geom.viewBox === LEGACY_MAIN_ARROW_WORKSPACE_OLD) {
    const old = parseViewBox(geom.viewBox);
    const map = (p: Point) => ({
      x: ws.minX + ((p.x - old.minX) / old.width) * ws.width,
      y: ws.minY + ((p.y - old.minY) / old.height) * ws.height,
    });
    return {
      viewBox: MAIN_ARROW_WORKSPACE,
      start: map(geom.start),
      control: map(geom.control),
      end: map(geom.end),
      strokeWidth,
      headScale,
      rotation,
    };
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
      headScale,
      rotation,
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
    headScale,
    rotation,
  };
}

/** toolsCenter tip was saved off-canvas (x ≈ -160); pulls joints off-screen and stretches the path. */
function repairToolsCenterArrow(geom: ArrowGeom): ArrowGeom {
  const vb = parseViewBox(MAIN_ARROW_WORKSPACE);
  const outOfBounds =
    geom.end.x < vb.minX + 40 ||
    geom.start.x > vb.minX + vb.width - 20 ||
    Math.hypot(geom.end.x - geom.start.x, geom.end.y - geom.start.y) > vb.width * 0.85;

  if (!outOfBounds) {
    return { ...geom, viewBox: MAIN_ARROW_WORKSPACE };
  }

  return {
    ...geom,
    viewBox: MAIN_ARROW_WORKSPACE,
    end: { x: 28, y: 40 },
    strokeWidth: geom.strokeWidth ?? DEFAULT_ARROW_STROKE,
    headScale: geom.headScale ?? DEFAULT_HEAD_SCALE,
    rotation: geom.rotation ?? -20,
  };
}

function normalizeArrowMap(map: ArrowMap): ArrowMap {
  const next = { ...map };
  for (const key of MAIN_CALLOUT_ARROW_KEYS) {
    next[key] =
      key === "toolsCenter" ? repairToolsCenterArrow(migrateMainArrowGeom(next[key])) : migrateMainArrowGeom(next[key]);
  }
  return next;
}

// Shipped defaults — editor-saved layout (May 2026).
const ARROWS: ArrowMap = normalizeArrowMap({
  mesh: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: -113.209395136152, y: -36.65659849984306 },
    control: { x: -69.5764322280884, y: -4.810273034232026 },
    end: { x: -22.44458539145333, y: -30.63073594229561 },
    strokeWidth: 1.5,
    headScale: 1,
    rotation: 0,
  },
  lipTop: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: -40.1893380028861, y: -118.9363351549421 },
    control: { x: -72.72777816227503, y: -106.03788157871791 },
    end: { x: -44.66602911267961, y: -88.62298202514648 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  handleRight: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: 132.72857679639543, y: -118.59763445172992 },
    control: { x: 176.13033090318953, y: -103.35039247785296 },
    end: { x: 147.91544355664934, y: -91.98049000331335 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  toolsCenter: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: 176.85781547001432, y: 56.63961369650704 },
    control: { x: 156.4800470897129, y: 77.52690083639962 },
    end: { x: 66.67977046966553, y: 15.510052953447612 },
    strokeWidth: 1.75,
    rotation: -20,
    headScale: 1,
  },
  washSurface: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: 144.66688224247525, y: 118.49593816484725 },
    control: { x: 115.12371948787143, y: 147.95223971775604 },
    end: { x: 82.02714770180842, y: 107.99634061540874 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
  cord: {
    viewBox: MAIN_ARROW_WORKSPACE,
    start: { x: -136.86957263946533, y: 126.18140983581549 },
    control: { x: -127.92061683109827, y: 162.5000103541783 },
    end: { x: -103.78185367584229, y: 154.2137219565255 },
    strokeWidth: 1.75,
    headScale: 1,
    rotation: 0,
  },
});

const ARROW_STORAGE_KEY = "nailspa-story-arrow-pts-v14";
const CORD_BOX_STORAGE_KEY = "nailspa-story-cord-box-v1";
const MAIN_CALLOUT_BOXES_STORAGE_KEY = "nailspa-story-main-callout-boxes-v6";

type MainCalloutBoxKey = "mesh" | "lipHandle" | "tools" | "wash";
type MainCalloutAnchor = "start" | "end" | "end-center" | "end-bottom";

type MainCalloutBoxes = Record<MainCalloutBoxKey, BoxPos>;

const DEFAULT_MAIN_CALLOUT_BOXES: MainCalloutBoxes = {
  mesh: { x: 0, y: 18.30925399713033 },
  lipHandle: { x: 78.33745918117191, y: -10 },
  tools: { x: 100, y: 45.5109109053177 },
  wash: { x: 100, y: 83.72963796491074 },
};

/** Right-edge callouts: drag along the far right of the diagram only. */
const EDGE_CALLOUT_X_CLAMP = { min: 88, max: 100 } as const;

const DEFAULT_CORD_BOX_POS: CordBoxPos = { right: 77.64717987605503, bottom: 14.289849469150397 };

const MAIN_CALLOUT_ANCHOR: Record<MainCalloutBoxKey, MainCalloutAnchor> = {
  mesh: "start",
  lipHandle: "end",
  tools: "end",
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

function viewBoxPointToStagePos(point: Point, container: DOMRect, viewBox: string): BoxPos {
  const fit = viewBoxFitRect(container, viewBox);
  const vb = parseViewBox(viewBox);
  const px = fit.left + ((point.x - vb.minX) / vb.width) * fit.width;
  const py = fit.top + ((point.y - vb.minY) / vb.height) * fit.height;
  return {
    x: ((px - container.left) / container.width) * 100,
    y: ((py - container.top) / container.height) * 100,
  };
}

function stagePosToViewBoxPoint(pos: BoxPos, container: DOMRect, viewBox: string): Point {
  const clientX = container.left + (pos.x / 100) * container.width;
  const clientY = container.top + (pos.y / 100) * container.height;
  return clientToViewBoxPoint(clientX, clientY, container, viewBox);
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
  xClampMin = 0,
  xClampMax = 100,
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
  /** Horizontal drag bounds (% of stage width). */
  xClampMin?: number;
  xClampMax?: number;
  boxClassName?: string;
  children: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={cn(
        "absolute z-10 flex max-w-[min(54%,340px)] touch-none flex-col overflow-visible sm:max-w-[360px]",
        alignItems,
        editorMode && "z-[12] cursor-move",
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
        const xPct = clamp(((e.clientX - r.left) / r.width) * 100, xClampMin, xClampMax);
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

function ArrowJointGuides({ geom }: { geom: ArrowGeom }) {
  const { start, control, end } = geom;
  return (
    <g className="pointer-events-none" aria-hidden>
      <polyline
        points={`${start.x},${start.y} ${control.x},${control.y} ${end.x},${end.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="4 4"
        className="text-neutral-400/70"
      />
      <circle cx={start.x} cy={start.y} r={5} className="fill-blue-500 stroke-white" strokeWidth={2} />
      <circle cx={control.x} cy={control.y} r={5} className="fill-emerald-500 stroke-white" strokeWidth={2} />
      <circle cx={end.x} cy={end.y} r={5} className="fill-rose-500 stroke-white" strokeWidth={2} />
    </g>
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

/** Draggable joint — same stage % drag model as callout text boxes. */
function DraggableArrowJoint({
  jointKey,
  jointLabel,
  pos,
  stageRef,
  dotClass,
  onMove,
  onDragStart,
  onDragEnd,
  yClampMin = -28,
  yClampMax = 100,
}: {
  jointKey: ArrowPointKey;
  jointLabel: string;
  pos: BoxPos;
  stageRef: React.RefObject<HTMLDivElement | null>;
  dotClass: string;
  onMove: (key: ArrowPointKey, next: BoxPos) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  yClampMin?: number;
  yClampMax?: number;
}) {
  const [dragging, setDragging] = useState(false);

  const moveFromEvent = (e: React.PointerEvent) => {
    if (!stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const xPct = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
    const yPct = clamp(((e.clientY - r.top) / r.height) * 100, yClampMin, yClampMax);
    onMove(jointKey, { x: xPct, y: yPct });
  };

  const endDrag = () => {
    setDragging(false);
    onDragEnd();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      title={jointLabel}
      aria-label={jointLabel}
      className={cn(
        "pointer-events-auto absolute z-[60] flex touch-none cursor-grab flex-col items-center p-3 active:cursor-grabbing",
        dragging && "scale-110",
      )}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStart();
        if (stageRef.current) stageRef.current.setPointerCapture(e.pointerId);
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        moveFromEvent(e);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        moveFromEvent(e);
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <span className="mb-0.5 whitespace-nowrap rounded bg-white/95 px-1 py-0.5 text-[9px] font-semibold text-neutral-800 shadow-sm ring-1 ring-neutral-200">
        {jointLabel}
      </span>
      <span className={cn("block h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-lg ring-2 ring-amber-400/80", dotClass)} />
    </div>
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
  const [stageTick, setStageTick] = useState(0);
  const dragJointRef = useRef<ArrowPointKey | null>(null);

  useLayoutEffect(() => {
    const sync = () => setStageTick((n) => n + 1);
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [dragLayerRef, geom]);

  const applyStagePointer = useCallback(
    (clientX: number, clientY: number) => {
      const key = dragJointRef.current;
      if (!key || !dragLayerRef.current) return;
      const r = dragLayerRef.current.getBoundingClientRect();
      const xPct = clamp(((clientX - r.left) / r.width) * 100, 0, 100);
      const yPct = clamp(((clientY - r.top) / r.height) * 100, -28, 100);
      setGeom((prev) => ({
        ...prev,
        [key]: stagePosToViewBoxPoint({ x: xPct, y: yPct }, r, mapViewBox),
      }));
    },
    [setGeom, dragLayerRef, mapViewBox],
  );

  const stageRect = dragLayerRef.current?.getBoundingClientRect();
  if (!stageRect) return null;

  void stageTick;

  const joints: { key: ArrowPointKey; jointLabel: string; dotClass: string }[] = [
    { key: "start", jointLabel: "Joint 1", dotClass: "bg-blue-500" },
    { key: "control", jointLabel: "Joint 2", dotClass: "bg-emerald-500" },
    { key: "end", jointLabel: "Joint 3", dotClass: "bg-rose-500" },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[50] overflow-visible"
      onPointerMove={(e) => {
        if (dragJointRef.current) applyStagePointer(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        dragJointRef.current = null;
      }}
      onPointerCancel={() => {
        dragJointRef.current = null;
      }}
    >
      {label ? (
        <span className="pointer-events-none absolute left-2 top-2 z-50 rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-950 shadow-sm ring-1 ring-amber-300">
          Editing: {label} — drag joints 1–3
        </span>
      ) : null}
      {joints.map(({ key, jointLabel, dotClass }) => (
        <DraggableArrowJoint
          key={key}
          jointKey={key}
          jointLabel={jointLabel}
          pos={viewBoxPointToStagePos(geom[key], stageRect, mapViewBox)}
          stageRef={dragLayerRef}
          dotClass={dotClass}
          onDragStart={() => {
            dragJointRef.current = key;
          }}
          onDragEnd={() => {
            if (dragJointRef.current === key) dragJointRef.current = null;
          }}
          onMove={(jointKey, stagePos) => {
            if (!dragLayerRef.current) return;
            const r = dragLayerRef.current.getBoundingClientRect();
            setGeom((prev) => ({
              ...prev,
              [jointKey]: stagePosToViewBoxPoint(stagePos, r, mapViewBox),
            }));
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
        editorMode ? "z-[45] pointer-events-none" : "z-[8] pointer-events-none",
      )}
      aria-hidden={!editorMode}
    >
      <svg
        className="pointer-events-none h-full w-full overflow-visible"
        viewBox={MAIN_ARROW_WORKSPACE}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {MAIN_CALLOUT_ARROW_KEYS.map((key) => (
          <g key={key} opacity={editorMode && key !== activeKey ? 0.28 : 1}>
            <ArrowPaths geom={arrows[key]} />
            {editorMode && key === activeKey ? <ArrowJointGuides geom={arrows[key]} /> : null}
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
        <>
          <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            viewBox={geom.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <ArrowJointGuides geom={geom} />
          </svg>
          <ArrowEditorHandles geom={geom} setGeom={onChange} dragLayerRef={layerRef} mapViewBox={geom.viewBox} />
        </>
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
        xClampMin={EDGE_CALLOUT_X_CLAMP.min}
        xClampMax={EDGE_CALLOUT_X_CLAMP.max}
        boxClassName={COMPACT_EDGE_CALLOUT_WRAPPER}
      >
        <div className={COMPACT_EDGE_CALLOUT_PANEL}>
          <h2 className="font-heading text-[13px] font-bold leading-snug tracking-tight text-foreground sm:text-sm">
            Room for every tool
          </h2>
          <p className="mt-0.5 text-[10px] leading-snug text-neutral-700 sm:text-[11px]">
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
        xClampMin={EDGE_CALLOUT_X_CLAMP.min}
        xClampMax={EDGE_CALLOUT_X_CLAMP.max}
        boxClassName={COMPACT_EDGE_CALLOUT_WRAPPER}
      >
        <div className={COMPACT_EDGE_CALLOUT_PANEL}>
          <h2 className="font-heading text-[13px] font-bold leading-snug tracking-tight text-foreground sm:text-sm">
            Washable application surface
          </h2>
          <p className="mt-0.5 text-[10px] leading-snug text-neutral-700 sm:text-[11px]">
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

      {/* Arrows + joints on top so handles are always tappable (above callout boxes). */}
      <MainDiagramArrowLayer
        arrows={arrows}
        editorMode={editorMode}
        activeKey={activeArrowKey}
        stageRef={boxRef}
        onArrowChange={onArrowChange}
      />
    </div>
  );
}

function BottomProductImage({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full bg-white", className)} aria-label="Lay-n-Go NAILSPA closed with carry handle">
      <img
        src={IMG_BOTTOM}
        alt=""
        className="block h-auto w-full max-w-none object-contain object-left"
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}

export function NailspaPdpStory() {
  const [arrows, setArrows] = useState<ArrowMap>(ARROWS);
  const [editorMode, setEditorMode] = useState(false);
  const [editArrowKey, setEditArrowKey] = useState<ArrowKey>("lipTop");
  const [mainCalloutBoxes, setMainCalloutBoxes] = useState<MainCalloutBoxes>(DEFAULT_MAIN_CALLOUT_BOXES);
  const [cordBoxPos, setCordBoxPos] = useState<CordBoxPos>(DEFAULT_CORD_BOX_POS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const enabled = params.get("editArrows") === "1";
    setEditorMode(enabled);
    if (enabled) {
      setArrows(loadArrowsFromStorage() ?? ARROWS);
      setMainCalloutBoxes(loadMainCalloutBoxesFromStorage() ?? DEFAULT_MAIN_CALLOUT_BOXES);
      setCordBoxPos(loadCordBoxFromStorage() ?? DEFAULT_CORD_BOX_POS);
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
      window.dispatchEvent(new Event("nailspa-arrows-updated"));
    } catch {
      // no-op
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ arrows, mainCalloutBoxes, cordBoxPos }, null, 2),
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
      JSON.stringify({ arrows, mainCalloutBoxes, cordBoxPos }, null, 2),
    [arrows, mainCalloutBoxes, cordBoxPos],
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
          <strong>Arrow edit mode</strong> — choose an arrow, drag joints 1–3 on the image (same as moving a text box). Adjust line, head, and rotation below. Save when finished.
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

      {/* Bottom — closed bag photo, full-bleed left (hand at page edge) */}
      <div className="w-full pb-14 pt-0 sm:pb-16 sm:pt-6 md:pt-10">
        <BottomProductImage className="max-md:-mt-3" />
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
