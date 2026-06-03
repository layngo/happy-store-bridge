import { ArrowUpRight } from "lucide-react";

import { type PressArticle } from "@/data/pressArchive";
import {
  formatPressArticleDate,
  getPressPublicationLogo,
} from "@/lib/pressPublicationLogos";
import { cn } from "@/lib/utils";

type PressCategoryArticleListProps = {
  articles: readonly PressArticle[];
  /** Show brand logos in the date column (gifts & roundups). */
  showPublicationLogos?: boolean;
};

const PublicationLogo = ({ publication }: { publication: string }) => {
  const logo = getPressPublicationLogo(publication);
  if (!logo) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 px-1 sm:h-16 sm:w-16"
        aria-hidden
      >
        <span className="text-center font-heading text-[0.55rem] font-bold uppercase leading-tight text-muted-foreground">
          {publication.slice(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-2 sm:h-16 sm:w-16">
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-full max-w-full object-contain object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

const ArticleByline = ({
  article,
  showPublicationLogos,
}: {
  article: PressArticle;
  showPublicationLogos?: boolean;
}) => {
  const displayDate = formatPressArticleDate(article.date);

  if (showPublicationLogos) {
    return (
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground sm:text-sm">
        <span>{article.publication}</span>
        {displayDate ? (
          <>
            <span className="mx-1.5 font-normal text-muted-foreground" aria-hidden>
              ·
            </span>
            <time dateTime={displayDate} className="font-normal normal-case tracking-normal text-muted-foreground">
              {displayDate}
            </time>
          </>
        ) : null}
      </p>
    );
  }

  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {article.publication}
    </p>
  );
};

export const PressCategoryArticleList = ({
  articles,
  showPublicationLogos = false,
}: PressCategoryArticleListProps) => (
  <ul className="not-prose divide-y divide-border overflow-hidden rounded-2xl border-2 border-black bg-white">
    {articles.map((article, index) => (
      <li
        key={`${article.date}-${article.publication}-${index}`}
        className={cn(article.featured && "bg-primary/[0.06]")}
      >
        <div className="group flex gap-4 px-5 py-4 sm:gap-5 sm:px-6 sm:py-5">
          {showPublicationLogos ? (
            <PublicationLogo publication={article.publication} />
          ) : (
            <time
              dateTime={article.date}
              className="w-[5.5rem] shrink-0 pt-0.5 font-heading text-xs font-bold uppercase leading-tight tracking-[0.06em] text-muted-foreground sm:w-[6.25rem]"
            >
              {formatPressArticleDate(article.date) ?? article.date}
            </time>
          )}

          <div className="min-w-0 flex-1">
            <ArticleByline article={article} showPublicationLogos={showPublicationLogos} />
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
