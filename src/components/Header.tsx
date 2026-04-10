import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

export const Header = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const light = variant === "light";
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md",
        light ? "border-sky-200/80 bg-sky-100/85" : "border-border bg-background/80",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-heading text-xl font-bold tracking-wider",
              light ? "text-slate-900" : "text-foreground",
            )}
          >
            LAY / N / GO
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors",
              light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Home
          </Link>
          <a
            href="#products"
            className={cn(
              "text-sm font-medium transition-colors",
              light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Shop
          </a>
          <a
            href="#about"
            className={cn(
              "text-sm font-medium transition-colors",
              light ? "text-slate-600 hover:text-slate-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            About
          </a>
        </nav>
        <CartDrawer triggerClassName={light ? "text-slate-700 hover:bg-sky-200/60 hover:text-slate-900" : undefined} />
      </div>
    </header>
  );
};
