export type PressPublicationLogo = {
  src: string;
  alt: string;
};

/** Publication logos for gifts & roundups category rows. */
export const PRESS_PUBLICATION_LOGOS: Record<string, PressPublicationLogo> = {
  "Oprah Daily": {
    src: "/press/logos/oprah-daily.png",
    alt: "Oprah Daily",
  },
  "Good Housekeeping": {
    src: "/press/logos/good-housekeeping.png",
    alt: "Good Housekeeping",
  },
  "Grazia ME": {
    src: "/press/logos/grazia-me.png",
    alt: "Grazia ME",
  },
  People: {
    src: "/press/logos/people.png",
    alt: "People",
  },
  Parents: {
    src: "/press/logos/parents.png",
    alt: "Parents",
  },
  Lifehacker: {
    src: "/press/logos/lifehacker.png",
    alt: "Lifehacker",
  },
  RedTri: {
    src: "/press/logos/redtri.png",
    alt: "RedTri",
  },
  "Consumer Reports": {
    src: "/press/logos/consumer-reports.png",
    alt: "Consumer Reports",
  },
  BuzzFeed: {
    src: "/press/logos/buzzfeed.png",
    alt: "BuzzFeed",
  },
  "Elvis Duran / iHeart": {
    src: "/press/logos/iheart.png",
    alt: "Elvis Duran on iHeartRadio",
  },
  "Gizmodo AU": {
    src: "/press/logos/gizmodo-au.png",
    alt: "Gizmodo Australia",
  },
};

const PLACEHOLDER_DATE_PATTERN = /^(various|people\.com)$/i;

export function getPressPublicationLogo(publication: string): PressPublicationLogo | undefined {
  return PRESS_PUBLICATION_LOGOS[publication];
}

/** Real calendar dates only — hides legacy “Various” / “People.com” placeholders. */
export function formatPressArticleDate(date: string): string | null {
  const trimmed = date.trim();
  if (!trimmed || PLACEHOLDER_DATE_PATTERN.test(trimmed)) return null;
  if (/\b(20\d{2}|19\d{2})\b/.test(trimmed) || /^[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}/.test(trimmed)) {
    return trimmed;
  }
  return null;
}
