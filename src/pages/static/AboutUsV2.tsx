import { useState } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

type GridSlot = {
  src: string;
  caption: string;
  storyText?: string;
};

type GridSection = {
  heading: string;
  images: GridSlot[];
};

type GroupedSection = {
  heading: string;
  groups: { title: string; images: GridSlot[] }[];
};

type SectionBlock = GridSection | GroupedSection;

function isGroupedSection(block: SectionBlock): block is GroupedSection {
  return "groups" in block;
}

/** Square placeholder photography (picsum seeds = stable URLs). Replace with brand assets when ready. */
const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

/** Bump when you replace a file under `public/about-us-v2/` without renaming it (Lovable + browsers cache static URLs). */
const ABOUT_US_V2_ASSET_VER = "3";
const aboutUsV2Png = (filename: string) => `/about-us-v2/${filename}?v=${ABOUT_US_V2_ASSET_VER}`;

const SECTIONS: SectionBlock[] = [
  {
    heading: "They meet",
    images: [
      {
        src: aboutUsV2Png("founders-southside-painting.png"),
        caption: "It was love at first site when Amy walked in the room",
        storyText:
          "On February 1, 1999, Amy walked into Southside 815 in Alexandria, Virginia, and caught Adam's eye immediately. A mutual friend introduced them, and four hours of conversation went by like it was 20 minutes. Adam walked Amy home that evening — meeting her two golden retrievers, Maggie & Molson — and they made plans to see Gil Scott-Heron at the legendary Blues Alley two days later. Both Amy and Adam had found their missing piece.\n\n22 years later, for Amy's 50th birthday, Adam had famed Alexandria painter and close friend Judy Heiser, memorialize the exact moment before both of their lives changed.",
      },
      {
        src: aboutUsV2Png("they-meet-world-travelers-maggie-molson.png"),
        caption: "World Travelers Greeted by Maggie & Molson",
        storyText:
          'Before kids, we were able to do a lot of travelling but the two "Lemons" (a nickname from Adam\'s parents who gladly took care of them) always were there to greet us! Our time on the road turned out to be incredible field research for developing products that actually made life easier at home and on travel.',
      },
      {
        src: aboutUsV2Png("they-meet-wedding-toast.png"),
        caption: "It's Official!",
        storyText:
          "On April 21, 2001, Amy and Adam tied the knot in Baltimore, Maryland. Surrounded by family and their closest friends, they danced the night away until it was time to leave for the airport. The adventure was underway...they had no idea how crazy it was about to get!",
      },
    ],
  },
  {
    heading: "They have a family",
    images: [
      { src: PLACEHOLDER("lng-about-04"), caption: "Growing household energy" },
      { src: PLACEHOLDER("lng-about-05"), caption: "Kids dive into creative play" },
      { src: PLACEHOLDER("lng-about-06"), caption: "Weekends together at home" },
    ],
  },
  {
    heading: "They have a mess",
    images: [
      { src: PLACEHOLDER("lng-about-07"), caption: "Toys spread wall to wall" },
      { src: PLACEHOLDER("lng-about-08"), caption: "Small pieces everywhere" },
      { src: PLACEHOLDER("lng-about-09"), caption: "Cleanup takes forever" },
    ],
  },
  {
    heading: "They have an idea",
    images: [
      { src: PLACEHOLDER("lng-about-10"), caption: "Sketch on the placemat" },
      { src: PLACEHOLDER("lng-about-11"), caption: "First Lay-n-Go prototype" },
      { src: PLACEHOLDER("lng-about-12"), caption: "Family tests the drawstring" },
    ],
  },
  {
    heading: "They start a business, earn 8 patents and gain the best customers ever",
    images: [
      { src: PLACEHOLDER("lng-about-13"), caption: "Original LARGE play mat launch" },
      { src: PLACEHOLDER("lng-about-14"), caption: "LITE personal size ships" },
      { src: PLACEHOLDER("lng-about-15"), caption: "COSMO cosmetic line grows" },
      { src: PLACEHOLDER("lng-about-16"), caption: "Utility patents awarded" },
      { src: PLACEHOLDER("lng-about-17"), caption: "Retail partners nationwide" },
      { src: PLACEHOLDER("lng-about-18"), caption: "Fans worldwide today" },
      { src: PLACEHOLDER("lng-about-19"), caption: "Early trade-show booth hustle" },
      { src: PLACEHOLDER("lng-about-20"), caption: "First wholesale catalog spread" },
      { src: PLACEHOLDER("lng-about-21"), caption: "Machine-wash milestone celebrate" },
      { src: PLACEHOLDER("lng-about-22"), caption: "Traveler line meets commuters" },
      { src: PLACEHOLDER("lng-about-23"), caption: "Pet solutions hit the road" },
      { src: PLACEHOLDER("lng-about-24"), caption: "WIRED tech pouch debut" },
      { src: PLACEHOLDER("lng-about-25"), caption: "NAILSPA studio-ready kit" },
      { src: PLACEHOLDER("lng-about-26"), caption: "Defender line field-tested" },
      { src: PLACEHOLDER("lng-about-27"), caption: "Press tour green-room prep" },
      { src: PLACEHOLDER("lng-about-28"), caption: "Customer thank-you wall growing" },
      { src: PLACEHOLDER("lng-about-29"), caption: "International shipping milestone" },
      { src: PLACEHOLDER("lng-about-30"), caption: "Team photo newest headquarters" },
    ],
  },
  {
    heading: "They give back",
    images: [
      { src: PLACEHOLDER("lng-giveback-01"), caption: "Local charity partner spotlight" },
      { src: PLACEHOLDER("lng-giveback-02"), caption: "School supply drive drop-off" },
      { src: PLACEHOLDER("lng-giveback-03"), caption: "Team volunteer day together" },
    ],
  },
  {
    heading: "Then and now...\nour first models",
    groups: [
      {
        title: "Andrew",
        images: [
          { src: PLACEHOLDER("lng-models-andrew-1"), caption: "Andrew — early play-mat days" },
          { src: PLACEHOLDER("lng-models-andrew-2"), caption: "Andrew — testing the cinch" },
          { src: PLACEHOLDER("lng-models-andrew-3"), caption: "Andrew — today" },
        ],
      },
      {
        title: "Miles",
        images: [
          { src: PLACEHOLDER("lng-models-miles-1"), caption: "Miles — early play-mat days" },
          { src: PLACEHOLDER("lng-models-miles-2"), caption: "Miles — LEGO cleanup champion" },
          { src: PLACEHOLDER("lng-models-miles-3"), caption: "Miles — today" },
        ],
      },
      {
        title: "Caden",
        images: [
          { src: PLACEHOLDER("lng-models-caden-1"), caption: "Caden — early play-mat days" },
          { src: PLACEHOLDER("lng-models-caden-2"), caption: "Caden — weekend adventures" },
          { src: PLACEHOLDER("lng-models-caden-3"), caption: "Caden — today" },
        ],
      },
    ],
  },
];

function AboutTextWindow({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
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
            <p key={i} className="text-sm leading-relaxed text-foreground/90 font-medium">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryGridCell({ src, caption, storyText }: GridSlot) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && storyText && (
        <AboutTextWindow text={storyText} onClose={() => setOpen(false)} />
      )}
      <figure className="group flex flex-col">
        <div
          className={cn(
            "aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted",
            "shadow-sm transition-shadow duration-200 group-hover:shadow-md",
          )}
        >
          <img
            src={src}
            alt={caption}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            width={600}
            height={600}
          />
        </div>
        <figcaption className="mt-2 flex min-h-[2.75rem] items-start justify-center px-0.5">
          <span
            className={cn(
              "text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-primary",
              "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            )}
          >
            {caption}
            {storyText && (
              <>
                {" "}
                <button
                  onClick={() => setOpen(true)}
                  className="underline underline-offset-2 hover:text-primary/70 transition-colors normal-case tracking-normal font-semibold"
                >
                  (Click for more)
                </button>
              </>
            )}
          </span>
        </figcaption>
      </figure>
    </>
  );
}

function StorySection({ block }: { block: SectionBlock }) {
  return (
    <section className="space-y-4">
      <h2
        className={cn(
          "whitespace-pre-line text-balance text-center font-heading font-black uppercase tracking-tight text-foreground md:text-left",
          "text-[clamp(1.85rem,9vw,3.65rem)] leading-[0.92]",
          "md:text-[clamp(1.35rem,5.8vw,4rem)]",
          "lg:text-[clamp(1.75rem,5vw,4.75rem)] lg:leading-[0.9]",
        )}
      >
        {block.heading}
      </h2>
      {isGroupedSection(block) ? (
        <div className="space-y-8 md:space-y-9">
          {block.groups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {group.images.map((slot, i) => (
                  <StoryGridCell key={`${block.heading}-${group.title}-${i}`} {...slot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {block.images.map((slot, i) => (
            <StoryGridCell key={`${block.heading}-${i}`} {...slot} />
          ))}
        </div>
      )}
    </section>
  );
}

const AboutUsV2 = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="container flex-1 py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="not-prose text-base font-medium leading-normal text-foreground/88">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-9 md:mb-10">
          About Us (V2)
        </h1>
        <div className="space-y-5 md:space-y-6">
          {SECTIONS.map((block) => (
            <StorySection key={block.heading} block={block} />
          ))}
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default AboutUsV2;
