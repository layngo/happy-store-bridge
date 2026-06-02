import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressArticleTable } from "@/components/PressArticleTable";
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

  return (
    <StaticPageLayout title={`Press · ${range.label}`} contentClassName="max-w-6xl">
      <Link
        to="/pages/press"
        className="not-prose mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to press
      </Link>

      <p className="not-prose -mt-4 mb-8 text-sm text-muted-foreground">
        {articleCountLabel(articles.length)} from the Lay-n-Go archive.
      </p>

      {articles.length > 0 ? (
        <PressArticleTable category={{ title: range.label, articles }} />
      ) : (
        <p className="text-muted-foreground">No articles in this range.</p>
      )}
    </StaticPageLayout>
  );
};

export default PressYearRange;
