/** Hero images for consolidated press topic boxes. */
export const PRESS_CATEGORY_IMAGES: Record<
  string,
  { src: string; alt: string; /** CSS object-position for card crop, e.g. `50% 35%` */ objectPosition?: string }
> = {
  "🌍 Travel & Lifestyle": {
    src: "/press/category-travel-lifestyle.png",
    alt: "Person walking outdoors at golden hour with Lay-n-Go gear",
  },
  "🛍 Gifts & Product Roundups": {
    src: "/press/category-gifts-roundups.png",
    alt: "TODAY show segment featuring Lay-n-Go products on Bobbie's Buzz",
  },
  "🏆 Business & Entrepreneurship": {
    src: "/press/category-business-entrepreneurship.png?v=2",
    alt: "Speaker at U.S. Committee on Small Business with the Capitol in the background",
    objectPosition: "50% 30%",
  },
};
