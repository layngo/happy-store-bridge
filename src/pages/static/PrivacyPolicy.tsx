import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const PrivacyPolicy = () => (
  <StaticPageLayout title="Privacy Policy">
    <p className="text-sm text-muted-foreground">Last updated: June 2026</p>

    <p>
      Lay-n-Go (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy explains how we
      collect, use, and protect personal information when you visit{" "}
      <a href="https://www.layngo.com" className="text-primary hover:underline">
        layngo.com
      </a>
      , make a purchase, create an account, or contact us.
    </p>

    <h2>Information we collect</h2>
    <ul>
      <li>
        <strong>Contact &amp; order details</strong> — name, email address, phone number, shipping and billing
        address, and order history when you shop with us.
      </li>
      <li>
        <strong>Account information</strong> — login credentials and preferences if you create a customer account.
      </li>
      <li>
        <strong>Communications</strong> — messages you send through our contact form, email, or customer support
        channels.
      </li>
      <li>
        <strong>Marketing preferences</strong> — newsletter sign-ups and SMS opt-in choices.
      </li>
      <li>
        <strong>Device &amp; usage data</strong> — browser type, pages visited, and similar analytics collected
        through cookies and similar technologies.
      </li>
    </ul>

    <h2>How we use your information</h2>
    <ul>
      <li>Process and fulfill orders, including payment, shipping, and returns.</li>
      <li>Send transactional emails and texts (order confirmations, shipping updates, verification codes).</li>
      <li>Provide customer support and respond to inquiries.</li>
      <li>Send marketing communications when you have opted in.</li>
      <li>Improve our website, products, and services.</li>
      <li>Comply with legal obligations and prevent fraud.</li>
    </ul>

    <h2>SMS / text messages</h2>
    <p>
      If you opt in to receive text messages, we handle your phone number as described in our{" "}
      <Link to="/policies/sms-policy" className="text-primary hover:underline">
        SMS / Text Message Communications policy
      </Link>
      . You may opt out at any time by replying <strong>STOP</strong> to any message from us.
    </p>

    <h2>How we share information</h2>
    <p>
      We do not sell your personal information. We may share data with service providers who help us operate our
      business — for example, Shopify (e-commerce platform), payment processors, shipping carriers, email providers,
      and SMS delivery partners such as Twilio — solely to perform services on our behalf.
    </p>

    <h2>Cookies</h2>
    <p>
      Our site uses cookies and similar technologies to remember preferences, keep your cart, and understand how
      visitors use the site. You can control cookies through your browser settings.
    </p>

    <h2>Data retention</h2>
    <p>
      We retain personal information for as long as needed to fulfill the purposes described in this policy, including
      order records, support history, and legal or accounting requirements.
    </p>

    <h2>Your choices</h2>
    <ul>
      <li>Unsubscribe from marketing emails using the link in any promotional message.</li>
      <li>Opt out of SMS by replying STOP; see our SMS policy for details.</li>
      <li>Contact us to request access to, correction of, or deletion of personal information where applicable.</li>
    </ul>

    <h2>Children</h2>
    <p>
      Our website is not directed to children under 13, and we do not knowingly collect personal information from
      children.
    </p>

    <h2>Changes</h2>
    <p>
      We may update this policy from time to time. The &quot;Last updated&quot; date at the top reflects the most
      recent revision.
    </p>

    <h2>Contact us</h2>
    <p>
      Questions about this privacy policy? Email{" "}
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

export default PrivacyPolicy;
