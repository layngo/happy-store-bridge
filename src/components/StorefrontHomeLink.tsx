import { type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { STOREFRONT_HOME_URL } from "@/lib/siteSeo";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  children: ReactNode;
};

/**
 * Logo / home link that lands on the headless storefront (not the legacy Shopify theme).
 * Uses client-side routing when already on the storefront origin; otherwise navigates to STOREFRONT_HOME_URL.
 */
export function StorefrontHomeLink({ children, className, onClick, ...props }: Props) {
  const navigate = useNavigate();
  const homeHref = `${STOREFRONT_HOME_URL}/`;
  const storefrontOrigin = new URL(STOREFRONT_HOME_URL).origin;
  const onStorefrontOrigin =
    typeof window !== "undefined" && window.location.origin === storefrontOrigin;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (onStorefrontOrigin) {
      event.preventDefault();
      navigate("/");
    }
  };

  return (
    <a href={homeHref} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
