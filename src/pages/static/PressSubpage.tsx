import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Link } from "react-router-dom";

const PressSubpage = () => (
  <StaticPageLayout title="Lay-n-Go Featured in Travel & Lifestyle Press">
    <p className="text-sm text-muted-foreground not-prose">
      <span className="text-foreground font-medium">Sample article</span> · Lay-n-Go Communications · April 2024
    </p>
    <p>
      When travelers pack cosmetics, the same problems appear again and again: bottles buried at the bottom of a tote,
      leaky spills on clothing, and ten minutes lost digging for one lipstick. Lay-n-Go&apos;s COSMO line was designed
      around a different idea — open the bag flat like a mat, see everything at once, then cinch it closed in seconds.
    </p>
    <p>
      &ldquo;We kept hearing from customers who used our play mats at home and wished their makeup bag worked the same
      way,&rdquo; said the team. That feedback loop led to reinforced materials, washable surfaces, and elastic pockets
      sized for real-world routines — not just marketing renders.
    </p>
    <p>
      Retail partners note that the product demos quickly in store: once someone lays it flat and repacks it, the value
      is obvious. Online, video and UGC have driven steady growth in travel and gift seasons.
    </p>
    <p>
      Lay-n-Go continues to expand the line while protecting its utility patents, ensuring knockoffs don&apos;t erode
      the quality customers expect from the brand.
    </p>
    <p className="not-prose pt-4">
      <Link to="/pages/press" className="text-primary hover:underline">
        ← Back to all press
      </Link>
    </p>
  </StaticPageLayout>
);

export default PressSubpage;
