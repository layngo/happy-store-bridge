import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";
import { SHOP_ACCOUNT_URL, shopCollectionLinks } from "@/lib/siteNav";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SHOP_MENU_MEDIA: Record<string, { image: string; hoverImage: string }> = {
  "/collections/cosmetic-bags": {
    image: "https://www.layngo.com/cdn/shop/products/B00B04V3PQ.PT01_1200x1200.jpg?v=1670376558",
    hoverImage: "https://www.layngo.com/cdn/shop/products/B00B04V3PQ.PT04_1200x1200.jpg?v=1670376558",
  },
  "/collections/nail-solutions": {
    image: "https://www.layngo.com/cdn/shop/products/B082LQ788D.PT01_1200x1200.jpg?v=1626120523",
    hoverImage: "https://www.layngo.com/cdn/shop/products/B082LQ788D.PT03_1200x1200.jpg?v=1626120523",
  },
  "/collections/play": {
    image: "https://www.layngo.com/cdn/shop/products/B00DI5Q1Q8.PT01_1200x1200.jpg?v=1670379124",
    hoverImage: "https://www.layngo.com/cdn/shop/products/B00DI5Q1Q8.PT02_1200x1200.jpg?v=1670379124",
  },
  "/collections/technology": {
    image: "https://www.layngo.com/cdn/shop/products/B07P6M2MHG.PT01_1200x1200.jpg?v=1626120559",
    hoverImage: "https://www.layngo.com/cdn/shop/products/B07P6M2MHG.PT03_1200x1200.jpg?v=1626120559",
  },
  "/collections/pet-solutions": {
    image: "https://www.layngo.com/cdn/shop/products/B08MV2JM98.PT01_1200x1200.jpg?v=1626120624",
    hoverImage: "https://www.layngo.com/cdn/shop/products/B08MV2JM98.PT03_1200x1200.jpg?v=1626120624",
  },
  "/collections/military-first-responder": {
    image: "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/B08SKHPY36.PT06.jpg?v=1626119977",
    hoverImage: "https://cdn.shopify.com/s/files/1/0531/5369/3877/products/B08SKHPY36.PT01.jpg?v=1626119977",
  },
};

export const Header = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const light = variant === "light";

  const linkClass = cn(
    "text-xs sm:text-sm font-medium uppercase tracking-wide transition-colors whitespace-nowrap",
    light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md",
        light ? "border-border bg-background/95" : "border-border bg-background/90",
      )}
    >
      <div className="container pt-3 pb-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <div />

          <div className="flex justify-center">
            <Link to="/" className="flex flex-col items-center">
              <img
                src="/layngo-logo-outlined.png"
                alt="Lay-n-Go"
                className="h-[49px] sm:h-[57px] w-auto object-contain mix-blend-multiply scale-[1.55] sm:scale-[1.65]"
              />
            </Link>
          </div>

          <div className="flex justify-end items-center gap-2">
            <a
              href={SHOP_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 transition-colors",
                light ? "text-foreground hover:bg-muted/80" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label="My account"
            >
              <User className="w-5 h-5" />
            </a>
            <CartDrawer
              triggerClassName={light ? "text-foreground hover:bg-muted/80 hover:text-foreground" : undefined}
            />
          </div>
        </div>

        <nav
          className={cn(
            "flex overflow-x-auto pb-1 md:flex-wrap md:justify-center items-center gap-x-5 gap-y-2 pt-3 mt-2 border-t",
            light ? "border-border/70" : "border-border/60",
          )}
        >
          <Link to="/" className={linkClass}>
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto px-0 py-0 uppercase tracking-wide font-medium gap-1",
                  light ? "text-slate-600 hover:text-slate-900 hover:bg-transparent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Shop <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[min(92vw,46rem)] rounded-xl border-slate-200 bg-white p-3 font-sans shadow-lg"
            >
              <Link
                to="/collections"
                className="mb-3 inline-flex rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 transition-colors hover:bg-slate-100"
              >
                View All Collections
              </Link>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {shopCollectionLinks.map((l) => {
                  const media = SHOP_MENU_MEDIA[l.to];
                  return (
                    <Link key={l.to} to={l.to} className="group block">
                      <article className="relative aspect-square overflow-hidden rounded-lg border border-border/80 bg-slate-100">
                        <img
                          src={media?.image}
                          alt={l.label}
                          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                          loading="lazy"
                        />
                        <img
                          src={media?.hoverImage ?? media?.image}
                          alt={l.label}
                          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute inset-0 flex items-end p-2.5">
                          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.08em] text-white drop-shadow">
                            {l.label}
                          </h3>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/pages/press" className={linkClass}>
            Press
          </Link>
          <Link to="/pages/about-us" className={linkClass}>
            About Us
          </Link>
          <Link to="/pages/wholesale" className={linkClass}>
            Wholesale
          </Link>
          <Link to="/pages/contact" className={linkClass}>
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
};
