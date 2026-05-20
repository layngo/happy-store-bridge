import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { createReviewApiMiddleware } from "../server/reviewApiMiddleware";

export function reviewApiPlugin(): Plugin {
  return {
    name: "review-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createReviewApiMiddleware(env));
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(createReviewApiMiddleware(env));
    },
  };
}
