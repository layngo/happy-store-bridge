import { useFlashDeal } from "@/hooks/useFlashDeal";
import { isFlashPetHandle } from "@/lib/flashDeal";
import { cn } from "@/lib/utils";

/** Price display that applies flash-deal messaging on the Travel Dog Bed. */
export function FlashDealPrice({
  handle,
  amount,
  className,
  labelClassName,
}: {
  handle: string;
  amount: string | number;
  className?: string;
  labelClassName?: string;
}) {
  const { unlocked, freeApplied } = useFlashDeal();
  const price = `$${parseFloat(String(amount)).toFixed(2)}`;
  if (!isFlashPetHandle(handle)) return <span className={className}>{price}</span>;

  const label = cn("block text-xs font-semibold normal-case tracking-normal text-[hsl(var(--flash-deal-ink))]", labelClassName);

  if (unlocked && !freeApplied) {
    return (
      <span className="inline-flex flex-col items-start">
        <span className={className}>
          <s className="mr-2 opacity-50">{price}</s>
          FREE
        </span>
        <span className={label}>Flash deal · free with this order</span>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-start">
      <span className={className}>{price}</span>
      <span className={label}>
        {freeApplied ? "Flash deal · 1 free pet bed per order" : "Flash deal · free with any 3 items"}
      </span>
    </span>
  );
}
