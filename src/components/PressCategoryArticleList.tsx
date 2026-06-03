import { ArrowUpRight } from "lucide-react";

import { type PressArticle } from "@/data/pressArchive";
import { cn } from "@/lib/utils";

export const PressCategoryArticleList = ({ articles }: { articles: readonly PressArticle[] }) => (
  <ul className="not-prose divide-y divide-border overflow-hidden rounded-2xl border-2 border-black bg-white">
    {articles.map((article, index) => (
      <li
        key={`${article.date}-${article.publication}-${index}`}
        className={cn(article.featured && "bg-primary/[0.06]")}
      >
        <div className="group flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <time
            dateTime={article.date}
            className="w-[5.5rem] shrink-0 pt-0.5 font-heading text-xs font-bold uppercase leading-tight tracking-[0.06em] text-muted-foreground sm:w-[6.25rem]"
          >
            {article.date}
          </time>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {article.publication}
            </p>
            {article.unavailable || !article.href ? (
              <p className="mt-1.5 text-sm font-semibold italic leading-snug text-muted-foreground sm:text-base">
                {article.title}
              </p>
            ) : (
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
                  {article.title}
                </span>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary opacity-70 transition-opacity group-hover:opacity-100 sm:h-5 sm:w-5"
                  aria-hidden
                />
              </a>
            )}
          </div>
        </div>
      </li>
    ))}
  </ul>
);
