import { getGtagField } from "@/lib/gaAnalytics";

function appendGlParam(url: URL, glValue: string): string {
  const normalized = glValue.startsWith("_gl=") ? glValue.slice(4) : glValue;
  if (normalized) {
    url.searchParams.set("_gl", normalized);
  }
  return url.toString();
}

/** Build `_gl` from GA4 client/session IDs when the linker decorator is unavailable. */
function buildGlFromClientSession(clientId: string, sessionId: string | null): string {
  const normalize = (value: string) => value.replace(/\./g, "_");
  let gl = `1*${normalize(clientId)}`;
  if (sessionId) {
    gl += `*_${normalize(sessionId)}`;
  }
  return gl;
}

/**
 * Ask gtag to decorate a hidden form action (uses `linker.domains` from gtag config).
 * Returns the `_gl` input value when decoration succeeds.
 */
function getLinkerParamViaFormDecoration(targetUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }

    const form = document.createElement("form");
    form.action = targetUrl;
    form.method = "get";
    form.style.cssText = "position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
    form.addEventListener("submit", (event) => event.preventDefault());

    const button = document.createElement("button");
    button.type = "submit";
    form.append(button);
    document.body.append(form);

    window.requestAnimationFrame(() => {
      button.click();
      const glInput = form.querySelector('input[name="_gl"]');
      const glValue =
        glInput instanceof HTMLInputElement && glInput.value.trim()
          ? glInput.value.trim()
          : null;
      form.remove();
      resolve(glValue);
    });
  });
}

/**
 * Append GA4 cross-domain `_gl` linker params to a Shopify checkout URL.
 *
 * Tries, in order:
 * 1. `gtag('get', …, 'linker_param')` when supported
 * 2. Hidden form decoration (gtag auto-linker on linked domains)
 * 3. Manual `_gl` from `client_id` + `session_id`
 */
export async function decorateCheckoutUrlWithGaLinker(checkoutUrl: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(checkoutUrl);
  } catch {
    return checkoutUrl;
  }

  if (url.searchParams.has("_gl")) {
    return url.toString();
  }

  const linkerParam = await getGtagField("linker_param");
  if (linkerParam) {
    return appendGlParam(url, linkerParam);
  }

  const formGl = await getLinkerParamViaFormDecoration(url.toString());
  if (formGl) {
    return appendGlParam(new URL(checkoutUrl), formGl);
  }

  const [clientId, sessionId] = await Promise.all([
    getGtagField("client_id"),
    getGtagField("session_id"),
  ]);

  if (clientId) {
    return appendGlParam(url, buildGlFromClientSession(clientId, sessionId));
  }

  return checkoutUrl;
}
