/// <reference types="vite/client" />

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  _fbq?: (...args: unknown[]) => void;
}
