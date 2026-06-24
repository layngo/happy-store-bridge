import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { submitContactForm } from "@/lib/contactApi";
import { cn } from "@/lib/utils";

const wholesaleStats = [
  { label: "Years in business", value: "16+" },
  { label: "Wholesale partners", value: "200+" },
  { label: "Customers served", value: "100k+" },
  { label: "Missed deliveries", value: "~0" },
] as const;

type InquiryTopic = "general" | "wholesale";

const Contact = () => {
  const location = useLocation();
  const [topic, setTopic] = useState<InquiryTopic>("general");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitInFlight = useRef(false);

  useEffect(() => {
    if (location.hash !== "#wholesale") return;
    setTopic("wholesale");
    const el = document.getElementById("contact-form");
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitInFlight.current) return;

    submitInFlight.current = true;
    setSubmitting(true);
    try {
      const result = await submitContactForm({
        topic,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        orderNumber: topic === "general" ? orderNumber.trim() || undefined : undefined,
        company: topic === "wholesale" ? company.trim() || undefined : undefined,
        message: message.trim(),
      });

      if (!result.ok) {
        toast.error((result as { error: string }).error);
        return;
      }

      toast.success(result.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setOrderNumber("");
      setCompany("");
      setMessage("");
    } finally {
      submitInFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <StaticPageLayout title="Contact">
      <p className="!mt-0 text-base leading-relaxed">
        Questions about an order, a product, or carrying Lay-n-Go? Reach us at{" "}
        <a href="mailto:info@layngo.com" className="text-primary hover:underline">
          info@layngo.com
        </a>{" "}
        or fax <strong className="font-semibold text-foreground">703.995.4916</strong>.
      </p>

      <section id="wholesale" className="not-prose scroll-mt-24 border-y border-border py-8 my-8">
        <p className="brand-eyebrow text-foreground/70">Wholesale</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {wholesaleStats.map((s) => (
            <li key={s.label}>
              <p className="font-heading text-2xl font-bold tabular-nums text-foreground sm:text-[1.75rem]">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <div id="contact-form" className="not-prose scroll-mt-24">
        <form onSubmit={submit} className="space-y-6">
          <fieldset className="space-y-3 border-0 p-0">
            <legend className="brand-eyebrow text-foreground/70">What do you need?</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground",
                  topic === "general" && "text-foreground",
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value="general"
                  checked={topic === "general"}
                  onChange={() => setTopic("general")}
                  className="h-4 w-4 border-foreground/30 text-foreground focus-visible:ring-foreground"
                />
                Customer support
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
                <input
                  type="radio"
                  name="topic"
                  value="wholesale"
                  checked={topic === "wholesale"}
                  onChange={() => setTopic("wholesale")}
                  className="h-4 w-4 border-foreground/30 text-foreground focus-visible:ring-foreground"
                />
                Vendor support
              </label>
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fn" className="brand-eyebrow text-foreground/70">
                First name
              </Label>
              <Input
                id="fn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="brand-field-underline"
                autoComplete="given-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ln" className="brand-eyebrow text-foreground/70">
                Last name
              </Label>
              <Input
                id="ln"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="brand-field-underline"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="em" className="brand-eyebrow text-foreground/70">
              Email
            </Label>
            <Input
              id="em"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="brand-field-underline"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ph" className="brand-eyebrow text-foreground/70">
              Phone <span className="normal-case tracking-normal font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="ph"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="brand-field-underline"
              autoComplete="tel"
            />
          </div>

          {topic === "general" ? (
            <div className="space-y-2">
              <Label htmlFor="ord" className="brand-eyebrow text-foreground/70">
                Order number <span className="normal-case tracking-normal font-normal text-muted-foreground">(if you have one)</span>
              </Label>
              <Input
                id="ord"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="brand-field-underline"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="co" className="brand-eyebrow text-foreground/70">
                Store or company
              </Label>
              <Input
                id="co"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="brand-field-underline"
                placeholder="Gift shop, exchange, boutique…"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="msg" className="brand-eyebrow text-foreground/70">
              Message
            </Label>
            <Textarea
              id="msg"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="brand-textarea-underline"
              placeholder={
                topic === "wholesale"
                  ? "What you sell, where you're located, and which lines you're interested in."
                  : "What's going on — we'll get back to you."
              }
            />
          </div>

          <button type="submit" className="brand-btn-editorial w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>

      <h2 className="!mt-14">Common questions</h2>
      <Accordion type="single" collapsible className="not-prose w-full">
        <AccordionItem value="returns">
          <AccordionTrigger>What is your return policy?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            See our{" "}
            <Link to="/pages/return-policy" className="text-primary hover:underline">
              return policy
            </Link>
            . Email us with your order number to start a return.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="origin">
          <AccordionTrigger>Where are products made and shipped from?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            We&apos;re based in Alexandria, Virginia. Sourcing and fulfillment vary by product — check the product page
            or ask us if you need specifics.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="water">
          <AccordionTrigger>Are your products waterproof?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            All Lay-n-Go products are wipeable and machine washable per the care tag on each item. Our products are
            water-resistant—not waterproof.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="!mt-10 text-sm">
        <Link to="/pages/small-businesses" className="text-primary hover:underline">
          Small business resources
        </Link>
      </p>
    </StaticPageLayout>
  );
};

export default Contact;
