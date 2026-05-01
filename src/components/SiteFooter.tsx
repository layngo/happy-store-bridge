import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Globe, Instagram } from "lucide-react";
import { footerCatalogLinks, footerInfoLinks, socialLinks } from "@/lib/siteNav";
import { useState } from "react";
import { toast } from "sonner";

interface SiteFooterProps {
  variant?: "light" | "dark";
}

export const SiteFooter = (_props: SiteFooterProps) => {
  const [email, setEmail] = useState("");

  const onNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks!", { description: "Newsletter signup is coming soon — we captured your interest." });
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-muted">
      <div className="container max-w-5xl py-8 sm:py-9">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <Link to="/" aria-label="Lay-n-Go home" className="inline-block shrink-0">
              <img
                src="/layngo-logo-outlined.png"
                alt="Lay-n-Go"
                className="h-9 w-auto object-contain mix-blend-multiply scale-125 sm:scale-[1.35]"
              />
            </Link>
            <p className="text-xs leading-snug text-muted-foreground max-w-[240px] sm:max-w-none">
              Patented drawstring mat, cleanup, storage, and carryall in one — for wherever life takes you.
            </p>
            <div className="text-xs leading-relaxed text-muted-foreground space-y-0.5">
              <p>
                <span className="font-semibold text-foreground">Contact</span>{" "}
                <a href="mailto:info@layngo.com" className="text-primary hover:underline">
                  info@layngo.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-foreground">Address</span> Alexandria, Virginia
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Newsletter
            </h3>
            <p className="text-xs text-muted-foreground max-w-[260px] sm:max-w-none">
              Alerts, offers, and codes in your inbox.
            </p>
            <form
              onSubmit={onNewsletter}
              className="flex w-full max-w-[280px] flex-col gap-2 sm:max-w-none sm:flex-row sm:items-center"
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 flex-1 bg-background text-sm"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0 px-4 sm:w-auto w-full">
                Join
              </Button>
            </form>
          </div>

          {/* Catalog */}
          <div className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Catalog
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {footerCatalogLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + social */}
          <div className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Company
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {footerInfoLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-1.5 pt-1 sm:justify-start">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-background/60 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  aria-label={s.label}
                >
                  {s.icon === "facebook" ? (
                    <Facebook className="h-4 w-4" />
                  ) : s.icon === "instagram" ? (
                    <Instagram className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/70 pt-5 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Lay-n-Go. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
