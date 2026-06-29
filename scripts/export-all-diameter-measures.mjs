/**
 * Re-export all product diameter measure PNGs (large labels).
 * Run: node scripts/export-all-diameter-measures.mjs
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SCRIPTS = [
  "export-lite-18-diameter.mjs",
  "export-lifestyle-44-diameter.mjs",
  "export-large-60-diameter.mjs",
  "export-traveler-20-diameter.mjs",
  "export-defender-diameter.mjs",
  "export-cosmo-diameter.mjs",
];

function runScript(name) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [path.join(__dirname, name)], {
      cwd: ROOT,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${name} failed with code ${code}`));
    });
  });
}

async function main() {
  for (const script of SCRIPTS) {
    console.log(`\n▶ ${script}`);
    await runScript(script);
  }
  console.log("\nAll diameter measures exported.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
