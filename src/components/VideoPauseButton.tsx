import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoPauseButtonProps = {
  isPaused: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
};

/** WCAG 2.2.2 — pause control for autoplaying muted video embeds. */
export function VideoPauseButton({ isPaused, onToggle, label, className }: VideoPauseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "pointer-events-auto absolute bottom-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full",
        "border border-white/30 bg-black/75 text-white shadow-lg backdrop-blur-sm",
        "transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
        className,
      )}
      aria-label={isPaused ? `Play ${label}` : `Pause ${label}`}
      aria-pressed={!isPaused}
    >
      {isPaused ? <Play className="h-4 w-4 fill-current" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
    </button>
  );
}
