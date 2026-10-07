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
  const { paidCount, freeApplied, unlocked, remaining } = useFlashDeal();
  const progress = Math.min(paidCount, FLASH_THRESHOLD);

  let copy: React.ReactNode;
  if (freeApplied) copy = <>Your <PetLink /> is free with this order.</>;
  else if (unlocked) copy = <>Unlocked! Pick your free <PetLink />.</>;
  else if (paidCount === 0) copy = <>Buy any 3 items and a <PetLink /> is free.</>;
  else copy = <>Add {remaining} more item{remaining === 1 ? "" : "s"} and a <PetLink /> is free.</>;

  return (
    <div className="flash-deal-bar relative w-full" role="region" aria-label="Flash deal">
      <div className="container flex flex-col items-center justify-center gap-1.5 py-2.5 text-center sm:flex-row sm:gap-4">
        <span className="flash-deal-badge shrink-0 rounded-full bg-[hsl(var(--flash-deal-foreground))] px-2.5 py-1 text-[10px] font-extrabold leading-none tracking-[0.12em] text-[hsl(var(--flash-deal))] sm:text-xs">
          FLASH DEAL
        </span>
        <p className="min-w-0 text-[15px] font-bold leading-snug sm:text-base">{copy}</p>
        <span className="hidden shrink-0 rounded-full bg-[hsl(var(--flash-deal-foreground)/0.18)] px-2 sm:inline-block py-0.5 text-xs font-bold tabular-nums">
          {progress}/{FLASH_THRESHOLD}
        </span>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] bg-[hsl(var(--flash-deal-foreground)/0.2)]"
        aria-label={`${progress} of ${FLASH_THRESHOLD} items`}
      >
        <div
          className="h-full bg-[hsl(var(--flash-deal-foreground))] transition-[width] duration-500"
          style={{ width: `${(progress / FLASH_THRESHOLD) * 100}%` }}
        />
      </div>
    </div>
  );
}
