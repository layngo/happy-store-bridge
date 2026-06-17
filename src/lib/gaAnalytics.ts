export const GA_MEASUREMENT_ID = "G-5157VW2ENR";

type GtagGettableField = "client_id" | "session_id" | "linker_param";

const GTAG_GET_TIMEOUT_MS = 2000;

/** Read a field from gtag via `gtag('get', …, callback)`. */
export function getGtagField(field: GtagGettableField): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window.gtag !== "function") {
      resolve(null);
      return;
    }

    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(value);
    };

    const timeout = window.setTimeout(() => finish(null), GTAG_GET_TIMEOUT_MS);

    try {
      window.gtag("get", GA_MEASUREMENT_ID, field, (value: string | undefined) => {
        finish(value?.trim() ? value.trim() : null);
      });
    } catch {
      finish(null);
    }
  });
}
