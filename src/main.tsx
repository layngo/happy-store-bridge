import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { redirectHeadlessCheckoutEntry } from "./lib/checkoutUrl.ts";
import "./index.css";

redirectHeadlessCheckoutEntry();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
