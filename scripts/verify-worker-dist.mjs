import { existsSync } from "node:fs";

if (!existsSync("worker-dist/index.js")) {
  console.error(
    "Missing worker-dist/index.js. Run `npm run build` before deploy (compiles API routes + static assets).",
  );
  process.exit(1);
}

if (!existsSync("dist/index.html")) {
  console.error("Missing dist/index.html. Run `npm run build` before deploy.");
  process.exit(1);
}
