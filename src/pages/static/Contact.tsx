import { useState } from "react";
import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${firstName} ${lastName}`,
      orderNumber && `Order: ${orderNumber}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    const mailto = `mailto:info@layngo.com?subject=${encodeURIComponent("Lay-n-Go contact form")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <StaticPageLayout title="Contact Us">
      <p>
        All form submissions are addressed to{" "}
        <a href="mailto:info@layngo.com" className="text-primary hover:underline">
          info@layngo.com
        </a>
        . You can also fax <strong>+1.703.995.4916</strong>.
      </p>

      <div className="not-prose rounded-lg border border-border bg-card/40 p-6 my-8">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Support &amp; contact</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fn">First name</Label>
              <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ln">Last name</Label>
              <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ord">Order number (if applicable)</Label>
            <Input id="ord" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Send to info@layngo.com
          </Button>
        </form>
      </div>

      <h2>FAQ</h2>
      <Accordion type="single" collapsible className="not-prose w-full">
        <AccordionItem value="returns">
          <AccordionTrigger>What is your return policy?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            See our{" "}
            <Link to="/pages/return-policy" className="text-primary hover:underline">
              Return Policy
            </Link>{" "}
            and official refund policy on Shopify. Contact us with your order number to start a return.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="origin">
          <AccordionTrigger>Where are products designed, made, and shipped from?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Lay-n-Go is headquartered in Alexandria, Virginia. Sourcing and fulfillment details vary by SKU; check
            product pages or ask our team for the latest.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="water">
          <AccordionTrigger>Are your products waterproof?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Many surfaces are wipeable and machine washable per care instructions. &ldquo;Waterproof&rdquo; depends on
            the product — refer to the specific product description or contact us for technical questions.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h2 className="mt-10">Business resources</h2>
      <ul>
        <li>
          <Link to="/pages/wholesale" className="text-primary hover:underline">
            Become a wholesale partner
          </Link>
        </li>
        <li>
          <Link to="/pages/small-businesses" className="text-primary hover:underline">
            Supporting small business &amp; future leaders
          </Link>
        </li>
      </ul>
    </StaticPageLayout>
  );
};

export default Contact;
