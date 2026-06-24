/** Rough fill when no fabric swatch image exists (never use Shopify variant photos: those are bag heroes). */
export function colorNameToApproximateHex(value: string): string {
  const key = value.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "#111111",
    white: "#f5f5f5",
    gray: "#8b8b8b",
    grey: "#8b8b8b",
    silver: "#b6b6b6",
    charcoal: "#44464d",
    navy: "#223049",
    blue: "#4b5f8c",
    red: "#b23b3b",
    pink: "#d58aa4",
    rose: "#cf8ea3",
    green: "#7e9880",
    olive: "#879173",
    tan: "#c0aa8a",
    beige: "#d3c5ad",
    brown: "#7c6653",
    purple: "#7a6e9c",
    teal: "#5e8c8c",
    orange: "#d08a4d",
    yellow: "#d6be67",
    gold: "#c3a86f",
    clear: "#d9d9d9",
    leopard: "#b8956a",
    paisley: "#2d4a6f",
    "tan check": "#c4b59a",
    "violet femme": "#7A89E8",
    "dorothys slipper": "#DC2626",
    "dorothy's slipper (red)": "#DC2626",
    "what a doll": "#E6007E",
    "what a doll (pink)": "#E6007E",
    "pretty in paisley": "#b84d8e",
  };
  if (map[key]) return map[key];
  const first = key.split(/[\s(/]+/)[0];
  if (first && map[first]) return map[first];
  return "#9aa3b2";
}
