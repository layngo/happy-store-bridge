import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5 sm:h-4 sm:w-4",
  md: "h-5 w-5 sm:h-6 sm:w-6",
  lg: "h-6 w-6 sm:h-7 sm:w-7",
} as const;

type StarRatingProps = {
  /** 0–5; each star fills proportionally (e.g. 4.7 → four full + 70% on the fifth) */
  rating: number;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  /** Accessible label; defaults to computed stars text */
  label?: string;
};

/** 0–1 fill amount for star index (0 = first star). */
function starFillAmount(rating: number, index: number): number {
  return Math.min(1, Math.max(0, rating - index));
}

export function StarRating({ rating, size = "md", className, label }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  const starClass = SIZE_CLASS[size];
  const ariaLabel = label ?? `${clamped.toFixed(1)} out of 5 stars`;

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[#e8a317]", className)} role="img" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = starFillAmount(clamped, i);

        if (fill >= 1) {
          return <Star key={i} className={cn(starClass, "fill-current stroke-none")} aria-hidden />;
        }

        if (fill <= 0) {
          return <Star key={i} className={cn(starClass, "fill-[#e5e7eb] stroke-none")} aria-hidden />;
        }

        const clipRight = Math.round((1 - fill) * 100);
        return (
          <span key={i} className={cn("relative inline-block", starClass)} aria-hidden>
            <Star className={cn(starClass, "fill-[#e5e7eb] stroke-none")} />
            <Star
              className={cn(starClass, "absolute inset-0 fill-current stroke-none")}
              style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
            />
          </span>
        );
      })}
    </span>
  );
}
