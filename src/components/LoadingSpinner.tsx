import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  /** Accessible label (default: "Loading"). */
  label?: string;
  className?: string;
  iconClassName?: string;
};

/** Centered loading indicator with screen-reader announcement. */
export function LoadingSpinner({
  label = "Loading",
  className,
  iconClassName = "w-8 h-8",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("flex justify-center py-24", className)}
    >
      <Loader2 className={cn("animate-spin text-primary", iconClassName)} aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Inline spinner for buttons: keeps visible label, adds busy state. */
export function ButtonSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </>
  );
}
