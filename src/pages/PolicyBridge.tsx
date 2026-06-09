import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

/** Sends visitors to the canonical Shopify-hosted policy URL (keeps legal copy in one place). */
const PolicyBridge = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;
    const url = `https://www.layngo.com/policies/${encodeURIComponent(slug)}`;
    window.location.replace(url);
  }, [slug]);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <LoadingSpinner label="Opening official policy page" className="py-0" />
        <p className="text-muted-foreground text-sm text-center" role="status" aria-live="polite">
          Opening the official policy on Lay-n-Go…
        </p>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PolicyBridge;
