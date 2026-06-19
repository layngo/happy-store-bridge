import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const ShippingPolicy = () => (
  <StaticPageLayout title="Shipping Policy">
    <p>
      We ship Lay-n-Go orders from our fulfillment partners to addresses within the United States and other regions
      available at checkout. Delivery times below are estimates after your order has shipped and do not include
      processing time.
    </p>

    <h2>Shipping methods</h2>
    <ul>
      <li>
        <strong>Economy</strong>: 5 to 8 business days
      </li>
      <li>
        <strong>Standard</strong>: 3 to 4 business days
      </li>
      <li>
        <strong>Express</strong>: 1 to 2 business days
      </li>
    </ul>

    <h2>Order processing</h2>
    <p>
      Orders placed before <strong>1:00 p.m.</strong> (local fulfillment cutoff) are processed the same business day
      when inventory and payment verification allow. Orders placed after the cutoff, on weekends, or on U.S. federal
      holidays are typically processed on the next business day.
    </p>

    <h2>Tracking</h2>
    <p>
      When your order ships, you will receive a confirmation email with tracking information when a carrier tracking
      number is available.
    </p>

    <h2>Shipping costs</h2>
    <p>
      Shipping rates are calculated at checkout based on destination, weight, and the method you select. Promotional
      free-shipping offers, when available, will be shown before you complete your purchase.
    </p>

    <h2>Questions</h2>
    <p>
      Need help with a shipment? Email{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>{" "}
      with your order number or visit our{" "}
      <Link to="/pages/contact" className="text-primary hover:underline">
        contact page
      </Link>
      .
    </p>
  </StaticPageLayout>
);

export default ShippingPolicy;
