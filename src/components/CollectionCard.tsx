import { Link } from "react-router-dom";
import type { ShopifyCollectionSummary } from "@/lib/shopify";
import {
  getHomeCategoryConfig,
  HOME_CATEGORY_FONT_CLASS,
} from "@/lib/homeCategoryCards";
import { VimeoLoopFadeEmbed } from "@/components/VimeoLoopFadeEmbed";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: ShopifyCollectionSummary;
  variant?: "default" | "home";
}

export const CollectionCard = ({ collection, variant = "default" }: CollectionCardProps) => {
  const img = collection.image;
  const homeConfig = variant === "home" ? getHomeCategoryConfig(collection.handle) : undefined;

  if (homeConfig) {
    const href = homeConfig.linkTo ?? `/collections/${collection.handle}`;
    const labelClass = cn(
      "home-cat-label",
      HOME_CATEGORY_FONT_CLASS[homeConfig.font],
      homeConfig.labelLines && "home-cat-label--stacked",
    );
    const hasVideo = Boolean(homeConfig.videoId);

    return (
      <Link to={href} className="group mx-auto block w-[94%]">
        <article className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          {hasVideo ? (
            <div className="absolute left-1/2 top-1/2 h-full aspect-video -translate-x-1/2 -translate-y-1/2">
              <VimeoLoopFadeEmbed
                videoId={homeConfig.videoId!}
                title={`${homeConfig.label} category video`}
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
            </div>
          ) : img ? (
            <img
              src={img.url}
              alt={img.altText || homeConfig.label}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" aria-hidden />
          )}
          {homeConfig.hoverSrc && hasVideo ? (
            <img
              src={homeConfig.hoverSrc}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
              loading="lazy"
              aria-hidden
            />
          ) : null}
          <div className="absolute inset-0 bg-black/25" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <h2 className={labelClass}>
              {homeConfig.labelLines ? (
                <>
                  <span className="home-cat-label__line">{homeConfig.labelLines[0]}</span>
                  <span className="home-cat-label__line">{homeConfig.labelLines[1]}</span>
                </>
              ) : (
                homeConfig.label
              )}
            </h2>
          </div>
        </article>
      </Link>
    );
  }

  const defaultHref =
    collection.handle === "nail-solutions"
      ? "/product/lay-n-go-nailspa-18"
      : collection.handle === "technology"
        ? "/product/lay-n-go-traveler-20"
        : collection.handle === "pet-solutions"
          ? "/product/lay-n-go-travel-dog-bed-44"
          : `/collections/${collection.handle}`;

  return (
    <Link to={defaultHref} className="group block">
      <div className="overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {img ? (
            <img
              src={img.url}
              alt={img.altText || collection.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
              {collection.title}
            </div>
          )}
        </div>
        <div className="p-4 space-y-1">
          <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {collection.title}
          </h2>
          {collection.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(collection.description)}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
