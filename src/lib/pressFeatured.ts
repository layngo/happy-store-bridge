export type PressFeaturedLayout = "banner" | "card";

export type PressFeaturedItem = {
  layout?: PressFeaturedLayout;
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
  /** Tailwind aspect-ratio fraction, e.g. `1024/403` (banner layout only). */
  imageAspect?: `${number}/${number}`;
  /** Logo aspect for card layout, e.g. `600/300`. Defaults to square. */
  cardImageAspect?: `${number}/${number}`;
  /** Optional faint background texture for card layout. */
  cardBackgroundSrc?: string;
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
    imageSrc: "/press/featured-cntraveler-travel-gifts@2x.png?v=7",
    imageSrcSet:
      "/press/featured-cntraveler-travel-gifts.png?v=7 2048w, /press/featured-cntraveler-travel-gifts@2x.png?v=7 4096w",
    imageAlt:
      "Condé Nast Traveler feature: Lay-n-Go drawstring toiletry bag with cosmetics laid flat on a white background",
    imageAspect: "2048/768",
  },
  {
    publication: "The Female Founder Show",
    headline: "w/ Bridget Fitzpatrick",
    href: "https://www.asbn.com/small-business-shows/female-founder-bridget-fitzpatrick/amy-fazackerley-reveals-how-she-conquers-business-challenges-while-nurturing-family-life/",
    linkLabel: "FULL ARTICLE",
    dateLabel: "May 3, 2024:",
    productName:
      "Amy Fazackerley Reveals How She Conquers Business Challenges While Nurturing Family Life",
    imageSrc: "/press/featured-female-founder-show@2x.png?v=7",
    imageSrcSet:
      "/press/featured-female-founder-show.png?v=7 2048w, /press/featured-female-founder-show@2x.png?v=7 4096w",
    imageAlt:
      "The Female Founder Show with Bridget Fitzpatrick and guest Amy Fazackerley of Lay-n-Go on ASBN",
    imageAspect: "2048/768",
  },
  {
    layout: "card",
    publication: "",
    headline: "Lay-n-Go Named to the Inc. 5000!",
    href: "https://www.inc.com/inc5000",
    linkLabel: "FULL ARTICLE",
    dateLabel: "August 16, 2022:",
    productName:
      "The Most Successful Companies in America--and What They Reveal About the Future of Business",
    imageSrc: "/press/featured-inc-5000.png?v=1",
    imageAlt: "Inc. 5000 — America's fastest-growing private companies",
    cardBackgroundSrc: "/press/featured-inc-5000-bg.png?v=1",
  },
  {
    layout: "card",
    publication: "Oprah Daily",
    headline: "The 18 Best Toiletry Bags That'll Help You Stay Organized in Style",
    href: "https://www.oprahdaily.com/style/g40902767/best-toiletry-bags/",
    linkLabel: "FULL ARTICLE",
    dateLabel: "August 19, 2022:",
    productName: "",
    imageSrc: "/press/featured-oprah-daily.png?v=1",
    imageAlt: "Oprah Daily logo",
    cardImageAspect: "600/300",
    cardBackgroundSrc: "/press/featured-oprah-daily-bg.png?v=1",
  },
  {
    layout: "card",
    publication: "Condé Nast Traveler",
    headline: "17 Picks From Condé Nast Traveler Editors",
    href: "https://www.cntraveler.com/story/editors-picks-amazon-prime-day-deals-2022-1",
    linkLabel: "FULL ARTICLE",
    dateLabel: "July 13, 2022:",
    productName: "",
    imageSrc: "/press/featured-cntraveler-editors-picks.png?v=1",
    imageAlt: "Condé Nast Traveler logo",
    cardImageAspect: "1024/439",
  },
  {
    layout: "card",
    publication: "TODAY",
    headline: "Bobbie Shares 3 Gifts to Give Your Girlfriend",
    href: "https://www.today.com/style/bobbies-buzz-3-great-gifts-girlfriends-2D11638370",
    linkLabel: "FULL ARTICLE",
    dateLabel: "November 22, 2013:",
    productName: "",
    imageSrc: "/press/featured-today-bobbies-buzz.png?v=1",
    imageAlt: "TODAY show Bobbie's Buzz segment featuring Lay-n-Go and girlfriend gift picks",
    cardImageAspect: "1/1",
  },
];
