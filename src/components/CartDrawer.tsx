import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { navigateToCheckout } from "@/lib/navigateToCheckout";
import { cn } from "@/lib/utils";

function formatOptions(item: CartItem) {
  return item.selectedOptions
    .filter((o) => o.value && o.value !== "Default Title")
    .map((o) => o.value)
    .join(" · ");
}

function CartLineItem({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const { node } = item.product;
  const image = node.images?.edges?.[0]?.node;
  const unitPrice = parseFloat(item.price.amount);
  const lineTotal = unitPrice * item.quantity;
  const optionsLabel = formatOptions(item);

  return (
    <article className="cart-line group">
      <Link to={`/product/${node.handle}`} className="cart-line__media">
        {image ? (
          <img src={image.url} alt={image.altText || node.title} className="cart-line__img" loading="lazy" />
        ) : (
          <span className="cart-line__img-placeholder" aria-hidden />
        )}
      </Link>

      <div className="cart-line__body">
        <div className="cart-line__head">
          <Link to={`/product/${node.handle}`} className="cart-line__title">
            {node.title}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${node.title} from cart`}
            className="cart-line__remove"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        {optionsLabel ? <p className="cart-line__options">{optionsLabel}</p> : null}

        <div className="cart-line__footer">
          <div className="cart-line__qty" role="group" aria-label={`Quantity for ${node.title}`}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Decrease quantity of ${node.title}`}
              className="cart-line__qty-btn"
              onClick={onDecrease}
            >
              <Minus className="h-4 w-4" aria-hidden />
            </Button>
            <span className="cart-line__qty-value" aria-live="polite">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Increase quantity of ${node.title}`}
              className="cart-line__qty-btn"
              onClick={onIncrease}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="cart-line__pricing">
            <p className="cart-line__line-total">${lineTotal.toFixed(2)}</p>
            {item.quantity > 1 ? (
              <p className="cart-line__unit-price">${unitPrice.toFixed(2)} each</p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export const CartDrawer = ({ triggerClassName }: { triggerClassName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const busy = isLoading || isSyncing;
  const checkoutUrl = getCheckoutUrl();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (busy || items.length === 0) return;
    await syncCart();
    const url = getCheckoutUrl();
    if (url) {
      setIsOpen(false);
      await navigateToCheckout(url);
      return;
    }
    toast.error("Checkout unavailable", {
      description: "Please try again in a moment or contact info@layngo.com for help.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={totalItems > 0 ? `Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}` : "Open cart"}
          className={cn("relative", triggerClassName)}
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="cart-drawer flex h-full w-full flex-col gap-0 border-border bg-[#f5f5f7] p-0 sm:max-w-[min(100vw,28rem)]">
        <SheetHeader className="cart-drawer__header flex-shrink-0 border-b border-black/[0.06] bg-white px-5 pb-4 pt-6 text-left">
          <SheetTitle className="font-heading text-xl font-semibold tracking-[-0.02em] text-foreground">
            Your bag
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {totalItems === 0
              ? "Nothing here yet — add something you love."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="font-heading text-lg font-semibold text-foreground">Your bag is empty</p>
                <p className="max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                  Browse our collections and add a Lay-n-Go to get started.
                </p>
              </div>
              <Button asChild className="rounded-full px-8" onClick={() => setIsOpen(false)}>
                <Link to="/collections">Shop collections</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-drawer__items min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.variantId}
                      item={item}
                      onRemove={() => removeItem(item.variantId)}
                      onDecrease={() => updateQuantity(item.variantId, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.variantId, item.quantity + 1)}
                    />
                  ))}
                </div>
              </div>

              <div className="cart-drawer__footer flex-shrink-0 border-t border-black/[0.06] bg-white px-5 py-5">
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button asChild className="h-12 w-full rounded-full text-base font-semibold" size="lg" disabled={items.length === 0 || busy}>
                  <a
                    href={checkoutUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCheckout}
                  >
                    {busy ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-label="Updating cart" />
                    ) : (
                      <>
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                      </>
                    )}
                  </a>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
