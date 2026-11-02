import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

const GiftBow = () => (
  <svg className="gift-wrap-btn__bow" viewBox="0 0 38 22" aria-hidden>
    {/* left loop */}
    <path
      d="M19 16 C 10 2, 1 4, 3 12 C 5 19, 13 18, 19 16 Z"
      fill="hsl(var(--xmas-gold))"
      stroke="hsl(var(--xmas-red-deep) / 0.35)"
      strokeWidth="1"
    />
    {/* right loop */}
    <path
      d="M19 16 C 28 2, 37 4, 35 12 C 33 19, 25 18, 19 16 Z"
      fill="hsl(var(--xmas-gold))"
      stroke="hsl(var(--xmas-red-deep) / 0.35)"
      strokeWidth="1"
    />
    {/* inner loop shading */}
    <path d="M19 15 C 13 7, 7 7, 7 11 C 8 15, 13 15, 19 15 Z" fill="hsl(var(--xmas-red-deep) / 0.18)" />
    <path d="M19 15 C 25 7, 31 7, 31 11 C 30 15, 25 15, 19 15 Z" fill="hsl(var(--xmas-red-deep) / 0.18)" />
    {/* knot */}
    <ellipse cx="19" cy="16" rx="4" ry="3.6" fill="hsl(var(--xmas-gold))" stroke="hsl(var(--xmas-red-deep) / 0.4)" strokeWidth="1" />
  </svg>
);

/** A link styled as a wrapped present: patterned paper, gold ribbon and a bow on top. */
export const GiftWrapLink = ({ className, children, ...props }: LinkProps) => (
  <Link className={cn("gift-wrap-btn", className)} {...props}>
    <GiftBow />
    <span className="gift-wrap-btn__label">{children}</span>
  </Link>
);
