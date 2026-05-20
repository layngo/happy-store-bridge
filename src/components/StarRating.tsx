import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5 sm:h-4 sm:w-4",
  md: "h-5 w-5 sm:h-6 sm:w-6",
  lg: "h-6 w-6 sm:h-7 sm:w-7",
} as const;

type StarRatingProps = {
  /** 0–5; supports half-star display when fractional */
  rating: number;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  /** Accessible label; defaults to computed stars text */
  label?: string;
};

export function StarRating({ rating, size = "md", className, label }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(clamped);
  const fraction = clamped - fullStars;
  const hasHalf = fraction >= 0.25 && fraction < 0.75;
  const roundUp = fraction >= 0.75;
  const filledCount = roundUp ? fullStars + 1 : fullStars;
  const showHalf = hasHalf && filledCount < 5;
  const starClass = SIZE_CLASS[size];
  const ariaLabel = label ?? `${clamped.toFixed(1)} out of 5 stars`;

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[#e8a317]", className)} role="img" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < filledCount) {
          return <Star key={i} className={cn(starClass, "fill-current stroke-none")} aria-hidden />;
        }
        if (i === filledCount && showHalf) {
          return (
            <span key={i} className={cn("relative inline-block", starClass)} aria-hidden>
              <Star className={cn(starClass, "fill-[#e5e7eb] stroke-none")} />
              <Star className={cn(starClass, "absolute inset-0 fill-current stroke-none [clip-path:inset(0_50%_0_0)]")} />
            </span>
          );
        }
        return <Star key={i} className={cn(starClass, "fill-[#e5e7eb] stroke-none")} aria-hidden />;
      })}
    </span>
  );
}
