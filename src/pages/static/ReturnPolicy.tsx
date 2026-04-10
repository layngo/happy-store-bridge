import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Link } from "react-router-dom";

const ReturnPolicy = () => (
  <StaticPageLayout title="Return Policy">
    <p>
      We want you to love your Lay-n-Go purchase. This policy summarizes how returns and exchanges generally work;
      for the legally binding version hosted on our storefront, see our{" "}
      <Link to="/policies/refund-policy" className="text-primary hover:underline">
        refund policy
      </Link>{" "}
      on Shopify.
    </p>
    <h2>Eligibility</h2>
    <ul>
      <li>Items should be unused, in original condition, with tags and packaging when possible.</li>
      <li>Time limits and exceptions may apply to seasonal or promotional items.</li>
    </ul>
    <h2>How to start a return</h2>
    <ol>
      <li>Email <a href="mailto:info@layngo.com">info@layngo.com</a> with your order number and reason for return.</li>
      <li>Wait for return authorization and any required RMA instructions.</li>
      <li>Ship the item as directed; keep your tracking number.</li>
    </ol>
    <h2>Refunds</h2>
    <p>
      Approved refunds are typically issued to the original payment method once the return is received and inspected.
      Shipping charges may be non-refundable unless the error was ours.
    </p>
    <h2>Exchanges</h2>
    <p>Where inventory allows, we may offer an exchange for a different size or color. Contact us to coordinate.</p>
    <h2>Questions</h2>
    <p>
      <Link to="/pages/contact" className="text-primary hover:underline">
        Contact us
      </Link>{" "}
      — we&apos;re happy to help.
    </p>
  </StaticPageLayout>
);

export default ReturnPolicy;
