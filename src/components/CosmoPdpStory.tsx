import { useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DEFAULT_EVERYTHING_PTS,
  DEFAULT_PACKUP_PTS,
  everythingPathFromPts,
  loadEverythingPtsFromStorage,
  loadPackupPtsFromStorage,
  packupPathFromPts,
  saveEditorPtsToStorage,
} from "@/data/cosmoArrowEditorModel";
import { readCosmoStoryArrowPath } from "@/data/cosmoPdpStoryArrows";
import { Button } from "@/components/ui/button";
import { CosmoEverythingArrowHandles, CosmoPackupArrowHandles } from "@/components/CosmoStoryArrowEditorHandles";

/**
 * Editorial strip below Cosmo PDP hero — flush edges, white field matching photo backs,
 * dotted arrows drawn over images toward bag details.
 *
 * Edit arrows on the real PDP: add <code>?editArrows=1</code> to the URL, drag dots, Save.
 * Or use <code>/dev/cosmo-arrows</code> for the abstract grid. Permanent paths: <code>cosmoPdpStoryArrows.ts</code>.
 */

const COSMO_STORY_HEADLINE = "Forget everything you knew about a makeup bag.";

/** Dotted arrow; `pathD` is SVG path in 0–100 viewBox (see `src/data/cosmoPdpStoryArrows.ts`). */
function ArrowOverlay({
  pathD,
  markerId,
  emphasize,
}: {
  pathD: string;
  markerId: string;
  emphasize?: boolean;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full text-foreground"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker
          id={markerId}
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={emphasize ? 1.15 : 0.9}
        strokeDasharray="3 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

function useCosmoStoryArrowPaths() {
  const [paths, setPaths] = useState(() => ({
    everything: readCosmoStoryArrowPath("everything"),
    packup: readCosmoStoryArrowPath("packup"),
  }));

  useEffect(() => {
    const sync = () => {
      setPaths({
        everything: readCosmoStoryArrowPath("everything"),
        packup: readCosmoStoryArrowPath("packup"),
      });
    };
    sync();
    window.addEventListener("cosmo-arrows-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cosmo-arrows-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return paths;
}

function CosmoStoryArrowEditorToolbar({
  everythingPts,
  packupPts,
}: {
  everythingPts: import("@/data/cosmoArrowEditorModel").EverythingPts;
  packupPts: import("@/data/cosmoArrowEditorModel").PackupPts;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const save = () => {
    const ed = everythingPathFromPts(everythingPts);
    const pd = packupPathFromPts(packupPts);
    try {
      localStorage.setItem("cosmo-story-arrow-everything-d", ed);
      localStorage.setItem("cosmo-story-arrow-packup-d", pd);
      saveEditorPtsToStorage(everythingPts, packupPts);
      window.dispatchEvent(new Event("cosmo-arrows-updated"));
      toast.success("Saved arrows for this browser");
    } catch {
      toast.error("Could not save");
    }
  };

  const copy = async () => {
    const ed = everythingPathFromPts(everythingPts);
    const pd = packupPathFromPts(packupPts);
    const text = `everything:\n${ed}\n\npackup:\n${pd}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied SVG path strings");
    } catch {
      toast.error("Clipboard unavailable");
    }
  };

  const exit = () => {
    const params = new URLSearchParams(location.search);
    params.delete("editArrows");
    const s = params.toString();
    navigate({ pathname: location.pathname, search: s ? `?${s}` : "" }, { replace: true });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:left-1/2 md:right-auto md:mx-auto md:w-[min(100%,42rem)] md:-translate-x-1/2 md:rounded-t-xl md:border-x md:border-t">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" size="sm" onClick={save}>
          Save to this browser
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={copy}>
          Copy SVG paths
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={exit}>
          Done editing
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag dots on the photos below. Screenshot for reference — paste paths into{" "}
        <code className="rounded bg-muted px-1 font-mono text-[10px]">cosmoPdpStoryArrows.ts</code> for production.
      </p>
    </div>
  );
}

export type CosmoPdpStoryProps = {
  /** When true, shows draggable handles on story images + bottom toolbar (`?editArrows=1` on PDP). */
  editorMode?: boolean;
};

export function CosmoPdpStory({ editorMode = false }: CosmoPdpStoryProps) {
  const livePaths = useCosmoStoryArrowPaths();
  const [editEverythingPts, setEditEverythingPts] = useState(DEFAULT_EVERYTHING_PTS);
  const [editPackupPts, setEditPackupPts] = useState(DEFAULT_PACKUP_PTS);

  useEffect(() => {
    if (!editorMode) return;
    setEditEverythingPts(loadEverythingPtsFromStorage() ?? DEFAULT_EVERYTHING_PTS);
    setEditPackupPts(loadPackupPtsFromStorage() ?? DEFAULT_PACKUP_PTS);
  }, [editorMode]);

  const arrowPaths = editorMode
    ? {
        everything: everythingPathFromPts(editEverythingPts),
        packup: packupPathFromPts(editPackupPts),
      }
    : livePaths;

  const rawId = useId().replace(/:/g, "");
  const markerEverything = `cosmo-arr-ev-${rawId}`;
  const markerPackup = `cosmo-arr-pu-${rawId}`;

  return (
    <>
      {editorMode ? (
        <div className="sticky top-0 z-[250] border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm">
          <strong>Arrow edit mode</strong> — drag the dots on &ldquo;Everything in view&rdquo; and &ldquo;Pack up in
          seconds.&rdquo; Then Save or screenshot for your team.
        </div>
      ) : null}

      <section
        className="relative left-1/2 -ml-[50vw] w-screen bg-white text-foreground"
        aria-labelledby="cosmo-story-intro"
      >
        {/* Block 1 — mobile: headline full bleed width; desktop: image | headline + bullets */}
        <div className="py-10 sm:py-12 md:flex md:flex-row md:flex-nowrap md:items-center md:gap-9 lg:gap-10 lg:py-14">
          <p id="cosmo-story-intro" className="sr-only">
            {COSMO_STORY_HEADLINE}
          </p>
          <p
            className="px-4 text-center font-heading text-[clamp(1.85rem,9vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground md:hidden"
            aria-hidden
          >
            {COSMO_STORY_HEADLINE}
          </p>

          <div className="mt-6 flex flex-row flex-nowrap items-center gap-4 px-4 sm:gap-6 md:mt-0 md:flex-1 md:gap-9 md:px-0 lg:gap-10">
            <div className="w-[clamp(132px,38vw,220px)] shrink-0 md:w-[clamp(148px,34vw,340px)]">
              <img
                src="/cosmo-pdp/story/image1.png"
                alt=""
                className="block h-auto w-full max-w-none"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1 md:pr-8">
              <p
                className="hidden font-heading text-[clamp(1.35rem,5.8vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground lg:text-[clamp(1.75rem,5vw,4.75rem)] lg:leading-[0.9] md:block"
                aria-hidden
              >
                {COSMO_STORY_HEADLINE}
              </p>
              <ul className="mt-0 max-w-2xl list-disc space-y-2 pl-4 text-xs leading-snug text-neutral-600 marker:text-neutral-400 max-md:pl-3 md:mt-4 sm:pl-5 sm:text-sm md:text-[0.9375rem] md:leading-relaxed">
                <li>
                  <span className="font-medium text-neutral-700">Fast, mess-free cleanup:</span> Lay it flat for full
                  visibility, then cinch it closed in seconds so there is no more digging or clutter
                </li>
                <li>
                  <span className="font-medium text-neutral-700">Smart travel organization:</span> Built-in pockets,
                  brush loops, and raised edges keep everything secure and in place on the go
                </li>
                <li>
                  <span className="font-medium text-neutral-700">Durable, water-resistant and machine washable:</span>{" "}
                  Made to handle daily use and easy to clean, just toss it in the wash
                </li>
                <li>
                  <span className="font-medium text-neutral-700">Perfect gift option:</span> Stylish, practical, and a
                  thoughtful choice for any occasion
                </li>
                <li>
                  <span className="font-medium text-neutral-700">Designed for everyday use:</span> Holds full-size makeup,
                  brushes, skincare, and toiletries with ease
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          <article className="relative bg-white">
            <div className="pointer-events-none absolute left-3 top-4 z-10 max-w-[min(92%,320px)] sm:left-6 sm:top-6 md:max-w-[48%]">
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
                Everything in view.
              </h2>
              <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
                Light and flat. See every brush, balm, and bauble at once.
              </p>
            </div>
            <div className="flex w-full justify-center">
              <div className="relative mx-auto w-full max-w-[min(100%,620px)]">
                <img
                  src="/cosmo-pdp/story/image2.png"
                  alt=""
                  className="block h-auto w-full object-contain object-bottom max-md:max-h-[min(72vh,560px)] md:max-h-[min(68vh,540px)]"
                  loading="lazy"
                />
                <ArrowOverlay
                  pathD={arrowPaths.everything}
                  markerId={markerEverything}
                  emphasize={editorMode}
                />
                {editorMode ? (
                  <CosmoEverythingArrowHandles pts={editEverythingPts} setPts={setEditEverythingPts} />
                ) : null}
              </div>
            </div>
          </article>

          <article className="relative flex w-full flex-col bg-white md:items-end">
            <div className="pointer-events-none absolute left-3 top-4 z-20 max-w-[11rem] text-left sm:left-4 sm:top-5 sm:max-w-[13rem] md:left-4 md:top-6 md:max-w-[15rem] lg:max-w-[17rem]">
              <h2 className="font-heading text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl md:text-2xl">
                Pack up in seconds.
              </h2>
              <p className="mt-1 text-xs leading-snug text-neutral-700 sm:text-sm md:text-base">
                Cinch the cord and you&apos;re out the door. No digging, no dumping.
              </p>
            </div>
            <div className="flex w-full justify-end self-end pr-0">
              <div className="relative ml-auto mr-0 w-full max-md:max-w-[min(54vw,226px)] md:max-w-[min(48vw,332px)] lg:max-w-[360px]">
                <img
                  src="/cosmo-pdp/story/image3.png"
                  alt=""
                  className="block h-auto w-full object-contain object-bottom object-right max-md:max-h-[min(17vh,156px)] md:max-h-[min(38vh,312px)] lg:max-h-[336px]"
                  loading="lazy"
                />
                <ArrowOverlay pathD={arrowPaths.packup} markerId={markerPackup} emphasize={editorMode} />
                {editorMode ? (
                  <CosmoPackupArrowHandles pts={editPackupPts} setPts={setEditPackupPts} />
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>

      {editorMode ? (
        <CosmoStoryArrowEditorToolbar everythingPts={editEverythingPts} packupPts={editPackupPts} />
      ) : null}
    </>
  );
}
