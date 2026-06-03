import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressCategoryArticleList } from "@/components/PressCategoryArticleList";
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
    <StaticPageLayout title={meta.displayTitle} contentClassName="max-w-3xl">
      <Link
        to="/pages/press"
        className="not-prose mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to press
      </Link>

      {image ? (
        <div className="not-prose relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border-2 border-black sm:aspect-[2.4/1]">
          <img
            src={image.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: image.objectPosition ?? "center" }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden />
        </div>
      ) : null}

      <p className="not-prose -mt-2 mb-8 text-sm text-muted-foreground">
        {articleCountLabel(category.articles.length)} in this collection.
      </p>

      <PressCategoryArticleList articles={category.articles} />
    </StaticPageLayout>
  );
};

export default PressCategory;
