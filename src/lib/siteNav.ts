export const SHOP_ACCOUNT_URL = "https://www.layngo.com/account/login";

export const shopCollectionLinks = [
  { to: "/collections/cosmetic-bags", label: "Cosmetic Bags" },
  { to: "/collections/nail-solutions", label: "Nail Solutions" },
  { to: "/collections/play", label: "Play" },
  { to: "/collections/technology", label: "Tech & Travel" },
  { to: "/collections/pet-solutions", label: "Pet Solutions" },
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
  { to: "/pages/wholesale", label: "Wholesale" },
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
  { label: "TRAVELER", hint: "Tech on the go", to: "/collections/technology" },
  { label: "PET", hint: "Pet travel & beds", to: "/collections/pet-solutions" },
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

export const pressFeatures = [
  {
    title: "Women Who Own It",
    description:
      "Trailblazers, innovators, entrepreneurs — get inspired by female founders leading women-owned businesses.",
    href: "https://www.wwbc.com/",
    source: "Women's Business Center",
  },
  {
    title: "Business Lessons from the Founder of Lay-n-Go",
    description:
      "Adam Fazackerley, founder and COO, on launching the business and lessons learned along the way.",
    href: "https://www.inc.com/",
    source: "Inc.",
  },
  {
    title: "GMA Deals and Steals — Women-owned businesses",
    description: "Whether at home or away, Lay-n-Go makes it easy to view and access all of your cosmetics.",
    href: "https://www.goodmorningamerica.com/",
    source: "Good Morning America",
  },
] as const;
