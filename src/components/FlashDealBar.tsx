import { Link } from "react-router-dom";
import { useFlashDeal } from "@/hooks/useFlashDeal";
import { FLASH_PET_URL, FLASH_THRESHOLD } from "@/lib/flashDeal";

function PetLink() {
  return (
    <Link to={FLASH_PET_URL} className="font-semibold underline underline-offset-2">
      pet bed
    </Link>
  );
}

export function FlashDealBar() {
  const { paidCount, petQty, unlocked, remaining } = useFlashDeal();
  const progress = Math.min(paidCount, FLASH_THRESHOLD);

  let copy: React.ReactNode;
  if (unlocked && petQty > 0) copy = <>Your <PetLink /> is free with this order.</>;
  else if (unlocked) copy = <>Unlocked — pick your free <PetLink />.</>;
  else if (paidCount === 0) copy = <>Buy any 3 items and a <PetLink /> is free.</>;
  else copy = <>Add {remaining} more item{remaining === 1 ? "" : "s"} and a <PetLink /> is free.</>;

  return (
    <div className="flash-deal-bar w-full" role="region" aria-label="Flash deal">
      <div className="container flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-2 text-xs sm:text-sm">
        <span className="rounded-full bg-[hsl(var(--flash-deal-foreground))] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[hsl(var(--flash-deal))] sm:text-xs">
          FLASH DEAL
        </span>
        <p className="font-medium">{copy}</p>
        <div className="flex items-center gap-2" aria-label={`${progress} of ${FLASH_THRESHOLD} items`}>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[hsl(var(--flash-deal-foreground)/0.2)] sm:w-28">
            <div
              className="h-full rounded-full bg-[hsl(var(--flash-deal-foreground))] transition-[width] duration-500"
              style={{ width: `${(progress / FLASH_THRESHOLD) * 100}%` }}
            />
          </div>
          <span className="tabular-nums font-semibold">
            {progress}/{FLASH_THRESHOLD}
          </span>
        </div>
      </div>
    </div>
  );
}
