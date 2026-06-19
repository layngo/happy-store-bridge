import { SITE_NAME, truncateText } from "@/lib/siteSeo";

export type StaticPageSeoEntry = {
  description: string;
  keywords?: string;
};

/** Default SEO copy for static routes (matched by pathname prefix or exact). */
export const STATIC_PAGE_SEO: Record<string, StaticPageSeoEntry> = {
  "/pages/about-us": {
    description:
      "The Lay-n-Go story: Amy and Adam Fazackerley built patented open-flat, cinch-closed bags for cosmetics, travel, play, pets, and more. Read our full founder journey.",
    keywords: "Lay-n-Go story, Amy Fazackerley, Adam Fazackerley, women-owned business, about us",
  },
  "/pages/contact": {
    description:
      "Contact Lay-n-Go for orders, product questions, or wholesale inquiries. Email info@layngo.com or fax 703.995.4916. 16+ years in business, 200+ wholesale partners.",
    keywords: "contact Lay-n-Go, customer support, wholesale inquiry",
  },
  "/pages/press": {
    description:
      "Lay-n-Go press coverage from BuzzFeed, Parents, People, Today Show, Condé Nast Traveler, Oprah Daily, Good Morning America, and more media features.",
    keywords: "Lay-n-Go press, media coverage, featured in",
  },
  "/pages/press-subpage": {
    description: "Archive of Lay-n-Go press mentions, reviews, and media features across beauty, travel, parenting, and lifestyle publications.",
  },
  "/pages/return-policy": {
    description:
      "Lay-n-Go return policy: 14-day returns on unused items with original packaging. Email info@layngo.com for a Return Authorization number before sending items back.",
    keywords: "Lay-n-Go returns, refund policy, return authorization",
  },
  "/policies/shipping-policy": {
    description:
      "Lay-n-Go shipping policy: Economy (5–8 days), Standard (3–4 days), Express (1–2 days) after order ships. Same-day processing before 1:00 p.m. cutoff when available.",
    keywords: "Lay-n-Go shipping, delivery times, order tracking",
  },
  "/policies/terms-of-service": {
    description:
      "Lay-n-Go terms of service and privacy policy: how we handle orders, personal data, cookies, SMS consent, and your rights as a customer.",
    keywords: "Lay-n-Go terms, privacy policy",
  },
  "/policies/privacy-policy": {
    description:
      "Lay-n-Go privacy policy: how we collect, use, and protect personal information when you shop at layngo.com.",
  },
  "/policies/sms-policy": {
    description:
      "Lay-n-Go SMS policy: transactional and marketing texts, opt out with STOP, opt back in with START. Message and data rates may apply.",
    keywords: "Lay-n-Go SMS, text messages, STOP opt out",
  },
  "/policies/refund-policy": {
    description: "Lay-n-Go refund and return policy for unused products within 14 days of delivery.",
  },
  "/pages/lay-n-go-patents": {
    description:
      "Lay-n-Go utility patents: U.S. 9,084,459; 10,016,036; 10,561,213; and 11,116,298 protect our patented drawstring organizer design.",
    keywords: "Lay-n-Go patents, patented drawstring bag",
  },
  "/pages/business-license-certification": {
    description: "Lay-n-Go business license and certification information for retail and wholesale partners.",
  },
  "/pages/small-businesses": {
    description:
      "Lay-n-Go supports small businesses and future leaders through mentoring, community programs, and women-owned business initiatives.",
  },
  "/pages/wholesale": {
    description:
      "Become a Lay-n-Go wholesale partner. 16+ years in business, 200+ retail partners, 100k+ customers. Submit a wholesale inquiry on our contact page.",
    keywords: "Lay-n-Go wholesale, retail partner, distributor",
  },
  "/shop/cosmetic-bags": {
    description:
      "Shop Lay-n-Go Cosmo cosmetic bags: patented open-flat makeup organizers that cinch closed for travel. Compare Cosmo 20\" and Deluxe 22\" sizes and colors.",
    keywords: "Cosmo cosmetic bag, makeup organizer, Lay-n-Go Cosmo",
  },
  "/collections/military-first-responder": {
    description:
      "Lay-n-Go Outdoor and Tactical gear: patented drawstring organizers for duty, field, and outdoor use.",
    keywords: "tactical bag, military gear, first responder, Lay-n-Go Defender, outdoor tactical",
  },
};

export function getStaticPageSeo(pathname: string): StaticPageSeoEntry {
  const exact = STATIC_PAGE_SEO[pathname];
  if (exact) return exact;

  if (pathname.startsWith("/pages/press/category/")) {
    return {
      description: truncateText(
        `Lay-n-Go press coverage and media mentions in the ${pathname.split("/").pop()?.replace(/-/g, " ")} category.`,
        160,
      ),
    };
  }

  if (pathname.startsWith("/pages/press/")) {
    return {
      description: "Browse Lay-n-Go press mentions and media coverage by year: reviews, features, and editorial highlights.",
    };
  }

  return {
    description: `${SITE_NAME}: patented drawstring organizers for cosmetics, travel, play, pets, and tactical use. Open flat, cinch closed, go.`,
  };
}
