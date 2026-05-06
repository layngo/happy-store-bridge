import { useState } from "react";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const stats = [
  { label: "IN BUSINESS", value: "16+" },
  { label: "Wholesale partners", value: "200+" },
  { label: "Happy customers", value: "100k+" },
  { label: "Missed deliveries", value: "~0" },
];

const Wholesale = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [`Name: ${firstName} ${lastName}`, `Email: ${email}`, "", message].join("\n");
    window.location.href = `mailto:info@layngo.com?subject=${encodeURIComponent("Wholesale inquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <StaticPageLayout title="Wholesale">
      <p>
        Retailers worldwide carry Lay-n-Go. Tell us about your store, customer base, and which lines interest you —
        we&apos;ll follow up with pricing, MOQs, and merchandising assets.
      </p>

      <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card/50 p-4 text-center">
            <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="not-prose rounded-lg border border-border bg-card/40 p-6 mb-10">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Wholesale contact</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wfn">First name</Label>
              <Input id="wfn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wln">Last name</Label>
              <Input id="wln" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wem">Email</Label>
            <Input id="wem" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wmsg">Message</Label>
            <Textarea id="wmsg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <Button type="submit">Request wholesale info</Button>
        </form>
      </div>

      <h2>What partners say</h2>
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
        &ldquo;Lay-n-Go demos easily on the counter — customers get it in seconds. Reorders are consistent every holiday
        season.&rdquo;
        <footer className="not-italic text-sm text-foreground mt-2">— Specialty boutique buyer, Mid-Atlantic</footer>
      </blockquote>

      <div className="not-prose mt-10">
        <img
          src="/wholesale-provisional-drawings-page-4.png"
          alt="Lay-n-Go Convertible provisional patent drawing (page 4)"
          loading="lazy"
          className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-white shadow-sm"
        />
      </div>
    </StaticPageLayout>
  );
};

export default Wholesale;
