import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { getStaticPageSeo } from "@/lib/staticPageSeo";
import { cn } from "@/lib/utils";

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
  /** Main content max width (default: narrow prose column). */
  contentClassName?: string;
  /** Use when the visible page title is rendered inside children (e.g. hero banner). */
  hidePageTitle?: boolean;
  /** Override auto-detected meta description. */
  description?: string;
  /** Optional extra keywords for this page. */
  keywords?: string;
  /** Extra JSON-LD for this page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const StaticPageLayout = ({
  title,
  children,
  contentClassName,
  hidePageTitle = false,
  description,
  keywords,
  jsonLd,
}: StaticPageLayoutProps) => {
  const { pathname } = useLocation();
  const seo = getStaticPageSeo(pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSeo
        title={title}
        description={description ?? seo.description}
        pathname={pathname}
        keywords={keywords ?? seo.keywords}
        jsonLd={jsonLd}
      />
      <Header />
      <main
        id="main-content"
        className={cn("flex-1 container py-10", contentClassName ?? "max-w-3xl")}
      >
        {hidePageTitle ? null : (
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
        )}
        <div className="prose prose-neutral max-w-none prose-p:text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
