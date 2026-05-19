import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

/** Sends visitors to the canonical Shopify-hosted policy URL (keeps legal copy in one place). */
const PolicyBridge = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;
    const url = `https://www.layngo.com/policies/${encodeURIComponent(slug)}`;
    window.location.replace(url);
  }, [slug]);

  return (
    <main id="main-content" className="min-h-dvh bg-background flex flex-col items-center justify-center gap-4 p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm text-center">Opening the official policy on Lay-n-Go…</p>
    </main>
  );
};

export default PolicyBridge;
