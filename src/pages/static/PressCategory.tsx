import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressCategoryArticleList } from "@/components/PressCategoryArticleList";
import { PressCategoryHero } from "@/components/PressCategoryHero";
import { articleCountLabel } from "@/lib/pressArchiveLayout";
import {
  getPressCategoryBySlug,
  getPressCategoryImage,
  getPressCategoryMeta,
  isPressCategorySlug,
} from "@/lib/pressCategoryMeta";

const PressCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const meta = categorySlug ? getPressCategoryMeta(categorySlug) : undefined;
  const category = useMemo(
    () => (categorySlug && isPressCategorySlug(categorySlug) ? getPressCategoryBySlug(categorySlug) : undefined),
    [categorySlug],
  );
  const image = categorySlug && isPressCategorySlug(categorySlug) ? getPressCategoryImage(categorySlug) : undefined;

  if (!categorySlug || !isPressCategorySlug(categorySlug) || !meta || !category) {
    return <Navigate to="/pages/press" replace />;
  }

  return (
    <StaticPageLayout title={meta.displayTitle} contentClassName="max-w-3xl" hidePageTitle>
      <div className="not-prose -mt-2 space-y-8 sm:space-y-10">
        <Link
          to="/pages/press"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to press
        </Link>

        {image ? (
          <PressCategoryHero
            imageSrc={image.heroSrc}
            imageAlt={image.alt}
            title={meta.displayTitle}
            objectPosition={image.heroObjectPosition ?? "center"}
          />
        ) : null}

        <p className="text-sm text-muted-foreground">
          {articleCountLabel(category.articles.length)} in this collection.
        </p>

        <PressCategoryArticleList articles={category.articles} showPublicationLogos />
      </div>
    </StaticPageLayout>
  );
};

export default PressCategory;
