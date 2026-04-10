import { StaticPageLayout } from "@/components/StaticPageLayout";

const LayNGoPatents = () => (
  <StaticPageLayout title="Lay-n-Go Patents">
    <p>
      Lay-n-Go products are protected by utility patents and other intellectual property. The following U.S. utility
      patent numbers have been issued (non-exhaustive; see product packaging and official USPTO records for the latest):
    </p>
    <ul>
      <li>U.S. Patent No. 9,084,459</li>
      <li>U.S. Patent No. 10,016,036</li>
      <li>U.S. Patent No. 10,561,213</li>
      <li>U.S. Patent No. 11,116,298</li>
    </ul>
    <p>
      Nothing on this site grants a license to reproduce our patented designs. For licensing inquiries, contact{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
      .
    </p>
  </StaticPageLayout>
);

export default LayNGoPatents;
