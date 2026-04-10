import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const AboutUs = () => (
  <StaticPageLayout title="About Us">
    <p>
      Lay-n-Go began as a simple idea: make it easier for families to contain the chaos of toys and activities. What
      started as a drawstring play mat evolved into a full line of patented organizational solutions for cosmetics,
      travel, pets, nails, and tactical gear.
    </p>
    <h2>Our story</h2>
    <p>
      From the original Lay-n-Go play mat to the COSMO cosmetic line, TRAVELER tech pouch, LIFESTYLE &amp; CINCH
      backpacks, WIRED organizers, NAILSPA portable nail station, pet travel bed, and DEFENDER utility bags — each
      product shares the same DNA: open flat for full visibility, cinch closed for storage and travel.
    </p>
    <p>
      The Fazackerley family&apos;s utility patents help protect that innovation, including U.S. Patent Nos.{" "}
      <strong>9,084,459</strong>, <strong>10,016,036</strong>, and <strong>10,561,213</strong> (and additional patents
      listed on our <Link to="/pages/lay-n-go-patents">patents page</Link>).
    </p>
    <h2>Our mission</h2>
    <p>
      We design products that save time and reduce frustration — at home, on the road, and everywhere life gets messy.
      Quality materials, thoughtful details, and real-world testing drive everything we ship.
    </p>
    <h2>Our vision</h2>
    <p>
      To be the brand people trust when they need organization that moves with them: durable enough for daily use,
      stylish enough to leave out, and clever enough to feel indispensable.
    </p>
    <h2>Our commitment</h2>
    <ul>
      <li>
        <strong>Quality</strong> — Materials and construction chosen for longevity.
      </li>
      <li>
        <strong>User-focused</strong> — We listen to customers and refine based on real feedback.
      </li>
      <li>
        <strong>Style</strong> — Function first, with finishes you&apos;re proud to carry.
      </li>
      <li>
        <strong>Functionality</strong> — Patented layouts that replace digging through dark bags.
      </li>
    </ul>
    <p className="not-prose pt-4">
      <Link to="/collections" className="text-primary font-medium hover:underline">
        Shop collections →
      </Link>
    </p>
  </StaticPageLayout>
);

export default AboutUs;
