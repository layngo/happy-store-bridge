import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

type GridSlot = {
  src: string;
  caption: string;
};

type SectionBlock =
  | { heading: string; images: [GridSlot, GridSlot, GridSlot] }
  | { heading: string; images: [GridSlot, GridSlot, GridSlot, GridSlot, GridSlot, GridSlot] };

/** Square placeholder photography (picsum seeds = stable URLs). Replace with brand assets when ready. */
const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

const SECTIONS: SectionBlock[] = [
  {
    heading: "They meet",
    images: [
      { src: PLACEHOLDER("lng-about-01"), caption: "Founders in the early days" },
      { src: PLACEHOLDER("lng-about-02"), caption: "Coffee-shop brainstorm session" },
      { src: PLACEHOLDER("lng-about-03"), caption: "Partner adventure begins" },
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
    ],
  },
];

function StoryGridCell({ src, caption }: GridSlot) {
  return (
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
        </span>
      </figcaption>
    </figure>
  );
}

function StorySection({ block }: { block: SectionBlock }) {
  return (
    <section className="space-y-6">
      <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground text-balance sm:text-xl md:text-2xl">
        {block.heading}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {block.images.map((slot, i) => (
          <StoryGridCell key={`${block.heading}-${i}`} {...slot} />
        ))}
      </div>
    </section>
  );
}

const AboutUsV2 = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="container flex-1 py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="not-prose space-y-14 md:space-y-16 text-base font-medium leading-normal text-foreground/88">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">About Us V2</h1>
        {SECTIONS.map((block) => (
          <StorySection key={block.heading} block={block} />
        ))}
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default AboutUsV2;
