import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { createReviewApiMiddleware } from "../server/reviewApiMiddleware";
import { createContactApiMiddleware } from "../server/contactApiMiddleware";
import { createDiscountApiMiddleware } from "../server/discountApiMiddleware";

export function reviewApiPlugin(): Plugin {
  return {
    name: "review-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createContactApiMiddleware(env));
      server.middlewares.use(createDiscountApiMiddleware(env));
      server.middlewares.use(createReviewApiMiddleware(env));
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createContactApiMiddleware(env));
      server.middlewares.use(createDiscountApiMiddleware(env));
      server.middlewares.use(createReviewApiMiddleware(env));
    },
  };
}
