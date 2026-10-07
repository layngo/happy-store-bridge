import type { CartItem } from "@/lib/shopify";

/** Sitewide flash deal: buy any 3 non-pet items, get one Travel Dog Bed free. */
export const FLASH_PET_HANDLE = "lay-n-go-travel-dog-bed-44";
export const FLASH_PET_CODE = "FLASH-PET";
export const FLASH_PET_URL = `/product/${FLASH_PET_HANDLE}`;
export const FLASH_PET_TITLE = 'Lay-n-Go Travel Dog Bed (44")';
export const FLASH_THRESHOLD = 3;

export function isFlashPetHandle(handle: string | undefined | null): boolean {
  return (handle ?? "").toLowerCase() === FLASH_PET_HANDLE;
}

export function isFlashPetItem(item: CartItem): boolean {
  return isFlashPetHandle(item.product?.node?.handle);
}

export interface FlashDealState {
  /** All items in the cart, pet beds included. */
  paidCount: number;
  petQty: number;
  /** 3+ items of anything: shopper earned a free pet bed. */
  unlocked: boolean;
  /** A pet bed beyond the 3 qualifying items is in the cart, so one is free. */
  freeApplied: boolean;
  remaining: number;
  /** Dollar value of the one free bed (0 when not applied). */
  savings: number;
}

export function getFlashDealState(items: CartItem[]): FlashDealState {
  let total = 0;
  let petQty = 0;
  let petUnit = 0;
  for (const item of items) {
    total += item.quantity;
    if (isFlashPetItem(item)) {
      petQty += item.quantity;
      petUnit = parseFloat(item.price.amount) || petUnit;
    }
  }
  const unlocked = total >= FLASH_THRESHOLD;
  const freeApplied = petQty > 0 && total - 1 >= FLASH_THRESHOLD;
  return {
    paidCount: total,
    petQty,
    unlocked,
    freeApplied,
    remaining: Math.max(0, FLASH_THRESHOLD - total),
    savings: freeApplied ? petUnit : 0,
  };
}

/** Free quantity on a given cart line (only the first pet line gets the free unit). */
export function getFreeQtyForItem(item: CartItem, items: CartItem[], state: FlashDealState): number {
  if (!state.freeApplied || !isFlashPetItem(item)) return 0;
  const firstPet = items.find(isFlashPetItem);
  return firstPet?.variantId === item.variantId ? 1 : 0;
}
