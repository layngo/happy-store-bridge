import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/checkoutUrl";

export const GA_MEASUREMENT_ID = "G-5157VW2ENR";

const GTAG_GET_TIMEOUT_MS = 2000;

type GtagGetField = "linker_param" | "client_id" | "session_id";

function getGtagValue(field: GtagGetField): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window.gtag !== "function") {
      resolve(null);
      return;
    }

    let settled = false;
    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, GTAG_GET_TIMEOUT_MS);

    window.gtag!("get", GA_MEASUREMENT_ID, field, (value: unknown) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(typeof value === "string" && value.trim() ? value.trim() : null);
    });
  });
}

/** Apply GA linker output (`_gl=…` or raw value) onto a checkout URL. */
function applyLinkerParamToUrl(checkoutUrl: string, linkerParam: string): string {
  const url = new URL(checkoutUrl);

  if (linkerParam.startsWith("_gl=")) {
    url.searchParams.set("_gl", linkerParam.slice(4));
    return url.toString();
  }

  if (linkerParam.includes("=")) {
    const query = linkerParam.startsWith("?") ? linkerParam.slice(1) : linkerParam;
    for (const [key, value] of new URLSearchParams(query)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  }

  url.searchParams.set("_gl", linkerParam);
  return url.toString();
}

/** Manual _gl when linker_param is unavailable (client + session IDs from gtag). */
function buildManualGlParam(clientId: string, sessionId: string | null): string {
  if (sessionId) {
    return `1*${clientId}*${sessionId}*`;
  }
  return `1*${clientId}*`;
}

/**
 * Append GA4 cross-domain linker data to a Shopify checkout URL so the
 * myshopify.com session can be tied back to layngo.com analytics.
 */
export async function decorateCheckoutUrlWithGaLinker(checkoutUrl: string): Promise<string> {
  try {
    const parsed = new URL(checkoutUrl);
    if (parsed.hostname !== SHOPIFY_STORE_PERMANENT_DOMAIN) {
      return checkoutUrl;
    }

    const linkerParam = await getGtagValue("linker_param");
    if (linkerParam) {
      return applyLinkerParamToUrl(checkoutUrl, linkerParam);
    }

    const [clientId, sessionId] = await Promise.all([
      getGtagValue("client_id"),
      getGtagValue("session_id"),
    ]);

    if (clientId) {
      parsed.searchParams.set("_gl", buildManualGlParam(clientId, sessionId));
      return parsed.toString();
    }
  } catch {
    // Fall through to the unmodified URL.
  }

  return checkoutUrl;
}
