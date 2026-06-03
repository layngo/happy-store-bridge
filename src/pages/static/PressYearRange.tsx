import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressCategoryArticleList } from "@/components/PressCategoryArticleList";
import { PressYearRangeHero } from "@/components/PressYearRangeHero";
import {
  articleCountLabel,
  articlesForYearRange,
  buildPressArchiveLayout,
  getPressYearRange,
  isPressYearRangeId,
} from "@/lib/pressArchiveLayout";

const PressYearRange = () => {
  const { rangeId } = useParams<{ rangeId: string }>();

  const layout = useMemo(() => buildPressArchiveLayout(), []);

  if (!rangeId || !isPressYearRangeId(rangeId)) {
    return <Navigate to="/pages/press" replace />;
  }

  const range = getPressYearRange(rangeId);
  const articles = articlesForYearRange(layout.articlesByYear, range.start, range.end);
  const heroTitle = rangeId;

  return (
    <StaticPageLayout title={range.label} contentClassName="max-w-3xl" hidePageTitle>
      <div className="not-prose -mt-2 space-y-8 sm:space-y-10">
        <Link
          to="/pages/press"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to press
        </Link>

        <PressYearRangeHero title={heroTitle} />

        <p className="text-sm text-muted-foreground">
          {articleCountLabel(articles.length)} from the Lay-n-Go archive.
        </p>

        {articles.length > 0 ? (
          <PressCategoryArticleList articles={articles} showPublicationLogos />
        ) : (
          <p className="text-muted-foreground">No articles in this range.</p>
        )}
      </div>
    </StaticPageLayout>
  );
};

export default PressYearRange;
