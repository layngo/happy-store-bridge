import { buildPressArchiveLayout } from "@/lib/pressArchiveLayout";
import { PRESS_CATEGORY_IMAGES } from "@/lib/pressCategoryImages";
import type { PressCategory } from "@/data/pressArchive";

export type PressCategorySlug = "travel-lifestyle" | "gifts-roundups" | "business-entrepreneurship";

export type PressCategoryMeta = {
  slug: PressCategorySlug;
  /** Matches `PressCategory.title` in archive data. */
  archiveTitle: string;
  /** All-caps headline on the card (no emoji). */
  displayTitle: string;
};

export const PRESS_CATEGORY_META: readonly PressCategoryMeta[] = [
  {
    slug: "travel-lifestyle",
    archiveTitle: "🌍 Travel & Lifestyle",
    displayTitle: "TRAVEL & LIFESTYLE",
  },
  {
    slug: "gifts-roundups",
    archiveTitle: "🛍 Gifts & Product Roundups",
    displayTitle: "GIFTS & PRODUCT ROUNDUPS",
  },
  {
    slug: "business-entrepreneurship",
    archiveTitle: "🏆 Business & Entrepreneurship",
    displayTitle: "BUSINESS & ENTREPRENEURSHIP",
  },
] as const;

const SLUG_SET = new Set<string>(PRESS_CATEGORY_META.map((m) => m.slug));

export function isPressCategorySlug(value: string): value is PressCategorySlug {
  return SLUG_SET.has(value);
}

export function getPressCategoryMeta(slug: string): PressCategoryMeta | undefined {
  return PRESS_CATEGORY_META.find((m) => m.slug === slug);
}

export function getPressCategoryBySlug(slug: string): PressCategory | undefined {
  const meta = getPressCategoryMeta(slug);
  if (!meta) return undefined;
  const { topicCategories } = buildPressArchiveLayout();
  return topicCategories.find((c) => c.title === meta.archiveTitle);
}

export function getPressCategoryImage(slug: PressCategorySlug) {
  const meta = getPressCategoryMeta(slug);
  if (!meta) return undefined;
  return PRESS_CATEGORY_IMAGES[meta.archiveTitle];
}

export function pressCategoryPath(slug: PressCategorySlug): string {
  return `/pages/press/category/${slug}`;
}
