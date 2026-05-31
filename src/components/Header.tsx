import { Link, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";
import { shopCollectionLinks } from "@/lib/siteNav";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function isHomePath(pathname: string) {
  return pathname === "/";
}

function isShopPath(pathname: string) {
  return (
    pathname.startsWith("/collections") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/shop/")
  );
}

function isPressPath(pathname: string) {
  return pathname.startsWith("/pages/press");
}

function isAboutPath(pathname: string) {
  return pathname.startsWith("/pages/about-us");
}

function isContactPath(pathname: string) {
  return pathname.startsWith("/pages/contact") || pathname.startsWith("/pages/wholesale");
}

export const Header = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const { pathname } = useLocation();
  const light = variant === "light";

  const navItemBase =
    "text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap pb-1 border-b-2 transition-colors";

  const navLinkClass = (active: boolean) =>
    cn(
      navItemBase,
      active
        ? "border-foreground text-foreground"
        : cn("border-transparent", light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground"),
    );

  const navTriggerClass = (active: boolean) =>
    cn(
      navItemBase,
      "inline-flex h-auto items-center gap-1 px-0 py-0 rounded-none hover:bg-transparent",
      active
        ? "border-foreground text-foreground hover:text-foreground"
        : cn(
            "border-transparent",
            light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground",
          ),
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
          <Link to="/" className={navLinkClass(isHomePath(pathname))}>
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(navTriggerClass(isShopPath(pathname)), "text-xs sm:text-sm [&_svg]:size-3")}>
                Shop <ChevronDown className="hidden sm:block opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="min-w-[14rem] rounded-xl border-slate-200 bg-white p-2 font-sans text-base font-medium tracking-normal shadow-lg"
            >
              <DropdownMenuItem className="rounded-lg px-4 py-3 text-slate-800 hover:text-slate-900" asChild>
                <Link to="/collections">View All</Link>
              </DropdownMenuItem>
              {shopCollectionLinks.map((l) => (
                <DropdownMenuItem
                  key={l.to}
                  className="rounded-lg px-4 py-3 text-slate-800 hover:text-slate-900"
                  asChild
                >
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/pages/press" className={navLinkClass(isPressPath(pathname))}>
            Press
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(navTriggerClass(isAboutPath(pathname)), "text-xs sm:text-sm [&_svg]:size-3")}>
                About Us <ChevronDown className="hidden sm:block opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="min-w-[14rem] rounded-xl border-slate-200 bg-white p-2 font-sans text-base font-medium tracking-normal shadow-lg"
            >
              <DropdownMenuItem className="rounded-lg px-4 py-3 text-slate-800 hover:text-slate-900" asChild>
                <Link to="/pages/about-us">About Us</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg px-4 py-3 text-slate-800 hover:text-slate-900" asChild>
                <Link to="/pages/about-usV2">About Us V2</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg px-4 py-3 text-slate-800 hover:text-slate-900" asChild>
                <Link to="/pages/about-usV3">About Us V3</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/pages/contact" className={navLinkClass(isContactPath(pathname))}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};
