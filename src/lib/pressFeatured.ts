export type PressFeaturedLayout = "banner" | "card" | "pressArt";

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
  /** Two diagonal lines between art and copy (banner layout only). */
  bannerDiagonalDividers?: boolean;
  /** Extra Tailwind classes for banner art below `md` (object-position, scale, etc.). */
  bannerMobileImageClass?: string;
  /** Optional mobile-only banner (e.g. no desktop fade). */
  bannerMobileImageSrc?: string;
  bannerMobileImageSrcSet?: string;
  /** Logo aspect for card layout, e.g. `600/300`. Defaults to square. */
  cardImageAspect?: `${number}/${number}`;
  /** Optional faint background texture for card layout. */
  cardBackgroundSrc?: string;
  /** Slightly larger logo in the card header zone. */
  cardLogoSize?: "large";
  /** Soft drop shadow on the card logo (for dark-on-transparent wordmarks). */
  cardLogoDropShadow?: boolean;
  /** Extra Tailwind classes for the card logo below `md` (e.g. smaller on phones). */
  cardLogoMobileClassName?: string;
};

export const PRESS_FEATURED_ITEMS: readonly PressFeaturedItem[] = [
  {
    layout: "pressArt",
    publication: "PEOPLE",
    headline: "The layflat bag PEOPLE is eyeing for summer getaways",
    href: "https://people.com/travel-toiletry-bag-deals-amazon-july-2026-11990655",
    linkLabel: "VIEW FULL ARTICLE",
    dateLabel: "Published on Jul. 5, 2026",
    productName: "Surprisingly Spacious",
    quote: "Spread out your whole routine, then cinch it closed.",
    imageSrc: "/press/featured-people-travel-toiletry-banner.png?v=10",
    imageAlt:
      "PEOPLE Travel Deals feature: Lay-n-Go Cosmo layflat drawstring cosmetic organizer",
    imageAspect: "2048/768",
  },
  {
    layout: "pressArt",
    publication: "USA TODAY 10BEST",
    headline: "This Clever Makeup Organizer Has Become My Ultimate Travel Companion",
    href: "https://10best.usatoday.com/lifestyle/layflat-bag-deal-amazon-prime-day/",
    linkLabel: "VIEW FULL ARTICLE",
    dateLabel: "Published on Jun. 26, 2026",
    productName:
      "It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.",
    quote: "A total game changer.",
    imageSrc: "/press/featured-usatoday-10best-banner.png?v=2",
    imageAlt:
      "USA TODAY 10BEST feature: Lay-n-Go Cosmo makeup organizer as ultimate travel companion",
    imageAspect: "2048/768",
  },
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
    bannerDiagonalDividers: true,
    bannerMobileImageClass:
      "max-md:origin-left max-md:scale-[0.86] max-md:object-left max-md:translate-x-[5%]",
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
    bannerMobileImageClass:
      "max-md:origin-left max-md:scale-[0.86] max-md:object-left max-md:translate-x-[10%]",
  },
  {
    publication: "CO:  by U.S. Chamber of Commerce",
    headline: "'Product is King'",
    href: "https://www.uschamber.com/co/good-company/growth-studio/business-advice-lay-n-go",
    linkLabel: "FULL ARTICLE",
    dateLabel: "February 25, 2019:",
    productName:
      "Business Lessons from the Founder of Lay-n-Go. Adam Fazackerley describes how he launched his business and what he's learned along the way.",
    imageSrc: "/press/featured-co-product-is-king-banner@2x.png?v=2",
    imageSrcSet:
      "/press/featured-co-product-is-king-banner.png?v=2 2048w, /press/featured-co-product-is-king-banner@2x.png?v=2 4096w",
    imageAlt:
      "Adam Fazackerley of Lay-n-Go interviewed on CO:  by U.S. Chamber of Commerce with Gregg Greenberg",
    imageAspect: "2048/768",
    bannerMobileImageSrc: "/press/featured-co-product-is-king-banner-mobile.png?v=1",
    bannerMobileImageSrcSet:
      "/press/featured-co-product-is-king-banner-mobile.png?v=1 1536w, /press/featured-co-product-is-king-banner-mobile@2x.png?v=1 3072w",
    bannerMobileImageClass: "max-md:object-[22%_42%] max-md:scale-[0.92]",
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
    imageAlt: "Inc. 5000: America's fastest-growing private companies",
    cardBackgroundSrc: "/press/featured-inc-5000-bg.png?v=1",
    cardLogoSize: "large",
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
    cardLogoSize: "large",
  },
  {
    layout: "card",
    publication: "",
    headline: "17 Picks From Condé Nast Traveler Editors",
    href: "https://www.cntraveler.com/story/editors-picks-amazon-prime-day-deals-2022-1",
    linkLabel: "FULL ARTICLE",
    dateLabel: "July 13, 2022:",
    productName: "",
    imageSrc: "/press/featured-cntraveler-editors-picks.png?v=14",
    imageAlt: "Condé Nast Traveler logo",
    cardImageAspect: "887/350",
    cardLogoSize: "large",
    cardBackgroundSrc: "/press/featured-cntraveler-editors-picks-bg.png?v=2",
    cardLogoMobileClassName:
      "max-md:max-h-[min(6.65rem,29vw)] max-md:max-w-[min(100%,15.5rem)] sm:max-md:max-h-[7rem] sm:max-md:max-w-[16rem]",
  },
  {
    layout: "card",
    publication: "TODAY",
    headline: "Bobbie Shares 3 Gifts to Give Your Girlfriend",
    href: "https://www.today.com/style/bobbies-buzz-3-great-gifts-girlfriends-2D11638370",
    linkLabel: "FULL ARTICLE",
    dateLabel: "November 22, 2013:",
    productName: "",
    imageSrc: "/press/featured-today-logo.png?v=1",
    imageAlt: "TODAY show logo",
    cardImageAspect: "1000/750",
    cardBackgroundSrc: "/press/featured-today-bobbies-buzz.png?v=1",
  },
  {
    layout: "card",
    publication: "",
    headline: "",
    href: "https://buywomenowned.com/news/amy-fazackerley-of-lay-n-go/",
    linkLabel: "FULL ARTICLE",
    dateLabel: "March 11, 2020:",
    productName:
      "Trendsetters. Trailblazers. Innovators. Entrepreneurs. Get inspired by the incredible female founders leading today's Women Owned businesses.",
    imageSrc: "/press/featured-women-owned-logo.png?v=4",
    imageAlt: "Women Owned logo",
    cardImageAspect: "737/339",
    cardLogoSize: "large",
    cardBackgroundSrc: "/press/featured-women-owned-bg.png?v=1",
    cardLogoMobileClassName:
      "max-md:max-h-[min(6.65rem,29vw)] max-md:max-w-[min(100%,15.5rem)] sm:max-md:max-h-[7rem] sm:max-md:max-w-[16rem]",
  },
  {
    layout: "card",
    publication: "Good Morning America",
    headline: "GMA celebrating women-owned businesses",
    href: "https://www.goodmorningamerica.com/shop/story/gma-deals-steals-celebrating-women-owned-businesses-womens-61485650",
    linkLabel: "FULL ARTICLE",
    dateLabel: "March 7, 2019:",
    productName:
      'Tory Johnson has exclusive "Deals and Steals" on fabulous products from women-owned businesses to celebrate Women\'s History Month.',
    imageSrc: "/press/featured-gma-deals-steals-logo.png?v=11",
    imageAlt: "GMA Deals and Steals with Tory Johnson logo",
    cardImageAspect: "718/634",
    cardLogoSize: "large",
    cardLogoDropShadow: true,
    cardBackgroundSrc: "/press/featured-gma-women-owned-bg.png?v=1",
  },
];
