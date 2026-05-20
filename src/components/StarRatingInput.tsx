import { StarRating } from "@/components/StarRating";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export function StarRatingInput({ value, onChange, className }: StarRatingInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <StarRating rating={value} size="md" />
        <span className="text-sm font-medium text-foreground">{value} stars</span>
      </div>
      <div className="space-y-2">
        <Label className="sr-only">Drag to set rating in half-star steps</Label>
        <Slider
          min={1}
          max={5}
          step={0.5}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          aria-label="Star rating"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>1</span>
          <span>2.5</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
}
