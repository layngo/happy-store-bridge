import { trackMeta } from "@/lib/metaPixel";

type Item = {
  item_id: string;
  item_name: string;
  price?: number;
  item_variant?: string;
  item_category?: string;
  quantity?: number;
  index?: number;
};

function contentIds(items: Item[]): string[] {
  return items.map((i) => i.item_id).filter(Boolean);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as Window & { dataLayer?: unknown[] }).dataLayer =
    (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
  (window as Window & { dataLayer?: unknown[] }).dataLayer!.push({ event: name, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export const viewItem = (i: Item) => {
  trackEvent("view_item", { currency: "USD", value: i.price ?? 0, items: [i] });
  trackMeta("ViewContent", {
    content_ids: [i.item_id],
    content_name: i.item_name,
    content_type: "product",
    content_category: i.item_category,
    value: i.price ?? 0,
    currency: "USD",
  });
};

export const viewItemList = (items: Item[], listName: string) => {
  trackEvent("view_item_list", { item_list_name: listName, items });
  trackMeta(
    "ViewItemList",
    {
      content_ids: contentIds(items),
      content_type: "product",
      content_name: listName,
    },
    true,
  );
};

export const selectItem = (i: Item, listName: string) => {
  trackEvent("select_item", { item_list_name: listName, items: [i] });
  trackMeta(
    "SelectItem",
    {
      content_ids: [i.item_id],
      content_name: i.item_name,
      content_type: "product",
      content_category: listName,
    },
    true,
  );
};

export const addToCart = (i: Item) => {
  const q = i.quantity ?? 1;
  const value = (i.price ?? 0) * q;
  trackEvent("add_to_cart", { currency: "USD", value, items: [{ ...i, quantity: q }] });
  trackMeta("AddToCart", {
    content_ids: [i.item_id],
    content_name: i.item_name,
    content_type: "product",
    value,
    currency: "USD",
    contents: [{ id: i.item_id, quantity: q, item_price: i.price ?? 0 }],
  });
};

export const viewCart = (items: Item[], value: number) => {
  trackEvent("view_cart", { currency: "USD", value, items });
  trackMeta(
    "ViewCart",
    {
      content_ids: contentIds(items),
      content_type: "product",
      value,
      currency: "USD",
      num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
    },
    true,
  );
};

export const beginCheckout = (items: Item[], value: number) => {
  trackEvent("begin_checkout", { currency: "USD", value, items });
  trackMeta("InitiateCheckout", {
    content_ids: contentIds(items),
    content_type: "product",
    value,
    currency: "USD",
    num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
    contents: items.map((i) => ({
      id: i.item_id,
      quantity: i.quantity ?? 1,
      item_price: i.price ?? 0,
    })),
  });
};

export const searchEvent = (term: string) => {
  trackEvent("search", { search_term: term });
  trackMeta("Search", { search_string: term });
};

export const generateLead = () => {
  trackEvent("generate_lead", { currency: "USD", value: 0 });
  trackMeta("Lead", { currency: "USD", value: 0 });
};

export type { Item };
