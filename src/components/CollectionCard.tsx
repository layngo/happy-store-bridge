import { Link } from "react-router-dom";
import type { ShopifyCollectionSummary } from "@/lib/shopify";

interface CollectionCardProps {
  collection: ShopifyCollectionSummary;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const img = collection.image;
  return (
    <Link to={`/collections/${collection.handle}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
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
