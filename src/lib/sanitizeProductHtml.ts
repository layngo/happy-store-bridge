import DOMPurify from "dompurify";

/** Plain function (not a hook) — safe to call after loading/product guards. */
export function sanitizeProductDescription(description: string): string {
  if (!/<[a-z][\s\S]*>/i.test(description)) return "";
  return DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [
      "a", "p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "div",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
}
