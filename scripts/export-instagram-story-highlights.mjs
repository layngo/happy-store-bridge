/**
 * Export Instagram story highlight covers (1080×1080).
 * Run: node scripts/export-instagram-story-highlights.mjs
 */

import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const py = spawnSync("python3", [path.join(__dirname, "build-instagram-story-highlights.py")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (py.status !== 0) process.exit(py.status ?? 1);

const tactical = spawnSync("node", [path.join(__dirname, "export-instagram-highlight-tactical.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(tactical.status ?? 0);
