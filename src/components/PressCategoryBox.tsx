import { ArrowUpRight } from "lucide-react";

import { type PressArticle, type PressCategory } from "@/data/pressArchive";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRESS_CATEGORY_IMAGES } from "@/lib/pressCategoryImages";
import { articleCountLabel } from "@/lib/pressArchiveLayout";
import { cn } from "@/lib/utils";

const pressCategoryBorderClass = "rounded-2xl border-2 border-black bg-white overflow-hidden shadow-sm";

function categoryAccordionId(title: string): string {
  return title.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase();
}

const PressArticleRow = ({ article }: { article: PressArticle }) => {
  const titleContent = (
    <span className="line-clamp-3 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[0.9375rem]">
      {article.title}
    </span>
  );

  return (
    <li
      className={cn(
        "border-t border-black/8 first:border-t-0",
        article.featured && "bg-primary/[0.06]",
      )}
    >
      <div className="group flex gap-3 px-4 py-3.5 sm:px-5">
        <time
          dateTime={article.date}
          className="w-[4.75rem] shrink-0 pt-0.5 font-heading text-[0.65rem] font-bold uppercase leading-tight tracking-[0.06em] text-muted-foreground sm:w-[5.25rem] sm:text-xs"
        >
          {article.date}
        </time>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
            {article.publication}
          </p>
          {article.unavailable || !article.href ? (
            <div className="mt-1 italic text-muted-foreground">{titleContent}</div>
          ) : (
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-start gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {titleContent}
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 shrink-0 text-primary opacity-70 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

export const PressCategoryBox = ({ category }: { category: PressCategory }) => {
  const image = PRESS_CATEGORY_IMAGES[category.title];
  const count = category.articles.length;
  const accordionId = categoryAccordionId(category.title);

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
            alt={image.alt}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5"
          aria-hidden
        />
        <h2 className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-16 font-heading text-lg font-bold leading-tight tracking-tight text-white sm:px-5 sm:text-xl">
          {category.title}
        </h2>
      </div>

      <Accordion type="single" collapsible className="mt-auto w-full">
        <AccordionItem value={`${accordionId}-articles`} className="border-0">
          <AccordionTrigger className="px-4 py-4 font-heading text-xs font-bold uppercase tracking-[0.12em] text-foreground hover:bg-muted/40 hover:no-underline sm:px-5 sm:text-sm [&[data-state=open]]:bg-muted/30">
            <span className="flex flex-col items-start gap-0.5 text-left sm:flex-row sm:items-center sm:gap-2">
              <span>View coverage</span>
              <span className="font-medium normal-case tracking-normal text-muted-foreground">
                ({articleCountLabel(count)})
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-0 pt-0">
            <ul className="max-h-[min(22rem,50vh)] overflow-y-auto overscroll-contain border-t border-black/10">
              {category.articles.map((article, index) => (
                <PressArticleRow
                  key={`${article.date}-${article.publication}-${index}`}
                  article={article}
                />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </article>
  );
};
