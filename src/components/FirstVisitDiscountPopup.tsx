import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendDiscountVerificationCode, verifyDiscountCode } from "@/lib/discountApi";
import {
  hasCompletedDiscountSignup,
  markDiscountPopupSeenThisSession,
  markDiscountSignupComplete,
  shouldShowDiscountPopup,
} from "@/lib/discountPopupStorage";
import { cn } from "@/lib/utils";

/** Once per fresh browser session on `/`; never again after signup (localStorage). */
const HERO_IMAGE = "/promo/first-visit-cosmo-hero.png";
const HERO_WIDTH = 1024;
const HERO_HEIGHT = 804;
type Step = "intro" | "email" | "phone" | "verify" | "code";

const redeemFieldClass =
  "font-cosmo-cta flex h-12 w-full items-center justify-center rounded-md border border-neutral-700 bg-[#2c2c2c] px-4 text-center text-base font-semibold tracking-wide text-neutral-50 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const otpSlotClass =
  "h-11 w-9 border-neutral-400 bg-white text-lg font-bold text-neutral-900 shadow-sm first:rounded-l-md first:border-l sm:h-12 sm:w-11 sm:text-xl";

export function FirstVisitDiscountPopup() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [busy, setBusy] = useState(false);

  const openPopup = useCallback(() => {
    if (hasCompletedDiscountSignup()) return;
    markDiscountPopupSeenThisSession();
    setStep("intro");
    setEmail("");
    setPhone("");
    setOtp("");
    setMarketingConsent(false);
    setDiscountCode("");
    setOpen(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("showDiscount") === "1") {
      openPopup();
      return;
    }

    if (location.pathname !== "/") return;
    if (!shouldShowDiscountPopup()) return;

    const id = window.setTimeout(openPopup, 600);
    return () => window.clearTimeout(id);
  }, [location.pathname, openPopup]);

  const dismiss = () => {
    markDiscountPopupSeenThisSession();
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss();
    else setOpen(true);
  };

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setEmail(trimmed);
    setStep("phone");
  };

  const submitPhone = async (e: FormEvent) => {
    e.preventDefault();
    if (!marketingConsent) {
      toast.error("Please agree to receive texts and marketing emails from Lay-n-Go.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setBusy(true);
    const result = await sendDiscountVerificationCode({
      email: email.trim(),
      phone: phone.trim(),
      marketingConsent,
    });
    setBusy(false);

    if (!result.ok) {
      toast.error((result as { error: string }).error);
      return;
    }

    toast.success(result.message ?? "Check your email for the code.");
    setOtp("");
    setStep("verify");
  };

  const submitVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    setBusy(true);
    const result = await verifyDiscountCode({
      email: email.trim(),
      phone: phone.trim(),
      code: otp,
    });
    setBusy(false);

    if (!result.ok) {
      toast.error((result as { error: string }).error);
      return;
    }

    markDiscountSignupComplete(email.trim());
    setDiscountCode(result.discountCode ?? "");
    toast.success(result.message ?? "You're verified!");
    setStep("code");
  };

  const resendCode = async () => {
    setBusy(true);
    const result = await sendDiscountVerificationCode({
      email: email.trim(),
      phone: phone.trim(),
      marketingConsent,
    });
    setBusy(false);

    if (!result.ok) {
      toast.error((result as { error: string }).error);
      return;
    }
    toast.success("Check your email for the new code.");
  };

  const copyCode = async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const finish = () => {
    markDiscountSignupComplete(email.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "left-[50%] top-[50%] z-[100] mx-auto w-[min(100%,calc(100vw-1rem))] max-h-[100dvh] max-w-[min(1024px,calc(100vw-1rem))] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-x-hidden overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-2xl",
          "[&>button]:right-3 [&>button]:top-3 [&>button]:z-[120] [&>button]:rounded-full [&>button]:border [&>button]:border-neutral-300/80 [&>button]:bg-white/95 [&>button]:p-2 [&>button]:shadow-md [&>button]:hover:bg-white",
        )}
      >
        <DialogTitle id="first-visit-discount-title" className="sr-only">
          You just won a free discount
        </DialogTitle>

        <div
          className="relative mx-auto w-full max-w-[min(1024px,calc(100vw-1rem))] shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/15"
          style={{ aspectRatio: `${HERO_WIDTH} / ${HERO_HEIGHT}` }}
        >
          <img
            src={HERO_IMAGE}
            alt="Lay-n-Go Cosmo promotional offer"
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            className="block h-full w-full select-none object-cover object-[20%_center] sm:object-center"
            loading="eager"
            decoding="async"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2 sm:pr-6 md:pr-10">
            <div
              className={cn(
                "pointer-events-auto flex min-h-0 max-h-full min-w-0 w-[min(55%,440px)] max-sm:w-[min(58%,13.5rem)] flex-col justify-center gap-3 overflow-y-auto overflow-x-hidden py-4 text-right sm:min-w-[12rem] sm:gap-4 sm:py-8",
              )}
            >
              <div className="min-w-0 space-y-1.5 sm:space-y-2">
                <h2
                  className={cn(
                    "font-heading font-black uppercase leading-[0.95] tracking-tight text-neutral-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]",
                    "text-[clamp(0.7rem,3.4vw,1.12rem)] sm:text-[clamp(0.82rem,3.8vw,1.65rem)] md:text-[clamp(2.55rem,8.4vw,5.55rem)]",
                    "break-words [word-break:break-word]",
                  )}
                >
                  You just won a free discount
                </h2>
                <p className="font-heading text-[clamp(0.65rem,2.8vw,1rem)] font-semibold uppercase tracking-tight text-neutral-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] sm:text-[clamp(0.75rem,2.2vw,1.2rem)]">
                  (15% off)
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                {step === "intro" ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setStep("email")}
                    className="font-cosmo-cta h-11 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-sm font-semibold tracking-wide text-neutral-50 shadow-md hover:bg-[#1f1f1f] sm:h-12 sm:text-base"
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
                      className={cn(redeemFieldClass, "h-11 text-right text-sm sm:h-12 sm:text-base")}
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="font-cosmo-cta h-11 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-sm font-semibold tracking-wide text-neutral-50 hover:bg-[#1f1f1f] sm:h-12 sm:text-base"
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
                      className={cn(redeemFieldClass, "h-11 text-right text-sm sm:h-12 sm:text-base")}
                      required
                    />
                    <div className="flex items-start justify-end gap-2 rounded-md border border-neutral-200/90 bg-white/90 px-2.5 py-2 text-left shadow-sm backdrop-blur-sm">
                      <Checkbox
                        id="discount-marketing-consent"
                        checked={marketingConsent}
                        onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                        className="mt-0.5 border-neutral-700 data-[state=checked]:bg-neutral-800"
                        aria-required
                      />
                      <label
                        htmlFor="discount-marketing-consent"
                        className="min-w-0 cursor-pointer text-[0.65rem] font-medium leading-snug text-neutral-800 sm:text-xs"
                      >
                        I agree to receive text and marketing emails from Lay-n-Go
                      </label>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!marketingConsent || busy}
                      className="font-cosmo-cta h-11 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-sm font-semibold tracking-wide text-neutral-50 hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-base"
                    >
                      {busy ? "Sending code…" : "Email me a verification code"}
                    </Button>
                  </form>
                ) : null}

                {step === "verify" ? (
                  <form onSubmit={submitVerify} className="space-y-2.5 rounded-xl border border-neutral-200/90 bg-white/95 p-3 text-right shadow-md backdrop-blur-sm sm:space-y-3 sm:p-4">
                    <p className="text-left text-xs font-semibold leading-snug text-neutral-900 sm:text-sm">
                      Check your email for the code
                    </p>
                    <p className="text-left text-[0.65rem] leading-snug text-neutral-600 sm:text-xs">
                      We sent a 6-digit code to{" "}
                      <span className="font-medium text-neutral-900">{email}</span>. Check spam if you
                      don&apos;t see it.
                    </p>
                    <div className="flex justify-center sm:justify-end">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                        <InputOTPGroup className="gap-1.5 sm:gap-2">
                          <InputOTPSlot index={0} className={otpSlotClass} />
                          <InputOTPSlot index={1} className={otpSlotClass} />
                          <InputOTPSlot index={2} className={otpSlotClass} />
                          <InputOTPSlot index={3} className={otpSlotClass} />
                          <InputOTPSlot index={4} className={otpSlotClass} />
                          <InputOTPSlot index={5} className={otpSlotClass} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={busy || otp.length < 6}
                      className="font-cosmo-cta h-11 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-sm font-semibold tracking-wide text-neutral-50 hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-base"
                    >
                      {busy ? "Verifying…" : "Verify & get my code"}
                    </Button>
                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={busy}
                      className="w-full text-[0.65rem] font-medium text-neutral-700 underline-offset-2 hover:underline disabled:opacity-50 sm:text-xs"
                    >
                      Resend code to email
                    </button>
                  </form>
                ) : null}

                {step === "code" ? (
                  <div className="space-y-2.5 rounded-xl border border-neutral-200/90 bg-white/90 p-3 text-right shadow-md backdrop-blur-sm sm:p-4">
                    <p className="text-xs font-medium text-neutral-700 sm:text-sm">Your discount code</p>
                    <p className="text-[0.65rem] text-neutral-600 sm:text-xs">
                      Valid for 10 days — use it at checkout before it expires.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      <code className="w-full rounded-md border border-neutral-200 bg-white px-2 py-2 text-center font-mono text-base font-semibold tracking-wide text-foreground sm:flex-1 sm:text-lg sm:text-right">
                        {discountCode}
                      </code>
                      <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={copyCode}>
                        Copy
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={finish}
                      className="font-cosmo-cta h-10 w-full rounded-md border border-neutral-700 bg-[#2c2c2c] text-sm text-neutral-50 hover:bg-[#1f1f1f] sm:h-11"
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
                    className="h-11 w-full gap-2 rounded-md bg-red-600 text-sm font-semibold text-white shadow-md hover:bg-red-700 sm:h-12 sm:text-base"
                  >
                    <X className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                    No, thanks. I&apos;ll pay more.
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
