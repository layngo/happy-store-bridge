/**
 * Curated Amazon customer-review excerpts for PDPs (by Shopify handle / product family).
 * Paste updates here—Amazon is not callable safely from the browser.
 */

export type ProductAmazonReview = {
  /** Amazon review title (the bold line under the star rating). */
  headline?: string;
  quote: string;
  /** Reviewer display name */
  author: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** e.g. Verified Purchase · 20\" · Black */
  variantNote?: string;
};

/** Cosmo 16\" / Mini — reviews that specify the 16\" bag */
export const COSMO_16_AMAZON_REVIEWS: ProductAmazonReview[] = [
  {
    headline: "Perfect for optimizing your travel",
    quote:
      "This has been one of my best travel purchases to date. I travel almost exclusively carry-on… Now everything goes in here—it’s laid flat, I can rummage through it without stuff getting lost. It’s safe from getting wet since this has the waterproof front. The pockets hold my powders and puffs… It is really deceptive how much it holds… I’ve literally lugged this thing everywhere now for 6+ months and it just wipes clean. I would buy this again a million times over.",
    author: "Katherine",
    rating: 5,
    variantNote: "Verified Purchase · 16\" · Crossmark",
  },
  {
    headline: "Make traveling less of a headache",
    quote:
      "Super cute and convenient way to travel with your essentials. Only dislike is it’s overpriced and there’s no good way of closing it.",
    author: "Cassidy",
    rating: 4,
    variantNote: "Verified Purchase · 16\" · Crossmark",
  },
  {
    headline: "Convenient and Spacious Makeup Organizer for Travel",
    quote:
      "Lay-flat design provides full visibility of contents… Holds makeup brushes, bottles, and small tools comfortably… Machine-washable material made cleaning effortless… A great choice for convenience and portability, despite minor drawbacks like its soft structure.",
    author: "Ghost2401",
    rating: 5,
    variantNote: "Verified Purchase · 16\" · Black",
  },
];

/** Cosmo 20\" — reviews that specify the 20\" bag or generic Cosmo praise on the 20\" listing */
export const COSMO_20_AMAZON_REVIEWS: ProductAmazonReview[] = [
  {
    headline: "I use it daily",
    quote: "Love my bag. Keeps my counter clear & so easy to grab & go out the door or throw in travel bag.",
    author: "Mrs. NF3",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Pink Chevron",
  },
  {
    headline: "Holds everything you need",
    quote:
      "What I love: super easy to use—spread it out, grab what you need, pull the drawstring. Great for travel; fits a lot and lays flat. Machine washable. Zipper pocket & elastic loops keep brushes neat. Trade-offs: when cinched it can feel bulky with less structure; fabric-only means less protection for fragile bottles; needs counter space when fully open. Great for convenience—not perfect for everyone.",
    author: "Shydell Simpson",
    rating: 4,
    variantNote: "Verified Purchase · 20\" · Black & Gold",
  },
  {
    headline: "Finally a makeup bag that works for me",
    quote:
      "I always had a hard time finding different items in my makeup bag… This is a total game changer. It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.",
    author: "Shalini",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Black",
  },
  {
    headline: "Nice cosmetic bag",
    quote: "Bought as bd present for relative who takes dance! Perfect for all of her make-up!",
    author: "Consumer 7",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Black",
  },
  {
    headline: "Nice Travel Pouch",
    quote:
      "I like this for travel because it can mold to whatever space it is in. Super easy to throw stuff into, then open & use. Seems fairly durable, the size is perfect as it is expandabe. I personally like that there are no compartments.",
    author: "Liz Palermo",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Pink",
  },
  {
    headline: "I Love This Bag!",
    quote:
      "I love this make up bag! I travel a lot for work and use this everyday. It's nice to not have to dig for items and that you can lie this out and see everything at once. I got the black boucle type fabric and it's actually so cute. I would definitely re-purchase.",
    author: "Kris",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Comfort (Black)",
  },
  {
    headline: "So Many Uses",
    quote:
      "I gave this as a gift & it was a great idea for a new traveling GIGI. Perfect for “Grab & Go” makeup or Jewelry packing.",
    author: "Lynda Y. Puyau",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Floral Large",
  },
  {
    headline: "A great purchase",
    quote:
      "I love this! I don't have to go digging for my cosmetics, I just open the bag and spread it out on the vanity… When I'm done I cinch it up and put it in the drawer. It's a little large for travel, I may only use it at home.",
    author: "Qbet",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Comfort (White Inside)",
  },
  {
    headline: "All my makeup products are visible",
    quote: "Absolutely love it",
    author: "Lisa Wheaton",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Black",
  },
  {
    headline: "Artículo ideal.",
    quote: "Súper práctico, cómodo.",
    author: "Amazon Customer",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Metallic Silver",
  },
  {
    headline: "Great for Makeup Storage",
    quote:
      "I leave this open on my counter with my makeup on it. I can quickly close it up and throw it under the counter when needed… The pocket inside is great and it has the different sized loops… I wish I’d bought this sooner!",
    author: "Luci",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Comfort (White Inside)",
  },
  {
    headline: "Travel accessory",
    quote:
      "Gift for my daughter. She said it’s exactly as described and is anxious to use it on her next trip.",
    author: "Happy to be alive",
    rating: 4,
    variantNote: "Verified Purchase · 20\" · Black",
  },
  {
    headline: "Great for travel.",
    quote:
      "This works great for traveling. I can find stuff easily when I open it up to get ready. Most of my cosmetics are in black containers so it is nice to have a bag in a contrasting light color.",
    author: "KRN2022",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Quilted Lavender",
  },
  {
    headline: "Love it",
    quote: "I bought this for my wife to use when we travel, but she uses it every day!!!",
    author: "Mel",
    rating: 5,
    variantNote: "Verified Purchase · 20\" · Grit Grace Gratitude",
  },
];

/** Cosmo 22\" Deluxe — reviews that specify the 22\" bag */
export const COSMO_22_AMAZON_REVIEWS: ProductAmazonReview[] = [
  {
    headline: "The Ultimate Travel Companion for Makeup Lovers",
    quote:
      "If you’re tired of messy makeup bags, this Lay-n-Go Cosmo is a game-changer—I got the purple 22-inch for travel and it’s been a lifesaver. Drawstring opens flat for easy access; plenty of room plus zipper pocket and brush loops… When I unpack, everything’s visible; when I’m done, it cinches in seconds… Practical, durable, and stylish—I couldn’t be happier.",
    author: "Onahunch",
    rating: 5,
    variantNote: "Verified Purchase · 22\" · Purple",
  },
  {
    headline: "Love the ease of using this.",
    quote:
      "It holds so much! So handy to open it on your counter and when you’re done, draw the string and there you go—it’s really helped keep my bathroom countertop clear.",
    author: "N. Kowalk",
    rating: 5,
    variantNote: "Verified Purchase · 22\" · Leopard",
  },
];

/** Optional “see more reviews” links — add canonical Amazon PDP URLs when ready. */
export const AMAZON_LISTING_URL_BY_HANDLE: Partial<Record<string, string>> = {
  // "lay-n-go-cosmo-20": "https://www.amazon.com/dp/XXXXXXXXXX",
  // "lay-n-go-cosmo-deluxe-22": "https://www.amazon.com/dp/YYYYYYYYYY",
};

const REVIEWS_BY_HANDLE: Partial<Record<string, ProductAmazonReview[]>> = {
  "lay-n-go-cosmo-20": COSMO_20_AMAZON_REVIEWS,
  "lay-n-go-cosmo-deluxe-22": COSMO_22_AMAZON_REVIEWS,
};

export function getAmazonReviewsForProduct(handle: string): {
  reviews: ProductAmazonReview[];
  amazonListingUrl?: string;
} {
  const normalized = handle.trim();
  const lower = normalized.toLowerCase();

  let reviews = REVIEWS_BY_HANDLE[normalized] ?? REVIEWS_BY_HANDLE[lower];

  if (!reviews && (lower.includes("cosmo-mini") || (lower.includes("cosmo") && lower.includes("mini")))) {
    reviews = COSMO_16_AMAZON_REVIEWS;
  }

  const amazonListingUrl =
    AMAZON_LISTING_URL_BY_HANDLE[normalized] ?? AMAZON_LISTING_URL_BY_HANDLE[lower];

  return {
    reviews: reviews ?? [],
    amazonListingUrl,
  };
}
