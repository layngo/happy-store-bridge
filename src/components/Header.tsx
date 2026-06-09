import { type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { DISCOUNT_POPUP_HOME_EVENT, requestHomeDiscountPopup } from "@/lib/discountPopupStorage";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import { shopCollectionLinks } from "@/lib/siteNav";
import { ChevronDown } from "lucide-react";
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

function navItemClass(active: boolean, light: boolean) {
  return cn(
    "nav-item text-xs sm:text-sm font-medium uppercase tracking-wide whitespace-nowrap transition-colors",
    active && "nav-item--active",
    active
      ? "text-foreground"
      : light
        ? "text-slate-600 hover:text-slate-900"
        : "text-muted-foreground hover:text-foreground",
  );
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
    <Link className={cn(navItemClass(active, light), className)} {...props}>
      {children}
      <NavSquiggle />
    </Link>
  );
}

function NavMenuTrigger({
  active,
  light,
  children,
}: {
  active: boolean;
  light: boolean;
  children: ReactNode;
}) {
  return (
    <DropdownMenuTrigger asChild>
      <button type="button" className={navItemClass(active, light)}>
        {children}
        <NavSquiggle />
      </button>
    </DropdownMenuTrigger>
  );
}

export const Header = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const { pathname } = useLocation();
  const light = variant === "light";

  const goHomeWithDiscountPopup = (e: MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
    }
    requestHomeDiscountPopup();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md",
        light ? "bg-white/95" : "border-b border-border bg-background/90",
      )}
    >
      <div className="container pt-3 pb-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex min-w-0 justify-start">
            <SearchBar light={light} className="w-full max-w-[10.5rem] sm:max-w-xs" />
          </div>

          <div className="flex justify-center">
            <Link to="/" className="flex flex-col items-center" aria-label="Lay-n-Go home">
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

        <nav aria-label="Main navigation" className={cn(
            "flex min-h-[2rem] w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 px-2 pt-3 mt-2",
            !light && "border-t border-border/60",
          )}
        >
          <NavItem
            to="/"
            active={isHomePath(pathname)}
            light={light}
            onClick={goHomeWithDiscountPopup}
          >
            Home
          </NavItem>

          <DropdownMenu>
            <NavMenuTrigger active={isShopPath(pathname)} light={light}>
              Shop
              <ChevronDown className="hidden sm:block h-3 w-3 shrink-0 opacity-70" aria-hidden />
            </NavMenuTrigger>
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
            <NavMenuTrigger active={isAboutPath(pathname)} light={light}>
              About Us
              <ChevronDown className="hidden sm:block h-3 w-3 shrink-0 opacity-70" aria-hidden />
            </NavMenuTrigger>
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
