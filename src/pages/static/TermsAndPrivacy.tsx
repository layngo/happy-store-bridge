import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const TermsAndPrivacy = () => (
  <StaticPageLayout title="Terms & Privacy">
    <p className="text-sm text-muted-foreground">Last updated: June 2026</p>

    <p>
      This page contains Lay-n-Go&apos;s terms of service and privacy policy. By using{" "}
      <a href="https://www.layngo.com" className="text-primary hover:underline">
        layngo.com
      </a>{" "}
      or placing an order, you agree to these terms.
    </p>

    <h2>Terms of service</h2>

    <h3>Copyright and trademark notice</h3>
    <p>
      Unless otherwise specified, all materials on this site: including text, site design, logos, graphics, icons,
      and images, as well as their selection and arrangement: are the sole property of Lay-n-Go. You may use site
      content only to shop on this site or place an order. No materials may be copied, reproduced, modified,
      republished, uploaded, posted, transmitted, or distributed without our prior written permission.
    </p>

    <h3>Credit cards</h3>
    <p>
      We accept Visa, MasterCard, and Discover. There is no surcharge for credit card purchases. Provide your exact
      billing address and telephone number as your card issuer has on file; incorrect information may delay your order.
      Your card is billed when your order ships.
    </p>

    <h3>Links</h3>
    <p>
      This site may link to third-party websites. We are not responsible for the operation of or content on those
      sites.
    </p>

    <h3>Multiple product orders</h3>
    <p>
      For orders with multiple products, we will attempt to ship all items together. Unavailable items ship as they
      become available unless you tell us otherwise. You are charged only for products in a given shipment, plus
      applicable shipping. The full shipping charge quoted at checkout may apply to the first shipment in a split
      order.
    </p>

    <h3>Order acceptance</h3>
    <p>
      An order confirmation email does not signify acceptance of your order or confirmation of an offer to sell.
      Lay-n-Go may accept or decline any order after receipt, or supply less than the quantity ordered of any item.
    </p>

    <h3>Other conditions</h3>
    <p>
      These terms supersede any terms you include with a purchase order. We may change this site and these terms at
      any time.
    </p>

    <h3>Out-of-stock products</h3>
    <p>
      We ship products as they become available. Orders placed before 1:00 p.m. usually ship the same business day;
      orders after that time, or on weekends or major holidays, typically ship the next business day. If an item is
      out of stock, we will notify you. You may cancel your order any time before it ships.
    </p>

    <h3>Shipping estimates</h3>
    <p>
      We cannot guarantee delivery dates. Transit times from carriers are estimates only. See our{" "}
      <Link to="/policies/shipping-policy" className="text-primary hover:underline">
        shipping policy
      </Link>{" "}
      for current methods and processing times.
    </p>

    <h3>Taxes</h3>
    <p>
      Applicable sales tax is calculated at checkout based on your delivery address and local requirements.
    </p>

    <h3>Typographical errors</h3>
    <p>
      If a product is listed at an incorrect price due to a typographical or supplier pricing error, we may refuse or
      cancel the order. If your card was already charged and the order is canceled, we will issue a prompt credit for
      the incorrect amount.
    </p>

    <h3>Returns</h3>
    <p>
      Returns are governed by our{" "}
      <Link to="/pages/return-policy" className="text-primary hover:underline">
        return policy
      </Link>
      .
    </p>

    <h2 id="privacy">Privacy policy</h2>

    <p>
      Lay-n-Go (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This section explains how
      we collect, use, and protect personal information when you visit our site, make a purchase, create an account,
      or contact us.
    </p>

    <h3>Information we collect</h3>
    <ul>
      <li>
        <strong>Contact &amp; order details</strong>: name, email address, phone number, shipping and billing
        address, and order history when you shop with us.
      </li>
      <li>
        <strong>Account information</strong>: login credentials and preferences if you create a customer account.
      </li>
      <li>
        <strong>Communications</strong>: messages you send through our contact form, email, or customer support
        channels.
      </li>
      <li>
        <strong>Marketing preferences</strong>: newsletter sign-ups and SMS opt-in choices.
      </li>
      <li>
        <strong>Device &amp; usage data</strong>: browser type, pages visited, and similar analytics collected
        through cookies and similar technologies.
      </li>
    </ul>

    <h3>How we use your information</h3>
    <ul>
      <li>Process and fulfill orders, including payment, shipping, and returns.</li>
      <li>Send transactional emails and texts (order confirmations, shipping updates, verification codes).</li>
      <li>Provide customer support and respond to inquiries.</li>
      <li>Send marketing communications when you have opted in.</li>
      <li>Improve our website, products, and services.</li>
      <li>Comply with legal obligations and prevent fraud.</li>
    </ul>

    <h3>Secure processing</h3>
    <p>
      When you purchase from our site, you provide information needed to process your order. Checkout and payment
      processing are handled through secure, encrypted connections via Shopify and our payment partners.
    </p>

    <h3>SMS / text messages</h3>
    <p>
      If you opt in to receive text messages, we handle your phone number as described in our{" "}
      <Link to="/policies/sms-policy" className="text-primary hover:underline">
        SMS / Text Message Communications policy
      </Link>
      . You may opt out at any time by replying <strong>STOP</strong> to any message from us.
    </p>

    <h3>How we share information</h3>
    <p>
      We do not sell your personal information. We may share data with service providers who help us operate our
      business: for example, Shopify (e-commerce platform), payment processors, shipping carriers, email providers,
      and SMS delivery partners such as Twilio: solely to perform services on our behalf.
    </p>

    <h3>Cookies</h3>
    <p>
      Our site uses cookies and similar technologies to remember preferences, keep your cart, and understand how
      visitors use the site. You can control cookies through your browser settings.
    </p>

    <h3>Other websites</h3>
    <p>
      Sites accessible through our site may have their own privacy policies. Lay-n-Go is not responsible for the
      practices of third-party websites.
    </p>

    <h3>Data retention</h3>
    <p>
      We retain personal information for as long as needed to fulfill the purposes described in this policy, including
      order records, support history, and legal or accounting requirements.
    </p>

    <h3>Your choices</h3>
    <ul>
      <li>Unsubscribe from marketing emails using the link in any promotional message.</li>
      <li>Opt out of SMS by replying STOP; see our SMS policy for details.</li>
      <li>Contact us to request access to, correction of, or deletion of personal information where applicable.</li>
    </ul>

    <h3>Children</h3>
    <p>
      Our website is not directed to children under 13, and we do not knowingly collect personal information from
      children.
    </p>

    <h3>Changes</h3>
    <p>
      We may update these terms and this privacy policy from time to time. The &quot;Last updated&quot; date at the
      top reflects the most recent revision.
    </p>

    <h3>Contact us</h3>
    <p>
      Questions? Email{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>{" "}
      or visit our{" "}
      <Link to="/pages/contact" className="text-primary hover:underline">
        contact page
      </Link>
      .
    </p>
  </StaticPageLayout>
);

export default TermsAndPrivacy;
