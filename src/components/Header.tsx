import { type ComponentPropsWithoutRef, type ReactNode } from "react";
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

function NavSquiggle() {
  return <span aria-hidden className="nav-item__squiggle" />;
}

function NavItem({
  active,
  light,
  className,
  children,
  ...props
}: {
  active: boolean;
  light: boolean;
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      className={cn(
        "nav-item text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap leading-none transition-colors",
        active && "nav-item--active",
        active
          ? "text-foreground"
          : light
            ? "text-slate-600 hover:text-slate-900"
            : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <span className="nav-item__label">{children}</span>
      <NavSquiggle />
    </Link>
  );
}

export const Header = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const { pathname } = useLocation();
  const light = variant === "light";

  const navTriggerClass = (active: boolean) =>
    cn(
      "nav-item text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap transition-colors",
      "!h-auto !min-h-0 !px-0 !py-0 !shadow-none rounded-none font-medium",
      "hover:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-transparent",
      active && "nav-item--active",
      active
        ? "text-foreground hover:text-foreground"
        : light
          ? "text-slate-600 hover:text-slate-900"
          : "text-muted-foreground hover:text-foreground",
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
            "flex overflow-x-auto pb-1 md:flex-wrap md:justify-center items-end gap-x-5 gap-y-2 pt-3 mt-2 border-t",
            light ? "border-border/70" : "border-border/60",
          )}
        >
          <NavItem to="/" active={isHomePath(pathname)} light={light}>
            Home
          </NavItem>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(navTriggerClass(isShopPath(pathname)), "[&_svg]:size-3")}>
                <span className="nav-item__label">
                  Shop <ChevronDown className="hidden sm:block opacity-70" />
                </span>
                <NavSquiggle />
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

          <NavItem to="/pages/press" active={isPressPath(pathname)} light={light}>
            Press
          </NavItem>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(navTriggerClass(isAboutPath(pathname)), "[&_svg]:size-3")}>
                <span className="nav-item__label">
                  About Us <ChevronDown className="hidden sm:block opacity-70" />
                </span>
                <NavSquiggle />
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

          <NavItem to="/pages/contact" active={isContactPath(pathname)} light={light}>
            Contact
          </NavItem>
        </nav>
      </div>
    </header>
  );
};
