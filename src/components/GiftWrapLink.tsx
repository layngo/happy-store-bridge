import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import goldBow from "@/assets/gold_gift_bow.png";

/** Inner content for any button styled with `gift-wrap-btn`: gold bow on top + label on the ribbon. */
export const GiftWrapLabel = ({ children }: { children: ReactNode }) => (
  <>
    <img className="gift-wrap-btn__bow" src={goldBow} alt="" aria-hidden width={240} height={201} draggable={false} />
    <span className="gift-wrap-btn__label">{children}</span>
  </>
);

/** A link styled as a wrapped present: candy-cane paper, gold satin ribbon and a bow on top. */
export const GiftWrapLink = ({ className, children, ...props }: LinkProps) => (
  <Link className={cn("gift-wrap-btn", className)} {...props}>
    <GiftWrapLabel>{children}</GiftWrapLabel>
  </Link>
);
