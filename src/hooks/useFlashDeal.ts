import { useEffect, useMemo, useRef } from "react";
import { useCartStore } from "@/stores/cartStore";
import { getFlashDealState, FLASH_PET_CODE } from "@/lib/flashDeal";
import { updateCartDiscountCodes } from "@/lib/shopify";

export function useFlashDeal() {
  const items = useCartStore((s) => s.items);
  return useMemo(() => getFlashDealState(items), [items]);
}

const appliedKey = (cartId: string) => `flash-pet-applied:${cartId}`;

/** Keeps FLASH-PET on the Shopify cart only while the deal is unlocked and a pet bed is in the cart. */
export function useFlashDealCodeSync() {
  const cartId = useCartStore((s) => s.cartId);
  const { unlocked, petQty } = useFlashDeal();
  const want = unlocked && petQty > 0;
  const busy = useRef(false);

  useEffect(() => {
    if (!cartId || busy.current) return;
    let had = false;
    try {
      had = localStorage.getItem(appliedKey(cartId)) === "1";
    } catch {
      /* ignore */
    }
    if (want === had) return;
    busy.current = true;
    (async () => {
      try {
        if (want) {
          const res = await updateCartDiscountCodes(cartId, [FLASH_PET_CODE]);
          if (res.success && res.applicable) {
            localStorage.setItem(appliedKey(cartId), "1");
          } else {
            // Shopify rejected the code: remove it so checkout doesn't show a rejected code.
            await updateCartDiscountCodes(cartId, []);
            localStorage.removeItem(appliedKey(cartId));
          }
        } else {
          await updateCartDiscountCodes(cartId, []);
          localStorage.removeItem(appliedKey(cartId));
        }
      } catch (e) {
        console.error("Flash deal code sync failed", e);
      } finally {
        busy.current = false;
      }
    })();
  }, [cartId, want]);
}
