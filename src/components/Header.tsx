import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import { SHOP_ACCOUNT_URL, shopCollectionLinks } from "@/lib/siteNav";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        light ? "border-sky-200/80 bg-sky-100/90" : "border-border bg-background/90",
      )}
    >
      <div className="container pt-3 pb-2">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <SearchBar light={light} className="max-w-full sm:max-w-xs w-full" />
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <Link to="/" className="flex flex-col items-center">
              <span
                className={cn(
                  "font-heading text-xl sm:text-2xl font-bold tracking-[0.2em]",
                  light ? "text-slate-900" : "text-foreground",
                )}
              >
                LAY / N / GO
              </span>
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end items-center gap-2 order-3">
            <a
              href={SHOP_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 transition-colors",
                light ? "text-slate-700 hover:bg-sky-200/50" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label="My account"
            >
              <User className="w-5 h-5" />
            </a>
            <CartDrawer
              triggerClassName={light ? "text-slate-700 hover:bg-sky-200/60 hover:text-slate-900" : undefined}
            />
          </div>
        </div>

        <nav
          className={cn(
            "flex overflow-x-auto pb-1 md:flex-wrap md:justify-center items-center gap-x-5 gap-y-2 pt-3 mt-2 border-t",
            light ? "border-sky-200/70" : "border-border/60",
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
            <DropdownMenuContent align="center" className="min-w-[12rem]">
              <DropdownMenuItem asChild>
                <Link to="/collections">All collections</Link>
              </DropdownMenuItem>
              {shopCollectionLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
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
