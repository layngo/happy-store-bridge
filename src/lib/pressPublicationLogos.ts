export type PressPublicationLogo = {
  src: string;
  alt: string;
};

/** Publication logos for press category article rows. */
export const PRESS_PUBLICATION_LOGOS: Record<string, PressPublicationLogo> = {
  "Condé Nast Traveler": {
    src: "/press/logos/cntraveler.png",
    alt: "Condé Nast Traveler",
  },
  GoNomad: {
    src: "/press/logos/gonomad.png",
    alt: "GoNomad",
  },
  "TODAY / Bobbie Thomas": {
    src: "/press/logos/today.png",
    alt: "TODAY",
  },
  "Inc. Magazine": {
    src: "/press/logos/inc.png",
    alt: "Inc. Magazine",
  },
  "The Female Founder Show / ASBN": {
    src: "/press/logos/asbn.png",
    alt: "The Female Founder Show on ASBN",
  },
  "Women Who Own It": {
    src: "/press/logos/women-owned.png",
    alt: "Women Who Own It",
  },
  "U.S. Chamber of Commerce / CO—": {
    src: "/press/logos/us-chamber-co.png?v=2",
    alt: "CO— by U.S. Chamber of Commerce",
  },
  "Good Morning America": {
    src: "/press/logos/gma.png",
    alt: "Good Morning America Deals and Steals",
  },
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

/** Extra name variants that share a mapped logo file. */
const PRESS_PUBLICATION_LOGO_ALIASES: Record<string, keyof typeof PRESS_PUBLICATION_LOGOS> = {
  "BuzzFeed / QVC": "BuzzFeed",
  "Elvis Duran Show": "Elvis Duran / iHeart",
  "TODAY Show (Hoda & Kathie Lee)": "TODAY / Bobbie Thomas",
  Gizmodo: "Gizmodo AU",
};

export function getPressPublicationLogo(publication: string): PressPublicationLogo | undefined {
  return (
    PRESS_PUBLICATION_LOGOS[publication] ??
    (PRESS_PUBLICATION_LOGO_ALIASES[publication]
      ? PRESS_PUBLICATION_LOGOS[PRESS_PUBLICATION_LOGO_ALIASES[publication]]
      : undefined)
  );
}

function domainFromHref(href: string | undefined): string | null {
  if (!href) return null;
  try {
    const host = new URL(href).hostname.replace(/^www\./i, "");
    if (!host || host === "drive.google.com") return null;
    return host;
  } catch {
    return null;
  }
}

/** Curated logos first; otherwise derive a favicon from the article URL (archive year pages). */
export function resolvePressPublicationLogo(
  publication: string,
  href?: string,
): PressPublicationLogo | undefined {
  const mapped = getPressPublicationLogo(publication);
  if (mapped) return mapped;

  const domain = domainFromHref(href);
  if (!domain) return undefined;

  return {
    src: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    alt: publication,
  };
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
