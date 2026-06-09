import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageSeo } from "@/components/PageSeo";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <PageSeo
        title="Page Not Found"
        description="The page you requested could not be found on Lay-n-Go. Browse collections or return to the homepage."
        pathname={location.pathname}
        noindex
        includeSiteGraph={false}
      />
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center bg-muted px-4">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <nav aria-label="Helpful links" className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Link to="/" className="text-primary underline hover:text-primary/90">
              Return to Home
            </Link>
            <Link to="/collections" className="text-primary underline hover:text-primary/90">
              Browse Collections
            </Link>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
