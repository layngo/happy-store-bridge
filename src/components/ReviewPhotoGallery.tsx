import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ReviewPhotoGalleryProps = {
  images: string[];
  /** Used for thumbnail / lightbox alt text (e.g. reviewer name). */
  photoLabel?: string;
  className?: string;
};

export function ReviewPhotoGallery({ images, photoLabel = "Customer", className }: ReviewPhotoGalleryProps) {
  const [enlargedSrc, setEnlargedSrc] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <ul
        className={cn("mt-5 flex flex-wrap gap-2 border-t border-foreground/10 pt-5", className)}
        aria-label="Photos from this review"
      >
        {images.map((src, index) => (
          <li key={`${src}-${index}`} className="shrink-0">
            <button
              type="button"
              className="group block cursor-zoom-in overflow-hidden border border-foreground/15 transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setEnlargedSrc(src)}
              aria-label={`View larger photo ${index + 1} from ${photoLabel}`}
            >
              <img
                src={src}
                alt={`${photoLabel} review photo ${index + 1}`}
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
                className="h-[4.5rem] w-[4.5rem] object-cover transition-opacity group-hover:opacity-90 sm:h-20 sm:w-20"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={enlargedSrc !== null} onOpenChange={(open) => !open && setEnlargedSrc(null)}>
        <DialogContent className="max-w-[min(92vw,48rem)] gap-0 border-foreground p-2 sm:p-3">
          <DialogTitle className="sr-only">
            {photoLabel} — review photo
          </DialogTitle>
          {enlargedSrc ? (
            <img
              src={enlargedSrc}
              alt={`${photoLabel} review photo`}
              className="mx-auto max-h-[min(85vh,720px)] w-full object-contain"
              decoding="async"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
