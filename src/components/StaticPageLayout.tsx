import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
  /** Main content max width (default: narrow prose column). */
  contentClassName?: string;
}

export const StaticPageLayout = ({ title, children, contentClassName }: StaticPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main
        id="main-content"
        className={cn("flex-1 container py-10", contentClassName ?? "max-w-3xl")}
      >
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
        <div className="prose prose-neutral max-w-none prose-p:text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
