import { Link } from "react-router-dom";
import type { ShopifyCollectionSummary } from "@/lib/shopify";

interface CollectionCardProps {
  collection: ShopifyCollectionSummary;
  variant?: "default" | "home";
}

const OUTDOOR_VIDEO_SRC =
  "https://player.vimeo.com/video/1188182193?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1";

export const CollectionCard = ({ collection, variant = "default" }: CollectionCardProps) => {
  const img = collection.image;
  const isOutdoorTacticalHomeCard = variant === "home" && collection.handle === "military-first-responder";

  if (isOutdoorTacticalHomeCard) {
    return (
      <Link to={`/collections/${collection.handle}`} className="block w-[94%] mx-auto">
        <article className="bg-background">
          <div className="relative aspect-square overflow-hidden bg-background">
            <div className="absolute left-1/2 top-1/2 h-full aspect-video -translate-x-1/2 -translate-y-1/2">
              <iframe
                src={OUTDOOR_VIDEO_SRC}
                title="Outdoor and Tactical category video"
                frameBorder={0}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                className="pointer-events-none absolute inset-0 h-full w-full"
                tabIndex={-1}
                aria-hidden
              />
            </div>
          </div>
          <div className="pt-3 pb-1 text-center">
            <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-foreground">
              Outdoor / Tactical
            </h2>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/collections/${collection.handle}`} className="group block">
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
          {collection.description ? <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(collection.description)}</p> : null}
        </div>
      </div>
    </Link>
  );
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
