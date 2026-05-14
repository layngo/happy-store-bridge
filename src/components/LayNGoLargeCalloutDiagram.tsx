import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_CALLOUT_MAIN = "/products/lay-n-go-large-pdp/hero-callout-main.png";
const HERO_CALLOUT_LIFESTYLE = "/products/lay-n-go-lifestyle-44/hero-callout-main.png";
const HERO_CALLOUT_LITE = "/products/lay-n-go-lite-18/hero-callout-main.png";
const CALLOUT_CORD = "/products/lay-n-go-large-pdp/callout-cord-pocket.png";
const CALLOUT_CORD_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-cord-pocket.png";
const CALLOUT_MESH = "/products/lay-n-go-large-pdp/callout-mesh-pockets.png";
const CALLOUT_MESH_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-mesh-pockets.png";
const CALLOUT_LIP = "/products/lay-n-go-large-pdp/callout-containment-lip.png";
const CALLOUT_LIP_LIFESTYLE = "/products/lay-n-go-lifestyle-44/callout-containment-lip.png";
const CALLOUT_LIP_LITE = "/products/lay-n-go-lite-18/callout-containment-lip.png";

const STORAGE_KEY_LARGE = "lay-n-go-large-callout-layout-v5";
const STORAGE_KEY_LIFESTYLE = "lay-n-go-lifestyle-44-callout-layout-v10";

const LAYOUT_SYNC_EVENT_LARGE = "lay-n-go-large-callout-layout";
const LAYOUT_SYNC_EVENT_LIFESTYLE = "lay-n-go-lifestyle-44-callout-layout";

const STORAGE_KEY_LITE = "lay-n-go-lite-18-callout-layout-v1";
const LAYOUT_SYNC_EVENT_LITE = "lay-n-go-lite-18-callout-layout";

/** Slight drop shadow on diagram callout circles (Large + Lifestyle, mobile + desktop). */
const CALLOUT_THUMB_SHADOW = "shadow-[0_2px_10px_rgb(0_0_0_/_0.12),0_6px_20px_rgb(0_0_0_/_0.08)]";

export type LayNGoCalloutDiagramVariant = "large-60" | "lifestyle-44" | "lite-18";

/** ~20px on a typical md stage, as 0–100 viewBox deltas (see `preserveAspectRatio="none"`). */
const LIFESTYLE_MESH_POCKET_DX_20PX = 2.65;
/** ~20px × 2 closer vertically on ~768px stage (y half-delta per pocket dot, 0–100 space). */
const LIFESTYLE_MESH_POCKET_DY_HALF_20PX = 1.33 + (20 / 768) * 100 * 0.5;

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
    mesh: { x: 86, y: 46 },
  },
};

/** ~75px vertically on a ~768px-tall stage, as 0–100 y delta. */
const LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY = (75 / 768) * 100;

/** ~50px left on a typical md stage, as 0–100 viewBox x delta. */
const LIFESTYLE_LIP_DOT_DX_50PX = 5.55;

/** Lifestyle defaults: cord/lip/mesh tuned for 44″ hero + callout edit mode. */
const DEFAULT_LAYOUT_LIFESTYLE: LayoutState = {
  dots: {
    cord: { x: 50, y: -4 + LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY },
    lip: { x: 24 - LIFESTYLE_LIP_DOT_DX_50PX + LIFESTYLE_MESH_POCKET_DX_20PX, y: 49 },
    mesh: { x: 52, y: 50 },
  },
  anchors: {
    cord: { x: 50, y: -26 + LIFESTYLE_CORD_CALLOUT_DOWN_75PX_DY },
    lip: { x: 9, y: 48 },
    mesh: DEFAULT_LAYOUT.anchors.mesh,
  },
};

/** Same anchor defaults as Lifestyle; Lite uses its own storage key. */
const DEFAULT_LAYOUT_LITE: LayoutState = {
  dots: { ...DEFAULT_LAYOUT_LIFESTYLE.dots },
  anchors: { ...DEFAULT_LAYOUT_LIFESTYLE.anchors },
};

function diagramUsesLifestyleChrome(variant: LayNGoCalloutDiagramVariant) {
  return variant === "lifestyle-44" || variant === "lite-18";
}

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

function calloutLabelForVariant(calloutKey: CalloutKey, variant: LayNGoCalloutDiagramVariant): string {
  if (variant === "lite-18" && calloutKey === "mesh") {
    return CALLOUT_META.cord.label;
  }
  return CALLOUT_META[calloutKey].label;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function loadLayout(storageKey: string, fallback: LayoutState = DEFAULT_LAYOUT): LayoutState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LayoutState>;
    const dots: Partial<Record<CalloutKey, Pt>> = parsed.dots ?? {};
    const anchors: Partial<Record<CalloutKey, Pt>> = parsed.anchors ?? {};
    return {
      dots: {
        cord: dots.cord ?? fallback.dots.cord,
        lip: dots.lip ?? fallback.dots.lip,
        mesh: dots.mesh ?? fallback.dots.mesh,
      },
      anchors: {
        cord: anchors.cord ?? fallback.anchors.cord,
        lip: anchors.lip ?? fallback.anchors.lip,
        mesh: anchors.mesh ?? fallback.anchors.mesh,
      },
    };
  } catch {
    return fallback;
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

/** Unit vector from A toward B (viewBox 0–100). */
function unitToward(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function rotateVec(ux: number, uy: number, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return { x: ux * c - uy * s, y: ux * s + uy * c };
}

function diagramConfig(variant: LayNGoCalloutDiagramVariant) {
  if (variant === "lifestyle-44") {
    return {
      storageKey: STORAGE_KEY_LIFESTYLE,
      layoutEvent: LAYOUT_SYNC_EVENT_LIFESTYLE,
      heroSrc: HERO_CALLOUT_LIFESTYLE,
      heroAlt:
        "Lay-n-Go Lifestyle 44 inch backpack activity play mat from above with building blocks, mesh pockets, and straps",
      diameterInches: 44,
      containerMinHClass: "min-h-[min(76.8vh,768px)]",
      heroWidthClass: "w-[min(75.2vw,736px)]",
      /** Pull up less than before + top padding so ticks clear the mat; pb keeps 44″ visible. */
      dimensionWrapClass:
        "relative z-20 mx-auto -mt-[3.25rem] w-[min(75.2vw,736px)] pt-5 pb-2 sm:-mt-[3.75rem] sm:pt-6 sm:pb-3 md:-mt-[5rem] md:pt-7 md:pb-4 lg:-mt-[6rem] lg:pt-8 lg:pb-5",
      mobileHeroMaxClass: "max-w-[min(90vw,25.5rem)]",
      meshCalloutSrc: CALLOUT_MESH_LIFESTYLE,
      lipCalloutSrc: CALLOUT_LIP_LIFESTYLE,
      cordCalloutSrc: CALLOUT_CORD_LIFESTYLE,
    };
  }
  if (variant === "lite-18") {
    return {
      storageKey: STORAGE_KEY_LITE,
      layoutEvent: LAYOUT_SYNC_EVENT_LITE,
      heroSrc: HERO_CALLOUT_LITE,
      heroAlt:
        'Lay-n-Go Lite 18" green activity mat from above with magnetic tiles, drawstring, and Lay-n-Go Lite pocket on white',
      diameterInches: 18,
      containerMinHClass: "min-h-[min(76.8vh,768px)]",
      heroWidthClass: "w-[min(75.2vw,736px)]",
      dimensionWrapClass:
        "relative z-20 mx-auto -mt-[3.25rem] w-[min(75.2vw,736px)] pt-5 pb-2 sm:-mt-[3.75rem] sm:pt-6 sm:pb-3 md:-mt-[5rem] md:pt-7 md:pb-4 lg:-mt-[6rem] lg:pt-8 lg:pb-5",
      mobileHeroMaxClass: "max-w-[min(90vw,25.5rem)]",
      meshCalloutSrc: CALLOUT_MESH,
      lipCalloutSrc: CALLOUT_LIP_LITE,
      cordCalloutSrc: CALLOUT_CORD,
    };
  }
  return {
    storageKey: STORAGE_KEY_LARGE,
    layoutEvent: LAYOUT_SYNC_EVENT_LARGE,
    heroSrc: HERO_CALLOUT_MAIN,
    heroAlt: "Lay-n-Go Large 60 inch activity mat from above, filled with building blocks",
    diameterInches: 60,
    containerMinHClass: "min-h-[min(96vh,960px)]",
    heroWidthClass: "w-[min(94vw,920px)]",
    dimensionWrapClass:
      "relative z-20 mx-auto -mt-[9.5rem] w-[min(94vw,920px)] pt-0 sm:-mt-40 md:-mt-48 lg:-mt-52",
    mobileHeroMaxClass: "max-w-lg",
    meshCalloutSrc: CALLOUT_MESH,
    lipCalloutSrc: CALLOUT_LIP,
    cordCalloutSrc: CALLOUT_CORD,
  };
}

function DiameterLine({
  inches,
  className,
  variant = "large-60",
}: {
  inches: number;
  className?: string;
  variant?: LayNGoCalloutDiagramVariant;
}) {
  const lifestyleChrome = diagramUsesLifestyleChrome(variant);
  return (
    <div className={cn("flex w-full flex-col items-center px-2", className)}>
      <div
        className={cn(
          "flex items-end justify-center",
          lifestyleChrome
            ? "mx-auto w-[min(100%,52%)] sm:w-[min(100%,50%)] md:w-[min(100%,48%)]"
            : "w-full max-w-md sm:max-w-lg",
        )}
      >
        <div className="h-10 w-px shrink-0 bg-neutral-900 sm:h-12 md:h-14" aria-hidden />
        <div className="mb-0 h-px min-w-0 flex-1 bg-neutral-900" aria-hidden />
        <div className="h-10 w-px shrink-0 bg-neutral-900 sm:h-12 md:h-14" aria-hidden />
      </div>
      <p
        className={cn(
          "font-heading font-semibold tabular-nums text-neutral-900",
          lifestyleChrome ? "mt-2 text-xl sm:text-2xl" : "mt-1 text-lg sm:text-xl",
        )}
      >
        {inches}&quot;
      </p>
    </div>
  );
}

function FloatingCallout({
  calloutKey,
  layout,
  editorMode,
  onAnchorPointerDown,
  imageSrcOverride,
  variant = "large-60",
}: {
  calloutKey: CalloutKey;
  layout: LayoutState;
  editorMode: boolean;
  onAnchorPointerDown: (e: React.PointerEvent, key: CalloutKey) => void;
  imageSrcOverride?: string;
  variant?: LayNGoCalloutDiagramVariant;
}) {
  const { imageSrc, imageAlt, textAbove } = CALLOUT_META[calloutKey];
  const label = calloutLabelForVariant(calloutKey, variant);
  const thumbSrc = imageSrcOverride ?? imageSrc;
  const { x, y } = layout.anchors[calloutKey];
  const lifestyleThumb = diagramUsesLifestyleChrome(variant);
  const cordLifestyleCompact = lifestyleThumb && calloutKey === "cord";
  const lipLifestyleTightCrop = lifestyleThumb && calloutKey === "lip";
  const meshLifestyleTightCrop = lifestyleThumb && calloutKey === "mesh";

  const text = (
    <p className="max-w-[13rem] text-center font-heading text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:max-w-[15rem] sm:text-xs md:text-sm">
      {label}
    </p>
  );

  const thumb = (
    <div
      className={cn(
        "aspect-square shrink-0 overflow-hidden rounded-full",
        cordLifestyleCompact
          ? "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
          : "h-[7.25rem] w-[7.25rem] sm:h-32 sm:w-32 md:h-40 md:w-40",
        CALLOUT_THUMB_SHADOW,
        lifestyleThumb ? "ring-0" : "ring-2 ring-white",
      )}
    >
      <img
        src={thumbSrc}
        alt={imageAlt}
        className={cn(
          "h-full w-full object-cover object-center",
          cordLifestyleCompact && "origin-center scale-[1.26] object-[center_18%]",
          lipLifestyleTightCrop && "origin-center scale-[1.24] object-[30%_center]",
          meshLifestyleTightCrop && "origin-center scale-[1.24] object-[58%_center]",
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  return (
    <div
      className={cn(
        "absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
        cordLifestyleCompact ? "gap-1" : "gap-2",
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
          {cordLifestyleCompact ? (
            <>
              <div className="h-2.5 w-px shrink-0 bg-neutral-900 sm:h-3" aria-hidden />
              <div className="relative shrink-0">
                {thumb}
                <div
                  className="pointer-events-none absolute left-1/2 top-0 z-[5] w-px -translate-x-1/2 bg-neutral-900"
                  style={{ bottom: "calc(14% + 10px)" }}
                  aria-hidden
                />
              </div>
            </>
          ) : (
            thumb
          )}
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

function LargeCalloutEditorToolbar({
  getLayout,
  storageKey,
  layoutSyncEvent,
}: {
  getLayout: () => LayoutState;
  storageKey: string;
  layoutSyncEvent: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(getLayout()));
      window.dispatchEvent(new Event(layoutSyncEvent));
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

type LayNGoLargeCalloutDiagramProps = {
  variant?: LayNGoCalloutDiagramVariant;
};

export function LayNGoLargeCalloutDiagram({ variant = "large-60" }: LayNGoLargeCalloutDiagramProps) {
  const [searchParams] = useSearchParams();
  const editorMode = searchParams.get("editLargeCallouts") === "1" || searchParams.get("editLargeCallouts") === "true";

  const config = useMemo(() => diagramConfig(variant), [variant]);

  const fallbackLayout = useMemo(
    () =>
      variant === "lifestyle-44"
        ? DEFAULT_LAYOUT_LIFESTYLE
        : variant === "lite-18"
          ? DEFAULT_LAYOUT_LITE
          : DEFAULT_LAYOUT,
    [variant],
  );

  const [layout, setLayout] = useState<LayoutState>(() =>
    loadLayout(diagramConfig(variant).storageKey, fallbackLayout),
  );
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: "dot" | "anchor"; key: CalloutKey } | null>(null);

  useEffect(() => {
    const sync = () => setLayout(loadLayout(config.storageKey, fallbackLayout));
    sync();
    window.addEventListener(config.layoutEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(config.layoutEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, [config.storageKey, config.layoutEvent, fallbackLayout]);

  const lineEnds = useMemo(() => {
    const R = 5.5;
    return (["cord", "lip", "mesh"] as CalloutKey[]).map((k) => {
      const d = layout.dots[k];
      const a = layout.anchors[k];
      const end = shortenToward(a.x, a.y, d.x, d.y, R);
      if (k === "mesh") {
        // Two pocket touch-points on the mat → two rim points on the callout circle.
        let meshUpperStart: Pt;
        let meshLowerStart: Pt;
        if (diagramUsesLifestyleChrome(variant)) {
          meshUpperStart = {
            x: d.x - 5 + LIFESTYLE_MESH_POCKET_DX_20PX,
            y: d.y - 36 + LIFESTYLE_MESH_POCKET_DY_HALF_20PX,
          };
          meshLowerStart = {
            x: d.x - 5 + LIFESTYLE_MESH_POCKET_DX_20PX,
            y: d.y + 36 - LIFESTYLE_MESH_POCKET_DY_HALF_20PX,
          };
        } else {
          meshUpperStart = { x: d.x + 0.25, y: d.y - 42 };
          meshLowerStart = { x: d.x + 1.2, y: d.y - 2 };
        }
        const toward = unitToward(a.x, a.y, d.x, d.y);
        const spread = (7 * Math.PI) / 180;
        const uU = rotateVec(toward.x, toward.y, spread);
        const uL = rotateVec(toward.x, toward.y, -spread);
        const meshUpperEnd = { x: a.x + uU.x * R, y: a.y + uU.y * R };
        const meshLowerEnd = { x: a.x + uL.x * R, y: a.y + uL.y * R };
        return {
          k,
          x1: d.x,
          y1: d.y,
          x2: end.x,
          y2: end.y,
          meshUpperStart,
          meshLowerStart,
          meshUpperEnd,
          meshLowerEnd,
        };
      }
      return { k, x1: d.x, y1: d.y, x2: end.x, y2: end.y };
    });
  }, [layout, variant]);

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
      className={cn(
        "mx-auto max-w-6xl pt-12 sm:pt-14",
        diagramUsesLifestyleChrome(variant)
          ? "mt-[calc(3.5rem+100px)] rounded-2xl bg-white px-2 sm:mt-[calc(4rem+100px)] sm:px-4"
          : "mt-14 sm:mt-16",
      )}
      aria-label={
        variant === "lifestyle-44"
          ? "Lay-n-Go Lifestyle product details"
          : variant === "lite-18"
            ? "Lay-n-Go Lite product details"
            : "Lay-n-Go Large product details"
      }
    >
      {editorMode ? (
        <div className="sticky top-0 z-[250] mb-4 border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Callout edit mode</strong> — drag dots on the mat and drag detail photos. Then Save layout.
        </div>
      ) : null}

      {/* Mobile */}
      <div
        className={cn(
          "flex flex-col items-center gap-2 md:hidden",
          diagramUsesLifestyleChrome(variant) && "gap-3 pb-6",
        )}
      >
        <img
          src={config.heroSrc}
          alt={config.heroAlt}
          className={cn(
            "w-full object-contain",
            config.mobileHeroMaxClass,
            diagramUsesLifestyleChrome(variant) && "rounded-xl bg-white",
          )}
          loading="lazy"
          decoding="async"
        />
        <DiameterLine
          inches={config.diameterInches}
          variant={variant}
          className={cn(
            "w-full",
            config.mobileHeroMaxClass,
            diagramUsesLifestyleChrome(variant) && "mt-2 shrink-0 pb-1",
          )}
        />
        {(["cord", "mesh", "lip"] as CalloutKey[]).map((k) => {
          const m = CALLOUT_META[k];
          const thumb = (
            <div
              className={cn(
                "aspect-square shrink-0 overflow-hidden rounded-full",
                CALLOUT_THUMB_SHADOW,
                diagramUsesLifestyleChrome(variant) ? "ring-0" : "ring-2 ring-neutral-100",
                diagramUsesLifestyleChrome(variant) && k === "cord" ? "h-28 w-28" : "h-32 w-32",
              )}
            >
              <img
                src={
                  k === "cord"
                    ? config.cordCalloutSrc
                    : k === "lip"
                      ? config.lipCalloutSrc
                      : config.meshCalloutSrc
                }
                alt={m.imageAlt}
                className={cn(
                  "h-full w-full object-cover object-center",
                  diagramUsesLifestyleChrome(variant) && k === "cord" && "origin-center scale-[1.26] object-[center_18%]",
                  diagramUsesLifestyleChrome(variant) && k === "lip" && "origin-center scale-[1.24] object-[30%_center]",
                  diagramUsesLifestyleChrome(variant) && k === "mesh" && "origin-center scale-[1.24] object-[58%_center]",
                )}
                loading="lazy"
                decoding="async"
              />
            </div>
          );
          const label = (
            <p className="max-w-xs text-center font-heading text-xs font-bold uppercase leading-snug text-neutral-900">
              {calloutLabelForVariant(k, variant)}
            </p>
          );

          if (diagramUsesLifestyleChrome(variant) && k === "cord") {
            return (
              <div key={k} className="flex w-full flex-col items-center gap-1.5 px-2">
                {label}
                <div className="h-5 w-px shrink-0 bg-neutral-900 sm:h-6" aria-hidden />
                <div className="relative shrink-0">
                  {thumb}
                  <div
                    className="pointer-events-none absolute left-1/2 top-0 z-[1] w-px -translate-x-1/2 bg-neutral-900"
                    style={{ bottom: "calc(14% + 10px)" }}
                    aria-hidden
                  />
                </div>
              </div>
            );
          }

          return (
            <div key={k} className="flex flex-col items-center gap-2 px-2">
              {thumb}
              {label}
            </div>
          );
        })}
      </div>

      {/* Desktop */}
      <div
        className={cn(
          "mx-auto hidden w-full max-w-[1100px] md:block md:px-2",
          diagramUsesLifestyleChrome(variant) && "pb-10 md:pb-12",
        )}
      >
        <div
          ref={containerRef}
          className={cn(
            "relative mx-auto w-full",
            config.containerMinHClass,
            diagramUsesLifestyleChrome(variant) && "rounded-xl bg-white",
          )}
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
            {lineEnds.map(({ k, x1, y1, x2, y2, meshUpperStart, meshLowerStart, meshUpperEnd, meshLowerEnd }) =>
              k === "mesh" && meshUpperStart && meshLowerStart && meshUpperEnd && meshLowerEnd ? (
                <g key={k}>
                  {variant !== "lite-18" ? (
                    <>
                      <line
                        x1={meshUpperStart.x}
                        y1={meshUpperStart.y}
                        x2={meshUpperEnd.x}
                        y2={meshUpperEnd.y}
                        stroke="black"
                        strokeWidth="1.02"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <line
                        x1={meshUpperStart.x}
                        y1={meshUpperStart.y}
                        x2={meshUpperEnd.x}
                        y2={meshUpperEnd.y}
                        stroke="white"
                        strokeWidth="0.58"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </>
                  ) : null}
                  <line
                    x1={meshLowerStart.x}
                    y1={meshLowerStart.y}
                    x2={meshLowerEnd.x}
                    y2={meshLowerEnd.y}
                    stroke="black"
                    strokeWidth="1.02"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={meshLowerStart.x}
                    y1={meshLowerStart.y}
                    x2={meshLowerEnd.x}
                    y2={meshLowerEnd.y}
                    stroke="white"
                    strokeWidth="0.58"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ) : (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.34"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}
          </svg>

          {(() => {
            if (editorMode) return null;
            if (variant !== "large-60" && variant !== "lifestyle-44" && variant !== "lite-18") return null;
            const meshLe = lineEnds.find((le) => le.k === "mesh" && le.meshUpperStart);
            if (!meshLe?.meshUpperStart || !meshLe.meshLowerStart) return null;
            const pocketDotCls = cn(
              "absolute z-[25] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-900 bg-white shadow-md ring-1 ring-white",
              "h-3 w-3 pointer-events-none",
            );
            return (
              <>
                {variant !== "lite-18" ? (
                  <span
                    className={pocketDotCls}
                    style={{ left: `${meshLe.meshUpperStart.x}%`, top: `${meshLe.meshUpperStart.y}%` }}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={pocketDotCls}
                  style={{ left: `${meshLe.meshLowerStart.x}%`, top: `${meshLe.meshLowerStart.y}%` }}
                  aria-hidden
                />
              </>
            );
          })()}

          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
              config.heroWidthClass,
              diagramUsesLifestyleChrome(variant) && "rounded-lg bg-white",
            )}
          >
            <img
              src={config.heroSrc}
              alt={config.heroAlt}
              className={cn(
                "relative z-10 w-full object-contain",
                diagramUsesLifestyleChrome(variant) && "rounded-lg bg-white",
              )}
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
            if (k === "mesh" && !editorMode) return null;
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
              variant={variant}
              imageSrcOverride={
                k === "cord"
                  ? config.cordCalloutSrc
                  : k === "lip"
                    ? config.lipCalloutSrc
                    : k === "mesh"
                      ? config.meshCalloutSrc
                      : undefined
              }
            />
          ))}
        </div>

        <div className={config.dimensionWrapClass}>
          <DiameterLine inches={config.diameterInches} variant={variant} />
        </div>
      </div>

      {editorMode ? (
        <LargeCalloutEditorToolbar
          getLayout={() => layoutRef.current}
          storageKey={config.storageKey}
          layoutSyncEvent={config.layoutEvent}
        />
      ) : null}
    </div>
  );
}
