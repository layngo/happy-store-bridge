import { type PressCategory } from "@/data/pressArchive";
import { PressArticleTable } from "@/components/PressArticleTable";
import { PRESS_CATEGORY_IMAGES } from "@/lib/pressCategoryImages";
import { cn } from "@/lib/utils";

const pressCategoryBorderClass = "rounded-2xl border-2 border-black bg-white overflow-hidden";

export const PressCategoryBox = ({ category }: { category: PressCategory }) => {
  const image = PRESS_CATEGORY_IMAGES[category.title];

  return (
    <article className={cn("not-prose w-full", pressCategoryBorderClass)}>
      <div className="flex flex-col md:flex-row">
        {image ? (
          <div className="relative w-full shrink-0 md:w-[min(42%,22rem)]">
            <img
              src={image.src}
              alt={image.alt}
              className="block h-full min-h-[12rem] w-full object-cover object-center md:min-h-full md:max-w-none"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-black/10 px-5 py-4 sm:px-6 sm:py-5">
            <h2 className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl">
              {category.title}
            </h2>
          </header>

          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <PressArticleTable category={category} className="border-0 rounded-none" />
          </div>
        </div>
      </div>
    </article>
  );
};
