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
    src: "/press/category-travel-lifestyle.png",
    ...hero("/press/category-hero-travel-lifestyle", 5),
    alt: "Person walking outdoors at golden hour with Lay-n-Go gear",
    heroObjectPosition: "50% 42%",
    heroScale: 0.94,
  },
  "🛍 Gifts & Product Roundups": {
    src: "/press/category-gifts-roundups.png",
    ...hero("/press/category-hero-gifts-roundups"),
    alt: "TODAY show segment featuring Lay-n-Go products on Bobbie's Buzz",
    heroObjectPosition: "50% 44%",
    heroScale: 0.88,
  },
  "🏆 Business & Entrepreneurship": {
    src: "/press/category-business-entrepreneurship.png?v=2",
    ...hero("/press/category-hero-business-entrepreneurship", 4),
    alt: "U.S. Committee on Small Business press event at the Capitol",
    objectPosition: "50% 30%",
    heroObjectPosition: "50% 0%",
  },
};
