import { Link } from "react-router-dom";

import {
  type PressCategoryMeta,
  getPressCategoryImage,
  pressCategoryPath,
} from "@/lib/pressCategoryMeta";
import { articleCountLabel } from "@/lib/pressArchiveLayout";
import { cn } from "@/lib/utils";

const pressCategoryBorderClass = "rounded-2xl border-2 border-black bg-white overflow-hidden shadow-sm";

const cosmoDisplayHeadlineClass =
  "text-center font-heading font-black uppercase leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]";

export const PressCategoryBox = ({ meta, articleCount }: { meta: PressCategoryMeta; articleCount: number }) => {
  const image = getPressCategoryImage(meta.slug);

  return (
    <article
      className={cn(
        "group not-prose flex h-full w-full flex-col transition-shadow hover:shadow-md",
        pressCategoryBorderClass,
      )}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-black sm:aspect-[4/3]">
        {image ? (
          <img
            src={image.src}
            alt={`${meta.displayTitle} press coverage`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: image.objectPosition ?? "center" }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8 sm:px-6">
          <h2
            className={cn(
              cosmoDisplayHeadlineClass,
              "text-[clamp(1.15rem,4.2vw,1.5rem)] sm:text-[clamp(1.2rem,3.2vw,1.65rem)]",
            )}
          >
            {meta.displayTitle}
          </h2>
        </div>
      </div>

      <Link
        to={pressCategoryPath(meta.slug)}
        className="mt-auto flex w-full items-center justify-center border-t-2 border-black bg-white px-4 py-4 font-heading text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:py-4 sm:text-sm"
      >
        View coverage
        <span className="ml-2 font-medium normal-case tracking-normal text-muted-foreground group-hover:text-inherit">
          ({articleCountLabel(articleCount)})
        </span>
      </Link>
    </article>
  );
};
