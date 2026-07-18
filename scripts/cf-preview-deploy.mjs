/**
 * Non-production Workers Builds deploy:
 * upload a Worker version (preview) without promoting production.
 *
 * Preview aliases must be DNS-safe (no `/` from branch names like cursor/…).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync("worker-dist/index.js")) {
  fail(
    "Missing worker-dist/index.js. Run `npm run build` before preview deploy.",
  );
}

if (!existsSync("dist/index.html")) {
  fail("Missing dist/index.html. Run `npm run build` before preview deploy.");
}

function sanitizePreviewAlias(branch) {
  const cleaned = String(branch || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
  if (!cleaned) return "preview";
  // Aliases must begin with a lowercase letter.
  return /^[a-z]/.test(cleaned) ? cleaned : `b-${cleaned}`.slice(0, 63);
}

const branch = process.env.WORKERS_CI_BRANCH || "";
const alias = sanitizePreviewAlias(branch);
const args = ["wrangler", "versions", "upload", "--preview-alias", alias];

console.log(
  `Uploading Workers preview version (alias=${alias}${branch ? `, branch=${branch}` : ""})…`,
);

const result = spawnSync("npx", args, { stdio: "inherit", shell: false });
if (result.error) {
  fail(result.error.message);
}
process.exit(result.status ?? 1);
