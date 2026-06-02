export type PressFeaturedItem = {
  publication: string;
  headline: string;
  href: string;
  linkLabel: string;
  dateLabel: string;
  productName: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
};

export const PRESS_FEATURED_ITEMS: readonly PressFeaturedItem[] = [
  {
    publication: "Condé Nast Traveler",
    headline: "53 Best Travel Gifts for Every Globetrotter on Your List",
    href: "https://www.cntraveler.com/gallery/the-best-travel-gifts",
    linkLabel: "Full Article & List",
    dateLabel: "October 29, 2024:",
    productName: "Lay-n-Go Drawstring Toiletry Bag",
    quote:
      "Travelers who are also regulars at Sephora or Ulta will appreciate this cool makeup bag: Instead of having to dump out all your products to find what you're looking for, the bag opens up by way of drawstrings, and can be laid out as a circle on any surface, allowing every product to be on display.",
    imageSrc: "/press/featured-cntraveler-travel-gifts.png?v=2",
    imageAlt:
      "Condé Nast Traveler feature: Lay-n-Go drawstring toiletry bag with cosmetics laid flat on a grey background",
  },
];
