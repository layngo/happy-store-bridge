import { Helmet } from "react-helmet-async";
import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  organizationJsonLd,
  pageTitle,
  truncateText,
  webSiteJsonLd,
} from "@/lib/siteSeo";

type PageSeoProps = {
  /** Page title without site suffix (unless already includes Lay-n-Go). */
  title: string;
  description: string;
  /** Path for canonical + og:url, e.g. `/collections/play` */
  pathname?: string;
  /** og:type — product pages should pass `product`. */
  type?: "website" | "product" | "article";
  image?: string;
  imageAlt?: string;
  keywords?: string;
  /** Extra JSON-LD objects merged into the page (Organization + WebSite always included on marketing pages). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  /** Include global Organization + WebSite schema (default true). */
  includeSiteGraph?: boolean;
};

export function PageSeo({
  title,
  description,
  pathname = "/",
  type = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${SITE_NAME} logo`,
  keywords = DEFAULT_KEYWORDS,
  jsonLd,
  noindex = false,
  includeSiteGraph = true,
}: PageSeoProps) {
  const fullTitle = pageTitle(title);
  const metaDescription = truncateText(description, 160);
  const canonical = absoluteUrl(pathname);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  const schemas: Record<string, unknown>[] = [];
  if (includeSiteGraph) {
    schemas.push(organizationJsonLd(), webSiteJsonLd());
  }
  if (jsonLd) {
    schemas.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="bingbot" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <link rel="manifest" href="/manifest.webmanifest" />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncateText(description, 200)} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@layngo" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncateText(description, 200)} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Helps AI crawlers summarize page intent (non-standard but widely used). */}
      <meta name="abstract" content={metaDescription} />
      <meta name="summary" content={metaDescription} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { SITE_TAGLINE };
