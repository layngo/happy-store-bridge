import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const BusinessLicense = () => (
  <StaticPageLayout title="Business License & Certification">
    <p>
      Lay-n-Go operates as a registered business in the Commonwealth of Virginia, United States. We maintain appropriate
      business licensing and comply with applicable federal, state, and local regulations for retail and wholesale
      commerce.
    </p>
    <p>
      For wholesale verification, resale certificates, or formal compliance documentation, please contact us at{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>{" "}
      or visit our{" "}
      <Link to="/pages/contact#wholesale" className="text-primary hover:underline">
        Wholesale
      </Link>{" "}
      page.
    </p>
    <p className="text-sm opacity-80">
      This page summarizes our standing for partners and customers. Official filings may be requested through customer
      service.
    </p>
  </StaticPageLayout>
);

export default BusinessLicense;
