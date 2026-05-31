import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const wholesaleStats = [
  { label: "IN BUSINESS", value: "16+" },
  { label: "Wholesale partners", value: "200+" },
  { label: "Happy customers", value: "100k+" },
  { label: "Missed deliveries", value: "~0" },
] as const;

const Contact = () => {
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [wholesaleFirstName, setWholesaleFirstName] = useState("");
  const [wholesaleLastName, setWholesaleLastName] = useState("");
  const [wholesaleEmail, setWholesaleEmail] = useState("");
  const [wholesaleMessage, setWholesaleMessage] = useState("");

  useEffect(() => {
    if (location.hash !== "#wholesale") return;
    const el = document.getElementById("wholesale");
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const submitContact = (e: React.FormEvent) => {
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
    window.location.href = `mailto:info@layngo.com?subject=${encodeURIComponent("Lay-n-Go contact form")}&body=${encodeURIComponent(body)}`;
  };

  const submitWholesale = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${wholesaleFirstName} ${wholesaleLastName}`,
      `Email: ${wholesaleEmail}`,
      "",
      wholesaleMessage,
    ].join("\n");
    window.location.href = `mailto:info@layngo.com?subject=${encodeURIComponent("Wholesale inquiry")}&body=${encodeURIComponent(body)}`;
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
        <form onSubmit={submitContact} className="space-y-4">
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

      <section id="wholesale" className="not-prose mt-14 scroll-mt-24 border-t border-border pt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">Wholesale</h2>
        <p className="mt-3 text-muted-foreground">
          Retailers worldwide carry Lay-n-Go. Tell us about your store, customer base, and which lines interest you —
          we&apos;ll follow up with pricing, MOQs, and merchandising assets.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {wholesaleStats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card/50 p-4 text-center">
              <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card/40 p-6 mb-10">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Wholesale inquiry</h3>
          <form onSubmit={submitWholesale} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wfn">First name</Label>
                <Input
                  id="wfn"
                  value={wholesaleFirstName}
                  onChange={(e) => setWholesaleFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wln">Last name</Label>
                <Input
                  id="wln"
                  value={wholesaleLastName}
                  onChange={(e) => setWholesaleLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wem">Email</Label>
              <Input
                id="wem"
                type="email"
                value={wholesaleEmail}
                onChange={(e) => setWholesaleEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wmsg">Message</Label>
              <Textarea
                id="wmsg"
                rows={4}
                value={wholesaleMessage}
                onChange={(e) => setWholesaleMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Request wholesale info</Button>
          </form>
        </div>

        <h3 className="font-heading text-lg font-semibold text-foreground">What partners say</h3>
        <blockquote className="mt-3 border-l-4 border-primary pl-4 italic text-muted-foreground">
          &ldquo;Lay-n-Go demos easily on the counter — customers get it in seconds. Reorders are consistent every
          holiday season.&rdquo;
          <footer className="not-italic text-sm text-foreground mt-2">— Specialty boutique buyer, Mid-Atlantic</footer>
        </blockquote>

        <div className="mt-10">
          <img
            src="/wholesale-provisional-drawings-page-4.png"
            alt="Lay-n-Go Convertible provisional patent drawing (page 4)"
            loading="lazy"
            className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-white shadow-sm"
          />
        </div>
      </section>

      <h2 className="mt-10">Business resources</h2>
      <ul>
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
