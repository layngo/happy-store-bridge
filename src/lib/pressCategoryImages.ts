/** Hero images for press topic cards and category pages. */
export type PressCategoryImage = {
  /** Square/card thumbnail on the main press page. */
  src: string;
  /** Wide hero banner on category detail pages. */
  heroSrc: string;
  alt: string;
  /** CSS object-position for card crop. */
  objectPosition?: string;
  /** CSS object-position for page hero (defaults to center). */
  heroObjectPosition?: string;
};

export const PRESS_CATEGORY_IMAGES: Record<string, PressCategoryImage> = {
  "🌍 Travel & Lifestyle": {
    src: "/press/category-travel-lifestyle.png",
    heroSrc: "/press/category-hero-travel-lifestyle.png?v=1",
    alt: "Person walking outdoors at golden hour with Lay-n-Go gear",
    heroObjectPosition: "50% 50%",
  },
  "🛍 Gifts & Product Roundups": {
    src: "/press/category-gifts-roundups.png",
    heroSrc: "/press/category-hero-gifts-roundups.png?v=1",
    alt: "TODAY show segment featuring Lay-n-Go products on Bobbie's Buzz",
    heroObjectPosition: "50% 50%",
  },
  "🏆 Business & Entrepreneurship": {
    src: "/press/category-business-entrepreneurship.png?v=2",
    heroSrc: "/press/category-hero-business-entrepreneurship.png?v=1",
    alt: "U.S. Committee on Small Business press event at the Capitol",
    objectPosition: "50% 30%",
    heroObjectPosition: "50% 50%",
  },
};
