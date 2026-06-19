import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";

const SmsPolicy = () => (
  <StaticPageLayout title="SMS / Text Message Communications">
    <p className="text-sm text-muted-foreground">Last updated: June 2026</p>

    <p>
      Lay-n-Go (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) may send you SMS/text messages as part of our
      services. By providing your phone number and opting in, you agree to receive text messages from Lay-n-Go as
      described below.
    </p>

    <h2>Types of messages we send</h2>
    <p>We may send the following types of SMS communications:</p>
    <ul>
      <li>
        <strong>Transactional messages</strong>: Order confirmations, shipping updates, delivery notifications, and
        one-time verification/passcodes (OTP) related to your account or purchases.
      </li>
      <li>
        <strong>Marketing messages</strong>: Promotional offers, discount codes, and abandoned cart reminders.
      </li>
      <li>
        <strong>Service messages</strong>: Customer support follow-ups and post-purchase review requests.
      </li>
    </ul>

    <h2>How we collect your phone number</h2>
    <p>We collect your phone number when you:</p>
    <ul>
      <li>Enter it during checkout on our website</li>
      <li>Opt in via an SMS signup form or pop-up on our website</li>
      <li>Check the &quot;Text me with news and offers&quot; box at checkout</li>
      <li>Create an account and provide your number</li>
    </ul>

    <h2>Consent</h2>
    <p>
      By providing your phone number and opting in, you expressly consent to receive SMS messages from Lay-n-Go. For
      marketing messages, your consent is not a condition of any purchase. Message frequency varies based on your
      activity.
    </p>

    <h2>Opting out</h2>
    <p>
      You may opt out of SMS communications at any time by replying <strong>STOP</strong> to any message you receive
      from us. After opting out, you will receive one final confirmation message. To opt back in, reply{" "}
      <strong>START</strong> at any time.
    </p>

    <h2>Help</h2>
    <p>
      For help or more information, reply <strong>HELP</strong> to any of our messages or contact us at{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
      .
    </p>

    <h2>Message &amp; data rates</h2>
    <p>
      Message and data rates may apply depending on your mobile carrier and plan. Lay-n-Go is not responsible for any
      charges incurred from receiving SMS messages.
    </p>

    <h2>No sharing of phone numbers</h2>
    <p>
      We do not sell, rent, or share your phone number with third parties for their own marketing purposes. Your phone
      number may be shared with service providers (such as Twilio) solely to facilitate message delivery on our
      behalf.
    </p>

    <h2>Supported carriers</h2>
    <p>
      Major U.S. carriers are supported including AT&amp;T, Verizon, T-Mobile, Sprint, and others. Carrier support is
      not guaranteed for all carriers.
    </p>

    <h2>Contact us</h2>
    <p>If you have any questions about our SMS communications, please contact us at:</p>
    <p>
      <strong>Lay-n-Go</strong>
      <br />
      Email:{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
      <br />
      Website:{" "}
      <a href="https://www.layngo.com" className="text-primary hover:underline">
        www.layngo.com
      </a>
    </p>
    <p>
      See also our{" "}
      <Link to="/policies/terms-of-service#privacy" className="text-primary hover:underline">
        Terms &amp; Privacy
      </Link>
      .
    </p>
  </StaticPageLayout>
);

export default SmsPolicy;
