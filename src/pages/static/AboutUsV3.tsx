import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ABOUT_US_V3_TAPE_LAYOUT_SYNC_EVENT,
  type AboutUsV3TapeLayoutState,
  type PanelTapeLayout,
  type TapePlacement,
  getPanelTapeLayout,
  loadAboutUsV3TapeLayout,
  panelTapeKey,
  saveAboutUsV3TapeLayout,
} from "@/lib/aboutUsV3TapeLayout";
import { toast } from "sonner";

type StoryPanel = {
  src: string;
  title: string;
  alt: string;
  storyText: string;
  imagePosition?: string;
  layoutOverride?: {
    text: "left" | "right";
  };
  downloadUrl?: string;
  downloadFileName?: string;
};

type StoryChapter = {
  heading: string;
  /** When true, the large chapter title (e.g. "They meet") is not shown above the panels. */
  hideHeading?: boolean;
  panels: StoryPanel[];
};

const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/1200/640`;

const ABOUT_US_V2_ASSET_VER = "5";
const aboutUsV2Png = (filename: string) => `/about-us-v2/${filename}?v=${ABOUT_US_V2_ASSET_VER}`;

const CHAPTERS: StoryChapter[] = [
  {
    heading: "They meet",
    hideHeading: true,
    panels: [
      {
        src: aboutUsV2Png("founders-southside-painting.png"),
        title: "Love at first sight",
        alt: "Amy and Adam at Southside 815",
        storyText:
          "On February 1, 1999, Amy walked into Southside 815 in Alexandria, Virginia, and caught Adam's eye immediately. A mutual friend introduced them, and four hours of conversation went by like it was 20 minutes. Adam walked Amy home that evening — meeting her two golden retrievers, Maggie & Molson — and they made plans to see Gil Scott-Heron at the legendary Blues Alley two days later. Both Amy and Adam had found their missing piece.\n\n22 years later, for Amy's 50th birthday, Adam had famed Alexandria painter and close friend Judy Heiser, memorialize the exact moment before both of their lives changed.",
      },
      {
        src: aboutUsV2Png("they-meet-world-travelers-maggie-molson.png"),
        title: "World Travelers",
        alt: "Maggie and Molson greeting the founders after a trip",
        imagePosition: "22% 16%",
        layoutOverride: { text: "right" },
        storyText:
          "Before starting a family, the Lay-n-Go founders were avid travelers, with their dogs faithfully waiting to welcome them back. Those adventures became invaluable field research, inspiring new products designed to make life easier at home and on the go!",
      },
      {
        src: aboutUsV2Png("they-meet-wedding-toast-wide.png"),
        title: "It's official",
        alt: "Amy and Adam's wedding toast",
        imagePosition: "82% 42%",
        downloadUrl: "/about-us-v2/they-meet-wedding-toast-wide.png",
        downloadFileName: "its-official-wedding-toast.png",
        storyText:
          "On April 21, 2001, Amy and Adam tied the knot in Baltimore, Maryland. Surrounded by family and their closest friends, they danced the night away until it was time to leave for the airport. The adventure was underway...they had no idea how crazy it was about to get!",
      },
    ],
  },
  {
    heading: "They have a family",
    hideHeading: true,
    panels: [
      {
        src: PLACEHOLDER("lng-about-04"),
        title: "Growing household energy",
        alt: "Growing household energy",
        storyText: "Growing household energy",
      },
      {
        src: PLACEHOLDER("lng-about-05"),
        title: "Kids dive into creative play",
        alt: "Kids dive into creative play",
        storyText: "Kids dive into creative play",
      },
      {
        src: PLACEHOLDER("lng-about-06"),
        title: "Weekends together at home",
        alt: "Weekends together at home",
        storyText: "Weekends together at home",
      },
    ],
  },
  {
    heading: "They have a mess",
    panels: [
      {
        src: PLACEHOLDER("lng-about-07"),
        title: "Toys spread wall to wall",
        alt: "Toys spread wall to wall",
        storyText: "Toys spread wall to wall",
      },
      {
        src: PLACEHOLDER("lng-about-08"),
        title: "Small pieces everywhere",
        alt: "Small pieces everywhere",
        storyText: "Small pieces everywhere",
      },
      {
        src: PLACEHOLDER("lng-about-09"),
        title: "Cleanup takes forever",
        alt: "Cleanup takes forever",
        storyText: "Cleanup takes forever",
      },
    ],
  },
  {
    heading: "They have an idea",
    panels: [
      {
        src: PLACEHOLDER("lng-about-10"),
        title: "Sketch on the placemat",
        alt: "Sketch on the placemat",
        storyText: "Sketch on the placemat",
      },
      {
        src: PLACEHOLDER("lng-about-11"),
        title: "First Lay-n-Go prototype",
        alt: "First Lay-n-Go prototype",
        storyText: "First Lay-n-Go prototype",
      },
      {
        src: PLACEHOLDER("lng-about-12"),
        title: "Family tests the drawstring",
        alt: "Family tests the drawstring",
        storyText: "Family tests the drawstring",
      },
    ],
  },
  {
    heading: "They start a business, earn 8 patents, and gain the best customers ever",
    panels: [
      { src: PLACEHOLDER("lng-about-13"), title: "Original LARGE play mat launch", alt: "Original LARGE play mat launch", storyText: "Original LARGE play mat launch" },
      { src: PLACEHOLDER("lng-about-14"), title: "LITE personal size ships", alt: "LITE personal size ships", storyText: "LITE personal size ships" },
      { src: PLACEHOLDER("lng-about-15"), title: "COSMO cosmetic line grows", alt: "COSMO cosmetic line grows", storyText: "COSMO cosmetic line grows" },
      { src: PLACEHOLDER("lng-about-16"), title: "Utility patents awarded", alt: "Utility patents awarded", storyText: "Utility patents awarded" },
      { src: PLACEHOLDER("lng-about-17"), title: "Retail partners nationwide", alt: "Retail partners nationwide", storyText: "Retail partners nationwide" },
      { src: PLACEHOLDER("lng-about-18"), title: "Fans worldwide today", alt: "Fans worldwide today", storyText: "Fans worldwide today" },
      { src: PLACEHOLDER("lng-about-19"), title: "Early trade-show booth hustle", alt: "Early trade-show booth hustle", storyText: "Early trade-show booth hustle" },
      { src: PLACEHOLDER("lng-about-20"), title: "First wholesale catalog spread", alt: "First wholesale catalog spread", storyText: "First wholesale catalog spread" },
      { src: PLACEHOLDER("lng-about-21"), title: "Machine-wash milestone celebrate", alt: "Machine-wash milestone celebrate", storyText: "Machine-wash milestone celebrate" },
      { src: PLACEHOLDER("lng-about-22"), title: "Traveler line meets commuters", alt: "Traveler line meets commuters", storyText: "Traveler line meets commuters" },
      { src: PLACEHOLDER("lng-about-23"), title: "Pet solutions hit the road", alt: "Pet solutions hit the road", storyText: "Pet solutions hit the road" },
      { src: PLACEHOLDER("lng-about-24"), title: "WIRED tech pouch debut", alt: "WIRED tech pouch debut", storyText: "WIRED tech pouch debut" },
    ],
  },
  {
    heading: "They give back",
    panels: [
      {
        src: PLACEHOLDER("lng-giveback-01"),
        title: "Local charity partner spotlight",
        alt: "Local charity partner spotlight",
        storyText: "Local charity partner spotlight",
      },
      {
        src: PLACEHOLDER("lng-giveback-02"),
        title: "School supply drive drop-off",
        alt: "School supply drive drop-off",
        storyText: "School supply drive drop-off",
      },
      {
        src: PLACEHOLDER("lng-giveback-03"),
        title: "Team volunteer day together",
        alt: "Team volunteer day together",
        storyText: "Team volunteer day together",
      },
    ],
  },
  {
    heading: "Then and now… our first models",
    panels: [
      { src: PLACEHOLDER("lng-models-andrew-1"), title: "Andrew — early play-mat days", alt: "Andrew — early play-mat days", storyText: "Andrew — early play-mat days" },
      { src: PLACEHOLDER("lng-models-andrew-2"), title: "Andrew — testing the cinch", alt: "Andrew — testing the cinch", storyText: "Andrew — testing the cinch" },
      { src: PLACEHOLDER("lng-models-andrew-3"), title: "Andrew — today", alt: "Andrew — today", storyText: "Andrew — today" },
      { src: PLACEHOLDER("lng-models-miles-1"), title: "Miles — early play-mat days", alt: "Miles — early play-mat days", storyText: "Miles — early play-mat days" },
      { src: PLACEHOLDER("lng-models-miles-2"), title: "Miles — LEGO cleanup champion", alt: "Miles — LEGO cleanup champion", storyText: "Miles — LEGO cleanup champion" },
      { src: PLACEHOLDER("lng-models-miles-3"), title: "Miles — today", alt: "Miles — today", storyText: "Miles — today" },
      { src: PLACEHOLDER("lng-models-caden-1"), title: "Caden — early play-mat days", alt: "Caden — early play-mat days", storyText: "Caden — early play-mat days" },
      { src: PLACEHOLDER("lng-models-caden-2"), title: "Caden — weekend adventures", alt: "Caden — weekend adventures", storyText: "Caden — weekend adventures" },
      { src: PLACEHOLDER("lng-models-caden-3"), title: "Caden — today", alt: "Caden — today", storyText: "Caden — today" },
    ],
  },
];

function storyTeaser(text: string, maxLength: number): string {
  const firstParagraph = text.split("\n\n")[0]?.trim() ?? text;
  if (firstParagraph.length <= maxLength) {
    return firstParagraph.endsWith("...") ? firstParagraph : `${firstParagraph}...`;
  }
  const trimmed = firstParagraph.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${trimmed}...`;
}

const STORY_TEASER_MOBILE_MAX = 58;
const STORY_TEASER_DESKTOP_MAX = 130;

function TapeTextbox({
  children,
  tilt = "left",
  className,
}: {
  children: string;
  tilt?: "left" | "right";
  className?: string;
}) {
  return (
    <span className={cn("tape-textbox", tilt === "right" ? "tape-textbox--tilt-right" : "tape-textbox--tilt-left", className)}>
      <span className="tape-textbox__body">{children}</span>
      <span aria-hidden className="tape-textbox__curl" />
    </span>
  );
}

function StoryTeaser({
  text,
  maxLength,
  fadeRight,
  className,
}: {
  text: string;
  maxLength: number;
  fadeRight: boolean;
  className?: string;
}) {
  return (
    <p className={cn("mt-3 max-w-prose", fadeRight ? "text-left" : "ml-auto text-right", className)}>
      <TapeTextbox tilt={fadeRight ? "left" : "right"}>{storyTeaser(text, maxLength)}</TapeTextbox>
    </p>
  );
}

function TapeStoryModal({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="tape-sheet mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Full story"
      >
        <div className="tape-sheet__body">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-[3] flex h-8 w-8 items-center justify-center rounded-full font-story text-lg font-bold text-foreground/55 transition-colors hover:bg-black/5 hover:text-foreground"
          >
            ✕
          </button>
          <div className="relative z-[1] space-y-4 pr-6 font-story text-base font-bold leading-relaxed text-foreground/90 sm:text-lg">
            {text.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <span aria-hidden className="tape-sheet__curl" />
        <span aria-hidden className="tape-sheet__curl tape-sheet__curl--left" />
      </div>
    </div>
  );
}

const PANEL_TEXT_SHADOW =
  "[text-shadow:0_1px_3px_rgb(0_0_0/0.95),0_2px_14px_rgb(0_0_0/0.75),0_4px_28px_rgb(0_0_0/0.45)]";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildPanelTapeMeta() {
  const keys: string[] = [];
  const textRightByKey: Record<string, boolean> = {};
  let index = 0;

  for (const chapter of CHAPTERS) {
    for (const panel of chapter.panels) {
      const key = panelTapeKey(chapter.heading, panel.title);
      keys.push(key);
      textRightByKey[key] = panel.layoutOverride?.text ? panel.layoutOverride.text === "right" : index % 2 === 1;
      index += 1;
    }
  }

  return { keys, textRightByKey };
}

function DraggableCornerTape({
  label,
  placement,
  editorMode,
  stageRef,
  onChange,
}: {
  label: string;
  placement: TapePlacement;
  editorMode: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  onChange: (next: TapePlacement) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <span
      aria-hidden
      className={cn("panel-corner-tape", editorMode && "panel-corner-tape--editable")}
      style={{
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        transform: `rotate(${placement.rotate}deg)`,
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
        const rect = stageRef.current.getBoundingClientRect();
        onChange({
          ...placement,
          x: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
          y: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
        });
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {editorMode ? (
        <span className="absolute -top-5 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-950 shadow-sm">
          {label}
        </span>
      ) : null}
    </span>
  );
}

function PanelCornerTapes({
  near,
  far,
  editorMode,
  stageRef,
  onTapeChange,
}: {
  near: TapePlacement;
  far: TapePlacement;
  editorMode: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  onTapeChange: (which: "near" | "far", next: TapePlacement) => void;
}) {
  return (
    <>
      <DraggableCornerTape
        label="Near tape"
        placement={near}
        editorMode={editorMode}
        stageRef={stageRef}
        onChange={(next) => onTapeChange("near", next)}
      />
      <DraggableCornerTape
        label="Far tape"
        placement={far}
        editorMode={editorMode}
        stageRef={stageRef}
        onChange={(next) => onTapeChange("far", next)}
      />
    </>
  );
}

function TapeEditorToolbar({
  getLayout,
  onDone,
}: {
  getLayout: () => AboutUsV3TapeLayoutState;
  onDone: () => void;
}) {
  const save = () => {
    try {
      saveAboutUsV3TapeLayout(getLayout());
      toast.success("Saved corner tape layout in this browser");
    } catch {
      toast.error("Could not save");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getLayout(), null, 2));
      toast.success("Copied tape layout JSON");
    } catch {
      toast.error("Clipboard unavailable");
    }
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
        <Button type="button" size="sm" variant="secondary" onClick={onDone}>
          Done editing
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag each tape strip on a panel. Near tape sits on the text side; far tape is the opposite diagonal.
      </p>
    </div>
  );
}

function StoryFadePanel({
  panel,
  index,
  tapeLayout,
  editorMode,
  onTapeLayoutChange,
}: {
  panel: StoryPanel;
  index: number;
  tapeLayout: PanelTapeLayout;
  editorMode: boolean;
  onTapeLayoutChange: (next: PanelTapeLayout) => void;
}) {
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRight = panel.layoutOverride?.text ? panel.layoutOverride.text === "right" : index % 2 === 1;

  const verticalEdgeMask =
    "linear-gradient(to bottom, transparent 0%, black 2.5%, black 97.5%, transparent 100%)";

  return (
    <>
      {open && <TapeStoryModal text={panel.storyText} onClose={() => setOpen(false)} />}
      <article className="relative w-full">
        <div
          ref={stageRef}
          className={cn(
            "relative h-[min(58vw,22rem)] w-full sm:h-[min(48vw,26rem)] md:h-[min(42vw,28rem)]",
            editorMode && "overflow-visible ring-2 ring-amber-300/70 ring-offset-2 ring-offset-background",
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={panel.src}
              alt={panel.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: panel.imagePosition ?? "center",
                WebkitMaskImage: verticalEdgeMask,
                maskImage: verticalEdgeMask,
              }}
              loading="lazy"
              decoding="async"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background)/0.28)_0%,transparent_3.5%,transparent_96.5%,hsl(var(--background)/0.28)_100%)]"
            />
          </div>
          <PanelCornerTapes
            near={tapeLayout.near}
            far={tapeLayout.far}
            editorMode={editorMode}
            stageRef={stageRef}
            onTapeChange={(which, next) =>
              onTapeLayoutChange({
                ...tapeLayout,
                [which]: next,
              })
            }
          />

          <div
            className={cn(
              "absolute inset-y-0 z-10 flex w-full max-w-xl flex-col justify-end px-6 pb-8 pt-16 sm:px-10 sm:pb-10 md:max-w-2xl md:px-12",
              textRight ? "right-0 items-end text-right" : "left-0 items-start text-left",
            )}
          >
            <h3
              className={cn(
                "font-heading text-[clamp(2.25rem,8.5vw,4.75rem)] font-black uppercase leading-[0.9] tracking-tight text-white",
                PANEL_TEXT_SHADOW,
              )}
            >
              {panel.title}
            </h3>
            <StoryTeaser
              text={panel.storyText}
              maxLength={STORY_TEASER_MOBILE_MAX}
              fadeRight={!textRight}
              className="max-w-[12.5rem] text-[0.95rem] leading-tight sm:hidden"
            />
            <StoryTeaser
              text={panel.storyText}
              maxLength={STORY_TEASER_DESKTOP_MAX}
              fadeRight={!textRight}
              className="mt-4 hidden text-[1.1rem] sm:block sm:text-[1.35rem]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "mt-5 w-fit rounded-full border-white/90 bg-transparent text-white hover:bg-white/15 hover:text-white",
                PANEL_TEXT_SHADOW,
              )}
              onClick={() => setOpen(true)}
            >
              View more
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

function AboutUsV3Intro() {
  return (
    <header className="py-12 text-center sm:py-14 md:py-16 lg:py-20">
      <p className="mx-auto max-w-4xl font-story text-[clamp(1.25rem,3.5vw,2.15rem)] font-bold leading-snug text-foreground">
        Let&apos;s face it, about us pages are boring. See the visuals for yourself.
      </p>
    </header>
  );
}

function ChapterHero({ heading }: { heading: string }) {
  return (
    <header className="py-14 sm:py-16 md:py-20 lg:py-24">
      <h2
        className={cn(
          "whitespace-pre-line text-balance font-heading font-black uppercase tracking-tight text-foreground",
          "text-[clamp(2rem,10vw,4.25rem)] leading-[0.92]",
          "md:text-[clamp(2.25rem,6.5vw,5rem)] md:leading-[0.9]",
        )}
      >
        {heading}
      </h2>
    </header>
  );
}

function StoryChapterSection({
  chapter,
  startIndex,
  editorMode,
  tapeLayout,
  onTapeLayoutChange,
}: {
  chapter: StoryChapter;
  startIndex: number;
  editorMode: boolean;
  tapeLayout: AboutUsV3TapeLayoutState;
  onTapeLayoutChange: (panelKey: string, next: PanelTapeLayout) => void;
}) {
  return (
    <section className="border-b border-border/40 last:border-b-0">
      {!chapter.hideHeading ? <ChapterHero heading={chapter.heading} /> : null}
      <div className="space-y-12 pb-14 sm:space-y-14 sm:pb-16 md:space-y-16 md:pb-20">
        {chapter.panels.map((panel, i) => {
          const panelKey = panelTapeKey(chapter.heading, panel.title);
          return (
            <StoryFadePanel
              key={panelKey}
              panel={panel}
              index={startIndex + i}
              tapeLayout={tapeLayout[panelKey] ?? getPanelTapeLayout(panelKey, (startIndex + i) % 2 === 1)}
              editorMode={editorMode}
              onTapeLayoutChange={(next) => onTapeLayoutChange(panelKey, next)}
            />
          );
        })}
      </div>
    </section>
  );
}

const AboutUsV3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editorMode = searchParams.get("editTapes") === "1" || searchParams.get("editTapes") === "true";

  const panelTapeMeta = useMemo(() => buildPanelTapeMeta(), []);
  const [tapeLayout, setTapeLayout] = useState<AboutUsV3TapeLayoutState>(() =>
    loadAboutUsV3TapeLayout(panelTapeMeta.keys, panelTapeMeta.textRightByKey),
  );
  const tapeLayoutRef = useRef(tapeLayout);
  tapeLayoutRef.current = tapeLayout;

  useEffect(() => {
    const sync = () => setTapeLayout(loadAboutUsV3TapeLayout(panelTapeMeta.keys, panelTapeMeta.textRightByKey));
    sync();
    window.addEventListener(ABOUT_US_V3_TAPE_LAYOUT_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ABOUT_US_V3_TAPE_LAYOUT_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [panelTapeMeta]);

  const toggleEditor = () => {
    const params = new URLSearchParams(location.search);
    if (editorMode) params.delete("editTapes");
    else params.set("editTapes", "1");
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
  };

  let panelIndex = 0;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main
        id="main-content"
        className={cn(
          "mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8",
          editorMode && "pb-28",
        )}
      >
        <div className="not-prose">
          <AboutUsV3Intro />
          <div className="mb-6 flex justify-end">
            <Button type="button" size="sm" variant="outline" onClick={toggleEditor}>
              {editorMode ? "Stop editing tapes" : "Edit corner tapes"}
            </Button>
          </div>
          {CHAPTERS.map((chapter) => {
            const section = (
              <StoryChapterSection
                key={chapter.heading}
                chapter={chapter}
                startIndex={panelIndex}
                editorMode={editorMode}
                tapeLayout={tapeLayout}
                onTapeLayoutChange={(panelKey, next) =>
                  setTapeLayout((prev) => ({
                    ...prev,
                    [panelKey]: next,
                  }))
                }
              />
            );
            panelIndex += chapter.panels.length;
            return section;
          })}
        </div>
      </main>
      <SiteFooter />
      {editorMode ? (
        <TapeEditorToolbar getLayout={() => tapeLayoutRef.current} onDone={toggleEditor} />
      ) : null}
    </div>
  );
};

export default AboutUsV3;
