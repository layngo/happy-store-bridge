import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { PageSeo } from "@/components/PageSeo";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { navigateToCheckout } from "@/lib/navigateToCheckout";

const formatOptions = (item: CartItem) => {
  const label = item.selectedOptions
    .filter((o) => o.value && o.value !== "Default Title")
    .map((o) => o.value)
    .join(" · ");
  return label || null;
};

const CartPage = () => {
  const {
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const busy = isLoading || isSyncing;
  const checkoutUrl = getCheckoutUrl();

  const handleCheckout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (busy || items.length === 0) return;
    await syncCart();
    const url = getCheckoutUrl();
    if (url) {
      navigateToCheckout(url);
      return;
    }
    toast.error("Checkout unavailable", {
      description: "Please try again in a moment or contact info@layngo.com for help.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageSeo title="Your Cart | Lay-n-Go" description="Review the items in your bag and checkout." />
      <Header />
      <main id="main-content" className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Your bag
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {totalItems === 0
              ? "Nothing here yet — add something you love."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </p>

          {items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-5 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" aria-hidden />
              </span>
              <p className="font-heading text-lg font-semibold text-foreground">Your bag is empty</p>
              <Button asChild className="rounded-full px-8">
                <Link to="/collections">Shop collections</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
              <ul className="space-y-3">
                {items.map((item) => {
                  const { node } = item.product;
                  const image = node?.images?.edges?.[0]?.node;
                  const unitPrice = parseFloat(item.price.amount);
                  const lineTotal = unitPrice * item.quantity;
                  const opts = formatOptions(item);
                  return (
                    <li
                      key={item.variantId}
                      className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <Link
                        to={`/product/${node?.handle ?? ""}`}
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted"
                      >
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.altText || node?.title || "Product"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/product/${node?.handle ?? ""}`}
                            className="font-heading text-base font-semibold text-foreground hover:underline"
                          >
                            {node?.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            aria-label={`Remove ${node?.title ?? "item"}`}
                            className="text-muted-foreground transition hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {opts ? (
                          <p className="mt-1 text-xs text-muted-foreground">{opts}</p>
                        ) : null}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="px-3 py-1 text-sm"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="px-3 py-1 text-sm"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-heading text-base font-semibold text-foreground">
                              ${lineTotal.toFixed(2)}
                            </p>
                            {item.quantity > 1 ? (
                              <p className="text-xs text-muted-foreground">
                                ${unitPrice.toFixed(2)} each
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-foreground">Summary</h2>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button
                  asChild
                  className="mt-5 h-12 w-full rounded-full text-base font-semibold"
                  size="lg"
                  disabled={items.length === 0 || busy}
                >
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
                <Button asChild variant="ghost" className="mt-3 w-full rounded-full">
                  <Link to="/collections">Continue shopping</Link>
                </Button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CartPage;