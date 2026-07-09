type Item = {
  item_id: string;
  item_name: string;
  price?: number;
  item_variant?: string;
  item_category?: string;
  quantity?: number;
  index?: number;
};

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: name, ...params });
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, params);
  }
}

export const viewItem = (i: Item) =>
  trackEvent("view_item", { currency: "USD", value: i.price ?? 0, items: [i] });

export const viewItemList = (items: Item[], listName: string) =>
  trackEvent("view_item_list", { item_list_name: listName, items });

export const selectItem = (i: Item, listName: string) =>
  trackEvent("select_item", { item_list_name: listName, items: [i] });

export const addToCart = (i: Item) => {
  const q = i.quantity ?? 1;
  trackEvent("add_to_cart", { currency: "USD", value: (i.price ?? 0) * q, items: [{ ...i, quantity: q }] });
};

export const viewCart = (items: Item[], value: number) =>
  trackEvent("view_cart", { currency: "USD", value, items });

export const beginCheckout = (items: Item[], value: number) =>
  trackEvent("begin_checkout", { currency: "USD", value, items });

export const searchEvent = (term: string) => trackEvent("search", { search_term: term });

export const generateLead = () => trackEvent("generate_lead", { currency: "USD", value: 0 });

export type { Item };
