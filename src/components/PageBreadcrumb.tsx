import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageBreadcrumbProps = {
  children: ReactNode;
  className?: string;
};

export function PageBreadcrumb({ children, className }: PageBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      {children}
    </nav>
  );
}
