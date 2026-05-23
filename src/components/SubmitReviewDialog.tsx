import { useCallback, useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CustomerReview } from "@/data/customerReviews";
import { verifyOrderForReview, submitCustomerReview } from "@/lib/reviewApi";
import { StarRatingInput } from "@/components/StarRatingInput";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SubmitReviewDialogProps = {
  productHandle: string;
  onReviewSubmitted: (review: CustomerReview) => void;
};

function ReviewDialogProgress({ step }: { step: 1 | 2 }) {
  return (
    <div
      className="px-6 pb-5 pt-5 pr-14 sm:px-8 sm:pb-6 sm:pr-16 sm:pt-6"
      aria-label="Review steps"
    >
      <div className="grid grid-cols-2 gap-x-4 pb-4 sm:gap-x-8 sm:pb-5">
        <span
          className={cn(
            "min-w-0 font-heading text-[0.7rem] font-bold uppercase leading-snug tracking-[0.12em] sm:text-xs sm:tracking-[0.14em]",
            step === 1 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Verify
        </span>
        <span
          className={cn(
            "min-w-0 font-heading text-[0.7rem] font-bold uppercase leading-snug tracking-[0.12em] sm:text-xs sm:tracking-[0.14em]",
            step === 2 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Write a review
        </span>
      </div>
      <div
        className="relative h-[2px] w-full bg-foreground/15"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={2}
        aria-label={step === 1 ? "Step 1 of 2: Verify" : "Step 2 of 2: Write a review"}
      >
        <div
          className="absolute inset-y-0 w-1/2 bg-foreground transition-[left] duration-300 ease-out"
          style={{ left: step === 1 ? "0%" : "50%" }}
        />
      </div>
    </div>
  );
}

export function SubmitReviewDialog({ productHandle, onReviewSubmitted }: SubmitReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verifiedOrderName, setVerifiedOrderName] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const photoId = useId();

  const resetForm = useCallback(() => {
    setName("");
    setOrderNumber("");
    setVerificationToken(null);
    setVerifiedOrderName(null);
    setRating(5);
    setTitle("");
    setText("");
    setImagePreview(null);
    setImageBase64(undefined);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await verifyOrderForReview(orderNumber, productHandle);
      if (result.ok === false) {
        toast.error(result.error);
        return;
      }
      setVerificationToken(result.verificationToken);
      setVerifiedOrderName(result.orderName);
      toast.success(`Order ${result.orderName} verified`);
    } catch {
      toast.error("Could not verify your order. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handlePhoto = (file: File | undefined) => {
    if (!file) {
      setImagePreview(null);
      setImageBase64(undefined);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 2_000_000) {
      toast.error("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!verificationToken) {
      toast.error("Verify your order number first.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitCustomerReview({
        productHandle,
        name,
        verificationToken,
        rating,
        title: title.trim() || undefined,
        text,
        imageBase64,
      });
      if (result.ok === false) {
        toast.error(result.error);
        return;
      }
      onReviewSubmitted(result.review);
      toast.success("Thank you! Your review has been posted.");
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Could not submit your review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const verified = Boolean(verificationToken);
  const step: 1 | 2 = verified ? 2 : 1;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="brand-btn-editorial shrink-0">
          Write a review
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden rounded-none p-0 sm:max-w-lg",
          "[&>button]:right-5 [&>button]:top-5 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center sm:[&>button]:right-6 sm:[&>button]:top-6",
          "[&>button_svg]:h-5 [&>button_svg]:w-5",
        )}
      >
        <ReviewDialogProgress step={step} />

        <div className="max-h-[min(70vh,34rem)] overflow-y-auto px-6 pb-8 pt-6 sm:px-8 sm:pb-9 sm:pt-7">
          <DialogTitle className="brand-display text-lg text-foreground">
            Write a review
          </DialogTitle>
          <p className="brand-review-body mt-2 text-muted-foreground">
            Verify your order, then share your experience.
          </p>

          {step === 1 ? (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="review-name" className="brand-eyebrow text-foreground/70">
                  Your name
                </Label>
                <Input
                  id="review-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name or display name"
                  autoComplete="name"
                  className="brand-field-underline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-order" className="brand-eyebrow text-foreground/70">
                  Order number
                </Label>
                <div className="flex items-end gap-4">
                  <Input
                    id="review-order"
                    value={orderNumber}
                    onChange={(e) => {
                      setOrderNumber(e.target.value);
                      setVerificationToken(null);
                      setVerifiedOrderName(null);
                    }}
                    placeholder="e.g. 1234 or #1234"
                    className="brand-field-underline min-w-0 flex-1"
                  />
                  <button
                    type="button"
                    className="brand-btn-editorial shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={handleVerify}
                    disabled={verifying || !orderNumber.trim()}
                  >
                    {verifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
                {verifiedOrderName ? (
                  <p className="brand-eyebrow text-green-800">Order {verifiedOrderName} verified</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {verifiedOrderName ? (
                <p className="brand-eyebrow text-foreground/60">Order {verifiedOrderName}</p>
              ) : null}

              <div className="space-y-2">
                <Label className="brand-eyebrow text-foreground/70">Your rating</Label>
                <StarRatingInput value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-title" className="brand-eyebrow text-foreground/70">
                  Headline (optional)
                </Label>
                <Input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience"
                  className="brand-field-underline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-text" className="brand-eyebrow text-foreground/70">
                  Your review
                </Label>
                <Textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What did you like? How do you use it?"
                  rows={5}
                  className="brand-textarea-underline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={photoId} className="brand-eyebrow text-foreground/70">
                  Photo (optional)
                </Label>
                <Input
                  id={photoId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                  className="brand-field-underline cursor-pointer file:font-heading file:text-xs file:uppercase file:tracking-[0.1em] file:text-foreground"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview of your review photo"
                    className="h-24 w-24 border border-foreground/15 object-cover"
                  />
                ) : null}
              </div>

              <button
                type="button"
                className="brand-btn-editorial w-full disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit review"
                )}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
