/**
 * Editorial strip below NAILSPA PDP hero — matches Cosmo full-bleed white story rhythm.
 */

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const HEADLINE = "THE NAIL BAG THAT ACTUALLY GETS IT.";
const IMG_MAIN = "/nailspa-pdp/story/image1.png";
const IMG_BOTTOM = "/nailspa-pdp/story/bottom-hero.png";

const CALLOUT_PANEL = "rounded-md bg-white/[0.82] px-3 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-md sm:px-4 sm:py-3";

type Point = { x: number; y: number };
type ArrowGeom = { viewBox: string; start: Point; control: Point; end: Point };
type ArrowKey = "mesh" | "lipRight" | "cord" | "carry" | "nailMat";
type ArrowMap = Record<ArrowKey, ArrowGeom>;

const INITIAL_ARROWS: ArrowMap = {
  mesh: {
    viewBox: "0 0 120 48",
    start: { x: 8, y: 40 },
    control: { x: 50, y: 24 },
    end: { x: 88, y: 12 },
  },
  lipRight: {
    viewBox: "0 0 120 56",
    start: { x: 112, y: 12 },
    control: { x: 70, y: 25 },
    end: { x: 28, y: 42 },
  },
  cord: {
    viewBox: "0 0 120 52",
    start: { x: 112, y: 46 },
    control: { x: 72, y: 30 },
    end: { x: 22, y: 14 },
  },
  carry: {
    viewBox: "0 0 100 100",
    start: { x: 78, y: 78 },
    control: { x: 58, y: 40 },
    end: { x: 53, y: 19 },
  },
  nailMat: {
    viewBox: "0 0 120 40",
    start: { x: 112, y: 20 },
    control: { x: 60, y: 20 },
    end: { x: 10, y: 20 },
  },
};

function parseViewBox(viewBox: string) {
  const [minX, minY, width, height] = viewBox.split(" ").map(Number);
  return { minX, minY, width, height };
}

function pointFromClient(svg: SVGSVGElement, clientX: number, clientY: number) {
  const { minX, minY, width, height } = parseViewBox(svg.viewBox.baseVal.toString() || svg.getAttribute("viewBox") || "0 0 100 100");
  const rect = svg.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * width + minX;
  const y = ((clientY - rect.top) / rect.height) * height + minY;
  return { x, y };
}

function DraggableArrow({
  className,
  geom,
  editMode,
  onChange,
}: {
  className?: string;
  geom: ArrowGeom;
  editMode: boolean;
  onChange?: (next: ArrowGeom) => void;
}) {
  const [dragging, setDragging] = useState<keyof Pick<ArrowGeom, "start" | "control" | "end"> | null>(null);
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
    <svg
      className={cn(className, editMode ? "pointer-events-auto" : "")}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      onPointerMove={(e) => {
        if (!dragging || !onChange) return;
        const target = e.currentTarget;
        const point = pointFromClient(target, e.clientX, e.clientY);
        onChange({ ...geom, [dragging]: point });
      }}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <path
        d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}`}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        strokeLinecap="round"
        className="text-neutral-800/85"
      />
      <path d={`M${end.x} ${end.y} L${left.x} ${left.y} L${right.x} ${right.y} Z`} fill="currentColor" className="text-neutral-800/85" />
      {editMode ? (
        <>
          <circle
            cx={start.x}
            cy={start.y}
            r={2.8}
            className="cursor-grab fill-blue-500 stroke-white stroke-[0.9]"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging("start");
              e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
            }}
          />
          <circle
            cx={control.x}
            cy={control.y}
            r={2.8}
            className="cursor-grab fill-emerald-500 stroke-white stroke-[0.9]"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging("control");
              e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
            }}
          />
          <circle
            cx={end.x}
            cy={end.y}
            r={2.8}
            className="cursor-grab fill-rose-500 stroke-white stroke-[0.9]"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging("end");
              e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
            }}
          />
        </>
      ) : null}
    </svg>
  );
}

function CalloutArrow({
  className,
  variant,
  arrows,
  editMode,
  onArrowChange,
}: {
  className?: string;
  variant: "mesh" | "lipRight" | "cord";
  arrows: ArrowMap;
  editMode: boolean;
  onArrowChange: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  if (variant === "mesh") {
    return <DraggableArrow className={className} geom={arrows.mesh} editMode={editMode} onChange={(next) => onArrowChange("mesh", next)} />;
  }
  if (variant === "lipRight") {
    return <DraggableArrow className={className} geom={arrows.lipRight} editMode={editMode} onChange={(next) => onArrowChange("lipRight", next)} />;
  }
  if (variant === "cord") {
    return <DraggableArrow className={className} geom={arrows.cord} editMode={editMode} onChange={(next) => onArrowChange("cord", next)} />;
  }
  return null;
}

function MainImageCallouts({
  className,
  arrows,
  editMode,
  onArrowChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editMode: boolean;
  onArrowChange: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  return (
    <div className={className}>
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
          editMode={editMode}
          onArrowChange={onArrowChange}
          className="mt-1 ml-6 h-10 w-24 shrink-0 sm:ml-10 sm:h-12 sm:w-28 md:ml-14"
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
          editMode={editMode}
          onArrowChange={onArrowChange}
          className="mt-2 mr-8 h-12 w-28 shrink-0 sm:mr-12 sm:h-14 sm:w-32 md:mr-14"
        />
      </div>

      {/* Cord lock — lower right */}
      <div className="absolute bottom-[8%] right-[2%] z-10 flex max-w-[min(54%,260px)] flex-col items-end sm:bottom-[10%] sm:max-w-[280px] md:bottom-[12%] md:right-[4%] md:max-w-[300px]">
        <div className={CALLOUT_PANEL}>
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
          editMode={editMode}
          onArrowChange={onArrowChange}
          className="mt-2 mr-6 h-12 w-28 shrink-0 sm:mr-10 sm:h-14 sm:w-32 md:mr-12"
        />
      </div>
    </div>
  );
}

/** Curved arrow + label over the closed-bag photo. Tweak path in SVG when adjusting. */
function CarryingHandleOverlay({
  arrows,
  editMode,
  onArrowChange,
}: {
  arrows: ArrowMap;
  editMode: boolean;
  onArrowChange: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      <div className="absolute bottom-[6%] right-[4%] max-w-[min(78%,280px)] rounded-md bg-white/[0.82] px-3 py-2 shadow-md shadow-black/[0.08] backdrop-blur-md sm:bottom-[8%] sm:max-w-[300px] sm:px-4 sm:py-2.5 md:bottom-[10%] md:right-[5%]">
        <p className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg">
          Carrying handle for easy travel
        </p>
      </div>
      <DraggableArrow
        className="absolute inset-0 size-full text-neutral-900"
        geom={arrows.carry}
        editMode={editMode}
        onChange={(next) => onArrowChange("carry", next)}
      />
    </div>
  );
}

function BottomProductImage({
  className,
  arrows,
  editMode,
  onArrowChange,
}: {
  className?: string;
  arrows: ArrowMap;
  editMode: boolean;
  onArrowChange: (key: ArrowKey, next: ArrowGeom) => void;
}) {
  return (
    <div
      className={cn("relative w-full overflow-visible border-0 bg-transparent shadow-none ring-0", className)}
      aria-label="Lay-n-Go NAILSPA closed with carry handle"
    >
      <div className="relative min-h-[min(52vh,440px)] w-full sm:min-h-[min(54vh,480px)] md:min-h-[min(56vh,560px)] lg:min-h-[min(58vh,620px)]">
        <img
          src={IMG_BOTTOM}
          alt=""
          className="absolute inset-0 size-full object-contain object-center"
          draggable={false}
          loading="lazy"
        />
        <CarryingHandleOverlay arrows={arrows} editMode={editMode} onArrowChange={onArrowChange} />
      </div>
    </div>
  );
}

export function NailspaPdpStory() {
  const [liveEdit, setLiveEdit] = useState(false);
  const [arrows, setArrows] = useState<ArrowMap>(INITIAL_ARROWS);
  const arrowsJson = useMemo(() => JSON.stringify(arrows, null, 2), [arrows]);

  const updateArrow = (key: ArrowKey, next: ArrowGeom) => {
    setArrows((prev) => ({
      ...prev,
      [key]: next,
    }));
  };

  const copyArrowJson = async () => {
    try {
      await navigator.clipboard.writeText(arrowsJson);
    } catch {
      // no-op: if clipboard is blocked, user can still copy from the textarea below
    }
  };

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen bg-white pt-10 text-foreground sm:pt-12 md:pt-14"
      aria-labelledby="nailspa-story-headline"
    >
      <div className="fixed left-3 top-3 z-[120] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLiveEdit((v) => !v)}
          className="rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white"
        >
          {liveEdit ? "Stop Dragging Arrows" : "Drag Arrows"}
        </button>
        {liveEdit ? (
          <button
            type="button"
            onClick={copyArrowJson}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900"
          >
            Copy Coordinates
          </button>
        ) : null}
      </div>
      {liveEdit ? (
        <div className="fixed bottom-3 right-3 z-[120] w-[min(94vw,420px)] rounded-lg border border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur">
          <p className="mb-1 text-xs font-semibold text-neutral-700">Drag blue(start), green(curve), red(end), then copy JSON</p>
          <textarea readOnly value={arrowsJson} className="h-32 w-full rounded border border-neutral-300 p-2 font-mono text-[11px]" />
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
      <div className="relative px-4 pb-12 sm:px-6 sm:pb-14 md:px-10 md:pb-16 lg:px-14">
        <div className="relative mx-auto max-w-[min(100%,1120px)]">
          <img src={IMG_MAIN} alt="" className="relative z-0 block h-auto w-full" loading="lazy" draggable={false} />
          <MainImageCallouts
            arrows={arrows}
            editMode={liveEdit}
            onArrowChange={updateArrow}
            className={cn("absolute inset-0 z-10 max-md:hidden", liveEdit ? "pointer-events-auto" : "pointer-events-none")}
          />
        </div>

        {/* Mobile: stacked callouts under hero (tap targets stay clear) */}
        <div className="mx-auto mt-6 max-w-[min(100%,1120px)] space-y-4 md:hidden">
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

      {/* Bottom — closed bag photo + nail mat copy */}
      <div className="px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[min(100%,1200px)] flex-col gap-10 md:flex-row md:items-start md:gap-10 lg:gap-12">
          <div className="w-full shrink-0 md:w-[min(58%,720px)] lg:w-[min(60%,780px)]">
            <BottomProductImage arrows={arrows} editMode={liveEdit} onArrowChange={updateArrow} />
          </div>

          <div className="flex flex-1 flex-col md:justify-center md:pt-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <DraggableArrow
                className="mt-2 h-6 w-[4.5rem] shrink-0 text-neutral-800 sm:h-7 sm:w-24 md:mt-3"
                geom={arrows.nailMat}
                editMode={liveEdit}
                onChange={(next) => updateArrow("nailMat", next)}
              />
              <div>
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                High quality nail mat
              </h3>
              <p className="mt-2 max-w-prose text-sm leading-snug text-neutral-700 sm:text-base">
                The Nailspa is machine washable and wipeable.
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
