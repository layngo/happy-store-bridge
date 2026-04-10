import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import CollectionsIndex from "./pages/CollectionsIndex.tsx";
import Collection from "./pages/Collection.tsx";
import ProductUrlRedirect from "./pages/ProductUrlRedirect.tsx";
import Search from "./pages/Search.tsx";
import PolicyBridge from "./pages/PolicyBridge.tsx";
import AboutUs from "./pages/static/AboutUs.tsx";
import BusinessLicense from "./pages/static/BusinessLicense.tsx";
import Contact from "./pages/static/Contact.tsx";
import LayNGoPatents from "./pages/static/LayNGoPatents.tsx";
import Press from "./pages/static/Press.tsx";
import PressSubpage from "./pages/static/PressSubpage.tsx";
import ReturnPolicy from "./pages/static/ReturnPolicy.tsx";
import SmallBusinesses from "./pages/static/SmallBusinesses.tsx";
import Wholesale from "./pages/static/Wholesale.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />

        <Route path="/collections/:collectionHandle/products/:productHandle" element={<ProductDetail />} />
        <Route path="/collections/:handle/:filterSlug" element={<Collection />} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/collections" element={<CollectionsIndex />} />

        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/products/:handle" element={<ProductUrlRedirect />} />

        <Route path="/pages/about-us" element={<AboutUs />} />
        <Route path="/pages/business-license-certification" element={<BusinessLicense />} />
        <Route path="/pages/contact" element={<Contact />} />
        <Route path="/pages/lay-n-go-patents" element={<LayNGoPatents />} />
        <Route path="/pages/press" element={<Press />} />
        <Route path="/pages/press-subpage" element={<PressSubpage />} />
        <Route path="/pages/return-policy" element={<ReturnPolicy />} />
        <Route path="/pages/small-businesses" element={<SmallBusinesses />} />
        <Route path="/pages/wholesale" element={<Wholesale />} />

        <Route path="/policies/:slug" element={<PolicyBridge />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
