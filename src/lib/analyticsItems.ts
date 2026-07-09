import type { Item } from "@/lib/analytics";
import type { CartItem } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

export function variantLabel(
  selectedOptions: Array<{ name: string; value: string }>,
): string | undefined {
  const color = selectedOptions.find((o) => /color|colour/i.test(o.name))?.value;
  if (color) return color;
  const nonDefault = selectedOptions.filter((o) => o.value && o.value !== "Default Title");
  return nonDefault.map((o) => o.value).join(" / ") || undefined;
}

export function productNodeToItem(
  node: ShopifyProduct["node"],
  options?: {
    index?: number;
    item_category?: string;
    item_variant?: string;
    price?: number;
    quantity?: number;
  },
): Item {
  return {
    item_id: node.handle,
    item_name: node.title,
    price: options?.price ?? parseFloat(node.priceRange.minVariantPrice.amount),
    item_category: options?.item_category ?? node.tags[0],
    item_variant: options?.item_variant,
    quantity: options?.quantity,
    index: options?.index,
  };
}

export function cartItemsToAnalyticsItems(items: CartItem[]): Item[] {
  return items.map((item, index) => ({
    item_id: item.product.node.handle,
    item_name: item.product.node.title,
    price: parseFloat(item.price.amount),
    item_variant: variantLabel(item.selectedOptions),
    item_category: item.product.node.tags[0],
    quantity: item.quantity,
    index,
  }));
}
