import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipToMain } from "@/components/SkipToMain";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { FirstVisitDiscountPopup } from "@/components/FirstVisitDiscountPopup";
import { SiteChatbot } from "@/components/SiteChatbot";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import CollectionsIndex from "./pages/CollectionsIndex.tsx";
import Collection from "./pages/Collection.tsx";
import ProductUrlRedirect from "./pages/ProductUrlRedirect.tsx";
import Search from "./pages/Search.tsx";
import PolicyBridge from "./pages/PolicyBridge.tsx";
import AboutUs from "./pages/static/AboutUs.tsx";
import AboutUsV2 from "./pages/static/AboutUsV2.tsx";
import AboutUsV3 from "./pages/static/AboutUsV3.tsx";
import BusinessLicense from "./pages/static/BusinessLicense.tsx";
import Contact from "./pages/static/Contact.tsx";
import LayNGoPatents from "./pages/static/LayNGoPatents.tsx";
import Press from "./pages/static/Press.tsx";
import PressSubpage from "./pages/static/PressSubpage.tsx";
import PressCategory from "./pages/static/PressCategory.tsx";
import PressYearRange from "./pages/static/PressYearRange.tsx";
import ReturnPolicy from "./pages/static/ReturnPolicy.tsx";
import TermsAndPrivacy from "./pages/static/TermsAndPrivacy.tsx";
import ShippingPolicy from "./pages/static/ShippingPolicy.tsx";
import SmsPolicy from "./pages/static/SmsPolicy.tsx";
import SmallBusinesses from "./pages/static/SmallBusinesses.tsx";
import Wholesale from "./pages/static/Wholesale.tsx";
import CosmoArrowPlayground from "./pages/CosmoArrowPlayground.tsx";
import CosmeticBagsV2 from "./pages/CosmeticBagsV2.tsx";
import MilitaryFirstResponder from "./pages/MilitaryFirstResponder.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SkipToMain />
      <FirstVisitDiscountPopup />
      <SiteChatbot />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />

        <Route path="/collections/:collectionHandle/products/:productHandle" element={<ProductDetail />} />
        <Route
          path="/collections/pet-solutions/:filterSlug"
          element={<Navigate to="/product/lay-n-go-travel-dog-bed-44" replace />}
        />
        <Route path="/collections/:handle/:filterSlug" element={<Collection />} />
        <Route
          path="/collections/nail-solutions"
          element={<Navigate to="/product/lay-n-go-nailspa-18" replace />}
        />
        <Route
          path="/collections/pet-solutions"
          element={<Navigate to="/product/lay-n-go-travel-dog-bed-44" replace />}
        />
        <Route path="/collections/military-first-responder" element={<MilitaryFirstResponder />} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/collections" element={<CollectionsIndex />} />

        <Route path="/shop/cosmetic-bags-v2" element={<CosmeticBagsV2 />} />

        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/products/:handle" element={<ProductUrlRedirect />} />

        <Route path="/dev/cosmo-arrows" element={<CosmoArrowPlayground />} />

        <Route path="/pages/about-us" element={<AboutUs />} />
        <Route path="/pages/about-usV2" element={<AboutUsV2 />} />
        <Route path="/pages/about-usV3" element={<AboutUsV3 />} />
        <Route path="/pages/business-license-certification" element={<BusinessLicense />} />
        <Route path="/pages/contact" element={<Contact />} />
        <Route path="/pages/lay-n-go-patents" element={<LayNGoPatents />} />
        <Route path="/pages/press" element={<Press />} />
        <Route path="/pages/press/category/:categorySlug" element={<PressCategory />} />
        <Route path="/pages/press/:rangeId" element={<PressYearRange />} />
        <Route path="/pages/press-subpage" element={<PressSubpage />} />
        <Route path="/pages/return-policy" element={<ReturnPolicy />} />
        <Route path="/pages/small-businesses" element={<SmallBusinesses />} />
        <Route path="/pages/wholesale" element={<Wholesale />} />

        <Route path="/policies/terms-of-service" element={<TermsAndPrivacy />} />
        <Route path="/policies/privacy-policy" element={<TermsAndPrivacy />} />
        <Route path="/policies/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/policies/sms-policy" element={<SmsPolicy />} />
        <Route path="/policies/refund-policy" element={<ReturnPolicy />} />
        <Route path="/policies/return-policy" element={<ReturnPolicy />} />
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
