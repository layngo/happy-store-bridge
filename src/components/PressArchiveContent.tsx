import { useMemo } from "react";
import {
  PRESS_ARCHIVE_YEARS,
  buildPressArchiveLayout,
  type PressArchiveYear,
} from "@/lib/pressArchiveLayout";
import {
  type PressArticle,
  type PressCategory,
} from "@/data/pressArchive";
import { cn } from "@/lib/utils";

const ArticleTitle = ({ article }: { article: PressArticle }) => {
  if (article.unavailable || !article.href) {
    return <span className="italic text-muted-foreground">{article.title}</span>;
  }

  return (
    <a
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {article.title}
    </a>
  );
};

const PressTable = ({ category }: { category: PressCategory }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full min-w-[640px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50">
          <th className="w-[130px] whitespace-nowrap px-4 py-2.5 text-left font-heading font-semibold text-foreground">
            Date
          </th>
          <th className="w-[180px] px-4 py-2.5 text-left font-heading font-semibold text-foreground">
            Publication
          </th>
          <th className="px-4 py-2.5 text-left font-heading font-semibold text-foreground">Article</th>
        </tr>
      </thead>
      <tbody>
        {category.articles.map((article, index) => (
          <tr
            key={`${article.date}-${article.publication}-${article.title}-${index}`}
            className={cn(
              "border-b border-border last:border-b-0",
              article.featured && "bg-primary/5 font-medium",
            )}
          >
            <td className="whitespace-nowrap px-4 py-2.5 align-top text-muted-foreground">{article.date}</td>
            <td className="px-4 py-2.5 align-top text-foreground">{article.publication}</td>
            <td className="px-4 py-2.5 align-top">
              <ArticleTitle article={article} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TopicCategoryBlock = ({ category }: { category: PressCategory }) => (
  <div className="space-y-3">
    <h2 className="font-heading border-l-4 border-primary bg-muted/30 py-1 pl-3 text-base font-semibold text-foreground">
      {category.title}
    </h2>
    <PressTable category={category} />
  </div>
);

function YearArchivePanel({ year, articles }: { year: PressArchiveYear; articles: PressArticle[] }) {
  const count = articles.length;
  const label = count === 1 ? "1 article" : `${count} articles`;

  return (
    <details className="group rounded-lg border border-border bg-card/30 open:bg-card/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-heading text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{year}</span>
        <span className="shrink-0 text-sm font-normal tabular-nums text-muted-foreground">{label}</span>
      </summary>
      <div className="border-t border-border px-1 pb-4 pt-3">
        {count > 0 ? (
          <PressTable category={{ title: `${year}`, articles }} />
        ) : (
          <p className="px-3 py-2 text-sm text-muted-foreground">No articles in the archive for this year.</p>
        )}
      </div>
    </details>
  );
}

export const PressArchiveContent = () => {
  const { topicCategories, articlesByYear } = useMemo(() => buildPressArchiveLayout(), []);

  return (
    <div className="not-prose space-y-12">
      <div className="space-y-10">
        {topicCategories.map((category) => (
          <TopicCategoryBlock key={category.title} category={category} />
        ))}
      </div>

      <section className="space-y-5 border-t border-border pt-10">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Earlier coverage by year</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            2011–2018 articles from the full archive. Open a year to see the list — counts include everything
            for that year except items already listed above.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {PRESS_ARCHIVE_YEARS.map((year) => (
            <YearArchivePanel key={year} year={year} articles={articlesByYear[year]} />
          ))}
        </div>
      </section>
    </div>
  );
};
