import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Globe, Instagram } from "lucide-react";
import { footerCatalogLinks, footerInfoLinks, socialLinks } from "@/lib/siteNav";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface SiteFooterProps {
  variant?: "light" | "dark";
}

export const SiteFooter = ({ variant = "dark" }: SiteFooterProps) => {
  const light = variant === "light";
  const [email, setEmail] = useState("");

  const onNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks!", { description: "Newsletter signup is coming soon — we captured your interest." });
    setEmail("");
  };

  return (
    <footer
      className={cn(
        "border-t",
        light ? "border-sky-200/80 bg-sky-200/50 text-slate-900" : "border-border bg-card text-foreground",
      )}
    >
      <div className="container py-12 space-y-12">
        <div className="flex justify-center">
          <Link to="/" aria-label="Lay-n-Go home">
            <img
              src="/layngo-logo-outlined.png"
              alt="Lay-n-Go"
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className={cn("font-heading text-xl font-semibold", light ? "text-slate-900" : "text-foreground")}>
            Sign up for our Newsletter
          </h2>
          <p className={cn("text-sm", light ? "text-slate-600" : "text-muted-foreground")}>
            New product alerts, special offers, and coupon codes — straight to your inbox.
          </p>
          <form onSubmit={onNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={light ? "bg-white/80 border-sky-200" : ""}
            />
            <Button type="submit" className="shrink-0">
              Join
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <h3 className={cn("font-heading font-semibold", light ? "text-slate-900" : "text-foreground")}>
              Lay-n-Go Info
            </h3>
            <p className={cn("text-sm leading-relaxed", light ? "text-slate-600" : "text-muted-foreground")}>
              Lay-n-Go is a patented drawstring mat, cleanup, storage and carryall solution in one. Perfect for
              wherever life takes you!
            </p>
            <p className={cn("text-sm", light ? "text-slate-700" : "text-muted-foreground")}>
              <strong className={light ? "text-slate-900" : "text-foreground"}>Contact:</strong>{" "}
              <a href="mailto:info@layngo.com" className="text-primary hover:underline">
                info@layngo.com
              </a>
            </p>
            <p className={cn("text-sm", light ? "text-slate-700" : "text-muted-foreground")}>
              <strong className={light ? "text-slate-900" : "text-foreground"}>Address:</strong> Alexandria, Virginia
            </p>
          </div>

          <div className="space-y-3">
            <h3 className={cn("font-heading font-semibold", light ? "text-slate-900" : "text-foreground")}>
              Catalog
            </h3>
            <ul className="space-y-2 text-sm">
              {footerCatalogLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={cn("hover:text-primary transition-colors", light ? "text-slate-600" : "text-muted-foreground")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className={cn("font-heading font-semibold", light ? "text-slate-900" : "text-foreground")}>
              Company & policies
            </h3>
            <ul className="space-y-2 text-sm">
              {footerInfoLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={cn("hover:text-primary transition-colors", light ? "text-slate-600" : "text-muted-foreground")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "rounded-full p-2 border transition-colors",
                    light ? "border-sky-300 text-slate-700 hover:bg-sky-100" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={s.label}
                >
                  {s.icon === "facebook" ? (
                    <Facebook className="w-4 h-4" />
                  ) : s.icon === "instagram" ? (
                    <Instagram className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("text-center text-xs pt-4 border-t", light ? "border-sky-200/80 text-slate-600" : "border-border text-muted-foreground")}>
          © {new Date().getFullYear()} Lay-n-Go. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
