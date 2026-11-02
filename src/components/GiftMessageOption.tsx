import { useEffect, useId } from "react";
import { Gift } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { GIFT_MESSAGE_MAX_LENGTH, useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

/** "This is a gift" toggle + message box. The message is saved to the Shopify order. */
export function GiftMessageOption({ className }: { className?: string }) {
  const id = useId();
  const isGift = useCartStore((s) => s.isGift);
  const giftMessage = useCartStore((s) => s.giftMessage);
  const setIsGift = useCartStore((s) => s.setIsGift);
  const setGiftMessage = useCartStore((s) => s.setGiftMessage);
  const saveGiftMessage = useCartStore((s) => s.saveGiftMessage);

  // Save shortly after the shopper stops typing (or toggles the checkbox).
  useEffect(() => {
    const t = window.setTimeout(() => void saveGiftMessage(), 800);
    return () => window.clearTimeout(t);
  }, [isGift, giftMessage, saveGiftMessage]);

  return (
    <div className={cn("rounded-xl border border-border bg-background/60 p-3", className)}>
      <label htmlFor={`${id}-toggle`} className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          id={`${id}-toggle`}
          checked={isGift}
          onCheckedChange={(v) => setIsGift(v === true)}
        />
        <Gift className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-sm font-semibold text-foreground">This is a gift</span>
      </label>

      {isGift ? (
        <div className="mt-3">
          <label htmlFor={`${id}-message`} className="sr-only">
            Gift message
          </label>
          <Textarea
            id={`${id}-message`}
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            onBlur={() => void saveGiftMessage()}
            maxLength={GIFT_MESSAGE_MAX_LENGTH}
            rows={3}
            placeholder="Write a gift message (optional)"
            className="min-h-[72px] resize-none bg-background text-sm"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {giftMessage.length}/{GIFT_MESSAGE_MAX_LENGTH}
          </p>
        </div>
      ) : null}
    </div>
  );
}
