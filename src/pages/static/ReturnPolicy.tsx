import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const ReturnPolicy = () => (
  <StaticPageLayout title="Return Policy">
    <p>Dear valued customers,</p>

    <p>
      We will gladly accept returns within <strong>14 days</strong> of receiving your order. Items should be returned
      in unused condition with all original packaging. We will not accept returns or exchanges that are not
      accompanied by a Return Authorization number and the original layngo.com order number.
    </p>

    <p>
      Lay-n-Go is not responsible for return shipping costs, nor will the original shipping costs be refunded. To
      receive a Return Authorization number for your item, please email us at{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
      .
    </p>

    <h2>How to start a return</h2>
    <ol>
      <li>
        Email{" "}
        <a href="mailto:info@layngo.com" className="text-primary hover:underline">
          info@layngo.com
        </a>{" "}
        with your layngo.com order number and the item(s) you wish to return.
      </li>
      <li>Wait for your Return Authorization (RA) number and return instructions.</li>
      <li>Ship the item in unused condition with original packaging. Keep your tracking number.</li>
    </ol>

    <h2>Refunds</h2>
    <p>
      Once your return is received and approved, refunds are issued to the original payment method. Original shipping
      charges are non-refundable unless the return is due to our error.
    </p>

    <h2>Questions</h2>
    <p>
      <Link to="/pages/contact" className="text-primary hover:underline">
        Contact us
      </Link>{" "}
     : we&apos;re happy to help.
    </p>
  </StaticPageLayout>
);

export default ReturnPolicy;
