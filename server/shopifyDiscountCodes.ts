const ADMIN_API_VERSION = "2025-07";

const CREATE_DISCOUNT_MUTATION = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message }
    }
  }
`;

export type CreateDiscountCodeOptions = {
  code: string;
  title: string;
  percentage: number;
  validDays: number;
};

export type CreateDiscountCodeResult =
  | { ok: true; shopifyId: string }
  | { ok: false; error: string };

function generatePopupCode(): string {
  return `LNG${Math.floor(100000 + Math.random() * 900000)}`;
}

export function generateUniqueDiscountCode(prefix: "LNG" | "LNR" = "LNG"): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${suffix}`;
}

export async function createShopifyDiscountCode(
  options: CreateDiscountCodeOptions,
  env: Record<string, string>,
): Promise<CreateDiscountCodeResult> {
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const shop = env.SHOPIFY_STORE_DOMAIN || "layngo-new.myshopify.com";

  if (!token) {
    return {
      ok: false,
      error: "Shopify discount creation is not configured.",
    };
  }

  const startsAt = new Date().toISOString();
  const endsAt = new Date(Date.now() + options.validDays * 24 * 60 * 60 * 1000).toISOString();

  const response = await fetch(`https://${shop}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      query: CREATE_DISCOUNT_MUTATION,
      variables: {
        basicCodeDiscount: {
          title: options.title,
          code: options.code,
          startsAt,
          endsAt,
          customerSelection: { all: true },
          customerGets: {
            value: { percentage: options.percentage },
            items: { all: true },
          },
          usageLimit: 1,
          appliesOncePerCustomer: true,
        },
      },
    }),
  });

  if (!response.ok) {
    return { ok: false, error: "Could not reach Shopify to create your discount code." };
  }

  const payload = (await response.json()) as {
    data?: {
      discountCodeBasicCreate?: {
        codeDiscountNode?: { id: string } | null;
        userErrors?: Array<{ field?: string[]; message: string }>;
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    return { ok: false, error: payload.errors.map((e) => e.message).join(", ") };
  }

  const result = payload.data?.discountCodeBasicCreate;
  const userErrors = result?.userErrors ?? [];
  if (userErrors.length) {
    return { ok: false, error: userErrors.map((e) => e.message).join(", ") };
  }

  const shopifyId = result?.codeDiscountNode?.id;
  if (!shopifyId) {
    return { ok: false, error: "Shopify did not create the discount code." };
  }

  return { ok: true, shopifyId };
}

export async function createPopupSignupDiscount(
  env: Record<string, string>,
  code = generatePopupCode(),
): Promise<CreateDiscountCodeResult & { code: string }> {
  const result = await createShopifyDiscountCode(
    {
      code,
      title: `Popup signup ${code}`,
      percentage: 0.15,
      validDays: 30,
    },
    env,
  );

  if (!result.ok) {
    return { ...result, code };
  }

  return { ...result, code };
}
