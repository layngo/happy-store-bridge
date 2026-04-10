import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  light?: boolean;
}

export const SearchBar = ({ className, light }: SearchBarProps) => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      navigate("/collections");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={submit} className={cn("relative w-full max-w-xs", className)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
          light ? "text-slate-400" : "text-muted-foreground",
        )}
      />
      <Input
        type="search"
        placeholder="Search products…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={cn(
          "pl-9 h-9 text-sm",
          light ? "bg-white/80 border-sky-200 placeholder:text-slate-400" : "bg-muted/50",
        )}
        aria-label="Search products"
      />
    </form>
  );
};
