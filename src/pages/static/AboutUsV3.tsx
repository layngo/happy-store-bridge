import { useState } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StoryPanel = {
  src: string;
  title: string;
  alt: string;
  storyText: string;
};

type StoryChapter = {
  heading: string;
  panels: StoryPanel[];
};

const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/1200/640`;

const ABOUT_US_V2_ASSET_VER = "3";
const aboutUsV2Png = (filename: string) => `/about-us-v2/${filename}?v=${ABOUT_US_V2_ASSET_VER}`;

const CHAPTERS: StoryChapter[] = [
  {
    heading: "They meet",
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
        storyText:
          "Before starting a family, the Lay-n-Go founders were avid travelers, with their dogs faithfully waiting to welcome them back. Those adventures became invaluable field research, inspiring new products designed to make life easier at home and on the go!",
      },
      {
        src: aboutUsV2Png("they-meet-wedding-toast.png"),
        title: "It's official",
        alt: "Amy and Adam's wedding toast",
        storyText:
          "On April 21, 2001, Amy and Adam tied the knot in Baltimore, Maryland. Surrounded by family and their closest friends, they danced the night away until it was time to leave for the airport. The adventure was underway...they had no idea how crazy it was about to get!",
      },
    ],
  },
  {
    heading: "They have a family",
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

function storyTeaser(text: string, maxLength = 130): string {
  const firstParagraph = text.split("\n\n")[0]?.trim() ?? text;
  if (firstParagraph.length <= maxLength) {
    return firstParagraph.endsWith("...") ? firstParagraph : `${firstParagraph}...`;
  }
  const trimmed = firstParagraph.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${trimmed}...`;
}

function AboutTextWindow({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={cn(
          "relative max-w-lg w-full rounded-2xl px-8 py-7 shadow-2xl",
          "bg-background/80 backdrop-blur-md border border-border/60",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full",
            "text-foreground/50 hover:text-foreground transition-colors",
            "bg-muted/60 hover:bg-muted",
          )}
        >
          ✕
        </button>
        <div className="space-y-3 pr-4">
          {text.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90 font-medium">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryFadePanel({ panel }: { panel: StoryPanel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AboutTextWindow text={panel.storyText} onClose={() => setOpen(false)} />}
      <article className="relative w-full">
        <div className="relative h-[min(58vw,22rem)] w-full overflow-hidden sm:h-[min(48vw,26rem)] md:h-[min(42vw,28rem)]">
          <img
            src={panel.src}
            alt={panel.alt}
            className="absolute inset-y-0 left-0 h-full w-[min(100%,52rem)] object-cover object-left"
            style={{
              WebkitMaskImage: "linear-gradient(to right, black 58%, transparent 92%)",
              maskImage: "linear-gradient(to right, black 58%, transparent 92%)",
            }}
            loading="lazy"
            decoding="async"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent from-[48%] via-background/35 via-[72%] to-background"
          />

          <div className="absolute inset-y-0 left-0 z-10 flex max-w-md flex-col justify-end px-6 pb-8 pt-16 sm:px-10 sm:pb-10 md:max-w-lg md:px-12">
            <h3 className="font-heading text-[clamp(1.35rem,4.5vw,2.15rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
              {panel.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/78 sm:text-base">{storyTeaser(panel.storyText)}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-5 w-fit rounded-full border-foreground/25 bg-background/70 px-5 backdrop-blur-sm hover:bg-background"
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

function StoryChapterSection({ chapter }: { chapter: StoryChapter }) {
  return (
    <section className="border-b border-border/40 last:border-b-0">
      <ChapterHero heading={chapter.heading} />
      <div className="space-y-12 pb-14 sm:space-y-14 sm:pb-16 md:space-y-16 md:pb-20">
        {chapter.panels.map((panel) => (
          <StoryFadePanel key={`${chapter.heading}-${panel.title}`} panel={panel} />
        ))}
      </div>
    </section>
  );
}

const AboutUsV3 = () => (
  <div className="flex min-h-dvh flex-col bg-background">
    <Header />
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
      <div className="not-prose">
        {CHAPTERS.map((chapter) => (
          <StoryChapterSection key={chapter.heading} chapter={chapter} />
        ))}
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default AboutUsV3;
