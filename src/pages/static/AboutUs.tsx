import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const commitments = [
  {
    number: "01",
    title: "Quality",
    text: "Improving your ability to keep organized so you can focus on enjoying your day!",
  },
  {
    number: "02",
    title: "User-Focused",
    text: "Don't hold back kids creative expression due to a little mess. Let Lay-n-Go handle the rest.",
  },
  {
    number: "03",
    title: "Style",
    text: "Making sure your most important items are always at your side no matter where you go!",
  },
  {
    number: "04",
    title: "Functionality",
    text: "Making sure your most important items are always at your side no matter where you go!",
  },
];

const AboutUs = () => (
  <StaticPageLayout title="About Us">
    <div className="not-prose space-y-12 text-base font-medium leading-normal text-foreground/88">
      <section className="space-y-5">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">OUR STORY</h2>
        <p>
          Lay-n-Go started with a simple idea, &quot;There has to be a better way to do this.&quot; Our products were
          originally developed to tame our sons&apos; large toy collections with small pieces. We discovered there was no
          solution on the market that allowed our three children to play for hours and cleanup in seconds. As our family
          kept buying more LEGO sets, we looked everywhere for a smarter organizational solution, something to make
          cleanup easy, contain the small pieces of our lives, be used on the go, and was machine washable.
        </p>
        <p>
          We spent the next year designing, testing, re-engineering and producing what would become Lay-n-Go&apos;s first
          product (the 60&quot; LARGE play mat). The immediate success of our first Lay-n-Go product turned a family
          dinner into a design session. With our three young boys at the table, we used the backside of our paper
          placemat to sketch out a smaller, personal solution. The Lay-n-Go LITE (18&quot;) was on the market less than
          five months later and was the perfect complement to the larger bag.
        </p>
        <p>
          The expanded product line created a rush of TV coverage, press, sales, and imaginative ideas of how else our
          products could be used. After receiving the first shipment of LITEs, the expanding Lay-n-Go team started using
          the new personal size as our cosmetic and toiletry bags. The next product seemed obvious and the design of the
          COSMO began immediately.
        </p>
        <p>
          Since developing our original product, Lay-n-Go has released the COSMO collection, the men&apos;s TRAVELER, the
          LIFESTYLE &amp; CINCH backpacks, the tech accessory WIRED solution, a portable nail station, the NAILSPA, the
          PET bed, and most recently a DEFENDER line of utility bags built specifically for the needs of the military,
          emergency responders and various outdoor applications.
        </p>
        <p>
          On July 21, 2015, the Fazackerleys were awarded a utility patent from the U.S. Patent and Trademark Office for
          their invention (U.S. Patent No. 9,084,459). On July 10, 2018 the Fazackerleys were awarded a second utility
          patent (U.S. Patent No. 10,016,036) and on February 18, 2020 were awarded their third patent (U.S. Patent No.
          10,561,213).
        </p>
      </section>

      <section className="space-y-4">
        <p className="font-heading text-xl font-semibold text-foreground">Building Friendships Along The Way</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">OUR MISSION</h2>
        <p className="text-lg font-semibold text-foreground">Develop innovative organizational solutions for life, play, and travel.</p>
        <p>
          Lay-n-Go will continue to solve cleanup and organizational challenges in daily routines to improve peoples&apos;
          lives. Our commitment to quality, style, durability, and innovative functionality will always be a priority for
          Lay-n-Go and our promise to our customers.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Our Commitment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {commitments.map((item) => (
            <article key={item.number} className="rounded-xl border border-border bg-card/55 p-5">
              <p className="font-heading text-sm tracking-[0.16em] text-primary">{item.number}</p>
              <h3 className="mt-1 font-heading text-xl font-bold uppercase tracking-wide text-foreground">{item.title}</h3>
              <p className="mt-2">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">OUR VISION</h2>
        <p className="text-lg font-semibold text-foreground">
          Solve cleanup and organizational challenges in daily routines and improve peoples&apos; lives.
        </p>
        <p>
          The Lay-n-Go LITE (18&quot;) was on the market less than five months later and was the perfect complement to the
          larger bag. The expanded product line created a rush of TV coverage, press, sales, and imaginative ideas of
          how else this product could be used.
        </p>
        <p>
          After receiving the first shipment of LITEs, the expanding Lay-n-Go team started using this new personal size
          as their cosmetic and toiletry bags. The next product seemed obvious and the design of the COSMO began
          immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">OUR TEAM</h2>
        <p>Where we are Heading...</p>
        <h3 className="font-heading text-2xl font-bold text-foreground">Check Out Our Products</h3>
        <Link
          to="/collections"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to shop now
        </Link>
      </section>
    </div>
  </StaticPageLayout>
);

export default AboutUs;
