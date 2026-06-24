/** Normalize raw Shopify option values for display (e.g. lowercase variant titles). */
export function normalizeOptionValueLabel(rawValue: string): string {
  const value = (rawValue ?? "").trim();
  if (value.toLowerCase() === "crossmarks") return "CrossMarks";
  return value;
}