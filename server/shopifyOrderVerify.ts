import { createVerificationToken } from "./reviewSessions";

const ADMIN_API_VERSION = "2025-07";

const VERIFY_ORDER_QUERY = `
  query VerifyOrder($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          cancelledAt
          lineItems(first: 50) {
            edges {
              node {
                product {
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type VerifyOrderResult =
  | { ok: true; orderName: string; verificationToken: string }
  | { ok: false; error: string };

function normalizeOrderNumber(raw: string): string {
  return raw.replace(/^#/, "").trim();
}

export async function verifyShopifyOrder(
  orderNumber: string,
  productHandle: string | undefined,
  env: Record<string, string>,
): Promise<VerifyOrderResult> {
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shop = env.SHOPIFY_STORE_DOMAIN || "layngo-new.myshopify.com";

  if (!token) {
    return {
      ok: false,
      error:
        "Order verification is not configured. Add SHOPIFY_ADMIN_ACCESS_TOKEN to your environment.",
    };
  }

  const normalized = normalizeOrderNumber(orderNumber);
  if (!normalized) {
    return { ok: false, error: "Please enter your order number." };
  }

  const query = `name:${normalized}`;

  const response = await fetch(`https://${shop}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      query: VERIFY_ORDER_QUERY,
      variables: { query },
    }),
  });

  if (!response.ok) {
    return { ok: false, error: "Could not reach Shopify to verify your order. Try again later." };
  }

  const payload = (await response.json()) as {
    data?: {
      orders?: {
        edges?: Array<{
          node?: {
            id: string;
            name: string;
            cancelledAt: string | null;
            lineItems?: { edges?: Array<{ node?: { product?: { handle?: string } | null } }> };
          };
        }>;
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    return { ok: false, error: payload.errors.map((e) => e.message).join(", ") };
  }

  const order = payload.data?.orders?.edges?.[0]?.node;
  if (!order) {
    return { ok: false, error: "We couldn't find an order with that number. Check and try again." };
  }

  if (order.cancelledAt) {
    return { ok: false, error: "That order was cancelled and can't be used for a review." };
  }

  if (productHandle) {
    const handles = (order.lineItems?.edges ?? [])
      .map((e) => e.node?.product?.handle)
      .filter(Boolean) as string[];
    const wanted = productHandle.toLowerCase();
    const matches = handles.some((h) => h.toLowerCase() === wanted);
    if (!matches) {
      return {
        ok: false,
        error: "That order doesn't include this product. You can only review items you purchased.",
      };
    }
  }

  const verificationToken = createVerificationToken({
    orderName: order.name,
    productHandle: productHandle ?? "",
  });

  return { ok: true, orderName: order.name, verificationToken };
}
