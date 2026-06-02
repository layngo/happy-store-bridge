export type PressFeaturedItem = {
  publication: string;
  headline: string;
  href: string;
  linkLabel: string;
  dateLabel: string;
  productName: string;
  quote?: string;
  imageSrc: string;
  /** Optional responsive sources, e.g. `"/press/foo.png 1024w, /press/foo@2x.png 2048w"`. */
  imageSrcSet?: string;
  imageAlt: string;
  /** Tailwind aspect-ratio fraction, e.g. `1024/403`. */
  imageAspect?: `${number}/${number}`;
};

export const PRESS_FEATURED_ITEMS: readonly PressFeaturedItem[] = [
  {
    publication: "Condé Nast Traveler",
    headline: "53 Best Travel Gifts for Every Globetrotter on Your List",
    href: "https://www.cntraveler.com/gallery/the-best-travel-gifts",
    linkLabel: "FULL ARTICLE",
    dateLabel: "October 29, 2024:",
    productName: "Lay-n-Go Drawstring Toiletry Bag",
    quote:
      "Travelers who are also regulars at Sephora or Ulta will appreciate this cool makeup bag: Instead of having to dump out all your products to find what you're looking for, the bag opens up by way of drawstrings, and can be laid out as a circle on any surface, allowing every product to be on display.",
    imageSrc: "/press/featured-cntraveler-travel-gifts@2x.png?v=5",
    imageSrcSet:
      "/press/featured-cntraveler-travel-gifts.png?v=5 1024w, /press/featured-cntraveler-travel-gifts@2x.png?v=5 2048w",
    imageAlt:
      "Condé Nast Traveler feature: Lay-n-Go drawstring toiletry bag with cosmetics laid flat on a grey background",
    imageAspect: "1024/403",
  },
  {
    publication: "The Female Founder Show",
    headline: "w/ Bridget Fitzpatrick",
    href: "https://www.asbn.com/small-business-shows/female-founder-bridget-fitzpatrick/amy-fazackerley-reveals-how-she-conquers-business-challenges-while-nurturing-family-life/",
    linkLabel: "FULL ARTICLE",
    dateLabel: "May 3, 2024:",
    productName:
      "Amy Fazackerley Reveals How She Conquers Business Challenges While Nurturing Family Life",
    imageSrc: "/press/featured-female-founder-show@2x.png?v=5",
    imageSrcSet:
      "/press/featured-female-founder-show.png?v=5 2048w, /press/featured-female-founder-show@2x.png?v=5 4096w",
    imageAlt:
      "The Female Founder Show with Bridget Fitzpatrick and guest Amy Fazackerley of Lay-n-Go on ASBN",
    imageAspect: "2048/768",
  },
];
