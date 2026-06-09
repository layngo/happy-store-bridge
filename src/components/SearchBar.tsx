import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const SEARCH_SUGGESTIONS = [
  {
    title: 'Lay-n-Go Cosmo 20"',
    subtitle: "Cosmetic & makeup bag",
    href: "/product/lay-n-go-cosmo-20",
    image: "/cosmetic-bags-v2/cosmo-20.png",
  },
  {
    title: 'Lay-n-Go Large 60"',
    subtitle: "Activity & toy cleanup mat",
    href: "/product/lay-n-go-large-60",
    image: "/products/lay-n-go-large-pdp/hero-callout-main.png",
  },
] as const;

interface SearchBarProps {
  className?: string;
  light?: boolean;
  /** Pre-fill from URL or page context. */
  defaultQuery?: string;
}

export const SearchBar = ({ className, light, defaultQuery = "" }: SearchBarProps) => {
  const [q, setQ] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    setQ(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const showSuggestions = open && !q.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    setOpen(false);
    if (!term) {
      navigate("/collections");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-xs", className)}>
      <form onSubmit={submit} role="search">
        <Search
          className={cn(
            "absolute left-3 top-1/2 z-10 -translate-y-1/2 w-4 h-4 pointer-events-none",
            light ? "text-slate-600" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={cn(
            "pl-9 h-9 text-sm",
            light ? "bg-white/80 border-sky-200 placeholder:text-slate-500 text-slate-900" : "bg-muted/50",
          )}
          aria-label="Search products"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? listId : undefined}
          aria-autocomplete="list"
        />
      </form>

      {showSuggestions ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Suggested products"
          className="absolute left-0 top-[calc(100%+0.35rem)] z-[60] w-[min(calc(100vw-2rem),18rem)] overflow-hidden rounded-xl border border-border bg-white shadow-lg sm:w-72"
        >
          <p className="border-b border-border/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Suggested
          </p>
          <ul className="py-1">
            {SEARCH_SUGGESTIONS.map((item) => (
              <li key={item.href} role="option" aria-selected={false}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-neutral-50">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-contain p-0.5"
                      loading="lazy"
                    />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
