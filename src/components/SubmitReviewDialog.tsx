import { useCallback, useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CustomerReview } from "@/data/customerReviews";
import { verifyOrderForReview, submitCustomerReview } from "@/lib/reviewApi";
import { StarRatingInput } from "@/components/StarRatingInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SubmitReviewDialogProps = {
  productHandle: string;
  onReviewSubmitted: (review: CustomerReview) => void;
};

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
      if (!result.ok) {
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
      if (!result.ok) {
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="shrink-0 rounded-full px-5">
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Write a review</DialogTitle>
          <DialogDescription>
            Verify your Shopify order, then share your experience. Ratings can be set in half-star steps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-name">Your name</Label>
            <Input
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name or display name"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-order">Order number</Label>
            <div className="flex gap-2">
              <Input
                id="review-order"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setVerificationToken(null);
                  setVerifiedOrderName(null);
                }}
                placeholder="e.g. 1234 or #1234"
                disabled={verified}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleVerify}
                disabled={verifying || !orderNumber.trim() || verified}
              >
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
            {verifiedOrderName ? (
              <p className="text-xs text-green-700">Verified order {verifiedOrderName}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                We check your order in Shopify to confirm you bought this product.
              </p>
            )}
          </div>

          {verified ? (
            <>
              <div className="space-y-2">
                <Label>Your rating</Label>
                <StarRatingInput value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-title">Headline (optional)</Label>
                <Input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-text">Your review</Label>
                <Textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What did you like? How do you use it?"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={photoId}>Photo (optional)</Label>
                <Input
                  id={photoId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview of your review photo"
                    className="h-24 w-24 rounded-lg border border-border object-cover"
                  />
                ) : null}
              </div>

              <Button type="button" className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit review"
                )}
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
