import { Link } from "react-router-dom";
import type { ShopifyCollectionSummary } from "@/lib/shopify";
import { VimeoLoopFadeEmbed } from "@/components/VimeoLoopFadeEmbed";

interface CollectionCardProps {
  collection: ShopifyCollectionSummary;
  variant?: "default" | "home";
}

const HOME_VIDEO_CARDS: Record<string, { videoId: string; hoverSrc: string; label: string }> = {
  "cosmetic-bags": {
    videoId: "1188306142",
    hoverSrc: "https://www.layngo.com/cdn/shop/products/B00B04V3PQ.PT01_1200x1200.jpg?v=1670376558",
    label: "Cosmetic Bags",
  },
  "nail-solutions": {
    videoId: "1188306129",
    hoverSrc: "https://www.layngo.com/cdn/shop/products/B082LQ788D.PT01_1200x1200.jpg?v=1626120523",
    label: "Nail Solutions",
  },
  "military-first-responder": {
    videoId: "1188297111",
    hoverSrc: "https://www.layngo.com/cdn/shop/products/B08SKHPY36.PT02_1200x1200.jpg?v=1626119977",
    label: "Outdoor / Tactical",
  },
  "pet-solutions": {
    videoId: "1188297775",
    hoverSrc: "https://www.layngo.com/cdn/shop/products/B08MV2JM98.PT01_1200x1200.jpg?v=1626120624",
    label: "Pet Solutions",
  },
};

export const CollectionCard = ({ collection, variant = "default" }: CollectionCardProps) => {
  const img = collection.image;
  const homeVideo = variant === "home" ? HOME_VIDEO_CARDS[collection.handle] : undefined;

  if (homeVideo) {
    return (
      <Link to={`/collections/${collection.handle}`} className="group block w-[94%] mx-auto">
        <article className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute left-1/2 top-1/2 h-full aspect-video -translate-x-1/2 -translate-y-1/2">
            <VimeoLoopFadeEmbed
              videoId={homeVideo.videoId}
              title={`${homeVideo.label} category video`}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
          <img
            src={homeVideo.hoverSrc}
            alt={homeVideo.label}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out lg:group-hover:opacity-100 lg:group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <h2 className="font-heading text-xl font-bold uppercase tracking-[0.08em] text-white">{homeVideo.label}</h2>
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
