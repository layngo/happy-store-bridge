import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const StaticPageLayout = ({ title, children }: StaticPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
        <div className="prose prose-neutral max-w-none prose-p:text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
