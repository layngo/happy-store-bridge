import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_CALLOUT_MAIN = "/products/lay-n-go-large-pdp/hero-callout-main.png";
const CALLOUT_CORD = "/products/lay-n-go-large-pdp/callout-cord-pocket.png";
const CALLOUT_MESH = "/products/lay-n-go-large-pdp/callout-mesh-pockets.png";
const CALLOUT_LIP = "/products/lay-n-go-large-pdp/callout-containment-lip.png";

const STORAGE_KEY = "lay-n-go-large-callout-layout-v5";

type CalloutKey = "cord" | "lip" | "mesh";

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
  },
  anchors: {
    cord: { x: 50, y: 10 },
    lip: { x: 12, y: 48 },
    mesh: { x: 80, y: 54 },
  },
};

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
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function loadLayout(): LayoutState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as Partial<LayoutState>;
    const dots = parsed.dots ?? {};
    const anchors = parsed.anchors ?? {};
    return {
      dots: {
        cord: dots.cord ?? DEFAULT_LAYOUT.dots.cord,
        lip: dots.lip ?? DEFAULT_LAYOUT.dots.lip,
        mesh: dots.mesh ?? DEFAULT_LAYOUT.dots.mesh,
      },
      anchors: {
        cord: anchors.cord ?? DEFAULT_LAYOUT.anchors.cord,
        lip: anchors.lip ?? DEFAULT_LAYOUT.anchors.lip,
        mesh: anchors.mesh ?? DEFAULT_LAYOUT.anchors.mesh,
      },
    };
  } catch {
    return DEFAULT_LAYOUT;
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

function DimensionSixtyInch({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col items-center px-2", className)}>
      <div className="flex w-full max-w-md items-end justify-center sm:max-w-lg">
        <div className="h-5 w-px shrink-0 bg-neutral-900" aria-hidden />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div className="h-5 w-px shrink-0 bg-neutral-900" aria-hidden />
      </div>
      <p className="mt-2 font-heading text-lg font-semibold tabular-nums text-neutral-900 sm:text-xl">60&quot;</p>
    </div>
  );
}

function FloatingCallout({
  calloutKey,
  layout,
  editorMode,
  onAnchorPointerDown,
}: {
  calloutKey: CalloutKey;
  layout: LayoutState;
  editorMode: boolean;
  onAnchorPointerDown: (e: React.PointerEvent, key: CalloutKey) => void;
}) {
  const { imageSrc, imageAlt, label, textAbove } = CALLOUT_META[calloutKey];
  const { x, y } = layout.anchors[calloutKey];

  const text = (
    <p className="max-w-[13rem] text-center font-heading text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:max-w-[15rem] sm:text-xs md:text-sm">
      {label}
    </p>
  );

  const thumb = (
    <div className="aspect-square h-[7.25rem] w-[7.25rem] shrink-0 overflow-hidden rounded-full ring-2 ring-white sm:h-32 sm:w-32 md:h-40 md:w-40">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  return (
    <div
      className={cn(
        "absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2",
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
          {thumb}
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

function LargeCalloutEditorToolbar({ getLayout }: { getLayout: () => LayoutState }) {
  const navigate = useNavigate();
  const location = useLocation();

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getLayout()));
      window.dispatchEvent(new Event("lay-n-go-large-callout-layout"));
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

export function LayNGoLargeCalloutDiagram() {
  const [searchParams] = useSearchParams();
  const editorMode = searchParams.get("editLargeCallouts") === "1" || searchParams.get("editLargeCallouts") === "true";

  const [layout, setLayout] = useState<LayoutState>(() => loadLayout());
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: "dot" | "anchor"; key: CalloutKey } | null>(null);

  useEffect(() => {
    const sync = () => setLayout(loadLayout());
    window.addEventListener("lay-n-go-large-callout-layout", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lay-n-go-large-callout-layout", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const lineEnds = useMemo(() => {
    const R = 5.5;
    return (["cord", "lip", "mesh"] as CalloutKey[]).map((k) => {
      const d = layout.dots[k];
      const a = layout.anchors[k];
      const end = shortenToward(a.x, a.y, d.x, d.y, R);
      return { k, x1: d.x, y1: d.y, x2: end.x, y2: end.y };
    });
  }, [layout]);

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

  return (
    <div
      className="mx-auto mt-14 max-w-6xl border-t border-neutral-200/80 pt-12 sm:mt-16 sm:pt-14"
      aria-label="Lay-n-Go Large product details"
    >
      {editorMode ? (
        <div className="sticky top-0 z-[250] mb-4 border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Callout edit mode</strong> — drag dots on the mat and drag detail photos. Then Save layout.
        </div>
      ) : null}

      {/* Mobile */}
      <div className="flex flex-col items-center gap-8 md:hidden">
        <img
          src={HERO_CALLOUT_MAIN}
          alt="Lay-n-Go Large 60 inch activity mat from above, filled with building blocks"
          className="w-full max-w-lg object-contain"
          loading="lazy"
          decoding="async"
        />
        <DimensionSixtyInch className="w-full max-w-lg" />
        {(["cord", "mesh", "lip"] as CalloutKey[]).map((k) => {
          const m = CALLOUT_META[k];
          return (
            <div key={k} className="flex flex-col items-center gap-2 px-2">
              <div className="aspect-square h-32 w-32 shrink-0 overflow-hidden rounded-full ring-2 ring-neutral-100">
                <img
                  src={m.imageSrc}
                  alt={m.imageAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="max-w-xs text-center font-heading text-xs font-bold uppercase leading-snug text-neutral-900">
                {m.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-[1100px] md:block md:px-2">
        <div
          ref={containerRef}
          className="relative mx-auto min-h-[min(96vh,960px)] w-full"
          onPointerMove={editorMode ? onPointerMove : undefined}
          onPointerUp={editorMode ? (e) => endDrag(e) : undefined}
          onPointerCancel={editorMode ? (e) => endDrag(e) : undefined}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-[12] h-full w-full text-neutral-900/85"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {lineEnds.map(({ k, x1, y1, x2, y2 }) => (
              <line
                key={k}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={k === "mesh" ? "0.42" : "0.34"}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(94vw,920px)] -translate-x-1/2 -translate-y-1/2">
            <img
              src={HERO_CALLOUT_MAIN}
              alt="Lay-n-Go Large 60 inch activity mat from above, filled with building blocks"
              className="relative z-10 w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          {(["cord", "lip", "mesh"] as CalloutKey[]).map((k) => {
            const { x, y } = layout.dots[k];
            const dotCls = cn(
              "absolute z-[25] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-md ring-1 ring-white",
              editorMode ? "h-4 w-4 cursor-grab ring-2 ring-amber-400 touch-none active:cursor-grabbing" : "h-3 w-3",
            );
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

          {(["cord", "lip", "mesh"] as CalloutKey[]).map((k) => (
            <FloatingCallout
              key={k}
              calloutKey={k}
              layout={layout}
              editorMode={editorMode}
              onAnchorPointerDown={onAnchorPointerDown}
            />
          ))}
        </div>

        <div className="mx-auto -mt-16 w-[min(94vw,920px)] pt-0 sm:-mt-20 md:-mt-24">
          <DimensionSixtyInch />
        </div>
      </div>

      {editorMode ? <LargeCalloutEditorToolbar getLayout={() => layoutRef.current} /> : null}
    </div>
  );
}
