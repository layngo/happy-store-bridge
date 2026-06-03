import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PRESS_YEAR_RANGES,
  articleCountLabel,
  articlesForYearRange,
  buildPressArchiveLayout,
} from "@/lib/pressArchiveLayout";
import { PressCategoryBox } from "@/components/PressCategoryBox";
import { PRESS_CATEGORY_META } from "@/lib/pressCategoryMeta";

export const PressArchiveContent = () => {
  const { topicCategories, articlesByYear } = useMemo(() => buildPressArchiveLayout(), []);
  const categoryByTitle = useMemo(
    () => new Map(topicCategories.map((category) => [category.title, category])),
    [topicCategories],
  );

  return (
    <div className="not-prose space-y-12">
      <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PRESS_CATEGORY_META.map((meta) => {
          const category = categoryByTitle.get(meta.archiveTitle);
          if (!category) return null;
          return (
            <PressCategoryBox
              key={meta.slug}
              meta={meta}
              articleCount={category.articles.length}
            />
          );
        })}
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
