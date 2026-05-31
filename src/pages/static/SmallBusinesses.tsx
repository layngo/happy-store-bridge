import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const SmallBusinesses = () => (
  <StaticPageLayout title="Small Business & Future Leaders">
    <p>
      Lay-n-Go is proud to be women-owned and to have grown through programs like Goldman Sachs 10,000 Small Businesses.
      We believe small businesses strengthen communities — and we pay it forward by mentoring, partnering with local
      retailers, and sharing what we&apos;ve learned about product development, sourcing, and scaling responsibly.
    </p>
    <h2>How we support entrepreneurs</h2>
    <ul>
      <li>Transparent communication with boutique and specialty retail partners.</li>
      <li>Resources for wholesale buyers getting started with our line.</li>
      <li>Spotlighting customer and stockist stories when we can.</li>
    </ul>
    <h2>Partner with us</h2>
    <p>
      Interested in carrying Lay-n-Go? Visit{" "}
      <Link to="/pages/contact#wholesale" className="text-primary hover:underline">
        Wholesale
      </Link>{" "}
      to tell us about your store and audience.
    </p>
  </StaticPageLayout>
);

export default SmallBusinesses;
