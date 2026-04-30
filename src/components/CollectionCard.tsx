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
      <Link to={`/collections/${collection.handle}`} className="group block w-[94%] mx-auto cursor-pointer">
        <article className="bg-background transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-background ring-1 ring-transparent transition-shadow duration-300 group-hover:shadow-md group-hover:ring-border">
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
            <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80 shadow-sm">
              Tap to open
            </div>
          </div>
          <div className="pt-3 pb-1 text-center transition-colors duration-200 group-hover:text-primary">
            <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-foreground group-hover:text-primary">
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
