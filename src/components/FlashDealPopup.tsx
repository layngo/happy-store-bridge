import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useFlashDeal } from "@/hooks/useFlashDeal";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { FLASH_PET_CODE, FLASH_PET_HANDLE, FLASH_PET_TITLE, FLASH_PET_URL, FLASH_THRESHOLD } from "@/lib/flashDeal";
import { cn } from "@/lib/utils";

async function copyCode() {
  try {
    await navigator.clipboard.writeText(FLASH_PET_CODE);
    return true;
  } catch {
    return false;
  }
}

export function FlashDealPopup() {
  const { paidCount, petQty } = useFlashDeal();
  const addItem = useCartStore((s) => s.addItem);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const prevCount = useRef<number | null>(null);

  // Open only when non-pet quantity crosses from under 3 to 3+ (not on refresh).
  useEffect(() => {
    const hydrated = useCartStore.persist?.hasHydrated?.() ?? true;
    if (!hydrated) return;
    if (prevCount.current === null) {
      prevCount.current = paidCount;
      return;
    }
    if (prevCount.current < FLASH_THRESHOLD && paidCount >= FLASH_THRESHOLD) setOpen(true);
    prevCount.current = paidCount;
  }, [paidCount]);

  useEffect(() => {
    if (!open || product) return;
    fetchProductByHandle(FLASH_PET_HANDLE).then(setProduct).catch(console.error);
  }, [open, product]);

  const variants = product?.variants.edges.map((e) => e.node) ?? [];
  const variant = variants[variantIdx];
  const image = variant?.image?.url ?? product?.images.edges[0]?.node.url;

  const handleCopy = async () => {
    if (await copyCode()) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      if (petQty === 0 && product && variant) {
        await addItem({
          product: { node: product },
          variantId: variant.id,
          variantTitle: variant.title,
          price: variant.price,
          quantity: 1,
          selectedOptions: variant.selectedOptions,
        });
      }
      await copyCode();
      toast.success("Free pet bed claimed", { description: `Code ${FLASH_PET_CODE} copied.` });
      setOpen(false);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="z-[200] max-w-md rounded-2xl p-6 sm:p-8">
        <DialogTitle className="brand-display text-center text-2xl leading-tight sm:text-3xl">
          Congrats — you won a free pet bed
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-muted-foreground">
          Add it to your cart and use this code at checkout. It applies when the order has at least 3 items besides
          the pet bed.
        </DialogDescription>

        <div className="mx-auto aspect-square w-48 overflow-hidden rounded-xl bg-muted">
          {image ? <img src={image} alt={FLASH_PET_TITLE} className="h-full w-full object-contain" /> : null}
        </div>

        <Link
          to={FLASH_PET_URL}
          onClick={() => setOpen(false)}
          className="text-center font-heading font-semibold underline underline-offset-2"
        >
          {FLASH_PET_TITLE}
        </Link>

        {variants.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Color">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={i === variantIdx}
                disabled={!v.availableForSale}
                onClick={() => setVariantIdx(i)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-40",
                  i === variantIdx ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                )}
              >
                {v.title}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[hsl(var(--flash-deal))] px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-widest">{FLASH_PET_CODE}</span>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <Button className="h-12 w-full rounded-full text-base font-semibold" onClick={handleClaim} disabled={claiming}>
          Claim your free pet bed
        </Button>
      </DialogContent>
    </Dialog>
  );
}
