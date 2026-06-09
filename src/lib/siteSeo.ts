/** Canonical production origin; override with VITE_SITE_URL at build time. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://www.layngo.com"
).replace(/\/$/, "");

export const SITE_NAME = "Lay-n-Go";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SITE_TAGLINE = "Organizational Solutions for Life, Play, and Travel";

export const DEFAULT_KEYWORDS =
  "Lay-n-Go, drawstring bag, cosmetic bag, makeup bag, activity mat, toy cleanup, travel organizer, Cosmo, Traveler, patented organizer";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function pageTitle(title: string): string {
  if (/lay-n-go/i.test(title)) return title;
  return `${title} — ${SITE_NAME}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    description:
      "Patented drawstring organizational bags and mats that open flat for visibility and cinch closed for travel, play, cosmetics, pets, and tactical use.",
    foundingDate: "2009",
    email: "info@layngo.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Alexandria",
      addressRegion: "VA",
      addressCountry: "US",
    },
    areaServed: { "@type": "Country", name: "United States" },
    knowsAbout: [
      "cosmetic bags",
      "makeup organizers",
      "drawstring bags",
      "travel organizers",
      "toy cleanup mats",
      "pet travel gear",
      "tactical gear bags",
    ],
    sameAs: [
      "https://www.facebook.com/layngo",
      "https://www.instagram.com/layngo",
      "https://www.pinterest.com/layngo",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@layngo.com",
      availableLanguage: "English",
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: `${SITE_TAGLINE}. Shop patented Cosmo cosmetic bags, Play mats, Traveler tech bags, and more.`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function itemListJsonLd(name: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
  };
}

export function siteNavigationJsonLd(
  links: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Site navigation",
    itemListElement: links.map((link, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: link.name,
      url: link.url.startsWith("http") ? link.url : absoluteUrl(link.url),
    })),
  };
}

export function webPageJsonLd(title: string, description: string, pathname: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: truncateText(description, 300),
    url: absoluteUrl(pathname),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export function productJsonLd(options: {
  name: string;
  description: string;
  handle: string;
  images: string[];
  price: string;
  currency: string;
  inStock: boolean;
  sku?: string;
  tags?: string[];
}) {
  const category = options.tags?.find((t) => t.length > 2) ?? "Organizational bags";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options.name,
    description: truncateText(options.description, 500),
    image: options.images,
    sku: options.sku ?? options.handle,
    mpn: options.handle,
    category,
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    url: absoluteUrl(`/product/${options.handle}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${options.handle}`),
      price: options.price,
      priceCurrency: options.currency,
      availability: options.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

export const HOME_FAQS = [
  {
    question: "What are Lay-n-Go best sellers?",
    answer:
      'The Lay-n-Go Cosmo 20" cosmetic bag is the top seller — a patented makeup bag that opens flat and cinches closed. The Cosmo Deluxe 22" and Traveler 20" tech bag are also popular.',
  },
  {
    question: "What is Lay-n-Go's return policy?",
    answer:
      "Returns are accepted within 14 days of delivery. Items must be unused with original packaging. Email info@layngo.com with your order number for a Return Authorization before shipping items back.",
  },
  {
    question: "Where does Lay-n-Go ship?",
    answer:
      "Lay-n-Go ships throughout the United States and to other regions available at checkout. Economy shipping is 5–8 business days, Standard 3–4 days, and Express 1–2 days after the order ships.",
  },
  {
    question: "How does Lay-n-Go work?",
    answer:
      "Lay-n-Go is a patented drawstring mat that opens flat so you can see and use everything, then cinches closed into a bag for storage and travel — one pull of the cord packs it up.",
  },
] as const;
