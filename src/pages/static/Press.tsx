import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Link } from "react-router-dom";
import { pressFeatures } from "@/lib/siteNav";

const extraMentions = [
  {
    source: "Condé Nast Traveler",
    title: "Travel-ready organization",
    year: "2020",
    snippet: "Highlighted Lay-n-Go as a smart solution for packing cosmetics without the mess.",
  },
  {
    source: "The Female Founder Show",
    title: "Building a product line from one patent",
    year: "2021",
    snippet: "Discussion of taking a single utility patent from prototype to national retail.",
  },
  {
    source: "Inc. 5000",
    title: "Growth & operations",
    year: "2019",
    snippet: "Coverage of scaling operations while staying true to product quality.",
  },
];

const Press = () => (
  <StaticPageLayout title="Press">
    <p>Selected media mentions and features. Links open external publications where available.</p>

    <h2>Featured</h2>
    <div className="not-prose grid gap-6 sm:grid-cols-1">
      {pressFeatures.map((p) => (
        <a
          key={p.href}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-border bg-card/50 p-5 hover:border-primary/40 transition-colors"
        >
          <p className="text-xs uppercase tracking-wider text-primary font-semibold">{p.source}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground mt-1">{p.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
          <span className="text-sm text-primary mt-3 inline-block">Read more →</span>
        </a>
      ))}
    </div>

    <h2>More coverage</h2>
    <ul className="space-y-6">
      {extraMentions.map((m) => (
        <li key={m.title}>
          <p className="text-sm text-muted-foreground">{m.year}</p>
          <p className="font-semibold text-foreground">
            {m.source}: {m.title}
          </p>
          <p>{m.snippet}</p>
        </li>
      ))}
    </ul>

    <p className="not-prose pt-6 text-sm">
      For press inquiries:{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
      . Sample story layout:{" "}
      <Link to="/pages/press-subpage" className="text-primary hover:underline">
        Press article template
      </Link>
      .
    </p>
  </StaticPageLayout>
);

export default Press;
