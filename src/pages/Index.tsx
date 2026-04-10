import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-sky-100">
      <Header variant="light" />
      
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-200/80">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase animate-fade-in">Innovative Organizational Solutions</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              For Life, Play<br />& Travel
            </h1>
            <p className="text-slate-600 text-lg max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Lay-n-Go is a patented activity mat, cleanup, storage and carryall solution in one. Perfect for home but durable enough for wherever your travels take you.
            </p>
            <Link to="/collections" className="inline-block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <button type="button" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-300/25 to-transparent pointer-events-none" />
      </section>

      {/* Products */}
      <section id="products" className="container py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">Our Products</h2>
            <p className="text-slate-600 mt-2">Browse our collection of organizational solutions</p>
          </div>
          <Link to="/collections" className="text-primary text-sm font-semibold hover:underline shrink-0">
            Shop by collection →
          </Link>
        </div>
        <ProductGrid />
      </section>

      {/* About */}
      <section id="about" className="border-t border-sky-200/80">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="font-heading text-3xl font-bold text-slate-900">About Lay-n-Go</h2>
            <p className="text-slate-600 leading-relaxed">
              Our products are designed to simplify your life. Whether you're organizing cosmetics, corralling toys, managing tech gear, or keeping pet supplies tidy — Lay-n-Go has a solution for you. Women-owned and Goldman Sachs 10,000 Small Businesses alumni.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-200/80 bg-sky-200/40">
        <div className="container py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-heading text-sm font-bold tracking-wider text-slate-900">LAY / N / GO</span>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Lay-n-Go. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
