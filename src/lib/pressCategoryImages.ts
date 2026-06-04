/** Hero images for press topic cards and category pages. */
export type PressCategoryImage = {
  /** Square/card thumbnail on the main press page. */
  src: string;
  /** Wide hero banner on category detail pages. */
  heroSrc: string;
  heroSrcSet?: string;
  alt: string;
  /** CSS object-position for card crop. */
  objectPosition?: string;
  /** CSS object-position for page hero (defaults to center). */
  heroObjectPosition?: string;
  /** Page hero zoom (below 1 shows more of the frame). */
  heroScale?: number;
};

const hero = (base: string, version = 3) => {
  const one = `${base}.png?v=${version}`;
  const two = `${base}@2x.png?v=${version}`;
  return { heroSrc: one, heroSrcSet: `${one} 1536w, ${two} 3072w` };
};

export const PRESS_CATEGORY_IMAGES: Record<string, PressCategoryImage> = {
  "🌍 Travel & Lifestyle": {
    src: "/press/category-travel-lifestyle.png?v=2",
    heroSrc: "/press/category-hero-travel-lifestyle.png?v=6",
    heroSrcSet:
      "/press/category-hero-travel-lifestyle.png?v=6 2048w, /press/category-hero-travel-lifestyle@2x.png?v=6 4096w",
    alt: "Person walking outdoors at golden hour with Lay-n-Go gear",
    heroObjectPosition: "50% 42%",
  },
  "🛍 Gifts & Product Roundups": {
    src: "/press/category-gifts-roundups.png?v=2",
    heroSrc: "/press/category-hero-gifts-roundups.png?v=6",
    heroSrcSet:
      "/press/category-hero-gifts-roundups.png?v=6 2048w, /press/category-hero-gifts-roundups@2x.png?v=6 4096w",
    alt: "TODAY show Bobbie's Buzz segment featuring Lay-n-Go girlfriend gifts",
    heroObjectPosition: "50% 42%",
  },
  "🏆 Business & Entrepreneurship": {
    src: "/press/category-business-entrepreneurship.png?v=2",
    ...hero("/press/category-hero-business-entrepreneurship", 4),
    alt: "U.S. Committee on Small Business press event at the Capitol",
    objectPosition: "50% 30%",
    heroObjectPosition: "50% 0%",
  },
};
