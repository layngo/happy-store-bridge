export const SHOP_ACCOUNT_URL = "https://www.layngo.com/account/login";

export const shopCollectionLinks = [
  { to: "/collections/cosmetic-bags", label: "Cosmetic Bags" },
  { to: "/shop/cosmetic-bags-v2", label: "Cosmetic Bags V2" },
  { to: "/product/lay-n-go-nailspa-18", label: "Nail Solutions" },
  { to: "/collections/play", label: "Play" },
  { to: "/product/lay-n-go-traveler-20", label: "Tech & Travel" },
  { to: "/product/lay-n-go-travel-dog-bed-44", label: "Pet Solutions" },
  { to: "/collections/military-first-responder", label: "Outdoor / Tactical" },
] as const;

export const footerCatalogLinks = shopCollectionLinks;

export const footerInfoLinks = [
  { to: "/pages/business-license-certification", label: "Business License" },
  { to: "/policies/terms-of-service", label: "Terms & conditions" },
  { to: "/policies/shipping-policy", label: "Shipping information" },
  { to: "/policies/privacy-policy", label: "Privacy policy" },
  { to: "/pages/return-policy", label: "Returns & refund policy" },
  { to: "/pages/lay-n-go-patents", label: "Lay-n-Go Patents" },
  { to: "/pages/contact", label: "Contact" },
  { to: "/pages/about-us", label: "About Us" },
] as const;

export const socialLinks = [
  { href: "https://www.facebook.com/layngo", label: "Facebook", icon: "facebook" as const },
  { href: "https://www.instagram.com/layngo", label: "Instagram", icon: "instagram" as const },
  { href: "https://www.pinterest.com/layngo", label: "Pinterest", icon: "pinterest" as const },
];

/** Homepage category tiles (COSMO, PLAY, etc.) — link to filtered collection views when applicable */
export const heroCategories = [
  { label: "COSMO", hint: "Cosmetics & beauty", to: "/collections/cosmetic-bags" },
  { label: "PLAY", hint: "Toy cleanup & play mats", to: "/collections/play" },
  { label: "TRAVELER", hint: "Tech on the go", to: "/product/lay-n-go-traveler-20" },
  { label: "PET", hint: "Pet travel & beds", to: "/product/lay-n-go-travel-dog-bed-44" },
] as const;

export const testimonials = [
  {
    quote:
      "Perfect travel makeup bag for true road warriors! All of my travel makeup fits well in here and there is space for more if I need it!",
    name: "Jessica",
  },
  {
    quote:
      "Works great! Having a nice area to lay my cosmetics out was the reason behind my purchase. Having it duo as a make up bag is an added bonus.",
    name: "Linda",
  },
  {
    quote:
      "OMG I love this. I have searched for makeup bag after makeup bag… this bag KNOCKS THEM ALL OUT OF THE PARK!",
    name: "Katie",
  },
  {
    quote:
      "This is the most amazing invention for cosmetics! I hate rummaging around in a regular makeup bag.",
    name: "Raquel",
  },
  {
    quote:
      "Amazing! I have been looking for a way to keep all my cosmetics together and now I finally found the perfect bag!",
    name: "Amanda",
  },
  {
    quote:
      "Cannot rave about this bag enough — LOVE IT!! If you wear makeup, you need this bag.",
    name: "Rachel",
  },
] as const;
