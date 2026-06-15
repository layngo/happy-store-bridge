import { Link } from "react-router-dom";
import { StorefrontHomeLink } from "@/components/StorefrontHomeLink";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Globe, Instagram } from "lucide-react";
import { footerCatalogLinks, footerInfoLinks, socialLinks } from "@/lib/siteNav";
import { subscribeToNewsletter } from "@/lib/newsletterApi";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/LoadingSpinner";

interface SiteFooterProps {
  variant?: "light" | "dark";
}

const sectionHeading =
  "font-heading text-sm font-semibold uppercase tracking-[0.14em] text-foreground";

export const SiteFooter = ({ variant = "dark" }: SiteFooterProps) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    const result = await subscribeToNewsletter({ email: trimmed });
    setSubmitting(false);

    if (!result.ok) {
      toast.error("Could not join", { description: (result as { error: string }).error });
      return;
    }

    toast.success("You are on the list!", { description: result.message });
    setEmail("");
  };

  const socialRow = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {socialLinks.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
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
  );

  return (
    <footer className={variant === "light" ? "border-t border-border bg-white" : "border-t border-border bg-muted"}>
      <div className="container max-w-5xl py-6 sm:py-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-6">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <StorefrontHomeLink aria-label="Lay-n-Go home" className="inline-block shrink-0">
              <img
                src="/layngo-logo-outlined.png"
                alt="Lay-n-Go"
                className="h-10 w-auto object-contain mix-blend-multiply scale-[1.32] sm:h-11 sm:scale-[1.4]"
              />
            </StorefrontHomeLink>
            <p className="text-sm leading-snug text-muted-foreground max-w-[260px] sm:max-w-none">
              Patented drawstring mat for cleanup and storage, built for everyday use.
            </p>
            <div className="text-sm leading-snug text-muted-foreground space-y-1">
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
            <h3 className={sectionHeading}>Newsletter</h3>
            <p className="text-sm text-muted-foreground max-w-[280px] sm:max-w-none">
              Alerts, offers, and codes in your inbox.
            </p>
            <form
              onSubmit={onNewsletter}
              className="flex w-full max-w-[300px] flex-col gap-2 sm:max-w-none sm:flex-row sm:items-center"
              aria-label="Newsletter signup"
            >
              <Label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for newsletter
              </Label>
              <Input
                id="footer-newsletter-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 flex-1 bg-background text-sm"
                disabled={submitting}
                required
                autoComplete="email"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0 px-4 sm:w-auto w-full" disabled={submitting} aria-busy={submitting}>
                {submitting ? <ButtonSpinner label="Subscribing" /> : "Join"}
              </Button>
            </form>
          </div>

          {/* Catalog */}
          <nav aria-label="Product catalog" className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
            <h3 className={sectionHeading}>Catalog</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {footerCatalogLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company information" className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
            <h3 className={sectionHeading}>Company</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {footerInfoLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Socials centered under Newsletter + Catalog columns on large screens */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 lg:gap-x-8">
          <div className="hidden lg:block" aria-hidden />
          <div className="flex justify-center lg:col-span-2">{socialRow}</div>
          <div className="hidden lg:block" aria-hidden />
        </div>

        <div className="mt-5 border-t border-border/70 pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lay-n-Go. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
