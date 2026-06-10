import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { filterSearchSuggestions, type SearchSuggestion } from "@/lib/searchSuggestions";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  light?: boolean;
  /** Pre-fill from URL or page context. */
  defaultQuery?: string;
}

function SuggestionRow({
  item,
  onSelect,
}: {
  item: SearchSuggestion;
  onSelect: () => void;
}) {
  return (
    <li role="option" aria-selected={false}>
      <Link
        to={item.href}
        onClick={onSelect}
        className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-neutral-50">
          <img src={item.image} alt="" className="h-full w-full object-contain p-0.5" loading="lazy" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
          <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
        </span>
      </Link>
    </li>
  );
}

function SuggestionsPanel({
  listId,
  trimmed,
  suggestions,
  onSelect,
  onSearchAll,
  className,
}: {
  listId: string;
  trimmed: string;
  suggestions: SearchSuggestion[];
  onSelect: () => void;
  onSearchAll: () => void;
  className?: string;
}) {
  return (
    <div
      id={listId}
      role="listbox"
      aria-label={trimmed ? "Search suggestions" : "Suggested products"}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-lg",
        className,
      )}
    >
      <p className="border-b border-border/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {trimmed ? "Matches" : "Suggested"}
      </p>
      <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
        {suggestions.map((item) => (
          <SuggestionRow key={item.href} item={item} onSelect={onSelect} />
        ))}
        {trimmed && suggestions.length === 0 ? (
          <li className="px-3 py-3 text-sm text-muted-foreground">No quick matches.</li>
        ) : null}
      </ul>
      {trimmed ? (
        <div className="border-t border-border/70">
          <button
            type="button"
            onClick={onSearchAll}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">Search all products for &ldquo;{trimmed}&rdquo;</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export const SearchBar = ({ className, light, defaultQuery = "" }: SearchBarProps) => {
  const [q, setQ] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    setQ(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    if (!mobileExpanded) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [mobileExpanded]);

  useEffect(() => {
    if (!mobileExpanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileExpanded]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const trimmed = q.trim();
  const suggestions = useMemo(() => filterSearchSuggestions(trimmed), [trimmed]);
  const showDropdown = open && (suggestions.length > 0 || trimmed.length > 0);

  const closeMobile = () => {
    setMobileExpanded(false);
    setOpen(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = trimmed;
    setOpen(false);
    setMobileExpanded(false);
    if (!term) {
      navigate("/collections");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const goToFullSearch = () => {
    setOpen(false);
    setMobileExpanded(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const inputClassName = cn(
    "pl-9 h-9 text-sm w-full",
    light ? "bg-white/80 border-sky-200 placeholder:text-slate-500 text-slate-900" : "bg-muted/50",
  );

  const searchIconClass = light ? "text-slate-600" : "text-muted-foreground";

  const searchForm = (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search
        className={cn(
          "absolute left-3 top-1/2 z-10 -translate-y-1/2 h-4 w-4 pointer-events-none",
          searchIconClass,
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
        className={inputClassName}
        aria-label="Search products"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listId : undefined}
        aria-autocomplete="list"
      />
    </form>
  );

  return (
    <div ref={rootRef} className={cn("relative max-md:w-auto", className)}>
      {/* Mobile: icon only until expanded */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Search products"
        aria-expanded={mobileExpanded}
        className={cn("md:hidden h-9 w-9 shrink-0", light && "text-foreground hover:bg-muted/80")}
        onClick={() => {
          setMobileExpanded(true);
          setOpen(true);
        }}
      >
        <Search className="h-5 w-5" aria-hidden />
      </Button>

      {/* Desktop: inline search */}
      <div className="relative hidden w-full max-w-xs md:block">
        {searchForm}
        {showDropdown ? (
          <SuggestionsPanel
            listId={listId}
            trimmed={trimmed}
            suggestions={suggestions}
            onSelect={() => setOpen(false)}
            onSearchAll={goToFullSearch}
            className="absolute left-0 top-[calc(100%+0.35rem)] z-[60] w-[min(calc(100vw-2rem),20rem)] sm:w-80"
          />
        ) : null}
      </div>

      {/* Mobile: full-width overlay when expanded */}
      {mobileExpanded ? (
        <div
          className="md:hidden fixed inset-x-0 top-0 z-[70] border-b border-border/60 bg-white/98 px-4 pb-3 pt-3 shadow-sm backdrop-blur-md"
          role="dialog"
          aria-label="Search products"
        >
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">{searchForm}</div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close search"
              className="h-9 w-9 shrink-0"
              onClick={closeMobile}
            >
              <X className="h-5 w-5" aria-hidden />
            </Button>
          </div>
          {showDropdown ? (
            <SuggestionsPanel
              listId={listId}
              trimmed={trimmed}
              suggestions={suggestions}
              onSelect={closeMobile}
              onSearchAll={goToFullSearch}
              className="mt-2 w-full"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
