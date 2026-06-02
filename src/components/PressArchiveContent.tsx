import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PRESS_YEAR_RANGES,
  articleCountLabel,
  articlesForYearRange,
  buildPressArchiveLayout,
} from "@/lib/pressArchiveLayout";
import { type PressCategory } from "@/data/pressArchive";
import { PressArticleTable } from "@/components/PressArticleTable";

const TopicCategoryBlock = ({ category }: { category: PressCategory }) => (
  <div className="space-y-3">
    <h2 className="font-heading border-l-4 border-primary bg-muted/30 py-1 pl-3 text-base font-semibold text-foreground">
      {category.title}
    </h2>
    <PressArticleTable category={category} />
  </div>
);

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
            2011–2018 from the full archive. Pick a range to see every article from those years.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {PRESS_YEAR_RANGES.map((range) => {
            const count = articlesForYearRange(articlesByYear, range.start, range.end).length;
            return (
              <Link
                key={range.id}
                to={`/pages/press/${range.id}`}
                className="flex min-h-[7.5rem] flex-col items-center justify-center border-2 border-foreground bg-background px-4 py-6 text-center transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="font-heading text-2xl font-bold leading-none tracking-tight sm:text-3xl">
                  {range.label}
                </span>
                <span className="mt-2.5 text-sm font-medium tabular-nums opacity-80">
                  {articleCountLabel(count)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
