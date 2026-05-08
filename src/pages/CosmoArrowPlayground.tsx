import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  COSMO_STORY_ARROW_PATH_DEFAULT,
  clearCosmoStoryArrowOverrides,
  type CosmoStoryArrowVariant,
} from "@/data/cosmoPdpStoryArrows";
import {
  clamp,
  DEFAULT_EVERYTHING_PTS,
  DEFAULT_PACKUP_PTS,
  everythingPathFromPts,
  packupPathFromPts,
  type EverythingPts,
  type PackupPts,
} from "@/data/cosmoArrowEditorModel";

/**
 * Dev tool: drag arrow handles, save to localStorage, see results on any Cosmo PDP in this browser.
 */
export default function CosmoArrowPlayground() {
  const [everythingD, setEverythingD] = useState<string>(COSMO_STORY_ARROW_PATH_DEFAULT.everything);
  const [packupD, setPackupD] = useState<string>(COSMO_STORY_ARROW_PATH_DEFAULT.packup);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-10">
        <div className="mb-8 space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Cosmo story — arrow editor</h1>
          <p className="text-sm text-muted-foreground">
            Drag the colored dots. Save loads arrows on Cosmo PDPs in <strong>this browser only</strong>. For
            production, copy each path into{" "}
            <code className="rounded bg-muted px-1 text-xs">src/data/cosmoPdpStoryArrows.ts</code> as{" "}
            <code className="rounded bg-muted px-1 text-xs">COSMO_STORY_ARROW_PATH_DEFAULT</code>.
          </p>
          <p className="text-sm">
            <Link
              to="/product/lay-n-go-cosmo-20?editArrows=1"
              className="text-primary underline-offset-4 hover:underline"
            >
              Example: Cosmo 20″ PDP (arrow edit mode)
            </Link>
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <LiveEditorPanel variant="everything" title="Everything in view" onPathChange={setEverythingD} />
          <LiveEditorPanel variant="packup" title="Pack up in seconds" onPathChange={setPackupD} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem("cosmo-story-arrow-everything-d", everythingD);
                localStorage.setItem("cosmo-story-arrow-packup-d", packupD);
                window.dispatchEvent(new Event("cosmo-arrows-updated"));
              } catch {
                /* ignore */
              }
            }}
          >
            Save both to this browser
          </Button>
          <Button type="button" variant="outline" onClick={() => clearCosmoStoryArrowOverrides()}>
            Clear browser overrides
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function LiveEditorPanel({
  variant,
  title,
  onPathChange,
}: {
  variant: CosmoStoryArrowVariant;
  title: string;
  onPathChange: (d: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [everything, setEverything] = useState<EverythingPts>(DEFAULT_EVERYTHING_PTS);
  const [packup, setPackup] = useState<PackupPts>(DEFAULT_PACKUP_PTS);
  const [drag, setDrag] = useState<{ key: string } | null>(null);

  const pathD = useMemo(
    () =>
      variant === "everything" ? everythingPathFromPts(everything) : packupPathFromPts(packup),
    [variant, everything, packup],
  );

  useEffect(() => {
    onPathChange(pathD);
  }, [pathD, onPathChange]);

  const setPt = useCallback(
    (key: string, x: number, y: number) => {
      const nx = clamp(x, 0, 100);
      const ny = clamp(y, 0, 100);
      if (variant === "everything") {
        setEverything((prev) => {
          const next = { ...prev };
          if (key === "m") next.m = { x: nx, y: ny };
          if (key === "c1") next.c1 = { x: nx, y: ny };
          if (key === "c2") next.c2 = { x: nx, y: ny };
          if (key === "ce") next.ce = { x: nx, y: ny };
          if (key === "tq") next.tq = { x: nx, y: ny };
          if (key === "end") next.end = { x: nx, y: ny };
          return next;
        });
      } else {
        setPackup((prev) => {
          const next = { ...prev };
          if (key === "m") next.m = { x: nx, y: ny };
          if (key === "q") next.q = { x: nx, y: ny };
          if (key === "end") next.end = { x: nx, y: ny };
          return next;
        });
      }
    },
    [variant],
  );

  const clientToSvg = useCallback((ev: React.PointerEvent) => {
    const el = svgRef.current;
    if (!el) return { x: 0, y: 0 };
    const ctm = el.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const pt = el.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  const onPointerMove = useCallback(
    (ev: React.PointerEvent) => {
      if (!drag) return;
      const { x, y } = clientToSvg(ev);
      setPt(drag.key, x, y);
    },
    [drag, clientToSvg, setPt],
  );

  const stopDrag = useCallback(() => setDrag(null), []);

  const handles =
    variant === "everything"
      ? (["m", "c1", "c2", "ce", "tq", "end"] as const).map((key) => ({
          key,
          pt: everything[key],
          label:
            key === "m"
              ? "Start"
              : key === "c1"
                ? "C1"
                : key === "c2"
                  ? "C2"
                  : key === "ce"
                    ? "C end"
                    : key === "tq"
                      ? "Tail curve"
                      : "Arrow tip",
        }))
      : (["m", "q", "end"] as const).map((key) => ({
          key,
          pt: packup[key],
          label: key === "m" ? "Start" : key === "q" ? "Curve" : "Arrow tip",
        }));

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">Drag the dots. Coordinates are 0–100 like the live story SVG.</p>
      <div className="relative mt-4 aspect-square w-full max-w-md overflow-hidden rounded-md border border-border bg-white">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="h-full w-full touch-none"
          onPointerLeave={stopDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onPointerMove={onPointerMove}
        >
          <rect width="100" height="100" fill="#fafafa" />
          {[0, 25, 50, 75].map((g) => (
            <g key={g} className="text-neutral-200" stroke="currentColor" strokeWidth={0.15}>
              <line x1={g} y1="0" x2={g} y2="100" />
              <line x1="0" y1={g} x2="100" y2={g} />
            </g>
          ))}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.85}
            strokeDasharray="3 5"
            strokeLinecap="round"
            className="text-foreground"
          />
          {handles.map(({ key, pt, label }) => (
            <g key={key}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3.2}
                className="cursor-grab fill-primary stroke-[2px] stroke-white active:cursor-grabbing"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDrag({ key });
                }}
              />
              <title>{label}</title>
            </g>
          ))}
        </svg>
      </div>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Path <code className="text-foreground">d</code>
        <textarea
          readOnly
          className="mt-1 block h-16 w-full resize-none rounded border border-input bg-muted/40 px-2 py-1.5 font-mono text-[11px] leading-snug text-foreground"
          value={pathD}
        />
      </label>
    </div>
  );
}
