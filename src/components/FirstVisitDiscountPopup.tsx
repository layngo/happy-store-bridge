import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** On `/`, opens after load (again on every refresh). On any path, add `?showDiscount=1` to preview. */
const HERO_IMAGE = "/promo/first-visit-cosmo-hero.png";
const DISCOUNT_CODE = "LAYNGO15";

type Step = "intro" | "email" | "phone" | "code";

const redeemFieldClass =
  "font-cosmo-cta flex h-12 w-full items-center justify-center rounded-md border border-neutral-700 bg-[#2c2c2c] px-4 text-center text-base font-semibold tracking-wide text-neutral-50 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function FirstVisitDiscountPopup() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("showDiscount") === "1") {
      setStep("intro");
      setEmail("");
      setPhone("");
      setOpen(true);
      return;
    }

    if (location.pathname !== "/") {
      setOpen(false);
      return;
    }

    setStep("intro");
    setEmail("");
    setPhone("");
    const id = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.key]);

  const dismiss = () => {
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setOpen(false);
    else setOpen(true);
  };

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setStep("phone");
  };

  const submitPhone = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setStep("code");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const finish = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "left-[50%] top-[50%] z-[100] flex max-h-[92vh] w-[min(92vw,75vw)] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-y-auto overflow-x-hidden rounded-2xl border border-border p-0 sm:rounded-2xl",
        )}
      >
        <DialogTitle id="first-visit-discount-title" className="sr-only">
          You just won a free discount
        </DialogTitle>
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 md:items-stretch">
          <div className="flex items-center justify-center bg-neutral-100 md:min-h-[min(88vh,920px)]">
            <img
              src={HERO_IMAGE}
              alt="Lay-n-Go Cosmo bag with cosmetics"
              className="h-auto w-full max-w-none object-contain object-center max-h-[min(88vh,920px)]"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="flex flex-col justify-center gap-5 bg-white px-6 py-8 text-center sm:px-8 sm:py-10">
            <div className="space-y-2">
              <h2 className="font-heading text-[clamp(1.25rem,4.2vw,2.35rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground">
                You just won a free discount
              </h2>
              <p className="font-heading text-[clamp(1rem,3vw,1.35rem)] font-semibold uppercase tracking-tight text-foreground">
                (15% off)
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {step === "intro" ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep("email")}
                  className="font-cosmo-cta h-12 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-base font-semibold tracking-wide text-neutral-50 shadow-none hover:bg-[#1f1f1f]"
                >
                  Redeem
                </Button>
              ) : null}

              {step === "email" ? (
                <form onSubmit={submitEmail} className="space-y-2">
                  <label htmlFor="discount-email" className="sr-only">
                    Email
                  </label>
                  <Input
                    id="discount-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={redeemFieldClass}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="font-cosmo-cta h-12 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-base font-semibold tracking-wide text-neutral-50 hover:bg-[#1f1f1f]"
                  >
                    Continue
                  </Button>
                </form>
              ) : null}

              {step === "phone" ? (
                <form onSubmit={submitPhone} className="space-y-2">
                  <label htmlFor="discount-phone" className="sr-only">
                    Phone
                  </label>
                  <Input
                    id="discount-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={redeemFieldClass}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="font-cosmo-cta h-12 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-base font-semibold tracking-wide text-neutral-50 hover:bg-[#1f1f1f]"
                  >
                    Get my code
                  </Button>
                </form>
              ) : null}

              {step === "code" ? (
                <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-center text-sm font-medium text-neutral-700">Your discount code</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <code className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-center font-mono text-lg font-semibold tracking-wide text-foreground">
                      {DISCOUNT_CODE}
                    </code>
                    <Button type="button" variant="outline" className="shrink-0" onClick={copyCode}>
                      Copy
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={finish}
                    className="font-cosmo-cta h-11 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-neutral-50 hover:bg-[#1f1f1f]"
                  >
                    Done
                  </Button>
                </div>
              ) : null}

              {step !== "code" ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={dismiss}
                  className="h-12 w-full gap-2 rounded-md bg-red-600 text-base font-semibold text-white hover:bg-red-700"
                >
                  <X className="h-5 w-5 shrink-0" aria-hidden />
                  No, thanks. I&apos;ll pay more.
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
