import {
  PRESS_ARCHIVE_SECTIONS,
  type PressArticle,
  type PressCategory,
} from "@/data/pressArchive";

const TOPIC_CATEGORY_TITLES = new Set([
  "🌍 Travel & Lifestyle",
  "🛍 Gifts & Product Roundups",
  "🏆 Business & Entrepreneurship",
]);

export const PRESS_ARCHIVE_YEARS = [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011] as const;

export type PressArchiveYear = (typeof PRESS_ARCHIVE_YEARS)[number];

export function articleKey(article: PressArticle): string {
  return `${article.href ?? ""}|${article.title}|${article.date}`;
}

export function parseArticleYear(date: string): number | null {
  const match = date.match(/\b(20\d{2})\b/);
  if (!match) return null;
  return Number(match[1]);
}

function isTopicCategory(title: string): boolean {
  return TOPIC_CATEGORY_TITLES.has(title);
}

export type PressArchiveLayout = {
  topicCategories: PressCategory[];
  articlesByYear: Record<PressArchiveYear, PressArticle[]>;
};

export function buildPressArchiveLayout(): PressArchiveLayout {
  const topicCategories: PressCategory[] = [];
  const topicKeys = new Set<string>();
  const articlesByYear = Object.fromEntries(
    PRESS_ARCHIVE_YEARS.map((y) => [y, [] as PressArticle[]]),
  ) as Record<PressArchiveYear, PressArticle[]>;
  const seenYearKeys = new Set<string>();

  for (const section of PRESS_ARCHIVE_SECTIONS) {
    for (const category of section.categories) {
      if (isTopicCategory(category.title)) {
        topicCategories.push(category);
        for (const article of category.articles) {
          topicKeys.add(articleKey(article));
        }
      }
    }
  }

  const addToYear = (article: PressArticle) => {
    if (topicKeys.has(articleKey(article))) return;
    const year = parseArticleYear(article.date);
    if (!year || year < 2011 || year > 2018) return;
    const key = articleKey(article);
    if (seenYearKeys.has(key)) return;
    seenYearKeys.add(key);
    articlesByYear[year as PressArchiveYear].push(article);
  };

  for (const section of PRESS_ARCHIVE_SECTIONS) {
    for (const category of section.categories) {
      if (isTopicCategory(category.title)) continue;
      for (const article of category.articles) {
        addToYear(article);
      }
    }
  }

  return { topicCategories, articlesByYear };
}
