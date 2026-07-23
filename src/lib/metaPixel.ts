/** Meta Pixel / Dataset ID (Events Manager). */
export const META_PIXEL_ID = "317484505801181";

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

function fbq(): Fbq | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { fbq?: Fbq }).fbq;
}

/** Fire a Meta standard or custom event when the pixel is available. */
export function trackMeta(event: string, params?: Record<string, unknown>, custom = false) {
  const pixel = fbq();
  if (!pixel) return;
  if (custom) {
    pixel("trackCustom", event, params ?? {});
  } else {
    pixel("track", event, params ?? {});
  }
}

/** SPA route change — Meta needs an explicit PageView (base snippet only covers first load). */
export function trackMetaPageView() {
  trackMeta("PageView");
}
